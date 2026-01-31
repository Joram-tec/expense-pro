"use client";
import Link from 'next/link';

export default function StartPage() {
  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover" 
          alt="background"
        />
        <div className="absolute inset-0 bg-slate-900/70"></div>
      </div>

      {/* Nav */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-white font-bold text-2xl tracking-tighter">Expense<span className="text-indigo-400">Pro</span></div>
        <Link href="/auth/login" className="text-white font-semibold hover:text-indigo-300 transition">Sign In</Link>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 pt-32">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Take control of every <span className="text-indigo-400">dollar.</span>
        </h1>
        <p className="text-xl text-slate-200 mb-10 max-w-2xl">
          The most intuitive way to track spending and grow wealth. Professional insights for your personal finances.
        </p>
        <Link href="/auth/register" className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-2xl text-xl font-bold transition transform hover:scale-105 shadow-2xl">
          Let's Start
        </Link>
      </div>
    </div>
  );
}