"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import SpendRuleForm from "@/components/SpendRuleForm";
import PaymentHistory from "@/components/PaymentHistory";
import EscrowForm from "@/components/EscrowForm";
import { getLocalTransactions, type LocalTransaction } from "@/components/AgentCard";
import {
  Settings,
  Clock,
  TrendingUp,
  Pause,
  Play,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import Link from "next/link";

interface Rule {
  id: string;
  name: string;
  type: string;
  amount: string;
  enabled: boolean;
  recipientAddress: string | null;
  scheduleFrequency: string | null;
  conditionTrigger: string | null;
  totalSpentToDate: string;
}

interface Stats {
  today: { spent: string; limit: string; remaining: string; txCount: number };
  thisWeek: { spent: string; limit: string; remaining: string; txCount: number };
  thisMonth: { spent: string; limit: string; remaining: string; txCount: number };
  allTime: { spent: string; txCount: number };
}

const TYPE_STYLE: Record<string, string> = {
  subscription: "bg-accent-subtle text-accent",
  tip: "bg-amber/15 text-amber",
  donation: "bg-violet/15 text-violet",
  conditional: "bg-blue/15 text-blue",
};

const SPRING = { type: "spring" as const, stiffness: 500, damping: 40 };

function StatCard({
  title,
  value,
  subtitle,
  index,
}: {
  title: string;
  value: string;
  subtitle: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08, ...SPRING }}
      className="border border-border bg-surface rounded-xl p-5"
    >
      <p className="type-caption text-text-3 mb-2">{title}</p>
      <p className="font-mono text-[22px] font-semibold text-text">{value}</p>
      <p className="text-[12px] text-text-3 mt-1">{subtitle}</p>
    </motion.div>
  );
}

