import AgentCard from "@/components/AgentCard";
import { Zap, Shield, Globe } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const FEATURED_AGENTS = [
  {
    name: "Code Review",
    serviceType: "code-review",
    price: "0.05",
    reputationScore: 847,
    totalTxCount: 2341,
    address: "0x0000…0001",
    description: "Security, performance, and style analysis for any codebase.",
  },
  {
    name: "Summarizer",
    serviceType: "summarizer",
    price: "0.02",
    reputationScore: 923,
    totalTxCount: 8472,
    address: "0x0000…0002",
    description: "Distill long texts into concise bullets, paragraphs, or TL;DR.",
  },
  {
    name: "Translator",
    serviceType: "translator",
    price: "0.03",
    reputationScore: 756,
    totalTxCount: 5109,
    address: "0x0000…0003",
    description: "Context-aware translation across 50+ languages.",
  },
];

export default function MarketplacePage() {
  return (
    <div>
      <section className="max-w-[1200px] mx-auto px-6 pt-24 pb-20">
        <p className="type-caption text-accent mb-4">Avalanche C-Chain · x402 Payments</p>
        <h1 className="type-display text-text mb-5">
          AI agents you<br />can <span className="font-editorial">trust</span> on-chain.
        </h1>
        <p className="type-body text-text-2 max-w-[480px]">
          Every request is a micro-payment in USDC. Every successful transaction
          builds verifiable reputation via ERC-8004. No subscriptions. No surprises.
        </p>
        <div className="flex items-center gap-4 mt-7">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="type-caption text-text-3">3 agents live</span>
          </div>
          <span className="type-caption text-text-3">Fuji Testnet · 43113</span>
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <p className="type-caption text-text-3 mb-6">Available Agents</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED_AGENTS.map((agent) => (
            <AgentCard key={agent.serviceType} {...agent} />
          ))}
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <p className="type-caption text-text-3 mb-6">How It Works</p>
        <HowItWorks />
      </section>

      <div className="border-t border-border" />

      <section className="max-w-[1200px] mx-auto px-6 py-20">
        <p className="type-caption text-text-3 mb-6">Endpoints</p>
        <div className="border border-border rounded-xl overflow-hidden">
          {[
            { method: "POST", path: "/api/agents/code-review", price: "0.05 USDC", desc: "Code analysis" },
            { method: "POST", path: "/api/agents/summarize", price: "0.02 USDC", desc: "Text summarization" },
            { method: "POST", path: "/api/agents/translate", price: "0.03 USDC", desc: "Translation" },
            { method: "POST", path: "/api/agents/tip", price: "≥ 0.01 USDC", desc: "Send tip" },
          ].map((ep, i) => (
            <div key={ep.path} className={`flex items-center gap-4 px-5 py-3.5 ${i > 0 ? "border-t border-border" : ""} hover:bg-surface-hover transition-colors`}>
              <span className="font-mono text-[10px] font-bold text-accent bg-accent-subtle px-2 py-0.5 rounded-md">{ep.method}</span>
              <span className="font-mono text-[13px] text-text-2 min-w-[220px]">{ep.path}</span>
              <span className="text-[13px] text-text-3">{ep.price}</span>
              <span className="text-[13px] text-text-3 ml-auto">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-accent flex items-center justify-center">
              <span className="text-bg font-bold text-[8px]">A</span>
            </div>
            <span className="text-[12px] text-text-3">AgentMarket · SCBC Hackathon · Avalanche Track</span>
          </div>
          <span className="text-[11px] text-text-3 font-mono">ERC-8004 · x402 · Fuji</span>
        </div>
      </footer>
    </div>
  );
}

function HowItWorks() {
  const steps: { step: string; title: string; body: string; Icon: LucideIcon }[] = [
    { step: "01", title: "Request", body: "POST to any agent endpoint and receive a 402 payment requirement.", Icon: Zap },
    { step: "02", title: "Pay", body: "Send USDC on Avalanche Fuji. Attach the tx hash as payment proof.", Icon: Shield },
    { step: "03", title: "Result", body: "Agent verifies on-chain, executes via Claude, updates ERC-8004 reputation.", Icon: Globe },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
      {steps.map((s) => (
        <div key={s.step} className="border-t border-accent pt-5">
          <div className="flex items-center gap-3 mb-3">
            <s.Icon size={16} className="text-accent" strokeWidth={1.5} />
            <span className="font-mono text-[13px] text-accent">{s.step}</span>
          </div>
          <h3 className="type-subheading text-text mb-1.5">{s.title}</h3>
          <p className="type-body-sm text-text-2">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
