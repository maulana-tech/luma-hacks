import { ethers } from "ethers";
import { getSignedContract } from "./contracts";

export interface X402Options {
  agentAddress: string;
  price: string;
  description: string;
}

export interface PaymentRequirement {
  version: string;
  network: string;
  chainId: number;
  token: string;
  tokenAddress: string;
  amount: string;
  decimals: number;
  recipient: string;
  description: string;
  expiresAt: number;
  // Optional: if set, clients can pay via the processor (approve + pay) to emit a receipt event.
  paymentProcessor?: string;
  // Deterministic request id (can be used in PaymentProcessor receipts)
  requestId?: string;
}

export function buildPaymentRequired(options: X402Options): PaymentRequirement {
  const chainId = Number(process.env.AVALANCHE_CHAIN_ID || 43113);
  const network =
    process.env.X402_NETWORK || (chainId === 43113 ? "avalanche-fuji" : "local");

  const expiresAt = Math.floor(Date.now() / 1000) + 600;
  const tokenAddress =
    process.env.USDC_CONTRACT_ADDRESS || "0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4";
  const amount = ethers.parseUnits(options.price, 6).toString();

  // Deterministic id so the server can recompute without storing session state.
  const requestId = ethers.solidityPackedKeccak256(
    ["address", "address", "uint256", "uint256"],
    [options.agentAddress, tokenAddress, amount, expiresAt]
  );

  const paymentProcessor = process.env.PAYMENT_PROCESSOR_CONTRACT;

  return {
    version: "1.0",
    network,
    chainId,
    token: "USDC",
    tokenAddress,
    amount,
    decimals: 6,
    recipient: options.agentAddress,
    description: options.description,
    expiresAt,
    ...(paymentProcessor ? { paymentProcessor } : {}),
    requestId,
  };
}

export async function verifyPaymentOnChain(
  proof: { txHash: string; recipient: string; amount: string; tokenAddress: string },
  options: X402Options
): Promise<boolean> {
  try {
    const provider = new ethers.JsonRpcProvider(
      process.env.AVALANCHE_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc"
    );

    const tx = await provider.getTransaction(proof.txHash);
    if (!tx) return false;

    const receipt = await provider.getTransactionReceipt(proof.txHash);
    if (!receipt || receipt.status !== 1) return false;

    const expectedAmount = ethers.parseUnits(options.price, 6);
    const expectedRecipient = options.agentAddress.toLowerCase();

    if (tx.to?.toLowerCase() !== expectedRecipient) {
      const USDC_ABI = [
        "function transfer(address to, uint256 amount) returns (bool)",
        "event Transfer(address indexed from, address indexed to, uint256 value)",
      ];
      const usdcContract = new ethers.Contract(
        proof.tokenAddress || process.env.USDC_CONTRACT_ADDRESS!,
        USDC_ABI,
        provider
      );

      const transferEvent = receipt.logs
        .map((log) => {
          try {
            return usdcContract.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find(
          (e) =>
            e &&
            e.name === "Transfer" &&
            e.args?.to?.toLowerCase() === expectedRecipient &&
            e.args?.value !== undefined
        );

      if (!transferEvent) return false;
      if (transferEvent.args.value < expectedAmount) return false;
    }

    return true;
  } catch (error) {
    console.error("Payment verification failed:", error);
    return false;
  }
}

export async function recordSuccessfulTx(agentAddress: string, amount: string) {
  try {
    const contract = getSignedContract();
    const tx = await contract.recordSuccessfulTx(
      agentAddress,
      ethers.parseUnits(amount, 6)
    );
    await tx.wait();
    console.log(`Reputation updated for ${agentAddress}`);
  } catch (error) {
    console.error("Failed to update reputation:", error);
  }
}
