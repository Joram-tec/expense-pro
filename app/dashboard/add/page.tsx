"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction, wallets, user } = useAppContext();

  // Form States
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(''); 
  const [walletId, setWalletId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);
  
  // NEW: Validation Error State
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Health", "Utilities", "Gift"];
  const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Sale", "Refund"];

  // Clear category when switching type
  useEffect(() => {
    setCategory(''); 
    setError(null);
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- VALIDATION START ---
    if (!walletId) {
      setError("Please choose a wallet to credit/debit this transaction.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!user) {
      setError("User session not found. Please log in again.");
      return;
    }
    // --- VALIDATION END ---

    setIsSaving(true);
    const finalAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

    const newTransaction = {
      amount: finalAmount,
      category: category.trim() || "Other",
      wallet_id: walletId,
      date: new Date(date).toISOString(),
      type,
      user_id: user.id 
    };

    try {
      await addTransaction(newTransaction);
      router.push('/dashboard');
    } catch (err) {
      setError("Failed to save transaction. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-6 bg-white border-b border-slate-200 flex items-center gap-4 sticky top-0 z-30 shadow-sm">
        <Link 
          href="/dashboard" 
          className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl shadow-lg active:scale-95 transition-all"
        >
          <span className="text-xl font-bold">←</span>
        </Link>
        <h1 className="text-xl font-black text-slate-900">
          Add {type === 'expense' ? 'Expense' : 'Income'}
        </h1>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full pb-44"> 
        
        {/* Error Message Display */}
        {error && (
          <div className="mb-6 bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="text-xl">⚠️</span>
            <p className="text-rose-600 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Toggle Switch */}
        <div className="flex bg-slate-200 p-1.5 rounded-2xl mb-8 shadow-inner">
          <button 
            type="button" 
            onClick={() => setType('expense')} 
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase transition-all ${
              type === 'expense' ? 'bg-white text-rose-500 shadow-md' : 'text-slate-500'
            }`}
          >
            Expense
          </button>
          <button 
            type="button" 
            onClick={() => setType('income')} 
            className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase transition-all ${
              type === 'income' ? 'bg-white text-emerald-500 shadow-md' : 'text-slate-500'
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* AMOUNT FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount</label>
            <div className="bg-white rounded-[2rem] border-2 border-slate-100 p-2 flex items-center px-6 shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
              <span className="text-slate-400 font-black text-2xl">$</span>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full p-4 bg-transparent text-3xl text-slate-900 font-black outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          {/* WALLET SELECTION GRID */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Select Wallet</label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {wallets.map((w: any) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => { setWalletId(w.id); setError(null); }}
                  className={`p-4 rounded-2xl border-2 transition-all font-bold text-sm text-left flex flex-col gap-1 ${
                    walletId === w.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-md' 
                    : 'border-white bg-white text-slate-400 shadow-sm hover:border-slate-200'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-60 font-black tracking-tighter">{w.name}</span>
                  <span className="text-sm font-black">${Number(w.balance).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC CATEGORY FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              {type === 'expense' ? 'Expense Category' : 'Income Category'}
            </label>
            <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-1 shadow-sm">
              <input 
                list="dynamic-categories"
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none"
                value={category}
                placeholder="Pick or type custom..."
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="dynamic-categories">
                {(type === 'expense' ? expenseCategories : incomeCategories).map((opt) => (
                  <option key={opt} value={opt} />
                ))}
              </datalist>
            </div>
          </div>

          {/* DATE FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-1 shadow-sm">
              <input 
                type="date" 
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isSaving}
              className={`w-full py-6 text-white font-black rounded-[2rem] text-xl shadow-2xl active:scale-95 transition-all ${
                isSaving ? 'bg-slate-300' : (type === 'expense' ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200')
              }`}
            >
              {isSaving ? "Saving..." : `Confirm ${type}`}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}