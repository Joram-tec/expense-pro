"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function AddTransactionPage() {
  const router = useRouter();
  const { addTransaction, wallets, user } = useAppContext();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(''); 
  const [walletId, setWalletId] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Separate category lists for each type
  const expenseCategories = ["Food", "Transport", "Rent", "Shopping", "Entertainment", "Health", "Utilities", "Gift"];
  const incomeCategories = ["Salary", "Freelance", "Investment", "Gift", "Bonus", "Sale", "Refund"];

  // 2. Clear category when switching type so user doesn't have an "Income" category on an "Expense"
  useEffect(() => {
    setCategory(''); 
  }, [type]);

  useEffect(() => {
    if (wallets.length > 0 && !walletId) setWalletId(wallets[0].id);
  }, [wallets, walletId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !walletId) return;

    setIsSaving(true);
    const newTransaction = {
      amount: type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
      category: category.trim() || "Other",
      wallet_id: walletId,
      date: new Date(date).toISOString(),
      type,
      user_id: user.id 
    };

    await addTransaction(newTransaction);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* VISIBLE HEADER */}
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
          
          {/* DATE FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-1">
              <input 
                type="date" 
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* AMOUNT FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount</label>
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-1 flex items-center px-4">
              <span className="text-slate-400 font-bold">$</span>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DYNAMIC CATEGORY FIELD */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              {type === 'expense' ? 'Expense Category' : 'Income Category'}
            </label>
            <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-1">
              <input 
                list="dynamic-categories"
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none"
                value={category}
                placeholder="Pick or type custom..."
                onChange={(e) => setCategory(e.target.value)}
                required
              />
              <datalist id="dynamic-categories">
                {/* 3. Logic to switch categories based on type */}
                {type === 'expense' 
                  ? expenseCategories.map((opt) => <option key={opt} value={opt} />)
                  : incomeCategories.map((opt) => <option key={opt} value={opt} />)
                }
              </datalist>
            </div>
          </div>

          {/* WALLET SELECT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Wallet</label>
            <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-1">
              <select 
                className="w-full p-4 bg-transparent text-slate-900 font-bold outline-none appearance-none"
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                required
              >
                {wallets.map((w: any) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
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