"use client";
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user, wallets, transactions, deleteTransaction } = useAppContext();

  const totalBalance = wallets.reduce((acc: number, w: any) => acc + Number(w.balance), 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-8 bg-white rounded-b-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-slate-400 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name || 'User'}</h1>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-xl">👤</div>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm opacity-80 uppercase mb-1">Total Balance</p>
            <h2 className="text-4xl font-black">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-slate-800">My Wallets</h3>
            <Link href="/dashboard/wallet" className="text-indigo-600 text-sm font-bold">See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {wallets.map((wallet: any) => (
              <div key={wallet.id} className="min-w-[160px] bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-xs text-slate-400 mb-1">{wallet.name}</p>
                <p className="font-bold text-slate-900">${Number(wallet.balance).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-bold text-slate-800 mb-4 px-2">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx: any) => (
                <div key={tx.id} className="bg-white p-4 rounded-[1.5rem] flex justify-between items-center shadow-sm border border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                      tx.amount < 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {tx.amount < 0 ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.category}</p>
                      <p className="text-xs text-slate-400">{tx.wallet} • {new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className={`font-bold ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                    <button onClick={() => deleteTransaction(tx.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition">✕</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 text-sm">No transactions yet!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-105 transition">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400">👤</Link>
      </nav>
    </div>
  );
}