import { ethers } from "ethers";
import * as path from "path";
import * as fs from "fs";

const AGENT_REGISTRY_ABI = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "contracts", "abis", "AgentRegistry.json"), "utf8")
) as Record<string, unknown>[];

async function main() {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const contractAddress = process.env.AGENT_REGISTRY_CONTRACT;
  if (!contractAddress) {
    throw new Error("AGENT_REGISTRY_CONTRACT not set in env");
  }

  const contract = new ethers.Contract(contractAddress, AGENT_REGISTRY_ABI, wallet);

  console.log(`Using contract at: ${contractAddress}`);
  console.log(`Wallet: ${wallet.address}\n`);

  const agents = [
    {
      name: "CodeReviewAgent",
      serviceType: "code-review",
      metadataURI: "ipfs://QmCodeReviewAgent",
      address: process.env.CODE_REVIEW_AGENT_ADDRESS || wallet.address,
    },
    {
      name: "SummarizerAgent",
      serviceType: "summarizer",
      metadataURI: "ipfs://QmSummarizerAgent",
      address: process.env.SUMMARIZER_AGENT_ADDRESS || wallet.address,
    },
    {
      name: "TranslatorAgent",
      serviceType: "translator",
      metadataURI: "ipfs://QmTranslatorAgent",
      address: process.env.TRANSLATOR_AGENT_ADDRESS || wallet.address,
    },
  ];

  for (const agent of agents) {
    try {
      console.log(`Registering ${agent.name}...`);
      const tx = await contract.registerAgent(agent.name, agent.serviceType, agent.metadataURI);
      await tx.wait();
      console.log(`  ✓ ${agent.name} registered (${agent.address})`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("Already registered")) {
        console.log(`  → ${agent.name} already registered, skipping`);
      } else {
        console.error(`  ✗ Failed to register ${agent.name}:`, msg);
      }
    }
  }

  const count = await contract.getAgentCount();
  console.log(`\nTotal agents registered: ${count}`);

  for (const agent of agents) {
    const profile = await contract.getAgent(agent.address);
    console.log(`\n${agent.name}:`);
    console.log(`  Reputation: ${profile.reputationScore}/1000`);
    console.log(`  Transactions: ${profile.totalTxCount}`);
    console.log(`  Active: ${profile.isActive}`);
  }
}

main().catch(console.error);
