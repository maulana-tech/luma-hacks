"use client";

import Link from "next/link";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="border-b border-border py-16">
      <h2 className="text-[24px] font-bold tracking-tight text-text mb-6">{title}</h2>
      {children}
    </section>
  );
}

function DiagramBox({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-border p-4 flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
}

function ArchDiagram() {
  const box = "fill-[#1a1a1a] stroke-[#333] stroke-1";
  const accentBox = "fill-[#b7d94120] stroke-[#b7d941] stroke-1";
  const textCls = "fill-[#e5e5e5] font-semibold text-[11px]";
  const subCls = "fill-[#999] text-[9px]";
  const arrow = "stroke-[#b7d941] stroke-1 fill-none marker-end";
  const line = "stroke-[#333] stroke-1 fill-none";

  return (
    <svg viewBox="0 0 700 420" className="w-full max-w-[700px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" className="fill-[#b7d941]" />
        </marker>
        <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" className="fill-[#666]" />
        </marker>
      </defs>

      {/* Outer box */}
      <rect x="10" y="10" width="680" height="400" rx="4" className="fill-none stroke-[#333] stroke-1" />
      <text x="30" y="30" className={subCls}>Vaxa Platform</text>

      {/* Web App */}
      <rect x="40" y="60" width="160" height="80" rx="3" className={box} />
      <text x="120" y="95" textAnchor="middle" className={textCls}>Web App</text>
      <text x="120" y="115" textAnchor="middle" className={subCls}>Next.js + wagmi + RainbowKit</text>

      {/* Telegram Bot */}
      <rect x="270" y="60" width="160" height="80" rx="3" className={box} />
      <text x="350" y="95" textAnchor="middle" className={textCls}>Telegram Bot</text>
      <text x="350" y="115" textAnchor="middle" className={subCls}>Telegraf + ethers.js</text>

      {/* AI Agents */}
      <rect x="500" y="60" width="160" height="80" rx="3" className={box} />
      <text x="580" y="95" textAnchor="middle" className={textCls}>AI Agents</text>
      <text x="580" y="115" textAnchor="middle" className={subCls}>NVIDIA NIM + OpenRouter</text>

      {/* x402 Middleware */}
      <rect x="180" y="200" width="340" height="60" rx="3" className={accentBox} />
      <text x="350" y="225" textAnchor="middle" className="fill-[#b7d941] font-bold text-[12px]">x402 Payment Middleware</text>
      <text x="350" y="245" textAnchor="middle" className="fill-[#b7d94180] text-[9px]">402 → USDC Transfer → Verify → Result</text>

      {/* Avalanche */}
      <rect x="180" y="320" width="340" height="60" rx="3" className={accentBox} />
      <text x="350" y="345" textAnchor="middle" className="fill-[#b7d941] font-bold text-[12px]">Avalanche C-Chain (Fuji)</text>
      <text x="350" y="365" textAnchor="middle" className="fill-[#b7d94180] text-[9px]">USDC Settlement · ERC-8004 Reputation</text>

      {/* Arrows down from surfaces */}
      <line x1="120" y1="140" x2="120" y2="195" className={line} markerEnd="url(#arrowGray)" />
      <path d="M120,195 L260,200" className={line} markerEnd="url(#arrowGray)" />
      <line x1="350" y1="140" x2="350" y2="200" className={line} markerEnd="url(#arrowGray)" />
      <line x1="580" y1="140" x2="580" y2="195" className={line} markerEnd="url(#arrowGray)" />
      <path d="M580,195 L440,200" className={line} markerEnd="url(#arrowGray)" />

      {/* Arrow x402 → Avalanche */}
      <line x1="350" y1="260" x2="350" y2="320" className={arrow} />

      {/* Labels */}
      <text x="355" y="295" className="fill-[#b7d941] text-[9px]">USDC + Proof</text>
    </svg>
  );
}

function PaymentFlowDiagram() {
  const box = "fill-[#1a1a1a] stroke-[#333] stroke-1";
  const accentBox = "fill-[#b7d94120] stroke-[#b7d941] stroke-1";
  const textCls = "fill-[#e5e5e5] font-semibold text-[10px]";
  const subCls = "fill-[#999] text-[8px]";
  const arrow = "stroke-[#b7d941] stroke-1 fill-none";
  const stepBg = "fill-[#b7d94120] stroke-none";

  return (
    <svg viewBox="0 0 720 340" className="w-full max-w-[720px]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6" className="fill-[#b7d941]" />
        </marker>
        <marker id="arrBack" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M8,0 L0,3 L8,6" className="fill-[#666]" />
        </marker>
      </defs>

      {/* Column headers */}
      <text x="80" y="20" textAnchor="middle" className={textCls}>Client</text>
      <text x="360" y="20" textAnchor="middle" className={textCls}>Agent Server</text>
      <text x="640" y="20" textAnchor="middle" className={textCls}>Avalanche</text>

      {/* Lifelines */}
      <line x1="80" y1="30" x2="80" y2="330" className="stroke-[#333] stroke-1 stroke-dashfill-none" />
      <line x1="360" y1="30" x2="360" y2="330" className="stroke-[#333] stroke-1 stroke-dashfill-none" />
      <line x1="640" y1="30" x2="640" y2="330" className="stroke-[#333] stroke-1 stroke-dashfill-none" />

      {/* Step 1: POST request */}
      <line x1="80" y1="55" x2="352" y2="55" className={arrow} markerEnd="url(#arr2)" />
      <rect x="120" y="40" width="180" height="16" rx="2" className={stepBg} />
      <text x="210" y="52" textAnchor="middle" className="fill-[#b7d941] text-[9px]">POST /api/agents/code-review</text>

      {/* Step 2: 402 response */}
      <line x1="352" y1="85" x2="88" y2="85" className="stroke-[#666] stroke-1 fill-none" markerEnd="url(#arrBack)" />
      <rect x="120" y="72" width="180" height="16" rx="2" className="fill-[#e8a83020] stroke-none" />
      <text x="210" y="84" textAnchor="middle" className="fill-[#e8a830] text-[9px]">402 Payment Required</text>

      {/* Step 3: Sign & submit tx */}
      <line x1="80" y1="115" x2="632" y2="115" className={arrow} markerEnd="url(#arr2)" />
      <rect x="240" y="102" width="200" height="16" rx="2" className={stepBg} />
      <text x="340" y="114" textAnchor="middle" className="fill-[#b7d941] text-[9px]">Sign USDC transfer (MetaMask/Rabby)</text>

      {/* Step 4: Retry with proof */}
      <line x1="80" y1="155" x2="352" y2="155" className={arrow} markerEnd="url(#arr2)" />
      <rect x="100" y="142" width="220" height="16" rx="2" className={stepBg} />
      <text x="210" y="154" textAnchor="middle" className="fill-[#b7d941] text-[9px]">POST + X-Payment-Proof: {"{txHash}"}</text>

      {/* Step 5: Verify on-chain */}
      <line x1="360" y1="190" x2="632" y2="190" className={arrow} markerEnd="url(#arr2)" />
      <text x="500" y="185" textAnchor="middle" className="fill-[#b7d941] text-[9px]">Verify tx</text>

      <line x1="632" y1="210" x2="368" y2="210" className="stroke-[#666] stroke-1 fill-none" markerEnd="url(#arrBack)" />
      <text x="500" y="205" textAnchor="middle" className="fill-[#999] text-[9px]">Confirmed</text>

      {/* Step 6: Update reputation */}
      <line x1="360" y1="240" x2="632" y2="240" className={arrow} markerEnd="url(#arr2)" />
      <text x="500" y="235" textAnchor="middle" className="fill-[#b7d941] text-[9px]">ERC-8004 update</text>

      {/* Step 7: Return result */}
      <line x1="352" y1="280" x2="88" y2="280" className="stroke-[#666] stroke-1 fill-none" markerEnd="url(#arrBack)" />
      <rect x="120" y="270" width="180" height="16" rx="2" className="fill-[#b7d94120] stroke-none" />
      <text x="210" y="282" textAnchor="middle" className="fill-[#b7d941] text-[9px]">200 OK + AI Result</text>
    </svg>
  );
}

function ReputationDiagram() {
  const bar = (x: number, h: number, label: string, points: string) => (
    <g key={label}>
      <rect x={x} y={140 - h} width="60" height={h} rx="2" className="fill-[#b7d941]" opacity={0.6 + (h / 140) * 0.4} />
      <text x={x + 30} y={150 - h} textAnchor="middle" className="fill-[#e5e5e5] font-bold text-[10px]">{points}</text>
      <text x={x + 30} y={165} textAnchor="middle" className="fill-[#999] text-[8px]">{label}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 400 180" className="w-full max-w-[400px]" xmlns="http://www.w3.org/2000/svg">
      <text x="200" y="15" textAnchor="middle" className="fill-[#999] text-[9px]">Reputation points per transaction milestone</text>
      {bar(30, 130, "1st tx", "+20")}
      {bar(110, 90, "2nd-10th", "+5/tx")}
      {bar(190, 50, "11th-50th", "+2/tx")}
      {bar(270, 28, "51st+", "+1/tx")}
      {bar(330, 14, "Bonus", "+1")}
    </svg>
  );
}

const AGENTS = [
  { name: "Code Review", price: "0.05", endpoint: "/api/agents/code-review", desc: "Security, performance, and style analysis" },
  { name: "Summarizer", price: "0.02", endpoint: "/api/agents/summarize", desc: "Distill text into bullets, paragraphs, TL;DR" },
  { name: "Translator", price: "0.03", endpoint: "/api/agents/translate", desc: "Context-aware translation across 50+ languages" },
  { name: "SQL Generator", price: "0.04", endpoint: "/api/agents/sql-generator", desc: "Generate optimized SQL from natural language" },
  { name: "Regex Generator", price: "0.03", endpoint: "/api/agents/regex-generator", desc: "Create regex patterns with explanations" },
  { name: "Code Explainer", price: "0.02", endpoint: "/api/agents/code-explainer", desc: "Explain any code in plain English" },
];

export default function WhitepaperPage() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-12">
        <Link href="/" className="text-[13px] text-accent hover:underline">&larr; Back</Link>
        <h1 className="text-[36px] font-bold tracking-[-1px] text-text mt-4 mb-3">Whitepaper</h1>
        <p className="text-[16px] text-text-2 leading-relaxed">
          Vaxa: Programmable money meets autonomous AI agents. A decentralized marketplace
          for AI services on Avalanche C-Chain, using x402 HTTP-native payments and ERC-8004
          on-chain reputation.
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

      {/* ARCHITECTURE */}
      <Section id="architecture" title="Architecture">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Vaxa has three surfaces: a <strong className="text-text">Next.js web app</strong> with wallet
          connection (RainbowKit + wagmi), a <strong className="text-text">Telegram bot</strong> (Telegraf)
          on Railway, and <strong className="text-text">6 AI agents</strong> powered by NVIDIA NIM.
          All communicate through x402 paywall middleware enforcing on-chain USDC payments on Avalanche Fuji.
        </p>
        <DiagramBox>
          <ArchDiagram />
        </DiagramBox>
      </Section>

      {/* AI AGENTS */}
      <Section id="agents" title="AI Service Agents">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Each agent is a REST endpoint protected by x402 paywall. Clients POST, receive 402,
          submit USDC on-chain, retry with tx proof.
        </p>
        <div className="border border-border overflow-hidden">
          {AGENTS.map((agent, i) => (
            <div
              key={agent.name}
              className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? "border-t border-border" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-text">{agent.name}</div>
                <div className="text-[12px] text-text-3">{agent.desc}</div>
                <div className="font-mono text-[11px] text-text-3 mt-1">{agent.endpoint}</div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[16px] font-bold text-accent font-mono">{agent.price}</span>
                <span className="text-[11px] text-text-3 ml-0.5">USDC</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* X402 */}
      <Section id="x402" title="x402 Payment Flow">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          x402 is an HTTP-native payment standard. Payments happen in-band within the HTTP
          request itself — no separate invoicing or subscription.
        </p>
        <DiagramBox className="mb-6">
          <PaymentFlowDiagram />
        </DiagramBox>

        <h3 className="text-[16px] font-semibold text-text mb-3">402 Response Payload</h3>
        <div className="bg-bg border border-border p-4 font-mono text-[12px] text-text-2 leading-[1.8] overflow-x-auto">
          {`{
  "x-payment-required": {
    "version": "1.0",
    "network": "avalanche-fuji",
    "chainId": 43113,
    "token": "USDC",
    "amount": "50000",
    "decimals": 6,
    "recipient": "0xAgent...",
    "description": "Code review - 1 request",
    "expiresAt": 1720000000
  }
}`}
        </div>
      </Section>

      {/* ERC-8004 */}
      <Section id="reputation" title="ERC-8004 On-Chain Reputation">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Every successful payment triggers a reputation update on the AgentRegistry (ERC-8004).
          Scores range 0-1000, permanently recorded on Avalanche.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-4">Scoring Algorithm</h4>
            <DiagramBox>
              <ReputationDiagram />
            </DiagramBox>
          </div>
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Contract Interface</h4>
            <div className="font-mono text-[11px] text-text-2 leading-[2] space-y-1">
              <div><span className="text-accent">registerAgent</span>(name, type, uri)</div>
              <div><span className="text-accent">recordSuccessfulTx</span>(addr, amount)</div>
              <div><span className="text-accent">getAgent</span>(addr) → Profile</div>
              <div><span className="text-accent">getReputationScore</span>(addr) → uint256</div>
              <div><span className="text-accent">getTopAgents</span>(type, limit) → addr[]</div>
              <div><span className="text-accent">deactivateAgent</span>()</div>
            </div>
          </div>
        </div>
      </Section>

      {/* PAYAGENT */}
      <Section id="payagent" title="PayAgent — Programmable Spending">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          PayAgent executes payments on behalf of users based on configurable rules and spending limits.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { title: "Spend Rules", desc: "Subscriptions, tips, donations, conditional payments with custom triggers." },
            { title: "Enforcement", desc: "10-point check: daily/weekly/monthly limits, blocked recipients, rule validation." },
            { title: "Analytics", desc: "Real-time spending stats: today, week, month, all time. Per-rule tracking." },
          ].map((item) => (
            <div key={item.title} className="bg-surface border border-border p-5">
              <h4 className="text-[14px] font-semibold text-text mb-2">{item.title}</h4>
              <p className="text-[13px] text-text-2 leading-[1.6]">{item.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-[16px] font-semibold text-text mb-3">Spend Enforcement (10 checks)</h3>
        <div className="bg-surface border border-border p-5 space-y-2">
          {[
            "Rule enabled?",
            "Amount ≤ maxSinglePayment?",
            "Recipient not blocked?",
            "Recipient in allowedRecipients?",
            "Daily spend + amount ≤ dailyLimit?",
            "Weekly spend + amount ≤ weeklyLimit?",
            "Monthly spend + amount ≤ monthlyLimit?",
            "Agent reputation ≥ minScore?",
            "Daily triggers < maxDailyTriggers?",
            "Execute x402 payment",
          ].map((check, i) => (
            <div key={i} className="flex items-center gap-3 text-[13px]">
              <span className="w-5 h-5 bg-accent/10 flex items-center justify-center shrink-0">
                <span className="text-accent font-mono text-[10px]">{i + 1}</span>
              </span>
              <span className={i === 9 ? "text-accent font-semibold" : "text-text-2"}>{check}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ESCROW */}
      <Section id="escrow" title="Smart Escrow">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Smart escrow holds payment until the AI agent completes the task. Users approve (release)
          or reject (refund) based on result quality.
        </p>
        <div className="flex items-start gap-4">
          {["Create escrow\n+ lock USDC", "Agent executes\ntask", "User approves\n→ release funds"].map((step, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-8 h-8 bg-accent flex items-center justify-center mx-auto mb-3">
                <span className="text-bg font-bold text-[12px]">{i + 1}</span>
              </div>
              <p className="text-[13px] text-text-2 whitespace-pre-line">{step}</p>
              {i < 2 && (
                <svg className="w-6 h-6 mx-auto mt-2 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* TELEGRAM */}
      <Section id="telegram" title="Telegram Bot (@vaixa_bot)">
        <p className="text-[14px] text-text-2 leading-[1.7] mb-6">
          Full access to all AI agents and GitHub integration directly in chat. Uses its own hot wallet
          to pay for users, with daily spending limits. Wallet verification via cryptographic signature.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Commands</h4>
            <div className="space-y-1.5 font-mono text-[12px] text-text-2">
              <div>/code — Code review (0.05)</div>
              <div>/summarize — Summarize (0.02)</div>
              <div>/translate — Translate (0.03)</div>
              <div>/sql — Generate SQL (0.04)</div>
              <div>/regex — Generate regex (0.03)</div>
              <div>/explain — Explain code (0.02)</div>
              <div>/github — Issues, PRs, repos</div>
              <div>/escrow — Smart escrow</div>
              <div>/menu — Interactive menu</div>
            </div>
          </div>
          <div className="bg-surface border border-border p-5">
            <h4 className="text-[14px] font-semibold text-text mb-3">Features</h4>
            <div className="space-y-2 text-[13px] text-text-2">
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Wallet verification via EIP-191 signature</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> GitHub integration (issues, PRs, repos)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Bot pays for you (5 USDC/day limit)</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Interactive inline keyboard menus</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Smart escrow in chat</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Transaction history synced to web</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 bg-accent rounded-full shrink-0" /> Persistent wallet mapping via API</div>
            </div>
          </div>
        </div>
      </Section>

      {/* TECH STACK */}
      <Section id="tech" title="Tech Stack">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { category: "Frontend", items: ["Next.js 16 (App Router)", "Tailwind CSS v4", "RainbowKit + wagmi v3", "Framer Motion", "Lucide React icons"] },
            { category: "Blockchain", items: ["Avalanche C-Chain (Fuji)", "Solidity (ERC-8004)", "ethers.js v6", "USDC (6 decimals)", "x402 payment standard"] },
            { category: "AI", items: ["NVIDIA NIM API (primary)", "OpenRouter (fallback)", "OpenAI-compatible SDK"] },
            { category: "Backend / Bot", items: ["Telegraf (Telegram Bot)", "Railway (bot deploy)", "Vercel (web deploy)", "GitHub API integration"] },
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
              <span className="text-text-2">GitHub (Web)</span>
              <a href="https://github.com/maulana-tech/scbc-hacks" target="_blank" className="text-accent font-mono hover:underline">maulana-tech/scbc-hacks</a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">GitHub (Bot)</span>
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
