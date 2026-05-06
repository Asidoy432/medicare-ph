import Head from "next/head";
import { useState, useRef, useEffect, useCallback } from "react";
import { PRODUCTS, CATEGORIES } from "../data/products";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#e0a63b", fontSize: ".8rem" }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
}

function formatPrice(n) {
  return "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function now() {
  return new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm MediBot, your MediCare PH pharmacy assistant. How can I help you today? You can ask me about medicines, vitamins, dosage info, or help finding a product!",
      time: now(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const messagesEndRef = useRef(null);

  // scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // filter + sort products
  const filtered = useCallback(() => {
    let list = [...PRODUCTS];
    if (activeCategory !== "all") list = list.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [activeCategory, search, sortBy]);

  const products = filtered();

  // cart actions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`🛒 ${product.name} added to cart!`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i).filter(i => i.qty > 0));
  };
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // toast
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 2800);
  };

  // chat
  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const userMsg = { role: "user", content: text, time: now() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    try {
      const history = [...chatMessages, userMsg]
        .filter(m => m.role !== "system")
        .map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply, time: now() }]);
    } catch (e) {
      setChatMessages(prev => [...prev, {
        role: "assistant",
        content: `⚠️ Sorry, I ran into an issue: ${e.message}. Please check that your OPENROUTER_API_KEY is set correctly.`,
        time: now(),
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const quickSend = (msg) => {
    setChatInput(msg);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      sendChat();
    }, 100);
  };

  const QUICK_REPLIES = [
    "What's good for fever?", "Vitamins for kids?",
    "Do I need RX for antibiotics?", "Delivery time?",
    "Best pain reliever?", "Immune boosters?",
  ];

  // ─── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>MediCare PH — Your Trusted Online Pharmacy</title>
        <meta name="description" content="FDA-registered online pharmacy in the Philippines. Certified medicines, vitamins, and wellness products. Same-day delivery in Metro Manila." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💊</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh" }}>

        {/* ── NAVBAR ── */}
        <nav style={styles.nav}>
          <a href="#" style={styles.logo}>
            <div style={styles.logoIcon}>💊</div>
            <div>
              <span style={styles.logoText}>MediCare PH</span>
              <span style={styles.logoSub}>Online Pharmacy</span>
            </div>
          </a>
          <ul style={styles.navLinks}>
            {["Products", "Categories", "Promos", "About"].map(l => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} style={styles.navLink}>{l}</a>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={styles.navBtnOutline}>Sign In</button>
            <button style={{ ...styles.navBtn, background: "var(--lime)", color: "var(--dark)", position: "relative" }}
              onClick={() => setCartOpen(true)}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <div style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.heroTag}>🇵🇭 FDA-Registered · Nationwide Delivery</div>
            <h1 style={styles.heroH1}>
              Your Health,<br />
              <span style={{ color: "var(--lime)" }}>Delivered Fast</span><br />
              Across the PH
            </h1>
            <p style={styles.heroP}>
              Certified medicines, vitamins, and wellness products from licensed Philippine pharmacies.
              Order before 2 PM — same-day delivery available in Metro Manila.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={styles.btnPrimary}
                onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>
                Shop Now
              </button>
              <button style={styles.btnSecondary} onClick={() => setChatOpen(true)}>
                💬 Ask MediBot
              </button>
            </div>
          </div>
          <div style={styles.heroCard}>
            <div style={{ color: "var(--lime)", fontSize: ".72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
              Pharmacy at a Glance
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              {[["64+", "Products"], ["10", "Categories"], ["4.8★", "Rating"]].map(([num, lbl]) => (
                <div key={lbl} style={styles.statBox}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#fff", fontWeight: 700 }}>{num}</div>
                  <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.5)", textTransform: "uppercase", letterSpacing: 1 }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div style={styles.deliveryBadge}>
              <span style={{ fontSize: "1.3rem" }}>🚚</span>
              <div>
                <strong style={{ color: "var(--lime)", fontSize: ".8rem", display: "block" }}>Same-Day Delivery</strong>
                <span style={{ fontSize: ".72rem", color: "rgba(255,255,255,.7)" }}>Order before 2 PM · Metro Manila</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={styles.searchBar}>
          <div style={styles.searchInner}>
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--gray)" }}>🔍</span>
              <input
                style={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search medicines, vitamins, brands…"
                onKeyDown={e => e.key === "Enter" && document.getElementById("products").scrollIntoView({ behavior: "smooth" })}
              />
            </div>
            <select style={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A–Z</option>
            </select>
            <button style={styles.searchBtn}
              onClick={() => document.getElementById("products").scrollIntoView({ behavior: "smooth" })}>
              Search
            </button>
          </div>
        </div>

        {/* ── CATEGORIES ── */}
        <section id="categories" style={{ ...styles.section, background: "var(--white)" }}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionTag}>Browse by Type</div>
              <div style={styles.sectionTitle}>Product Categories</div>
            </div>
          </div>
          <div style={styles.catGrid}>
            {CATEGORIES.filter(c => c.id !== "all").map(cat => (
              <div key={cat.id}
                style={{
                  ...styles.catCard,
                  borderColor: activeCategory === cat.id ? "var(--green)" : "var(--border)",
                  background: activeCategory === cat.id ? "#f0faf5" : "var(--cream)",
                }}
                onClick={() => {
                  setActiveCategory(cat.id);
                  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
                }}>
                <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>{cat.icon}</span>
                <div style={{ fontSize: ".78rem", fontWeight: 700, color: "var(--dark)" }}>{cat.name}</div>
                <div style={{ fontSize: ".68rem", color: "var(--gray)", marginTop: 2 }}>
                  {PRODUCTS.filter(p => p.category === cat.id).length} items
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <div style={styles.promoBanner} id="promo">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", color: "#fff", marginBottom: 8 }}>
              First Order? Save Big!
            </h2>
            <p style={{ color: "rgba(255,255,255,.7)", maxWidth: 360, lineHeight: 1.6 }}>
              Use promo code on your first purchase and get 15% off on all vitamins and supplements.
              Valid for new accounts only.
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={styles.promoCode}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "1.3rem", color: "var(--lime)", letterSpacing: 3 }}>
                MEDI15
              </span>
              <small style={{ display: "block", color: "rgba(255,255,255,.5)", fontSize: ".7rem", marginTop: 4 }}>
                15% off vitamins & supplements
              </small>
            </div>
            <button style={styles.btnPrimary} onClick={() => showToast("✅ Promo code MEDI15 copied!")}>
              Copy Code
            </button>
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        <section id="products" style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionTag}>
                {CATEGORIES.find(c => c.id === activeCategory)?.name || "All Products"}
              </div>
              <div style={styles.sectionTitle}>
                {search ? `Results for "${search}"` : "Available Products"}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", fontWeight: 400, color: "var(--gray)", marginLeft: 12 }}>
                  ({products.length} items)
                </span>
              </div>
            </div>
            {activeCategory !== "all" && (
              <button onClick={() => setActiveCategory("all")} style={{ color: "var(--green)", background: "none", border: "none", fontSize: ".85rem", fontWeight: 600, cursor: "pointer" }}>
                ← All Products
              </button>
            )}
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--gray)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 8 }}>No products found</h3>
              <p>Try a different search term or browse by category</p>
            </div>
          ) : (
            <div style={styles.prodGrid}>
              {products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
            </div>
          )}
        </section>

        {/* ── FEATURES ── */}
        <section style={{ ...styles.section, background: "var(--white)" }} id="about">
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionTag}>Why Choose Us</div>
              <div style={styles.sectionTitle}>The MediCare PH Difference</div>
            </div>
          </div>
          <div style={styles.featGrid}>
            {[
              { icon: "🏅", title: "FDA-Registered", desc: "All products are licensed and certified by the Philippine FDA. We only carry genuine, quality-assured medicines." },
              { icon: "🚚", title: "Fast Nationwide Delivery", desc: "Same-day delivery in Metro Manila for orders before 2 PM. Province-wide next-day courier service." },
              { icon: "🤖", title: "AI Pharmacy Assistant", desc: "MediBot is available 24/7 to answer your medicine questions, recommend products, and guide your choices." },
              { icon: "💰", title: "Affordable Generics", desc: "We carry a full range of affordable generic medicines with the same efficacy as branded products." },
            ].map(f => (
              <div key={f.title} style={styles.featCard}>
                <div style={styles.featIcon}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: ".95rem", color: "var(--dark)", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: ".8rem", color: "var(--gray)", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={styles.footer}>
          <div style={styles.footerGrid}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ ...styles.logoIcon, width: 32, height: 32, fontSize: "1rem" }}>💊</div>
                <span style={{ fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.1rem", fontWeight: 700 }}>MediCare PH</span>
              </div>
              <p style={{ fontSize: ".8rem", color: "rgba(255,255,255,.5)", lineHeight: 1.7, maxWidth: 240 }}>
                Your trusted online pharmacy in the Philippines. FDA-registered, pharmacist-verified, nationwide delivery.
              </p>
            </div>
            {[
              { title: "Products", links: ["Pain Relief", "Vitamins", "Cold & Flu", "Digestive", "Antibiotics"] },
              { title: "Company", links: ["About Us", "Contact", "Careers", "Blog", "Privacy Policy"] },
              { title: "Support", links: ["Track Order", "Returns", "FAQs", "Prescription Upload", "Live Chat"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: "#fff", fontSize: ".78rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</h4>
                <ul style={{ listStyle: "none" }}>
                  {col.links.map(l => (
                    <li key={l} style={{ marginBottom: 8 }}>
                      <a href="#" style={{ color: "rgba(255,255,255,.45)", fontSize: ".8rem" }}>{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "rgba(255,255,255,.3)", fontSize: ".72rem" }}>© 2025 MediCare PH. All rights reserved.</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(168,224,99,.08)", border: "1px solid rgba(168,224,99,.15)", padding: "5px 10px", borderRadius: 6 }}>
              <span style={{ fontSize: ".72rem", color: "var(--lime)" }}>🏛️ FDA Registered · License No. PHA-2024-0001</span>
            </div>
          </div>
        </footer>

        {/* ── CHATBOT TOGGLE ── */}
        <button style={styles.chatToggle} onClick={() => setChatOpen(o => !o)} aria-label="Open MediBot">
          <span style={styles.chatPulse} />
          {chatOpen ? "✕" : "💬"}
        </button>

        {/* ── CHATBOT WINDOW ── */}
        {chatOpen && (
          <div style={styles.chatbot}>
            {/* Header */}
            <div style={styles.chatHead}>
              <div style={styles.chatAvatar}>🤖</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: ".92rem" }}>MediBot</div>
                <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, background: "#4ade80", borderRadius: "50%", display: "inline-block" }} />
                  Pharmacy AI Assistant
                </div>
              </div>
              <button style={styles.chatClose} onClick={() => setChatOpen(false)}>✕</button>
            </div>

            {/* Messages */}
            <div style={styles.chatMessages}>
              {chatMessages.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                  <div style={{ ...styles.msgAvatar, background: m.role === "user" ? "rgba(255,255,255,.1)" : "var(--green)" }}>
                    {m.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div style={{ maxWidth: "78%" }}>
                    <div style={{
                      padding: "10px 14px", borderRadius: 16,
                      borderBottomLeftRadius: m.role === "user" ? 16 : 4,
                      borderBottomRightRadius: m.role === "user" ? 4 : 16,
                      background: m.role === "user" ? "linear-gradient(135deg,var(--green),var(--green2))" : "rgba(255,255,255,.08)",
                      color: "rgba(255,255,255,.88)", fontSize: ".82rem", lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}>
                      {m.content}
                    </div>
                    <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.25)", marginTop: 3, textAlign: m.role === "user" ? "right" : "left" }}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ ...styles.msgAvatar, background: "var(--green)" }}>🤖</div>
                  <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.08)", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 4 }}>
                    {[0, 0.2, 0.4].map((d, i) => (
                      <span key={i} style={{ width: 6, height: 6, background: "rgba(255,255,255,.4)", borderRadius: "50%", display: "inline-block", animation: `bounce 1.2s ${d}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div style={{ padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid var(--chatbrd)" }}>
              {QUICK_REPLIES.map(q => (
                <button key={q} style={styles.quickBtn}
                  onClick={() => {
                    setChatInput(q);
                    setTimeout(() => {
                      const input = document.getElementById("medibot-input");
                      if (input) input.focus();
                    }, 50);
                  }}>
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={styles.chatInputArea}>
              <input
                id="medibot-input"
                style={styles.chatInput}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                placeholder="Ask me anything about medicines…"
                disabled={chatLoading}
              />
              <button style={{ ...styles.sendBtn, opacity: chatLoading || !chatInput.trim() ? 0.4 : 1 }}
                onClick={sendChat} disabled={chatLoading || !chatInput.trim()}>
                ➤
              </button>
            </div>
          </div>
        )}

        {/* ── CART DRAWER ── */}
        {cartOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300 }} onClick={() => setCartOpen(false)} />
            <div style={styles.cartDrawer}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem" }}>Your Cart ({cartCount})</h2>
                <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--gray)" }}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", color: "var(--gray)", padding: "40px 20px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: 12 }}>🛒</div>
                  <p>Your cart is empty.<br />Browse our products and add items!</p>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {cart.map(item => (
                      <div key={item.id} style={styles.cartItem}>
                        <span style={{ fontSize: "2rem" }}>{item.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: ".85rem" }}>{item.name}</div>
                          <div style={{ fontSize: ".72rem", color: "var(--gray)" }}>{formatPrice(item.price)} / {item.unit}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                            <button style={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                            <span style={{ fontWeight: 700, fontSize: ".9rem" }}>{item.qty}</span>
                            <button style={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: "var(--green)" }}>{formatPrice(item.price * item.qty)}</div>
                          <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "var(--red)", fontSize: ".75rem", cursor: "pointer", marginTop: 4 }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: "1.5px solid var(--border)", paddingTop: 16, marginTop: 16 }}>
                    {cartTotal < 999 && (
                      <div style={{ background: "#f0faf5", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: ".75rem", color: "var(--green)", marginBottom: 12 }}>
                        🚚 Add {formatPrice(999 - cartTotal)} more for FREE delivery!
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ color: "var(--gray)", fontSize: ".85rem" }}>Subtotal</span>
                      <span style={{ fontWeight: 700 }}>{formatPrice(cartTotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                      <span style={{ color: "var(--gray)", fontSize: ".85rem" }}>Delivery</span>
                      <span style={{ fontWeight: 700, color: cartTotal >= 999 ? "var(--green)" : "var(--dark)" }}>
                        {cartTotal >= 999 ? "FREE" : "₱60.00"}
                      </span>
                    </div>
                    <button style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", display: "flex" }}
                      onClick={() => { showToast("✅ Order placed! We'll confirm shortly."); setCart([]); setCartOpen(false); }}>
                      Place Order · {formatPrice(cartTotal + (cartTotal >= 999 ? 0 : 60))}
                    </button>
                    {cart.some(i => i.rx) && (
                      <p style={{ fontSize: ".7rem", color: "var(--red)", marginTop: 10, textAlign: "center", lineHeight: 1.5 }}>
                        ⚠️ Your cart contains RX items. Please prepare your valid prescription for verification upon delivery.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── TOAST ── */}
        <div style={{ ...styles.toast, opacity: toast.show ? 1 : 0, transform: `translateX(-50%) translateY(${toast.show ? 0 : 20}px)` }}>
          {toast.msg}
        </div>

        {/* ── BOUNCE ANIMATION ── */}
        <style>{`
          @keyframes bounce {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-6px); }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: .7; }
            70% { transform: scale(1.5); opacity: 0; }
            100% { opacity: 0; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          * { scrollbar-width: thin; scrollbar-color: var(--border) transparent; }
          a:hover { color: var(--lime) !important; }
          .cat-card:hover, .feat-card:hover, .prod-card:hover { cursor: pointer; }
        `}</style>
      </div>
    </>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product: p, onAdd }) {
  const [hovered, setHovered] = useState(false);
  const badgeStyle = {
    rx: { background: "#fef3c7", color: "#92400e" },
    sale: { background: "#dcfce7", color: "#166534" },
    bestseller: { background: "#dbeafe", color: "#1e40af" },
    new: { background: "#ede9fe", color: "#5b21b6" },
  };
  return (
    <div
      style={{ ...styles.prodCard, transform: hovered ? "translateY(-5px)" : "translateY(0)", boxShadow: hovered ? "0 14px 40px rgba(26,107,71,.14)" : "none", borderColor: hovered ? "var(--green)" : "var(--border)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {p.badge && (
        <div style={{ ...styles.badge, ...(badgeStyle[p.badge] || {}) }}>
          {p.badge === "rx" ? "🔒 RX" : p.badge === "bestseller" ? "⭐ Bestseller" : p.badge === "sale" ? "🏷️ Sale" : "✨ New"}
        </div>
      )}
      <div style={styles.prodImg}>{p.emoji}</div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontSize: ".66rem", fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
          {CATEGORIES.find(c => c.id === p.category)?.name} · {p.brand}
        </div>
        <div style={{ fontSize: ".88rem", fontWeight: 700, color: "var(--dark)", lineHeight: 1.35, marginBottom: 4 }}>{p.name}</div>
        <div style={{ fontSize: ".73rem", color: "var(--gray)", marginBottom: 8, lineHeight: 1.4 }}>{p.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <StarRating rating={p.rating} />
          <span style={{ fontSize: ".68rem", color: "var(--gray)" }}>({p.reviews.toLocaleString()})</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--green)" }}>
              {formatPrice(p.price)}
            </span>
            {p.oldPrice && <span style={{ fontSize: ".72rem", color: "var(--gray)", textDecoration: "line-through", marginLeft: 5 }}>{formatPrice(p.oldPrice)}</span>}
            <div style={{ fontSize: ".62rem", color: "var(--gray)", marginTop: 1 }}>{p.unit}</div>
          </div>
          <button style={styles.addBtn} onClick={() => onAdd(p)} title={`Add ${p.name} to cart`}>+</button>
        </div>
        {p.rx && (
          <div style={{ marginTop: 8, fontSize: ".65rem", color: "#b45309", background: "#fef3c7", padding: "4px 8px", borderRadius: 6 }}>
            🔒 Requires valid prescription
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  nav: {
    position: "sticky", top: 0, zIndex: 100,
    background: "rgba(26,107,71,.97)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(168,224,99,.15)",
    padding: "0 32px", display: "flex", alignItems: "center",
    justifyContent: "space-between", height: 64,
  },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoIcon: {
    width: 38, height: 38, background: "var(--lime)", borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
  },
  logoText: { fontFamily: "'Playfair Display', serif", color: "#fff", fontSize: "1.2rem", fontWeight: 700, display: "block" },
  logoSub: { fontSize: ".62rem", color: "rgba(255,255,255,.5)", letterSpacing: "2px", textTransform: "uppercase", display: "block" },
  navLinks: { display: "flex", gap: 28, listStyle: "none" },
  navLink: { color: "rgba(255,255,255,.8)", fontSize: ".875rem", fontWeight: 500 },
  navBtn: { padding: "8px 18px", borderRadius: 8, fontSize: ".82rem", fontWeight: 700, border: "none", cursor: "pointer" },
  navBtnOutline: { padding: "8px 18px", borderRadius: 8, fontSize: ".82rem", fontWeight: 600, background: "transparent", border: "1.5px solid rgba(255,255,255,.4)", color: "#fff", cursor: "pointer" },
  cartBadge: { position: "absolute", top: -6, right: -6, background: "var(--red)", color: "#fff", fontSize: ".6rem", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 },
  hero: {
    minHeight: 520, background: "linear-gradient(130deg,#0f2d1e 0%,#1a6b47 55%,#22875a 100%)",
    display: "flex", alignItems: "center", padding: "60px 64px", gap: 48, position: "relative", overflow: "hidden",
  },
  heroContent: { flex: 1, position: "relative", zIndex: 1 },
  heroTag: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(168,224,99,.15)", border: "1px solid rgba(168,224,99,.3)", color: "var(--lime)", fontSize: ".72rem", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 12px", borderRadius: 20, marginBottom: 20 },
  heroH1: { fontFamily: "'Playfair Display', serif", fontSize: "3.1rem", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 16 },
  heroP: { color: "rgba(255,255,255,.72)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 460, marginBottom: 30 },
  heroCard: { background: "rgba(255,255,255,.08)", border: "1px solid rgba(168,224,99,.2)", borderRadius: 20, padding: 28, backdropFilter: "blur(12px)", width: 300, flexShrink: 0, position: "relative", zIndex: 1 },
  statBox: { flex: 1, background: "rgba(255,255,255,.06)", borderRadius: 12, padding: 14, textAlign: "center" },
  deliveryBadge: { display: "flex", alignItems: "center", gap: 10, background: "rgba(168,224,99,.1)", border: "1px solid rgba(168,224,99,.25)", borderRadius: 12, padding: "12px 14px" },
  searchBar: { background: "var(--white)", borderBottom: "1px solid var(--border)", padding: "18px 64px" },
  searchInner: { display: "flex", gap: 10, maxWidth: 860, margin: "0 auto" },
  searchInput: { width: "100%", padding: "11px 16px 11px 40px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: ".88rem", color: "var(--dark)", background: "var(--cream)", outline: "none" },
  sortSelect: { padding: "11px 14px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: ".82rem", color: "var(--dark)", background: "var(--cream)", outline: "none", cursor: "pointer", flexShrink: 0 },
  searchBtn: { padding: "11px 24px", background: "var(--green)", color: "#fff", border: "none", borderRadius: 10, fontSize: ".85rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  section: { padding: "52px 64px" },
  sectionHeader: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 },
  sectionTag: { fontSize: ".68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--green)", marginBottom: 5 },
  sectionTitle: { fontFamily: "'Playfair Display', serif", fontSize: "1.9rem", fontWeight: 700, color: "var(--dark)" },
  catGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 },
  catCard: { background: "var(--cream)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "18px 10px", textAlign: "center", cursor: "pointer", transition: "all .2s" },
  promoBanner: {
    background: "linear-gradient(130deg,#0f2d1e,#1a6b47)", borderRadius: 20, margin: "0 64px 52px",
    padding: "44px 56px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", overflow: "hidden",
  },
  promoCode: { background: "rgba(168,224,99,.12)", border: "1.5px dashed rgba(168,224,99,.5)", borderRadius: 12, padding: "14px 22px", display: "inline-block", marginBottom: 14 },
  prodGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
  prodCard: { background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 18, overflow: "hidden", transition: "all .22s", position: "relative" },
  badge: { position: "absolute", top: 10, left: 10, fontSize: ".62rem", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "3px 8px", borderRadius: 6 },
  prodImg: { height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.2rem", background: "linear-gradient(135deg,var(--cream),#e8f5ee)" },
  addBtn: { width: 34, height: 34, background: "var(--green)", color: "#fff", border: "none", borderRadius: 9, fontSize: "1.2rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0 },
  featGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
  featCard: { border: "1.5px solid var(--border)", borderRadius: 18, padding: "26px 20px", transition: "all .2s" },
  featIcon: { width: 46, height: 46, background: "linear-gradient(135deg,var(--cream),#d4edde)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: 14 },
  footer: { background: "var(--dark)", color: "rgba(255,255,255,.6)", padding: "44px 64px 22px" },
  footerGrid: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 36 },
  chatToggle: {
    position: "fixed", bottom: 28, right: 28, zIndex: 200, width: 58, height: 58,
    borderRadius: "50%", background: "linear-gradient(135deg,var(--green),var(--green2))",
    border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "1.5rem", boxShadow: "0 8px 28px rgba(26,107,71,.45)", transition: "all .25s",
  },
  chatPulse: { position: "absolute", width: 58, height: 58, borderRadius: "50%", background: "rgba(26,107,71,.4)", animation: "pulse 2s infinite" },
  chatbot: {
    position: "fixed", bottom: 100, right: 28, zIndex: 200, width: 380, borderRadius: 22,
    background: "var(--chatbg)", border: "1px solid var(--chatbrd)", boxShadow: "0 24px 80px rgba(0,0,0,.6)",
    display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: 580, animation: "slideUp .3s ease",
  },
  chatHead: { background: "linear-gradient(135deg,#0f2d1e,#1a6b47)", padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--chatbrd)" },
  chatAvatar: { width: 40, height: 40, background: "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 },
  chatClose: { marginLeft: "auto", background: "rgba(255,255,255,.08)", border: "none", color: "rgba(255,255,255,.6)", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center" },
  chatMessages: { flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 },
  msgAvatar: { width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".8rem" },
  quickBtn: { fontSize: ".68rem", padding: "5px 9px", borderRadius: 20, border: "1px solid rgba(168,224,99,.25)", color: "rgba(255,255,255,.6)", background: "transparent", cursor: "pointer" },
  chatInputArea: { padding: "12px", borderTop: "1px solid var(--chatbrd)", display: "flex", gap: 8, alignItems: "center", background: "rgba(0,0,0,.2)" },
  chatInput: { flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid var(--chatbrd)", borderRadius: 10, padding: "9px 13px", fontSize: ".82rem", color: "#fff", outline: "none" },
  sendBtn: { width: 36, height: 36, borderRadius: 10, background: "var(--green)", border: "none", color: "#fff", cursor: "pointer", fontSize: ".95rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  cartDrawer: {
    position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff",
    zIndex: 400, padding: 28, display: "flex", flexDirection: "column",
    boxShadow: "-8px 0 40px rgba(0,0,0,.15)", overflowY: "auto",
  },
  cartItem: { display: "flex", gap: 12, alignItems: "flex-start", padding: "14px 0", borderBottom: "1px solid var(--border)" },
  qtyBtn: { width: 26, height: 26, borderRadius: 6, border: "1.5px solid var(--border)", background: "var(--cream)", fontSize: "1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  toast: {
    position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
    background: "var(--dark)", color: "#fff", padding: "10px 22px", borderRadius: 10,
    fontSize: ".82rem", transition: "all .3s", pointerEvents: "none", zIndex: 500,
    border: "1px solid var(--border)", whiteSpace: "nowrap",
  },
  btnPrimary: { padding: "12px 26px", background: "var(--lime)", color: "var(--dark)", border: "none", borderRadius: 10, fontSize: ".88rem", fontWeight: 700, cursor: "pointer" },
  btnSecondary: { padding: "12px 26px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.3)", borderRadius: 10, fontSize: ".88rem", fontWeight: 600, cursor: "pointer" },
};
