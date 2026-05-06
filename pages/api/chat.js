import { getCatalogSummary } from "../../data/products";

// Injected as a user+assistant pair — works with ALL free models
// (many open-source models ignore the "system" role entirely)
function buildSystemTurn() {
  return [
    {
      role: "user",
      content: `You are MediBot, the friendly AI pharmacy assistant for MediCare PH — a trusted FDA-registered online pharmacy in the Philippines.

RULES:
- Answer questions about medicines, vitamins, dosage, and health products
- Always note that RX medicines require a valid prescription
- Never diagnose — always tell users to consult a doctor for diagnosis
- Be warm and use Filipino-friendly language occasionally (e.g. "po", "Ingat!")
- Keep replies concise (2-4 sentences) unless more detail is needed
- For serious symptoms say: "Please consult your doctor or go to the nearest hospital po"
- Prices shown are per unit (tablet/capsule/etc.) unless stated otherwise

DELIVERY INFO:
- Same-day delivery in Lemery Iloilo for orders before 2 PM
- Next-day delivery for provincial areas
- FREE delivery on orders above PHP 999

CURRENT PRODUCT CATALOG:
${getCatalogSummary()}

You are now ready to assist customers. Please respond as MediBot to everything the customer says.`,
    },
    {
      role: "assistant",
      content: "Understood po! I am MediBot, your MediCare PH pharmacy assistant. I am ready to help customers with medicine questions, product recommendations, and health information. How can I help?",
    },
  ];
}

// Free models to try in order — falls back if one is unavailable
const FREE_MODELS = [
  "openai/gpt-oss-120b:free",
];

async function tryModel(model, fullMessages, apiKey, referer) {
  let response;
  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "MediCare PH",
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        max_tokens: 400,
        temperature: 0.7,
      }),
    });
  } catch (e) {
    console.warn("Network error for model", model, e.message);
    return null;
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    return null;
  }

  if (data.error) {
    console.warn("Model error for", model, JSON.stringify(data.error));
    return null;
  }

  const content = data.choices?.[0]?.message?.content;
  return content ? { reply: content, model } : null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "OPENROUTER_API_KEY is not set. " +
        "Go to Vercel > your project > Settings > Environment Variables, " +
        "add OPENROUTER_API_KEY with your key from openrouter.ai/keys, then Redeploy.",
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Build full conversation: system context + real chat history
  const systemTurns = buildSystemTurn();
  const fullMessages = [...systemTurns, ...messages];

  // Use actual Vercel URL for the HTTP-Referer header
  const referer = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  // Try each model in order until one responds
  for (const model of FREE_MODELS) {
    const result = await tryModel(model, fullMessages, apiKey, referer);
    if (result) {
      return res.status(200).json(result);
    }
  }

  // All models failed
  return res.status(502).json({
    error:
      "All free AI models are currently busy. Please try again in a moment. " +
      "If this keeps happening, verify your OPENROUTER_API_KEY at openrouter.ai/keys is valid.",
  });
}
