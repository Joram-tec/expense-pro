"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext<any>(null);

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem("ep_users");
    const savedCurrentUser = localStorage.getItem("ep_current_user");
    const savedWallets = localStorage.getItem("ep_wallets");
    const savedTransactions = localStorage.getItem("ep_transactions");

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedCurrentUser) setUser(JSON.parse(savedCurrentUser));
    
    if (savedWallets) {
      setWallets(JSON.parse(savedWallets));
    } else {
      setWallets([{ id: 1, name: "Main Bank", balance: 0, type: "Bank", color: "bg-indigo-600" }]);
    }

    if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
    setLoading(false);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("ep_users", JSON.stringify(users));
      localStorage.setItem("ep_current_user", JSON.stringify(user));
      localStorage.setItem("ep_wallets", JSON.stringify(wallets));
      localStorage.setItem("ep_transactions", JSON.stringify(transactions));
    }
  }, [users, user, wallets, transactions, loading]);

  const addTransaction = (newTx: any) => {
  // Add to transactions first
  setTransactions((prev: any[]) => {
    if (prev.find(t => t.id === newTx.id)) return prev;
    return [newTx, ...prev];
  });
  
  setWallets((prevWallets: any[]) => prevWallets.map((w: any) => {
    if (w.name === newTx.wallet) {
      // Use Number() to ensure we are adding numbers, not strings
      // and avoid any floor/ceil functions.
      const currentBalance = Number(w.balance);
      const transactionAmount = Number(newTx.amount);
      const newBalance = currentBalance + transactionAmount;
      
      return { 
        ...w, 
        balance: parseFloat(newBalance.toFixed(2)) 
      };
    }
    return w;
  }));
};
  const deleteTransaction = (id: number) => {
    const txToDelete = transactions.find((t) => t.id === id);
    if (!txToDelete) return;

    setWallets((prevWallets) => prevWallets.map((w) => {
      if (w.name === txToDelete.wallet) {
        // To undo a transaction, we SUBTRACT the amount exactly as it was added
        const revertedBalance = Number(w.balance) - Number(txToDelete.amount);
        return { ...w, balance: Number(revertedBalance.toFixed(2)) };
      }
      return w;
    }));
    setTransactions(prev => prev.filter((t) => t.id !== id));
  };

  const registerUser = (newUser: any) => setUsers((prev) => [...prev, newUser]);
  const addWallet = (newWallet: any) => setWallets((prev) => [...prev, newWallet]);
  const logout = () => { setUser(null); localStorage.removeItem("ep_current_user"); };

  return (
    <AppContext.Provider value={{ 
      user, setUser, users, registerUser, wallets, addWallet, 
      transactions, addTransaction, deleteTransaction, loading, logout 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppWrapper");
  return context;
}