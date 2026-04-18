import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getOrCreateConfig } from "@/agents/pay-agent";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await getOrCreateConfig(ownerAddress);
  return NextResponse.json(config);
}

export async function PUT(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const body = await req.json();

  const config = await prisma.payAgentConfig.upsert({
    where: { ownerAddress },
    update: {
      dailySpendLimit: body.dailySpendLimit,
      weeklySpendLimit: body.weeklySpendLimit,
      monthlySpendLimit: body.monthlySpendLimit,
      maxSinglePayment: body.maxSinglePayment,
      allowedRecipients: body.allowedRecipients,
      blockedRecipients: body.blockedRecipients,
      notifyOnEveryTx: body.notifyOnEveryTx,
      notifyOnDailyLimit: body.notifyOnDailyLimit,
    },
    create: {
      ownerAddress,
      agentWalletAddress: body.agentWalletAddress || ownerAddress,
      dailySpendLimit: body.dailySpendLimit || "5.00",
      weeklySpendLimit: body.weeklySpendLimit || "20.00",
      monthlySpendLimit: body.monthlySpendLimit || "50.00",
      maxSinglePayment: body.maxSinglePayment || "2.00",
      allowedRecipients: body.allowedRecipients || [],
      blockedRecipients: body.blockedRecipients || [],
    },
    include: { rules: true },
  });

  return NextResponse.json(config);
}
