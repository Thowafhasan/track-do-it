import { DraftTransaction } from '@/components/DraftTransactionsModal';

export const INITIAL_DRAFTS: DraftTransaction[] = [
  {
    id: 'draft_1',
    merchant: 'Kopi Tuku Cipete',
    amount: 38000,
    category: 'Food & Beverage',
    channel: 'voice_ai',
    time: 'Baru saja',
    sourceAccount: 'GoPay'
  },
  {
    id: 'draft_2',
    merchant: 'SPBU Pertamina Shell Tebet',
    amount: 150000,
    category: 'Transportasi',
    channel: 'ocr',
    time: '2 jam lalu',
    sourceAccount: 'BCA Prioritas'
  },
  {
    id: 'draft_3',
    merchant: 'Indomaret Point Stasiun',
    amount: 46500,
    category: 'Belanja Harian',
    channel: 'shortcut',
    time: 'Hari ini 09:12',
    sourceAccount: 'GoPay'
  },
  {
    id: 'draft_4',
    merchant: 'Warteg Bahari Senopati',
    amount: 28000,
    category: 'Food & Beverage',
    channel: 'voice_ai',
    time: 'Kemarin',
    sourceAccount: 'Tunai (Cash)'
  },
  {
    id: 'draft_5',
    merchant: 'GrabCar Bandara Soetta',
    amount: 185000,
    category: 'Transportasi',
    channel: 'shortcut',
    time: 'Kemarin',
    sourceAccount: 'Bank Mandiri'
  },
  // Generate remaining drafts to make exactly 38 drafts
  ...Array.from({ length: 33 }).map((_, i) => ({
    id: `draft_${i + 6}`,
    merchant: [
      'Fore Coffee SCBD',
      'Alfamart Rasuna',
      'FamilyMart Sudirman',
      'Starbucks Reserve',
      'Apotek Kimia Farma',
      'Cinema XXI Plaza Senayan'
    ][i % 6],
    amount: (i + 1) * 12500 + 15000,
    category: ['Food & Beverage', 'Belanja Harian', 'Hiburan', 'Kesehatan'][i % 4],
    channel: (['voice_ai', 'ocr', 'shortcut'] as const)[i % 3],
    time: `${i + 2} hari lalu`,
    sourceAccount: ['BCA Prioritas', 'GoPay', 'Bank Mandiri'][i % 3]
  }))
];
