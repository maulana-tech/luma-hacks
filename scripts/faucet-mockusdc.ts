import { ethers } from "ethers";

const MOCK_USDC_ABI = [
  "function faucet(uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  const privateKey =
    process.env.USER_PRIVATE_KEY || process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) throw new Error("Set USER_PRIVATE_KEY or DEPLOYER_PRIVATE_KEY");

  const usdcAddress = process.env.USDC_CONTRACT_ADDRESS;
  if (!usdcAddress) throw new Error("Set USDC_CONTRACT_ADDRESS (MockUSDC address)");

  const amountStr = getArg("--amount") || "100";

  const wallet = new ethers.Wallet(privateKey, provider);
  const usdc = new ethers.Contract(usdcAddress, MOCK_USDC_ABI, wallet);

  const decimals = Number(await usdc.decimals());
  const amount = ethers.parseUnits(amountStr, decimals);

  console.log(`RPC: ${rpcUrl}`);
  console.log(`Wallet: ${wallet.address}`);
  console.log(`MockUSDC: ${usdcAddress}`);
  console.log(`Faucet amount: ${amountStr} (${amount.toString()} base units)`);

  const tx = await usdc.faucet(amount);
  console.log(`Tx: ${tx.hash}`);
  await tx.wait();

  const bal = await usdc.balanceOf(wallet.address);
  console.log(`Balance: ${ethers.formatUnits(bal, decimals)} mUSDC`);
}

main().catch((err) => {
  console.error("Faucet failed:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
