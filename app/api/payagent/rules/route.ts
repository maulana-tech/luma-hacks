import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({
    where: { ownerAddress },
    include: { rules: true },
  });

  if (!config) {
    return NextResponse.json({ rules: [] });
  }

  return NextResponse.json({ rules: config.rules });
}

export async function POST(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({ error: "PayAgent config not found. Create config first." }, { status: 404 });
  }

  const body = await req.json();

  const rule = await prisma.spendRule.create({
    data: {
      configId: config.id,
      name: body.name,
      type: body.type,
      recipientAgentId: body.recipientAgentId,
      recipientAddress: body.recipientAddress,
      amount: body.amount,
      scheduleFrequency: body.schedule?.frequency,
      scheduleDayOfWeek: body.schedule?.dayOfWeek,
      scheduleDayOfMonth: body.schedule?.dayOfMonth,
      scheduleTime: body.schedule?.time,
      conditionTrigger: body.condition?.trigger,
      conditionMinReputation: body.condition?.minReputationScore,
      conditionMaxDailyTriggers: body.condition?.maxDailyTriggers,
      enabled: body.enabled ?? true,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    },
  });

  return NextResponse.json(rule, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Rule id required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  const rule = await prisma.spendRule.update({
    where: { id, configId: config.id },
    data: {
      ...(updates.name !== undefined && { name: updates.name }),
      ...(updates.enabled !== undefined && { enabled: updates.enabled }),
      ...(updates.amount !== undefined && { amount: updates.amount }),
      ...(updates.recipientAddress !== undefined && { recipientAddress: updates.recipientAddress }),
      ...(updates.recipientAgentId !== undefined && { recipientAgentId: updates.recipientAgentId }),
      ...(updates.schedule !== undefined && {
        scheduleFrequency: updates.schedule?.frequency,
        scheduleDayOfWeek: updates.schedule?.dayOfWeek,
        scheduleDayOfMonth: updates.schedule?.dayOfMonth,
        scheduleTime: updates.schedule?.time,
      }),
      ...(updates.condition !== undefined && {
        conditionTrigger: updates.condition?.trigger,
        conditionMinReputation: updates.condition?.minReputationScore,
        conditionMaxDailyTriggers: updates.condition?.maxDailyTriggers,
      }),
      ...(updates.expiresAt !== undefined && { expiresAt: updates.expiresAt ? new Date(updates.expiresAt) : null }),
    },
  });

  return NextResponse.json(rule);
}

export async function DELETE(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Rule id required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  await prisma.spendRule.delete({ where: { id, configId: config.id } });
  return NextResponse.json({ success: true });
}
