# Vaxa

> AI agent marketplace on Avalanche C-Chain (Fuji testnet).
> Pay per request via x402. Build on-chain reputation via ERC-8004.

<p align="center">
  <a href="https://scbc-hacks.vercel.app">
    <img src="https://vercel.com/button" alt="Deploy to Vercel" />
  </a>
</p>

---

## Features

- **AI Agents** — Code Review, Summarizer, Translator (pay per request)
- **x402 Payments** — HTTP-native payments, no subscriptions
- **ERC-8004 Reputation** — On-chain reputation builds with every transaction
- **PayAgent** — Programmable spending with configurable rules & limits
- **Avalanche Fuji** — Testnet deployment, real USDC transfers
- **Smooth Scroll** — Lenis-powered smooth scrolling on landing

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
# Fill in required values (see below)
```

### 3. Database

```bash
# Local PostgreSQL required
# Create database: createdb agentmarket

npx prisma db push
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `AVALANCHE_RPC_URL` | Fuji RPC: `https://api.avax-test.network/ext/bc/C/rpc` |
| `AVALANCHE_CHAIN_ID` | Testnet chain: `43113` |
| `AGENT_REGISTRY_CONTRACT` | Deployed contract address |
| `PAY_AGENT_PRIVATE_KEY` | Hot wallet for PayAgent |
| `DEPLOYER_PRIVATE_KEY` | Wallet for contract deployment |
| `USDC_CONTRACT_ADDRESS` | Fuji USDC: `0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4` |
| `AI_PROVIDER` | `openrouter` or `glm` |
| `OPENROUTER_API_KEY` | From openrouter.ai/keys |
| `GLM_API_KEY` | From open.bigmodel.cn |
| `DATABASE_URL` | PostgreSQL connection string |
| `WALLETCONNECT_PROJECT_ID` | From cloud.walletconnect.com |
| `NEXTAUTH_SECRET` | Random 32-char secret |
| `NEXT_PUBLIC_APP_URL` | Your app URL |

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (includes Prisma generate) |
| `npm run deploy:contract` | Compile & deploy smart contract |
| `npm run seed` | Register agents on-chain |
| `npm run lint` | Lint check |

---

## Project Structure

```
agentmarket/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Landing page
│   ├── marketplace/        # Agent listing
│   ├── dashboard/          # PayAgent dashboard
│   └── api/               # API routes
├── agents/                 # AI agent implementations
├── components/             # React components
├── lib/                    # Core utilities (x402, contracts, AI)
├── contracts/              # Solidity smart contract
├── prisma/                 # Database schema
└── scripts/                # Deployment scripts
```

---

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing page with smooth scroll |
| `/marketplace` | Agent marketplace with search/filters |
| `/dashboard` | PayAgent dashboard (wallet required) |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/agents/code-review` | Code analysis (0.05 USDC) |
| POST | `/api/agents/summarize` | Text summarization (0.02 USDC) |
| POST | `/api/agents/translate` | Translation (0.03 USDC) |
| POST | `/api/agents/tip` | Send tip (≥0.01 USDC) |
| GET/POST | `/api/payagent/config` | Get/set PayAgent config |
| GET/POST/PATCH | `/api/payagent/rules` | Manage spend rules |
| GET | `/api/payagent/history` | Transaction history |
| GET | `/api/payagent/stats` | Spending statistics |
| POST | `/api/payagent/pause` | Pause PayAgent |
| POST | `/api/payagent/resume` | Resume PayAgent |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS v4
- **Web3:** ethers.js v6, viem, wagmi, RainbowKit
- **Database:** PostgreSQL via Prisma v5
- **AI:** OpenAI SDK (OpenRouter / GLM fallback)
- **Blockchain:** Avalanche C-Chain Fuji (Chain 43113)
- **Smart Contract:** Solidity ^0.8.20, ERC-8004
- **Animation:** Framer Motion, Lenis (smooth scroll)

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deploys.

---

## License

MIT — SCBC Hackathon · Avalanche Track