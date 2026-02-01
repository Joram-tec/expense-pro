"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function AddWalletPage() {
  const router = useRouter();
  const { addWallet, user } = useAppContext();
  
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('Bank');
  const [color, setColor] = useState('bg-indigo-600');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return alert("Session expired. Please log in again.");
    if (!name || !balance) return alert("Please fill all fields");

    setLoading(true);

    const newWallet = {
      // ID is handled by Supabase (gen_random_uuid)
      name,
      balance: parseFloat(balance),
      type,
      color,
      user_id: user.id // Essential for Row Level Security
    };

    try {
      await addWallet(newWallet);
      router.push('/dashboard');
    } catch (error) {
      alert("Failed to create wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    { name: 'Indigo', class: 'bg-indigo-600' },
    { name: 'Rose', class: 'bg-rose-500' },
    { name: 'Emerald', class: 'bg-emerald-500' },
    { name: 'Amber', class: 'bg-amber-500' },
    { name: 'Slate', class: 'bg-slate-800' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="p-6 bg-white border-b flex items-center gap-4">
        <Link href="/dashboard" className="text-2xl text-slate-900 font-black">←</Link>
        <h1 className="text-xl font-black text-slate-900">Add New Wallet</h1>
      </header>

      <main className="p-6 max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* WALLET NAME */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Wallet Name</label>
            <input 
              type="text" 
              placeholder="e.g., Cash, Savings, PayPal"
              className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 placeholder:text-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* INITIAL BALANCE */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Initial Balance</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-900">$</span>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                className="w-full p-5 pl-10 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 placeholder:text-slate-300"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                required
              />
            </div>
          </div>

          {/* WALLET TYPE */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Type</label>
            <select 
              className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 appearance-none"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Bank</option>
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Mobile Money</option>
            </select>
          </div>

          {/* COLOR SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Theme Color</label>
            <div className="flex gap-3 p-2">
              {colors.map((c) => (
                <button
                  key={c.class}
                  type="button"
                  onClick={() => setColor(c.class)}
                  className={`w-12 h-12 rounded-2xl ${c.class} transition-all transform ${
                    color === c.class ? 'scale-110 ring-4 ring-white shadow-lg' : 'opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white font-black rounded-2xl text-lg shadow-xl shadow-indigo-100 mt-6 active:scale-95 transition-transform ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? "Creating..." : "Create Wallet"}
          </button>
        </form>
      </main>
    </div>
  );
}