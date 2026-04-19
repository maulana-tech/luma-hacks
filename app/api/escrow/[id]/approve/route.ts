import { NextRequest, NextResponse } from "next/server";
import { approveEscrow, getEscrow } from "@/lib/escrow";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = approveEscrow(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: result.message,
      escrow: result.escrow,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Approve failed" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const escrow = getEscrow(id);
    
    if (!escrow) {
      return NextResponse.json({ error: "Escrow not found" }, { status: 404 });
    }
    
    return NextResponse.json({ escrow });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Get failed" },
      { status: 500 }
    );
  }
}