# Deployment Plan — Vaxa (Vercel)

> Target: deploy ke Vercel + PostgreSQL cloud (Supabase/Neon) + Avalanche Fuji testnet.

---

## Checklist

### 1. Prerequisites

- [ ] Push code ke GitHub (pastikan `.env*` di `.gitignore`)
- [ ] Buat akun Vercel (vercel.com) — bisa login via GitHub
- [ ] Siapkan PostgreSQL cloud (pilih salah satu):
  - **Supabase** (free tier, 500MB) — supabase.com
  - **Neon** (free tier, 512MB) — neon.tech
  - **Railway** (free $5 credit) — railway.app
- [ ] Dapatkan WalletConnect Project ID dari cloud.walletconnect.com

### 2. Smart Contract Deploy

```bash
# Pastikan DEPLOYER_PRIVATE_KEY punya AVAX di Fuji
# Faucet: https://faucet.avax.network

# Compile contract
npm run compile

# Deploy ke Fuji testnet
npm run deploy:contract
# → Catat contract address yang muncul, isi ke AGENT_REGISTRY_CONTRACT

# Register 3 agents on-chain
npm run seed
# → Catat 3 agent address, isi ke CODE_REVIEW_AGENT_ADDRESS, dll
```

### 3. Database Setup

```bash
# Buat database di Supabase/Neon, dapatkan connection string
# Format: postgresql://user:pass@host:port/dbname?sslmode=require

# Update DATABASE_URL di .env.local (lokal) dan Vercel env vars (production)

# Push schema
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 4. Environment Variables di Vercel

Masukkan semua ini di **Settings → Environment Variables**:

```
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_CHAIN_ID=43113
AGENT_REGISTRY_CONTRACT=0x...                    # Dari step 2
PAY_AGENT_PRIVATE_KEY=0x...                      # Hot wallet PayAgent
DEPLOYER_PRIVATE_KEY=0x...                       # Wallet deployer
USDC_CONTRACT_ADDRESS=0x5425890C6C9Fc8561a8b4E763b7E6e43b7e9A5F4
ANTHROPIC_API_KEY=sk-ant-...                     # Dari console.anthropic.com
DATABASE_URL=postgresql://...                     # Dari step 3
CODE_REVIEW_AGENT_ADDRESS=0x...                  # Dari step 2
SUMMARIZER_AGENT_ADDRESS=0x...                   # Dari step 2
TRANSLATOR_AGENT_ADDRESS=0x...                   # Dari step 2
NEXTAUTH_SECRET=<random-32-chars>                # generate: openssl rand -hex 32
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
WALLETCONNECT_PROJECT_ID=...                     # Dari cloud.walletconnect.com
```

> ⚠️ **JANGAN** commit `.env.local` ke git. Semua secrets hanya di Vercel dashboard.

### 5. Deploy Steps

```bash
# Install Vercel CLI (opsional, bisa juga deploy via dashboard)
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (production)
vercel --prod
```

Atau via dashboard:
1. Buka vercel.com → **Add New Project**
2. Import dari GitHub repo
3. Framework preset: **Next.js** (auto-detected)
4. Tambahkan semua env vars dari step 4
5. Klik **Deploy**

### 6. Post-Deploy Verification

- [ ] Landing page loads: `https://your-app.vercel.app`
- [ ] Dashboard loads: `https://your-app.vercel.app/dashboard`
- [ ] Wallet connect works (RainbowKit popup muncul)
- [ ] API health: `curl https://your-app.vercel.app/api/agents` → JSON response
- [ ] Prisma connected: `curl https://your-app.vercel.app/api/payagent/stats -H "x-owner-address: 0xTest"` → stats JSON
- [ ] Agent endpoints return 402: `curl -X POST https://your-app.vercel.app/api/agents/summarize` → 402

### 7. Known Issues / Notes

- **PayAgent Scheduler**: Cron job (`lib/scheduler.ts`) tidak jalan otomatis di Vercel (serverless). Solusi:
  - Gunakan **Vercel Cron Jobs** (tambah di `vercel.json`), atau
  - Gunakan **cron-job.org** / **EasyCron** untuk hit endpoint periodically, atau
  - Jalankan scheduler di VPS/Railway terpisah
- **Cold starts**: API routes yang pertama kali di-hit akan lambat (~2-3s). Ini normal untuk serverless.
- **Anthropic API**: Pastikan API key valid dan punya credits. Tanpa ini, agent endpoints akan error 500.

---

## File yang perlu dibuat/diupdate

### `vercel.json` (opsional, untuk cron jobs)

```json
{
  "crons": [
    {
      "path": "/api/payagent/cron",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Update `.env.example` (update NEXT_PUBLIC_APP_URL)

Sudah ada, pastikan `NEXT_PUBLIC_APP_URL` di-set ke production URL.

---

## Quick Deploy (one-liner)

Kalau semua env vars sudah siap:

```bash
vercel --prod
```
