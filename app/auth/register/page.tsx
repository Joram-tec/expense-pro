"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function Register() {
  const router = useRouter();
  const { registerUser, users } = useAppContext();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return alert("Please fill all fields");

    // Check if user already exists
    const exists = users.find((u: any) => u.email === form.email);
    if (exists) return alert("Email already registered!");

    registerUser(form);
    alert("Account created successfully!");
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <Link href="/" className="text-indigo-600 text-sm font-bold mb-6 inline-block">← Back</Link>
        <h2 className="text-3xl font-bold mb-2 text-slate-900">Create Account</h2>
        <p className="text-slate-500 mb-8 text-sm">Join ExpensePro to master your finances.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e)=>setForm({...form, name: e.target.value})} 
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e)=>setForm({...form, email: e.target.value})} 
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e)=>setForm({...form, password: e.target.value})} 
          />
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Complete
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <Link href="/auth/login" className="text-indigo-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}