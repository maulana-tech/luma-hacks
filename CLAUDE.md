# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

---

## Commands

```bash
# Development
npm run dev                  # Start Next.js dev server
npm run build                # Production build
npm run lint                 # ESLint

# Database (PostgreSQL + Prisma)
npm run db:generate          # Generate Prisma client after schema changes
npm run db:push              # Sync schema to database (no migrations)
npm run db:studio            # Open Prisma Studio GUI

# Contracts (Avalanche Fuji testnet)
npm run compile              # Compile AgentRegistry.sol → contracts/AgentRegistry.json
npm run deploy:contract      # Deploy to Fuji, writes address to contracts/AgentRegistry.json
npm run seed                 # Register agents in registry + fund testnet wallets

# PayAgent scheduler (run separately from the web app)
npm run payagent:scheduler   # Start cron scheduler that executes recurring SpendRules
```

No test framework is configured in this project.

---

## Architecture

**AgentMarket** is a Next.js 16 app on Avalanche Fuji testnet where AI agents sell services for USDC micro-payments via the x402 HTTP payment protocol, with on-chain reputation tracked via a custom `AgentRegistry` contract.

### Request lifecycle (x402 flow)

1. Client POSTs to a service agent endpoint (e.g. `/api/agents/summarize`) with no payment header
2. Agent returns **HTTP 402** + `X-Payment-Required` JSON describing amount, token, recipient
3. Client submits a USDC transfer on-chain → gets `txHash`
4. Client retries the same POST with `X-Payment-Proof: { txHash, ...}` header
5. Agent verifies tx on-chain, calls Claude API, then fire-and-forgets `recordSuccessfulTx()` on `AgentRegistry`

The `x402Paywall()` middleware in `lib/x402-middleware.ts` handles steps 2 and 4–5 for every service agent route.

### PayAgent (personal payment agent)

`agents/pay-agent/` is a wallet-manager agent (not a service seller). It executes recurring/scheduled USDC payments on behalf of a user, governed by `SpendRule` records in PostgreSQL. The enforcement order (see `lib/spend-enforcer.ts`) is: rule enabled → single-tx cap → blocklist → allowlist → daily/weekly/monthly budget → reputation condition → daily trigger count.

The scheduler (`lib/scheduler.ts`) runs every hour via `node-cron` and is started by `npm run payagent:scheduler` as a separate process.

### Smart contract

`contracts/AgentRegistry.sol` (ERC-8004-compatible) lives on Fuji. Two key calls:
- `registerAgent()` — called once during seed
- `recordSuccessfulTx(agentAddress, amountUSDC)` — called after every verified payment; increments reputation score using a diminishing-returns formula (details in AGENTS.md §5.2)

Contract ABI + deployed address are stored in `contracts/AgentRegistry.json`. `lib/contracts.ts` exposes typed ethers.js instances.

### Key lib files

| File | Purpose |
|------|---------|
| `lib/x402-middleware.ts` | x402 paywall middleware for service agent routes |
| `lib/agent-client.ts` | `callAgentWithPayment()` helper for A2A calls |
| `lib/spend-enforcer.ts` | Validates a payment attempt against all PayAgent limits |
| `lib/contracts.ts` | ethers.js-wrapped `AgentRegistry` contract instance |
| `lib/scheduler.ts` | Cron jobs that drive recurring SpendRules |
| `lib/db.ts` | Prisma client singleton |

### Database models (Prisma / PostgreSQL)

- **`PayAgentConfig`** — per-user global limits (daily/weekly/monthly USDC caps, max single payment, allow/blocklists)
- **`SpendRule`** — individual payment rules (subscription / tip / donation / conditional) with schedule and condition fields stored as JSON
- **`Transaction`** — immutable payment audit log
- **`AgentCache`** — cached on-chain reputation scores and stats for UI display

### Stack

- **Next.js 16 App Router** — all pages under `app/`, API routes under `app/api/`
- **Prisma 5 + PostgreSQL** — spend rules and payment history
- **ethers.js 6 + wagmi 3 + RainbowKit 2** — wallet connection and on-chain interactions
- **Anthropic SDK** — Claude API calls inside each service agent (`agents/*/index.ts`)
- **Tailwind CSS 4 + framer-motion** — UI

`@anthropic-ai/sdk` and `node-cron` are marked as `serverExternalPackages` in `next.config.ts` and must never be imported in client components.
