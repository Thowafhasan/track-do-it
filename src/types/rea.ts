// REA (Resource - Event - Agent) TypeScript Architecture for Track Do It

export type FlowType = 'expense' | 'income' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'ewallet' | 'investment' | 'liability';
export type EntryChannel = 'manual' | 'voice_ai' | 'ocr' | 'shortcut';
export type SpaceRole = 'owner' | 'editor' | 'viewer';

// AGENTS
export interface Agent {
  id: string;
  name: string;
  type: 'internal_user' | 'external_merchant' | 'peer_collaborator';
}

export interface User extends Agent {
  type: 'internal_user';
  email: string;
  baseCurrency: string;
}

export interface Merchant extends Agent {
  type: 'external_merchant';
  rawAlias?: string;
  defaultCategoryId?: string;
  logoUrl?: string;
}

export interface Space {
  id: string;
  name: string;
  type: 'personal' | 'shared';
  ownerId: string;
  currency: string;
}

export interface SpaceMember {
  id: string;
  spaceId: string;
  userId: string;
  name: string;
  role: SpaceRole;
}

// RESOURCES
export interface Account {
  id: string;
  spaceId: string;
  name: string;
  type: AccountType;
  currency: string;
  balance: number;
  isLiability: boolean;
  institutionName?: string;
  accountNumber?: string;
  color?: string;
}

export interface Category {
  id: string;
  name: string;
  flowType: FlowType;
  icon: string;
  color: string;
}

export interface Budget {
  id: string;
  spaceId: string;
  categoryId: string;
  limitAmount: number;
  spentAmount: number;
  period: 'monthly' | 'weekly';
}

// EVENTS
export interface Transaction {
  id: string;
  spaceId: string;
  actorUserId: string; // Internal Agent
  merchantName?: string; // External Agent
  sourceAccountId?: string; // Decrement Resource (Out)
  destinationAccountId?: string; // Increment Resource (In)
  categoryId?: string;
  eventType: FlowType;
  amount: number;
  currency: string;
  timestamp: string; // ISO string
  entryChannel: EntryChannel;
  note: string;
  tags?: string[];
  receiptLogId?: string;
}

export interface ReceiptLog {
  id: string;
  transactionId?: string;
  rawOcrText: string;
  aiExtracted: {
    amount?: number;
    merchant?: string;
    date?: string;
    suggestedCategory?: string;
  };
  confidenceScore: number;
  createdAt: string;
}
