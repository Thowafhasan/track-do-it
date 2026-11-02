'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { NetWorthCard } from '@/components/NetWorthCard';
import { AccountsList } from '@/components/AccountsList';
import { BudgetCards } from '@/components/BudgetCards';
import { TransactionList } from '@/components/TransactionList';
import { VoiceInputModal } from '@/components/VoiceInputModal';
import { ReceiptScanModal } from '@/components/ReceiptScanModal';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BUDGETS,
  INITIAL_CATEGORIES,
  INITIAL_SPACES,
  INITIAL_TRANSACTIONS
} from '@/lib/mockData';
import { Account, Budget, Category, Space, Transaction } from '@/types/rea';
import { ParsedTransaction } from '@/lib/nlpParser';
import { Sparkles, Layers, History, Shield, Smartphone, ArrowRight } from 'lucide-react';

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [currentSpaceId, setCurrentSpaceId] = useState<string>('space_personal');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions' | 'budgets'>('overview');

  // Load from LocalStorage if available
  useEffect(() => {
    try {
      const savedTxs = localStorage.getItem('trackdoit_transactions');
      if (savedTxs) setTransactions(JSON.parse(savedTxs));

      const savedAccounts = localStorage.getItem('trackdoit_accounts');
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }
  }, []);

  // Save to LocalStorage
  const saveState = (newTxs: Transaction[], newAccs: Account[]) => {
    setTransactions(newTxs);
    setAccounts(newAccs);
    try {
      localStorage.setItem('trackdoit_transactions', JSON.stringify(newTxs));
      localStorage.setItem('trackdoit_accounts', JSON.stringify(newAccs));
    } catch (e) {
      console.warn('Error saving to LocalStorage', e);
    }
  };

  // Helper to apply balance delta based on REA Duality
  const applyTransactionBalances = (
    tx: Omit<Transaction, 'id' | 'timestamp'>,
    prevAccounts: Account[]
  ): Account[] => {
    return prevAccounts.map((acc) => {
      // Source Account (Resource Decrement / Liability Increment)
      if (tx.sourceAccountId && acc.id === tx.sourceAccountId) {
        if (acc.isLiability) {
          return { ...acc, balance: acc.balance + tx.amount };
        } else {
          return { ...acc, balance: Math.max(0, acc.balance - tx.amount) };
        }
      }

      // Destination Account (Resource Increment)
      if (tx.destinationAccountId && acc.id === tx.destinationAccountId) {
        if (acc.isLiability) {
          return { ...acc, balance: Math.max(0, acc.balance - tx.amount) };
        } else {
          return { ...acc, balance: acc.balance + tx.amount };
        }
      }

      return acc;
    });
  };

  // Handle Manual Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const updatedAccounts = applyTransactionBalances(newTxData, accounts);
    saveState([newTx, ...transactions], updatedAccounts);
  };

  // Handle Voice AI Input
  const handleConfirmVoice = (parsed: ParsedTransaction) => {
    // Map account name to existing account
    const matchedAccount =
      accounts.find((a) =>
        a.name.toLowerCase().includes(parsed.accountName?.toLowerCase() || '')
      ) || accounts[0];

    // Map category
    const matchedCategory =
      categories.find((c) =>
        c.name.toLowerCase().includes(parsed.categoryName?.toLowerCase() || '')
      ) || categories[0];

    const newTxData: Omit<Transaction, 'id' | 'timestamp'> = {
      spaceId: currentSpaceId,
      actorUserId: 'usr_thowaf_01',
      merchantName: parsed.merchant || 'Umum',
      sourceAccountId: parsed.eventType === 'income' ? undefined : matchedAccount.id,
      destinationAccountId: parsed.eventType === 'expense' ? undefined : matchedAccount.id,
      categoryId: matchedCategory.id,
      eventType: parsed.eventType,
      amount: parsed.amount,
      currency: 'IDR',
      entryChannel: 'voice_ai',
      note: `Input suara: "${parsed.rawText}"`
    };

    handleAddTransaction(newTxData);
  };

  // Handle OCR Receipt Confirmation
  const handleConfirmReceipt = (data: {
    amount: number;
    merchantName: string;
    note: string;
    categoryName: string;
    rawText: string;
  }) => {
    const matchedAccount = accounts.find((a) => a.name.includes('BCA')) || accounts[0];
    const matchedCategory =
      categories.find((c) => c.name.toLowerCase().includes(data.categoryName.toLowerCase())) ||
      categories[0];

    const newTxData: Omit<Transaction, 'id' | 'timestamp'> = {
      spaceId: currentSpaceId,
      actorUserId: 'usr_thowaf_01',
      merchantName: data.merchantName,
      sourceAccountId: matchedAccount.id,
      categoryId: matchedCategory.id,
      eventType: 'expense',
      amount: data.amount,
      currency: 'IDR',
      entryChannel: 'ocr',
      note: data.note
    };

    handleAddTransaction(newTxData);
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    const filtered = transactions.filter((t) => t.id !== id);
    saveState(filtered, accounts);
  };

  // Filter items by active space
  const currentTransactions = transactions.filter((t) => t.spaceId === currentSpaceId);
  const currentAccounts = accounts.filter((a) => a.spaceId === currentSpaceId);
  const currentBudgets = budgets.filter((b) => b.spaceId === currentSpaceId);

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        spaces={spaces}
        currentSpaceId={currentSpaceId}
        onSelectSpace={setCurrentSpaceId}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenReceipt={() => setIsReceiptOpen(true)}
        onOpenAdd={() => setIsAddOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 space-y-8">
        {/* Hero Section: Net Worth Card */}
        <NetWorthCard accounts={currentAccounts} transactions={currentTransactions} />

        {/* Segmented Tab Navigation (iOS Monveo Style) */}
        <div className="flex items-center justify-center">
          <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Ringkasan' },
              { id: 'accounts', label: 'Akun (Resources)' },
              { id: 'transactions', label: 'Transaksi (Events)' },
              { id: 'budgets', label: 'Anggaran' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl transition ${
                  activeTab === tab.id
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Ingestion Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">Frictionless Voice & Receipt Tracking</h4>
                  <p className="text-xs text-zinc-400">
                    Coba ucapkan: &ldquo;Beli kopi starbucks 65rb pakai gopay&rdquo; atau unggah setruk belanja!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition shadow-sm"
                >
                  Coba Suara
                </button>
                <button
                  onClick={() => setIsReceiptOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition"
                >
                  Scan Struk
                </button>
              </div>
            </div>

            {/* Resources (Accounts) */}
            <AccountsList accounts={currentAccounts} />

            {/* Budgets */}
            <BudgetCards budgets={currentBudgets} categories={categories} />

            {/* Events (Transactions) */}
            <TransactionList
              transactions={currentTransactions}
              categories={categories}
              accounts={currentAccounts}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {activeTab === 'accounts' && (
          <div className="animate-fade-in">
            <AccountsList accounts={currentAccounts} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="animate-fade-in">
            <TransactionList
              transactions={currentTransactions}
              categories={categories}
              accounts={currentAccounts}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="animate-fade-in">
            <BudgetCards budgets={currentBudgets} categories={categories} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/60 py-6 text-center text-xs text-zinc-500">
        <p>
          <strong className="text-zinc-400">Track Do It</strong> &bull; Expense Tracker berbasis arsitektur REA
          (Resource-Event-Agent) &bull; Dibuat untuk Thowaf Hasan
        </p>
      </footer>

      {/* Interactive Modals */}
      <VoiceInputModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onConfirm={handleConfirmVoice}
      />

      <ReceiptScanModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        onConfirmReceipt={handleConfirmReceipt}
      />

      <AddTransactionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        accounts={currentAccounts}
        categories={categories}
        currentSpaceId={currentSpaceId}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}
