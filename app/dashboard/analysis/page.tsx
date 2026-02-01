"use client";
import { useState } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine 
} from 'recharts';

export default function AnalysisPage() {
  const { transactions } = useAppContext();
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  // --- 1. FILTERING LOGIC ---
  const filteredByTime = transactions.filter((t: any) => {
    const txDate = new Date(t.date);
    const now = new Date();
    if (timeFilter === 'all') return true;
    if (timeFilter === 'month') return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    if (timeFilter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return txDate >= weekAgo;
    }
    return true;
  });

  const expenses = filteredByTime.filter((t: any) => t.amount < 0);
  const totalExpense = Math.abs(expenses.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0));

  // --- 2. DYNAMIC AXIS LOGIC (Amount against Day/Month/Year) ---
  const getTrendData = () => {
    const trendMap: any = {};
    
    expenses.forEach((t: any) => {
      const date = new Date(t.date);
      let label = "";

      // Change grouping based on filter
      if (timeFilter === 'week') {
        label = date.toLocaleDateString(undefined, { weekday: 'short' }); // e.g., Mon, Tue
      } else if (timeFilter === 'month') {
        label = date.getDate().toString(); // e.g., 1, 2, 3 (Day of month)
      } else {
        label = date.toLocaleDateString(undefined, { month: 'short' }); // e.g., Jan, Feb
      }

      trendMap[label] = (trendMap[label] || 0) + Math.abs(t.amount);
    });

    // Ensure data is sorted correctly for the chart
    return Object.entries(trendMap).map(([name, amount]) => ({ 
      name, 
      amount: Number(amount) 
    }));
  };

  const chartDataPoints = getTrendData();
  const dailyAverage = chartDataPoints.length > 0 ? totalExpense / chartDataPoints.length : 0;

  // --- 3. PIE CHART DATA ---
  const categoryData = expenses.reduce((acc: any, t: any) => {
    const cat = t.category || "Other";
    acc[cat] = (acc[cat] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

  // --- 4. EXPORT LOGIC ---
  const downloadTransactions = () => {
    if (filteredByTime.length === 0) return alert("No transactions found");
    const headers = ["Date", "Category", "Amount"];
    const rows = filteredByTime.map((t: any) => [new Date(t.date).toLocaleDateString(), t.category, t.amount]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analysis_${timeFilter}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-8 bg-white rounded-b-[3rem] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard" className="text-slate-900 font-black text-sm">← Back</Link>
          <button onClick={downloadTransactions} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black uppercase border border-indigo-100">
            📥 Export CSV
          </button>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Financial Analysis</h1>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-4">
          {(['all', 'month', 'week'] as const).map((f) => (
            <button key={f} onClick={() => setTimeFilter(f)} className={`flex-1 py-2 rounded-xl text-xs font-black uppercase transition-all ${timeFilter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
              {f === 'all' ? 'Year' : f}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* CATEGORY PIE */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-slate-100">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4">Expense by Category</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '15px', border:'none', fontWeight:'bold'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AMOUNT VS TIME CHART */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border-2 border-slate-100">
          <div className="mb-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Spending Intensity</h3>
            <p className="text-[10px] font-bold text-slate-400">Tracking amount against {timeFilter === 'week' ? 'days' : timeFilter === 'month' ? 'dates' : 'months'}</p>
          </div>
          
          <div className="h-64">
            {chartDataPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartDataPoints}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={timeFilter === 'month' ? 10 : 25} />
                  <ReferenceLine 
                    y={dailyAverage} 
                    stroke="#f43f5e" 
                    strokeDasharray="5 5" 
                    label={{ value: 'AVG', fill: '#f43f5e', fontSize: 10, fontWeight: 'bold', position: 'right' }} 
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold italic">No data to display</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl">
          <div>
            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Total Outflow</p>
            <p className="text-3xl font-black">${totalExpense.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-900/20">📈</div>
        </div>
      </main>

      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border-2 border-slate-100 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-slate-400">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform active:scale-95 transition">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400">👤</Link>
      </nav>
    </div>
  );
}