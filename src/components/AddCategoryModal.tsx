'use client';

import React, { useState } from 'react';
import { X, Check, Tag } from 'lucide-react';
import { FlowType } from '@/types/rea';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: { name: string; flowType: FlowType; color: string }) => void;
}

export function AddCategoryModal({ isOpen, onClose, onAddCategory }: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [flowType, setFlowType] = useState<FlowType>('expense');
  const [color, setColor] = useState('#10b981');

  if (!isOpen) return null;

  const colors = [
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f43f5e', // rose
    '#f97316', // orange
    '#eab308'  // yellow
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddCategory({
      name: name.trim(),
      flowType,
      color
    });

    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-[#1c1c1e] border border-zinc-800 p-6 shadow-2xl relative space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Tambah Kategori Baru</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Kopi & Nongkrong..."
              required
              className="w-full bg-[#242426] border border-zinc-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
              Pilih Warna Aksen
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition active:scale-90 ${
                    color === c ? 'ring-2 ring-white scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 pt-3"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Kategori</span>
          </button>
        </form>
      </div>
    </div>
  );
}
