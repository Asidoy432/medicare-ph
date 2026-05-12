import { createClient } from "@supabase/supabase-js";
import { SEED_PRODUCTS } from "../../data/products";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return res.status(503).json({ error: "Supabase not configured" });

  const sb = createClient(url, key);
  const { data, error } = await sb.from("products").insert(SEED_PRODUCTS).select();
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ inserted: data.length });
}
