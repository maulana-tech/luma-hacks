# Demo Video Script — Vaxa: AgentMarket

**Target duration:** 3–5 minutes  
**Platform:** SCBC Hackathon — Avalanche Track  
**Tagline:** *Programmable money meets autonomous AI agents*

> **Durasi target:** 3–5 menit | **Platform:** SCBC Hackathon — Avalanche Track

---

## Full Narration Script (English)

Imagine being able to pay AI to work for you — automatically, per task, without wasteful monthly subscriptions. What if your AI tools only charged you when they actually did something useful? That's the problem Vaxa solves.

This is Vaxa — an AI agent marketplace powered by micro-payments on the Avalanche blockchain. Every agent here is a real AI service that gets paid per request, in real USDC, settled on-chain. No subscriptions. No credit card. Just pay for what you use.

When you open the Vaxa marketplace, you see every available agent at a glance — Code Review, Summarizer, Translator, and more. Each card shows the agent's price, how many transactions it has completed, and its on-chain reputation score. That reputation isn't a star rating someone typed in. It's a live number written to our AgentRegistry smart contract on Avalanche Fuji — it goes up every time the agent successfully completes a paid job, and it cannot be faked.

To get started, connect your wallet. Vaxa supports MetaMask and any EVM-compatible wallet. Once connected, you're on Avalanche Fuji testnet and ready to pay for services.

Let's try the Code Review Agent. It costs just 0.05 USDC per request. Paste your code, select the language and focus area, then click Pay and Review. A MetaMask popup appears showing the exact payment — 0.05 USDC, nothing hidden. Approve it, and watch what happens next.

Here's what makes Vaxa different from every other AI tool: we use the x402 protocol. Payment happens inline, inside the HTTP request itself. There is no separate checkout page, no redirect, no waiting. The moment your transaction confirms on-chain, the agent receives it, calls Claude, and sends the result back — all in a single flow. Issues found, a quality score, a full summary. And the agent's reputation score just went up on the blockchain.

The Summarizer Agent works the same way. Paste any long article, choose your output style and length, pay 0.02 USDC, and get a clean summary in seconds. Every agent in the marketplace follows this same one-click payment model.

Now let's talk about Vaxa's most powerful feature: the PayAgent. This is your personal payment agent — a programmable wallet manager that executes payments on your behalf based on rules you define. Open the PayAgent dashboard and you'll see your global spend limits: daily, weekly, and monthly caps. These are hard limits. The system will never go over them, no matter what. Add a rule — for example, subscribe to the Code Review Agent every Monday morning at nine for 0.05 USDC. Save it. Now PayAgent handles it automatically. Every Monday, it pays, the agent runs, and your spending stays within the budget you set. You can track exactly how much was spent today, this week, and this month, down to the cent.

Vaxa is also available on Telegram. Open a chat with VaxaBot, type your code review request, and the bot responds with a pay button. Tap it, approve the transaction, and the result comes right back — all without opening a browser. The same agents, the same x402 payment flow, directly in your chat.

Every successful transaction, whether from the web app or Telegram, calls recordSuccessfulTx on our AgentRegistry smart contract. You can see these calls live on Snowtrace, the Fuji testnet explorer. The contract records the agent address, the amount paid, and updates the reputation score using a diminishing-returns formula — early transactions grow reputation fast, later ones contribute steadily. It's fully transparent and auditable by anyone.

Vaxa brings together three things that haven't been combined before: powerful AI agents that actually do useful work, micro-payments via the x402 protocol so you only pay per task, and trustless on-chain reputation so you always know which agents have a proven track record. No subscriptions. No black-box ratings. Just programmable money meeting autonomous AI agents — built on Avalanche Fuji testnet for the SCBC Hackathon.

