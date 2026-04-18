# AGENTS.md — AgentMarket

> Panduan lengkap untuk semua AI agents dalam ekosistem AgentMarket.
> Setiap agent berjalan di Avalanche C-Chain (Fuji testnet), dibayar per-request via x402,
> dan membangun reputasi on-chain via ERC-8004.

---

## Daftar Isi

1. [Arsitektur Umum](#1-arsitektur-umum)
2. [Tipe Agent](#2-tipe-agent)
3. [Service Agents](#3-service-agents)
4. [Personal Payment Agent (PayAgent)](#4-personal-payment-agent-payagent)
5. [Kontrak ERC-8004 — Identity & Reputation](#5-kontrak-erc-8004--identity--reputation)
6. [x402 Payment Flow](#6-x402-payment-flow)
7. [Spend Rules & Configurable Limits](#7-spend-rules--configurable-limits)
8. [Agent-to-Agent (A2A) Communication](#8-agent-to-agent-a2a-communication)
9. [Folder Structure](#9-folder-structure)
10. [Environment Variables](#10-environment-variables)
11. [Cara Menjalankan Lokal](#11-cara-menjalankan-lokal)

---

## 1. Arsitektur Umum

```
┌─────────────────────────────────────────────────────────────────┐
│                        AgentMarket                              │
│                                                                 │
│   ┌──────────────┐        ┌─────────────────────────────────┐  │
│   │   User / UI  │───────▶│   PayAgent (Personal Agent)     │  │
│   └──────────────┘        │   - Kelola subscriptions        │  │
│                            │   - Enforce spend limits        │  │
│                            │   - Auto-trigger payments       │  │
│                            └────────────┬────────────────────┘  │
│                                         │ bayar via x402        │
│                            ┌────────────▼────────────────────┐  │
│                            │      Service Agents             │  │
│                            │  ┌──────────┐ ┌─────────────┐  │  │
│                            │  │CodeReview│ │  Summarizer │  │  │
│                            │  └──────────┘ └─────────────┘  │  │
│                            │  ┌──────────┐ ┌─────────────┐  │  │
│                            │  │Translator│ │  TipAgent   │  │  │
│                            │  └──────────┘ └─────────────┘  │  │
│                            └────────────┬────────────────────┘  │
│                                         │                       │
│                            ┌────────────▼────────────────────┐  │
│                            │   Avalanche C-Chain (Fuji)      │  │
│                            │   - x402 payment settlement     │  │
│                            │   - ERC-8004 reputation update  │  │
│                            └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Prinsip utama:**
- Setiap agent adalah HTTP server dengan endpoint yang dilindungi x402 paywall
- Payment terjadi in-band (dalam HTTP request itu sendiri), bukan out-of-band
- Setiap transaksi sukses meng-update reputasi agent di on-chain ERC-8004 contract
- PayAgent bertindak sebagai "wallet manager" yang mengeksekusi pembayaran atas nama user berdasarkan rules yang sudah dikonfigurasi

---

## 2. Tipe Agent

| Tipe | Peran | Siapa yang memanggil |
|------|-------|----------------------|
| **Service Agent** | Menjual satu layanan spesifik (code review, translate, dll) | User langsung atau PayAgent |
| **Personal Payment Agent (PayAgent)** | Mengelola pembayaran recurring & on-demand atas nama user | User (via UI atau schedule) |
| **Routing Agent** *(opsional, stretch goal)* | Memilih service agent terbaik berdasarkan harga & reputasi | PayAgent atau user |

---

## 3. Service Agents

Setiap service agent mengimplementasikan interface yang sama. Saat ini terdapat tiga service agent:

### 3.1 CodeReviewAgent

**Endpoint:** `POST /api/agents/code-review`
**Harga:** 0.05 USDC per request
**Input:**
```json
{
  "code": "string",
  "language": "typescript | python | solidity | ...",
  "focus": "security | performance | style | general"
}
```
**Output:**
```json
{
  "issues": [{ "line": 12, "severity": "warning", "message": "..." }],
  "score": 87,
  "summary": "string"
}
```

---

### 3.2 SummarizerAgent

**Endpoint:** `POST /api/agents/summarize`
**Harga:** 0.02 USDC per request
**Input:**
```json
{
  "text": "string (max 10.000 karakter)",
  "style": "bullet | paragraph | tldr",
  "maxLength": 200
}
```
**Output:**
```json
{
  "summary": "string",
  "wordCount": 45
}
```

---

### 3.3 TranslatorAgent

**Endpoint:** `POST /api/agents/translate`
**Harga:** 0.03 USDC per request
**Input:**
```json
{
  "text": "string",
  "targetLanguage": "id | en | ja | es | ..."
}
```
**Output:**
```json
{
  "translatedText": "string",
  "detectedSourceLanguage": "string"
}
```

---

### 3.4 TipAgent

Agent khusus untuk menerima tip dari user lain atau PayAgent.

**Endpoint:** `POST /api/agents/tip`
**Harga:** custom (minimum 0.01 USDC)
**Input:**
```json
{
  "recipientAgentId": "0x...",
  "message": "string (opsional)",
  "amount": "0.05"
}
```

---

## 4. Personal Payment Agent (PayAgent)

PayAgent adalah agent utama yang berjalan atas nama user. Dia TIDAK menjual layanan — dia adalah eksekutor pembayaran otomatis yang patuh pada spend rules yang dikonfigurasi user.

### 4.1 Apa yang dilakukan PayAgent

- **Subscriptions** — membayar service agent secara periodik (harian/mingguan/bulanan) dengan USDC
- **Tips** — mengirim tip ke agent/creator berdasarkan trigger tertentu (misal: setiap kali service agent menyelesaikan task)
- **Donations** — mengirim donasi ke wallet address tertentu berdasarkan schedule atau kondisi
- **On-demand payments** — mengeksekusi pembayaran saat user atau agent lain memintanya, selama dalam batas rules

### 4.2 Konfigurasi PayAgent (per user)

Tersimpan di database dan di-enforce sepenuhnya sebelum setiap transaksi dieksekusi:

```typescript
interface PayAgentConfig {
  // Identitas
  ownerAddress: string;          // Wallet address pemilik
  agentWalletAddress: string;    // Wallet PayAgent (hot wallet terpisah)

  // Global limits
  dailySpendLimit: string;       // Maksimum USDC per hari, contoh: "5.00"
  weeklySpendLimit: string;      // Maksimum USDC per minggu, contoh: "20.00"
  monthlySpendLimit: string;     // Maksimum USDC per bulan, contoh: "50.00"
  maxSinglePayment: string;      // Maksimum per satu transaksi, contoh: "2.00"

  // Whitelist
  allowedRecipients: string[];   // Daftar address yang boleh menerima pembayaran
  blockedRecipients: string[];   // Daftar address yang diblokir

  // Rules
  rules: SpendRule[];

  // Notifikasi
  notifyOnEveryTx: boolean;
  notifyOnDailyLimit: boolean;
}
```

### 4.3 SpendRule — Struktur Aturan

```typescript
interface SpendRule {
  id: string;
  name: string;                  // Label, contoh: "Bayar summarizer tiap Senin"
  type: "subscription" | "tip" | "donation" | "conditional";
  
  // Target pembayaran
  recipientAgentId?: string;     // Agent ID di marketplace
  recipientAddress?: string;     // Atau langsung wallet address
  
  // Jumlah
  amount: string;                // USDC amount, contoh: "0.05"
  
  // Jadwal (untuk subscription & donation)
  schedule?: {
    frequency: "daily" | "weekly" | "monthly" | "once";
    dayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;  // untuk weekly
    dayOfMonth?: number;                       // untuk monthly
    time?: string;                             // "09:00" UTC
  };
  
  // Kondisi (untuk conditional & tip)
  condition?: {
    trigger: "on_task_complete" | "on_reputation_increase" | "on_schedule" | "manual";
    minReputationScore?: number; // Bayar hanya jika reputasi agent ≥ nilai ini
    maxDailyTriggers?: number;   // Maksimal berapa kali trigger per hari
  };
  
  // Status
  enabled: boolean;
  expiresAt?: string;            // ISO date, opsional
  totalSpentToDate: string;      // Tracking otomatis
}
```

### 4.4 Contoh Konfigurasi Nyata

```json
{
  "ownerAddress": "0xUserWallet...",
  "agentWalletAddress": "0xPayAgentWallet...",
  "dailySpendLimit": "3.00",
  "weeklySpendLimit": "15.00",
  "monthlySpendLimit": "40.00",
  "maxSinglePayment": "1.00",
  "allowedRecipients": [],
  "blockedRecipients": [],
  "rules": [
    {
      "id": "rule_001",
      "name": "Langganan SummarizerAgent mingguan",
      "type": "subscription",
      "recipientAgentId": "agent_summarizer_001",
      "amount": "0.50",
      "schedule": {
        "frequency": "weekly",
        "dayOfWeek": 1,
        "time": "08:00"
      },
      "enabled": true,
      "totalSpentToDate": "0.00"
    },
    {
      "id": "rule_002",
      "name": "Tip otomatis setelah code review berhasil",
      "type": "tip",
      "recipientAgentId": "agent_codereview_001",
      "amount": "0.10",
      "condition": {
        "trigger": "on_task_complete",
        "minReputationScore": 80,
        "maxDailyTriggers": 5
      },
      "enabled": true,
      "totalSpentToDate": "0.00"
    },
    {
      "id": "rule_003",
      "name": "Donasi bulanan ke open source fund",
      "type": "donation",
      "recipientAddress": "0xOpenSourceFund...",
      "amount": "2.00",
      "schedule": {
        "frequency": "monthly",
        "dayOfMonth": 1,
        "time": "00:00"
      },
      "enabled": true,
      "totalSpentToDate": "0.00"
    }
  ],
  "notifyOnEveryTx": false,
  "notifyOnDailyLimit": true
}
```

### 4.5 Spend Enforcement Logic

Sebelum setiap eksekusi pembayaran, PayAgent menjalankan pengecekan berurutan:

```
1. Apakah rule.enabled = true?                      → jika tidak, skip
2. Apakah amount <= maxSinglePayment?               → jika tidak, reject
3. Apakah recipient ada di blockedRecipients?       → jika ya, reject
4. Jika allowedRecipients tidak kosong:
   Apakah recipient ada di allowedRecipients?       → jika tidak, reject
5. Apakah (dailySpent + amount) <= dailySpendLimit? → jika tidak, reject
6. Apakah (weeklySpent + amount) <= weeklySpendLimit? → jika tidak, reject
7. Apakah (monthlySpent + amount) <= monthlySpendLimit? → jika tidak, reject
8. Jika condition.minReputationScore:
   Apakah reputasiAgent >= minReputationScore?      → jika tidak, skip
9. Jika condition.maxDailyTriggers:
   Apakah triggerCountHariIni < maxDailyTriggers?   → jika tidak, skip
10. ✓ Semua checks passed → eksekusi x402 payment
```

---

## 5. Kontrak ERC-8004 — Identity & Reputation

### 5.1 Interface Kontrak

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAgentRegistry {
    struct AgentProfile {
        address owner;
        string name;
        string serviceType;      // "code-review" | "summarizer" | "translator" | "pay-agent"
        string metadataURI;      // IPFS hash untuk deskripsi lengkap
        uint256 reputationScore; // 0–1000
        uint256 totalTxCount;    // Jumlah transaksi sukses
        uint256 totalEarned;     // Total USDC earned (dalam wei, 6 desimal)
        bool isActive;
        uint256 registeredAt;
    }

    event AgentRegistered(address indexed agentAddress, string name, string serviceType);
    event ReputationUpdated(address indexed agentAddress, uint256 newScore, uint256 txCount);
    event AgentDeactivated(address indexed agentAddress);

    function registerAgent(string calldata name, string calldata serviceType, string calldata metadataURI) external;
    function recordSuccessfulTx(address agentAddress, uint256 amountUSDC) external;
    function getAgent(address agentAddress) external view returns (AgentProfile memory);
    function getReputationScore(address agentAddress) external view returns (uint256);
    function getTopAgents(string calldata serviceType, uint256 limit) external view returns (address[] memory);
    function deactivateAgent() external;
}
```

### 5.2 Algoritma Reputasi

Setiap kali `recordSuccessfulTx` dipanggil (oleh x402 verifier setelah payment confirmed):

```
newScore = min(1000, currentScore + reputationDelta)

reputationDelta:
  - Transaksi pertama:              +20 poin
  - Transaksi ke-2 s/d ke-10:      +5 poin per tx
  - Transaksi ke-11 s/d ke-50:     +2 poin per tx
  - Transaksi ke-51 ke atas:       +1 poin per tx
  - Bonus jika amount > 0.1 USDC:  +1 poin tambahan
```

Skor maksimum: **1000 poin**. Skor tidak pernah turun (v1) — decay mechanism direncanakan untuk v2.

### 5.3 Deployment

- **Network:** Avalanche Fuji Testnet (Chain ID: 43113)
- **RPC:** `https://api.avax-test.network/ext/bc/C/rpc`
- **Contract address:** *(diisi setelah deploy)*

---

## 6. x402 Payment Flow

### 6.1 Standar Request-Response

```
Client                          Service Agent                    Avalanche
  │                                   │                              │
  │  POST /api/agents/summarize       │                              │
  │  (tanpa payment header)           │                              │
  │──────────────────────────────────▶│                              │
  │                                   │                              │
  │  402 Payment Required             │                              │
  │  X-Payment-Required: {...}        │                              │
  │◀──────────────────────────────────│                              │
  │                                   │                              │
  │  [Client sign & submit tx]        │                              │
  │  ────────────────────────────────────────────────────────────▶  │
  │                                   │                              │
  │  POST /api/agents/summarize       │                              │
  │  X-Payment-Proof: {txHash, ...}   │                              │
  │──────────────────────────────────▶│                              │
  │                                   │  verify txHash on-chain      │
  │                                   │─────────────────────────────▶│
  │                                   │  confirmed ✓                 │
  │                                   │◀─────────────────────────────│
  │                                   │  recordSuccessfulTx()        │
  │                                   │─────────────────────────────▶│
  │  200 OK + hasil layanan           │                              │
  │◀──────────────────────────────────│                              │
```

### 6.2 Payment Required Header (402 Response)

```json
{
  "x-payment-required": {
    "version": "1.0",
    "network": "avalanche-fuji",
    "chainId": 43113,
    "token": "USDC",
    "tokenAddress": "0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4",
    "amount": "50000",
    "decimals": 6,
    "recipient": "0xAgentWalletAddress...",
    "description": "Text summarization service — 1 request",
    "expiresAt": 1720000000
  }
}
```

### 6.3 x402 Middleware (Express/Next.js)

```typescript
// lib/x402-middleware.ts
import { ethers } from 'ethers';
import { agentRegistry } from './contracts';

export interface X402Options {
  agentAddress: string;
  price: string;        // USDC amount, contoh "0.05"
  description: string;
}

export function x402Paywall(options: X402Options) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentProof = req.headers['x-payment-proof'];

    if (!paymentProof) {
      return res.status(402).json({
        error: 'Payment required',
        'x-payment-required': buildPaymentRequired(options),
      });
    }

    const proof = JSON.parse(paymentProof as string);
    const verified = await verifyPaymentOnChain(proof, options);

    if (!verified) {
      return res.status(402).json({ error: 'Payment verification failed' });
    }

    // Update reputasi on-chain (fire & forget — jangan block response)
    agentRegistry.recordSuccessfulTx(
      options.agentAddress,
      ethers.parseUnits(options.price, 6)
    ).catch(console.error);

    next();
  };
}
```

---

## 7. Spend Rules & Configurable Limits

### 7.1 API Endpoint PayAgent

Semua interaksi dengan PayAgent melalui REST API yang diproteksi dengan auth user:

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET` | `/api/payagent/config` | Ambil konfigurasi saat ini |
| `PUT` | `/api/payagent/config` | Update global limits |
| `GET` | `/api/payagent/rules` | List semua rules |
| `POST` | `/api/payagent/rules` | Tambah rule baru |
| `PATCH` | `/api/payagent/rules/:id` | Update rule |
| `DELETE` | `/api/payagent/rules/:id` | Hapus rule |
| `GET` | `/api/payagent/history` | History pembayaran |
| `GET` | `/api/payagent/stats` | Statistik pengeluaran |
| `POST` | `/api/payagent/pause` | Pause semua payments |
| `POST` | `/api/payagent/resume` | Resume payments |

### 7.2 Spending Stats Response

```json
{
  "today": {
    "spent": "1.25",
    "limit": "3.00",
    "remaining": "1.75",
    "txCount": 7
  },
  "thisWeek": {
    "spent": "4.80",
    "limit": "15.00",
    "remaining": "10.20",
    "txCount": 23
  },
  "thisMonth": {
    "spent": "12.40",
    "limit": "40.00",
    "remaining": "27.60",
    "txCount": 89
  },
  "allTime": {
    "spent": "58.20",
    "txCount": 312
  }
}
```

---

## 8. Agent-to-Agent (A2A) Communication

Salah satu fitur kunci AgentMarket: agent dapat memanggil agent lain secara otonom.

### 8.1 Contoh Skenario A2A

**SummarizerAgent memanggil TranslatorAgent:**

```typescript
// agents/summarizer/index.ts
async function handleSummarizeRequest(req: Request) {
  const { text, targetLanguage } = req.body;

  // 1. Summarize dulu
  const summary = await claudeApi.summarize(text);

  // 2. Kalau user minta translate, panggil TranslatorAgent via x402
  if (targetLanguage && targetLanguage !== 'en') {
    const translationResult = await callAgentWithPayment({
      agentUrl: process.env.TRANSLATOR_AGENT_URL!,
      endpoint: '/api/agents/translate',
      payload: { text: summary, targetLanguage },
      maxBudget: '0.05',    // Bayar max 0.05 USDC
    });
    return { summary: translationResult.translatedText, translatedFrom: 'en' };
  }

  return { summary };
}
```

### 8.2 callAgentWithPayment Helper

```typescript
// lib/agent-client.ts
export async function callAgentWithPayment(params: {
  agentUrl: string;
  endpoint: string;
  payload: object;
  maxBudget: string;   // USDC
}): Promise<any> {
  const url = `${params.agentUrl}${params.endpoint}`;

  // Step 1: Cek apakah butuh payment
  const probe = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params.payload),
  });

  if (probe.status !== 402) {
    return probe.json();
  }

  const { 'x-payment-required': requirement } = await probe.json();

  // Step 2: Validasi harga masih dalam budget
  const requiredAmount = ethers.formatUnits(requirement.amount, 6);
  if (parseFloat(requiredAmount) > parseFloat(params.maxBudget)) {
    throw new Error(`Agent price ${requiredAmount} USDC melebihi budget ${params.maxBudget} USDC`);
  }

  // Step 3: Submit payment
  const txHash = await submitUSDCPayment(requirement);

  // Step 4: Kirim ulang dengan payment proof
  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Payment-Proof': JSON.stringify({ txHash, ...requirement }),
    },
    body: JSON.stringify(params.payload),
  });

  return result.json();
}
```

---

## 9. Folder Structure

```
agentmarket/
├── AGENTS.md                          ← file ini
├── README.md
├── .env.local
│
├── contracts/
│   ├── AgentRegistry.sol              ← ERC-8004 implementation
│   ├── deploy.ts
│   └── abis/
│       └── AgentRegistry.json
│
├── lib/
│   ├── x402-middleware.ts             ← x402 paywall middleware
│   ├── agent-client.ts               ← callAgentWithPayment helper
│   ├── contracts.ts                  ← ethers.js contract instances
│   ├── spend-enforcer.ts             ← PayAgent spend rule engine
│   └── scheduler.ts                  ← cron jobs untuk recurring payments
│
├── agents/
│   ├── code-review/
│   │   ├── index.ts                  ← agent logic
│   │   └── prompts.ts
│   ├── summarizer/
│   │   └── index.ts
│   ├── translator/
│   │   └── index.ts
│   └── pay-agent/
│       ├── index.ts                  ← PayAgent core
│       ├── rule-executor.ts          ← eksekusi tiap SpendRule
│       └── history.ts               ← logging transaksi
│
├── app/                               ← Next.js 14 app router
│   ├── layout.tsx
│   ├── page.tsx                      ← Marketplace homepage
│   ├── dashboard/
│   │   └── page.tsx                  ← User dashboard
│   └── api/
│       ├── agents/
│       │   ├── code-review/route.ts
│       │   ├── summarize/route.ts
│       │   ├── translate/route.ts
│       │   └── tip/route.ts
│       └── payagent/
│           ├── config/route.ts
│           ├── rules/route.ts
│           ├── history/route.ts
│           └── stats/route.ts
│
├── components/
│   ├── AgentCard.tsx
│   ├── ReputationBadge.tsx
│   ├── SpendRuleForm.tsx
│   └── PaymentHistory.tsx
│
└── scripts/
    ├── deploy-contracts.ts
    └── seed-testnet.ts               ← isi wallet testnet + register agents
```

---

## 10. Environment Variables

```bash
# .env.local

# Avalanche
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
AGENT_REGISTRY_CONTRACT=0x...         # Diisi setelah deploy

# Wallet (JANGAN commit ke git)
PAY_AGENT_PRIVATE_KEY=0x...           # Hot wallet PayAgent
DEPLOYER_PRIVATE_KEY=0x...            # Wallet deploy contracts

# USDC Testnet (Fuji)
USDC_CONTRACT_ADDRESS=0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4

# AI
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXTAUTH_SECRET=...
DATABASE_URL=postgresql://...         # Untuk store SpendRules & history
```

---

## 11. Cara Menjalankan Lokal

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local
# → isi semua variabel di atas

# 3. Deploy smart contracts ke Fuji testnet
npx ts-node scripts/deploy-contracts.ts

# 4. Seed agents ke registry
npx ts-node scripts/seed-testnet.ts

# 5. Jalankan app
npm run dev

# 6. (Opsional) Jalankan PayAgent scheduler terpisah
npm run payagent:scheduler
```

**Faucet untuk testnet:**
- AVAX: https://faucet.avax.network
- USDC (Fuji): https://faucet.circle.com (pilih Avalanche Fuji)

---

*Dibuat untuk SCBC Hackathon — Avalanche Track*
*AgentMarket: Programmable money meets autonomous AI agents*