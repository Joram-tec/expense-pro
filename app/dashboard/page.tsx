"use client";
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function Dashboard() {
  const { user, wallets, transactions, deleteTransaction, loading } = useAppContext();

  // 1. Calculate total balance safely
  const totalBalance = wallets?.reduce((acc: number, w: any) => acc + (Number(w.balance) || 0), 0) || 0;

  // 2. Extract name from Supabase metadata
  const displayName = user?.user_metadata?.full_name || "User";

  // 3. Helper to find wallet name (Matching your SQL column 'wallet_id')
  const getWalletName = (walletId: string) => {
    const wallet = wallets.find((w: any) => w.id === walletId);
    return wallet ? wallet.name : "Wallet";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="font-bold text-slate-400 animate-pulse">Loading your wealth...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* HEADER SECTION */}
      <header className="p-8 bg-white rounded-b-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Welcome back,</p>
            <h1 className="text-2xl font-black text-slate-900">{displayName} 👋</h1>
          </div>
          <Link href="/dashboard/profile" className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl border border-indigo-100">
            👤
          </Link>
        </div>

        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Total Balance</p>
            <h2 className="text-4xl font-black">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* WALLETS SECTION */}
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">My Wallets</h3>
            <Link href="/dashboard/wallet" className="text-indigo-600 text-xs font-black uppercase">See All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {wallets.length > 0 ? wallets.map((wallet: any) => (
              <div key={wallet.id} className="min-w-[160px] bg-white p-5 rounded-3xl shadow-sm border-2 border-slate-50">
                <div className={`w-8 h-8 rounded-lg mb-3 ${wallet.color || 'bg-slate-200'}`} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{wallet.name}</p>
                <p className="font-black text-slate-900">${Number(wallet.balance).toLocaleString()}</p>
              </div>
            )) : (
              <Link href="/dashboard/wallet/add" className="w-full py-6 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 font-bold">
                + Add your first wallet
              </Link>
            )}
          </div>
        </section>

        {/* TRANSACTIONS SECTION */}
        <section>
          <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-4 px-2">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.slice(0, 8).map((tx: any) => (
                <div key={tx.id} className="bg-white p-4 rounded-[1.8rem] flex justify-between items-center border-2 border-slate-50 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                      tx.amount < 0 ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                    }`}>
                      {tx.amount < 0 ? '↓' : '↑'}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{tx.category}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {getWalletName(tx.wallet_id)} • {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className={`font-black ${tx.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                    </p>
                    <button 
                      onClick={() => deleteTransaction(tx.id)} 
                      className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold italic text-sm">No transactions yet!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* NAVIGATION BAR */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform active:scale-95 transition">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400">👤</Link>
      </nav>
    </div>
  );
}