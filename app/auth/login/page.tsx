"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      // Supabase manages the session cookie automatically.
      // Your AppContext will pick up the new session and provide user data.
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-[3rem] shadow-xl border-2 border-slate-100">
        <header className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg shadow-indigo-100">
            💰
          </div>
          <h1 className="text-3xl font-black text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 font-bold mt-2">Log in to your account</p>
        </header>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Email Address</label>
            <input 
              type="email" 
              className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 pr-14"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xl p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-5 bg-indigo-600 text-white font-black rounded-2xl text-lg shadow-xl shadow-indigo-100 transform active:scale-95 transition-all mt-4 ${loading ? 'opacity-50' : ''}`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-bold">
          Don't have an account? <Link href="/auth/register" className="text-indigo-600 font-black underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}