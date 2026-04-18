import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  console.log(`Deploying from: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(balance)} AVAX`);

  if (balance === BigInt(0)) {
    console.error("No AVAX for gas. Get testnet AVAX at https://faucet.avax.network");
    process.exit(1);
  }

  const artifactPath = path.join(__dirname, "contracts", "AgentRegistry.json");
  if (!fs.existsSync(artifactPath)) {
    console.error("Artifact not found. Run `npx tsx contracts/compile.ts` first.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const { abi, bytecode } = artifact;

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  console.log("\nDeploying AgentRegistry...");

  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\nAgentRegistry deployed to: ${address}`);
  console.log(`Tx hash: ${contract.deploymentTransaction()?.hash}`);

  console.log(`\n# Add to .env.local:`);
  console.log(`AGENT_REGISTRY_CONTRACT=${address}`);

  console.log(`\n# Verify on Snowtrace:`);
  console.log(`# https://testnet.snowtrace.io/address/${address}`);
}

main().catch((err) => {
  console.error("Deploy failed:", err.message);
  process.exit(1);
});
