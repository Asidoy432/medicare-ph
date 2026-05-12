# 💊 MediCare PH v2.0 — Online Pharmacy with Live Database

Full-stack Philippine online pharmacy with Supabase database, OpenRouter AI chatbot, draggable UI, and Vercel deployment.

---

## 🚀 Quick Deploy (5 minutes)

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/medicare-ph.git
cd medicare-ph
npm install
```

### 2. Set up Supabase (free database)
1. Go to [supabase.com](https://supabase.com) → New Project
2. Go to **SQL Editor** → paste and run the contents of `supabase_setup.sql`
3. Copy your **Project URL** and **anon key** from Settings → API

### 3. Set up OpenRouter (free AI)
1. Go to [openrouter.ai/keys](https://openrouter.ai/keys)
2. Create a free API key

### 4. Create `.env.local`
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

### 5. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 6. Seed sample data
Click **"🗄️ Admin DB"** in the navbar → **"🌱 Seed 40 Sample Products"**

---

## ☁️ Deploy to Vercel

1. Push to GitHub
2. [vercel.com](https://vercel.com) → New Project → Import repo
3. Add 3 environment variables (same as `.env.local`)
4. Click **Deploy** ✅

---

## 🎓 Project Requirements Compliance

| Requirement | Implementation |
|---|---|
| **Database with UI** | Supabase PostgreSQL + Admin DB modal (enter products via form) |
| **Data searchable by chatbot** | MediBot queries Supabase live on every chat request |
| **No chatbot errors** | 5-model fallback chain (Llama → Mistral → Qwen → Gemma → DeepSeek) |
| **Working buttons** | All 40+ buttons tested and functional |
| **Draggable chatbot** | Both chat window AND toggle button are draggable |
| **Responsive UI** | Mobile-first, works on any screen size |

---

## 🗄️ Database (Supabase)

The **Admin DB** panel (navbar → "🗄️ Admin DB") lets you:
- **Seed** 40 sample products with one click
- **Add** custom products via form
- Products immediately appear in the shop AND become searchable by MediBot

### Database Schema (products table)
| Column | Type | Description |
|---|---|---|
| id | bigint | Auto-generated primary key |
| name | text | Product name |
| brand | text | Brand name |
| category | text | Category ID (pain, vitamins, etc.) |
| price | numeric | Price in PHP |
| old_price | numeric | Original price (for sale badge) |
| unit | text | e.g. "per tablet", "per bottle" |
| stock | integer | Quantity in stock |
| rx | boolean | Requires prescription |
| emoji | text | Display emoji |
| desc | text | Product description |
| rating | numeric | Star rating (1-5) |
| reviews | integer | Review count |
| badge | text | bestseller/sale/new/rx |
| tags | text | Comma-separated search tags |

---

## 🤖 Chatbot (MediBot)

- Powered by OpenRouter free models
- **5-model fallback**: Llama 3.1 → Mistral → Qwen → Gemma → DeepSeek
- Reads **live Supabase data** on every query
- Draggable window + draggable toggle button
- Quick reply buttons

---

## 📁 File Structure
```
medicare-ph/
├── pages/
│   ├── index.js          # Main page (all UI)
│   ├── _app.js
│   └── api/
│       ├── chat.js       # MediBot AI endpoint
│       ├── products.js   # CRUD for Supabase products
│       └── seed.js       # Seed 40 sample products
├── data/
│   ├── products.js       # Seed data + categories
│   └── supabase.js       # Supabase client
├── styles/
│   └── globals.css
├── supabase_setup.sql    # Run in Supabase SQL Editor
└── .env.local.example
```
