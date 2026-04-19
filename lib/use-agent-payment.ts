"use client";

import { useAccount, usePublicClient, useSendTransaction } from "wagmi";
import { encodeFunctionData } from "viem";

const ERC20_ABI = [
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
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

const PROCESSOR_ABI = [
  {
    name: "pay",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "requestId", type: "bytes32" },
      { name: "token", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
] as const;

export function useAgentPayment() {
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const publicClient = usePublicClient();

  async function payAndCall(params: {
    agentEndpoint: string;
    payload: Record<string, unknown>;
    maxBudget?: string;
  }): Promise<{ ok: boolean; data?: unknown; error?: string }> {
    if (!isConnected || !address) {
      return { ok: false, error: "Wallet not connected" };
    }

    try {
      // Probe for x402 requirement
      const probe = await fetch(params.agentEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params.payload),
      });

      if (probe.status !== 402) {
        const data = (await probe.json().catch(() => null)) as
          | null
          | { error?: string; [k: string]: unknown };
        if (!probe.ok) return { ok: false, error: data?.error || `HTTP ${probe.status}` };
        return { ok: true, data };
      }

      const required = await probe.json();
      const requirement = required?.["x-payment-required"] as
        | {
            tokenAddress: `0x${string}`;
            recipient: `0x${string}`;
            amount: string;
            decimals: number;
            paymentProcessor?: `0x${string}`;
            requestId?: `0x${string}`;
          }
        | undefined;

      if (!requirement) return { ok: false, error: "Missing x-payment-required" };

      // Optional budget check (human units)
      if (params.maxBudget) {
        const requiredAmount = Number(requirement.amount) / 10 ** (requirement.decimals ?? 6);
        if (requiredAmount > Number(params.maxBudget)) {
          return { ok: false, error: `Price ${requiredAmount} exceeds budget ${params.maxBudget}` };
        }
      }

      // Pay on-chain
      let paymentTxHash: `0x${string}`;
      if (requirement.paymentProcessor) {
        const approveData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "approve",
          args: [requirement.paymentProcessor, BigInt(requirement.amount)],
        });
        const approveHash = (await sendTransactionAsync({
          to: requirement.tokenAddress,
          data: approveData,
          value: BigInt(0),
        })) as `0x${string}`;
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: approveHash });

        const payData = encodeFunctionData({
          abi: PROCESSOR_ABI,
          functionName: "pay",
          args: [
            (requirement.requestId || ("0x" + "00".repeat(32))) as `0x${string}`,
            requirement.tokenAddress,
            requirement.recipient,
            BigInt(requirement.amount),
          ],
        });
        paymentTxHash = (await sendTransactionAsync({
          to: requirement.paymentProcessor,
          data: payData,
          value: BigInt(0),
        })) as `0x${string}`;
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: paymentTxHash });
      } else {
        const transferData = encodeFunctionData({
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [requirement.recipient, BigInt(requirement.amount)],
        });

        paymentTxHash = (await sendTransactionAsync({
          to: requirement.tokenAddress,
          data: transferData,
          value: BigInt(0),
        })) as `0x${string}`;
        if (publicClient) await publicClient.waitForTransactionReceipt({ hash: paymentTxHash });
      }

      const res = await fetch(params.agentEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Payment-Proof": JSON.stringify({
            txHash: paymentTxHash,
            recipient: requirement.recipient,
            amount: requirement.amount,
            tokenAddress: requirement.tokenAddress,
            requestId: requirement.requestId,
            paymentProcessor: requirement.paymentProcessor,
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
