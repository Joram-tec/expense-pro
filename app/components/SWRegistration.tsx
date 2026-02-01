"use client";
import { useEffect } from 'react';

export default function SWRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('Service Worker registered!', reg))
        .catch((err) => console.log('Service Worker registration failed:', err));
    }
  }, []);

  return null; // This component doesn't render anything UI-wise
}