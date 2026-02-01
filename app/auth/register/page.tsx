"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create the user and store the name in user_metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name // This is where the name is stored in Supabase
        } 
      }
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful!");
      // If auto-confirm is on, we can go to dashboard. If not, go to login.
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto bg-white p-10 rounded-[3rem] shadow-xl border-2 border-slate-100">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900">Create Account</h1>
          <p className="text-slate-500 font-bold mt-2">Start managing your wealth</p>
        </header>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Full Name</label>
            <input 
              type="text" 
              className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-900 uppercase ml-2 tracking-widest">Email Address</label>
            <input 
              type="email" 
              className="w-full p-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 font-bold outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
              placeholder="john@example.com"
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
                placeholder="Min. 8 characters"
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
            className={`w-full py-5 bg-indigo-600 text-white font-black rounded-2xl text-lg shadow-xl shadow-indigo-100 transform active:scale-95 transition-all mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-bold">
          Already a member? <Link href="/auth/login" className="text-indigo-600 font-black underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}