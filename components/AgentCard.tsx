"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Code, FileText, Languages, type LucideIcon, Loader2, Check, AlertCircle } from "lucide-react";
import { useAgentPayment } from "@/lib/use-agent-payment";

const ICON_MAP: Record<string, LucideIcon> = {
  "code-review": Code,
  summarizer: FileText,
  translator: Languages,
};

interface AgentCardProps {
  name: string;
  serviceType: string;
  price: string;
  reputationScore: number;
  totalTxCount: number;
  address: string;
  description: string;
}

export default function AgentCard({
  name,
  serviceType,
  price,
  reputationScore,
  totalTxCount,
  address,
  description,
}: AgentCardProps) {
  const Icon = ICON_MAP[serviceType] || Code;
  const { isConnected } = useAccount();
  const { payAndCall } = useAgentPayment();
  const [status, setStatus] = useState<"idle" | "paying" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const repPct = Math.round((reputationScore / 1000) * 100);
  const repColor = reputationScore >= 800 ? "#00d4aa" : reputationScore >= 500 ? "#4ea8f6" : "#e8a830";

  async function handleUse() {
    if (!isConnected) {
      setStatus("error");
      setResult("Connect your wallet first");
      return;
    }
    setStatus("paying");
    setShowModal(true);

    const { ok, data, error } = await payAndCall({
      agentEndpoint: `/api/agents/${serviceType}`,
      recipientAddress: address,
      amount: price,
      payload: {
        text: "Hello world",
        language: "typescript",
        focus: "general",
        style: "paragraph",
        maxLength: 200,
        targetLanguage: "id",
      },
    });

    if (ok) {
      setStatus("done");
      setResult(JSON.stringify(data, null, 2));
    } else {
      setStatus("error");
      setResult(error || "Unknown error");
    }
  }

  return (
    <>
      <div className="border border-border bg-surface rounded-xl p-5 hover:border-border-strong transition-colors group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-hover flex items-center justify-center group-hover:bg-accent-subtle transition-colors">
              <Icon size={18} className="text-text-3 group-hover:text-accent transition-colors" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="type-subheading text-text">{name}</h3>
              <span className="type-caption text-text-3">{serviceType}</span>
            </div>
          </div>
          <div className="text-right pt-0.5">
            <span className="text-[20px] font-semibold text-accent font-mono">{price}</span>
            <span className="text-[11px] text-text-3 ml-0.5">USDC</span>
          </div>
        </div>

        <p className="type-body-sm text-text-2 mb-5 leading-relaxed">{description}</p>

        <div className="mb-5">
          <div className="flex justify-between mb-1.5">
            <span className="type-caption text-text-3">Reputation</span>
            <span className="font-mono text-[12px] font-medium" style={{ color: repColor }}>{reputationScore}</span>
          </div>
          <div className="h-[3px] bg-surface-hover rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{ width: `${repPct}%`, transition: "width 0.6s ease" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between type-caption text-text-3 mb-5">
          <span>{totalTxCount.toLocaleString()} txs</span>
          <span className="font-mono">{address}</span>
        </div>

        <button
          onClick={handleUse}
          disabled={status === "paying"}
          className="w-full h-9 rounded-lg bg-accent text-bg text-[13px] font-medium hover:bg-accent-hover transition-colors active:translate-y-px disabled:opacity-50 disabled:cursor-wait"
        >
          {status === "paying" ? "Processing..." : "Use Agent"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface border border-border rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              {status === "paying" && <Loader2 size={18} className="text-accent animate-spin" />}
              {status === "done" && <Check size={18} className="text-accent" />}
              {status === "error" && <AlertCircle size={18} className="text-red" />}
              <h3 className="type-subheading text-text">
                {status === "paying" ? "Processing Payment" : status === "done" ? "Result" : "Error"}
              </h3>
            </div>
            <pre className="text-[12px] text-text-2 font-mono bg-bg rounded-lg p-4 overflow-auto whitespace-pre-wrap">
              {status === "paying" ? "Sending USDC and calling agent..." : result}
            </pre>
            {status !== "paying" && (
              <button
                onClick={() => { setShowModal(false); setStatus("idle"); }}
                className="mt-4 w-full h-9 rounded-lg bg-surface-hover text-text text-[13px] font-medium hover:bg-border transition-colors"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
