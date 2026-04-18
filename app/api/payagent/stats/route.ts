import { NextRequest, NextResponse } from "next/server";
import { getSpendingStats } from "@/agents/pay-agent/history";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({
      today: { spent: "0.00", limit: "5.00", remaining: "5.00", txCount: 0 },
      thisWeek: { spent: "0.00", limit: "20.00", remaining: "20.00", txCount: 0 },
      thisMonth: { spent: "0.00", limit: "50.00", remaining: "50.00", txCount: 0 },
      allTime: { spent: "0.00", txCount: 0 },
    });
  }

  const stats = await getSpendingStats(config.id);
  return NextResponse.json(stats);
}
