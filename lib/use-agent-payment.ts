"use client";

import { useAccount, useSendTransaction } from "wagmi";
import { parseUnits, encodeFunctionData } from "viem";

const USDC_ABI = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const USDC_ADDRESS = (process.env.NEXT_PUBLIC_USDC_ADDRESS ||
  "0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4") as `0x${string}`;

export function useAgentPayment() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  async function payAndCall(params: {
    agentEndpoint: string;
    recipientAddress: string;
    amount: string;
    payload: Record<string, unknown>;
  }): Promise<{ ok: boolean; data?: unknown; error?: string }> {
    if (!isConnected || !address) {
      return { ok: false, error: "Wallet not connected" };
    }

    try {
      const data = encodeFunctionData({
        abi: USDC_ABI,
        functionName: "transfer",
        args: [params.recipientAddress as `0x${string}`, parseUnits(params.amount, 6)],
      });

      const hash = await sendTransactionAsync({
        to: USDC_ADDRESS,
        data,
        value: BigInt(0),
      });

      const res = await fetch(params.agentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Payment-Proof": JSON.stringify({
            txHash: hash,
            recipient: params.recipientAddress,
            amount: parseUnits(params.amount, 6).toString(),
            tokenAddress: USDC_ADDRESS,
          }),
        },
        body: JSON.stringify(params.payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        return { ok: false, error: err.error || `HTTP ${res.status}` };
      }

      const result = await res.json();
      return { ok: true, data: result };
    } catch (error) {
      return { ok: false, error: String(error) };
    }
  }

  return { payAndCall, address, isConnected };
}
