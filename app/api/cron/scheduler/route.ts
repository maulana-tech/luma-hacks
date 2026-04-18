import { NextResponse } from "next/server";

async function executeRecurringPayments() {
  const { prisma } = await import("@/lib/db");
  const { enforceSpendingLimits } = await import("@/lib/spend-enforcer");
  const { getSignedContract } = await import("@/lib/contracts");
  const { ethers } = await import("ethers");

  const configs = await prisma.payAgentConfig.findMany({
    where: { isPaused: false },
    include: { rules: true },
  });

  const dayOfWeek = new Date().getDay();
  const dayOfMonth = new Date().getDate();
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentMinute = now.getUTCMinutes();

  for (const config of configs) {
    for (const rule of config.rules) {
      if (!rule.enabled) continue;
      if (rule.type !== "subscription" && rule.type !== "donation") continue;
      if (!rule.scheduleFrequency) continue;
      if (rule.expiresAt && new Date(rule.expiresAt) < now) continue;

      let shouldRun = false;
      switch (rule.scheduleFrequency) {
        case "daily": shouldRun = true; break;
        case "weekly": shouldRun = rule.scheduleDayOfWeek === dayOfWeek; break;
        case "monthly": shouldRun = rule.scheduleDayOfMonth === dayOfMonth; break;
        case "once": {
          const existingTx = await prisma.transaction.findFirst({
            where: { configId: config.id, ruleId: rule.id, status: "completed" },
          });
          shouldRun = !existingTx;
          break;
        }
      }
      if (!shouldRun) continue;

      if (rule.scheduleTime) {
        const [h, m] = rule.scheduleTime.split(":").map(Number);
        if (currentHour !== h || Math.abs(currentMinute - m) > 30) continue;
      }

      const recipient = rule.recipientAddress || rule.recipientAgentId;
      if (!recipient) continue;

      if (rule.conditionMinReputation) {
        try {
          const contract = getSignedContract();
          const score = await contract.getReputationScore(recipient);
          if (Number(score) < rule.conditionMinReputation) continue;
        } catch { continue; }
      }

      const result = await enforceSpendingLimits(config.id, rule.amount, recipient, rule.id);
      if (!result.allowed) continue;

      try {
        const provider = new ethers.JsonRpcProvider(process.env.AVALANCHE_RPC_URL);
        const wallet = new ethers.Wallet(process.env.PAY_AGENT_PRIVATE_KEY!, provider);
        const usdc = new ethers.Contract(
          process.env.USDC_CONTRACT_ADDRESS!,
          ["function transfer(address to, uint256 amount) returns (bool)"],
          wallet
        );
        const tx = await usdc.transfer(recipient, ethers.parseUnits(rule.amount, 6));
        await tx.wait();

        await prisma.transaction.create({
          data: {
            configId: config.id, ruleId: rule.id, type: rule.type,
            recipientAddress: recipient, amount: rule.amount, txHash: tx.hash, status: "completed",
          },
        });
        await prisma.spendRule.update({
          where: { id: rule.id },
          data: { totalSpentToDate: (parseFloat(rule.totalSpentToDate) + parseFloat(rule.amount)).toFixed(2) },
        });
      } catch (error) {
        await prisma.transaction.create({
          data: {
            configId: config.id, ruleId: rule.id, type: rule.type,
            recipientAddress: recipient, amount: rule.amount, status: "failed",
            metadata: JSON.stringify({ error: String(error) }),
          },
        });
      }
    }
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await executeRecurringPayments();
    return NextResponse.json({ ok: true, timestamp: Date.now() });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
