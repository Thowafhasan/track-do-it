// Smart NLP & Entity Extraction for Voice/Text Ingestion in Indonesian

import { FlowType } from '@/types/rea';

export interface ParsedTransaction {
  amount: number;
  eventType: FlowType;
  merchant?: string;
  categoryName?: string;
  accountName?: string;
  confidence: number;
  rawText: string;
}

export function parseIndonesianFinancialText(input: string): ParsedTransaction {
  const text = input.trim().toLowerCase();
  
  // 1. Determine Event Type
  let eventType: FlowType = 'expense';
  if (text.includes('gaji') || text.includes('income') || text.includes('pemasukan') || text.includes('bonus') || text.includes('terima')) {
    eventType = 'income';
  } else if (text.includes('transfer') || text.includes('kirim ke') || text.includes('pindah')) {
    eventType = 'transfer';
  }

  // 2. Extract Amount
  // Matches: 50rb, 50k, 50 ribu, 1.5 juta, 1,5jt, 50000, 50.000, 1000
  let amount = 0;
  
  // Regex for "X juta" / "X jt"
  const jutaMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/);
  // Regex for "X ribu" / "X rb" / "X k"
  const ribuMatch = text.match(/(\d+(?:[.,]\d+)?)\s*(?:ribu|rb|k\b)/);
  // Regex for direct numbers like "Rp 50.000" or "50000"
  const directMatch = text.match(/(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d{4,})/);

  if (jutaMatch) {
    const val = parseFloat(jutaMatch[1].replace(',', '.'));
    amount = Math.round(val * 1000000);
  } else if (ribuMatch) {
    const val = parseFloat(ribuMatch[1].replace(',', '.'));
    amount = Math.round(val * 1000);
  } else if (directMatch) {
    const valStr = directMatch[1].replace(/\./g, '');
    amount = parseInt(valStr, 10) || 0;
  } else {
    // fallback standalone digit
    const standaloneMatch = text.match(/\b(\d+)\b/);
    if (standaloneMatch) {
      amount = parseInt(standaloneMatch[1], 10) || 0;
    }
  }

  // 3. Extract Account / Resource (GoPay, OVO, Dana, BCA, Mandiri, Tunai, Kartu Kredit)
  let accountName = 'Tunai (Cash)';
  if (text.includes('gopay') || text.includes('go pay')) accountName = 'GoPay';
  else if (text.includes('ovo')) accountName = 'OVO';
  else if (text.includes('dana')) accountName = 'DANA';
  else if (text.includes('bca')) accountName = 'BCA Prioritas';
  else if (text.includes('mandiri')) accountName = 'Bank Mandiri';
  else if (text.includes('kartu kredit') || text.includes('cc')) accountName = 'Kartu Kredit BCA';
  else if (text.includes('bibit') || text.includes('reksadana')) accountName = 'Bibit Investasi';

  // 4. Extract Category & Merchant
  let categoryName = 'Lain-lain';
  let merchant = 'Umum';

  if (text.includes('kopi') || text.includes('coffee') || text.includes('starbucks') || text.includes('kenangan') || text.includes('fore')) {
    categoryName = 'Food & Beverage';
    if (text.includes('starbucks')) merchant = 'Starbucks';
    else if (text.includes('kenangan')) merchant = 'Kopi Kenangan';
    else if (text.includes('fore')) merchant = 'Fore Coffee';
    else merchant = 'Coffee Shop';
  } else if (text.includes('makan') || text.includes('restoran') || text.includes('warteg') || text.includes('padang') || text.includes('lunch') || text.includes('dinner')) {
    categoryName = 'Food & Beverage';
    if (text.includes('warteg')) merchant = 'Warteg Bahari';
    else if (text.includes('padang')) merchant = 'RM Padang Sederhana';
    else merchant = 'Restoran';
  } else if (text.includes('bensin') || text.includes('pertalite') || text.includes('pertamax') || text.includes('spbu') || text.includes('shell')) {
    categoryName = 'Transportasi';
    merchant = text.includes('shell') ? 'Shell' : 'Pertamina SPBU';
  } else if (text.includes('gojek') || text.includes('grab') || text.includes('maxim') || text.includes('ojol') || text.includes('taksi')) {
    categoryName = 'Transportasi';
    merchant = text.includes('grab') ? 'Grab' : 'Gojek Transport';
  } else if (text.includes('indomaret') || text.includes('alfamart') || text.includes('supermarket') || text.includes('belanja')) {
    categoryName = 'Belanja Harian';
    if (text.includes('indomaret')) merchant = 'Indomaret';
    else if (text.includes('alfamart')) merchant = 'Alfamart';
    else merchant = 'Supermarket';
  } else if (text.includes('listrik') || text.includes('pln') || text.includes('wifi') || text.includes('indihome') || text.includes('pulsa')) {
    categoryName = 'Tagihan & Utilitas';
    merchant = text.includes('pln') ? 'PLN Token' : 'Penyedia Utilitas';
  } else if (text.includes('gaji') || text.includes('payroll')) {
    categoryName = 'Gaji & Pendapatan';
    merchant = 'Kantor (Payroll)';
  }

  // Confidence calculation
  let confidence = 0.5;
  if (amount > 0) confidence += 0.3;
  if (categoryName !== 'Lain-lain') confidence += 0.15;
  if (accountName !== 'Tunai (Cash)') confidence += 0.05;

  return {
    amount,
    eventType,
    merchant,
    categoryName,
    accountName,
    confidence: Math.min(confidence, 0.98),
    rawText: input
  };
}
