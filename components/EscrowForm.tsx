"use client";

import { useState } from "react";
import { Shield, Check, X, Clock, ArrowRight, Loader2 } from "lucide-react";

interface Escrow {
  id: string;
  task: string;
  amount: string;
  status: string;
  result?: string;
  createdAt: number;
}

const ESCROW_STATES = {
  PENDING: { label: "Pending", color: "bg-amber", text: "text-amber" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue", text: "text-blue" },
  AWAITING_RELEASE: { label: "Awaiting Release", color: "bg-purple", text: "text-purple" },
  COMPLETED: { label: "Completed", color: "bg-green", text: "text-green" },
  REFUNDED: { label: "Refunded", color: "bg-red", text: "text-red" },
};

const AGENTS = [
  { id: "code-review", name: "Code Review", price: "0.05 USDC" },
  { id: "summarizer", name: "Summarizer", price: "0.02 USDC" },
  { id: "translator", name: "Translator", price: "0.03 USDC" },
  { id: "sql-generator", name: "SQL Generator", price: "0.04 USDC" },
  { id: "regex-generator", name: "Regex Generator", price: "0.03 USDC" },
  { id: "code-explainer", name: "Code Explainer", price: "0.02 USDC" },
];

export default function EscrowForm() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [escrow, setEscrow] = useState<Escrow | null>(null);
  const [form, setForm] = useState({
    agentId: "code-review",
    task: "",
  });

  async function createEscrow() {
    if (!form.task.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: "0x" + form.agentId,
          amount: AGENTS.find(a => a.id === form.agentId)?.price.replace(" USDC", "") || "0.05",
          task: form.task,
        }),
      });
      
      const data = await res.json();
      
      if (data.escrowId) {
        setEscrow({
          id: data.escrowId,
          task: data.task,
          amount: data.amount,
          status: data.status,
          createdAt: Date.now(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function approveEscrow() {
    if (!escrow) return;
    
    setLoading(true);
    try {
      await fetch(`/api/escrow/${escrow.id}/approve`, {
        method: "POST",
      });
      
      setEscrow({ ...escrow, status: "COMPLETED" });
    } finally {
      setLoading(false);
    }
  }

  async function rejectEscrow() {
    if (!escrow) return;
    
    setLoading(true);
    try {
      await fetch(`/api/escrow/${escrow.id}/reject`, {
        method: "POST",
      });
      
      setEscrow({ ...escrow, status: "REFUNDED" });
    } finally {
      setLoading(false);
    }
  }

  if (!showForm && !escrow) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 border border-border bg-surface rounded-xl transition-colors hover:bg-surface-hover"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-subtle flex items-center justify-center">
            <Shield size={20} className="text-accent" strokeWidth={1.5} />
          </div>
          <div className="text-left">
            <div className="type-subheading text-text">Smart Escrow</div>
            <div className="type-body-sm text-text-3">Hold payment until task complete</div>
          </div>
        </div>
        <ArrowRight size={16} className="text-text-3" />
      </button>
    );
  }

  return (
    <div className="border border-border bg-surface rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-accent" strokeWidth={1.5} />
          <span className="type-subheading text-text">Smart Escrow</span>
        </div>
        {(escrow || showForm) && (
          <button onClick={() => { setShowForm(false); setEscrow(null); }} className="text-text-3 hover:text-text text-sm">
            Close
          </button>
        )}
      </div>

      {!escrow && (
        <div className="space-y-4">
          <div>
            <label className="type-body-sm text-text-3 block mb-1">Select Agent</label>
            <select
              value={form.agentId}
              onChange={(e) => setForm({ ...form, agentId: e.target.value })}
              className="w-full bg-bg border border-border px-3 py-2 text-text rounded-lg"
            >
              {AGENTS.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="type-body-sm text-text-3 block mb-1">Task Description</label>
            <textarea
              value={form.task}
              onChange={(e) => setForm({ ...form, task: e.target.value })}
              placeholder="Describe the task..."
              className="w-full bg-bg border border-border px-3 py-2 text-text rounded-lg h-24 resize-none"
            />
          </div>

          <button
            onClick={createEscrow}
            disabled={loading || !form.task.trim()}
            className="w-full h-10 bg-accent text-bg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Create Escrow"}
          </button>
        </div>
      )}

      {escrow && (
        <div className="space-y-4">
          <div className="bg-bg border border-border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="type-body-sm text-text-3">Escrow ID</span>
              <span className={`px-2 py-0.5 text-[10px] rounded ${ESCROW_STATES[escrow.status as keyof typeof ESCROW_STATES]?.color || "bg-gray"} text-white`}>
                {ESCROW_STATES[escrow.status as keyof typeof ESCROW_STATES]?.label || escrow.status}
              </span>
            </div>
            <div className="text-sm text-text mb-1">{escrow.task}</div>
            <div className="text-lg font-bold text-accent">{escrow.amount} USDC</div>
          </div>

          {escrow.status === "COMPLETED" && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <Check size={14} /> Payment released to agent
            </div>
          )}

          {escrow.status === "REFUNDED" && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <X size={14} /> Payment refunded
            </div>
          )}

          {escrow.status !== "COMPLETED" && escrow.status !== "REFUNDED" && (
            <div className="flex gap-2">
              <button
                onClick={approveEscrow}
                disabled={loading}
                className="flex-1 h-9 bg-green-500 text-white text-sm font-medium hover:bg-green-600 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "✓ Approve & Release"}
              </button>
              <button
                onClick={rejectEscrow}
                disabled={loading}
                className="flex-1 h-9 bg-red-500 text-white text-sm font-medium hover:bg-red-600 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : "✗ Reject & Refund"}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowForm(false)}
            className="w-full h-9 border border-border text-text-2 text-sm hover:bg-surface-hover"
          >
            Create New Escrow
          </button>
        </div>
      )}
    </div>
  );
}