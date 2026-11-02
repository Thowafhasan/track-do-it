'use client';

import React from 'react';
import { Home, Clock, Plus, CreditCard } from 'lucide-react';

export type MonveoTab = 'home' | 'history' | 'add' | 'cards';

interface FloatingBottomDockProps {
  activeTab: MonveoTab;
  onSelectTab: (tab: MonveoTab) => void;
  onQuickAdd: () => void;
}

export function FloatingBottomDock({
  activeTab,
  onSelectTab,
  onQuickAdd
}: FloatingBottomDockProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto px-2 pointer-events-auto">
      <nav
        aria-label="Bottom Navigation"
        className="flex items-center gap-2 sm:gap-4 px-3 py-2 rounded-full bg-[#1c1c1e]/90 backdrop-blur-2xl border border-zinc-700/50 shadow-2xl shadow-black/80"
      >
        {/* Tab 1: Home (Active Pill) */}
        <button
          onClick={() => onSelectTab('home')}
          className={`px-5 py-2.5 rounded-full flex items-center justify-center transition active:scale-95 ${
            activeTab === 'home'
              ? 'bg-[#323236] text-white shadow-inner'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Tab 2: History (Riwayat Jam) */}
        <button
          onClick={() => onSelectTab('history')}
          className={`px-4 py-2.5 rounded-full flex items-center justify-center transition active:scale-95 ${
            activeTab === 'history'
              ? 'bg-[#323236] text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Riwayat Transaksi"
        >
          <Clock className="w-5 h-5" />
        </button>

        {/* Tab 3: Add (+) */}
        <button
          onClick={onQuickAdd}
          className="w-11 h-11 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center font-bold transition active:scale-90 shadow-lg shadow-white/10"
          title="Tambah Transaksi Cepat"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Tab 4: Cards / Wallet */}
        <button
          onClick={() => onSelectTab('cards')}
          className={`px-4 py-2.5 rounded-full flex items-center justify-center transition active:scale-95 ${
            activeTab === 'cards'
              ? 'bg-[#323236] text-white'
              : 'text-zinc-400 hover:text-white'
          }`}
          title="Akun & Kartu"
        >
          <CreditCard className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
}
