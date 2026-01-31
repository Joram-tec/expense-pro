"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, setUser, logout, loading } = useAppContext();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  // Synchronize local state with user object once loaded
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user]);

  // 1. Build Guard: Prevent "Cannot read properties of null" error
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSave = () => {
    setUser({ ...user, name: newName });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 2. Backup Feature: Download all data as JSON
  const handleExportData = () => {
    const backup = {
      transactions: localStorage.getItem("ep_transactions"),
      wallets: localStorage.getItem("ep_wallets"),
      user: localStorage.getItem("ep_current_user"),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // 3. Reset Feature: Clear everything
  const handleResetApp = () => {
    if (confirm("Are you sure? This will delete ALL transactions and wallets forever.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-6 bg-white border-b text-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-slate-900">Profile Settings</h1>
      </header>

      <main className="p-6 max-w-md mx-auto flex flex-col items-center">
        {/* Profile Image Section */}
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-4xl">
            {user.name?.charAt(0) || "U"}
          </div>
          <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-xl shadow-lg border-2 border-white">
            📷
          </div>
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
                  Edit Name
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 px-1">Email Address</label>
            <p className="text-slate-600 font-medium mt-1">{user.email}</p>
          </div>

          {/* Data Management Section */}
          <div className="pt-4 space-y-3 border-t">
            <p className="text-[10px] uppercase font-bold text-slate-400 px-1 mb-2">Data Management</p>
            
            <button 
              onClick={handleExportData}
              className="w-full py-4 text-left px-4 rounded-2xl hover:bg-indigo-50 transition flex items-center justify-between group border border-dashed border-slate-200"
            >
              <div className="flex items-center gap-3">
                <span>📥</span>
                <span className="text-slate-700 font-semibold">Backup My Data</span>
              </div>
              <span className="text-slate-300 group-hover:text-indigo-600">→</span>
            </button>

            <button 
              onClick={handleResetApp}
              className="w-full py-4 text-left px-4 rounded-2xl hover:bg-rose-50 transition flex items-center justify-between group border border-dashed border-rose-100"
            >
              <div className="flex items-center gap-3">
                <span>⚠️</span>
                <span className="text-rose-600 font-semibold">Reset All Data</span>
              </div>
              <span className="text-rose-300 group-hover:text-rose-600">→</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="mt-8 w-full py-5 bg-rose-50 text-rose-600 font-bold rounded-[2rem] hover:bg-rose-100 transition shadow-sm border border-rose-100"
        >
          Sign Out
        </button>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-slate-400">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-slate-400">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform hover:scale-105 transition">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">👤</Link>
      </nav>
    </div>
  );
}