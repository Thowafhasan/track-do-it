'use client';

import React, { useState } from 'react';
import { Account, Category, FlowType, Transaction } from '@/types/rea';
import { X, Check } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  categories: Category[];
  currentSpaceId: string;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  accounts,
  categories,
  currentSpaceId,
  onAddTransaction
}: AddTransactionModalProps) {
  const [eventType, setEventType] = useState<FlowType>('expense');
  const [amount, setAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id || '');
  const [destinationAccountId, setDestinationAccountId] = useState(accounts[1]?.id || '');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [merchantName, setMerchantName] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (!numAmount || numAmount <= 0) return;

    onAddTransaction({
      spaceId: currentSpaceId,
      actorUserId: 'usr_thowaf_01',
      merchantName: eventType === 'transfer' ? undefined : merchantName || 'Umum',
      sourceAccountId: eventType === 'income' ? undefined : sourceAccountId,
      destinationAccountId: eventType === 'expense' ? undefined : destinationAccountId,
      categoryId: eventType === 'transfer' ? undefined : categoryId,
      eventType,
      amount: numAmount,
      currency: 'IDR',
      entryChannel: 'manual',
      note
    });

    // Reset & Close
    setAmount('');
    setMerchantName('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-100">Tambah Transaksi Baru</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Type Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            {(['expense', 'income', 'transfer'] as FlowType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEventType(type)}
                className={`py-1.5 text-xs font-semibold rounded-lg capitalize transition ${
                  eventType === type
                    ? type === 'expense'
                      ? 'bg-rose-500 text-white'
                      : type === 'income'
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-sky-500 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {type === 'expense' ? 'Pengeluaran' : type === 'income' ? 'Pemasukan' : 'Transfer'}
              </button>
            ))}
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Nominal (Rp)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-lg font-bold text-zinc-100 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Accounts (Resources) */}
          {eventType !== 'income' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                {eventType === 'transfer' ? 'Dari Akun (Sumber Dana)' : 'Metode Pembayaran (Akun)'}
              </label>
              <select
                value={sourceAccountId}
                onChange={(e) => setSourceAccountId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.isLiability ? 'Tagihan' : 'Saldo'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {eventType !== 'expense' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                {eventType === 'transfer' ? 'Ke Akun (Tujuan Transfer)' : 'Masuk ke Akun'}
              </label>
              <select
                value={destinationAccountId}
                onChange={(e) => setDestinationAccountId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                {accounts
                  .filter((a) => (eventType === 'transfer' ? a.id !== sourceAccountId : true))
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Category */}
          {eventType !== 'transfer' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Kategori
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                {categories
                  .filter((c) => (eventType === 'income' ? c.flowType === 'income' : c.flowType === 'expense'))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Merchant (Agent) */}
          {eventType !== 'transfer' && (
            <div>
              <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Merchant / Tempat Transaksi (Agent)
              </label>
              <input
                type="text"
                value={merchantName}
                onChange={(e) => setMerchantName(e.target.value)}
                placeholder="Contoh: Starbucks, Indomaret..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Note */}
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Catatan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Keterangan tambahan..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95 pt-3"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Transaksi</span>
          </button>
        </form>
      </div>
    </div>
  );
}
