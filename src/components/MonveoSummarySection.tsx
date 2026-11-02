'use client';

import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ChevronDown,
  FileUp,
  Lightbulb,
  MessageSquare,
  Repeat,
  ChevronRight,
  Plus
} from 'lucide-react';
import { formatIDR } from '@/lib/mockData';

interface MonveoSummarySectionProps {
  totalExpense: number;
  draftCount: number;
  onOpenDrafts: () => void;
  onOpenImport: () => void;
  onOpenInsight: () => void;
  onOpenConsultation: () => void;
  onOpenSubscription: () => void;
  onAddCategory: () => void;
}

export function MonveoSummarySection({
  totalExpense,
  draftCount = 38,
  onOpenDrafts,
  onOpenImport,
  onOpenInsight,
  onOpenConsultation,
  onOpenSubscription,
  onAddCategory
}: MonveoSummarySectionProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [period, setPeriod] = useState('Periode ini');

  return (
    <div className="space-y-4">
      {/* 1. Header: Ringkasan + Eye Icon + Periode Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-zinc-300">Ringkasan</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-zinc-500 hover:text-zinc-300 transition p-0.5"
            title={showBalance ? 'Sembunyikan nominal' : 'Tampilkan nominal'}
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Periode ini Dropdown */}
        <div className="relative">
          <button
            onClick={() =>
              setPeriod((prev) => (prev === 'Periode ini' ? 'Bulan ini' : 'Periode ini'))
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] text-xs font-medium text-zinc-200 border border-zinc-800/40 transition active:scale-95"
          >
            <span>{period}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </div>

      {/* 2. Kartu Pengeluaran (Identik Screenshot) */}
      <div className="rounded-3xl bg-[#1c1c1e] border border-zinc-800/50 p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <span className="text-sm font-medium text-zinc-400 block">Pengeluaran</span>

          <div className="flex items-center gap-2.5">
            {/* Small Red Capsule indicator from screenshot */}
            <span className="w-4 h-2 rounded-xs bg-[#e11d48] shadow-sm shadow-rose-900/50" />
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {showBalance ? formatIDR(totalExpense) : 'Rp ••••••••'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Empat Tombol Kapsul (Quick Action Pills) */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-4 gap-3">
          {/* 1. Import */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onOpenImport}
              className="w-14 h-14 rounded-2xl bg-[#242426] hover:bg-[#2c2c2e] text-zinc-200 flex items-center justify-center transition active:scale-95 border border-zinc-800/60 shadow-md group"
            >
              <FileUp className="w-5 h-5 group-hover:scale-110 transition" />
            </button>
            <span className="text-[11px] font-medium text-zinc-300">Import</span>
          </div>

          {/* 2. Insight */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onOpenInsight}
              className="w-14 h-14 rounded-2xl bg-[#242426] hover:bg-[#2c2c2e] text-zinc-200 flex items-center justify-center transition active:scale-95 border border-zinc-800/60 shadow-md group"
            >
              <Lightbulb className="w-5 h-5 group-hover:scale-110 transition" />
            </button>
            <span className="text-[11px] font-medium text-zinc-300">Insight</span>
          </div>

          {/* 3. Konsultasi with "New" Badge */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative">
              <span className="absolute -top-1.5 -right-1 z-10 px-1.5 py-0.2 rounded-full bg-[#f43f5e] text-white text-[9px] font-bold shadow-sm">
                New
              </span>
              <button
                onClick={onOpenConsultation}
                className="w-14 h-14 rounded-2xl bg-[#242426] hover:bg-[#2c2c2e] text-zinc-200 flex items-center justify-center transition active:scale-95 border border-zinc-800/60 shadow-md group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
            </div>
            <span className="text-[11px] font-medium text-zinc-300">Konsultasi</span>
          </div>

          {/* 4. Subscription */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onOpenSubscription}
              className="w-14 h-14 rounded-2xl bg-[#242426] hover:bg-[#2c2c2e] text-zinc-200 flex items-center justify-center transition active:scale-95 border border-zinc-800/60 shadow-md group"
            >
              <Repeat className="w-5 h-5 group-hover:scale-110 transition" />
            </button>
            <span className="text-[11px] font-medium text-zinc-300">Subscription</span>
          </div>
        </div>

        {/* Carousel Pagination Dots from screenshot */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="w-3.5 h-1 rounded-full bg-zinc-300" />
          <span className="w-1.5 h-1 rounded-full bg-zinc-700" />
        </div>
      </div>

      {/* 4. Bar Draft Transaksi (Pill Accordion) */}
      <button
        onClick={onOpenDrafts}
        className="w-full rounded-2xl bg-[#1c1c1e] hover:bg-[#252528] border border-zinc-800/50 px-5 py-4 flex items-center justify-between text-left transition active:scale-98 shadow-md"
      >
        <span className="text-sm font-semibold text-zinc-200">
          {draftCount} draft transaksi
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>

      {/* 5. Periode ini Donut Chart & Empty State */}
      <div className="space-y-2 pt-2">
        <span className="text-sm font-semibold text-zinc-400 px-1 block">Periode ini</span>

        <div className="rounded-3xl bg-[#1c1c1e] border border-zinc-800/50 p-8 flex flex-col items-center justify-center text-center space-y-5 min-h-[320px] shadow-xl">
          {/* Donut Chart */}
          <div className="relative w-44 h-44 rounded-full border-[12px] border-[#2c2c2e] flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-white">0</span>
            <span className="text-xs text-zinc-400 mt-0.5">Transaksi</span>
          </div>

          {/* Description */}
          <div className="space-y-1.5 max-w-xs">
            <h3 className="text-base font-bold text-white">Belum ada kategori</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tambah kategori pertama untuk mulai melihat breakdown transaksi.
            </p>
          </div>

          {/* Button Tambah Kategori Baru */}
          <button
            onClick={onAddCategory}
            className="px-5 py-2.5 rounded-full bg-[#2c2c2e] hover:bg-[#38383c] text-white text-xs font-semibold transition active:scale-95 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah kategori baru</span>
          </button>
        </div>
      </div>
    </div>
  );
}
