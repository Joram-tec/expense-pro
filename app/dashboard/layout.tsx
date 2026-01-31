import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { AppWrapper } from '@/app/context/AppContext';

const inter = Inter({ subsets: ['latin'] });

// This is the Metadata object that changes the browser tab name
export const metadata = {
  title: 'Expense Pro',
  description: 'Professional personal finance tracking and analysis',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico', // Make sure you have a favicon.ico in your public folder
  },
};

// This handles how the app looks on mobile devices
export const viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}