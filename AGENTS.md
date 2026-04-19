# AGENTS.md — Essential Commands & Conventions

## 🚀 Development Setup
```bash
# Install dependencies
npm install

# Copy environment template (create .env.local from .env.example if exists)
# Required vars: AVALANCHE_RPC_URL, AGENT_REGISTRY_CONTRACT, PAY_AGENT_PRIVATE_KEY, 
# DEPLOYER_PRIVATE_KEY, USDC_CONTRACT_ADDRESS, ANTHROPIC_API_KEY, DATABASE_URL

# Start development server
npm run dev
```

## 🔧 Key Scripts
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Next.js dev server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run payagent:scheduler` | Run PayAgent cron jobs (recurring payments) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run deploy:contract` | Deploy smart contracts to Fuji testnet |
| `npm run compile` | Solidity contracts compilation |
| `npm run seed` | Seed testnet with wallets & register agents |

## ⛓️ Blockchain Specifics
- **Network**: Avalanche Fuji Testnet (Chain ID: 43113)
- **USDC Contract**: `0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4`
- **Agent Registry**: ERC-8004 contract (deploy via `deploy:contract`)
- **Payment Flow**: x402 middleware validates USDC payments on-chain

## 📁 Important Directories
- `/app/api/agents/` - Service agent endpoints (code-review, summarize, translate, tip)
- `/app/api/payagent/` - PayAgent config/rules/history/stats endpoints
- `/agents/` - Agent logic implementations
- `/lib/` - x402 middleware, agent client, contract utils, scheduler
- `/scripts/` - Deployment & seeding scripts
- `/prisma/` - Database schema (PostgreSQL)

## 💡 Agent Development Notes
1. Service agents must implement x402 paywall middleware
2. All successful transactions update ERC-8004 reputation on-chain
3. PayAgent enforces spend rules before executing payments
4. A2A communication uses `callAgentWithPayment` helper
5. Environment variables must be set for blockchain/AI services to work