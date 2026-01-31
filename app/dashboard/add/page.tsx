"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function AddTransactionPage() {
  const router = useRouter();
  const { wallets, addTransaction } = useAppContext();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('Expense');
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Convert exactly what is in the input box to a float
  // This ensures 40000.00 stays 40000.00
  const rawValue = parseFloat(amount); 
  
  if (isNaN(rawValue) || rawValue <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  // 2. Assign sign WITHOUT any subtractions or rounding
  const finalAmount = type === 'Expense' ? -rawValue : rawValue;

  const newTx = {
    id: Date.now(),
    amount: finalAmount, 
    category,
    wallet: selectedWallet,
    date: new Date().toISOString(),
    type
  };

  addTransaction(newTx);
  router.push('/dashboard');
};
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="p-6 bg-white border-b flex items-center gap-4">
        <Link href="/dashboard" className="text-2xl text-slate-400">←</Link>
        <h1 className="text-xl font-bold text-slate-900">Add Transaction</h1>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 text-center">
            <p className="text-sm font-medium text-slate-400 uppercase mb-2">Amount</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-slate-900">$</span>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="text-5xl font-black text-slate-900 w-full outline-none text-center"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <div className="flex bg-slate-200 p-1 rounded-2xl">
            {['Expense', 'Income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  type === t ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Category</label>
            <select 
              className="w-full p-4 rounded-2xl bg-white border border-slate-100 outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option><option>Transport</option><option>Shopping</option>
              <option>Entertainment</option><option>Housing</option><option>Salary</option><option>Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-2">Wallet</label>
            <select 
              className="w-full p-4 rounded-2xl bg-white border border-slate-100 outline-none"
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
            >
              {wallets.map((w: any) => (
                <option key={w.id} value={w.name}>{w.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-bold rounded-[2rem] text-lg shadow-xl shadow-indigo-100">
            Save Transaction
          </button>
        </form>
      </main>
    </div>
  );
}