function BalanceCard({ stats }: { stats: Stats | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0 }}
      className="border border-border bg-surface rounded-xl p-6"
    >
      <p className="type-caption text-text-3 mb-3">Spent This Month</p>
      <p className="font-mono text-[36px] font-semibold text-text leading-none">
        {stats?.thisMonth?.spent || "0.00"}
        <span className="text-[14px] text-text-3 ml-2">USDC</span>
      </p>
      <div className="mt-4 h-1.5 bg-bg rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(
              (parseFloat(stats?.thisMonth?.spent || "0") /
                parseFloat(stats?.thisMonth?.limit || "50")) *
                100,
              100
            )}%`,
          }}
        />
      </div>
      <p className="text-[12px] text-text-3 mt-2">
        of {stats?.thisMonth?.limit || "50.00"} USDC limit
      </p>

      <div className="mt-5 pt-4 border-t border-border space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-text-3">Today</span>
          <span className="font-mono text-[13px] text-text">
            {stats?.today?.spent || "0.00"}{" "}
            <span className="text-text-3">/ {stats?.today?.limit || "5.00"}</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-text-3">This Week</span>
          <span className="font-mono text-[13px] text-text">
            {stats?.thisWeek?.spent || "0.00"}{" "}
            <span className="text-text-3">/ {stats?.thisWeek?.limit || "20.00"}</span>
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[13px] text-text-3">All Time</span>
          <span className="font-mono text-[13px] text-text">
            {stats?.allTime?.spent || "0.00"}{" "}
            <span className="text-text-3">{stats?.allTime?.txCount || 0} txs</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}

const TABS = [
  { key: "overview" as const, label: "Overview", icon: TrendingUp },
  { key: "rules" as const, label: "Rules", icon: Settings },
  { key: "escrow" as const, label: "Escrow", icon: Shield },
  { key: "history" as const, label: "History", icon: Clock },
];

type Tab = "overview" | "rules" | "escrow" | "history";

function DashboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "overview";
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [rules, setRules] = useState<Rule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<
    {
      id: string;
      type: string;
      recipientAddress: string;
      amount: string;
      txHash: string | null;
      status: string;
      createdAt: string;
    }[]
  >([]);
  const [isPaused, setIsPaused] = useState(false);
  const [localTxs, setLocalTxs] = useState<LocalTransaction[]>([]);
  const [sharedTxs, setSharedTxs] = useState<Array<{
    id: string;
    source: string;
    agentName: string;
    agentType: string;
    amount: string;
    txHash: string;
    status: string;
    createdAt: string;
  }>>([]);

  const ownerAddress = address || "";

  useEffect(() => {
    setLocalTxs(getLocalTransactions());
  }, [tab]);

  useEffect(() => {
    if (!ownerAddress) return;
    async function loadShared() {
      try {
        const res = await fetch(`/api/transactions?wallet=${ownerAddress}`);
        if (res.ok) {
          const data = await res.json();
          setSharedTxs(data.transactions || []);
        }
      } catch {}
    }
    loadShared();
    const interval = setInterval(loadShared, 15000);
    return () => clearInterval(interval);
  }, [ownerAddress]);

  useEffect(() => {
    if (!ownerAddress) return;
    async function load() {
      try {
        const h = { "x-owner-address": ownerAddress };
        const [r, s, hist, cfg] = await Promise.all([
          fetch("/api/payagent/rules", { headers: h }),
          fetch("/api/payagent/stats", { headers: h }),
          fetch("/api/payagent/history?limit=20", { headers: h }),
          fetch("/api/payagent/config", { headers: h }),
        ]);
        if (r.ok) setRules((await r.json()).rules || []);
        if (s.ok) setStats(await s.json());
        if (hist.ok)
          setTransactions((await hist.json()).transactions || []);
        if (cfg.ok) {
          const config = await cfg.json();
          setIsPaused(config.isPaused || false);
        }
      } catch {}
    }
    load();
  }, [ownerAddress]);

  const handleAddRule = async (rule: Record<string, unknown>) => {
    if (!ownerAddress) return;
    try {
      const res = await fetch("/api/payagent/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-owner-address": ownerAddress,
        },
        body: JSON.stringify(rule),
      });
      if (res.ok) {
        const newRule = await res.json();
        setRules((prev) => [...prev, newRule]);
      }
    } catch {
      setRules((prev) => [
        ...prev,
        {
          ...rule,
          id: `rule_${Date.now()}`,
          enabled: true,
          totalSpentToDate: "0.00",
        } as Rule,
      ]);
    }
  };

  const toggleRule = async (id: string, enabled: boolean) => {
    if (!ownerAddress) return;
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled } : r))
    );
    try {
      await fetch("/api/payagent/rules", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-owner-address": ownerAddress,
        },
        body: JSON.stringify({ id, enabled }),
      });
    } catch {}
  };

  const togglePause = async () => {
    if (!ownerAddress) return;
    const endpoint = isPaused ? "/api/payagent/resume" : "/api/payagent/pause";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "x-owner-address": ownerAddress },
      });
      if (res.ok) setIsPaused(!isPaused);
    } catch {}
  };

  if (!isConnected) {
    return (
      <div className="py-20 text-center">
        <h1 className="type-heading text-[24px] text-text mb-4">Dashboard</h1>
        <p className="type-body text-text-2 mb-6">
          Connect your wallet to manage your PayAgent.
        </p>
        <div className="flex justify-center">
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
                })}
              >
                <button
                  onClick={openConnectModal}
                  className="h-10 px-6 bg-accent text-bg text-[14px] font-medium hover:bg-accent-hover transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </ConnectButton.Custom>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="type-display text-text">
          Hello,{" "}
          <span className="font-editorial">
            {ownerAddress.slice(0, 6)}…{ownerAddress.slice(-4)}
          </span>
          .
        </h1>
        <p className="mt-2 type-body text-text-2">
          Your PayAgent overview.
        </p>
      </header>

      <div className="flex items-center gap-3 mb-2">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                tab === t.key
                  ? "bg-accent text-bg"
                  : "text-text-3 hover:text-text hover:bg-surface-hover"
              }`}
            >
              <Icon size={14} strokeWidth={1.5} />
              {t.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <button
          onClick={togglePause}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium transition-colors ${
            isPaused
              ? "border-amber/30 bg-amber/10 text-amber"
              : "border-border bg-surface text-text-2 hover:border-border-strong"
          }`}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      {tab === "overview" && (
        <>
          <section className="grid gap-6 xl:grid-cols-[2fr_3fr]">
            <div className="min-w-0">
              <BalanceCard stats={stats} />
            </div>
            <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                title="Active Rules"
                value={`${rules.filter((r) => r.enabled).length}`}
                subtitle={`of ${rules.length} total`}
                index={1}
              />
              <StatCard
                title="Today"
                value={`${stats?.today?.spent || "0.00"} USDC`}
                subtitle={`${stats?.today?.txCount || 0} transactions`}
                index={2}
              />
              <StatCard
                title="All Time"
                value={`${stats?.allTime?.spent || "0.00"} USDC`}
                subtitle={`${stats?.allTime?.txCount || 0} transactions`}
                index={3}
              />
            </div>
          </section>

          <section>
            <h3 className="type-heading text-text mb-4">Quick actions</h3>
            <div className="border border-border bg-surface rounded-xl overflow-hidden">
              <Link
                href="/dashboard?tab=rules"
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <div className="type-subheading text-text">
                    Create a <span className="font-editorial">spend rule</span>
                  </div>
                  <div className="mt-1 type-body-sm text-text-3">
                    Set up subscriptions, tips, donations, or conditional payments.
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-text-3" />
              </Link>
              <button
                onClick={() => setTab("escrow")}
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 w-full text-left transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <div className="type-subheading text-text">
                    Create a <span className="font-editorial">smart escrow</span>
                  </div>
                  <div className="mt-1 type-body-sm text-text-3">
                    Hold payment until the agent completes the task.
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-text-3" />
              </button>
              <a
                href="https://t.me/vaixa_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <div className="type-subheading text-text">
                    Open <span className="font-editorial">Telegram Bot</span>
                  </div>
                  <div className="mt-1 type-body-sm text-text-3">
                    Use all agents directly in Telegram chat.
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-text-3" />
              </a>
              <Link
                href="/marketplace"
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <div className="type-subheading text-text">
                    Browse the <span className="font-editorial">marketplace</span>
                  </div>
                  <div className="mt-1 type-body-sm text-text-3">
                    Discover AI agents and pay per request via x402.
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 shrink-0 text-text-3" />
              </Link>
              <button
                onClick={togglePause}
                className="flex items-center justify-between gap-4 px-5 py-4 w-full text-left transition-colors hover:bg-surface-hover"
              >
                <div className="min-w-0">
                  <div className="type-subheading text-text">
                    {isPaused ? "Resume" : "Pause"}{" "}
                    <span className="font-editorial">PayAgent</span>
                  </div>
                  <div className="mt-1 type-body-sm text-text-3">
                    {isPaused
                      ? "Resume automatic payment execution."
                      : "Temporarily stop all scheduled payments."}
                  </div>
                </div>
                {isPaused ? (
                  <Play className="h-5 w-5 shrink-0 text-amber" />
                ) : (
                  <Pause className="h-5 w-5 shrink-0 text-text-3" />
                )}
              </button>
            </div>
          </section>

          {rules.length > 0 && (
            <section>
              <h3 className="type-heading text-text mb-4">Active Rules</h3>
              <div className="space-y-2">
                {rules.slice(0, 5).map((rule) => (
                  <div
                    key={rule.id}
                    className={`border border-border bg-surface rounded-xl px-4 py-3 flex items-center justify-between transition-opacity ${
                      rule.enabled ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-md font-medium ${
                          TYPE_STYLE[rule.type] || TYPE_STYLE.conditional
                        }`}
                      >
                        {rule.type}
                      </span>
                      <span className="text-[13px] font-medium text-text">
                        {rule.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[12px] text-text-3">
                        {rule.amount} USDC
                      </span>
                      <button
                        onClick={() => toggleRule(rule.id, !rule.enabled)}
                        className={`w-9 h-5 rounded-full relative transition-colors ${
                          rule.enabled ? "bg-accent/30" : "bg-border"
                        }`}
                      >
                        <span
                          className={`absolute top-[3px] w-3.5 h-3.5 rounded-full transition-all ${
                            rule.enabled
                              ? "left-[18px] bg-accent"
                              : "left-[3px] bg-text-3"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {tab === "rules" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <p className="type-caption text-text-3 mb-4">Spend Rules</p>
            {rules.length === 0 ? (
              <div className="border border-border bg-surface rounded-xl p-10 text-center">
                <p className="type-body-sm text-text-3">
                  No rules yet. Create one to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`border border-border bg-surface rounded-xl p-4 flex items-center justify-between transition-opacity ${
                      rule.enabled ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-md font-medium ${
                          TYPE_STYLE[rule.type] || TYPE_STYLE.conditional
                        }`}
                      >
                        {rule.type}
                      </span>
                      <div>
                        <span className="text-[13px] font-medium text-text">
                          {rule.name}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-text-3 mt-0.5 font-mono">
                          <span>{rule.amount} USDC</span>
                          {rule.scheduleFrequency && (
                            <span>{rule.scheduleFrequency}</span>
                          )}
                          <span>spent {rule.totalSpentToDate}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleRule(rule.id, !rule.enabled)}
                      className={`w-9 h-5 rounded-full relative transition-colors ${
                        rule.enabled ? "bg-accent/30" : "bg-border"
                      }`}
                    >
                      <span
                        className={`absolute top-[3px] w-3.5 h-3.5 rounded-full transition-all ${
                          rule.enabled
                            ? "left-[18px] bg-accent"
                            : "left-[3px] bg-text-3"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <p className="type-caption text-text-3 mb-4">Create</p>
            <SpendRuleForm onSubmit={handleAddRule} />
          </div>
        </div>
      )}

      {tab === "escrow" && (
        <div>
          <p className="type-caption text-text-3 mb-4">Smart Escrow</p>
          <div className="max-w-lg">
            <EscrowForm />
          </div>
        </div>
      )}

      {tab === "history" && (
        <div>
          <p className="type-caption text-text-3 mb-4">Transactions</p>

          {localTxs.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[14px] font-semibold text-text mb-3">From Web</h4>
              <div className="space-y-2">
                {localTxs.map((tx) => (
                  <div key={tx.id} className="border border-border bg-surface rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${tx.status === "success" ? "bg-accent" : "bg-red"}`} />
                      <div>
                        <span className="text-[13px] font-medium text-text">{tx.agentName}</span>
                        <div className="text-[11px] text-text-3 font-mono mt-0.5">
                          {new Date(tx.timestamp).toLocaleString()}
                          {tx.txHash && (
                            <> · <a
                              href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline"
                            >
                              {tx.txHash.slice(0, 10)}...
                            </a></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[13px] text-text font-medium">{tx.amount} USDC</span>
                      <div className="text-[11px] text-text-3">
                        {tx.status === "success" ? "Confirmed" : "Failed"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sharedTxs.length > 0 && (
            <div className="mb-6">
              <h4 className="text-[14px] font-semibold text-text mb-3">From Telegram Bot</h4>
              <div className="space-y-2">
                {sharedTxs.map((tx) => (
                  <div key={tx.id} className="border border-border bg-surface rounded-xl px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${tx.status === "success" ? "bg-accent" : "bg-red"}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium text-text">{tx.agentName}</span>
                          <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 font-medium">Telegram</span>
                        </div>
                        <div className="text-[11px] text-text-3 font-mono mt-0.5">
                          {new Date(tx.createdAt).toLocaleString()}
                          {tx.txHash && (
                            <> · <a
                              href={`https://testnet.snowtrace.io/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline"
                            >
                              {tx.txHash.slice(0, 10)}...
                            </a></>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-[13px] text-text font-medium">{tx.amount} USDC</span>
                      <div className="text-[11px] text-text-3">
                        {tx.status === "success" ? "Confirmed" : "Failed"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {transactions.length > 0 && (
            <div>
              <h4 className="text-[14px] font-semibold text-text mb-3">PayAgent Transactions</h4>
              <PaymentHistory transactions={transactions} />
            </div>
          )}

          {localTxs.length === 0 && sharedTxs.length === 0 && transactions.length === 0 && (
            <div className="border border-border bg-surface rounded-xl p-10 text-center">
              <p className="type-body-sm text-text-3">No transactions yet. Use an agent from the marketplace or Telegram bot to get started.</p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 mt-4 text-[13px] text-accent font-medium hover:underline"
              >
                Browse Agents <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}
