"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, setUser } = useAppContext();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);

  const handleSave = () => {
    setUser({ ...user, name: newName });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // In a real app, clear cookies/tokens here
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-6 bg-white border-b text-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Profile Settings</h1>
      </header>

      <main className="p-6 max-w-md mx-auto flex flex-col items-center">
        {/* Profile Image Section */}
        <div className="relative group mb-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-100 border-4 border-white shadow-xl overflow-hidden">
            <img 
              src={`https://i.pravatar.cc/150?u=${user.email}`} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white hover:bg-indigo-700 transition">
            📷
          </button>
        </div>

        {/* User Info Card */}
        <div className="w-full bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 px-1">Full Name</label>
            {isEditing ? (
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                />
                <button 
                  onClick={handleSave}
                  className="bg-emerald-500 text-white px-4 rounded-xl font-bold text-sm"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center mt-1">
                <p className="text-lg font-bold text-slate-900">{user.name}</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 text-xs font-bold hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 px-1">Email Address</label>
            <p className="text-slate-600 font-medium mt-1">{user.email}</p>
          </div>

          <div className="pt-4 space-y-3">
            <button className="w-full py-4 text-left px-4 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between group">
              <span className="text-slate-700 font-semibold">Security & Privacy</span>
              <span className="text-slate-300 group-hover:text-indigo-600">→</span>
            </button>
            <button className="w-full py-4 text-left px-4 rounded-2xl hover:bg-slate-50 transition flex items-center justify-between group">
              <span className="text-slate-700 font-semibold">Notification Settings</span>
              <span className="text-slate-300 group-hover:text-indigo-600">→</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mt-8 w-full py-5 bg-rose-50 text-rose-600 font-bold rounded-[2rem] hover:bg-rose-100 transition shadow-sm border border-rose-100"
        >
          Sign Out of ExpensePro
        </button>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl">
        <Link href="/dashboard" className="p-3 text-slate-400">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">👤</Link>
      </nav>
    </div>
  );
}