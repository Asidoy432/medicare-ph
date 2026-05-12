import Head from "next/head";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { CATEGORIES, SEED_PRODUCTS } from "../data/products";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const fmt = (n) => "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const ts = () => new Date().toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

function Stars({ r }) {
  const f = Math.floor(r), h = r % 1 >= 0.5;
  return <span style={{ color: "#e0a63b", fontSize: ".78rem", letterSpacing: 1 }}>
    {"★".repeat(f)}{h ? "½" : ""}{"☆".repeat(5 - f - (h ? 1 : 0))}
  </span>;
}

// ─── DRAGGABLE HOOK ───────────────────────────────────────────────────────────
function useDrag(ref) {
  const [pos, setPos] = useState(null);
  const drag = useRef(false);
  const origin = useRef({ mx: 0, my: 0, ex: 0, ey: 0 });

  const start = useCallback((cx, cy) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    drag.current = true;
    origin.current = { mx: cx, my: cy, ex: r.left, ey: r.top };
    document.body.style.userSelect = "none";
  }, [ref]);

  const onMD = useCallback((e) => { if (!e.target.closest("button,input,textarea")) start(e.clientX, e.clientY); }, [start]);
  const onTS = useCallback((e) => { if (!e.target.closest("button,input,textarea")) start(e.touches[0].clientX, e.touches[0].clientY); }, [start]);

  useEffect(() => {
    const move = (cx, cy) => {
      if (!drag.current || !ref.current) return;
      const el = ref.current;
      const x = Math.max(0, Math.min(origin.current.ex + cx - origin.current.mx, window.innerWidth - el.offsetWidth));
      const y = Math.max(0, Math.min(origin.current.ey + cy - origin.current.my, window.innerHeight - el.offsetHeight));
      setPos({ x, y });
    };
    const mm = (e) => move(e.clientX, e.clientY);
    const tm = (e) => move(e.touches[0].clientX, e.touches[0].clientY);
    const up = () => { drag.current = false; document.body.style.userSelect = ""; };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", up);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", up); window.removeEventListener("touchmove", tm); window.removeEventListener("touchend", up); };
  }, [ref]);

  return { pos, onMD, onTS };
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function useToast() {
  const [t, setT] = useState({ show: false, msg: "", type: "info" });
  const show = useCallback((msg, type = "info") => {
    setT({ show: true, msg, type });
    setTimeout(() => setT(p => ({ ...p, show: false })), 3000);
  }, []);
  return { toast: t, show };
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function Overlay({ onClick }) {
  return <div onClick={onClick} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 490, backdropFilter: "blur(4px)", animation: "fadeIn .2s" }} />;
}

function SignInModal({ onClose, onSuccess }) {
  const [tab, setTab] = useState("in");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const submit = (e) => { e.preventDefault(); onSuccess(tab === "in" ? "✅ Welcome back!" : "🎉 Account created! Welcome to MediCare PH."); };
  return (
    <>
      <Overlay onClick={onClose} />
      <div style={M.modal}>
        <button onClick={onClose} style={M.xBtn}>✕</button>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>💊</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem" }}>{tab === "in" ? "Sign In" : "Create Account"}</h2>
        </div>
        <div style={M.tabs}>
          {[["in", "Sign In"], ["up", "Register"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v)} style={{ ...M.tab, ...(tab === v ? M.tabActive : {}) }}>{l}</button>
          ))}
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "up" && <input style={M.inp} placeholder="Full Name" value={f.name} onChange={e => set("name", e.target.value)} required />}
          <input style={M.inp} type="email" placeholder="Email Address" value={f.email} onChange={e => set("email", e.target.value)} required />
          <input style={M.inp} type="password" placeholder="Password" value={f.password} onChange={e => set("password", e.target.value)} required />
          {tab === "in" && <div style={{ textAlign: "right" }}><button type="button" style={M.link} onClick={() => onSuccess("📧 Password reset link sent to your email!")}>Forgot password?</button></div>}
          <button type="submit" style={M.submitBtn}>{tab === "in" ? "Sign In →" : "Create Account →"}</button>
        </form>
        <p style={{ textAlign: "center", fontSize: ".75rem", color: "var(--gray)", marginTop: 16 }}>
          By continuing you agree to our <button style={M.link} onClick={() => onSuccess("📄 Terms page coming soon!")}>Terms</button> & <button style={M.link} onClick={() => onSuccess("🔒 Privacy policy coming soon!")}>Privacy Policy</button>
        </p>
      </div>
    </>
  );
}

