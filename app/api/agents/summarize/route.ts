import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain, recordSuccessfulTx } from "@/lib/x402-middleware";
import { summarize } from "@/agents/summarizer";

const AGENT_ADDRESS = process.env.SUMMARIZER_AGENT_ADDRESS || "0x0000000000000000000000000000000000000002";
const PRICE = "0.02";

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: AGENT_ADDRESS,
          price: PRICE,
          description: "Text summarization service — 1 request",
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
      description: "Text summarization service",
    });

    if (!verified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
    }

    const body = await req.json();
    const { text, style, maxLength } = body;

    if (!text) {
      return NextResponse.json({ error: "Missing required field: text" }, { status: 400 });
    }

    if (text.length > 10000) {
      return NextResponse.json({ error: "Text exceeds 10,000 character limit" }, { status: 400 });
    }

    const result = await summarize(text, style || "paragraph", maxLength || 200);

    recordSuccessfulTx(AGENT_ADDRESS, PRICE).catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Summarizer error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
