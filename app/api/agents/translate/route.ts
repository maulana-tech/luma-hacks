import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain, recordSuccessfulTx } from "@/lib/x402-middleware";
import { translate } from "@/agents/translator";

const AGENT_ADDRESS = process.env.TRANSLATOR_AGENT_ADDRESS || "0x0000000000000000000000000000000000000003";
const PRICE = "0.03";

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: AGENT_ADDRESS,
          price: PRICE,
          description: "Translation service — 1 request",
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
      description: "Translation service",
    });

    if (!verified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 402 });
    }

    const body = await req.json();
    const { text, targetLanguage } = body;

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: "Missing required fields: text, targetLanguage" },
        { status: 400 }
      );
    }

    const result = await translate(text, targetLanguage);

    recordSuccessfulTx(AGENT_ADDRESS, PRICE).catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Translator error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
