"use client";

import { useState, useEffect } from "react";
import { Bot, MessageCircle, Code, FileText, Languages, Database, Regex, Lightbulb, Zap, GitBranch, Link as LinkIcon, Calendar, Settings, ExternalLink, Send, Hash, AtSign, X } from "lucide-react";

const BOT_COMMANDS = [
  { command: "start", description: "Register and connect wallet" },
  { command: "agents", description: "List all available AI agents" },
  { command: "help", description: "Show help message" },
  { command: "settings", description: "Bot settings" },
];

const AI_AGENTS = [
  { name: "Code Review", command: "/code", price: "0.05", icon: Code, description: "Analyze code for security, performance" },
  { name: "Summarizer", command: "/summarize", price: "0.02", icon: FileText, description: "Summarize text into bullets/TL;DR" },
  { name: "Translator", command: "/translate", price: "0.03", icon: Languages, description: "Translate between 50+ languages" },
  { name: "SQL Generator", command: "/sql", price: "0.04", icon: Database, description: "Generate SQL from natural language" },
  { name: "Regex Generator", command: "/regex", price: "0.03", icon: Regex, description: "Create regex patterns" },
  { name: "Code Explainer", command: "/explain", price: "0.02", icon: Lightbulb, description: "Explain code in plain English" },
];

const TOOL_INTEGRATIONS = [
  { name: "GitHub", icon: GitBranch, commands: ["issue", "pr", "repo", "search"] },
  { name: "Linear", icon: LinkIcon, commands: ["create", "list", "update"] },
  { name: "Notion", icon: Calendar, commands: ["page", "database", "query"] },
];

interface TelegramBotDemoProps {
  onOpenChat?: (chatId: string) => void;
}

export default function TelegramBotDemo({ onOpenChat }: TelegramBotDemoProps) {
  const [messages, setMessages] = useState<{ role: "user" | "bot"; content: string }[]>([
    { role: "bot", content: "👋 Welcome to Vaxa Bot!\n\nI'm your AI agent assistant on Telegram. Use /help to see available commands." },
  ]);
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInput("");

    setTimeout(() => {
      const response = getBotResponse(userMessage);
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
    }, 500);
  };

  const getBotResponse = (msg: string): string => {
    const cmd = msg.toLowerCase().split(" ")[0];

    switch (cmd) {
      case "/start":
        return "✅ Wallet connected!\n\nYour address: `0x742d...3f2a`\nBalance: 142.50 USDC\n\nYou can now use AI agents and tools.";
      case "/help":
        return `📋 *Available Commands*\n\n*AI Agents:*\n/code - Code review\n/summarize - Summarize text\n/translate - Translate\n/sql - SQL generator\n/regex - Regex generator\n/explain - Explain code\n\n*Tools:*\n/github - GitHub operations\n/linear - Linear issues\n/notion - Notion pages\n\n*Other:*\n/settings - Bot settings\n/help - This message`;
      case "/agents":
        return `🤖 *AI Agents*\n\n${AI_AGENTS.map((a) => `${a.command} - ${a.price} USDC\n   ${a.description}`).join("\n\n")}\n\nReply with agent command to use.`;
      case "/settings":
        return "⚙️ *Settings*\n\n• Notifications: ON\n• Auto-pay: OFF\n• Daily limit: 5.00 USDC\n• Default language: English\n\nUse /start to connect wallet.";
      case "/code":
        return "📝 *Code Review*\n\nSend me your code to analyze.\n\nExample:\n```js\nfunction hello() {\n  return 'world';\n}\n```\n\nPrice: 0.05 USDC";
      case "thank":
        return "🙏 You're welcome! Let me know if you need anything else.";
      default:
        return `I didn't understand that. Use /help to see available commands.`;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden max-w-md">
      <div className="bg-surface-muted border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent-subtle rounded-full flex items-center justify-center">
            <Bot size={16} className="text-accent" />
          </div>
          <div>
            <h3 className="text-[14px] font-semibold text-text">Vaxa Bot</h3>
            <span className="text-[11px] text-green-400">● Online</span>
          </div>
        </div>
        <button onClick={() => setShowCommands(!showCommands)} className="text-text-3 hover:text-text">
          <Settings size={16} />
        </button>
      </div>

      <div className="h-[300px] overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`text-[13px] leading-relaxed ${msg.role === "user" ? "text-right" : ""}`}>
            {msg.role === "bot" && <Bot size={14} className="text-accent inline mr-2" />}
<span className={msg.role === "user" ? "bg-accent-subtle px-3 py-2 inline-block rounded-lg" : "text-text-2"}>
              {msg.role === "bot" && <Bot size={14} className="text-accent inline mr-2" />}
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a command..."
            className="flex-1 bg-bg border border-border px-3 py-2 text-[13px] text-text placeholder:text-text-3 focus:outline-none"
          />
          <button onClick={handleSend} className="w-9 h-9 bg-accent text-bg flex items-center justify-center">
            <Send size={14} />
          </button>
        </div>
      </div>

      {showCommands && (
        <div className="border-t border-border p-3 bg-surface-muted">
          <div className="text-[11px] text-text-3 mb-2 uppercase tracking-wide">Quick Commands</div>
          <div className="grid grid-cols-2 gap-2">
            {BOT_COMMANDS.map((cmd) => (
              <button
                key={cmd.command}
                onClick={() => setInput(cmd.command)}
                className="text-left text-[12px] px-2 py-1.5 bg-bg border border-border text-text-2 hover:text-text hover:border-border-strong"
              >
                <span className="text-accent">{cmd.command}</span>
                <span className="text-text-3 ml-1">- {cmd.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}