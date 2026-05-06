import { getCatalogSummary } from "../../data/products";

const SYSTEM_PROMPT = `You are MediBot, the friendly and knowledgeable AI pharmacy assistant for MediCare PH — a trusted FDA-registered online pharmacy in the Philippines.

Your role:
- Help customers find the right medicines and health products
- Provide clear, accurate drug information (generic names, uses, dosage guidelines)
- Explain differences between branded and generic medicines
- Advise on OTC vs prescription (RX) requirements
- Give general health tips relevant to Filipino customers
- Help with order and delivery questions
- Flag when professional medical consultation is needed

Rules:
- Always remind customers that RX (prescription) medicines require a valid prescription
- Never diagnose conditions — recommend consulting a doctor for diagnosis
- Mention that prices shown are per unit (per tablet/capsule/etc.) unless stated otherwise
- Be warm, helpful, and conversational — use Filipino-friendly language occasionally (e.g., "po", "Ingat!")
- Keep responses concise (2-4 sentences usually) unless detailed info is needed
- For serious symptoms, always say "Please consult your doctor or go to the nearest hospital"

Delivery info:
- Same-day delivery in Metro Manila for orders placed before 2 PM
- Next-day delivery for provincial areas
- Free delivery on orders above ₱999

Here is the current product catalog:

${getCatalogSummary()}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not set in environment variables. Please add it to your .env.local file or Vercel environment settings." });
  }

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://medicare-ph.vercel.app",
        "X-Title": "MediCare PH",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(502).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
