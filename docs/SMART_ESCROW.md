# Smart Escrow - Technical Specification

## Concept

Smart Escrow holds payment until AI agent task is completed and verified. If user approves or timeout, payment released to agent.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART ESCROW FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  User                  Escrow                    Agent             │
│    │                     │                          │            │
│    │  1. Create escrow   │                          │            │
│    │  (with USDC)         │                          │            │
│    ├────────────────────▶│                          │            │
│    │                     │                          │            │
│    │                     │  2. Execute task        │            │
│    │                     ├─────────────────────────▶│           │
│    │                     │                          │            │
│    │                     │  3. Return result      │           │
│    │                     │◀─────────────────────────┤           │
│    │                     │                          │            │
│    │  4. Review result   │                          │            │
│    │  (approve/reject)  │                          │            │
│    ├────────────────────▶│                          │            │
│    │                     │                          │            │
│    │                     │  5a. APPROVE            │           │
│    │                     │  → Release payment      │           │
│    │                     ├─────────────────────────▶│           │
│    │                     │                          │            │
│    │                     │  5b. REJECT             │           │
│    │                     │  → Refund to user       │           │
│    │                     │◀────────────────────────┤           │
└─────────────────────────────────────────────────────────────────┘
```

## States

| State | Description |
|-------|-------------|
| `PENDING` | Escrow created, waiting for agent |
| `IN_PROGRESS` | Agent executing task |
| `Awaiting_RELEASE` | Task complete, waiting for user approval |
| `COMPLETED` | Payment released to agent |
| `REFUNDED` | Payment refunded to user |
| `EXPIRED` | Timeout, auto-release or refund |

## API Endpoints

### POST /api/escrow/create
```json
{
  "agentId": "0x...",
  "amount": "0.05",
  "task": "Code review my code",
  "language": "typescript",
  "timeout": 3600  // seconds
}
```

### POST /api/escrow/{id}/execute
```
→ Agent executes task
→ Returns result
```

### POST /api/escrow/{id}/approve
```
→ Release payment to agent
→ Update status to COMPLETED
```

### POST /api/escrow/{id}/reject
```
→ Refund to user
→ Update status to REFUNDED
```

### GET /api/escrow/{id}
```
→ Get escrow status and result
```

## Implementation Files

- `app/api/escrow/create/route.ts` - Create escrow
- `app/api/escrow/[id]/execute/route.ts` - Execute via agent
- `app/api/escrow/[id]/approve/route.ts` - Approve & release
- `app/api/escrow/[id]/reject/route.ts` - Reject & refund
- `lib/escrow.ts` - Escrow logic

## Escrow in Telegram Bot

```
User: /escrow code function hello()

Bot: 🔒 Creating escrow: 0.05 USDC
    Task: Code review
    [Confirm] [Cancel]

User: (Confirm)

Bot: ⏳ Escrow created! ID: abc123
    Agent will execute shortly...

Bot: 📋 Result ready:
    [Medium] Missing return type
    
    [Approve - Release 0.05 USDC]
    [Reject - Refund]
```

## Priority for Hackathon

1. ✅ Telegram Bot with payment (done)
2. 🔄 Smart Escrow (in progress)
3. 🔄 Routing Agent (future)
4. 🔄 Agent Composition (future)