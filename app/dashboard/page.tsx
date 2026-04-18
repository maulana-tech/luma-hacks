"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import SpendRuleForm from "@/components/SpendRuleForm";
import PaymentHistory from "@/components/PaymentHistory";
import { Wallet, Activity, Settings, Clock, TrendingUp, Zap, Pause, Play } from "lucide-react";

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

function SpendGauge({ spent, limit, label }: { spent: string; limit: string; label: string }) {
  const pct = Math.min((parseFloat(spent) / parseFloat(limit)) * 100, 100);
  const r = 34;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  const color = pct > 80 ? "#ef4444" : pct > 60 ? "#e8a830" : "#00d4aa";

  return (
    <div className="border border-border bg-surface rounded-xl p-5 flex flex-col items-center">
      <svg width={80} height={80} className="-rotate-90 mb-2.5">
        <circle cx={40} cy={40} r={r} stroke="#2a2a2b" strokeWidth={4} fill="none" />
        <circle cx={40} cy={40} r={r} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <span className="font-mono text-[14px] font-semibold" style={{ color }}>{spent}</span>
      <span className="text-[11px] text-text-3 mt-0.5">of {limit} USDC</span>
      <span className="type-caption text-text-3 mt-2">{label}</span>
    </div>
  );
}

const TYPE_STYLE: Record<string, string> = {
  subscription: "bg-accent-subtle text-accent",
  tip: "bg-amber/15 text-amber",
  donation: "bg-violet/15 text-violet",
  conditional: "bg-blue/15 text-blue",
};

const TABS = [
  { key: "overview" as const, label: "Overview", icon: TrendingUp },
  { key: "rules" as const, label: "Rules", icon: Settings },
  { key: "history" as const, label: "History", icon: Clock },
];

type Tab = "overview" | "rules" | "history";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<Tab>("overview");
  const [rules, setRules] = useState<Rule[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<{ id: string; type: string; recipientAddress: string; amount: string; txHash: string | null; status: string; createdAt: string }[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const ownerAddress = address || "";

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
        if (hist.ok) setTransactions((await hist.json()).transactions || []);
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
        headers: { "Content-Type": "application/json", "x-owner-address": ownerAddress },
        body: JSON.stringify(rule),
      });
      if (res.ok) {
        const newRule = await res.json();
        setRules((prev) => [...prev, newRule]);
      }
    } catch {
      setRules((prev) => [...prev, { ...rule, id: `rule_${Date.now()}`, enabled: true, totalSpentToDate: "0.00" } as Rule]);
    }
  };

  const toggleRule = async (id: string, enabled: boolean) => {
    if (!ownerAddress) return;
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
    try {
      await fetch("/api/payagent/rules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-owner-address": ownerAddress },
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
      <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
        <h1 className="type-heading text-text mb-4">Dashboard</h1>
        <p className="type-body text-text-2 mb-6">Connect your wallet to manage your PayAgent.</p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="type-display text-[36px] mb-1">PayAgent</h1>
          <p className="font-mono text-[12px] text-text-3">{ownerAddress}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={togglePause}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12px] font-medium transition-colors ${
              isPaused ? "border-amber/30 bg-amber/10 text-amber" : "border-border bg-surface text-text-2 hover:border-border-strong"
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <div className="flex bg-surface border border-border rounded-lg p-0.5">
            {TABS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${
                    tab === t.key ? "bg-surface-hover text-text" : "text-text-3 hover:text-text-2"
                  }`}
                >
                  <Icon size={13} strokeWidth={1.5} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {tab === "overview" && (
        <div>
          <p className="type-caption text-text-3 mb-4">Spending Limits</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <SpendGauge spent={stats?.today?.spent || "0.00"} limit={stats?.today?.limit || "5.00"} label="Today" />
            <SpendGauge spent={stats?.thisWeek?.spent || "0.00"} limit={stats?.thisWeek?.limit || "20.00"} label="This Week" />
            <SpendGauge spent={stats?.thisMonth?.spent || "0.00"} limit={stats?.thisMonth?.limit || "50.00"} label="This Month" />
            <div className="border border-border bg-surface rounded-xl p-5 flex flex-col items-center justify-center">
              <span className="type-caption text-text-3 mb-2">All Time</span>
              <span className="font-mono text-[20px] font-semibold text-text">{stats?.allTime?.spent || "0.00"}</span>
              <span className="text-[11px] text-text-3 mt-0.5">{stats?.allTime?.txCount || 0} txs</span>
            </div>
          </div>
          <p className="type-caption text-text-3 mb-4">Details</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="border border-border bg-surface rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={14} className="text-text-3" strokeWidth={1.5} />
                <span className="type-caption text-text-3">Active Rules</span>
              </div>
              <span className="font-mono text-[24px] font-semibold text-accent">{rules.filter((r) => r.enabled).length}</span>
              <span className="text-[13px] text-text-3"> / {rules.length}</span>
            </div>
            <div className="border border-border bg-surface rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Wallet size={14} className="text-text-3" strokeWidth={1.5} />
                <span className="type-caption text-text-3">Network</span>
              </div>
              <span className="text-[14px] font-medium text-text">Avalanche Fuji</span>
              <br />
              <span className="text-[11px] text-text-3 font-mono">Chain ID 43113</span>
            </div>
            <div className="border border-border bg-surface rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-text-3" strokeWidth={1.5} />
                <span className="type-caption text-text-3">Token</span>
              </div>
              <span className="text-[14px] font-medium text-text">USDC</span>
              <br />
              <span className="text-[11px] text-text-3 font-mono">6 decimals</span>
            </div>
          </div>
        </div>
      )}

      {tab === "rules" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3">
            <p className="type-caption text-text-3 mb-4">Spend Rules</p>
            {rules.length === 0 ? (
              <div className="border border-border bg-surface rounded-xl p-10 text-center">
                <p className="type-body-sm text-text-3">No rules yet. Create one to get started.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {rules.map((rule) => (
                  <div key={rule.id} className={`border border-border bg-surface rounded-xl p-4 flex items-center justify-between transition-opacity ${rule.enabled ? "opacity-100" : "opacity-40"}`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-[10px] rounded-md font-medium ${TYPE_STYLE[rule.type] || TYPE_STYLE.conditional}`}>{rule.type}</span>
                      <div>
                        <span className="text-[13px] font-medium text-text">{rule.name}</span>
                        <div className="flex items-center gap-3 text-[11px] text-text-3 mt-0.5 font-mono">
                          <span>{rule.amount} USDC</span>
                          {rule.scheduleFrequency && <span>{rule.scheduleFrequency}</span>}
                          <span>spent {rule.totalSpentToDate}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleRule(rule.id, !rule.enabled)} className={`w-9 h-5 rounded-full relative transition-colors ${rule.enabled ? "bg-accent/30" : "bg-border"}`}>
                      <span className={`absolute top-[3px] w-3.5 h-3.5 rounded-full transition-all ${rule.enabled ? "left-[18px] bg-accent" : "left-[3px] bg-text-3"}`} />
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

      {tab === "history" && (
        <div>
          <p className="type-caption text-text-3 mb-4">Transactions</p>
          <PaymentHistory transactions={transactions} />
        </div>
      )}
    </div>
  );
}
