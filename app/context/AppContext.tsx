"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AppContext = createContext<any>(null);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        fetchAppData(session.user.id);
      }
      setLoading(false);
    };
    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
        fetchAppData(session.user.id);
      } else {
        setUser(null);
        setTransactions([]);
        setWallets([]);
        setBudgets([]);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const fetchAppData = async (userId: string) => {
    const [txResponse, walletResponse, budgetResponse] = await Promise.all([
      supabase.from('transactions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('wallets').select('*').eq('user_id', userId),
      supabase.from('budgets').select('*').eq('user_id', userId)
    ]);

    if (txResponse.data) setTransactions(txResponse.data);
    if (walletResponse.data) setWallets(walletResponse.data);
    if (budgetResponse.data) setBudgets(budgetResponse.data);
  };

  const addTransaction = async (newTx: any) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...newTx, user_id: user.id }])
      .select();

    if (!error && data) {
      setTransactions((prev) => [data[0], ...prev]);
    }
  };

  // --- DELETE TRANSACTION ---
  const deleteTransaction = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } else {
      console.error("Error deleting transaction:", error.message);
      alert("Could not delete transaction.");
    }
  };

  const addWallet = async (newWallet: any) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('wallets')
      .insert([{ ...newWallet, user_id: user.id }])
      .select();

    if (!error && data) {
      setWallets((prev) => [...prev, data[0]]);
    }
  };

  const updateBudget = async (category: string, limit: number) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('budgets')
      .upsert(
        { category, limit_amount: limit, user_id: user.id }, 
        { onConflict: 'user_id,category' }
      )
      .select();

    if (!error && data) {
      setBudgets(prev => {
        const filtered = prev.filter(b => b.category !== category);
        return [...filtered, data[0]];
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTransactions([]);
    setWallets([]);
    setBudgets([]);
  };

  return (
    <AppContext.Provider value={{ 
      user, 
      setUser, 
      transactions, 
      wallets, 
      budgets,
      addTransaction, 
      deleteTransaction, // Successfully added to the export
      addWallet, 
      updateBudget, 
      logout, 
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);