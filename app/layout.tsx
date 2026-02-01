import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "./context/AppContext";
import SWRegistration from "./components/SWRegistration"; // Import the registration logic

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpensePro | Master Your Money",
  description: "Intuitive expense tracking for professionals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={jakarta.className}>
        <AppWrapper>
          <SWRegistration /> {/* Injects the Service Worker script */}
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}