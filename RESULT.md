# RESULT.md — Vaxa: AI Agent Marketplace on Avalanche

> SCBC Hackathon — Avalanche Agentic Payments Track ($7,500)

---

## Quick Links

| Resource | URL |
|---|---|
| **Live App** | https://scbc-hacks.vercel.app |
| **Marketplace** | https://scbc-hacks.vercel.app/marketplace |
| **Dashboard** | https://scbc-hacks.vercel.app/dashboard |
| **Telegram Bot** | https://t.me/vaixa_bot |
| **GitHub** | https://github.com/maulana-tech/scbc-hacks |
| **Network** | Avalanche Fuji Testnet (Chain ID: 43113) |
| **Explorer** | https://testnet.snowtrace.io |

---

## Test Wallets

### Deployer / Agent Wallet
```
Address:  0x97aD69De60Cac876658496175915A15641aCb42f
Private:  0x17f774ea935fd9225418fb797ed468656306d5610f5beba8d6102c784b646631
Balance:  0.2 AVAX + MockUSDC
```

### User Wallet (for testing)
```
Address:  0x72092971935F31734118fD869A768aE17C84dd0B
Balance:  0.3 AVAX + 50.0 MockUSDC
```

---

## Deployed Contracts (Avalanche Fuji)

| Contract | Address |
|---|---|
| **MockUSDC** | `0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e` |
| **AgentRegistry (ERC-8004)** | `0xD78f9aAD50e6a95dC527Ea8DF0637AF506A179a8` |
| **PaymentProcessor** | `0x69094099B8C0df734C855B36eD3e6D484418d5D2` |

---

## AI Agents (6 Live)

| Agent | Endpoint | Price | Model |
|---|---|---|---|
| Code Review | `POST /api/agents/code-review` | 0.05 USDC | NVIDIA Nemotron 49B |
| Summarizer | `POST /api/agents/summarize` | 0.02 USDC | NVIDIA Nemotron 49B |
| Translator | `POST /api/agents/translate` | 0.03 USDC | NVIDIA Nemotron 49B |
| SQL Generator | `POST /api/agents/sql-generator` | 0.04 USDC | NVIDIA Nemotron 49B |
| Regex Generator | `POST /api/agents/regex-generator` | 0.03 USDC | NVIDIA Nemotron 49B |
| Code Explainer | `POST /api/agents/code-explainer` | 0.02 USDC | NVIDIA Nemotron 49B |

---

## Test Results

### 1. x402 Payment Flow (End-to-End)

**Step 1: Get 402 Payment Required**
```bash
curl -X POST https://scbc-hacks.vercel.app/api/agents/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Avalanche blockchain","style":"tldr"}'
```

**Result (402):**
```json
{
  "error": "Payment required",
  "x-payment-required": {
    "version": "1.0",
    "network": "avalanche-fuji",
    "chainId": 43113,
    "token": "USDC",
    "tokenAddress": "0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e",
    "amount": "20000",
    "decimals": 6,
    "recipient": "0x97aD69De60Cac876658496175915A15641aCb42f",
    "description": "Text summarization service — 1 request",
    "expiresAt": 1776681100,
    "paymentProcessor": "0x69094099B8C0df734C855B36eD3e6D484418d5D2",
    "requestId": "0xc79895cd..."
  }
}
```

**Step 2: Send USDC on Avalanche Fuji**
```bash
# Using ethers.js
node -e "
const { ethers } = require('ethers');
const provider = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
const wallet = new ethers.Wallet('PRIVATE_KEY', provider);
const usdc = new ethers.Contract(
  '0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e',
  ['function transfer(address,uint256) returns (bool)'],
  wallet
);
const tx = await usdc.transfer('0x97aD69De60Cac876658496175915A15641aCb42f', ethers.parseUnits('0.02', 6));
await tx.wait();
console.log('TX Hash:', tx.hash);
"
```

**Confirmed on-chain TX:** `0x902da6371ce6a85b886269a24aa0f26540d3687b088154f26c583a721673c466`

