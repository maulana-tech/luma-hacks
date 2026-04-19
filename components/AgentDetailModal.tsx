"use client";

import { useState } from "react";
import { X, Copy, Check, Zap, BarChart3, Clock, TrendingUp, Shield, Code, FileText, Languages, Database, Regex, Lightbulb, type LucideIcon } from "lucide-react";

interface AgentData {
  id: string;
  name: string;
  serviceType: string;
  price: string;
  reputationScore: number;
  totalTxCount: number;
  address: string;
  description: string;
  category: string;
  features: string[];
}

interface AgentDetailModalProps {
  agent: AgentData | null;
  isOpen: boolean;
  onClose: () => void;
  onTryAgent: (agent: AgentData) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  "code-review": Code,
  summarizer: FileText,
  translator: Languages,
  "sql-generator": Database,
  "regex-generator": Regex,
  "code-explainer": Lightbulb,
};

const AGENT_DETAILS: Record<string, {
  howItWorks: string;
  useCases: string[];
  tips: string[];
  limitations: string[];
  exampleInput: string;
  exampleOutput: string;
}> = {
  "code-review": {
    howItWorks: "Analyzes your code for security vulnerabilities, performance bottlenecks, and style issues. Uses AI to suggest improvements with severity ratings.",
    useCases: ["Security audits before deployment", "Learning best practices", "Code review for PRs", "Performance optimization"],
    tips: ["Include the language parameter for better accuracy", "Use 'security' focus for critical projects", "Check line numbers for specific issues"],
    limitations: ["May miss context-specific vulnerabilities", "Cannot execute code to test runtime behavior", "Limited to static analysis"],
    exampleInput: `function fibonacci(n) {
  return fibonacci(n-1) + fibonacci(n-2);
}`,
    exampleOutput: `Issues found: 3

[High] Recursive function without memoization
  Line 2: Exponential time complexity O(2^n)
  Suggestion: Add memoization or use iterative approach

[Medium] Missing base case validation
  Line 1: No check for negative numbers
  Suggestion: Add input validation

Score: 72/100`
  },
  summarizer: {
    howItWorks: "Uses AI to distill long texts into concise summaries. Supports bullet points, paragraphs, or TL;DR formats with configurable length.",
    useCases: ["Meeting notes summarization", "Article highlights", "Document tl;dr", "Research paper abstracts"],
    tips: ["Use 'bullet' style for quick scanning", "Increase maxLength for more detail", "Best for texts 500-5000 words"],
    limitations: ["May miss nuanced details", "Performance degrades with very long texts", "Context limited to input text"],
    exampleInput: "The meeting discussed Q3 results exceeding expectations with 15% revenue growth...",
    exampleOutput: `Summary (Bullet):
- Q3 revenue up 15% YoY
- New product launch planned for Q4
- Marketing budget increased by 20%
- Team expanded by 5 new hires

Word count: 45`
  },
  translator: {
    howItWorks: "Provides context-aware translation across 50+ languages. Understands nuances, idioms, and domain-specific terminology.",
    useCases: ["Document translation", "Localization", "Learning languages", "Quick interpretation"],
    tips: ["Specify targetLanguage for best results", "Works best with clear, formal text", "Supports 50+ language pairs"],
    limitations: ["May struggle with idiomatic expressions", "Some language pairs less accurate", "Cannot translate images or scanned documents"],
    exampleInput: "Hello, how are you? I would like to learn more about your products.",
    exampleOutput: `Translated (Spanish):
"Hola, ¿cómo estás? Me gustaría aprender más sobre tus productos."

Detected: English
Confidence: 98%`
  },
  "sql-generator": {
    howItWorks: "Generates optimized SQL queries from natural language descriptions. Supports PostgreSQL, MySQL, SQLite, and explains the query logic.",
    useCases: ["Quick query building", "Learning SQL", "Schema design", "Data extraction"],
    tips: ["Specify dialect (postgresql/mysql/sqlite)", "Include table names in description", "Add ORDER BY/LIMIT for specific needs"],
    limitations: ["Cannot see your actual schema", "May need adjustment for complex joins", "Does not execute queries"],
    exampleInput: "Get all users who signed up in 2024 with more than 5 orders",
    exampleOutput: `SELECT u.*, COUNT(o.id) as order_count
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2024-01-01'
  AND u.created_at < '2025-01-01'
GROUP BY u.id
HAVING COUNT(o.id) > 5
ORDER BY u.created_at DESC;

Dialect: PostgreSQL
Indexes recommended: users(created_at), orders(user_id)`
  },
  "regex-generator": {
    howItWorks: "Creates regex patterns from descriptions with explanations and test cases. Supports JavaScript, Python, and other flavors.",
    useCases: ["Form validation", "Data extraction", "Pattern matching", "Input sanitization"],
    tips: ["Specify flavor (javascript/python/go)", "Include edge cases in description", "Test with the generated test cases"],
    limitations: ["Cannot visualize complex patterns", "May generate overly complex expressions", "Some advanced features not supported"],
    exampleInput: "Match email addresses that end with .org or .edu",
    exampleOutput: `Pattern: /[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)(?:org|edu)$/gi

Explanation:
- [a-zA-Z0-9._%+-]+ = local part
- @ = literal @
- (?:[a-zA-Z0-9-]+\\.) = domain with dot
- (?:org|edu) = TLD (org or edu)
- $ = end of string

Test cases:
✓ test@university.edu
✓ user@company.org
✗ test@example.com`
  },
  "code-explainer": {
    howItWorks: "Explains any code snippet in plain English with line-by-line breakdown. Covers concepts, terminology, and provides usage examples.",
    useCases: ["Learning new code", "Code review understanding", "Documentation", "Interview prep"],
    tips: ["Specify language for better accuracy", "Works with any programming language", "Ask follow-up questions for deeper explanations"],
    limitations: ["Cannot explain entire large codebases", "May miss architectural context", "Best for snippets under 100 lines"],
    exampleInput: `const add = (a, b) => a + b;`,
    exampleOutput: `Line-by-line explanation:

1. const add = 
   Declares a constant variable named 'add'

2. (a, b) => 
   Arrow function with parameters a and b

3. a + b
   Returns the sum of a and b

Concepts: Arrow Functions, Const Declaration, JavaScript Operators

This is an ES6 arrow function - a concise way to write functions.`
  },
};

