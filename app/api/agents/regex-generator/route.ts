import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain, recordSuccessfulTx } from "@/lib/x402-middleware";
import { generateRegex } from "@/agents/regex-generator";

const PRICE = "0.03"; // 0.03 USDC
const RECIPIENT = process.env.CODE_REVIEW_AGENT_ADDRESS || "0x0000000000000000000000000000000000000001";

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: RECIPIENT,
          price: "0.03",
          description: "Regex Generation — 1 request",
        }),
      },
      { status: 402 }
    );
  }

  const proof = JSON.parse(paymentProof);
  const verified = await verifyPaymentOnChain(proof, {
    agentAddress: RECIPIENT,
    price: "0.03",
    description: "Regex Generation service",
  });

  if (!verified) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const { description, flavor } = body;

    if (!description) {
      return NextResponse.json(
        { error: "Missing 'description' field" },
        { status: 400 }
      );
    }

    const result = await generateRegex(description, flavor || "javascript");

    recordSuccessfulTx(RECIPIENT, "0.03").catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}