import { NextRequest, NextResponse } from "next/server";
import { getTransactionHistory } from "@/agents/pay-agent/history";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({ transactions: [] });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const transactions = await getTransactionHistory(config.id, limit);
  return NextResponse.json({ transactions });
}