**Step 3: Call with Payment Proof**
```bash
curl -X POST http://localhost:3000/api/agents/summarize \
  -H "Content-Type: application/json" \
  -H 'X-Payment-Proof: {"txHash":"0x902da...c466","recipient":"0x97aD...Cb42f","amount":"20000","tokenAddress":"0x48FE...A339e"}' \
  -d '{"text":"Avalanche is a blockchain platform with sub-second finality.","style":"tldr","maxLength":100}'
```

**Result (200 OK):**
```json
{
  "summary": "Avalanche: Sub-second finality blockchain with EVM compatibility, custom subnets, and VMs for dApps.",
  "wordCount": 13
}
```

**ERC-8004 Reputation Updated:** `recordSuccessfulTx()` called on-chain.

---

### 2. PayAgent API Tests

All tests using wallet `0x72092971935F31734118fD869A768aE17C84dd0B`:

**Get Config:**
```bash
curl https://scbc-hacks.vercel.app/api/payagent/config \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B"
```
```json
{
  "id": "cfg_1776680702031_x3dmqs8",
  "ownerAddress": "0x72092971935F31734118fD869A768aE17C84dd0B",
  "dailySpendLimit": "3.00",
  "weeklySpendLimit": "15.00",
  "monthlySpendLimit": "40.00",
  "maxSinglePayment": "1.00",
  "isPaused": false,
  "rules": [...]
}
```

**Create Subscription Rule:**
```bash
curl -X POST https://scbc-hacks.vercel.app/api/payagent/rules \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Summarizer",
    "type": "subscription",
    "amount": "0.50",
    "recipientAddress": "0x97aD69De60Cac876658496175915A15641aCb42f",
    "schedule": {"frequency": "weekly", "dayOfWeek": 1, "time": "08:00"}
  }'
```
```json
{
  "id": "rule_1776680702034_uuueuu6",
  "name": "Weekly Summarizer",
  "type": "subscription",
  "amount": "0.50",
  "scheduleFrequency": "weekly",
  "scheduleDayOfWeek": 1,
  "scheduleTime": "08:00",
  "enabled": true,
  "totalSpentToDate": "0.00"
}
```

**Create Tip Rule:**
```bash
curl -X POST https://scbc-hacks.vercel.app/api/payagent/rules \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Auto-tip Code Review",
    "type": "tip",
    "amount": "0.10",
    "recipientAddress": "0x97aD69De60Cac876658496175915A15641aCb42f"
  }'
```

**Create Donation Rule:**
```bash
curl -X POST https://scbc-hacks.vercel.app/api/payagent/rules \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly OSS Donation",
    "type": "donation",
    "amount": "2.00",
    "recipientAddress": "0x97aD69De60Cac876658496175915A15641aCb42f",
    "schedule": {"frequency": "monthly", "dayOfMonth": 1}
  }'
```

**Get Spending Stats:**
```bash
curl https://scbc-hacks.vercel.app/api/payagent/stats \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B"
```
```json
{
  "today": {"spent": "0.00", "limit": "3.00", "remaining": "3.00", "txCount": 0},
  "thisWeek": {"spent": "0.00", "limit": "15.00", "remaining": "15.00", "txCount": 0},
  "thisMonth": {"spent": "0.00", "limit": "40.00", "remaining": "40.00", "txCount": 0},
  "allTime": {"spent": "0.00", "txCount": 0}
}
```

**Pause / Resume:**
```bash
curl -X POST https://scbc-hacks.vercel.app/api/payagent/pause \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B"
# => {"success": true, "isPaused": true}

curl -X POST https://scbc-hacks.vercel.app/api/payagent/resume \
  -H "x-owner-address: 0x72092971935F31734118fD869A768aE17C84dd0B"
# => {"success": true, "isPaused": false}
```

---

### 3. Smart Escrow Tests

```bash
# Create escrow
curl -X POST https://scbc-hacks.vercel.app/api/escrow/create \
  -H "Content-Type: application/json" \
  -d '{"agentId":"0xcode-review","amount":"0.05","task":"Review this function for security issues"}'

# Approve & release payment
curl -X POST https://scbc-hacks.vercel.app/api/escrow/{escrowId}/approve

# Reject & refund
curl -X POST https://scbc-hacks.vercel.app/api/escrow/{escrowId}/reject
```

