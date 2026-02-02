import '@/app/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'; 
import { AppWrapper } from '@/app/context/AppContext';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Expense Pro',
  description: 'Professional personal finance tracking and analysis',
  manifest: '/manifest.json', // Re-enabled for PWA installation
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png', // Important for iOS installation
  },
};

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
    <html lang="en" suppressHydrationWarning>
      <body className={jakarta.className}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}