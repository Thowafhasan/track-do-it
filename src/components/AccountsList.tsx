'use client';

import React from 'react';
import { Account } from '@/types/rea';
import { formatIDR } from '@/lib/mockData';
import { Landmark, Smartphone, Banknote, LineChart, CreditCard, Layers } from 'lucide-react';

interface AccountsListProps {
  accounts: Account[];
}

export function AccountsList({ accounts }: AccountsListProps) {
  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'bank':
        return <Landmark className="w-4 h-4" />;
      case 'ewallet':
        return <Smartphone className="w-4 h-4" />;
      case 'investment':
        return <LineChart className="w-4 h-4" />;
      case 'liability':
        return <CreditCard className="w-4 h-4" />;
      case 'cash':
      default:
        return <Banknote className="w-4 h-4" />;
    }
  };

  const getAccountBadge = (type: Account['type']) => {
    switch (type) {
      case 'bank':
        return 'Bank';
      case 'ewallet':
        return 'E-Wallet';
      case 'investment':
        return 'Investasi';
      case 'liability':
        return 'Tagihan CC';
      case 'cash':
      default:
        return 'Tunai';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight text-zinc-100 uppercase">
            Sumber Daya Ekonomi (Resources)
          </h2>
        </div>
        <span className="text-xs text-zinc-500">{accounts.length} Akun Terdaftar</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="group relative p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-100"
                  style={{ backgroundColor: acc.color ? `${acc.color}25` : '#27272a', color: acc.color || '#e4e4e7' }}
                >
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-white transition">
                    {acc.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {acc.institutionName || getAccountBadge(acc.type)} {acc.accountNumber && `• ${acc.accountNumber}`}
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  acc.isLiability
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700/50'
                }`}
              >
                {acc.isLiability ? 'Liabilitas' : 'Aset'}
              </span>
            </div>

            <div className="pt-2 border-t border-zinc-800/40 flex items-baseline justify-between">
              <span className="text-xs text-zinc-500">Saldo:</span>
              <span
                className={`text-base font-bold tracking-tight ${
                  acc.isLiability ? 'text-rose-400' : 'text-zinc-100'
                }`}
              >
                {formatIDR(acc.balance)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