---

### 4. Cron Scheduler (Recurring Payments)

```bash
curl https://scbc-hacks.vercel.app/api/cron/scheduler \
  -H "authorization: Bearer YOUR_CRON_SECRET"
```

```json
{
  "ok": true,
  "timestamp": "2026-04-20T10:25:00.000Z",
  "configsChecked": 1,
  "executed": ["Weekly Summarizer: 0.50 USDC -> 0x97aD..."],
  "skipped": ["Monthly OSS Donation: not scheduled"]
}
```

---

## Test Scripts

### Setup: Fund Test Wallet

```bash
# 1. Mint 100 MockUSDC
DEPLOYER_PRIVATE_KEY=0x17f774ea935fd9225418fb797ed468656306d5610f5beba8d6102c784b646631 \
USDC_CONTRACT_ADDRESS=0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e \
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc \
npx tsx scripts/faucet-mockusdc.ts --amount 100

# 2. Transfer USDC to user
npx tsx -e "
const { ethers } = require('ethers');
const p = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, p);
const c = new ethers.Contract('0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e', ['function transfer(address,uint256) returns (bool)'], w);
const tx = await c.transfer('0x72092971935F31734118fD869A768aE17C84dd0B', ethers.parseUnits('50', 6));
await tx.wait();
console.log('Sent 50 USDC:', tx.hash);
"
```

### Full x402 Payment Test

```bash
#!/bin/bash
# test-x402.sh — Full end-to-end x402 payment test

API="http://localhost:3000"
DEPLOYER_KEY="0x17f774ea935fd9225418fb797ed468656306d5610f5beba8d6102c784b646631"
USDC="0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e"
AGENT="0x97aD69De60Cac876658496175915A15641aCb42f"

echo "Step 1: Get 402..."
RESP=$(curl -s -X POST "$API/api/agents/summarize" \
  -H "Content-Type: application/json" \
  -d '{"text":"Avalanche blockchain test","style":"tldr"}')
echo "$RESP" | python3 -m json.tool

echo ""
echo "Step 2: Send USDC on-chain..."
TX_HASH=$(node -e "
const { ethers } = require('ethers');
async function main() {
  const p = new ethers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc');
  const w = new ethers.Wallet('$DEPLOYER_KEY', p);
  const c = new ethers.Contract('$USDC', ['function transfer(address,uint256) returns (bool)'], w);
  const tx = await c.transfer('$AGENT', ethers.parseUnits('0.02', 6));
  await tx.wait();
  console.log(tx.hash);
}
main();
")
echo "TX: $TX_HASH"

echo ""
echo "Step 3: Call with proof..."
curl -s -X POST "$API/api/agents/summarize" \
  -H "Content-Type: application/json" \
  -H "X-Payment-Proof: {\"txHash\":\"$TX_HASH\",\"recipient\":\"$AGENT\",\"amount\":\"20000\",\"tokenAddress\":\"$USDC\"}" \
  -d '{"text":"Avalanche blockchain sub-second finality","style":"tldr","maxLength":100}' | python3 -m json.tool
```

### PayAgent Full Test

