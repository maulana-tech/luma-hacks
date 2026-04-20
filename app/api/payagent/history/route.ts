import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConfig, getTransactions } from "@/lib/payagent-store";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  const config = getOrCreateConfig(ownerAddress);
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");
  const txs = getTransactions(config.id, limit);
  return NextResponse.json({ transactions: txs });
}
