'use client';

import React from 'react';
import { Account, Goal, Space, Transaction } from '@/types/rea';
import { formatIDR } from '@/lib/mockData';
import {
  Mic,
  Camera,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  Compass,
  Briefcase,
  User,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface MonveoBentoGridProps {
  accounts: Account[];
  transactions: Transaction[];
  spaces: Space[];
  currentSpaceId: string;
  onSelectSpace: (id: string) => void;
  goals: Goal[];
  onOpenVoice: () => void;
  onOpenReceipt: () => void;
}

export function MonveoBentoGrid({
  accounts,
  transactions,
  spaces,
  currentSpaceId,
  onSelectSpace,
  goals,
  onOpenVoice,
  onOpenReceipt
}: MonveoBentoGridProps) {
  // REA Calculations
  const totalAssets = accounts
    .filter((a) => !a.isLiability)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.isLiability)
    .reduce((sum, a) => sum + a.balance, 0);

  const netWorth = totalAssets - totalLiabilities;

  // Filter Today's Transactions safely for SSR / Client Hydration
  const [todayString, setTodayString] = React.useState('');

  React.useEffect(() => {
    setTodayString(new Date().toDateString());
  }, []);

  const todayTransactions = React.useMemo(() => {
    if (!todayString) {
      return transactions.filter((t) => t.eventType === 'expense').slice(0, 1);
    }
    return transactions.filter(
      (t) => new Date(t.timestamp).toDateString() === todayString && t.eventType === 'expense'
    );
  }, [transactions, todayString]);

  const todaySpent = todayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const latestTodayTx = todayTransactions[0];

  // Primary Goal (Emergency Fund)
  const primaryGoal = goals[0] || {
    title: 'Emergency Fund',
    currentAmount: 36000000,
    targetAmount: 50000000,
    targetDate: 'Dec 2026'
  };
  const goalPercent = Math.min(
    Math.round((primaryGoal.currentAmount / primaryGoal.targetAmount) * 100),
    100
  );

  const getSpaceIcon = (spaceId: string) => {
    switch (spaceId) {
      case 'space_shared':
        return <Users className="w-3.5 h-3.5" />;
      case 'space_business':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'space_travel':
        return <Compass className="w-3.5 h-3.5" />;
      case 'space_personal':
      default:
        return <User className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* 1. Bento Box: Money Command Center (Hero Net Worth & Today's Spending) */}
      <div className="md:col-span-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between shadow-xl">
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Money Command Center
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Monveo Flow
              </span>
            </div>

            {/* Micro signal */}
            <span className="text-[11px] text-zinc-400 hidden sm:inline-block">
              BCA Main • {formatIDR(accounts[0]?.balance || 0)}
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight font-mono">
              {formatIDR(netWorth)}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Total Realtime Net Worth &bull; Aset Bersih Tanpa Koneksi Perbankan Langsung
            </p>
          </div>
        </div>

        {/* Monveo Iconic Today's Spending Widget */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40 -mx-6 -mb-6 p-4 sm:px-6 rounded-b-3xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-200">Today&apos;s spending</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300">
                  {todayTransactions.length} new
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {latestTodayTx
                  ? `${latestTodayTx.merchantName || 'Transaksi'} • -${formatIDR(latestTodayTx.amount)}`
                  : 'Belum ada pengeluaran hari ini'}
              </p>
            </div>
          </div>

          <div className="text-right self-end sm:self-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Total Hari Ini</span>
            <span className="text-sm font-bold text-rose-400 font-mono">
              -{formatIDR(todaySpent)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Bento Box: Intelligence Container (< 5 sec Voice & Receipt capture) */}
      <div className="md:col-span-4 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden group">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Intelligence
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              &lt; 5 sec
            </span>
          </div>

          <div>
            <h3 className="text-base font-bold text-zinc-100">Capture Without Typing</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Ucapkan apa adanya atau unggah setruk. AI menstrukturkannya seketika.
            </p>
          </div>
        </div>

        {/* 1-Tap Trigger Buttons */}
        <div className="space-y-2.5 mt-5">
          <button
            onClick={onOpenVoice}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <span>Voice Capture</span>
            </span>
            <span className="text-[10px] font-semibold bg-zinc-950/20 px-2 py-0.5 rounded-full">
              Mulai Suara
            </span>
          </button>

          <button
            onClick={onOpenReceipt}
            className="w-full py-2.5 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 font-medium text-xs flex items-center justify-between border border-zinc-700/60 transition active:scale-95"
          >
            <span className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Scan / Share Struk</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>
      </div>

      {/* 3. Bento Box: Goal Progression (Emergency Fund & Wealth Building) */}
      <div className="md:col-span-5 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Goal Progression
              </span>
            </div>
            <span className="text-[10px] font-bold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
              1 / {goals.length || 1}
            </span>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1">
              <h4 className="text-base font-bold text-zinc-100">{primaryGoal.title}</h4>
              <span className="text-xs text-zinc-400">Target {primaryGoal.targetDate}</span>
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {goalPercent}%
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
              style={{ width: `${goalPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span>Terkumpul: {formatIDR(primaryGoal.currentAmount)}</span>
            <span className="text-zinc-500">Target: {formatIDR(primaryGoal.targetAmount)}</span>
          </div>
        </div>
      </div>

      {/* 4. Bento Box: Spaces Matrix (Personal, Shared, Business, Travel) */}
      <div className="md:col-span-7 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 flex flex-col justify-between shadow-xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Money Spaces Matrix
            </span>
            <span className="text-[10px] text-zinc-500">Pemisahan Aliran Dana Bersih</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {spaces.map((sp) => {
              const isActive = sp.id === currentSpaceId;
              return (
                <button
                  key={sp.id}
                  onClick={() => onSelectSpace(sp.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between h-24 ${
                    isActive
                      ? 'bg-zinc-800/90 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {getSpaceIcon(sp.id)}
                    </div>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-zinc-200 block truncate">{sp.name}</span>
                    <span className="text-[10px] text-zinc-400 capitalize">{sp.type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-zinc-400 mt-4 pt-3 border-t border-zinc-800/60">
          Uang pribadi, rumah tangga bersama, dan perjalanan tetap terorganisir tanpa tercampur.
        </p>
      </div>
    </div>
  );
}
