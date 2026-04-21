import { NextRequest, NextResponse } from "next/server";

interface SharedTransaction {
  id: string;
  source: "web" | "telegram";
  agentName: string;
  agentType: string;
  amount: string;
  txHash: string;
  status: "success" | "error";
  userWalletAddress: string;
  result?: string;
  createdAt: string;
}

const sharedTransactions: SharedTransaction[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get("wallet");
  const limit = parseInt(searchParams.get("limit") || "50");

  let filtered = sharedTransactions;
  if (wallet) {
    filtered = filtered.filter(
      (t) => t.userWalletAddress.toLowerCase() === wallet.toLowerCase()
    );
  }

  const sorted = filtered
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

  return NextResponse.json({ transactions: sorted });
}

export async function POST(req: NextRequest) {
  const authKey = process.env.BOT_API_KEY || "vaxa-bot-internal";
  const headerKey = req.headers.get("x-bot-key");
  if (headerKey !== authKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tx: SharedTransaction = {
      id: body.id || `stx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source: body.source || "telegram",
      agentName: body.agentName || "Unknown",
      agentType: body.agentType || "unknown",
      amount: body.amount || "0.00",
      txHash: body.txHash || "",
      status: body.status || "success",
      userWalletAddress: body.userWalletAddress || "",
      result: body.result,
      createdAt: body.createdAt || new Date().toISOString(),
    };
    sharedTransactions.unshift(tx);
    if (sharedTransactions.length > 500) sharedTransactions.pop();

    return NextResponse.json({ ok: true, id: tx.id });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