```bash
#!/bin/bash
# test-payagent.sh

API="https://scbc-hacks.vercel.app"
ADDR="0x72092971935F31734118fD869A768aE17C84dd0B"
H1="-H x-owner-address:$ADDR"
H2="-H Content-Type:application/json"

echo "=== Config ==="
curl -s "$API/api/payagent/config" $H1 | python3 -m json.tool

echo "=== Update Limits ==="
curl -s -X PUT "$API/api/payagent/config" $H1 $H2 \
  -d '{"dailySpendLimit":"3.00","weeklySpendLimit":"15.00","monthlySpendLimit":"40.00"}' | python3 -m json.tool

echo "=== Add Subscription ==="
curl -s -X POST "$API/api/payagent/rules" $H1 $H2 \
  -d '{"name":"Weekly Summarizer","type":"subscription","amount":"0.50","recipientAddress":"0x97aD69De60Cac876658496175915A15641aCb42f","schedule":{"frequency":"weekly","dayOfWeek":1}}' | python3 -m json.tool

echo "=== Add Tip ==="
curl -s -X POST "$API/api/payagent/rules" $H1 $H2 \
  -d '{"name":"Auto-tip","type":"tip","amount":"0.10","recipientAddress":"0x97aD69De60Cac876658496175915A15641aCb42f"}' | python3 -m json.tool

echo "=== Stats ==="
curl -s "$API/api/payagent/stats" $H1 | python3 -m json.tool

echo "=== Pause ==="
curl -s -X POST "$API/api/payagent/pause" $H1 | python3 -m json.tool

echo "=== Resume ==="
curl -s -X POST "$API/api/payagent/resume" $H1 | python3 -m json.tool

echo "=== Rules ==="
curl -s "$API/api/payagent/rules" $H1 | python3 -m json.tool

echo "=== History ==="
curl -s "$API/api/payagent/history?limit=10" $H1 | python3 -m json.tool
```

---

## Architecture

```
User / Telegram Bot
       │
       ▼
┌─────────────────────────────────────────────┐
│           Vaxa (Next.js 16)                 │
│           scbc-hacks.vercel.app             │
│                                              │
│  ┌────────────┐  ┌────────────────────────┐ │
│  │  Landing    │  │   6 AI Service Agents  │ │
│  │  Marketplace│  │   x402 Paywall         │ │
│  │  Dashboard  │  │   NVIDIA NIM + OpenRouter│ │
│  └────────────┘  └────────┬───────────────┘ │
│                           │                   │
│  ┌────────────────────────▼───────────────┐  │
│  │         PayAgent (In-Memory)           │  │
│  │  - Spend Rules (sub/tip/donation)      │  │
│  │  - Enforcement (daily/weekly/monthly)  │  │
│  │  - Cron Scheduler (recurring payments) │  │
│  └────────────────┬──────────────────────┘  │
│                   │                           │
│  ┌────────────────▼──────────────────────┐  │
│  │        Smart Escrow                   │  │
│  │  Create → Execute → Approve / Reject  │  │
│  └────────────────┬──────────────────────┘  │
└───────────────────┼─────────────────────────┘
                    │
         ┌──────────▼──────────┐
         │  Avalanche C-Chain   │
         │  Fuji Testnet 43113  │
         │                      │
         │  MockUSDC            │
         │  AgentRegistry       │
         │  PaymentProcessor    │
         └──────────────────────┘
```

---

## AI Provider Stack

| Priority | Provider | Model | API |
|---|---|---|---|
| **Primary** | NVIDIA NIM | `nvidia/llama-3.3-nemotron-super-49b-v1` | `integrate.api.nvidia.com/v1` |
| Fallback 2 | NVIDIA NIM | `meta/llama-3.3-70b-instruct` | `integrate.api.nvidia.com/v1` |
| Fallback 3 | NVIDIA NIM | `nvidia/llama-3.1-nemotron-nano-8b-v1` | `integrate.api.nvidia.com/v1` |
| Fallback 4 | OpenRouter | `nvidia/nemotron-3-super-120b-a12b:free` | `openrouter.ai/api/v1` |
| Fallback 5 | OpenRouter | `openai/gpt-oss-120b:free` | `openrouter.ai/api/v1` |
| Fallback 6 | OpenRouter | `google/gemma-4-26b-a4b-it:free` | `openrouter.ai/api/v1` |
| Fallback 7 | OpenRouter | `liquid/lfm-2.5-1.2b-instruct:free` | `openrouter.ai/api/v1` |

All providers use OpenAI-compatible API via the `openai` npm package.

---

## Spend Enforcement Logic

Before every payment, PayAgent checks in order:

1. `config.isPaused` — reject if paused
2. `amount > maxSinglePayment` — reject
3. `recipient in blockedRecipients` — reject
4. `allowedRecipients not empty AND recipient not in list` — reject
5. `dailySpent + amount > dailySpendLimit` — reject
6. `weeklySpent + amount > weeklySpendLimit` — reject
7. `monthlySpent + amount > monthlySpendLimit` — reject
8. All passed — execute USDC transfer on Avalanche

