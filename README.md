# 💊 MediCare PH — Online Pharmacy

A full-featured Philippine online pharmacy website with AI chatbot assistant, built with Next.js and powered by OpenRouter.

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/medicare-ph.git
cd medicare-ph
npm install
```

### 2. Set up environment variables
Create a `.env.local` file in the root directory:
```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Get your free API key at: https://openrouter.ai/keys

### 3. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## ☁️ Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your GitHub repo
3. Add environment variable:
   - `OPENROUTER_API_KEY` = your key from openrouter.ai
4. Click **Deploy** ✅

## 🤖 Chatbot

The chatbot uses OpenRouter's free models (DeepSeek, Qwen, etc.) and is aware of the pharmacy's product catalog. It can:
- Answer questions about medicines and products
- Help find products by category
- Provide drug information and dosage guidance
- Assist with order questions

## 🏗️ Tech Stack
- **Framework**: Next.js 14
- **AI**: OpenRouter API (free models)
- **Styling**: CSS Modules + CSS Variables
- **Deployment**: Vercel + GitHub

## 📁 Project Structure
```
medicare-ph/
├── pages/
│   ├── index.js          # Main pharmacy page
│   └── api/
│       └── chat.js       # Chatbot API route
├── data/
│   └── products.js       # Product database
├── styles/
│   └── globals.css       # Global styles
└── public/               # Static assets
```
