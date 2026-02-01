Markdown
# 💰 ExpensePro - Smart Wealth Tracker

ExpensePro is a modern, mobile-first Progressive Web App (PWA) designed to help users track expenses, manage multiple wallets, and visualize spending habits through real-time cloud sync.



## 🚀 Features

- **Cloud Sync:** Powered by Supabase for real-time data persistence.
- **Secure Auth:** Email/Password authentication handled via Supabase Auth.
- **Multi-Wallet Support:** Track cash, bank accounts, and credit cards separately.
- **Dynamic Analysis:** Interactive charts using Recharts for spending intensity and category breakdowns.
- **Budgeting:** Set monthly limits and get visual warnings when approaching "Danger Zones."
- **Exportable Data:** One-click CSV export for all your financial records.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase
- **Charts:** Recharts
- **Icons:** Lucide React / Emojis

## 🏁 Getting Started

### 1. Clone the repository
```bash
git clone [https://github.com/your-username/expense-pro.git](https://github.com/your-username/expense-pro.git)
cd expense-pro
2. Install Dependencies
Bash
npm install
3. Environment Setup
Create a .env.local file in the root directory and add your Supabase credentials:

Plaintext
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Database Setup
Run the following SQL commands in your Supabase SQL Editor to initialize the tables:

SQL
-- Transactions Table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL NOT NULL,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('income', 'expense')),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  user_id UUID DEFAULT auth.uid(),
  wallet_id UUID
);

-- Wallets Table
CREATE TABLE wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  balance DECIMAL DEFAULT 0,
  color TEXT,
  type TEXT,
  user_id UUID DEFAULT auth.uid()
);

-- Budgets Table
CREATE TABLE budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  limit_amount DECIMAL NOT NULL,
  user_id UUID DEFAULT auth.uid(),
  UNIQUE(user_id, category)
);
5. Run the App
Bash
npm run dev
Open http://localhost:3000 to see your app!

📱 PWA Support
This app is optimized for mobile. You can "Add to Home Screen" on iOS or Android to use it as a standalone application.

📄 License
MIT License - feel free to use this project for your own learning!


---

### 💡 Why this README is effective:
1.  **Visuals:** It uses placeholders for images to make the documentation less "dry."
2.  **SQL Block:** By including the SQL code, you make it 10x easier for a collaborator (or your future self) to set up the database again.
3.  **Env Example:** Showing exactly what needs to go in `.env.local` prevents "missing variable" errors.