function ReputationBadge({ score }: { score: number }) {
  const tier = score >= 800 ? "Platinum" : score >= 500 ? "Gold" : score >= 200 ? "Silver" : "Bronze";
  const color = score >= 800 ? "#b7d941" : score >= 500 ? "#4ea8f6" : score >= 200 ? "#e8a830" : "#888";

  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] font-medium" style={{ color }}>{tier}</span>
      <span className="text-[12px] text-text-3 font-mono">{score}/1000</span>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${
        active
          ? "border-accent text-text"
          : "border-transparent text-text-3 hover:text-text-2"
      }`}
    >
      {children}
    </button>
  );
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[11px] text-text-3 uppercase tracking-wide">{label}</span>
        <button onClick={handleCopy} className="flex items-center gap-1 text-[11px] text-text-3 hover:text-text transition-colors">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-bg border border-border rounded-none p-4 text-[12px] font-mono text-text-2 overflow-x-auto whitespace-pre-wrap">
        {code}
      </pre>
    </div>
  );
}

export default function AgentDetailModal({ agent, isOpen, onClose, onTryAgent }: AgentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "examples" | "analysis">("overview");

  if (!isOpen || !agent) return null;

  const Icon = ICON_MAP[agent.serviceType] || Code;
  const details = AGENT_DETAILS[agent.serviceType];

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-surface border border-border rounded-none max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-subtle flex items-center justify-center">
              <Icon size={24} className="text-accent" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-text">{agent.name}</h2>
              <span className="text-[12px] text-text-3 uppercase tracking-wide">{agent.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-text-3 hover:text-text transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-surface-muted">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>Overview</TabButton>
          <TabButton active={activeTab === "examples"} onClick={() => setActiveTab("examples")}>Examples</TabButton>
          <TabButton active={activeTab === "analysis"} onClick={() => setActiveTab("analysis")}>Analysis</TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg border border-border p-4">
                  <div className="text-[11px] text-text-3 uppercase tracking-wide mb-1">Price per request</div>
                  <div className="text-[24px] font-bold text-accent font-mono">{agent.price} <span className="text-[14px] text-text-3">USDC</span></div>
                </div>
                <div className="bg-bg border border-border p-4">
                  <div className="text-[11px] text-text-3 uppercase tracking-wide mb-1">Reputation</div>
                  <ReputationBadge score={agent.reputationScore} />
                  <div className="text-[11px] text-text-3 mt-1">{agent.totalTxCount.toLocaleString()} transactions</div>
                </div>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-text mb-2">Description</h3>
                <p className="text-[14px] text-text-2 leading-relaxed">{agent.description}</p>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-text mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.features.map((f) => (
                    <span key={f} className="text-[12px] bg-bg border border-border px-3 py-1.5 text-text-2">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Zap, label: "x402 Payments", value: "HTTP-native" },
                  { icon: TrendingUp, label: "ERC-8004", value: "On-chain" },
                  { icon: Shield, label: "Avalanche", value: "Fuji Testnet" },
                ].map((item) => (
                  <div key={item.label} className="bg-bg border border-border p-3 text-center">
                    <item.icon size={16} className="text-accent mx-auto mb-1" strokeWidth={1.5} />
                    <div className="text-[10px] text-text-3">{item.label}</div>
                    <div className="text-[12px] font-medium text-text">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "examples" && details && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-text mb-3">Input Example</h3>
                <CodeBlock code={details.exampleInput} label="Your input" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-text mb-3">Output Example</h3>
                <CodeBlock code={details.exampleOutput} label="Agent response" />
              </div>
            </div>
          )}

          {activeTab === "analysis" && details && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-semibold text-text mb-2 flex items-center gap-2">
                  <Zap size={14} className="text-accent" /> How it works
                </h3>
                <p className="text-[14px] text-text-2 leading-relaxed">{details.howItWorks}</p>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-text mb-2">Use Cases</h3>
                <ul className="space-y-2">
                  {details.useCases.map((uc, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-text-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                      {uc}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[14px] font-semibold text-text mb-2 flex items-center gap-2">
                  <BarChart3 size={14} className="text-accent" /> Tips for best results
                </h3>
                <ul className="space-y-2">
                  {details.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-text-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber/5 border border-amber/20 p-4">
                <h3 className="text-[13px] font-semibold text-amber mb-2">Limitations</h3>
                <ul className="space-y-1">
                  {details.limitations.map((lim, i) => (
                    <li key={i} className="text-[12px] text-text-2">• {lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border bg-surface-muted">
          <button
            onClick={() => onTryAgent(agent)}
            className="w-full h-11 bg-accent text-bg text-[14px] font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Try this agent — {agent.price} USDC
          </button>
        </div>
      </div>
    </div>
  );
}