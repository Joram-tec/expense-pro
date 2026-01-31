"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/app/context/AppContext';

export default function WalletPage() {
  const { wallets, addWallet } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State for new wallet
  const [form, setForm] = useState({
    name: '',
    type: 'Bank',
    balance: ''
  });

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.balance) return alert("Please fill in all fields");

    const newWallet = {
      id: Date.now(),
      name: form.name,
      balance: Number(form.balance),
      type: form.type,
      color: form.type === 'Bank' ? 'bg-indigo-600' : form.type === 'Savings' ? 'bg-emerald-500' : 'bg-amber-500'
    };

    addWallet(newWallet);
    setShowAddModal(false);
    setForm({ name: '', type: 'Bank', balance: '' }); // Reset form
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="p-6 bg-white border-b flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-slate-900">My Wallets</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition"
        >
          + Add Wallet
        </button>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 text-center">
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Combined Balance</p>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2">
            ${wallets.reduce((acc: number, w: any) => acc + w.balance, 0).toLocaleString()}
          </h2>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-slate-700">Registered Accounts</h3>
          {wallets.map((wallet: any) => (
            <div key={wallet.id} className="bg-white p-5 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100 transition hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${wallet.color} rounded-xl flex items-center justify-center text-white text-xl shadow-inner`}>
                  {wallet.type === "Bank" ? "🏦" : wallet.type === "Cash" ? "💵" : "🐷"}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{wallet.name}</p>
                  <p className="text-xs text-slate-400">{wallet.type}</p>
                </div>
              </div>
              <p className="font-bold text-slate-900">${wallet.balance.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Modal for adding a wallet */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <form onSubmit={handleAddWallet} className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Register Wallet</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Account Name (e.g. Chase Bank)" 
                className="w-full p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
              />
              <select 
                className="w-full p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.type}
                onChange={(e) => setForm({...form, type: e.target.value})}
              >
                <option value="Bank">Bank</option>
                <option value="Savings">Savings</option>
                <option value="Cash">Cash</option>
              </select>
              <input 
                type="number" 
                placeholder="Starting Balance" 
                className="w-full p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.balance}
                onChange={(e) => setForm({...form, balance: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition"
                >
                  Add Wallet
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl">
        <Link href="/dashboard" className="p-3 text-slate-400">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-200">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400">👤</Link>
      </nav>
    </div>
  );
}