> ---
> 
> **Terjemahan Narasi (Indonesia)**
> 
> Bayangkan kamu bisa membayar AI untuk bekerja untukmu — secara otomatis, per-task, tanpa langganan bulanan yang boros. Bagaimana kalau AI kamu hanya menagih saat benar-benar menyelesaikan sesuatu? Itulah masalah yang diselesaikan Vaxa.
> 
> Ini adalah Vaxa — marketplace AI agents yang dibayar micro-payment di blockchain Avalanche. Setiap agent di sini adalah layanan AI nyata yang dibayar per request, dalam USDC nyata, diselesaikan on-chain. Tidak ada langganan. Tidak ada kartu kredit. Bayar hanya untuk yang kamu gunakan.
> 
> Ketika kamu membuka marketplace Vaxa, kamu langsung melihat semua agent yang tersedia — Code Review, Summarizer, Translator, dan lainnya. Setiap card menampilkan harga agent, jumlah transaksi yang sudah selesai, dan skor reputasi on-chain-nya. Reputasi itu bukan rating bintang yang diketik seseorang. Ini angka live yang ditulis ke smart contract AgentRegistry kami di Avalanche Fuji — naik setiap kali agent berhasil menyelesaikan pekerjaan berbayar, dan tidak bisa dimanipulasi.
> 
> Untuk mulai, connect wallet kamu. Vaxa support MetaMask dan wallet EVM apa pun. Setelah terhubung, kamu berada di Avalanche Fuji testnet dan siap membayar layanan.
> 
> Mari coba Code Review Agent. Harganya hanya 0.05 USDC per request. Paste kode kamu, pilih bahasa dan fokus review, lalu klik Pay and Review. Popup MetaMask muncul menampilkan jumlah pembayaran yang tepat — 0.05 USDC, tidak ada yang tersembunyi. Approve, dan lihat apa yang terjadi selanjutnya.
> 
> Inilah yang membuat Vaxa berbeda dari semua tools AI lainnya: kami menggunakan protokol x402. Pembayaran terjadi inline, di dalam HTTP request itu sendiri. Tidak ada halaman checkout terpisah, tidak ada redirect, tidak ada menunggu. Begitu transaksi kamu terkonfirmasi on-chain, agent menerimanya, memanggil Claude, dan mengirimkan hasilnya kembali — semua dalam satu alur. Issues ditemukan, skor kualitas, ringkasan lengkap. Dan skor reputasi agent baru saja naik di blockchain.
> 
> Summarizer Agent bekerja dengan cara yang sama. Paste artikel panjang apa pun, pilih gaya dan panjang output, bayar 0.02 USDC, dan dapatkan ringkasan bersih dalam hitungan detik. Setiap agent di marketplace mengikuti model pembayaran satu-klik yang sama.
> 
> Sekarang mari bicara tentang fitur paling powerful Vaxa: PayAgent. Ini adalah personal payment agent kamu — wallet manager yang bisa diprogram untuk mengeksekusi pembayaran atas namamu berdasarkan rules yang kamu definisikan. Buka dashboard PayAgent dan kamu akan melihat global spend limits: batas harian, mingguan, dan bulanan. Ini adalah batas keras. Sistem tidak akan pernah melebihinya, apapun yang terjadi. Tambahkan rule — misalnya, berlangganan Code Review Agent setiap Senin pagi jam sembilan seharga 0.05 USDC. Simpan. Sekarang PayAgent menanganinya secara otomatis. Setiap Senin, dia membayar, agent berjalan, dan pengeluaranmu tetap dalam budget yang kamu set. Kamu bisa melacak berapa yang sudah dikeluarkan hari ini, minggu ini, dan bulan ini, sampai sen terakhir.
> 
> Vaxa juga tersedia di Telegram. Buka chat dengan VaxaBot, ketik permintaan code review kamu, dan bot merespons dengan tombol bayar. Tap tombolnya, approve transaksi, dan hasilnya langsung kembali — semua tanpa membuka browser. Agent yang sama, alur pembayaran x402 yang sama, langsung di chat kamu.
> 
> Setiap transaksi sukses, baik dari web app maupun Telegram, memanggil recordSuccessfulTx di smart contract AgentRegistry kami. Kamu bisa melihat panggilan ini secara live di Snowtrace, explorer Fuji testnet. Contract mencatat alamat agent, jumlah yang dibayarkan, dan memperbarui skor reputasi menggunakan formula diminishing-returns — transaksi awal menumbuhkan reputasi dengan cepat, yang berikutnya berkontribusi secara stabil. Sepenuhnya transparan dan bisa diaudit oleh siapa pun.
> 
> Vaxa menggabungkan tiga hal yang belum pernah dikombinasikan sebelumnya: AI agents powerful yang benar-benar melakukan pekerjaan berguna, micro-payment via protokol x402 sehingga kamu hanya bayar per-task, dan reputasi on-chain yang trustless sehingga kamu selalu tahu agent mana yang memiliki track record terbukti. Tidak ada langganan. Tidak ada rating black-box. Hanya programmable money bertemu autonomous AI agents — dibangun di Avalanche Fuji testnet untuk SCBC Hackathon.

---

## Scene-by-Scene Breakdown

### Scene 1 — Hook (0:00–0:20)

**Visual:** Dark screen, text appears one by one  
**Narration:** *"Imagine being able to pay AI to work for you — automatically, per task, without wasteful monthly subscriptions..."*

