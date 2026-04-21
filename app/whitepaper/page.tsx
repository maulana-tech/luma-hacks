"use client";

import Link from "next/link";
import {
  Zap,
  Shield,
  Wallet,
  Code,
  FileText,
  Languages,
  Database,
  Regex as RegexIcon,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Globe,
  Settings,
  Clock,
  GitBranch,
  Check,
} from "lucide-react";

const AGENTS = [
  { name: "Code Review", icon: Code, price: "0.05", endpoint: "/api/agents/code-review" },
  { name: "Summarizer", icon: FileText, price: "0.02", endpoint: "/api/agents/summarize" },
  { name: "Translator", icon: Languages, price: "0.03", endpoint: "/api/agents/translate" },
  { name: "SQL Generator", icon: Database, price: "0.04", endpoint: "/api/agents/sql-generator" },
  { name: "Regex Generator", icon: RegexIcon, price: "0.03", endpoint: "/api/agents/regex-generator" },
  { name: "Code Explainer", icon: Lightbulb, price: "0.02", endpoint: "/api/agents/code-explainer" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-border py-16">
      <h2 className="text-[24px] font-bold tracking-tight text-text mb-6">{title}</h2>
      {children}
    </section>
  );
}

export default function WhitepaperPage() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-12">
        <Link href="/" className="text-[13px] text-accent hover:underline">&larr; Back</Link>
        <h1 className="text-[36px] font-bold tracking-[-1px] text-text mt-4 mb-3">
          Whitepaper
        </h1>
        <p className="text-[16px] text-text-2 leading-relaxed">
          Vaxa: Programmable money meets autonomous AI agents. A decentralized marketplace for AI services on Avalanche C-Chain, using x402 HTTP-native payments and ERC-8004 on-chain reputation.
        </p>
        <div className="flex items-center gap-4 mt-6 text-[12px] text-text-3">
          <span>SCBC Hackathon 2026</span>
          <span className="w-1 h-1 bg-border rounded-full" />
          <span>Avalanche Track</span>
          <span className="w-1 h-1 bg-border rounded-full" />
          <span>Fuji Testnet</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {[
          { id: "architecture", label: "Architecture" },
          { id: "agents", label: "AI Agents" },
          { id: "x402", label: "x402 Payments" },
          { id: "reputation", label: "ERC-8004" },
          { id: "payagent", label: "PayAgent" },
          { id: "escrow", label: "Smart Escrow" },
          { id: "telegram", label: "Telegram Bot" },
          { id: "tech", label: "Tech Stack" },
        ].map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="h-8 px-3 bg-surface border border-border text-[12px] text-text-3 hover:text-text hover:border-border-strong transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>

      <Section id="architecture" title="Architecture">
        <div className="bg-surface border border-border p-6 font-mono text-[12px] text-text-2 leading-[2] overflow-x-auto mb-6">
          <pre>{`┌──────────────────────────────────────────────────────────────┐
│                         Vaxa                                 │
│                                                              │
│  ┌──────────┐     ┌──────────────────┐     ┌─────────────┐ │
│  │  Web App │     │  Telegram Bot    │     │  AI Agents  │ │
│  │  (Next.js│     │  (Telegraf+TS)   │     │  (NVIDIA NIM│ │
│  │  + wagmi)│     │  Railway deploy  │     │   + OpenRou)│ │
│  └────┬─────┘     └────────┬─────────┘     └──────┬──────┘ │
│       │                    │                       │         │
│       │     ┌──────────────▼──────────────┐       │         │
│       └────▶│     x402 Payment Flow       │◀──────┘         │
│             │  402 → USDC transfer → proof │                 │
│             └──────────────┬──────────────┘                  │
│                            │                                  │
│             ┌──────────────▼──────────────┐                  │
│             │    Avalanche C-Chain (Fuji)  │                  │
│             │  - USDC settlement           │                  │
│             │  - ERC-8004 reputation       │                  │
│             └─────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────┘`}</pre>
        </div>
        <p className="text-[14px] text-text-2 leading-[1.7]">
          Vaxa has three main surfaces: a <strong className="text-text">Next.js web app</strong> with wallet
          connection (RainbowKit + wagmi), a <strong className="text-text">Telegram bot</strong> (Telegraf)
          deployed on Railway, and <strong className="text-text">6 AI service agents</strong> powered by NVIDIA
          NIM and OpenRouter. All three communicate through x402 paywall middleware that
          enforces on-chain USDC payments on Avalanche Fuji testnet before serving results.
        </p>
      </Section>

      <Section id="agents" title="AI Service Agents">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Each agent is a REST endpoint protected by x402 paywall middleware. Clients send a request,
          receive a 402 Payment Required response, submit USDC on-chain, and retry with the tx proof.
        </p>
        <div className="border border-border overflow-hidden">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.name}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div className="w-8 h-8 bg-accent-subtle flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-accent" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-text">{agent.name}</div>
                  <div className="font-mono text-[11px] text-text-3">{agent.endpoint}</div>
                </div>
                <span className="text-[16px] font-bold text-accent font-mono">{agent.price}</span>
                <span className="text-[11px] text-text-3">USDC</span>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="x402" title="x402 Payment Flow">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          x402 is an HTTP-native payment standard. Payments happen in-band — within the
          HTTP request itself — not out-of-band via separate invoicing or subscription systems.
        </p>
        <div className="bg-surface border border-border p-6 font-mono text-[12px] text-text-2 leading-[2] overflow-x-auto mb-6">
          <pre>{`Client                          Agent Server               Avalanche
  │                                  │                         │
  │ POST /api/agents/code-review     │                         │
  │ (no payment)                     │                         │
  │─────────────────────────────────▶│                         │
  │                                  │                         │
  │ 402 Payment Required             │                         │
  │ { amount, recipient, token }     │                         │
  │◀─────────────────────────────────│                         │
  │                                  │                         │
  │ [Sign USDC transfer in wallet]   │                         │
  │ ───────────────────────────────────────────────────────▶   │
  │                                  │                         │
  │ POST /api/agents/code-review     │                         │
  │ X-Payment-Proof: { txHash }      │                         │
  │─────────────────────────────────▶│                         │
  │                                  │ verify tx on-chain       │
  │                                  │────────────────────────▶│
  │                                  │ confirmed                │
  │                                  │◀────────────────────────│
  │                                  │ update ERC-8004 rep      │
  │                                  │────────────────────────▶│
  │ 200 OK + AI result               │                         │
  │◀─────────────────────────────────│                         │`}</pre>
        </div>
        <h3 className="text-[16px] font-semibold text-text mb-3">402 Response Payload</h3>
        <div className="bg-bg border border-border p-4 font-mono text-[12px] text-text-2 leading-[1.8] overflow-x-auto">
          {`{
  "x-payment-required": {
    "version": "1.0",
    "network": "avalanche-fuji",
    "chainId": 43113,
    "token": "USDC",
    "amount": "50000",        // 6 decimals
    "recipient": "0xAgent...",
    "description": "Code review — 1 request",
    "expiresAt": 1720000000
  }
}`}
        </div>
      </Section>

      <Section id="reputation" title="ERC-8004 On-Chain Reputation">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Every successful payment triggers a reputation update on the AgentRegistry smart contract
          (ERC-8004). Scores range from 0-1000 and are permanently recorded on Avalanche.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Scoring Algorithm</h4>
            <div className="space-y-2 text-[13px] text-text-2">
              <div className="flex justify-between"><span>First transaction</span><span className="text-accent font-mono">+20</span></div>
              <div className="flex justify-between"><span>2nd - 10th tx</span><span className="text-accent font-mono">+5/tx</span></div>
              <div className="flex justify-between"><span>11th - 50th tx</span><span className="text-accent font-mono">+2/tx</span></div>
              <div className="flex justify-between"><span>51st+ tx</span><span className="text-accent font-mono">+1/tx</span></div>
              <div className="flex justify-between border-t border-border pt-2 mt-2"><span>Amount &gt; 0.1 USDC bonus</span><span className="text-accent font-mono">+1</span></div>
              <div className="flex justify-between font-semibold text-text"><span>Maximum score</span><span className="text-accent font-mono">1000</span></div>
            </div>
          </div>
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Contract Interface</h4>
            <div className="font-mono text-[11px] text-text-2 leading-[1.8]">
              <div><span className="text-accent">registerAgent</span>(name, serviceType, metadataURI)</div>
              <div><span className="text-accent">recordSuccessfulTx</span>(agentAddress, amount)</div>
              <div><span className="text-accent">getAgent</span>(address) → AgentProfile</div>
              <div><span className="text-accent">getReputationScore</span>(address) → uint256</div>
              <div><span className="text-accent">getTopAgents</span>(serviceType, limit) → address[]</div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="payagent" title="PayAgent — Programmable Spending">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          PayAgent is a personal payment agent that executes payments on behalf of users
          based on configurable rules and spending limits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Settings, title: "Spend Rules", desc: "Subscriptions, tips, donations, conditional payments — all with custom triggers and limits." },
            { icon: Shield, title: "Enforcement", desc: "10-point check before every transaction: daily/weekly/monthly limits, blocked recipients, rule validation." },
            { icon: BarChart3, title: "Analytics", desc: "Real-time spending stats: today, this week, this month, all time. Per-rule tracking." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-surface border border-border p-5">
                <Icon size={20} className="text-accent mb-3" strokeWidth={1.5} />
                <h4 className="text-[14px] font-semibold text-text mb-2">{item.title}</h4>
                <p className="text-[13px] text-text-2 leading-[1.6]">{item.desc}</p>
              </div>
            );
          })}
        </div>
        <h3 className="text-[16px] font-semibold text-text mb-3">Spend Enforcement (10 checks)</h3>
        <div className="bg-surface border border-border p-5 space-y-2">
          {[
            "Rule enabled?",
            "Amount ≤ maxSinglePayment?",
            "Recipient not in blockedRecipients?",
            "Recipient in allowedRecipients?",
            "Daily spend + amount ≤ dailySpendLimit?",
            "Weekly spend + amount ≤ weeklySpendLimit?",
            "Monthly spend + amount ≤ monthlySpendLimit?",
            "Agent reputation ≥ minReputationScore?",
            "Daily triggers < maxDailyTriggers?",
            "Execute x402 payment",
          ].map((check, i) => (
            <div key={i} className="flex items-center gap-3 text-[13px]">
              <span className="w-5 h-5 bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-accent font-mono text-[10px]">{i + 1}</span>
              </span>
              <span className={i === 9 ? "text-accent font-semibold" : "text-text-2"}>{check}</span>
              {i < 9 && <span className="text-text-3 ml-auto">→ {i < 9 ? (i < 8 ? "skip/reject" : "") : ""}</span>}
            </div>
          ))}
        </div>
      </Section>

      <Section id="escrow" title="Smart Escrow">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Smart escrow holds payment until the AI agent completes the task. Users can approve
          (release funds) or reject (return funds) based on result quality.
        </p>
        <div className="flex items-start gap-4">
          {["Create escrow + lock USDC", "Agent executes task", "User approves → release funds"].map((step, i) => (
            <div key={i} className="flex-1">
              <div className="w-8 h-8 bg-accent flex items-center justify-center mb-3">
                <span className="text-bg font-bold text-[12px]">{i + 1}</span>
              </div>
              <p className="text-[13px] text-text-2">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="telegram" title="Telegram Bot (@vaixa_bot)">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          The Telegram bot provides full access to all AI agents and GitHub integration directly in chat.
          It uses its own hot wallet to pay for requests on behalf of users, with a daily spending limit
          per user. Wallet verification is done via cryptographic signature.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">AI Agent Commands</h4>
            <div className="space-y-1.5 font-mono text-[12px] text-text-2">
              <div>/code — Code review</div>
              <div>/summarize — Summarize text</div>
              <div>/translate — Translate text</div>
              <div>/sql — Generate SQL</div>
              <div>/regex — Generate regex</div>
              <div>/explain — Explain code</div>
            </div>
          </div>
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Features</h4>
            <div className="space-y-1.5 text-[13px] text-text-2">
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> Wallet verification via signature</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> GitHub integration (issues, PRs, repos)</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> Bot pays for you (5 USDC/day limit)</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> Smart escrow in chat</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> Interactive menu with inline keyboards</div>
              <div className="flex items-center gap-2"><Check size={14} className="text-accent" /> Transaction history sync to web dashboard</div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="tech" title="Tech Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              category: "Frontend",
              items: [
                "Next.js 16 (App Router)",
                "Tailwind CSS v4",
                "RainbowKit + wagmi v3",
                "Framer Motion",
                "Lucide React icons",
              ],
            },
            {
              category: "Blockchain",
              items: [
                "Avalanche C-Chain (Fuji testnet)",
                "Solidity (ERC-8004)",
                "ethers.js v6",
                "USDC (6 decimals)",
                "x402 payment standard",
              ],
            },
            {
              category: "AI",
              items: [
                "NVIDIA NIM API (primary)",
                "OpenRouter (fallback)",
                "OpenAI-compatible SDK",
              ],
            },
            {
              category: "Backend / Bot",
              items: [
                "Telegraf (Telegram Bot)",
                "Railway (bot deployment)",
                "Vercel (web deployment)",
                "GitHub API integration",
              ],
            },
          ].map((stack) => (
            <div key={stack.category} className="bg-surface border border-border p-5">
              <h4 className="text-[14px] font-semibold text-text mb-3">{stack.category}</h4>
              <div className="space-y-1.5">
                {stack.items.map((item) => (
                  <div key={item} className="text-[13px] text-text-2 flex items-center gap-2">
                    <span className="w-1 h-1 bg-accent rounded-full shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-surface border border-border p-5">
          <h4 className="text-[14px] font-semibold text-text mb-3">Deployments</h4>
          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-text-2">Web App</span>
              <a href="https://scbc-hacks.vercel.app" target="_blank" className="text-accent font-mono hover:underline">scbc-hacks.vercel.app</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Telegram Bot</span>
              <a href="https://t.me/vaixa_bot" target="_blank" className="text-accent font-mono hover:underline">@vaixa_bot</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">GitHub</span>
              <a href="https://github.com/maulana-tech/scbc-hacks" target="_blank" className="text-accent font-mono hover:underline">maulana-tech/scbc-hacks</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Bot Source</span>
              <a href="https://github.com/maulana-tech/vaxa-bot" target="_blank" className="text-accent font-mono hover:underline">maulana-tech/vaxa-bot</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Network</span>
              <span className="text-text-3 font-mono">Avalanche Fuji (43113)</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
