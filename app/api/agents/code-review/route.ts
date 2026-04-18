import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain, recordSuccessfulTx } from "@/lib/x402-middleware";
import { reviewCode } from "@/agents/code-review";

const AGENT_ADDRESS = process.env.CODE_REVIEW_AGENT_ADDRESS || "0x0000000000000000000000000000000000000001";
const PRICE = "0.05";

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: AGENT_ADDRESS,
          price: PRICE,
          description: "Code review service — 1 request",
        }),
      },
      { status: 402 }
    );
  }

  try {
    const proof = JSON.parse(paymentProof);
    const verified = await verifyPaymentOnChain(proof, {
      agentAddress: AGENT_ADDRESS,
      price: PRICE,
      description: "Code review service",
    });

    if (!verified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
    }

    const body = await req.json();
    const { code, language, focus } = body;

    if (!code || !language) {
      return NextResponse.json({ error: "Missing required fields: code, language" }, { status: 400 });
    }

    const result = await reviewCode(code, language, focus || "general");

    recordSuccessfulTx(AGENT_ADDRESS, PRICE).catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Code review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
