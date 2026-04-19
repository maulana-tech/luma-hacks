import { NextRequest, NextResponse } from "next/server";
import { createEscrow } from "@/lib/escrow";
import { buildPaymentRequired } from "@/lib/x402-middleware";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, amount, task, language, timeout } = body;
    
    if (!agentId || !amount || !task) {
      return NextResponse.json(
        { error: "agentId, amount, task required" },
        { status: 400 }
      );
    }
    
    // Create escrow in memory (or DB later)
    const escrow = createEscrow({
      userId: "user_" + Date.now(), // In real app, get from auth
      agentId,
      amount,
      task,
      language,
      timeout,
    });
    
    // Return payment requirement
    return NextResponse.json({
      escrowId: escrow.id,
      status: escrow.status,
      task: escrow.task,
      amount: escrow.amount,
      "x-payment-required": buildPaymentRequired({
        agentAddress: escrow.agentId,
        price: escrow.amount,
        description: `Escrow for: ${escrow.task.slice(0, 50)}`,
      }),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Create failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: "/api/escrow/create",
    method: "POST",
    body: {
      agentId: "0x...",
      amount: "0.05",
      task: "Code review my code",
      language: "typescript",
      timeout: 3600,
    },
  });
}