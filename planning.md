# AgentMarket — Planning & Status

> AI agent marketplace on Avalanche C-Chain (Fuji testnet).
> Pay per request via x402. Build on-chain reputation via ERC-8004.

---

## Status Overview

| Area | Progress | Status |
|------|----------|--------|
| Smart Contract | 90% | Contract & ABI done. Needs compilation tooling & real deployment. |
| Database (Prisma) | 100% | Schema complete. Needs `db push` to create tables. |
| Core Libs | 95% | x402, contracts, agent-client, spend-enforcer all functional. Scheduler needs fix. |
| Service Agents | 100% | Code review, summarizer, translator — all wired to Claude API. |
| PayAgent Core | 70% | Config/rules/stats/history API routes work. Rule executor uses simulated payments. |
| UI | 85% | Marketplace + Dashboard pages designed. No wallet connection. Buttons non-functional. |
| Scripts | 80% | Seed script done. Deploy script has fake bytecode. |

---

## File Status Map

### Contracts

| File | Status | Notes |
|------|--------|-------|
| `contracts/AgentRegistry.sol` | DONE | Full ERC-8004: register, recordSuccessfulTx, reputation, deactivate |
| `contracts/abis/AgentRegistry.json` | DONE | Complete ABI matching contract |
| `contracts/deploy.ts` | NEEDS FIX | Has placeholder bytecode. Needs Hardhat/Foundry to compile .sol |

### Prisma / DB

| File | Status | Notes |
|------|--------|-------|
| `prisma/schema.prisma` | DONE | PayAgentConfig, SpendRule, Transaction, AgentCache |
| `lib/db.ts` | DONE | Prisma singleton |

### Libs

| File | Status | Notes |
|------|--------|-------|
| `lib/contracts.ts` | DONE | ethers.js contract instances (read-only & signed) |
| `lib/x402-middleware.ts` | DONE | 402 response builder, on-chain payment verification, reputation recording |
| `lib/agent-client.ts` | DONE | callAgentWithPayment() — full A2A x402 flow |
| `lib/spend-enforcer.ts` | DONE | All 10 enforcement checks from spec |
| `lib/scheduler.ts` | NEEDS FIX | Cron defined but `startScheduler()` never called. Missing rep check & time check. |

### Agents

| File | Status | Notes |
|------|--------|-------|
| `agents/code-review/index.ts` | DONE | Claude API integration |
| `agents/code-review/prompts.ts` | DONE | System + user prompt templates |
| `agents/summarizer/index.ts` | DONE | 3 styles: bullet, paragraph, tldr |
| `agents/translator/index.ts` | DONE | 50+ languages, source detection |
| `agents/pay-agent/index.ts` | NEEDS FIX | `getOrCreateConfig` works but generates fake wallet address |
| `agents/pay-agent/rule-executor.ts` | STUB | Simulated payments — generates fake txHash, no real USDC transfer |
| `agents/pay-agent/history.ts` | DONE | Transaction history + spending stats |

### API Routes

| File | Status | Notes |
|------|--------|-------|
| `app/api/agents/code-review/route.ts` | DONE | Full x402 flow + Claude + reputation |
| `app/api/agents/summarize/route.ts` | DONE | Full x402 flow + Claude + reputation |
| `app/api/agents/translate/route.ts` | DONE | Full x402 flow + Claude + reputation |
| `app/api/agents/tip/route.ts` | NEEDS FIX | Missing `recordSuccessfulTx` call |
| `app/api/payagent/config/route.ts` | DONE | GET/PUT with upsert |
| `app/api/payagent/rules/route.ts` | DONE | GET/POST/PATCH/DELETE |
| `app/api/payagent/history/route.ts` | DONE | GET with limit param |
| `app/api/payagent/stats/route.ts` | DONE | GET with daily/weekly/monthly/all-time |
| `app/api/payagent/pause/route.ts` | MISSING | Spec: `POST /api/payagent/pause` |
| `app/api/payagent/resume/route.ts` | MISSING | Spec: `POST /api/payagent/resume` |

### UI

| File | Status | Notes |
|------|--------|-------|
| `app/globals.css` | DONE | Design system: charcoal dark theme, type scale, Instrument Serif |
| `app/layout.tsx` | DONE | Fixed header, Geist fonts, nav |
| `app/page.tsx` | NEEDS WORK | Hardcoded agent data. "Use Agent" button has no action. |
| `app/dashboard/page.tsx` | NEEDS WORK | Uses MOCK_OWNER. No wallet auth. No pause/resume. |
| `components/AgentCard.tsx` | NEEDS WORK | No onClick handler on button |
| `components/ReputationBadge.tsx` | DONE | SVG ring, 3 sizes, color-coded |
| `components/SpendRuleForm.tsx` | DONE | Dynamic fields per rule type |
| `components/PaymentHistory.tsx` | DONE | Table with type badges, status dots |

### Config & Scripts

| File | Status | Notes |
|------|--------|-------|
| `package.json` | DONE | All deps + scripts |
| `tsconfig.json` | DONE | Path aliases configured |
| `next.config.ts` | DONE | Server external packages |
| `.env.example` | NEEDS FIX | Missing NEXTAUTH_SECRET |
| `.env.local` | STUB | All placeholder values |
| `scripts/seed-testnet.ts` | DONE | Register 3 agents on-chain |
| `scripts/deploy-contracts.ts` | MISSING | Referenced in spec but doesn't exist |
| `README.md` | STUB | Default create-next-app boilerplate |

