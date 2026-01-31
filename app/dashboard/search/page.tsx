"use client";
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function SearchPage() {
  const { transactions, deleteTransaction } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter Logic: Search by category or wallet name
  const filteredTransactions = transactions.filter((tx: any) => {
    const query = searchQuery.toLowerCase();
    return (
      tx.category.toLowerCase().includes(query) ||
      tx.wallet.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-6 bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link href="/dashboard" className="text-2xl text-slate-400">←</Link>
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Search category or wallet..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="space-y-4">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx: any) => (
              <div key={tx.id} className="bg-white p-4 rounded-[1.5rem] flex justify-between items-center shadow-sm border border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                    tx.amount < 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    {tx.amount < 0 ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{tx.category}</p>
                    <p className="text-xs text-slate-400">
                      {tx.wallet} • {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <p className={`font-bold ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <button 
                    onClick={() => deleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400">No transactions found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-slate-400 hover:text-indigo-600 transition">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400 hover:text-indigo-600 transition">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400 hover:text-indigo-600 transition">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400 hover:text-indigo-600 transition">👤</Link>
      </nav>
    </div>
  );
}