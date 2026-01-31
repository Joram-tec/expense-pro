"use client";
import { useState, useEffect } from 'react';
import { useAppContext } from '@/app/context/AppContext';
import Link from 'next/link';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export default function AnalysisPage() {
  const { transactions } = useAppContext();
  const [timeFrame, setTimeFrame] = useState('Monthly');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- 1. Category Data (Doughnut) ---
  const expenses = transactions.filter((t: any) => Number(t.amount) < 0);
  const categories: any[] = [...new Set(expenses.map((t: any) => t.category))];
  
  const categoryTotals = categories.map((cat: any) => {
    return expenses
      .filter((t: any) => t.category === cat)
      .reduce((acc: number, t: any) => acc + Math.abs(Number(t.amount)), 0);
  });

  // --- 2. Weekly Trend Logic (Bar Chart) ---
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];
    const spendingPerDay = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayLabel = days[d.getDay()];
      last7Days.push(dayLabel);

      // Filter transactions for this specific day
      const dailyTotal = expenses
        .filter((t: any) => {
          const txDate = new Date(t.date || Date.now());
          return txDate.toDateString() === d.toDateString();
        })
        .reduce((acc: number, t: any) => acc + Math.abs(Number(t.amount)), 0);
      
      spendingPerDay.push(dailyTotal);
    }
    return { labels: last7Days, data: spendingPerDay };
  };

  const weeklyTrend = getWeeklyData();

  // --- 3. Chart Configuration ---
  const colorPalette = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

  const doughnutData = {
    labels: categories,
    datasets: [{
      data: categoryTotals,
      backgroundColor: colorPalette,
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  const barData = {
    labels: weeklyTrend.labels,
    datasets: [{
      label: 'Spending',
      data: weeklyTrend.data,
      backgroundColor: '#6366f1',
      borderRadius: 12,
    }]
  };

  if (!isMounted) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="font-bold text-slate-400 italic">Syncing financial data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="p-6 bg-white border-b text-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Financial Analysis</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Timeframe Switcher */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-200 p-1 rounded-2xl shadow-inner">
            {['Daily', 'Monthly', 'Yearly'].map((f) => (
              <button 
                key={f}
                onClick={() => setTimeFrame(f)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  timeFrame === f ? 'bg-white shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Doughnut Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 text-center">Spending by Category</h3>
          <div className="h-64 flex justify-center relative">
            {expenses.length > 0 ? (
              <Doughnut data={doughnutData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
            ) : (
              <div className="flex items-center text-slate-400 italic">No expense data found</div>
            )}
          </div>
        </div>

        {/* Top Categories List */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 px-2">Top Categories</h3>
          {categories.length > 0 ? categories.map((cat: any, i: number) => {
            const colors = (doughnutData.datasets[0].backgroundColor as string[]) || [];
            const indicatorColor = colors[i % colors.length] || '#4f46e5';
            return (
              <div key={String(cat) + i} className="bg-white p-4 rounded-2xl flex justify-between items-center border border-slate-100 shadow-sm transition hover:border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: indicatorColor }}></div>
                  <span className="font-semibold text-slate-700">{String(cat)}</span>
                </div>
                <span className="font-bold text-slate-900">
                  ${(categoryTotals[i] || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          }) : (
            <div className="bg-white p-6 rounded-2xl text-center border-2 border-dashed border-slate-100">
               <p className="text-slate-400 text-sm">Add transactions to see breakdown</p>
            </div>
          )}
        </div>

        {/* Real Weekly Trend Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-2">Weekly Trend</h3>
          <p className="text-xs text-slate-400 mb-6">Last 7 days of spending</p>
          <div className="h-64">
             <Bar 
              data={barData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, grid: { display: false } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-slate-200 flex justify-around items-center p-3 rounded-[2rem] shadow-2xl z-50">
        <Link href="/dashboard" className="p-3 text-slate-400">🏠</Link>
        <Link href="/dashboard/analysis" className="p-3 text-indigo-600 bg-indigo-50 rounded-2xl">📊</Link>
        <Link href="/dashboard/add" className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">+</Link>
        <Link href="/dashboard/wallet" className="p-3 text-slate-400">👛</Link>
        <Link href="/dashboard/profile" className="p-3 text-slate-400">👤</Link>
      </nav>
    </div>
  );
}