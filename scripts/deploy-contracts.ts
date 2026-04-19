import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

function readArtifact(
  contractsDir: string,
  name: string
): { abi: ReadonlyArray<unknown>; bytecode: string } {
  const artifactPath = path.join(contractsDir, `${name}.json`);
  if (!fs.existsSync(artifactPath)) {
    throw new Error(
      `Artifact not found: ${artifactPath}. Run \`npm run compile\` first.`
    );
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8")) as {
    abi?: unknown;
    bytecode?: unknown;
  };
  const { abi, bytecode } = artifact;
  if (!Array.isArray(abi) || typeof bytecode !== "string") {
    throw new Error(`Invalid artifact for ${name} (missing abi/bytecode)`);
  }
  return { abi, bytecode };
}

async function main() {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);
  // Avoid nonce collisions with previously broadcast txs.
  let nonce = await provider.getTransactionCount(wallet.address, "pending");

  const net = await provider.getNetwork();
  const chainId = Number(net.chainId);

  const rootDir = path.join(__dirname, "..");
  const contractsDir = path.join(rootDir, "contracts");

  console.log(`Deploying from: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(balance)} AVAX`);
  console.log(`ChainId: ${chainId}`);

  if (balance === BigInt(0)) {
    console.error("No AVAX for gas. Get testnet AVAX at https://faucet.avax.network");
    process.exit(1);
  }

  const withMockUSDC =
    process.argv.includes("--with-mock-usdc") ||
    process.env.DEPLOY_MOCK_USDC === "true";

  const withPaymentProcessor =
    process.argv.includes("--with-payment-processor") ||
    process.env.DEPLOY_PAYMENT_PROCESSOR === "true";

  let usdcAddress: string | undefined = process.env.USDC_CONTRACT_ADDRESS;

  if (withMockUSDC) {
    console.log("\nDeploying MockUSDC...");
    const { abi, bytecode } = readArtifact(contractsDir, "MockUSDC");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy({ nonce: nonce++ });
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    usdcAddress = address;
    console.log(`MockUSDC deployed to: ${address}`);
    console.log(`Tx hash: ${contract.deploymentTransaction()?.hash}`);

    console.log(`\n# Local env (server + client):`);
    console.log(`USDC_CONTRACT_ADDRESS=${address}`);
    console.log(`NEXT_PUBLIC_USDC_ADDRESS=${address}`);
  } else {
    console.log("\nSkipping MockUSDC (pass --with-mock-usdc or set DEPLOY_MOCK_USDC=true)");
  }

  if (withPaymentProcessor) {
    console.log("\nDeploying PaymentProcessor...");
    const { abi, bytecode } = readArtifact(contractsDir, "PaymentProcessor");
    const tokenForProcessor = usdcAddress || "0x0000000000000000000000000000000000000000";
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(tokenForProcessor, { nonce: nonce++ });
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`PaymentProcessor deployed to: ${address}`);
    console.log(`Tx hash: ${contract.deploymentTransaction()?.hash}`);

    console.log(`\n# Add to env:`);
    console.log(`PAYMENT_PROCESSOR_CONTRACT=${address}`);
  } else {
    console.log(
      "\nSkipping PaymentProcessor (pass --with-payment-processor or set DEPLOY_PAYMENT_PROCESSOR=true)"
    );
  }

  console.log("\nDeploying AgentRegistry...");
  {
    const { abi, bytecode } = readArtifact(contractsDir, "AgentRegistry");
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy({ nonce: nonce++ });
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`\nAgentRegistry deployed to: ${address}`);
    console.log(`Tx hash: ${contract.deploymentTransaction()?.hash}`);

    console.log(`\n# Add to env:`);
    console.log(`AGENT_REGISTRY_CONTRACT=${address}`);

    if (chainId === 43113) {
      console.log(`\n# Verify on Snowtrace (Fuji):`);
      console.log(`# https://testnet.snowtrace.io/address/${address}`);
    }
  }
}

main().catch((err) => {
  console.error("Deploy failed:", err.message);
  process.exit(1);
});
