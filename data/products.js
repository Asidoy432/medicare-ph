// MediCare PH — Product Database
// 60+ products across 10 categories

export const CATEGORIES = [
  { id: "all", name: "All Products", icon: "🏪", color: "#1a6b47" },
  { id: "pain", name: "Pain Relief", icon: "💊", color: "#e63b3b" },
  { id: "vitamins", name: "Vitamins & Supplements", icon: "🌿", color: "#22875a" },
  { id: "cold", name: "Cold & Flu", icon: "🤧", color: "#3b82f6" },
  { id: "digestive", name: "Digestive Health", icon: "🫁", color: "#f59e0b" },
  { id: "skin", name: "Skin Care", icon: "✨", color: "#ec4899" },
  { id: "heart", name: "Heart & BP", icon: "❤️", color: "#ef4444" },
  { id: "diabetes", name: "Diabetes Care", icon: "🩺", color: "#8b5cf6" },
  { id: "baby", name: "Baby & Mother", icon: "👶", color: "#06b6d4" },
  { id: "firstaid", name: "First Aid", icon: "🩹", color: "#f97316" },
  { id: "antib", name: "Antibiotics", icon: "🔬", color: "#6366f1" },
];

export const PRODUCTS = [
  // ─── PAIN RELIEF ───
  {
    id: 1, category: "pain", name: "Biogesic Paracetamol 500mg",
    brand: "Unilab", desc: "Fever & mild to moderate pain relief", price: 8.50,
    oldPrice: null, unit: "per tablet", stock: 500, rx: false,
    badge: "bestseller", rating: 4.8, reviews: 1240, emoji: "💊",
    tags: ["paracetamol", "fever", "headache", "pain"],
  },
  {
    id: 2, category: "pain", name: "Alaxan FR Ibuprofen+Paracetamol",
    brand: "Unilab", desc: "Fast relief for headache, muscle & joint pain", price: 14.75,
    oldPrice: 16.00, unit: "per tablet", stock: 320, rx: false,
    badge: "sale", rating: 4.7, reviews: 876, emoji: "💊",
    tags: ["ibuprofen", "headache", "muscle pain", "fever"],
  },
  {
    id: 3, category: "pain", name: "Mefenamic Acid 500mg Capsule",
    brand: "Generics PH", desc: "For dysmenorrhea, dental & post-op pain", price: 12.00,
    oldPrice: null, unit: "per capsule", stock: 200, rx: true,
    badge: "rx", rating: 4.6, reviews: 543, emoji: "💊",
    tags: ["mefenamic", "dysmenorrhea", "menstrual pain"],
  },
  {
    id: 4, category: "pain", name: "Flanax Naproxen 550mg",
    brand: "Bayer", desc: "Long-lasting pain relief up to 12 hours", price: 22.50,
    oldPrice: 25.00, unit: "per tablet", stock: 150, rx: false,
    badge: "sale", rating: 4.5, reviews: 312, emoji: "💊",
    tags: ["naproxen", "arthritis", "back pain", "long-acting"],
  },
  {
    id: 5, category: "pain", name: "Dolfenal Mefenamic Acid 250mg",
    brand: "Unilab", desc: "Mild analgesic for children 7 years and up", price: 9.25,
    oldPrice: null, unit: "per tablet", stock: 400, rx: false,
    badge: null, rating: 4.4, reviews: 198, emoji: "💊",
    tags: ["mefenamic", "children", "mild pain"],
  },
  {
    id: 6, category: "pain", name: "Arcoxia Etoricoxib 60mg",
    brand: "MSD", desc: "COX-2 inhibitor for arthritis & acute pain", price: 85.00,
    oldPrice: 95.00, unit: "per tablet", stock: 80, rx: true,
    badge: "rx", rating: 4.7, reviews: 421, emoji: "💊",
    tags: ["etoricoxib", "arthritis", "gout", "cox2"],
  },

  // ─── VITAMINS & SUPPLEMENTS ───
  {
    id: 7, category: "vitamins", name: "Stresstabs Multivitamins",
    brand: "Wyeth", desc: "B-complex + Vitamin C for energy & immunity", price: 18.00,
    oldPrice: null, unit: "per tablet", stock: 600, rx: false,
    badge: "bestseller", rating: 4.9, reviews: 2100, emoji: "🌿",
    tags: ["multivitamin", "vitamin b", "vitamin c", "stress"],
  },
  {
    id: 8, category: "vitamins", name: "Myra E Vitamin E 400 IU",
    brand: "Unilab", desc: "Antioxidant for skin health & cellular protection", price: 16.75,
    oldPrice: 18.00, unit: "per capsule", stock: 450, rx: false,
    badge: "sale", rating: 4.8, reviews: 1560, emoji: "🌿",
    tags: ["vitamin e", "skin", "antioxidant", "myra"],
  },
  {
    id: 9, category: "vitamins", name: "Berocca Performance B-Complex",
    brand: "Bayer", desc: "Effervescent Vitamin B + C + Zinc for focus", price: 55.00,
    oldPrice: 65.00, unit: "per tablet", stock: 200, rx: false,
    badge: "sale", rating: 4.7, reviews: 734, emoji: "🌿",
    tags: ["vitamin b", "zinc", "energy", "effervescent"],
  },
  {
    id: 10, category: "vitamins", name: "Calcium Carbonate + Vitamin D3",
    brand: "Generics PH", desc: "Strong bones & teeth — 500mg Ca + 200 IU D3", price: 12.00,
    oldPrice: null, unit: "per tablet", stock: 350, rx: false,
    badge: null, rating: 4.5, reviews: 432, emoji: "🌿",
    tags: ["calcium", "vitamin d", "bones", "osteoporosis"],
  },
  {
    id: 11, category: "vitamins", name: "Conzace Multivitamins + Minerals",
    brand: "Unilab", desc: "Complete daily nutrition with 9 essential vitamins", price: 24.50,
    oldPrice: null, unit: "per capsule", stock: 300, rx: false,
    badge: "new", rating: 4.6, reviews: 287, emoji: "🌿",
    tags: ["multivitamin", "minerals", "complete nutrition"],
  },
  {
    id: 12, category: "vitamins", name: "Fish Oil Omega-3 1000mg",
    brand: "Nature's Best", desc: "EPA & DHA for heart, brain & joint health", price: 28.00,
    oldPrice: 35.00, unit: "per softgel", stock: 220, rx: false,
    badge: "sale", rating: 4.7, reviews: 915, emoji: "🌿",
    tags: ["omega 3", "fish oil", "heart", "brain", "cholesterol"],
  },
  {
    id: 13, category: "vitamins", name: "Zinc + Vitamin C 500mg",
    brand: "Pharex", desc: "Immune booster combo — ideal during wet season", price: 11.00,
    oldPrice: null, unit: "per tablet", stock: 480, rx: false,
    badge: null, rating: 4.6, reviews: 654, emoji: "🌿",
    tags: ["zinc", "vitamin c", "immune", "immunity"],
  },

  // ─── COLD & FLU ───
  {
    id: 14, category: "cold", name: "Neozep Forte Non-Drowsy",
    brand: "Unilab", desc: "Complete cold & flu relief — non-drowsy formula", price: 13.50,
    oldPrice: null, unit: "per tablet", stock: 380, rx: false,
    badge: "bestseller", rating: 4.8, reviews: 1890, emoji: "🤧",
    tags: ["cold", "flu", "congestion", "non-drowsy", "neozep"],
  },
  {
    id: 15, category: "cold", name: "Decolgen No Drowse",
    brand: "Pharex", desc: "Phenylephrine + Paracetamol for sinusitis & cold", price: 11.25,
    oldPrice: null, unit: "per tablet", stock: 290, rx: false,
    badge: null, rating: 4.6, reviews: 876, emoji: "🤧",
    tags: ["cold", "sinus", "decongestant", "paracetamol"],
  },
  {
    id: 16, category: "cold", name: "Benadryl Chesty Forte Syrup",
    brand: "Johnson & Johnson", desc: "Expectorant for productive cough — 100ml", price: 85.00,
    oldPrice: 95.00, unit: "per bottle", stock: 120, rx: false,
    badge: "sale", rating: 4.5, reviews: 412, emoji: "🤧",
    tags: ["cough", "expectorant", "benadryl", "syrup"],
  },
  {
    id: 17, category: "cold", name: "Solmux Carbocisteine 500mg",
    brand: "Unilab", desc: "Mucolytic for thick mucus & productive cough", price: 22.75,
    oldPrice: null, unit: "per capsule", stock: 250, rx: false,
    badge: null, rating: 4.7, reviews: 631, emoji: "🤧",
    tags: ["carbocisteine", "mucolytic", "cough", "phlegm"],
  },
  {
    id: 18, category: "cold", name: "Tuseran Forte Cough Syrup",
    brand: "Unilab", desc: "Dextromethorphan dry cough suppressant — 60ml", price: 68.00,
    oldPrice: 75.00, unit: "per bottle", stock: 95, rx: false,
    badge: "sale", rating: 4.4, reviews: 298, emoji: "🤧",
    tags: ["cough", "dry cough", "suppressant", "syrup"],
  },
  {
    id: 19, category: "cold", name: "Claritin Loratadine 10mg",
    brand: "Bayer", desc: "24-hour antihistamine for allergy & hay fever", price: 32.50,
    oldPrice: null, unit: "per tablet", stock: 180, rx: false,
    badge: "new", rating: 4.8, reviews: 543, emoji: "🤧",
    tags: ["loratadine", "antihistamine", "allergy", "hay fever"],
  },

  // ─── DIGESTIVE HEALTH ───
  {
    id: 20, category: "digestive", name: "Kremil-S Antacid Tablet",
    brand: "Unilab", desc: "Fast acidity, hyperacidity & gas relief", price: 7.25,
    oldPrice: null, unit: "per tablet", stock: 550, rx: false,
    badge: "bestseller", rating: 4.9, reviews: 2340, emoji: "🫁",
    tags: ["antacid", "acidity", "gastritis", "gas", "kremil"],
  },
  {
    id: 21, category: "digestive", name: "Loperamide 2mg Capsule",
    brand: "Generics PH", desc: "Anti-diarrheal — reduces intestinal movement", price: 6.50,
    oldPrice: null, unit: "per capsule", stock: 400, rx: false,
    badge: null, rating: 4.7, reviews: 987, emoji: "🫁",
    tags: ["loperamide", "diarrhea", "LBM", "anti-diarrheal"],
  },
  {
    id: 22, category: "digestive", name: "Omeprazole 20mg Capsule",
    brand: "Pharex", desc: "PPI for GERD, ulcers & acid reflux management", price: 18.00,
    oldPrice: null, unit: "per capsule", stock: 300, rx: true,
    badge: "rx", rating: 4.8, reviews: 1102, emoji: "🫁",
    tags: ["omeprazole", "GERD", "ulcer", "acid reflux", "PPI"],
  },
  {
    id: 23, category: "digestive", name: "Lacteol Lactobacillus Capsule",
    brand: "Sanofi", desc: "Probiotic for diarrhea & gut health restoration", price: 42.00,
    oldPrice: 50.00, unit: "per capsule", stock: 150, rx: false,
    badge: "sale", rating: 4.6, reviews: 387, emoji: "🫁",
    tags: ["probiotic", "lactobacillus", "diarrhea", "gut health"],
  },
  {
    id: 24, category: "digestive", name: "Dulcolax Bisacodyl 5mg",
    brand: "Boehringer", desc: "Overnight laxative for constipation relief", price: 16.25,
    oldPrice: null, unit: "per tablet", stock: 220, rx: false,
    badge: null, rating: 4.5, reviews: 514, emoji: "🫁",
    tags: ["laxative", "constipation", "bisacodyl", "bowel"],
  },
  {
    id: 25, category: "digestive", name: "Buscopan Hyoscine 10mg",
    brand: "Boehringer", desc: "Antispasmodic for abdominal & stomach cramps", price: 26.00,
    oldPrice: null, unit: "per tablet", stock: 175, rx: false,
    badge: "new", rating: 4.7, reviews: 623, emoji: "🫁",
    tags: ["hyoscine", "antispasmodic", "cramps", "IBS"],
  },

  // ─── SKIN CARE ───
  {
    id: 26, category: "skin", name: "Kojiesan Kojic Acid Soap",
    brand: "KNM Group", desc: "Skin lightening kojic acid + vitamin C", price: 65.00,
    oldPrice: 80.00, unit: "per bar (135g)", stock: 280, rx: false,
    badge: "sale", rating: 4.8, reviews: 3210, emoji: "✨",
    tags: ["kojic acid", "whitening", "skin brightening", "soap"],
  },
  {
    id: 27, category: "skin", name: "Clindamycin 150mg Capsule",
    brand: "Pharex", desc: "Antibiotic for acne & skin infections", price: 32.00,
    oldPrice: null, unit: "per capsule", stock: 120, rx: true,
    badge: "rx", rating: 4.6, reviews: 487, emoji: "✨",
    tags: ["clindamycin", "acne", "antibiotic", "skin"],
  },
  {
    id: 28, category: "skin", name: "Bepanthen Wound Healing Cream",
    brand: "Bayer", desc: "Dexpanthenol for cuts, abrasions & nappy rash", price: 185.00,
    oldPrice: 210.00, unit: "per tube (30g)", stock: 90, rx: false,
    badge: "sale", rating: 4.9, reviews: 1120, emoji: "✨",
    tags: ["bepanthen", "wound", "healing", "dexpanthenol", "rash"],
  },
  {
    id: 29, category: "skin", name: "Betamethasone Cream 0.1%",
    brand: "Generics PH", desc: "Corticosteroid for eczema, dermatitis & psoriasis", price: 55.00,
    oldPrice: null, unit: "per tube (15g)", stock: 80, rx: true,
    badge: "rx", rating: 4.5, reviews: 342, emoji: "✨",
    tags: ["betamethasone", "eczema", "dermatitis", "steroid cream"],
  },
  {
    id: 30, category: "skin", name: "Cetaphil Gentle Skin Cleanser",
    brand: "Galderma", desc: "Dermatologist-recommended for sensitive skin", price: 320.00,
    oldPrice: 380.00, unit: "per bottle (250ml)", stock: 65, rx: false,
    badge: "sale", rating: 4.8, reviews: 2100, emoji: "✨",
    tags: ["cetaphil", "sensitive skin", "cleanser", "moisturizer"],
  },
  {
    id: 31, category: "skin", name: "Fluocinolone Ointment 0.025%",
    brand: "Pharex", desc: "Anti-inflammatory for persistent skin conditions", price: 48.00,
    oldPrice: null, unit: "per tube (10g)", stock: 70, rx: true,
    badge: "rx", rating: 4.4, reviews: 213, emoji: "✨",
    tags: ["fluocinolone", "anti-inflammatory", "skin", "itching"],
  },

  // ─── HEART & BP ───
  {
    id: 32, category: "heart", name: "Losartan Potassium 50mg",
    brand: "Pharex", desc: "ARB antihypertensive for high blood pressure", price: 12.50,
    oldPrice: null, unit: "per tablet", stock: 350, rx: true,
    badge: "rx", rating: 4.8, reviews: 1450, emoji: "❤️",
    tags: ["losartan", "hypertension", "blood pressure", "ARB"],
  },
  {
    id: 33, category: "heart", name: "Amlodipine 5mg Tablet",
    brand: "Generics PH", desc: "Calcium channel blocker — hypertension & angina", price: 8.75,
    oldPrice: null, unit: "per tablet", stock: 420, rx: true,
    badge: "rx", rating: 4.7, reviews: 1230, emoji: "❤️",
    tags: ["amlodipine", "hypertension", "heart", "CCB"],
  },
  {
    id: 34, category: "heart", name: "Atorvastatin 20mg Tablet",
    brand: "Pharex", desc: "Statin for high cholesterol & cardiovascular risk", price: 22.00,
    oldPrice: null, unit: "per tablet", stock: 280, rx: true,
    badge: "rx", rating: 4.8, reviews: 987, emoji: "❤️",
    tags: ["atorvastatin", "cholesterol", "statin", "heart"],
  },
  {
    id: 35, category: "heart", name: "Aspirin 80mg Enteric Coated",
    brand: "Bayer", desc: "Low-dose antiplatelet for heart attack prevention", price: 6.00,
    oldPrice: null, unit: "per tablet", stock: 500, rx: false,
    badge: "bestseller", rating: 4.7, reviews: 876, emoji: "❤️",
    tags: ["aspirin", "antiplatelet", "heart", "stroke prevention"],
  },
  {
    id: 36, category: "heart", name: "Metoprolol Succinate 50mg",
    brand: "Pharex", desc: "Beta-blocker for hypertension & heart failure", price: 18.50,
    oldPrice: null, unit: "per tablet", stock: 190, rx: true,
    badge: "rx", rating: 4.6, reviews: 432, emoji: "❤️",
    tags: ["metoprolol", "beta blocker", "heart failure", "hypertension"],
  },

  // ─── DIABETES CARE ───
  {
    id: 37, category: "diabetes", name: "Metformin HCl 500mg",
    brand: "Pharex", desc: "First-line oral antidiabetic — blood sugar control", price: 8.00,
    oldPrice: null, unit: "per tablet", stock: 400, rx: true,
    badge: "rx", rating: 4.8, reviews: 1640, emoji: "🩺",
    tags: ["metformin", "diabetes", "blood sugar", "type 2 diabetes"],
  },
  {
    id: 38, category: "diabetes", name: "Glimepiride 2mg Tablet",
    brand: "Generics PH", desc: "Sulfonylurea — stimulates insulin secretion", price: 18.25,
    oldPrice: null, unit: "per tablet", stock: 230, rx: true,
    badge: "rx", rating: 4.6, reviews: 543, emoji: "🩺",
    tags: ["glimepiride", "sulfonylurea", "insulin", "diabetes"],
  },
  {
    id: 39, category: "diabetes", name: "OneTouch Select Plus Glucometer",
    brand: "OneTouch", desc: "Blood glucose monitoring system — starter kit", price: 1250.00,
    oldPrice: 1500.00, unit: "per kit", stock: 35, rx: false,
    badge: "sale", rating: 4.9, reviews: 312, emoji: "🩺",
    tags: ["glucometer", "blood sugar", "glucose monitor", "diabetes device"],
  },
  {
    id: 40, category: "diabetes", name: "Sitagliptin 100mg Tablet",
    brand: "MSD", desc: "DPP-4 inhibitor — lowers HbA1c in type 2 DM", price: 95.00,
    oldPrice: null, unit: "per tablet", stock: 110, rx: true,
    badge: "rx", rating: 4.7, reviews: 287, emoji: "🩺",
    tags: ["sitagliptin", "DPP4", "diabetes", "januvia"],
  },

  // ─── BABY & MOTHER ───
  {
    id: 41, category: "baby", name: "Tempra Paracetamol Drops 100ml",
    brand: "Sanofi", desc: "Infant fever & pain — 100mg/mL drops", price: 145.00,
    oldPrice: 165.00, unit: "per bottle", stock: 180, rx: false,
    badge: "sale", rating: 4.9, reviews: 2456, emoji: "👶",
    tags: ["tempra", "paracetamol", "infant", "baby fever", "drops"],
  },
  {
    id: 42, category: "baby", name: "Cherifer PGM Syrup with Zinc",
    brand: "Merceder", desc: "Chlorella growth factor + vitamins for kids", price: 285.00,
    oldPrice: null, unit: "per bottle (120ml)", stock: 130, rx: false,
    badge: "bestseller", rating: 4.8, reviews: 1870, emoji: "👶",
    tags: ["cherifer", "growth", "vitamins for kids", "zinc", "syrup"],
  },
  {
    id: 43, category: "baby", name: "Ferrous Sulfate + Folic Acid",
    brand: "Pharex", desc: "Iron supplement for pregnant & breastfeeding moms", price: 9.50,
    oldPrice: null, unit: "per tablet", stock: 360, rx: false,
    badge: null, rating: 4.6, reviews: 734, emoji: "👶",
    tags: ["iron", "folic acid", "prenatal", "pregnancy"],
  },
  {
    id: 44, category: "baby", name: "Natalac Malunggay Capsule",
    brand: "Mega Lifesciences", desc: "Galactagogue — helps increase breast milk supply", price: 28.00,
    oldPrice: null, unit: "per capsule", stock: 250, rx: false,
    badge: "new", rating: 4.7, reviews: 934, emoji: "👶",
    tags: ["malunggay", "breastfeeding", "milk supply", "natalac"],
  },
  {
    id: 45, category: "baby", name: "Johnson's Baby Cologne 200ml",
    brand: "Johnson & Johnson", desc: "Gentle hypoallergenic baby cologne", price: 185.00,
    oldPrice: 210.00, unit: "per bottle", stock: 95, rx: false,
    badge: "sale", rating: 4.8, reviews: 1230, emoji: "👶",
    tags: ["baby cologne", "johnson", "hypoallergenic", "gentle"],
  },
  {
    id: 46, category: "baby", name: "Ceelin Plus Vitamin C + Zinc Syrup",
    brand: "Unilab", desc: "Immune booster for children 1–12 years — 60ml", price: 125.00,
    oldPrice: null, unit: "per bottle", stock: 200, rx: false,
    badge: "bestseller", rating: 4.9, reviews: 1987, emoji: "👶",
    tags: ["vitamin c", "zinc", "children", "ceelin", "immune"],
  },

  // ─── FIRST AID ───
  {
    id: 47, category: "firstaid", name: "Betadine Antiseptic Solution 60ml",
    brand: "Mundipharma", desc: "Povidone-iodine wound antiseptic — standard", price: 78.00,
    oldPrice: null, unit: "per bottle", stock: 220, rx: false,
    badge: "bestseller", rating: 4.9, reviews: 2100, emoji: "🩹",
    tags: ["betadine", "wound", "antiseptic", "povidone iodine"],
  },
  {
    id: 48, category: "firstaid", name: "Sterile Gauze Pads 4x4 (10pcs)",
    brand: "MedPride", desc: "Sterile non-woven gauze for wound dressing", price: 45.00,
    oldPrice: null, unit: "per pack", stock: 180, rx: false,
    badge: null, rating: 4.5, reviews: 312, emoji: "🩹",
    tags: ["gauze", "wound dressing", "sterile", "first aid"],
  },
  {
    id: 49, category: "firstaid", name: "Band-Aid Flexible Fabric 30s",
    brand: "Johnson & Johnson", desc: "Flexible adhesive bandages — assorted sizes", price: 95.00,
    oldPrice: 110.00, unit: "per box", stock: 145, rx: false,
    badge: "sale", rating: 4.8, reviews: 867, emoji: "🩹",
    tags: ["band-aid", "bandage", "adhesive", "cut"],
  },
  {
    id: 50, category: "firstaid", name: "Efficascent Oil Analgesic Rub",
    brand: "Unilab", desc: "Mentholated oil for muscle aches & stiffness", price: 55.00,
    oldPrice: null, unit: "per bottle (50ml)", stock: 200, rx: false,
    badge: null, rating: 4.7, reviews: 1430, emoji: "🩹",
    tags: ["efficascent", "muscle pain", "analgesic oil", "menthol"],
  },
  {
    id: 51, category: "firstaid", name: "Hydrogen Peroxide 3% Solution",
    brand: "Generics PH", desc: "Wound cleansing & disinfection solution", price: 32.00,
    oldPrice: null, unit: "per bottle (120ml)", stock: 170, rx: false,
    badge: null, rating: 4.4, reviews: 234, emoji: "🩹",
    tags: ["hydrogen peroxide", "wound", "disinfectant"],
  },

  // ─── ANTIBIOTICS ───
  {
    id: 52, category: "antib", name: "Amoxicillin 500mg Capsule",
    brand: "Pharex", desc: "Broad-spectrum beta-lactam antibiotic", price: 15.50,
    oldPrice: null, unit: "per capsule", stock: 280, rx: true,
    badge: "rx", rating: 4.7, reviews: 1230, emoji: "🔬",
    tags: ["amoxicillin", "antibiotic", "bacterial infection", "penicillin"],
  },
  {
    id: 53, category: "antib", name: "Azithromycin 500mg Tablet",
    brand: "Pharex", desc: "Macrolide antibiotic — Z-pack for respiratory infection", price: 48.00,
    oldPrice: null, unit: "per tablet", stock: 190, rx: true,
    badge: "rx", rating: 4.8, reviews: 876, emoji: "🔬",
    tags: ["azithromycin", "Z-pack", "respiratory", "antibiotic"],
  },
  {
    id: 54, category: "antib", name: "Co-Amoxiclav 625mg Tablet",
    brand: "Pharex", desc: "Amoxicillin + Clavulanic acid — augmented spectrum", price: 68.00,
    oldPrice: 78.00, unit: "per tablet", stock: 140, rx: true,
    badge: "rx", rating: 4.7, reviews: 654, emoji: "🔬",
    tags: ["co-amoxiclav", "augmentin", "antibiotic", "broad spectrum"],
  },
  {
    id: 55, category: "antib", name: "Ciprofloxacin 500mg Tablet",
    brand: "Generics PH", desc: "Fluoroquinolone for UTI & GI infections", price: 24.00,
    oldPrice: null, unit: "per tablet", stock: 220, rx: true,
    badge: "rx", rating: 4.6, reviews: 543, emoji: "🔬",
    tags: ["ciprofloxacin", "UTI", "quinolone", "antibiotic"],
  },
  {
    id: 56, category: "antib", name: "Doxycycline 100mg Capsule",
    brand: "Pharex", desc: "Tetracycline antibiotic for acne & leptospirosis", price: 22.50,
    oldPrice: null, unit: "per capsule", stock: 160, rx: true,
    badge: "rx", rating: 4.5, reviews: 387, emoji: "🔬",
    tags: ["doxycycline", "tetracycline", "acne", "leptospirosis"],
  },
  {
    id: 57, category: "antib", name: "Metronidazole 500mg Tablet",
    brand: "Generics PH", desc: "For bacterial vaginosis, amoeba & anaerobic infections", price: 10.50,
    oldPrice: null, unit: "per tablet", stock: 240, rx: true,
    badge: "rx", rating: 4.6, reviews: 487, emoji: "🔬",
    tags: ["metronidazole", "flagyl", "amoeba", "antibiotic"],
  },

  // ─── ADDITIONAL BESTSELLERS ───
  {
    id: 58, category: "vitamins", name: "Kirkland Vitamin C 1000mg",
    brand: "Kirkland", desc: "High-dose Vitamin C with rose hips — 500 tabs", price: 1850.00,
    oldPrice: 2100.00, unit: "per bottle (500 tabs)", stock: 55, rx: false,
    badge: "sale", rating: 4.9, reviews: 754, emoji: "🌿",
    tags: ["vitamin c", "ascorbic acid", "immune", "high dose", "bulk"],
  },
  {
    id: 59, category: "pain", name: "Tramadol HCl 50mg Capsule",
    brand: "Pharex", desc: "Opioid analgesic for moderate to severe pain", price: 28.00,
    oldPrice: null, unit: "per capsule", stock: 70, rx: true,
    badge: "rx", rating: 4.4, reviews: 198, emoji: "💊",
    tags: ["tramadol", "opioid", "severe pain", "controlled"],
  },
  {
    id: 60, category: "cold", name: "Zyrtec Cetirizine 10mg",
    brand: "Bayer", desc: "24-hr allergy + urticaria relief — non-drowsy", price: 34.00,
    oldPrice: null, unit: "per tablet", stock: 200, rx: false,
    badge: "new", rating: 4.8, reviews: 632, emoji: "🤧",
    tags: ["cetirizine", "antihistamine", "allergy", "urticaria"],
  },
  {
    id: 61, category: "skin", name: "Tretinoin Cream 0.025%",
    brand: "Pharex", desc: "Retinoid for acne, fine lines & skin renewal", price: 145.00,
    oldPrice: null, unit: "per tube (20g)", stock: 60, rx: true,
    badge: "rx", rating: 4.7, reviews: 876, emoji: "✨",
    tags: ["tretinoin", "retinoid", "acne", "anti-aging"],
  },
  {
    id: 62, category: "firstaid", name: "Disposable Surgical Mask (50pcs)",
    brand: "SafeGuard", desc: "3-ply disposable medical face mask", price: 220.00,
    oldPrice: 280.00, unit: "per box", stock: 300, rx: false,
    badge: "sale", rating: 4.6, reviews: 1230, emoji: "🩹",
    tags: ["mask", "surgical mask", "protective", "3-ply"],
  },
  {
    id: 63, category: "vitamins", name: "Collagen + Vitamin C + Zinc Capsule",
    brand: "Nature's Best", desc: "Marine collagen for skin, hair & nails", price: 48.00,
    oldPrice: null, unit: "per capsule", stock: 190, rx: false,
    badge: "new", rating: 4.7, reviews: 543, emoji: "🌿",
    tags: ["collagen", "marine collagen", "skin", "anti-aging"],
  },
  {
    id: 64, category: "baby", name: "Rexall Digital Thermometer",
    brand: "Rexall", desc: "Fast 10-second reading — oral, rectal & axillary", price: 185.00,
    oldPrice: 220.00, unit: "per unit", stock: 85, rx: false,
    badge: "sale", rating: 4.8, reviews: 412, emoji: "👶",
    tags: ["thermometer", "fever", "digital", "baby"],
  },
];

// Catalog summary for chatbot system prompt
export function getCatalogSummary() {
  const total = PRODUCTS.length;
  const byCategory = {};
  PRODUCTS.forEach(p => {
    if (!byCategory[p.category]) byCategory[p.category] = [];
    byCategory[p.category].push(`${p.name} (₱${p.price}/${p.unit}${p.rx ? ", RX required" : ""})`);
  });
  let summary = `MediCare PH carries ${total} products across these categories:\n\n`;
  for (const [cat, items] of Object.entries(byCategory)) {
    const catInfo = CATEGORIES.find(c => c.id === cat);
    summary += `**${catInfo?.name || cat}** (${items.length} products):\n`;
    items.forEach(i => { summary += `  - ${i}\n`; });
    summary += "\n";
  }
  return summary;
}
