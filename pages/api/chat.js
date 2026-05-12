import { createClient } from "@supabase/supabase-js";

const FREE_MODELS = [
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "qwen/qwen-2-7b-instruct:free",
  "google/gemma-2-9b-it:free",
  "deepseek/deepseek-r1:free",
];

async function getProductsContext() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return "No database connected.";
    const sb = createClient(url, key);
    const { data } = await sb.from("products").select("name,brand,category,price,unit,rx,desc,tags,stock").order("category");
    if (!data || !data.length) return "Product database is currently empty.";
    return data.map(p =>
      `- ${p.name} (${p.brand}) | ₱${p.price}/${p.unit} | ${p.category} | ${p.rx ? "RX REQUIRED" : "OTC"} | Stock: ${p.stock} | ${p.desc}`
    ).join("\n");
  } catch { return "Could not load product database."; }
}

async function tryModel(model, messages, apiKey, referer) {
  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json", "HTTP-Referer": referer, "X-Title": "MediCare PH" },
      body: JSON.stringify({ model, messages, max_tokens: 500, temperature: 0.7 }),
    });
    const d = await r.json();
    if (d.error) return null;
    const content = d.choices?.[0]?.message?.content;
    return content ? { reply: content, model } : null;
  } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENROUTER_API_KEY not configured. Add it to your Vercel environment variables." });

  const { messages } = req.body;
  if (!messages?.length) return res.status(400).json({ error: "messages required" });

  const catalog = await getProductsContext();
  const referer = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  const systemContent = `You are MediBot, the friendly AI pharmacy assistant for MediCare PH — a trusted FDA-registered online pharmacy in the Philippines.

RULES:
- Help customers find medicines, vitamins, and health products from the catalog
- Always state that RX items require a valid doctor's prescription
- Never diagnose medical conditions — always advise consulting a doctor
- Be warm, helpful, use occasional Filipino expressions (po, salamat, Ingat!)
- Keep responses concise unless detail is needed
- For serious symptoms: "Please consult your doctor or go to the nearest hospital po"
- Reference actual products from the catalog when relevant

DELIVERY: Same-day Metro Manila (orders before 2PM) · Next-day provincial · FREE above ₱999

CURRENT PRODUCT DATABASE (live from Supabase):
${catalog}`;

  const fullMessages = [
    { role: "user", content: systemContent },
    { role: "assistant", content: "Naiintindihan ko po! I am MediBot, ready to assist MediCare PH customers with medicine questions and product recommendations." },
    ...messages,
  ];

  for (const model of FREE_MODELS) {
    const result = await tryModel(model, fullMessages, apiKey, referer);
    if (result) return res.status(200).json(result);
  }

  return res.status(502).json({ error: "All AI models are currently busy. Please try again in a moment." });
}
