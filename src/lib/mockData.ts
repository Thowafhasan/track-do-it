// Mock Data & Storage Manager implementing REA Ontology

import { Account, Category, Space, Transaction, User, Budget } from '@/types/rea';

export const INITIAL_USER: User = {
  id: 'usr_thowaf_01',
  name: 'Thowaf Hasan',
  email: 'thowafhasan@gmail.com',
  baseCurrency: 'IDR',
  type: 'internal_user'
};

export const INITIAL_SPACES: Space[] = [
  {
    id: 'space_personal',
    name: 'Personal Finance',
    type: 'personal',
    ownerId: INITIAL_USER.id,
    currency: 'IDR'
  },
  {
    id: 'space_shared',
    name: 'Household & Travel (Shared)',
    type: 'shared',
    ownerId: INITIAL_USER.id,
    currency: 'IDR'
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_fnb', name: 'Food & Beverage', flowType: 'expense', icon: 'Utensils', color: '#f97316' },
  { id: 'cat_transport', name: 'Transportasi', flowType: 'expense', icon: 'Car', color: '#06b6d4' },
  { id: 'cat_groceries', name: 'Belanja Harian', flowType: 'expense', icon: 'ShoppingBag', color: '#10b981' },
  { id: 'cat_bills', name: 'Tagihan & Utilitas', flowType: 'expense', icon: 'Zap', color: '#eab308' },
  { id: 'cat_entertainment', name: 'Hiburan & Lifestyle', flowType: 'expense', icon: 'Film', color: '#8b5cf6' },
  { id: 'cat_salary', name: 'Gaji & Pendapatan', flowType: 'income', icon: 'Briefcase', color: '#22c55e' },
  { id: 'cat_investment', name: 'Hasil Investasi', flowType: 'income', icon: 'TrendingUp', color: '#3b82f6' },
  { id: 'cat_transfer', name: 'Transfer Antar Akun', flowType: 'transfer', icon: 'ArrowLeftRight', color: '#64748b' }
];

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc_bca',
    spaceId: 'space_personal',
    name: 'BCA Prioritas',
    type: 'bank',
    currency: 'IDR',
    balance: 28450000,
    isLiability: false,
    institutionName: 'Bank Central Asia',
    accountNumber: '•••• 8821',
    color: '#2563eb'
  },
  {
    id: 'acc_mandiri',
    spaceId: 'space_personal',
    name: 'Bank Mandiri',
    type: 'bank',
    currency: 'IDR',
    balance: 14200000,
    isLiability: false,
    institutionName: 'Bank Mandiri',
    accountNumber: '•••• 4109',
    color: '#0284c7'
  },
  {
    id: 'acc_gopay',
    spaceId: 'space_personal',
    name: 'GoPay',
    type: 'ewallet',
    currency: 'IDR',
    balance: 785000,
    isLiability: false,
    institutionName: 'GoTo Financial',
    color: '#059669'
  },
  {
    id: 'acc_cash',
    spaceId: 'space_personal',
    name: 'Tunai (Cash)',
    type: 'cash',
    currency: 'IDR',
    balance: 450000,
    isLiability: false,
    color: '#d97706'
  },
  {
    id: 'acc_bibit',
    spaceId: 'space_personal',
    name: 'Bibit Investasi',
    type: 'investment',
    currency: 'IDR',
    balance: 55000000,
    isLiability: false,
    institutionName: 'Bibit Reksadana & SBN',
    color: '#7c3aed'
  },
  {
    id: 'acc_cc_bca',
    spaceId: 'space_personal',
    name: 'Kartu Kredit BCA',
    type: 'liability',
    currency: 'IDR',
    balance: 3850000, // Hutang berjalan
    isLiability: true,
    institutionName: 'BCA Everyday Card',
    accountNumber: '•••• 1982',
    color: '#e11d48'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'bg_fnb',
    spaceId: 'space_personal',
    categoryId: 'cat_fnb',
    limitAmount: 4000000,
    spentAmount: 2150000,
    period: 'monthly'
  },
  {
    id: 'bg_groceries',
    spaceId: 'space_personal',
    categoryId: 'cat_groceries',
    limitAmount: 3000000,
    spentAmount: 1840000,
    period: 'monthly'
  },
  {
    id: 'bg_transport',
    spaceId: 'space_personal',
    categoryId: 'cat_transport',
    limitAmount: 1500000,
    spentAmount: 620000,
    period: 'monthly'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_01',
    spaceId: 'space_personal',
    actorUserId: INITIAL_USER.id,
    merchantName: 'Starbucks Reserve Senopati',
    sourceAccountId: 'acc_gopay',
    categoryId: 'cat_fnb',
    eventType: 'expense',
    amount: 68000,
    currency: 'IDR',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    entryChannel: 'voice_ai',
    note: 'Iced Caramel Macchiato oatmilk'
  },
  {
    id: 'tx_02',
    spaceId: 'space_personal',
    actorUserId: INITIAL_USER.id,
    merchantName: 'Indomaret Point',
    sourceAccountId: 'acc_bca',
    categoryId: 'cat_groceries',
    eventType: 'expense',
    amount: 142500,
    currency: 'IDR',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    entryChannel: 'ocr',
    note: 'Kebutuhan mingguan & camilan'
  },
  {
    id: 'tx_03',
    spaceId: 'space_personal',
    actorUserId: INITIAL_USER.id,
    merchantName: 'PT Teknologi Digital Nusantara',
    destinationAccountId: 'acc_bca',
    categoryId: 'cat_salary',
    eventType: 'income',
    amount: 25000000,
    currency: 'IDR',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    entryChannel: 'manual',
    note: 'Gaji Bulanan & Tunjangan'
  },
  {
    id: 'tx_04',
    spaceId: 'space_personal',
    actorUserId: INITIAL_USER.id,
    sourceAccountId: 'acc_bca',
    destinationAccountId: 'acc_gopay',
    categoryId: 'cat_transfer',
    eventType: 'transfer',
    amount: 500000,
    currency: 'IDR',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    entryChannel: 'shortcut',
    note: 'Top up GoPay mingguan'
  }
];

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(amount);
}
