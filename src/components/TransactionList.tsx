'use client';

import React from 'react';
import { Transaction, Category, Account } from '@/types/rea';
import { formatIDR } from '@/lib/mockData';
import {
  Mic,
  Camera,
  Smartphone,
  Edit3,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Store,
  Clock,
  Trash2
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  accounts: Account[];
  onDeleteTransaction: (id: string) => void;
}

export function TransactionList({
  transactions,
  categories,
  accounts,
  onDeleteTransaction
}: TransactionListProps) {
  const getChannelBadge = (channel: Transaction['entryChannel']) => {
    switch (channel) {
      case 'voice_ai':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Mic className="w-2.5 h-2.5" /> Voice AI
          </span>
        );
      case 'ocr':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            <Camera className="w-2.5 h-2.5" /> OCR Struk
          </span>
        );
      case 'shortcut':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
            <Smartphone className="w-2.5 h-2.5" /> Shortcut
          </span>
        );
      case 'manual':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
            <Edit3 className="w-2.5 h-2.5" /> Manual
          </span>
        );
    }
  };

  const getEventIcon = (type: Transaction['eventType']) => {
    switch (type) {
      case 'income':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'expense':
        return <ArrowUpRight className="w-4 h-4 text-rose-400" />;
      case 'transfer':
      default:
        return <ArrowLeftRight className="w-4 h-4 text-sky-400" />;
    }
  };

  const formatTimestamp = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold tracking-tight text-zinc-100 uppercase">
            Peristiwa Ekonomi (Economic Events)
          </h2>
        </div>
        <span className="text-xs text-zinc-500">{transactions.length} Aktivitas</span>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-sm">
          Belum ada transaksi tercatat di ruang ini. Gunakan tombol suara atau scan untuk mencatat!
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => {
            const cat = categories.find((c) => c.id === tx.categoryId);
            const sourceAcc = accounts.find((a) => a.id === tx.sourceAccountId);
            const destAcc = accounts.find((a) => a.id === tx.destinationAccountId);

            return (
              <div
                key={tx.id}
                className="group p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 transition flex items-center justify-between gap-4"
              >
                {/* Left: Icon & Description */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    {getEventIcon(tx.eventType)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-zinc-200 text-sm truncate">
                        {tx.merchantName || cat?.name || 'Transaksi'}
                      </span>
                      {getChannelBadge(tx.entryChannel)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5 truncate">
                      <span>{formatTimestamp(tx.timestamp)}</span>
                      <span>•</span>
                      {tx.eventType === 'transfer' ? (
                        <span>
                          {sourceAcc?.name || 'Akun Asal'} &rarr; {destAcc?.name || 'Akun Tujuan'}
                        </span>
                      ) : (
                        <span>{sourceAcc?.name || destAcc?.name || 'Tunai'}</span>
                      )}
                      {tx.note && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-400 italic truncate max-w-[150px] sm:max-w-[200px]">
                            &ldquo;{tx.note}&rdquo;
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Button */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        tx.eventType === 'income'
                          ? 'text-emerald-400'
                          : tx.eventType === 'expense'
                          ? 'text-rose-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {tx.eventType === 'income' ? '+' : tx.eventType === 'expense' ? '-' : ''}
                      {formatIDR(tx.amount)}
                    </div>
                    <div className="text-[10px] text-zinc-500 uppercase">{cat?.name || tx.eventType}</div>
                  </div>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
