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

  // Use pending nonce to avoid collisions with previously broadcast txs.
  let nonce = await provider.getTransactionCount(wallet.address, "pending");

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

      const target = agent.address;
      if (target.toLowerCase() === wallet.address.toLowerCase()) {
        const tx = await contract.registerAgent(agent.name, agent.serviceType, agent.metadataURI, {
          nonce: nonce++,
        });
        await tx.wait();
      } else {
        try {
          const tx = await contract.registerAgentFor(
            target,
            agent.name,
            agent.serviceType,
            agent.metadataURI,
            { nonce: nonce++ }
          );
          await tx.wait();
        } catch (error: unknown) {
          // If a previous run broadcasted the same signed tx, Anvil can reply "transaction already imported".
          // Try to resolve by waiting for it; if it never mines, restarting Anvil is the simplest fix.
          const msg = error instanceof Error ? error.message : String(error);
          if (msg.includes("transaction already imported")) {
            // @ts-expect-error - best-effort extraction across providers
            const raw = (error?.payload?.params?.[0] || error?.payload?.params?.[0]?.[0]) as
              | string
              | undefined;
            if (typeof raw === "string" && raw.startsWith("0x")) {
              const txHash = ethers.keccak256(raw as `0x${string}`);
              await provider.waitForTransaction(txHash, 1, 30_000).catch(() => null);
            }
          }
          throw error;
        }
      }

      console.log(`  ✓ ${agent.name} registered (${agent.address})`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes("Already registered")) {
        console.log(`  → ${agent.name} already registered, skipping`);
      } else if (msg.includes("transaction already imported")) {
        console.error(
          `  ✗ Failed to register ${agent.name}: tx already in mempool. If this is Anvil, restart anvil then re-run seed.`
        );
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
