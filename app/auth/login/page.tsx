"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const { users, setUser } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      router.push('/dashboard');
    } else {
      setError("Incorrect email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p className="text-slate-500 mb-8 text-sm">Please enter your details to sign in.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-medium rounded-2xl border border-rose-100 animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email" required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e)=>setEmail(e.target.value)} 
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full p-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-indigo-500" 
            onChange={(e)=>setPassword(e.target.value)} 
          />
          
          <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
            Login
          </button>
          
          <div className="flex justify-between items-center text-xs font-bold mt-6 px-1">
            <Link href="/auth/forgot" className="text-indigo-600 hover:text-indigo-800 transition">Forgot Password?</Link>
            <Link href="/auth/register" className="text-slate-400 hover:text-slate-600 transition underline">Create Account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}