import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConfig, setPaused } from "@/lib/payagent-store";

export async function POST(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  getOrCreateConfig(ownerAddress);
  const ok = setPaused(ownerAddress, true);
  if (!ok) return NextResponse.json({ error: "Config not found" }, { status: 404 });
  return NextResponse.json({ success: true, isPaused: true });
}
