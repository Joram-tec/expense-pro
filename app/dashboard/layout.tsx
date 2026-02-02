import '@/app/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'; // Changed to match your app's expectation
import { AppWrapper } from '@/app/context/AppContext';

// Using Plus Jakarta Sans to match the rest of your dashboard UI
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap', 
});

export const metadata = {
  title: 'Expense Pro',
  description: 'Professional personal finance tracking and analysis',
  // REMOVED: manifest: '/manifest.json' 
  // (This stops the 404 error until you actually create the file and icons)
  icons: {
    icon: '/favicon.ico',
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