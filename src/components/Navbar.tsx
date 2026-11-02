'use client';

import React from 'react';
import { Space } from '@/types/rea';
import { Sparkles, Mic, Camera, Plus, Users, Wallet } from 'lucide-react';

interface NavbarProps {
  spaces: Space[];
  currentSpaceId: string;
  onSelectSpace: (id: string) => void;
  onOpenVoice: () => void;
  onOpenReceipt: () => void;
  onOpenAdd: () => void;
}

export function Navbar({
  spaces,
  currentSpaceId,
  onSelectSpace,
  onOpenVoice,
  onOpenReceipt,
  onOpenAdd
}: NavbarProps) {
  const currentSpace = spaces.find((s) => s.id === currentSpaceId) || spaces[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800/80">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo & Space Switcher */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-emerald-500/20">
            <Wallet className="w-5 h-5 text-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-100 tracking-tight text-base">Track Do It</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                REA Model
              </span>
            </div>
            
            {/* Space Dropdown */}
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <Users className="w-3 h-3 text-zinc-500" />
              <select
                value={currentSpaceId}
                onChange={(e) => onSelectSpace(e.target.value)}
                className="bg-transparent text-zinc-400 hover:text-zinc-200 focus:outline-none cursor-pointer py-0.5"
              >
                {spaces.map((s) => (
                  <option key={s.id} value={s.id} className="bg-zinc-900 text-zinc-200">
                    {s.name} ({s.type === 'personal' ? 'Personal' : 'Shared'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quick Ingestion Buttons (Monveo-style Fast Actions) */}
        <div className="flex items-center gap-2">
          {/* Voice Input Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-xs font-medium transition active:scale-95 group shadow-sm"
            title="Catat via Suara (AI Voice)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Mic className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>

          {/* Receipt Scanner Button */}
          <button
            onClick={onOpenReceipt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-200 text-xs font-medium transition active:scale-95 group shadow-sm"
            title="Scan Struk Belanja (OCR)"
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition" />
            <span className="hidden sm:inline">Scan Struk</span>
          </button>

          {/* Manual Add Button */}
          <button
            onClick={onOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold shadow-md shadow-emerald-500/20 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>
    </header>
  );
}
