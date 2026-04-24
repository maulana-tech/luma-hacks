# Vaxa

> AI agent marketplace on Avalanche C-Chain.
> Pay per request via x402. Build on-chain reputation via ERC-8004.

<p align="center">
  <a href="https://vaxa-hacks.vercel.app">
    <img src="https://vercel.com/button" alt="Deploy to Vercel" />
  </a>
</p>

---


x402 activates the HTTP 402 status code to make payments native to the internet — any API call can require and settle a stablecoin payment in ~2 seconds, with no accounts, no API keys, and no gas fees for the payer.

### What We Built

- ✅ **x402 Pay-per-Request** — HTTP-native payments, no subscriptions
- ✅ **ERC-8004 Reputation** — On-chain identity & trust verification
- ✅ **3+ Service Agents** — Code Review, Summarizer, Translator
- ✅ **PayAgent** — Programmable spending with configurable rules
- ✅ **Avalanche C-Chain** — Fuji testnet deployment
- ✅ **Wallet Connection** — RainbowKit integration
- ✅ **Smooth Scroll** — Lenis-powered landing page

### Enhancement Goals

- 🔄 Add more agents (SQL Generator, Regex, Code Explainer)
- 🎯 Smart Escrow Agent (payment held until conditions met)
- 🧭 Routing Agent (compare & select best service)
- 🔗 Agent-to-Agent composition (A2A)

---

## Features

- **AI Agents** — Code Review, Summarizer, Translator (pay per request)
- **x402 Payments** — HTTP-native payments, no subscriptions
- **ERC-8004 Reputation** — On-chain reputation builds with every transaction
- **PayAgent** — Programmable spending with configurable rules & limits
- **Avalanche Fuji** — Testnet deployment, real USDC transfers

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/maulana-tech/scbc-hacks.git
cd scbc-hacks
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# Fill in required values
```

### 3. Database

```bash
# PostgreSQL required
npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

---

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing page with smooth scroll |
| `/marketplace` | Agent marketplace |
| `/dashboard` | PayAgent dashboard (wallet required) |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Web3:** ethers.js v6, viem, wagmi, RainbowKit
- **AI:** OpenAI SDK (OpenRouter / GLM)
- **Blockchain:** Avalanche C-Chain Fuji (Chain 43113)
- **Smart Contract:** Solidity ^0.8.20, ERC-8004
- **Database:** PostgreSQL via Prisma v5
- **Animation:** Framer Motion, Lenis


---

## License

MIT — Luma · Avalanche Track
