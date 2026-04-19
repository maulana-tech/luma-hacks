import { NextRequest, NextResponse } from "next/server";
import { getEscrow, updateStatus, ESCROW_STATE } from "@/lib/escrow";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const escrow = getEscrow(id);
    
    if (!escrow) {
      return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
    }
    
    if (escrow.status !== ESCROW_STATE.PENDING) {
      return NextResponse.json(
        { error: `Cannot execute. Current status: ${escrow.status}` },
        { status: 400 }
      );
    }
    
    // Execute via agent
    updateStatus(id, ESCROW_STATE.IN_PROGRESS);
    
    // In real implementation, call actual AI agent here
    // For now, simulate result
    const result = `✅Escrow executed for task: ${escrow.task}\n\nThis would call the AI agent to perform the task.`;
    
    // Mark as awaiting release
    updateStatus(id, ESCROW_STATE.AWAITING_RELEASE, result);
    
    const updated = getEscrow(id);
    
    return NextResponse.json({
      escrowId: id,
      status: updated?.status,
      result: result,
      nextAction: "approve or reject",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Execute failed" },
      { status: 500 }
    );
  }
}