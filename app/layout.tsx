import '@/app/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google'; // Changed from Inter
import { AppWrapper } from '@/app/context/AppContext';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Expense Pro',
  description: 'Professional personal finance tracking and analysis',
  // Removed manifest: '/manifest.json' to stop the 404 error
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