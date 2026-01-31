"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Pass
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSendCode = () => {
    alert(`A reset code (1234) has been sent to ${email}`);
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-lg">
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
            <p className="text-slate-500 text-sm mb-6">Enter your email to receive a reset code.</p>
            <input type="email" placeholder="Email" className="w-full p-4 rounded-xl border border-slate-200 mb-4 outline-none" onChange={(e)=>setEmail(e.target.value)} />
            <button onClick={handleSendCode} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">Send Code</button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Enter Code</h2>
            <p className="text-slate-500 text-sm mb-6">Check your email for the 4-digit code.</p>
            <input type="text" placeholder="0000" className="w-full p-4 rounded-xl border border-slate-200 mb-4 text-center text-2xl tracking-widest outline-none" />
            <button onClick={() => setStep(3)} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">Verify</button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">New Password</h2>
            <input type="password" placeholder="New Password" className="w-full p-4 rounded-xl border border-slate-200 mb-4 outline-none" />
            <button onClick={() => router.push('/auth/login')} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">Reset and Login</button>
          </div>
        )}
      </div>
    </div>
  );
}