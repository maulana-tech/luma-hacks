import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }

  const config = await prisma.payAgentConfig.findUnique({ where: { ownerAddress } });
  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  await prisma.payAgentConfig.update({
    where: { ownerAddress },
    data: { isPaused: true },
  });

  return NextResponse.json({ success: true, isPaused: true });
}
