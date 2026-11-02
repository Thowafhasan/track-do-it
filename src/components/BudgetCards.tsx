'use client';

import React from 'react';
import { Budget, Category } from '@/types/rea';
import { formatIDR } from '@/lib/mockData';
import { PieChart, AlertCircle } from 'lucide-react';

interface BudgetCardsProps {
  budgets: Budget[];
  categories: Category[];
}

export function BudgetCards({ budgets, categories }: BudgetCardsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold tracking-tight text-zinc-100 uppercase">
            Anggaran Cerdas (Budgets)
          </h2>
        </div>
        <span className="text-xs text-zinc-500">Bulan Ini</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {budgets.map((b) => {
          const cat = categories.find((c) => c.id === b.categoryId);
          const percent = Math.min(Math.round((b.spentAmount / b.limitAmount) * 100), 100);
          const isOver = b.spentAmount > b.limitAmount;

          return (
            <div
              key={b.id}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-200">{cat?.name || 'Kategori'}</span>
                <span
                  className={`text-xs font-bold ${
                    isOver ? 'text-rose-400' : percent > 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {percent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOver
                      ? 'bg-rose-500'
                      : percent > 80
                      ? 'bg-amber-400'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>{formatIDR(b.spentAmount)} terpakai</span>
                <span className="text-zinc-500">Batas: {formatIDR(b.limitAmount)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