---

## ERC-8004 Reputation Algorithm

```
newScore = min(1000, currentScore + delta)

delta:
  Tx #1:        +20 points
  Tx #2–10:     +5 points each
  Tx #11–50:    +2 points each
  Tx #51+:      +1 point each
  amount > 0.1: +1 bonus point
```

---

## Telegram Bot Commands

| Command | Description |
|---|---|
| `/start` | Register & connect wallet |
| `/agents` | List all AI agents |
| `/code <code>` | Code review (0.05 USDC) |
| `/summarize <text>` | Summarize (0.02 USDC) |
| `/translate <text>` | Translate (0.03 USDC) |
| `/sql <desc>` | SQL generator (0.04 USDC) |
| `/regex <pattern>` | Regex generator (0.03 USDC) |
| `/explain <code>` | Code explainer (0.02 USDC) |
| `/github issue create <repo> <title> <body>` | Create GitHub issue |
| `/github issue list <repo>` | List issues |
| `/github pr list <repo>` | List PRs |
| `/github repo <owner/repo>` | Repo info |
| `/escrow` | Smart escrow |
| `/help` | Help |

---

## Environment Variables

```bash
# Chain
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
X402_NETWORK=avalanche-fuji

# Wallets
DEPLOYER_PRIVATE_KEY=0x...
PAY_AGENT_PRIVATE_KEY=0x...

# Contracts
USDC_CONTRACT_ADDRESS=0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e
NEXT_PUBLIC_USDC_ADDRESS=0x48FE28F7893De0d20b31FBAbcA1fDbE318fA339e
AGENT_REGISTRY_CONTRACT=0xD78f9aAD50e6a95dC527Ea8DF0637AF506A179a8
PAYMENT_PROCESSOR_CONTRACT=0x69094099B8C0df734C855B36eD3e6D484418d5D2

# AI Providers
AI_PROVIDER=nvidia
NVIDIA_API_KEY=nvapi-...
NVIDIA_MODEL=nvidia/llama-3.3-nemotron-super-49b-v1
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free

# Telegram Bot
TELEGRAM_BOT_TOKEN=...
TELEGRAM_WEBHOOK_SECRET=...

# App
NEXTAUTH_SECRET=dev-secret
NEXT_PUBLIC_APP_URL=https://scbc-hacks.vercel.app
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=demo
```

---

## On-Chain Transaction Proofs

| TX Hash | Type | Amount | Description |
|---|---|---|---|
| `0x902da...c466` | USDC Transfer | 0.02 USDC | Summarizer payment (local test) |
| `0xb86e6...1f60` | USDC Transfer | 0.02 USDC | Summarizer payment (local test) |
| `0xd5341...b9db` | USDC Transfer | 0.02 USDC | Summarizer payment (local test) |
| `0x96aad...e559` | USDC Transfer | 0.02 USDC | NVIDIA NIM test (local) |
| `0x7b8a8...5f71` | USDC Transfer | 50.0 USDC | Fund user wallet |
| `0x73358...abb4` | AVAX Transfer | 0.3 AVAX | Fund user gas |
| `0xfa717...aa00` | Faucet Mint | 100 mUSDC | Mint mock USDC |

All verifiable on https://testnet.snowtrace.io

---

## How to Run Locally

```bash
git clone https://github.com/maulana-tech/scbc-hacks.git
cd scbc-hacks
npm install
cp .env.example .env.local
# Fill in .env.local with values above
npm run dev
# Open http://localhost:3000
```

---

## Deployment

```bash
# Web app (Vercel)
npx vercel --prod

# Telegram bot (Railway)
cd vaxa-bot && railway up

# Contracts (if redeploying)
npx tsx scripts/deploy-contracts.ts

# Seed testnet
npx tsx scripts/seed-testnet.ts
```

---

*Dibuat untuk SCBC Hackathon — Avalanche Agentic Payments Track*
*Vaxa: Programmable money meets autonomous AI agents + Telegram Bot*