function ProductModal({ p, onClose, onAdd }) {
  return (
    <>
      <Overlay onClick={onClose} />
      <div style={{ ...M.modal, padding: 0, maxWidth: 460, overflow: "hidden" }}>
        <button onClick={onClose} style={{ ...M.xBtn, background: "rgba(0,0,0,.2)", color: "#fff" }}>✕</button>
        <div style={{ height: 170, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem", background: "linear-gradient(135deg,var(--cream),#cce8d4)" }}>{p.emoji}</div>
        <div style={{ padding: "20px 24px 26px" }}>
          {p.rx && <span style={M.rxTag}>🔒 PRESCRIPTION REQUIRED</span>}
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", marginTop: p.rx ? 8 : 0, marginBottom: 4 }}>{p.name}</h2>
          <div style={{ fontSize: ".78rem", color: "var(--g2)", fontWeight: 700, marginBottom: 10 }}>{p.brand}</div>
          <p style={{ fontSize: ".84rem", color: "var(--gray)", lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</p>
          {p.tags && <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {p.tags.split(",").filter(Boolean).map(t => (
              <span key={t} style={{ fontSize: ".62rem", padding: "3px 9px", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 99, color: "var(--gray)" }}>{t.trim()}</span>
            ))}
          </div>}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Stars r={parseFloat(p.rating) || 4.5} />
            <span style={{ fontSize: ".72rem", color: "var(--gray)" }}>({Number(p.reviews).toLocaleString()} reviews)</span>
            {p.stock <= 50 && <span style={{ fontSize: ".65rem", color: "var(--red)", marginLeft: "auto" }}>⚠️ Only {p.stock} left!</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "var(--g)" }}>{fmt(p.price)}</span>
              {p.old_price && <span style={{ fontSize: ".75rem", color: "var(--gray)", textDecoration: "line-through", marginLeft: 6 }}>{fmt(p.old_price)}</span>}
              <div style={{ fontSize: ".65rem", color: "var(--gray)" }}>{p.unit}</div>
            </div>
            <button style={M.addBig} onClick={() => { onAdd(p); onClose(); }}>🛒 Add to Cart</button>
          </div>
        </div>
      </div>
    </>
  );
}

function AdminModal({ onClose, onSaved, toast }) {
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [f, setF] = useState({ name: "", brand: "", category: "pain", price: "", old_price: "", unit: "per tablet", stock: "100", rx: false, emoji: "💊", desc: "", rating: "4.5", reviews: "0", badge: "", tags: "" });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      toast("✅ Product added to database!");
      onSaved();
      setF(p => ({ ...p, name: "", brand: "", price: "", desc: "", tags: "" }));
    } catch (e) { toast("❌ " + e.message, "error"); }
    setLoading(false);
  };

  const seed = async () => {
    setSeeding(true);
    try {
      const r = await fetch("/api/seed", { method: "POST" });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      toast(`✅ Seeded ${d.inserted} products into Supabase!`);
      onSaved();
    } catch (e) { toast("❌ " + e.message, "error"); }
    setSeeding(false);
  };

  const row = { display: "flex", gap: 10, flexWrap: "wrap" };
  const half = { flex: "1 1 140px" };

  return (
    <>
      <Overlay onClick={onClose} />
      <div style={{ ...M.modal, maxWidth: 540, maxHeight: "88vh", overflowY: "auto" }}>
        <button onClick={onClose} style={M.xBtn}>✕</button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: "1.5rem" }}>🗄️</span>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.2rem" }}>Database Manager</h2>
            <p style={{ fontSize: ".72rem", color: "var(--gray)" }}>Add products — searchable by MediBot chatbot</p>
          </div>
        </div>

        <button onClick={seed} disabled={seeding} style={{ width: "100%", padding: "11px", background: seeding ? "var(--border)" : "var(--g3)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".85rem", marginBottom: 20, cursor: seeding ? "not-allowed" : "pointer" }}>
          {seeding ? "⏳ Seeding…" : "🌱 Seed 40 Sample Products to Supabase"}
        </button>

        <div style={{ fontSize: ".72rem", color: "var(--gray)", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>— OR ADD MANUALLY —</div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={row}>
            <div style={half}><label style={M.lbl}>Product Name *</label><input style={M.inp} value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Biogesic 500mg" required /></div>
            <div style={half}><label style={M.lbl}>Brand *</label><input style={M.inp} value={f.brand} onChange={e => set("brand", e.target.value)} placeholder="e.g. Unilab" required /></div>
          </div>
          <div style={row}>
            <div style={half}>
              <label style={M.lbl}>Category *</label>
              <select style={M.inp} value={f.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div style={half}><label style={M.lbl}>Emoji</label><input style={M.inp} value={f.emoji} onChange={e => set("emoji", e.target.value)} placeholder="💊" maxLength={4} /></div>
          </div>
          <div style={row}>
            <div style={half}><label style={M.lbl}>Price (₱) *</label><input style={M.inp} type="number" step="0.01" min="0" value={f.price} onChange={e => set("price", e.target.value)} placeholder="0.00" required /></div>
            <div style={half}><label style={M.lbl}>Old Price (₱)</label><input style={M.inp} type="number" step="0.01" min="0" value={f.old_price} onChange={e => set("old_price", e.target.value)} placeholder="optional" /></div>
          </div>
          <div style={row}>
            <div style={half}><label style={M.lbl}>Unit</label><input style={M.inp} value={f.unit} onChange={e => set("unit", e.target.value)} placeholder="per tablet" /></div>
            <div style={half}><label style={M.lbl}>Stock</label><input style={M.inp} type="number" min="0" value={f.stock} onChange={e => set("stock", e.target.value)} /></div>
          </div>
          <div style={row}>
            <div style={half}>
              <label style={M.lbl}>Badge</label>
              <select style={M.inp} value={f.badge} onChange={e => set("badge", e.target.value)}>
                <option value="">None</option>
                <option value="bestseller">⭐ Bestseller</option>
                <option value="sale">🏷️ Sale</option>
                <option value="new">✨ New</option>
                <option value="rx">🔒 RX</option>
              </select>
            </div>
            <div style={half}>
              <label style={M.lbl}>Rating</label>
              <input style={M.inp} type="number" step="0.1" min="1" max="5" value={f.rating} onChange={e => set("rating", e.target.value)} />
            </div>
          </div>
          <div><label style={M.lbl}>Description</label><textarea style={{ ...M.inp, height: 68, resize: "vertical" }} value={f.desc} onChange={e => set("desc", e.target.value)} placeholder="Product description…" /></div>
          <div><label style={M.lbl}>Tags (comma-separated for chatbot search)</label><input style={M.inp} value={f.tags} onChange={e => set("tags", e.target.value)} placeholder="fever,paracetamol,headache" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input type="checkbox" id="rxCheck" checked={f.rx} onChange={e => set("rx", e.target.checked)} style={{ width: 16, height: 16 }} />
            <label htmlFor="rxCheck" style={{ fontSize: ".83rem", color: "var(--dark)", cursor: "pointer" }}>🔒 Requires Prescription (RX)</label>
          </div>
          <button type="submit" disabled={loading} style={{ padding: "12px", background: loading ? "var(--border)" : "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".88rem", cursor: loading ? "not-allowed" : "pointer", marginTop: 4 }}>
            {loading ? "⏳ Saving…" : "💾 Save Product to Database"}
          </button>
        </form>
      </div>
    </>
  );
}

const M = {
  modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 500, background: "#fff", borderRadius: 20, padding: "32px 28px", width: "92vw", maxWidth: 420, boxShadow: "0 32px 80px rgba(0,0,0,.25)", animation: "slideUp .25s ease" },
  xBtn: { position: "absolute", top: 12, right: 12, background: "var(--cream)", border: "none", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: ".9rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray)" },
  tabs: { display: "flex", background: "var(--cream)", borderRadius: 10, padding: 4, marginBottom: 20, gap: 4 },
  tab: { flex: 1, padding: "8px", borderRadius: 8, border: "none", fontSize: ".8rem", fontWeight: 600, cursor: "pointer", background: "transparent", color: "var(--gray)", transition: "all .2s" },
  tabActive: { background: "var(--g)", color: "#fff" },
  inp: { width: "100%", padding: "10px 12px", border: "1.5px solid var(--border)", borderRadius: 9, fontSize: ".84rem", outline: "none", color: "var(--dark)", background: "var(--cream)" },
  lbl: { display: "block", fontSize: ".72rem", fontWeight: 700, color: "var(--gray)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 4 },
  link: { background: "none", border: "none", color: "var(--g)", fontSize: "inherit", cursor: "pointer", padding: 0, textDecoration: "underline" },
  submitBtn: { padding: "12px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".88rem", cursor: "pointer" },
  rxTag: { display: "inline-block", background: "#fef3c7", color: "#92400e", fontSize: ".62rem", fontWeight: 700, padding: "3px 9px", borderRadius: 6, marginBottom: 8 },
  addBig: { padding: "11px 20px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".85rem", cursor: "pointer" },
};

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const BADGE_STYLE = {
  bestseller: { bg: "#dbeafe", color: "#1e40af", label: "⭐ Best" },
  sale:       { bg: "#dcfce7", color: "#166534", label: "🏷️ Sale" },
  new:        { bg: "#ede9fe", color: "#5b21b6", label: "✨ New" },
  rx:         { bg: "#fef3c7", color: "#92400e", label: "🔒 RX" },
};

function ProductCard({ p, onAdd, onView }) {
  const [hover, setHover] = useState(false);
  const b = BADGE_STYLE[p.badge];
  const catName = CATEGORIES.find(c => c.id === p.category)?.name || p.category;
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${hover ? "var(--g)" : "var(--border)"}`, borderRadius: 18, overflow: "hidden", transition: "all .22s", position: "relative", display: "flex", flexDirection: "column", transform: hover ? "translateY(-4px)" : "none", boxShadow: hover ? "0 14px 40px rgba(26,107,71,.13)" : "none" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {b && <div style={{ position: "absolute", top: 10, left: 10, fontSize: ".6rem", fontWeight: 800, letterSpacing: .8, textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, background: b.bg, color: b.color, zIndex: 1 }}>{b.label}</div>}
      <div style={{ height: 130, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", background: "linear-gradient(135deg,var(--cream),#d9f0e2)", cursor: "pointer" }} onClick={() => onView(p)}>{p.emoji}</div>
      <div style={{ padding: "12px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: ".6rem", fontWeight: 700, color: "var(--g2)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>{catName} · {p.brand}</div>
        <div style={{ fontSize: ".86rem", fontWeight: 700, color: "var(--dark)", lineHeight: 1.35, marginBottom: 4, cursor: "pointer", flex: 1 }} onClick={() => onView(p)}>{p.name}</div>
        <div style={{ fontSize: ".71rem", color: "var(--gray)", marginBottom: 8, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <Stars r={parseFloat(p.rating) || 4.5} />
          <span style={{ fontSize: ".65rem", color: "var(--gray)" }}>({Number(p.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.08rem", fontWeight: 700, color: "var(--g)" }}>{fmt(p.price)}</div>
            {p.old_price && <span style={{ fontSize: ".68rem", color: "var(--gray)", textDecoration: "line-through" }}>{fmt(p.old_price)}</span>}
            <div style={{ fontSize: ".6rem", color: "var(--gray)" }}>{p.unit}</div>
          </div>
          <button onClick={() => onAdd(p)} title="Add to cart" style={{ width: 34, height: 34, background: "var(--g)", color: "#fff", border: "none", borderRadius: 9, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>+</button>
        </div>
        {p.rx && <div style={{ marginTop: 8, fontSize: ".62rem", color: "#92400e", background: "#fef3c7", padding: "4px 8px", borderRadius: 6 }}>🔒 Requires valid prescription</div>}
      </div>
    </div>
  );
}

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
function Chatbot({ onClose, allProducts }) {
  const [msgs, setMsgs] = useState([{ role: "assistant", content: "Kamusta po! 👋 I'm MediBot, your MediCare PH pharmacy assistant. Ask me about medicines, dosage, or product availability!", time: ts() }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const ref = useRef(null);
  const { pos, onMD, onTS } = useDrag(ref);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const send = useCallback(async (text) => {
    const txt = (text || input).trim();
    if (!txt || loading) return;
    const um = { role: "user", content: txt, time: ts() };
    setMsgs(p => [...p, um]);
    setInput("");
    setLoading(true);
    try {
      const history = [...msgs, um].map(m => ({ role: m.role, content: m.content }));
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history }) });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      setMsgs(p => [...p, { role: "assistant", content: d.reply, time: ts() }]);
    } catch (e) { setMsgs(p => [...p, { role: "assistant", content: "⚠️ " + e.message, time: ts() }]); }
    setLoading(false);
  }, [input, loading, msgs]);

  const posStyle = pos ? { position: "fixed", left: pos.x, top: pos.y, bottom: "auto", right: "auto" }
    : { position: "fixed", bottom: 100, right: 18 };

  const QUICK = ["What's good for fever?", "Vitamins for kids?", "Any antibiotic available?", "Do I need RX?", "Delivery time?", "Immune boosters?"];

  return (
    <div ref={ref} style={{ ...posStyle, width: "min(380px, 96vw)", borderRadius: 22, background: "var(--chatbg)", border: "1px solid var(--chatbrd)", boxShadow: "0 24px 80px rgba(0,0,0,.7)", display: "flex", flexDirection: "column", maxHeight: "min(580px,80vh)", zIndex: 300, animation: "slideUp .3s ease" }}>
      {/* Header */}
      <div onMouseDown={onMD} onTouchStart={onTS} style={{ background: "linear-gradient(135deg,#0a2010,#1a6b47)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--chatbrd)", cursor: "grab", userSelect: "none", borderRadius: "22px 22px 0 0" }}>
        <div style={{ width: 38, height: 38, background: "var(--lime)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: ".9rem" }}>MediBot</div>
          <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.5)", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, background: "#4ade80", borderRadius: "50%", display: "inline-block", animation: "blink 2s infinite" }} />
            Pharmacy AI · drag to move
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button title="Clear chat" onClick={() => setMsgs([{ role: "assistant", content: "Chat cleared! How can I help you? 😊", time: ts() }])} style={{ background: "rgba(255,255,255,.08)", border: "none", color: "rgba(255,255,255,.55)", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: ".75rem" }}>🗑️</button>
          <button title="Close" onClick={onClose} style={{ background: "rgba(255,255,255,.08)", border: "none", color: "rgba(255,255,255,.55)", width: 28, height: 28, borderRadius: 8, cursor: "pointer", fontSize: ".85rem" }}>✕</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "msgIn .2s ease" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: m.role === "user" ? "rgba(255,255,255,.1)" : "var(--g)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem" }}>
              {m.role === "user" ? "👤" : "🤖"}
            </div>
            <div style={{ maxWidth: "78%" }}>
              <div style={{ padding: "9px 13px", borderRadius: 14, borderBottomLeftRadius: m.role === "user" ? 14 : 3, borderBottomRightRadius: m.role === "user" ? 3 : 14, background: m.role === "user" ? "linear-gradient(135deg,var(--g),var(--g2))" : "rgba(255,255,255,.07)", color: "rgba(255,255,255,.9)", fontSize: ".8rem", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.content}</div>
              <div style={{ fontSize: ".58rem", color: "rgba(255,255,255,.22)", marginTop: 2, textAlign: m.role === "user" ? "right" : "left" }}>{m.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--g)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: ".75rem" }}>🤖</div>
            <div style={{ padding: "10px 14px", background: "rgba(255,255,255,.07)", borderRadius: "14px 14px 14px 3px", display: "flex", gap: 4 }}>
              {[0, 200, 400].map((d, i) => <span key={i} style={{ width: 6, height: 6, background: "rgba(255,255,255,.4)", borderRadius: "50%", display: "inline-block", animation: `bounce 1.2s ${d}ms infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies */}
      <div style={{ padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid var(--chatbrd)" }}>
        {QUICK.map(q => <button key={q} onClick={() => send(q)} disabled={loading} style={{ fontSize: ".65rem", padding: "4px 9px", borderRadius: 99, border: "1px solid rgba(168,224,99,.25)", color: "rgba(255,255,255,.6)", background: "transparent", cursor: "pointer" }}>{q}</button>)}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 12px", borderTop: "1px solid var(--chatbrd)", display: "flex", gap: 8, background: "rgba(0,0,0,.25)", borderRadius: "0 0 22px 22px" }}>
        <input style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid var(--chatbrd)", borderRadius: 10, padding: "9px 12px", fontSize: ".8rem", color: "#fff", outline: "none" }}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask about medicines…" disabled={loading} />
        <button onClick={() => send()} disabled={loading || !input.trim()} style={{ width: 36, height: 36, borderRadius: 10, background: "var(--g)", border: "none", color: "#fff", cursor: input.trim() && !loading ? "pointer" : "not-allowed", opacity: input.trim() && !loading ? 1 : .4, fontSize: ".95rem", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
    </div>
  );
}

// ─── DRAGGABLE CHAT TOGGLE BUTTON ─────────────────────────────────────────────
function ChatToggle({ open, onClick }) {
  const ref = useRef(null);
  const { pos, onMD, onTS } = useDrag(ref);
  const posStyle = pos ? { position: "fixed", left: pos.x, top: pos.y, bottom: "auto", right: "auto" }
    : { position: "fixed", bottom: 28, right: 18 };
  return (
    <button ref={ref} onMouseDown={onMD} onTouchStart={onTS} onClick={onClick}
      style={{ ...posStyle, width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,var(--g),var(--g2))", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", boxShadow: "0 8px 28px rgba(26,107,71,.5)", zIndex: 250, transition: "box-shadow .2s" }}
      aria-label="Toggle MediBot">
      <span style={{ position: "absolute", width: 58, height: 58, borderRadius: "50%", background: "rgba(26,107,71,.35)", animation: open ? "none" : "pulse 2s infinite" }} />
      <span style={{ position: "relative", zIndex: 1 }}>{open ? "✕" : "💬"}</span>
    </button>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Home() {
  const [products, setProducts] = useState([]);
  const [dbReady, setDbReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { toast, show: showToast } = useToast();

  // Load products from Supabase
  const loadProducts = useCallback(async () => {
    try {
      const r = await fetch("/api/products");
      const d = await r.json();
      if (Array.isArray(d) && d.length > 0) { setProducts(d); setDbReady(true); }
      else { setProducts(SEED_PRODUCTS.map((p, i) => ({ ...p, id: i + 1 }))); setDbReady(false); }
    } catch { setProducts(SEED_PRODUCTS.map((p, i) => ({ ...p, id: i + 1 }))); setDbReady(false); }
    setLoading(false);
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  // Filtered products
  const displayed = useMemo(() => {
    let list = [...products];
    if (activeCat !== "all") list = list.filter(p => p.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => [p.name, p.brand, p.desc, p.tags].some(s => s?.toLowerCase().includes(q)));
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCat, search, sort]);

  // Cart
  const addToCart = useCallback((p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
    showToast(`🛒 ${p.name} added!`);
  }, [showToast]);
  const rmCart = (id) => { setCart(p => p.filter(i => i.id !== id)); showToast("🗑️ Item removed."); };
  const setQty = (id, d) => setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  const clearCart = () => { setCart([]); showToast("🗑️ Cart cleared."); };
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // Promo
  const copyPromo = () => {
    if (navigator.clipboard) navigator.clipboard.writeText("MEDI15").then(() => showToast("✅ Code MEDI15 copied!"));
    else showToast("✅ Promo code: MEDI15");
  };

  // Place order
  const placeOrder = () => {
    showToast("✅ Order placed! Confirmation will be sent via SMS. Salamat po! 🎉");
    setCart([]); setCartOpen(false);
  };

  const NAV_LINKS = [
    { label: "Products", action: () => { setMobileMenu(false); go("products"); } },
    { label: "Categories", action: () => { setMobileMenu(false); go("categories"); } },
    { label: "Promos", action: () => { setMobileMenu(false); go("promo"); } },
    { label: "About", action: () => { setMobileMenu(false); go("about"); } },
    { label: "🗄️ Admin DB", action: () => { setMobileMenu(false); setAdminOpen(true); } },
  ];

  const FEATURES = [
    { icon: "🏅", title: "FDA-Registered", desc: "All products are licensed by the Philippine FDA. Only genuine, quality-assured medicines.", action: () => showToast("🏛️ FDA License No. PHA-2024-0001 — Verified!") },
    { icon: "🚚", title: "Fast Delivery", desc: "Same-day Metro Manila delivery before 2PM. Province-wide next-day courier.", action: () => go("promo") },
    { icon: "🤖", title: "AI MediBot", desc: "Ask our chatbot 24/7 for medicine info, dosage guidance, and product recommendations.", action: () => setChatOpen(true) },
    { icon: "💰", title: "Generic Savings", desc: "Affordable generics with the same efficacy as branded medicines — up to 80% savings.", action: () => { setActiveCat("pain"); go("products"); } },
    { icon: "🔒", title: "Secure Payments", desc: "GCash, Maya, credit cards, and COD accepted. Encrypted transactions guaranteed.", action: () => showToast("💳 All payment methods accepted!") },
    { icon: "📋", title: "RX Upload", desc: "Upload your prescription digitally. Pharmacist-verified within 30 minutes.", action: () => showToast("📄 RX upload feature coming soon!") },
  ];

  return (
    <>
      <Head>
        <title>MediCare PH — Your Trusted Online Pharmacy</title>
        <meta name="description" content="FDA-registered Philippine online pharmacy. Medicines, vitamins & wellness products. Same-day Metro Manila delivery." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💊</text></svg>" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Sora:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ minHeight: "100vh", fontFamily: "'Sora',sans-serif" }}>

        {/* ── TOPBAR ── */}
        <div style={{ background: "var(--g3)", color: "rgba(255,255,255,.7)", fontSize: ".7rem", textAlign: "center", padding: "6px 16px", display: "flex", justifyContent: "center", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <span>🚚 Same-day delivery Metro Manila · Order before 2PM</span>
          <span>📞 Hotline: +63 2 8888-MEDI</span>
          <span>🏛️ FDA Registered</span>
        </div>

        {/* ── NAVBAR ── */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(26,107,71,.97)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(168,224,99,.13)", padding: "0 clamp(12px,4vw,40px)", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "var(--lime)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem" }}>💊</div>
            <div>
              <span style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: "1.1rem", fontWeight: 700, display: "block", lineHeight: 1.1 }}>MediCare PH</span>
              <span style={{ fontSize: ".55rem", color: "rgba(255,255,255,.45)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Online Pharmacy</span>
            </div>
          </a>

          {/* Desktop nav */}
          <ul style={{ display: "flex", gap: 24, listStyle: "none" }} className="hide-mobile">
            {NAV_LINKS.map(l => <li key={l.label}><button onClick={l.action} style={{ background: "none", border: "none", color: "rgba(255,255,255,.8)", fontSize: ".82rem", fontWeight: 500, cursor: "pointer" }}>{l.label}</button></li>)}
          </ul>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* DB status pill */}
            <div style={{ fontSize: ".6rem", padding: "3px 8px", borderRadius: 99, background: dbReady ? "rgba(74,222,128,.15)" : "rgba(224,166,59,.15)", color: dbReady ? "#4ade80" : "#e0a63b", border: `1px solid ${dbReady ? "rgba(74,222,128,.3)" : "rgba(224,166,59,.3)"}`, fontWeight: 600, letterSpacing: .5 }} className="hide-mobile">
              {dbReady ? "● DB Live" : "● DB Local"}
            </div>
            <button onClick={() => { if (loggedIn) { setLoggedIn(false); showToast("👋 Signed out."); } else setSignInOpen(true); }}
              style={{ padding: "7px 14px", background: "transparent", border: "1.5px solid rgba(255,255,255,.35)", color: "#fff", borderRadius: 8, fontSize: ".78rem", fontWeight: 600, cursor: "pointer" }}>
              {loggedIn ? "Sign Out" : "Sign In"}
            </button>
            <button onClick={() => setCartOpen(true)} style={{ padding: "7px 14px", background: "var(--lime)", color: "var(--dark)", border: "none", borderRadius: 8, fontSize: ".78rem", fontWeight: 700, cursor: "pointer", position: "relative" }}>
              🛒{cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -6, background: "var(--red)", color: "#fff", fontSize: ".55rem", width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
            </button>
            {/* Mobile menu */}
            <button className="hide-desktop" onClick={() => setMobileMenu(p => !p)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.4rem", cursor: "pointer", marginLeft: 4 }}>☰</button>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileMenu && (
          <>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 95 }} onClick={() => setMobileMenu(false)} />
            <div style={{ position: "fixed", top: 62, left: 0, right: 0, background: "var(--g3)", zIndex: 96, padding: "12px 0", borderBottom: "1px solid rgba(168,224,99,.15)", animation: "slideDown .2s ease" }}>
              {NAV_LINKS.map(l => <button key={l.label} onClick={l.action} style={{ display: "block", width: "100%", padding: "12px 24px", background: "none", border: "none", color: "rgba(255,255,255,.85)", fontSize: ".9rem", textAlign: "left", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,.06)" }}>{l.label}</button>)}
            </div>
          </>
        )}

        {/* ── HERO ── */}
        <div style={{ minHeight: "clamp(400px,55vw,560px)", background: "linear-gradient(135deg,#071a0d 0%,#0f3d22 40%,#1a6b47 80%,#22875a 100%)", display: "flex", alignItems: "center", padding: "50px clamp(16px,5vw,80px)", gap: "clamp(20px,4vw,60px)", flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          {/* BG pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 80%, rgba(168,224,99,.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(34,135,90,.15) 0%, transparent 50%)", pointerEvents: "none" }} />
          <div style={{ flex: "1 1 300px", position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(168,224,99,.12)", border: "1px solid rgba(168,224,99,.28)", color: "var(--lime)", fontSize: ".68rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", padding: "5px 13px", borderRadius: 99, marginBottom: 22 }}>
              🇵🇭 FDA-Registered · Trusted Since 2020
            </div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(2rem,5vw,3.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.12, marginBottom: 18 }}>
              Your Health,<br /><span style={{ color: "var(--lime)" }}>Delivered Fast</span><br />Across the PH
            </h1>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: "clamp(.85rem,2vw,1rem)", lineHeight: 1.75, maxWidth: 460, marginBottom: 30 }}>
              Certified medicines, vitamins, and wellness products. Order before 2PM for same-day Metro Manila delivery. Over {products.length} products in stock.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => go("products")} style={{ padding: "13px 28px", background: "var(--lime)", color: "var(--dark)", border: "none", borderRadius: 11, fontWeight: 700, fontSize: ".9rem", cursor: "pointer" }}>Shop Now →</button>
              <button onClick={() => setChatOpen(true)} style={{ padding: "13px 28px", background: "transparent", color: "#fff", border: "2px solid rgba(255,255,255,.3)", borderRadius: 11, fontWeight: 600, fontSize: ".9rem", cursor: "pointer" }}>💬 Ask MediBot</button>
            </div>
            {/* Trust badges */}
            <div style={{ display: "flex", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
              {["🏅 FDA Verified", "🚚 Fast Delivery", "💊 1000+ Products"].map(b => (
                <div key={b} style={{ fontSize: ".7rem", color: "rgba(255,255,255,.55)", display: "flex", alignItems: "center", gap: 4 }}>{b}</div>
              ))}
            </div>
          </div>
          {/* Stats card */}
          <div style={{ background: "rgba(255,255,255,.07)", border: "1px solid rgba(168,224,99,.18)", borderRadius: 20, padding: "26px 24px", backdropFilter: "blur(14px)", width: "clamp(250px,30vw,300px)", flexShrink: 0, position: "relative", zIndex: 1, alignSelf: "center" }} className="hide-mobile">
            <div style={{ fontSize: ".65rem", color: "var(--lime)", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16 }}>Pharmacy at a Glance</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {[["64+", "Products"], ["10", "Categories"], ["4.8★", "Avg Rating"], ["98%", "Satisfaction"]].map(([n, l]) => (
                <div key={l} style={{ background: "rgba(255,255,255,.06)", borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.4rem", color: "#fff", fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: ".6rem", color: "rgba(255,255,255,.45)", textTransform: "uppercase", letterSpacing: 1 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(168,224,99,.1)", border: "1px solid rgba(168,224,99,.2)", borderRadius: 12, padding: "12px 14px" }}>
              <span style={{ fontSize: "1.2rem" }}>🚚</span>
              <div>
                <div style={{ color: "var(--lime)", fontWeight: 700, fontSize: ".78rem" }}>Same-Day Delivery</div>
                <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.55)" }}>Order before 2PM · Metro Manila</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px clamp(14px,4vw,64px)", position: "sticky", top: 62, zIndex: 90 }}>
          <div style={{ display: "flex", gap: 10, maxWidth: 900, margin: "0 auto", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", position: "relative" }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--gray)", pointerEvents: "none" }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && go("products")}
                placeholder="Search medicines, brands, conditions…"
                style={{ width: "100%", padding: "11px 36px 11px 38px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: ".85rem", outline: "none", color: "var(--dark)", background: "var(--cream)" }} />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--gray)", fontSize: ".9rem" }}>✕</button>}
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding: "11px 12px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: ".82rem", background: "var(--cream)", color: "var(--dark)", outline: "none", cursor: "pointer", flexShrink: 0 }}>
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A–Z</option>
            </select>
            <button onClick={() => go("products")} style={{ padding: "11px 22px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".82rem", cursor: "pointer", flexShrink: 0 }}>Search</button>
          </div>
        </div>

        {/* ── CATEGORIES ── */}
        <section id="categories" style={{ padding: "48px clamp(14px,4vw,64px)", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--g2)", marginBottom: 4 }}>Browse by Type</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--dark)" }}>Product Categories</h2>
            </div>
            <button onClick={() => { setActiveCat("all"); setSearch(""); go("products"); }} style={{ background: "none", border: "none", color: "var(--g)", fontWeight: 700, fontSize: ".83rem", cursor: "pointer", borderBottom: "1.5px solid var(--lime)", paddingBottom: 2 }}>See All Products →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: 12 }}>
            {CATEGORIES.map(cat => {
              const count = products.filter(p => p.category === cat.id).length;
              const active = activeCat === cat.id;
              return (
                <div key={cat.id} onClick={() => { setActiveCat(cat.id); go("products"); }}
                  style={{ background: active ? "#f0faf4" : "var(--cream)", border: `1.5px solid ${active ? "var(--g)" : "var(--border)"}`, borderRadius: 14, padding: "16px 10px", textAlign: "center", cursor: "pointer", transition: "all .2s", transform: active ? "translateY(-3px)" : "none", boxShadow: active ? "0 6px 18px rgba(26,107,71,.12)" : "none" }}>
                  <span style={{ fontSize: "1.8rem", display: "block", marginBottom: 7 }}>{cat.icon}</span>
                  <div style={{ fontSize: ".73rem", fontWeight: 700, color: "var(--dark)", lineHeight: 1.3 }}>{cat.name}</div>
                  <div style={{ fontSize: ".62rem", color: "var(--gray)", marginTop: 2 }}>{count} items</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PROMO BANNER ── */}
        <div id="promo" style={{ background: "linear-gradient(135deg,#071a0d,#1a6b47)", margin: "0 clamp(14px,4vw,64px) 52px", borderRadius: 20, padding: "clamp(24px,4vw,48px) clamp(18px,4vw,56px)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 80, top: "50%", transform: "translateY(-50%)", fontSize: "8rem", opacity: .05, pointerEvents: "none" }}>🌿</div>
          <div style={{ flex: "1 1 260px" }}>
            <div style={{ fontSize: ".65rem", color: "var(--lime)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Limited Offer</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3vw,2rem)", color: "#fff", marginBottom: 10 }}>First Order? Save 15%!</h2>
            <p style={{ color: "rgba(255,255,255,.65)", lineHeight: 1.65, maxWidth: 380, fontSize: ".88rem" }}>Use promo code at checkout on vitamins & supplements. Valid for new accounts. Free delivery on orders above ₱999.</p>
          </div>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ background: "rgba(168,224,99,.12)", border: "1.5px dashed rgba(168,224,99,.45)", borderRadius: 14, padding: "16px 24px", marginBottom: 14, display: "inline-block" }}>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: "1.5rem", color: "var(--lime)", letterSpacing: 4, fontWeight: 500 }}>MEDI15</span>
              <div style={{ fontSize: ".65rem", color: "rgba(255,255,255,.45)", marginTop: 4 }}>15% off vitamins & supplements</div>
            </div>
            <button onClick={copyPromo} style={{ display: "block", width: "100%", padding: "12px 24px", background: "var(--lime)", color: "var(--dark)", border: "none", borderRadius: 10, fontWeight: 700, fontSize: ".85rem", cursor: "pointer" }}>📋 Copy Code</button>
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        <section id="products" style={{ padding: "0 clamp(14px,4vw,64px) 60px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--g2)", marginBottom: 4 }}>
                {activeCat === "all" ? "All Products" : CATEGORIES.find(c => c.id === activeCat)?.name}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.4rem,3vw,2rem)", color: "var(--dark)" }}>
                {search ? `Results for "${search}"` : "Available Products"}
                <span style={{ fontFamily: "'Sora',sans-serif", fontSize: ".9rem", fontWeight: 400, color: "var(--gray)", marginLeft: 12 }}>({displayed.length})</span>
              </h2>
            </div>
            {(activeCat !== "all" || search) && (
              <button onClick={() => { setActiveCat("all"); setSearch(""); }} style={{ background: "none", border: "none", color: "var(--g)", fontWeight: 700, fontSize: ".83rem", cursor: "pointer" }}>← Clear Filters</button>
            )}
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 18 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 18, height: 280, border: "1.5px solid var(--border)", animation: "pulse-bg 1.5s infinite" }} />
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--gray)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>No products found</h3>
              <p style={{ marginBottom: 20 }}>Try a different search or category</p>
              <button onClick={() => { setSearch(""); setActiveCat("all"); }} style={{ padding: "11px 24px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Show All Products</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 18 }}>
              {displayed.map(p => <ProductCard key={p.id} p={p} onAdd={addToCart} onView={setViewProduct} />)}
            </div>
          )}
        </section>

        {/* ── FEATURES ── */}
        <section id="about" style={{ padding: "52px clamp(14px,4vw,64px)", background: "#fff" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: ".65rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--g2)", marginBottom: 8 }}>Why Choose Us</div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(1.5rem,3vw,2.1rem)", color: "var(--dark)" }}>The MediCare PH Difference</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
            {FEATURES.map(f => (
              <div key={f.title} onClick={f.action} style={{ border: "1.5px solid var(--border)", borderRadius: 18, padding: "26px 20px", cursor: "pointer", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--g)"; e.currentTarget.style.background = "var(--cream)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; }}>
                <div style={{ width: 46, height: 46, background: "linear-gradient(135deg,var(--cream),#cce8d4)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: ".93rem", color: "var(--dark)", marginBottom: 7 }}>{f.title}</div>
                <div style={{ fontSize: ".78rem", color: "var(--gray)", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: "var(--dark)", color: "rgba(255,255,255,.55)", padding: "48px clamp(14px,4vw,64px) 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, background: "var(--lime)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>💊</div>
                <span style={{ fontFamily: "'Playfair Display',serif", color: "#fff", fontSize: "1.05rem", fontWeight: 700 }}>MediCare PH</span>
              </div>
              <p style={{ fontSize: ".78rem", lineHeight: 1.75, maxWidth: 220 }}>FDA-registered online pharmacy. Genuine medicines, fast delivery, AI-powered assistance.</p>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                {[["📘", "Facebook"], ["📸", "Instagram"], ["🐦", "Twitter"], ["▶️", "YouTube"]].map(([icon, name]) => (
                  <button key={name} title={name} onClick={() => showToast(`🔗 ${name} page coming soon!`)} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,.08)", border: "none", cursor: "pointer", fontSize: ".9rem" }}>{icon}</button>
                ))}
              </div>
            </div>
            {[
              { title: "Products", links: [
                ["Pain Relief", () => { setActiveCat("pain"); go("products"); }],
                ["Vitamins", () => { setActiveCat("vitamins"); go("products"); }],
                ["Cold & Flu", () => { setActiveCat("cold"); go("products"); }],
                ["Antibiotics", () => { setActiveCat("antib"); go("products"); }],
                ["Baby & Mother", () => { setActiveCat("baby"); go("products"); }],
              ]},
              { title: "Company", links: [
                ["About Us", () => go("about")],
                ["Contact Us", () => showToast("📞 +63 2 8888-MEDI · info@medicare-ph.com")],
                ["Careers", () => showToast("💼 No open positions currently.")],
                ["Blog", () => showToast("📝 Blog coming soon!")],
                ["Privacy Policy", () => showToast("🔒 Privacy policy coming soon.")],
              ]},
              { title: "Support", links: [
                ["Track Order", () => showToast("📦 Order tracking coming soon!")],
                ["Returns", () => showToast("↩️ 7-day return policy for sealed items.")],
                ["FAQs", () => showToast("❓ Visit support.medicare-ph.com")],
                ["Upload Prescription", () => showToast("📄 RX upload coming soon!")],
                ["Live Chat", () => setChatOpen(true)],
              ]},
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: "#fff", fontSize: ".72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
                  {col.links.map(([label, action]) => (
                    <li key={label}><button onClick={action} style={{ background: "none", border: "none", color: "rgba(255,255,255,.4)", fontSize: ".78rem", cursor: "pointer", padding: 0, textAlign: "left", transition: "color .2s" }}
                      onMouseEnter={e => e.target.style.color = "var(--lime)"} onMouseLeave={e => e.target.style.color = "rgba(255,255,255,.4)"}>{label}</button></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "rgba(255,255,255,.25)", fontSize: ".7rem" }}>© 2025 MediCare PH. All rights reserved.</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: ".65rem", color: "var(--lime)", background: "rgba(168,224,99,.08)", border: "1px solid rgba(168,224,99,.15)", padding: "4px 10px", borderRadius: 6 }}>🏛️ FDA License No. PHA-2024-0001</span>
            </div>
          </div>
        </footer>

        {/* ── DRAGGABLE CHAT TOGGLE ── */}
        <ChatToggle open={chatOpen} onClick={() => setChatOpen(o => !o)} />

        {/* ── CHATBOT ── */}
        {chatOpen && <Chatbot onClose={() => setChatOpen(false)} allProducts={products} />}

        {/* ── CART DRAWER ── */}
        {cartOpen && (
          <>
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", zIndex: 300 }} onClick={() => setCartOpen(false)} />
            <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px,100vw)", background: "#fff", zIndex: 400, padding: "24px clamp(14px,4vw,28px)", display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,.15)", animation: "slideRight .25s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem" }}>Your Cart ({cartCount})</h2>
                <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--gray)" }}>✕</button>
              </div>
              {cart.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--gray)", textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: 14 }}>🛒</div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 10 }}>Cart is empty</h3>
                  <p style={{ fontSize: ".83rem", marginBottom: 20 }}>Browse our products and add items!</p>
                  <button onClick={() => { setCartOpen(false); go("products"); }} style={{ padding: "11px 24px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Browse Products</button>
                </div>
              ) : (
                <>
                  <div style={{ flex: 1, overflowY: "auto" }}>
                    {cart.map(item => (
                      <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                        <span style={{ fontSize: "2rem", flexShrink: 0 }}>{item.emoji}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: ".84rem", marginBottom: 2 }}>{item.name}</div>
                          <div style={{ fontSize: ".7rem", color: "var(--gray)", marginBottom: 8 }}>{fmt(item.price)} / {item.unit}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button onClick={() => setQty(item.id, -1)} style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid var(--border)", background: "var(--cream)", cursor: "pointer", fontSize: ".9rem" }}>−</button>
                            <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                            <button onClick={() => setQty(item.id, 1)} style={{ width: 26, height: 26, borderRadius: 7, border: "1.5px solid var(--border)", background: "var(--cream)", cursor: "pointer", fontSize: ".9rem" }}>+</button>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 700, color: "var(--g)", fontSize: ".9rem" }}>{fmt(item.price * item.qty)}</div>
                          <button onClick={() => rmCart(item.id)} style={{ background: "none", border: "none", color: "var(--red)", fontSize: ".72rem", cursor: "pointer", marginTop: 6 }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ paddingTop: 16, borderTop: "1.5px solid var(--border)" }}>
                    {cartTotal < 999 && <div style={{ background: "#f0faf4", border: "1px solid var(--border)", borderRadius: 9, padding: "8px 12px", fontSize: ".73rem", color: "var(--g)", marginBottom: 12 }}>🚚 Add {fmt(999 - cartTotal)} more for FREE delivery!</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: ".85rem" }}><span style={{ color: "var(--gray)" }}>Subtotal</span><span style={{ fontWeight: 700 }}>{fmt(cartTotal)}</span></div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontSize: ".85rem" }}><span style={{ color: "var(--gray)" }}>Delivery</span><span style={{ fontWeight: 700, color: cartTotal >= 999 ? "var(--g)" : "var(--dark)" }}>{cartTotal >= 999 ? "FREE 🎉" : "₱60.00"}</span></div>
                    <button onClick={placeOrder} style={{ width: "100%", padding: "13px", background: "var(--g)", color: "#fff", border: "none", borderRadius: 11, fontWeight: 700, fontSize: ".9rem", cursor: "pointer", marginBottom: 8 }}>
                      Place Order · {fmt(cartTotal + (cartTotal >= 999 ? 0 : 60))}
                    </button>
                    <button onClick={clearCart} style={{ width: "100%", padding: "10px", background: "none", border: "1.5px solid var(--border)", borderRadius: 11, fontSize: ".82rem", color: "var(--gray)", cursor: "pointer" }}>Clear Cart</button>
                    {cart.some(i => i.rx) && <div style={{ background: "#fef3c7", border: "1px solid #fcd34d", borderRadius: 9, padding: "9px 12px", fontSize: ".7rem", color: "#92400e", marginTop: 12, lineHeight: 1.55 }}>⚠️ Cart has RX items. Please have your valid prescription ready for verification upon delivery.</div>}
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ── MODALS ── */}
        {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} onSuccess={(msg) => { showToast(msg); setLoggedIn(true); setSignInOpen(false); }} />}
        {viewProduct && <ProductModal p={viewProduct} onClose={() => setViewProduct(null)} onAdd={addToCart} />}
        {adminOpen && <AdminModal onClose={() => setAdminOpen(false)} onSaved={() => { loadProducts(); setAdminOpen(false); }} toast={showToast} />}

        {/* ── TOAST ── */}
        <div style={{ position: "fixed", bottom: 100, left: "50%", transform: `translateX(-50%) translateY(${toast.show ? 0 : 14}px)`, opacity: toast.show ? 1 : 0, background: "var(--dark)", color: "#fff", padding: "10px 22px", borderRadius: 11, fontSize: ".82rem", transition: "all .3s", pointerEvents: "none", zIndex: 999, border: "1px solid rgba(255,255,255,.08)", whiteSpace: "nowrap", boxShadow: "0 8px 28px rgba(0,0,0,.3)", maxWidth: "90vw", textAlign: "center" }}>
          {toast.msg}
        </div>

        <style>{`
          @keyframes fadeIn{from{opacity:0}to{opacity:1}}
          @keyframes slideUp{from{opacity:0;transform:translate(-50%,-45%)}to{opacity:1;transform:translate(-50%,-50%)}}
          @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
          @keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
          @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
          @keyframes pulse{0%{transform:scale(1);opacity:.7}70%{transform:scale(1.7);opacity:0}100%{opacity:0}}
          @keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
          @keyframes pulse-bg{0%,100%{opacity:1}50%{opacity:.5}}
          input:focus,select:focus,textarea:focus{border-color:var(--g)!important;box-shadow:0 0 0 3px rgba(26,107,71,.12)}
          button:active{transform:scale(.97)}
          @media(max-width:768px){
            .hide-mobile{display:none!important}
          }
          @media(min-width:769px){
            .hide-desktop{display:none!important}
          }
        `}</style>
      </div>
    </>
  );
}
