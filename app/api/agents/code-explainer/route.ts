import { NextRequest, NextResponse } from "next/server";
import { buildPaymentRequired, verifyPaymentOnChain, recordSuccessfulTx } from "@/lib/x402-middleware";
import { explainCode } from "@/agents/code-explainer";

const PRICE = "0.02"; // 0.02 USDC
const RECIPIENT = process.env.CODE_REVIEW_AGENT_ADDRESS || "0x0000000000000000000000000000000000000001";

export async function POST(req: NextRequest) {
  const paymentProof = req.headers.get("x-payment-proof");

  if (!paymentProof) {
    return NextResponse.json(
      {
        error: "Payment required",
        "x-payment-required": buildPaymentRequired({
          agentAddress: RECIPIENT,
          price: "0.02",
          description: "Code Explanation — 1 request",
        }),
      },
      { status: 402 }
    );
  }

  const proof = JSON.parse(paymentProof);
  const verified = await verifyPaymentOnChain(proof, {
    agentAddress: RECIPIENT,
    price: "0.02",
    description: "Code Explanation service",
  });

  if (!verified) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const { code, language } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Missing 'code' field" },
        { status: 400 }
      );
    }

    const result = await explainCode(code, language || "javascript");

    recordSuccessfulTx(RECIPIENT, "0.02").catch(console.error);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Explanation failed" },
      { status: 500 }
    );
  }
}