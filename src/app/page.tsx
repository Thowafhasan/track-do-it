'use client';

import React, { useState, useEffect } from 'react';
import { MonveoHeader } from '@/components/MonveoHeader';
import { MonveoSummarySection } from '@/components/MonveoSummarySection';
import { FloatingBottomDock, MonveoTab } from '@/components/FloatingBottomDock';
import { DraftTransactionsModal, DraftTransaction } from '@/components/DraftTransactionsModal';
import { AddCategoryModal } from '@/components/AddCategoryModal';
import { AccountsList } from '@/components/AccountsList';
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
import { INITIAL_DRAFTS } from '@/lib/mockDrafts';
import { Account, Budget, Category, FlowType, Space, Transaction } from '@/types/rea';
import { ParsedTransaction } from '@/lib/nlpParser';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MonveoTab>('home');
  const [spaces, setSpaces] = useState<Space[]>(INITIAL_SPACES);
  const [currentSpaceId, setCurrentSpaceId] = useState<string>('space_personal');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [drafts, setDrafts] = useState<DraftTransaction[]>(INITIAL_DRAFTS);

  // Modals
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Total expense calculation
  const totalExpense = transactions
    .filter((t) => t.eventType === 'expense' && t.spaceId === currentSpaceId)
    .reduce((sum, t) => sum + t.amount, 0);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedTxs = localStorage.getItem('trackdoit_transactions_v2');
      if (savedTxs) setTransactions(JSON.parse(savedTxs));

      const savedAccounts = localStorage.getItem('trackdoit_accounts_v2');
      if (savedAccounts) setAccounts(JSON.parse(savedAccounts));

      const savedDrafts = localStorage.getItem('trackdoit_drafts_v2');
      if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }, []);

  const saveState = (
    newTxs: Transaction[],
    newAccs: Account[],
    newDrafts: DraftTransaction[] = drafts
  ) => {
    setTransactions(newTxs);
    setAccounts(newAccs);
    setDrafts(newDrafts);
    try {
      localStorage.setItem('trackdoit_transactions_v2', JSON.stringify(newTxs));
      localStorage.setItem('trackdoit_accounts_v2', JSON.stringify(newAccs));
      localStorage.setItem('trackdoit_drafts_v2', JSON.stringify(newDrafts));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  };

  // REA Balance Update Helper
  const applyTransactionBalances = (
    tx: Omit<Transaction, 'id' | 'timestamp'>,
    prevAccounts: Account[]
  ): Account[] => {
    return prevAccounts.map((acc) => {
      if (tx.sourceAccountId && acc.id === tx.sourceAccountId) {
        if (acc.isLiability) {
          return { ...acc, balance: acc.balance + tx.amount };
        } else {
          return { ...acc, balance: Math.max(0, acc.balance - tx.amount) };
        }
      }

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

  // Add Transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    const updatedAccounts = applyTransactionBalances(newTxData, accounts);
    saveState([newTx, ...transactions], updatedAccounts);
  };

  // Handle Approve One Draft
  const handleApproveDraft = (draft: DraftTransaction) => {
    const matchedAccount =
      accounts.find((a) => a.name.toLowerCase().includes(draft.sourceAccount.toLowerCase())) ||
      accounts[0];

    const matchedCategory =
      categories.find((c) => c.name.toLowerCase().includes(draft.category.toLowerCase())) ||
      categories[0];

    const newTxData: Omit<Transaction, 'id' | 'timestamp'> = {
      spaceId: currentSpaceId,
      actorUserId: 'usr_thowaf_01',
      merchantName: draft.merchant,
      sourceAccountId: matchedAccount.id,
      categoryId: matchedCategory.id,
      eventType: 'expense',
      amount: draft.amount,
      currency: 'IDR',
      entryChannel: draft.channel,
      note: `Disetujui dari draft: ${draft.merchant}`
    };

    const remainingDrafts = drafts.filter((d) => d.id !== draft.id);
    const updatedAccounts = applyTransactionBalances(newTxData, accounts);
    const newTx: Transaction = {
      ...newTxData,
      id: `tx_${Date.now()}`,
      timestamp: new Date().toISOString()
    };

    saveState([newTx, ...transactions], updatedAccounts, remainingDrafts);
  };

  // Handle Approve All Drafts
  const handleApproveAllDrafts = () => {
    let currentAccs = [...accounts];
    const newTxs: Transaction[] = [];

    drafts.forEach((d, idx) => {
      const matchedAccount =
        currentAccs.find((a) => a.name.toLowerCase().includes(d.sourceAccount.toLowerCase())) ||
        currentAccs[0];

      const matchedCategory =
        categories.find((c) => c.name.toLowerCase().includes(d.category.toLowerCase())) ||
        categories[0];

      const txData: Omit<Transaction, 'id' | 'timestamp'> = {
        spaceId: currentSpaceId,
        actorUserId: 'usr_thowaf_01',
        merchantName: d.merchant,
        sourceAccountId: matchedAccount.id,
        categoryId: matchedCategory.id,
        eventType: 'expense',
        amount: d.amount,
        currency: 'IDR',
        entryChannel: d.channel,
        note: `Disetujui massal dari draft`
      };

      currentAccs = applyTransactionBalances(txData, currentAccs);
      newTxs.push({
        ...txData,
        id: `tx_mass_${Date.now()}_${idx}`,
        timestamp: new Date().toISOString()
      });
    });

    saveState([...newTxs, ...transactions], currentAccs, []);
    setIsDraftsOpen(false);
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter((d) => d.id !== id);
    setDrafts(updated);
    try {
      localStorage.setItem('trackdoit_drafts_v2', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  };

  // Add Category
  const handleAddCategory = (newCat: { name: string; flowType: FlowType; color: string }) => {
    const cat: Category = {
      id: `cat_${Date.now()}`,
      name: newCat.name,
      flowType: newCat.flowType,
      color: newCat.color,
      icon: 'Tag'
    };
    setCategories([...categories, cat]);
  };

  // Confirm Voice
  const handleConfirmVoice = (parsed: ParsedTransaction) => {
    const matchedAccount =
      accounts.find((a) =>
        a.name.toLowerCase().includes(parsed.accountName?.toLowerCase() || '')
      ) || accounts[0];

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
      note: `Voice AI: "${parsed.rawText}"`
    };

    handleAddTransaction(newTxData);
  };

  // Confirm Receipt OCR
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

  const currentTransactions = transactions.filter((t) => t.spaceId === currentSpaceId);
  const currentAccounts = accounts.filter((a) => a.spaceId === currentSpaceId);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Mobile-Frame Layout matching iPhone proportions */}
      <div className="max-w-md mx-auto min-h-screen px-4 pt-3 pb-32 flex flex-col space-y-4 relative">
        {/* Top Header: TW F Avatar + Home + Bell */}
        <MonveoHeader
          initials="TW\nF"
          title={activeTab === 'home' ? 'Home' : activeTab === 'history' ? 'Riwayat' : 'Akun & Kartu'}
          onNotificationClick={() => alert('Tidak ada notifikasi baru.')}
          onProfileClick={() => alert('Profil: Thowaf Hasan (thowafhasan@gmail.com)')}
        />

        {/* Tab 1: Home Screen (100% Identik Screenshot iPhone Monveo) */}
        {activeTab === 'home' && (
          <div className="animate-fade-in space-y-5">
            <MonveoSummarySection
              totalExpense={totalExpense}
              draftCount={drafts.length}
              onOpenDrafts={() => setIsDraftsOpen(true)}
              onOpenImport={() => setIsReceiptOpen(true)}
              onOpenInsight={() => alert('Fitur Insight: Pengeluaran Anda minggu ini terkendali dengan baik.')}
              onOpenConsultation={() => alert('Konsultasi Keuangan 1-on-1 dengan Certified Financial Planner (Segera Hadir).')}
              onOpenSubscription={() => alert('Subscription: Kelola langganan berulang bulanan Anda.')}
              onAddCategory={() => setIsAddCategoryOpen(true)}
            />
          </div>
        )}

        {/* Tab 2: History (Riwayat Transaksi) */}
        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-4">
            <TransactionList
              transactions={currentTransactions}
              categories={categories}
              accounts={currentAccounts}
              onDeleteTransaction={(id) => {
                const updated = transactions.filter((t) => t.id !== id);
                saveState(updated, accounts);
              }}
            />
          </div>
        )}

        {/* Tab 4: Cards / Accounts */}
        {activeTab === 'cards' && (
          <div className="animate-fade-in space-y-4">
            <AccountsList accounts={currentAccounts} />
          </div>
        )}
      </div>

      {/* Floating Bottom Dock (Glass Capsule Navbar) */}
      <FloatingBottomDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickAdd={() => setIsAddOpen(true)}
      />

      {/* Modals & Triggers */}
      <DraftTransactionsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        drafts={drafts}
        onApprove={handleApproveDraft}
        onApproveAll={handleApproveAllDrafts}
        onDeleteDraft={handleDeleteDraft}
      />

      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={handleAddCategory}
      />

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
