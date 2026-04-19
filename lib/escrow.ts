import { ethers } from "ethers";

const ESCROW_STATE = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  AWAITING_RELEASE: "AWAITING_RELEASE",
  COMPLETED: "COMPLETED",
  REFUNDED: "REFUNDED",
  EXPIRED: "EXPIRED",
} as const;

type EscrowState = typeof ESCROW_STATE[keyof typeof ESCROW_STATE];

interface Escrow {
  id: string;
  userId: string;
  agentId: string;
  amount: string;
  task: string;
  language?: string;
  result?: string;
  status: EscrowState;
  createdAt: number;
  expiresAt: number;
}

const escrows = new Map<string, Escrow>();

function generateId(): string {
  return `escrow_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function createEscrow(params: {
  userId: string;
  agentId: string;
  amount: string;
  task: string;
  language?: string;
  timeout?: number;
}): Escrow {
  const timeout = params.timeout || 3600;
  
  const escrow: Escrow = {
    id: generateId(),
    userId: params.userId,
    agentId: params.agentId,
    amount: params.amount,
    task: params.task,
    language: params.language,
    status: ESCROW_STATE.PENDING,
    createdAt: Date.now(),
    expiresAt: Date.now() + timeout * 1000,
  };
  
  escrows.set(escrow.id, escrow);
  
  return escrow;
}

function getEscrow(id: string): Escrow | undefined {
  return escrows.get(id);
}

function updateStatus(id: string, status: EscrowState, result?: string): Escrow | undefined {
  const escrow = escrows.get(id);
  if (!escrow) return undefined;
  
  escrow.status = status;
  if (result) escrow.result = result;
  
  return escrow;
}

function approveEscrow(id: string): { success: boolean; message: string; escrow?: Escrow } {
  const escrow = escrows.get(id);
  
  if (!escrow) {
    return { success: false, message: "Escrow not found" };
  }
  
  if (escrow.status !== ESCROW_STATE.AWAITING_RELEASE) {
    return { success: false, message: `Cannot approve. Current status: ${escrow.status}` };
  }
  
  escrow.status = ESCROW_STATE.COMPLETED;
  
  return {
    success: true,
    message: `Payment of ${escrow.amount} USDC released to agent ${escrow.agentId.slice(0, 6)}...`,
    escrow,
  };
}

function rejectEscrow(id: string): { success: boolean; message: string; escrow?: Escrow } {
  const escrow = escrows.get(id);
  
  if (!escrow) {
    return { success: false, message: "Escrow not found" };
  }
  
  if (escrow.status !== ESCROW_STATE.AWAITING_RELEASE) {
    return { success: false, message: `Cannot reject. Current status: ${escrow.status}` };
  }
  
  escrow.status = ESCROW_STATE.REFUNDED;
  
  return {
    success: true,
    message: `Payment of ${escrow.amount} USDC refunded to user`,
    escrow,
  };
}

function isExpired(id: string): boolean {
  const escrow = escrows.get(id);
  if (!escrow) return true;
  
  return Date.now() > escrow.expiresAt;
}

function getUserEscrows(userId: string): Escrow[] {
  return Array.from(escrows.values()).filter((e) => e.userId === userId);
}

export {
  ESCROW_STATE,
  type EscrowState,
  type Escrow,
  createEscrow,
  getEscrow,
  updateStatus,
  approveEscrow,
  rejectEscrow,
  isExpired,
  getUserEscrows,
};