**Visual:** Vaxa logo appears + animated agent icons  
**Narration:** *"This is Vaxa — an AI agent marketplace powered by micro-payments on the Avalanche blockchain."*

---

### Scene 2 — Landing Page & Marketplace (0:20–0:50)

**Visual:** Open browser at `https://scbc-hacks.vercel.app`

**Actions:**
1. Scroll the marketplace — show agent cards (Code Review, Summarizer, Translator, etc.)
2. Click an agent card to view details: price, on-chain reputation, transaction count
3. Point to the reputation badge

---

### Scene 3 — Connect Wallet (0:50–1:10)

**Visual:** Click the "Connect Wallet" button

**Actions:**
1. Click Connect Wallet → select MetaMask
2. Approve the connection in the MetaMask popup
3. Wallet address appears in the navbar

---

### Scene 4 — Demo AI Agent: Code Review (1:10–2:00)

**Visual:** Open the Code Review Agent page from the marketplace

**Actions:**
1. Paste sample code into the input field:
   ```javascript
   function fibonacci(n) {
     return n <= 1 ? n : fibonacci(n-1) + fibonacci(n-2);
   }
   ```
2. Select language: `javascript`, focus: `performance`
3. Click **Pay & Review**
4. MetaMask popup appears → show the 0.05 USDC payment
5. Approve the transaction → show results

---

### Scene 5 — Demo AI Agent: Summarizer (2:00–2:30)

**Visual:** Open the Summarizer Agent

**Actions:**
1. Paste a long article (e.g. a 500-word tech news paragraph)
2. Select style: `bullet`, maxLength: `150`
3. Click Pay & Summarize → approve MetaMask (0.02 USDC) → show result

---

### Scene 6 — PayAgent: Automated Payments (2:30–3:20)

**Visual:** Navigate to Dashboard → PayAgent

**Actions:**
1. Open the PayAgent config page — show global spend limits
2. Click "Add Rule" → fill in the form:
   - Name: "Weekly Code Review Subscription"
   - Type: subscription | Agent: Code Review Agent
   - Amount: 0.05 USDC | Schedule: every Monday at 09:00
3. Save the rule
4. Show spending stats: today / this week / this month

---

### Scene 7 — Telegram Bot (3:20–3:50)

**Visual:** Open Telegram, chat with @VaxaBot

**Actions:**
1. Type `/code function test() { return 42; }`
2. Bot replies with a "Pay 0.05 USDC" payment button
3. Tap the button → approve transaction → bot displays result

---

### Scene 8 — On-Chain Reputation (3:50–4:20)

**Visual:** Open Snowtrace (Fuji explorer) → show the AgentRegistry contract

**Actions:**
1. Show the contract on Snowtrace
2. Highlight `recordSuccessfulTx` calls in recent transactions
3. Return to marketplace — show the agent's rising reputation score

---

### Scene 9 — Closing (4:20–5:00)

**Visual:** Return to landing page, closing animation

**Narration:** *"Vaxa — programmable money meets autonomous AI agents."*

**Visual:** Show links:
- Website: `https://scbc-hacks.vercel.app`
- GitHub repo
- Telegram bot: `@VaxaBot`

---

## Production Notes

| Item | Detail |
|------|--------|
| Resolution | 1920x1080 (16:9) |
| Format | MP4 |
| Screen recorder | OBS / Loom |
| Background music | Lo-fi, instrumental, low volume |
| Text overlay font | Geist Mono (matches app UI) |
| Testnet wallet | Ensure AVAX + Fuji USDC are funded before recording |
| Backup take | Prepare 2 different wallets in case a transaction fails |

> *Resolusi 1920x1080, format MP4, screen recorder OBS/Loom, musik lo-fi instrumental volume rendah, font overlay Geist Mono. Pastikan wallet testnet sudah di-fund dan siapkan 2 wallet sebagai backup jika transaksi gagal.*

---

## Pre-Recording Checklist

- [ ] App is deployed on Vercel and accessible
- [ ] Testnet wallet is funded (AVAX for gas, Fuji USDC for payments)
- [ ] Smart contract is deployed on Fuji, address is correct in `.env`
- [ ] Telegram bot is live and responsive
- [ ] Browser zoom at 100%, dark mode enabled
- [ ] OS notifications disabled
- [ ] Microphone test passed

> *App sudah deploy di Vercel, wallet testnet sudah di-fund, smart contract sudah deploy di Fuji, Telegram bot aktif, browser zoom 100% dark mode, notifikasi OS dimatikan, mikrofon test OK.*
