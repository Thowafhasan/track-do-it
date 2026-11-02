'use client';

import React from 'react';
import { X, Check, Trash2, Sparkles, Mic, Camera, Smartphone } from 'lucide-react';
import { formatIDR } from '@/lib/mockData';

export interface DraftTransaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  channel: 'voice_ai' | 'ocr' | 'shortcut';
  time: string;
  sourceAccount: string;
}

interface DraftTransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: DraftTransaction[];
  onApprove: (draft: DraftTransaction) => void;
  onApproveAll: () => void;
  onDeleteDraft: (id: string) => void;
}

export function DraftTransactionsModal({
  isOpen,
  onClose,
  drafts,
  onApprove,
  onApproveAll,
  onDeleteDraft
}: DraftTransactionsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-[#1c1c1e] border border-zinc-800 p-6 shadow-2xl relative space-y-5 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Antrean Draft Transaksi</h3>
              <p className="text-xs text-zinc-400">{drafts.length} transaksi menunggu persetujuan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Header */}
        {drafts.length > 0 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-zinc-400">Hasil tangkapan Voice & OCR</span>
            <button
              onClick={onApproveAll}
              className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-sm"
            >
              Setujui Semua ({drafts.length})
            </button>
          </div>
        )}

        {/* List of Drafts */}
        <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
          {drafts.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">
              Semua draft telah disetujui atau dihapus.
            </div>
          ) : (
            drafts.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-2xl bg-[#242426] border border-zinc-800/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                    {d.channel === 'voice_ai' ? (
                      <Mic className="w-4 h-4 text-emerald-400" />
                    ) : d.channel === 'ocr' ? (
                      <Camera className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-violet-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white block truncate">
                      {d.merchant}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {d.category} &bull; {d.sourceAccount} &bull; {d.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-rose-400 font-mono">
                    -{formatIDR(d.amount)}
                  </span>

                  <button
                    onClick={() => onApprove(d)}
                    className="p-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-black transition"
                    title="Setujui"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDraft(d.id)}
                    className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
