"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Code,
  FileText,
  Languages,
  TrendingUp,
  Shield,
  Wallet,
  Database,
  Regex,
  Lightbulb,
} from "lucide-react";
import AgentDetailModal from "@/components/AgentDetailModal";

interface AgentData {
  id: string;
  name: string;
  serviceType: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  price: string;
  reputationScore: number;
  totalTxCount: number;
  address: string;
  description: string;
  category: string;
  features: string[];
}

const AGENTS: AgentData[] = [
  {
    id: "code-review",
    name: "Code Review",
    serviceType: "code-review",
    icon: Code,
    price: "0.05",
    reputationScore: 847,
    totalTxCount: 2341,
    address: "0x0000…0001",
    description: "Security, performance, and style analysis for any codebase.",
    category: "Development",
    features: ["Security", "Performance", "Style"],
  },
  {
    id: "summarizer",
    name: "Summarizer",
    serviceType: "summarizer",
    icon: FileText,
    price: "0.02",
    reputationScore: 923,
    totalTxCount: 8472,
    address: "0x0000…0002",
    description: "Distill long texts into concise bullets, paragraphs, or TL;DR.",
    category: "Productivity",
    features: ["Bullet", "Paragraph", "TL;DR"],
  },
  {
    id: "translator",
    name: "Translator",
    serviceType: "translator",
    icon: Languages,
    price: "0.03",
    reputationScore: 756,
    totalTxCount: 5109,
    address: "0x0000…0003",
    description: "Context-aware translation across 50+ languages.",
    category: "Productivity",
    features: ["50+ Languages", "Context-aware", "Fast"],
  },
  {
    id: "sql-generator",
    name: "SQL Generator",
    serviceType: "sql-generator",
    icon: Database,
    price: "0.04",
    reputationScore: 612,
    totalTxCount: 1823,
    address: "0x0000…0004",
    description: "Generate optimized SQL queries from natural language descriptions.",
    category: "Development",
    features: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    id: "regex-generator",
    name: "Regex Generator",
    serviceType: "regex-generator",
    icon: Regex,
    price: "0.03",
    reputationScore: 489,
    totalTxCount: 956,
    address: "0x0000…0005",
    description: "Create complex regex patterns with explanations and test cases.",
    category: "Utilities",
    features: ["Pattern Generation", "Testing", "Explanations"],
  },
  {
    id: "code-explainer",
    name: "Code Explainer",
    serviceType: "code-explainer",
    icon: Lightbulb,
    price: "0.02",
    reputationScore: 534,
    totalTxCount: 1247,
    address: "0x0000…0006",
    description: "Explain any code snippet in plain English with line-by-line breakdown.",
    category: "Development",
    features: ["Line-by-line", "Concepts", "Examples"],
  },
];

const CATEGORIES = ["All", "Development", "Productivity", "Utilities"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

function ReputationBar({ score }: { score: number }) {
  const pct = Math.round((score / 1000) * 100);
  const color = score >= 800 ? "#b7d941" : score >= 500 ? "#4ea8f6" : "#e8a830";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="font-mono text-[11px]" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null);

  const filteredAgents = AGENTS.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || agent.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <section className="border-b border-border bg-surface-muted">
        <div className="max-w-[1200px] mx-auto px-6 py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <h1 className="text-[42px] font-bold tracking-[-1.5px] text-text mb-4">
              Marketplace
            </h1>
            <p className="text-[16px] text-text-2 max-w-[500px] mb-8">
              Discover AI agents. Pay per request. Build reputation on-chain via
              ERC-8004.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1 max-w-md">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3"
              />
              <input
                type="text"
                placeholder="Search agents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-surface border border-border text-text text-[14px] placeholder:text-text-3 focus:outline-none focus:border-border-strong"
              />
            </div>
            <div className="flex items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`h-10 px-4 text-[13px] font-medium transition-colors ${
                    category === cat
                      ? "bg-accent text-bg"
                      : "bg-surface border border-border text-text-2 hover:border-border-strong"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredAgents.map((agent, i) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="group bg-surface border border-border hover:border-border-strong transition-colors"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent-subtle flex items-center justify-center">
                        <Icon
                          size={20}
                          className="text-accent"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-semibold text-text">
                          {agent.name}
                        </h3>
                        <span className="text-[11px] text-text-3 uppercase tracking-wide">
                          {agent.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[20px] font-bold text-accent font-mono">
                        {agent.price}
                      </span>
                      <span className="text-[11px] text-text-3 ml-0.5">USDC</span>
                    </div>
                  </div>

                  <p className="text-[14px] text-text-2 leading-relaxed mb-4">
                    {agent.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] bg-bg border border-border px-2 py-0.5 text-text-3"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[10px] text-text-3 uppercase tracking-wide">
                        Reputation
                      </span>
                      <span className="text-[10px] text-text-3 font-mono">
                        {agent.totalTxCount.toLocaleString()} txs
                      </span>
                    </div>
                    <ReputationBar score={agent.reputationScore} />
                  </div>

                  <button 
                    onClick={() => setSelectedAgent(agent)}
                    className="w-full h-10 bg-accent text-bg text-[13px] font-medium hover:bg-accent-hover transition-colors group-hover:translate-y-[-1px]"
                  >
                    Use Agent
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[15px] text-text-3 mb-4">
              No agents found matching your search.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="text-[14px] text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "ERC-8004 Reputation",
                desc: "Every successful transaction builds verifiable on-chain reputation.",
              },
              {
                icon: Shield,
                title: "x402 Payments",
                desc: "HTTP-native payments. No subscriptions. Pay per request.",
              },
              {
                icon: Wallet,
                title: "PayAgent",
                desc: "Automate recurring payments with configurable spend limits.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-surface border border-border"
              >
                <item.icon
                  size={24}
                  className="text-accent mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-[16px] font-semibold text-text mb-2">
                  {item.title}
                </h3>
                <p className="text-[14px] text-text-2 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AgentDetailModal 
        agent={selectedAgent}
        isOpen={!!selectedAgent}
        onClose={() => setSelectedAgent(null)}
        onTryAgent={(agent) => {
          console.log("Try agent:", agent);
          setSelectedAgent(null);
        }}
      />
    </div>
  );
}