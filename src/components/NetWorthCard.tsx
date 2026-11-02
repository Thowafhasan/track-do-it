'use client';

import React from 'react';
import { Account, Transaction } from '@/types/rea';
import { formatIDR } from '@/lib/mockData';
import { TrendingUp, TrendingDown, ShieldCheck, ArrowUpRight, ArrowDownRight, Layers } from 'lucide-react';

interface NetWorthCardProps {
  accounts: Account[];
  transactions: Transaction[];
}

export function NetWorthCard({ accounts, transactions }: NetWorthCardProps) {
  // REA Calculation:
  // Net Worth = Total (Non-liability Accounts) - Total (Liability Accounts)
  const totalAssets = accounts
    .filter((a) => !a.isLiability)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.isLiability)
    .reduce((sum, a) => sum + a.balance, 0);

  const netWorth = totalAssets - totalLiabilities;

  // Monthly Cash Flow
  const totalIncome = transactions
    .filter((t) => t.eventType === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.eventType === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Total Net Worth (Kekayaan Bersih)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Realtime REA
            </span>
          </div>

          <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight">
            {formatIDR(netWorth)}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Aset:</span>
              <strong className="text-zinc-200">{formatIDR(totalAssets)}</strong>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Liabilitas:</span>
              <strong className="text-zinc-200">{formatIDR(totalLiabilities)}</strong>
            </div>
          </div>
        </div>

        {/* Cashflow Highlights */}
        <div className="grid grid-cols-2 gap-3 w-full md:w-auto min-w-[260px]">
          {/* Pemasukan */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Pemasukan</span>
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ArrowDownRight className="w-3 h-3" />
              </div>
            </div>
            <div className="text-sm sm:text-base font-bold text-emerald-400">
              +{formatIDR(totalIncome)}
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Pengeluaran</span>
              <div className="w-5 h-5 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
            <div className="text-sm sm:text-base font-bold text-rose-400">
              -{formatIDR(totalExpense)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
