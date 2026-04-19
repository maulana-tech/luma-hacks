import { NextRequest, NextResponse } from "next/server";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: { id: number; is_bot: boolean; first_name: string; username?: string };
    chat: { id: number; type: string; username?: string; first_name?: string };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from?: { id: number; is_bot: boolean; first_name: string; username?: string };
    data: string;
    inline_message_id?: string;
  };
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const ADMIN_IDS = (process.env.TELEGRAM_ADMIN_IDS || "").split(",").map(Number);

async function sendMessage(chatId: number, text: string, replyMarkup?: unknown) {
  if (!BOT_TOKEN) return;
  
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
  return res.json();
}

async function editMessage(chatId: number, messageId: number, text: string, replyMarkup?: unknown) {
  if (!BOT_TOKEN) return;
  
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
  return res.json();
}

const AGENTS = {
  "/code": { name: "Code Review", price: "0.05", description: "Analyze code for security, performance, style" },
  "/summarize": { name: "Summarizer", price: "0.02", description: "Summarize text into bullets or TL;DR" },
  "/translate": { name: "Translator", price: "0.03", description: "Translate between 50+ languages" },
  "/sql": { name: "SQL Generator", price: "0.04", description: "Generate SQL from natural language" },
  "/regex": { name: "Regex Generator", price: "0.03", description: "Create regex patterns" },
  "/explain": { name: "Code Explainer", price: "0.02", description: "Explain code in plain English" },
};

function getHelpMessage() {
  return `🤖 *Vaxa Bot — AI Agent Marketplace*\n\nUse AI agents via Telegram. Pay with USDC on Avalanche.\n\n*Commands:*\n/start - Connect wallet\n/agents - List agents\n/code <code> - Code review\n/summarize <text> - Summarize\n/translate <text> - Translate\n/sql <description> - SQL gen\n/regex <pattern> - Regex gen\n/explain <code> - Explain code\n\n/tools - External tools\n/help - Help`;
}

function getAgentsMessage() {
  return `📦 *Available Agents*\n\n${Object.entries(AGENTS).map(([cmd, a]) => 
    `${cmd} — ${a.price} USDC\n   ${a.description}`
  ).join("\n\n")}\n\nReply with agent command to use.`;
}

function getToolsMessage() {
  return `🔧 *External Tools*\n\n*GitHub:*\n/github issue create <repo> <title>\n/github issue list <repo>\n/github pr <repo>\n\n*Linear:*\n/linear create <title>\n/linear list\n\n*Notion:*\n/notion create <title>\n/notion query <database>`;
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) {
    console.log("Telegram bot token not configured");
    return NextResponse.json({ ok: true });
  }

  try {
    const update: TelegramUpdate = await req.json();
    const chatId = update.message?.chat.id || update.callback_query?.from?.id;
    const text = update.message?.text || "";
    const callbackData = update.callback_query?.data;

    if (!chatId) {
      return NextResponse.json({ ok: true });
    }

    // Handle commands
    if (text.startsWith("/")) {
      const cmd = text.split(" ")[0].toLowerCase();
      const args = text.slice(cmd.length).trim();

      switch (cmd) {
        case "/start":
          await sendMessage(chatId, "✅ Wallet connected!\n\nYour address: `0x742d...3f2a`\nBalance: 142.50 USDC\n\nUse /agents to browse AI agents.");
          break;
        case "/help":
          await sendMessage(chatId, getHelpMessage());
          break;
        case "/agents":
          await sendMessage(chatId, getAgentsMessage());
          break;
        case "/tools":
          await sendMessage(chatId, getToolsMessage());
          break;
        case "/code":
        case "/summarize":
        case "/translate":
        case "/sql":
        case "/regex":
        case "/explain":
          const agent = AGENTS[cmd as keyof typeof AGENTS];
          if (agent) {
            await sendMessage(chatId, `📝 *${agent.name}*\n\nSend your ${agent.description}.\n\nPrice: ${agent.price} USDC\n\nExample: ${getExample(cmd)}`);
          }
          break;
        default:
          await sendMessage(chatId, "Unknown command. Use /help.");
      }
    } else if (callbackData?.startsWith("agent_")) {
      const agentCmd = callbackData.replace("agent_", "/");
      const agent = AGENTS[agentCmd as keyof typeof AGENTS];
      if (agent) {
        await sendMessage(chatId, `📝 *${agent.name}*\n\nSend your input.\n\nPrice: ${agent.price} USDC`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Vaxa Telegram Bot API", version: "1.0" });
}

function getExample(cmd: string): string {
  const examples: Record<string, string> = {
    "/code": "`function fib(n) { return n <= 1 ? n : fib(n-1) + fib(n-2); }`",
    "/summarize": `"Meeting discusses Q3 results with 15% growth..."`,
    "/translate": `"Hello world" → Spanish`,
    "/sql": `"Get all users with orders > 5"`,
    "/regex": `"Match email addresses"`,
    "/explain": "`const add = (a, b) => a + b;`",
  };
  return examples[cmd] || "your input";
}