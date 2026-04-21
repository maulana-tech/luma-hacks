import { NextRequest, NextResponse } from "next/server";

interface UserRecord {
  telegramId: number;
  walletAddress: string;
  verified: boolean;
  verifiedAt: string;
}

const usersByTelegramId = new Map<number, UserRecord>();
const usersByWallet = new Map<string, UserRecord>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tid = searchParams.get("tid");
  const wallet = searchParams.get("wallet");

  if (tid) {
    const user = usersByTelegramId.get(parseInt(tid));
    return NextResponse.json({ user: user || null });
  }

  if (wallet) {
    const user = usersByWallet.get(wallet.toLowerCase());
    return NextResponse.json({ user: user || null });
  }

  return NextResponse.json({ error: "tid or wallet required" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const authKey = process.env.BOT_API_KEY || "vaxa-bot-internal";
  const headerKey = req.headers.get("x-bot-key");
  if (headerKey !== authKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tid = body.telegramId as number;
    const wallet = (body.walletAddress as string).toLowerCase();

    const record: UserRecord = {
      telegramId: tid,
      walletAddress: wallet,
      verified: true,
      verifiedAt: new Date().toISOString(),
    };

    usersByTelegramId.set(tid, record);
    usersByWallet.set(wallet, record);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
