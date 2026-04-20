import { NextRequest, NextResponse } from "next/server";
import { getOrCreateConfig, addRule, updateRule, deleteRule } from "@/lib/payagent-store";

export async function GET(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  const config = getOrCreateConfig(ownerAddress);
  return NextResponse.json({ rules: config.rules });
}

export async function POST(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  getOrCreateConfig(ownerAddress);
  const body = await req.json();
  const rule = addRule(ownerAddress, body);
  return NextResponse.json(rule, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "Rule id required" }, { status: 400 });
  const rule = updateRule(ownerAddress, body.id, body);
  if (!rule) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  return NextResponse.json(rule);
}

export async function DELETE(req: NextRequest) {
  const ownerAddress = req.headers.get("x-owner-address");
  if (!ownerAddress) {
    return NextResponse.json({ error: "x-owner-address header required" }, { status: 400 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Rule id required" }, { status: 400 });
  const ok = deleteRule(ownerAddress, id);
  if (!ok) return NextResponse.json({ error: "Rule not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
