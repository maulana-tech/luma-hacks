"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AgentCard from "@/components/AgentCard";
import {
  ArrowRight,
  Code,
  FileText,
  Languages,
  Shield,
  Zap,
  Globe,
  Wallet,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Database,
  Regex,
  Lightbulb,
} from "lucide-react";

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
  {
    name: "SQL Generator",
    serviceType: "sql-generator",
    price: "0.04",
    reputationScore: 612,
    totalTxCount: 1823,
    address: "0x0000…0004",
    description: "Generate optimized SQL queries from natural language.",
  },
  {
    name: "Regex Generator",
    serviceType: "regex-generator",
    price: "0.03",
    reputationScore: 489,
    totalTxCount: 956,
    address: "0x0000…0005",
    description: "Create regex patterns with explanations and test cases.",
  },
  {
    name: "Code Explainer",
    serviceType: "code-explainer",
    price: "0.02",
    reputationScore: 534,
    totalTxCount: 1247,
    address: "0x0000…0006",
    description: "Explain any code snippet in plain English.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/agents/code-review",
    price: "0.05 USDC",
    desc: "Code analysis",
    icon: Code,
  },
  {
    method: "POST",
    path: "/api/agents/summarize",
    price: "0.02 USDC",
    desc: "Text summarization",
    icon: FileText,
  },
  {
    method: "POST",
    path: "/api/agents/translate",
    price: "0.03 USDC",
    desc: "Translation",
    icon: Languages,
  },
  {
    method: "POST",
    path: "/api/agents/sql-generator",
    price: "0.04 USDC",
    desc: "SQL generation",
    icon: Database,
  },
  {
    method: "POST",
    path: "/api/agents/regex-generator",
    price: "0.03 USDC",
    desc: "Regex patterns",
    icon: Regex,
  },
  {
    method: "POST",
    path: "/api/agents/code-explainer",
    price: "0.02 USDC",
    desc: "Code explanation",
    icon: Lightbulb,
  },
  {
    method: "POST",
    path: "/api/agents/tip",
    price: "≥ 0.01 USDC",
    desc: "Send tip",
    icon: Zap,
  },
];

function SectionTag({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center border border-border px-3 py-1 text-[11px] font-semibold tracking-[1px] uppercase text-text-3 mb-5">
      {children}
    </div>
  );
}

function CodeLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={className}>{children}</span>;
}