---

## Task Breakdown

### P0 — Cannot Run Without These

- [ ] **P0.1** Add Hardhat or solc-js to compile `AgentRegistry.sol` → real bytecode
- [ ] **P0.2** Fix `contracts/deploy.ts` to use compiled bytecode instead of placeholder
- [ ] **P0.3** Create `scripts/deploy-contracts.ts` that compiles & deploys to Fuji
- [ ] **P0.4** Run `npx prisma db push` to create DB tables
- [ ] **P0.5** Fix `lib/scheduler.ts` — call `startScheduler()` at module bottom so the process stays alive
- [ ] **P0.6** Fill `.env.local` with real values (private keys, API key, contract address)

### P1 — Core Functionality

- [ ] **P1.1** Replace simulated payments in `agents/pay-agent/rule-executor.ts` with real USDC transfers
- [ ] **P1.2** Fix `agents/pay-agent/index.ts` — proper wallet address handling (not fake `0xABCD...agent`)
- [ ] **P1.3** Add `recordSuccessfulTx` to `app/api/agents/tip/route.ts`
- [ ] **P1.4** Implement `app/api/payagent/pause/route.ts`
- [ ] **P1.5** Implement `app/api/payagent/resume/route.ts`
- [ ] **P1.6** Add reputation score check to scheduler (spec step 8)
- [ ] **P1.7** Add schedule time-of-day check to scheduler

### P2 — Wallet & Auth

- [ ] **P2.1** Install wagmi + viem + connect-kit (or RainbowKit) for wallet connection
- [ ] **P2.2** Create wallet provider wrapper in `app/layout.tsx`
- [ ] **P2.3** Replace hardcoded `MOCK_OWNER` in dashboard with connected wallet address
- [ ] **P2.4** Add wallet address to `x-owner-address` header from connected wallet
- [ ] **P2.5** Wire "Use Agent" button to trigger x402 payment flow (client-side)

### P3 — Dynamic Data

- [ ] **P3.1** Create `app/api/agents/route.ts` — GET endpoint that fetches agents from on-chain + DB
- [ ] **P3.2** Replace hardcoded agent data in `app/page.tsx` with API fetch
- [ ] **P3.3** Add real-time reputation polling or refresh on marketplace page
- [ ] **P3.4** Show live transaction counts from on-chain

### P4 — Polish

- [ ] **P4.1** Write proper `README.md` with setup instructions
- [ ] **P4.2** Add `.env.example` with `NEXTAUTH_SECRET`
- [ ] **P4.3** Add loading states / skeletons to dashboard
- [ ] **P4.4** Add error boundaries and toast notifications
- [ ] **P4.5** Add favicon and meta tags for production
- [ ] **P4.6** Responsive testing — verify mobile layout for all pages

### P5 — Stretch Goals

- [ ] **P5.1** Routing Agent — select best agent by price & reputation
- [ ] **P5.2** Agent-to-Agent demo — Summarizer calls Translator automatically
- [ ] **P5.3** Notification system for spending limit alerts
- [ ] **P5.4** Reputation decay (v2 spec)
- [ ] **P5.5** Multi-sig support for large payments

---

## Architecture

```
User/Browser
  │
  ├── Marketplace (/)          → Browse agents, see prices & reputation
  ├── Dashboard (/dashboard)   → Manage PayAgent, spend rules, view history
  │
  └── Connected via x402:
      │
      ├── Service Agents (pay per request)
      │   ├── POST /api/agents/code-review  → 0.05 USDC
      │   ├── POST /api/agents/summarize    → 0.02 USDC
      │   └── POST /api/agents/translate    → 0.03 USDC
      │
      └── PayAgent (auto-payments)
          ├── Spend rules (subscription, tip, donation, conditional)
          ├── Spend limits (daily, weekly, monthly, per-tx)
          └── Scheduler (node-cron, hourly)

All payments settle on Avalanche Fuji (Chain 43113) as USDC transfers.
Every successful tx updates ERC-8004 reputation on-chain.
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Fonts | Geist Sans, Geist Mono, Instrument Serif |
| Icons | Lucide React |
| Animation | Framer Motion |
| Blockchain | Avalanche C-Chain Fuji Testnet (43113) |
| Web3 | ethers.js v6 |
| Smart Contract | Solidity ^0.8.20 |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Database | PostgreSQL via Prisma v5 |
| Scheduler | node-cron |

## Environment Variables

```bash
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
AGENT_REGISTRY_CONTRACT=0x...          # After deploy

PAY_AGENT_PRIVATE_KEY=0x...            # Hot wallet for PayAgent
DEPLOYER_PRIVATE_KEY=0x...             # Wallet for contract deployment

USDC_CONTRACT_ADDRESS=0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4
ANTHROPIC_API_KEY=sk-ant-...

DATABASE_URL=postgresql://user:pass@localhost:5432/agentmarket

CODE_REVIEW_AGENT_ADDRESS=0x...
SUMMARIZER_AGENT_ADDRESS=0x...
TRANSLATOR_AGENT_ADDRESS=0x...
```
