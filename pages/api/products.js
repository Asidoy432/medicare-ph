import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  const sb = getSupabase();

  if (!sb) {
    return res.status(503).json({ error: "Supabase not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment." });
  }

  if (req.method === "GET") {
    const { data, error } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { name, brand, category, price, old_price, unit, stock, rx, emoji, desc, rating, reviews, badge, tags } = req.body;
    if (!name || !brand || !category || !price) {
      return res.status(400).json({ error: "name, brand, category, price are required" });
    }
    const { data, error } = await sb.from("products").insert([{
      name, brand, category,
      price: parseFloat(price),
      old_price: old_price ? parseFloat(old_price) : null,
      unit: unit || "per tablet",
      stock: parseInt(stock) || 100,
      rx: rx === true || rx === "true",
      emoji: emoji || "💊",
      description: desc || "",
      rating: parseFloat(rating) || 4.5,
      reviews: parseInt(reviews) || 0,
      badge: badge || null,
      tags: tags || "",
    }]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "id required" });
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
