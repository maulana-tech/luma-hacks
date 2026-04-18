import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain } from "@/lib/x402-middleware";

const MIN_TIP = 0.01;

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || "0.01";

    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: body.recipientAgentId || "0x0000000000000000000000000000000000000000",
          price: Math.max(parseFloat(amount), MIN_TIP).toFixed(2),
          description: "Tip to agent",
        }),
      },
      { status: 402 }
    );
  }

  try {
    const proof = JSON.parse(paymentProof);
    const body = await req.json();
    const { recipientAgentId, message, amount } = body;

    if (!recipientAgentId) {
      return NextResponse.json({ error: "Missing recipientAgentId" }, { status: 400 });
    }

    const tipAmount = Math.max(parseFloat(amount || "0.01"), MIN_TIP);

    const verified = await verifyPaymentOnChain(proof, {
      agentAddress: recipientAgentId,
      price: tipAmount.toFixed(2),
      description: "Tip to agent",
    });

    if (!verified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
    }

    return NextResponse.json({
      success: true,
      recipient: recipientAgentId,
      amount: tipAmount.toFixed(2),
      message: message || "",
      txHash: proof.txHash,
    });
  } catch (error) {
    console.error("Tip error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