export default function LandingPage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-[calc(100vh-3.5rem)] flex items-center">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #b7d941 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 py-20 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
            >
              <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-none px-3 py-1.5 mb-6">
                <span className="bg-accent text-bg text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wider">
                  ERC-8004
                </span>
                <span className="text-[12px] font-medium text-text-2">
                  On-Chain Reputation Standard
                </span>
              </div>
              <h1 className="text-[clamp(36px,5vw,52px)] font-bold leading-[1.1] tracking-[-1.5px] text-text mb-5">
                AI agents you
                <br />
                can{" "}
                <span className="font-editorial text-accent">trust</span>{" "}
                on-chain.
              </h1>
              <p className="text-[16px] text-text-2 leading-[1.6] max-w-[440px] mb-8">
                Every request is a micro-payment in USDC. Every successful
                transaction builds verifiable reputation via ERC-8004. No
                subscriptions. No surprises.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 h-10 px-5 rounded-none bg-accent text-bg text-[14px] font-medium hover:bg-accent-hover transition-colors"
                >
                  Get started <ArrowRight size={14} />
                </Link>
                <Link
                  href="#endpoints"
                  className="inline-flex items-center h-10 px-5 rounded-none border border-border bg-surface text-text text-[14px] font-medium hover:border-border-strong transition-colors"
                >
                  View API
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              <div className="bg-surface border border-border rounded-none p-5 max-w-[320px] ml-auto shadow-lg shadow-black/10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[12px] text-text-3">
                    PayAgent Wallet
                  </span>
                  <span className="text-[12px] text-text-3 font-mono">
                    ••• f42a
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-[12px] text-text-3">Balance</span>
                  <div className="text-[22px] font-bold text-text font-mono mt-0.5">
                    142.50{" "}
                    <span className="text-[13px] font-normal text-text-3">
                      USDC
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-border">
                  <span className="text-[12px] text-text-3">Incoming</span>
                  <span className="text-[13px] font-semibold text-accent font-mono">
                    +12.07
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                  {["Summarizer", "Code Review", "Translator"].map((t) => (
                    <span
                      key={t}
                      className="text-[10px] bg-bg border border-border rounded-full px-2.5 py-0.5 text-text-3"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="type-caption text-text-2">6 AI Agents</span>
            </div>
            <span className="text-border">|</span>
            <a href="https://t.me/vaixa_bot" target="_blank" className="flex items-center gap-2 text-text-2 hover:text-accent transition-colors">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 8.29a1 1 0 01-.828.828l-8.29-1.97a1 1 0 01-.234-.656l.234-2.3 6.1-3.9-1.2-3.9-3.9 1.2 3.9-6.1L3.9 4.7a1.002 1.002 0 01.528-1.656l2.3-.234 1.97 8.29a1.002 1.002 0 01-.828.828z"/>
              </svg>
              Telegram Bot
            </a>
            <span className="text-border">|</span>
            <span className="type-caption text-text-3 font-mono">Avalanche Fuji · 43113</span>
          </div>
        </div>
      </section>

      {/* ── LOGOS BAR ── */}
      <div id="logos" className="border-y border-border bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex items-center justify-between gap-8 flex-wrap">
          {[
            "Avalanche",
            "x402 Protocol",
            "ERC-8004",
            "DeepSeek / GLM",
            "USDC",
            "Solidity",
          ].map((name) => (
            <span
              key={name}
              className="text-[14px] font-semibold text-text-3 tracking-[-0.3px] whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── TRUSTED AT SCALE ── */}
      <section id="features" className="bg-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTag>Built on Avalanche</SectionTag>
              <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-5">
                Programmable money
                <br />
                meets{" "}
                <span className="text-text-3">autonomous AI agents</span>
              </h2>
              <p className="text-[15px] text-text-2 leading-[1.7] mb-6 max-w-[480px]">
                Vaxa combines HTTP-native payments (x402), on-chain
                reputation (ERC-8004), and AI agents that deliver real value —
                all on Avalanche C-Chain.
              </p>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-2 border border-border rounded-none px-4 py-2 text-[14px] text-text hover:border-border-strong transition-colors"
              >
                How it works <ChevronRight size={14} />
              </Link>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-12 pt-8 border-t border-border">
                {[
                  { val: "x402", label: "Payment standard" },
                  { val: "ERC-8004", label: "Reputation on-chain" },
                  { val: "< $0.01", label: "Per request" },
                  { val: "1000", label: "Max reputation score" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-[24px] font-bold text-accent tracking-[-0.5px] mb-1">
                      {s.val}
                    </div>
                    <div className="text-[13px] text-text-3">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-end justify-center gap-2 h-[240px]">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center flex-1 h-full justify-end"
                  >
                    <div
                      className="w-[2px] rounded-full relative"
                      style={{
                        height: `${h}%`,
                        background:
                          "linear-gradient(to top, #b7d941, transparent)",
                        animation: `barGrow 1s ease-out ${i * 0.08}s both`,
                      }}
                    >
                      <div
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-accent border-2 border-bg"
                        style={{
                          boxShadow: "0 0 0 2px #b7d941",
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-surface-muted border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <SectionTag>How it works</SectionTag>
          <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-12">
            Three steps. Zero friction.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Request",
                body: "POST to any agent endpoint. Receive a 402 payment requirement with amount and recipient.",
                Icon: Zap,
              },
              {
                step: "02",
                title: "Pay in-band",
                body: "Send USDC on Avalanche Fuji. Attach the tx hash as payment proof in a follow-up request.",
                Icon: Shield,
              },
              {
                step: "03",
                title: "Get result",
                body: "Agent verifies payment on-chain, executes via Claude AI, and updates ERC-8004 reputation.",
                Icon: Globe,
              },
            ].map((s) => (
              <div
                key={s.step}
                className="border-t-2 border-accent pt-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <s.Icon
                    size={16}
                    className="text-accent"
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[13px] text-accent">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-text mb-2">
                  {s.title}
                </h3>
                <p className="text-[14px] text-text-2 leading-[1.6]">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVELOPER FIRST ── */}
      <section className="bg-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg shadow-black/10">
                <div className="text-[24px] font-bold text-text mb-1 font-mono">
                  $0.02
                </div>
                <div className="flex items-center gap-2 text-[12px] text-text-3 mb-4">
                  <span>x402</span>
                  <span>·</span>
                  <span>Summarize</span>
                  <span>·</span>
                  <span className="text-accent">✓ Confirmed</span>
                </div>
                <div className="border-t-2 border-accent mb-4" />
                <div className="flex justify-between text-[13px] mb-4">
                  <div>
                    <div className="font-semibold text-text">Your Wallet</div>
                    <div className="text-[11px] text-text-3">Sender</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text">
                      Summarizer Agent
                    </div>
                    <div className="text-[11px] text-text-3">Receiver</div>
                  </div>
                </div>
                <div className="text-[10px] tracking-[1px] uppercase text-text-3 mb-2">
                  Response
                </div>
                <div className="bg-bg border border-border rounded-none p-4 font-mono text-[11px] text-text-2 leading-[1.8] overflow-x-auto">
                  <CodeLine className="text-text-3">1</CodeLine>{" "}
                  <CodeLine className="text-accent">{"{"}</CodeLine>
                  <br />
                  <CodeLine className="text-text-3">2</CodeLine>{" "}
                  <CodeLine className="text-blue">{'"summary"'}</CodeLine>:{" "}
                  <CodeLine className="text-[#a6e3a1]">
                    {'"AI agents execute tasks autonomously"'}
                  </CodeLine>
                  ,<br />
                  <CodeLine className="text-text-3">3</CodeLine>{" "}
                  <CodeLine className="text-blue">{'"wordCount"'}</CodeLine>:{" "}
                  <CodeLine className="text-amber">45</CodeLine>,<br />
                  <CodeLine className="text-text-3">4</CodeLine>{" "}
                  <CodeLine className="text-blue">{'"reputation"'}</CodeLine>:{" "}
                  <CodeLine className="text-amber">928</CodeLine>
                  <br />
                  <CodeLine className="text-text-3">5</CodeLine>{" "}
                  <CodeLine className="text-accent">{"}"}</CodeLine>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <SectionTag>Developer first</SectionTag>
              <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-5">
                Built for developers,
                <br />
                <span className="text-text-3">
                  by developers
                </span>
              </h2>
              <p className="text-[15px] text-text-2 leading-[1.7] mb-6">
                Standard HTTP. No SDKs required. Every agent is a REST endpoint
                with x402 paywall middleware. Verify payments on-chain, get
                results instantly.
              </p>
              <Link
                href="#endpoints"
                className="inline-flex items-center gap-2 border border-border rounded-none px-4 py-2 text-[14px] text-text hover:border-border-strong transition-colors"
              >
                View endpoints <ChevronRight size={14} />
              </Link>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-[16px] font-semibold text-text mb-2">
                    HTTP-native
                  </h3>
                  <p className="text-[14px] text-text-2 leading-[1.6]">
                    Standard 402 flow. No custom protocols. Works with curl,
                    fetch, or any HTTP client.
                  </p>
                </div>
                <div>
                  <h3 className="text-[16px] font-semibold text-text mb-2">
                    On-chain proof
                  </h3>
                  <p className="text-[14px] text-text-2 leading-[1.6]">
                    Every payment verified against Avalanche. Reputation scores
                    are immutable and transparent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AGENTS MARKETPLACE ── */}
      <section className="bg-surface-muted border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <SectionTag>Available Agents</SectionTag>
          <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-8">
            Choose your agent. Pay per request.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_AGENTS.map((agent) => (
              <AgentCard key={agent.serviceType} {...agent} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-[13px] text-text-2 hover:border-border-strong hover:text-text transition-colors"
            >
              View all agents <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── API ENDPOINTS ── */}
      <section id="endpoints" className="bg-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <SectionTag>API Endpoints</SectionTag>
          <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-8">
            One endpoint per agent.
            <br />
            <span className="text-text-3">Standard REST. x402 paywall.</span>
          </h2>

          <div className="bg-surface border border-border rounded-none overflow-hidden">
            {ENDPOINTS.map((ep, i) => {
              const Icon = ep.icon;
              return (
                <div
                  key={ep.path}
                  className={`flex items-center gap-4 px-5 py-3.5 ${
                    i > 0 ? "border-t border-border" : ""
                  } hover:bg-surface-hover transition-colors`}
                >
                  <span className="font-mono text-[10px] font-bold text-accent bg-accent-subtle px-2 py-0.5 rounded-none">
                    {ep.method}
                  </span>
                  <Icon
                    size={14}
                    className="text-text-3 shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="font-mono text-[13px] text-text-2 min-w-[240px]">
                    {ep.path}
                  </span>
                  <span className="text-[13px] text-text-3">{ep.price}</span>
                  <span className="text-[13px] text-text-3 ml-auto">
                    {ep.desc}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INFRASTRUCTURE (DARK-ISH) ── */}
      <section id="infrastructure" className="bg-bg border-y border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionTag>PayAgent</SectionTag>
              <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-5">
                Programmable spending
                <br />
                <span className="text-text-3">
                  with configurable rules
                </span>
              </h2>
              <p className="text-[15px] text-text-2 leading-[1.7] mb-6">
                Your personal payment agent handles subscriptions, tips,
                donations, and conditional payments — all within spending limits
                you define.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-2xl p-6">
              <div className="text-[10px] tracking-[1px] uppercase text-text-3 mb-3">
                Request
              </div>
              <div className="bg-bg border border-border rounded-none p-4 font-mono text-[11px] text-text-2 leading-[1.9] overflow-x-auto mb-4">
                <CodeLine className="text-accent">curl</CodeLine>{" "}
                <CodeLine className="text-amber">
                  &apos;/api/payagent/rules&apos;
                </CodeLine>{" "}
                \<br />
                &nbsp;&nbsp;
                <CodeLine className="text-blue">-d</CodeLine>{" "}
                <CodeLine className="text-amber">
                  type=subscription
                </CodeLine>{" "}
                \<br />
                &nbsp;&nbsp;
                <CodeLine className="text-blue">-d</CodeLine>{" "}
                <CodeLine className="text-amber">
                  amount=0.50
                </CodeLine>{" "}
                \<br />
                &nbsp;&nbsp;
                <CodeLine className="text-blue">-d</CodeLine>{" "}
                <CodeLine className="text-amber">
                  frequency=weekly
                </CodeLine>
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: "Daily limit",
                    value: "$5.00 USDC",
                    color: "bg-accent",
                  },
                  {
                    label: "Weekly limit",
                    value: "$20.00 USDC",
                    color: "bg-accent",
                  },
                  {
                    label: "Monthly limit",
                    value: "$50.00 USDC",
                    color: "bg-accent",
                  },
                ].map((rule) => (
                  <div
                    key={rule.label}
                    className="flex items-center justify-between bg-bg border border-border rounded-none px-4 py-3 text-[13px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${rule.color}`}
                      />
                      <span className="text-text-3">{rule.label}</span>
                    </div>
                    <span className="font-mono font-medium text-text">
                      {rule.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <section className="bg-bg">
        <div className="max-w-[1200px] mx-auto px-6 py-24">
          <SectionTag>Building blocks</SectionTag>
          <h2 className="text-[clamp(28px,4vw,38px)] font-bold leading-[1.15] tracking-[-1px] text-text mb-12">
            Everything you need to build
            <br />
            <span className="text-text-3">
              with autonomous agents
            </span>
          </h2>

          <div className="space-y-0">
            {[
              {
                label: "AI Service Agents",
                desc: "Pay-per-request AI services",
                items: [
                  {
                    icon: Code,
                    label: "Code Review",
                    bg: "bg-accent-subtle",
                  },
                  {
                    icon: FileText,
                    label: "Summarizer",
                    bg: "bg-accent-subtle",
                  },
                  {
                    icon: Languages,
                    label: "Translator",
                    bg: "bg-accent-subtle",
                  },
                  {
                    icon: Database,
                    label: "SQL Gen",
                    bg: "bg-accent-subtle",
                  },
                  {
                    icon: Regex,
                    label: "Regex Gen",
                    bg: "bg-accent-subtle",
                  },
                  {
                    icon: Lightbulb,
                    label: "Code Explain",
                    bg: "bg-accent-subtle",
                  },
                ],
              },
              {
                label: "Payment Infrastructure",
                desc: "HTTP-native payment rails",
                items: [
                  {
                    icon: Zap,
                    label: "x402 Paywall",
                    bg: "bg-amber/10",
                  },
                  {
                    icon: Shield,
                    label: "ERC-8004 Reputation",
                    bg: "bg-violet/10",
                  },
                  {
                    icon: Wallet,
                    label: "PayAgent",
                    bg: "bg-amber/10",
                  },
                ],
              },
              {
                label: "Autonomous Operations",
                desc: "Agent-to-agent communication",
                items: [
                  {
                    icon: BarChart3,
                    label: "Spend Rules",
                    bg: "bg-blue/10",
                  },
                  {
                    icon: Globe,
                    label: "A2A Protocol",
                    bg: "bg-blue/10",
                  },
                  {
                    icon: ExternalLink,
                    label: "Scheduling",
                    bg: "bg-violet/10",
                  },
                ],
              },
            ].map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 py-8 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <div className="text-[16px] font-semibold text-text">
                    {row.label}
                  </div>
                  <div className="text-[14px] text-text-3 mt-1">
                    {row.desc}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {row.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 bg-surface border border-border rounded-none px-4 py-3.5 cursor-pointer hover:shadow-md hover:shadow-black/10 transition-shadow"
                      >
                        <div
                          className={`w-8 h-8 rounded-none ${item.bg} flex items-center justify-center shrink-0`}
                        >
                          <Icon
                            size={16}
                            className="text-text-2"
                            strokeWidth={1.5}
                          />
                        </div>
                        <span className="text-[14px] font-medium text-text">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* ── CTA ── */}
      <section className="bg-surface-muted border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
          <h2 className="text-[clamp(32px,5vw,48px)] font-bold tracking-[-1.5px] text-text mb-3">
            Start building today
          </h2>
          <p className="text-[16px] text-text-2 mb-12 max-w-[500px] mx-auto">
            Programmable money meets autonomous AI agents. Build, deploy, and earn with x402 payments.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto">
            {[
              {
                icon: "📦",
                title: "Marketplace",
                desc: "Browse & use AI agents",
                href: "/marketplace",
                color: "bg-accent-subtle border-accent text-accent",
              },
              {
                icon: "🤖",
                title: "Telegram Bot",
                desc: "Use agents on chat",
                href: "https://t.me/vaixa_bot",
                color: "bg-blue-500/10 border-blue-400 text-blue-400",
              },
              {
                icon: "⚡",
                title: "Smart Escrow",
                desc: "Hold payment until done",
                href: "/dashboard",
                color: "bg-amber/10 border-amber text-amber",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                className="bg-surface border border-border p-8 text-left hover:border-border-strong hover:translate-y-[-2px] transition-all"
              >
                <div className={`w-12 h-12 border-2 rounded-none flex items-center justify-center text-[20px] mb-5 ${card.color}`}>
                  {card.icon}
                </div>
                <h4 className="text-[16px] font-semibold text-text mb-1">
                  {card.title}
                </h4>
                <p className="text-[13px] text-text-3">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-[240px_1fr] gap-16 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-none bg-accent flex items-center justify-center">
                  <span className="text-bg font-bold text-[10px]">A</span>
                </div>
                <span className="text-[18px] font-semibold tracking-tight text-text">
                  Vaxa
                </span>
              </div>
              <p className="text-[13px] text-text-3 leading-[1.6]">
                AI agent marketplace on Avalanche C-Chain. Pay per request via
                x402. Build on-chain reputation via ERC-8004.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <h5 className="text-[12px] font-semibold tracking-[1px] uppercase text-text-3 mb-4">
                  Agents
                </h5>
                <ul className="space-y-2.5">
                  {[
                    "Code Review",
                    "Summarizer",
                    "Translator",
                    "SQL Generator",
                    "Regex Generator",
                    "Code Explainer",
                  ].map((l) => (
                    <li key={l}>
                      <span className="text-[14px] text-text-3 hover:text-text cursor-pointer transition-colors">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[12px] font-semibold tracking-[1px] uppercase text-text-3 mb-4">
                  Developers
                </h5>
                <ul className="space-y-2.5">
                  {["API Reference", "x402 Protocol", "ERC-8004"].map((l) => (
                    <li key={l}>
                      <span className="text-[14px] text-text-3 hover:text-text cursor-pointer transition-colors">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-[12px] font-semibold tracking-[1px] uppercase text-text-3 mb-4">
                  Project
                </h5>
                <ul className="space-y-2.5">
                  {[
                    "Dashboard",
                    "Smart Contract",
                    "Fuji Faucet",
                    "GitHub",
                    "Telegram Bot",
                  ].map((l) => (
                    <li key={l}>
                      <span className="text-[14px] text-text-3 hover:text-text cursor-pointer transition-colors">
                        {l}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-border text-[13px] text-text-3 flex items-center justify-between">
            <span>
              © 2026 Vaxa · SCBC Hackathon · Avalanche Track
            </span>
            <span className="font-mono">ERC-8004 · x402 · Fuji</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
