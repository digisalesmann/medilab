// src/data/mockData.js
// Central mock data for the whole app

export const mockPharmacies = [
  {
    id: "1",
    name: "HealthPlus Pharmacy",
    license: "PHX-3289-2025",
    location: "Owerri Imo-State",
    owner: "Dr. Ada Okeke",
    verified: true,
    phone: "+2348001234567",
    reviews: 128,
    rating: 4.6,
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 },
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 },
      ],
      Respiratory: [{ name: "Ventolin Inhaler", stock: 0, price: 1200 }],
      Diabetes: [{ name: "Metformin 1000mg", stock: 25, price: 2000 }],
      Cardiovascular: [{ name: "Lisinopril 10mg", stock: 18, price: 1500 }],
      "Antihistamines / Allergy": [
        { name: "Cetirizine 10mg", stock: 40, price: 900 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 },
      ],
      "Antacids / Stomach": [{ name: "Omeprazole 20mg", stock: 50, price: 1100 }],
      Antimalarials: [
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 },
      ],
      "Vitamins & Supplements": [{ name: "Folic Acid 5mg", stock: 60, price: 700 }],
    },
  },
  {
    id: "2",
    name: "MediStore",
    license: "PHX-2210-2025",
    location: "Owerri Imo-State",
    owner: "Dr. John Ibrahim",
    verified: true,
    phone: "+2348009876543",
    reviews: 75,
    rating: 4.2,
    inventory: {
      "Neurology / Psychiatry": [
        { name: "Lorazepam 2mg", stock: 7, price: 2900 },
        { name: "Diazepam 5mg", stock: 12, price: 2200 },
      ],
      Steroids: [{ name: "Prednisone 20mg", stock: 10, price: 2100 }],
      Cardiovascular: [
        { name: "Losartan 50mg", stock: 14, price: 1700 },
        { name: "Simvastatin 40mg", stock: 9, price: 1900 },
      ],
      Antimalarials: [{ name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }],
      Respiratory: [{ name: "Salbutamol Syrup", stock: 11, price: 1300 }],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
      ],
      Antibiotics: [{ name: "Erythromycin 500mg", stock: 8, price: 2400 }],
      "Vitamins & Supplements": [{ name: "Multivitamin Complex", stock: 35, price: 1500 }],
    },
  },
  {
    id: "3",
    name: "CityMed Pharmacy",
    license: "PHX-3301-2025",
    location: "Yaba, Lagos, Nigeria",
    owner: "Dr. Tolu Adebayo",
    verified: true,
    phone: "+2347012345678",
    reviews: 102,
    rating: 4.5,
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Cetirizine", stock: 10, price: 2200 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 },
      ],
      Diabetes: [{ name: "Metformin", stock: 7, price: 1950 }],
      Cardiovascular: [{ name: "Simvastatin 40mg", stock: 9, price: 1900 }],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 },
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 },
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Levosalbutamol", stock: 28, price: 900 },
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 },
      ],
      "Antacids / Stomach": [{ name: "Omeprazole 20mg", stock: 50, price: 1100 }],
      "Vitamins & Supplements": [
        { name: "Folic Acid 5mg", stock: 60, price: 700 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 },
      ],
    },
  },
  {
    id: "4",
    name: "LifeCare Drugs",
    license: "PHX-3388-2025",
    location: "Victoria Island, Lagos, Nigeria",
    owner: "Dr. Ifeoma Umeh",
    verified: true,
    phone: "+2347034567890",
    reviews: 89,
    rating: 4.4,
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Loratadine", stock: 8, price: 1900 },
        { name: "Cetirizine", stock: 10, price: 3400 },
      ],
      "Vitamins & Supplements": [
        { name: "Vitamin C", stock: 21, price: 2800 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 },
      ],
      Cardiovascular: [
        { name: "Simvastatin 40mg", stock: 9, price: 1900 },
        { name: "Lisinopril 10mg", stock: 18, price: 1500 },
      ],
      Antimalarials: [{ name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Ventolin Inhaler", stock: 0, price: 1200 },
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 },
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 },
      ],
      Diabetes: [{ name: "Metformin 1000mg", stock: 25, price: 2000 }],
    },
  },
  {
    id: "5",
    name: "GreenMed Pharmacy",
    license: "PHX-3402-2025",
    location: "Maitama, Abuja, Nigeria",
    owner: "Dr. Musa Danjuma",
    verified: false,
    phone: "+2347067890123",
    reviews: 6,
    rating: 2.3,
    inventory: [],
  },
  {
    id: "6",
    name: "PrimeCare Pharmacy",
    license: "PHX-3415-2025",
    location: "Wuse Zone 2, Abuja, Nigeria",
    owner: "Dr. Grace Nwankwo",
    verified: true,
    phone: "+2347087654321",
    reviews: 116,
    rating: 4.7,
    inventory: {
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
      ],
      "Vitamins & Supplements": [{ name: "Multivitamin Complex", stock: 35, price: 1500 }],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 },
      ],
      Respiratory: [{ name: "Ventolin Inhaler", stock: 10, price: 1200 }],
    },
  },
  {
    id: "7",
    name: "Silverline Pharmacy",
    license: "PHX-3492-2025",
    location: "Ikeja, Lagos, Nigeria",
    owner: "Dr. Emeka Obi",
    verified: true,
    phone: "+2347011122233",
    reviews: 59,
    rating: 4.1,
    inventory: {
      Antibiotics: [{ name: "Amoxicillin 250mg", stock: 6, price: 3200 }],
      "Neurology / Psychiatry": [{ name: "Nitrazepam 5mg", stock: 6, price: 2200 }],
      Cardiovascular: [
        { name: "Clopidogrel 75mg", stock: 14, price: 2700 },
        { name: "Atorvastatin 20mg", stock: 18, price: 2100 },
        { name: "Hydralazine 25mg", stock: 5, price: 2400 },
      ],
      "Antacids / Stomach": [
        { name: "Cimetidine 200mg", stock: 7, price: 1300 },
        { name: "Domperidone 10mg", stock: 12, price: 1400 },
      ],
      "Anthelmintics / Antiparasitics": [{ name: "Albendazole 400mg", stock: 16, price: 1500 }],
      "Men's Health": [{ name: "Sildenafil 50mg", stock: 10, price: 2900 }],
      "Dermatological / Skin Care": [{ name: "Ketoconazole Shampoo", stock: 9, price: 3200 }],
      "Vitamins & Supplements": [{ name: "Vitamin B-Complex Injection", stock: 3, price: 3500 }],
    },
  },
  {
    id: "8",
    name: "Wellcare Pharmacy",
    license: "PHX-3524-2025",
    location: "Asaba, Delta State, Nigeria",
    owner: "Dr. Kemi Bassey",
    verified: true,
    phone: "+2347098765432",
    reviews: 71,
    rating: 4.3,
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
      ],
      Antihistamines: [
        { name: "Cetirizine", stock: 10, price: 2360 },
        { name: "Loratadine", stock: 8, price: 6700 },
      ],
      PainRelief: [
        { name: "Ibuprofen", stock: 18, price: 4600 },
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
      ],
      Antimalarials: [],
      Diabetes: [{ name: "Metformin", stock: 7, price: 1150 }],
      Cholesterol: [{ name: "Simvastatin 40mg", stock: 9, price: 1900 }],
      Respiratory: [{ name: "Salbutamol Syrup", stock: 11, price: 1300 }],
      Supplements: [{ name: "Multivitamin Complex", stock: 35, price: 1500 }],
    },
  },
  {
    id: "9",
    name: "MedEase",
    license: "PHX-3570-2025",
    location: "Enugu, Enugu State, Nigeria",
    owner: "Dr. Chuka Eze",
    verified: false,
    phone: "+2347044433221",
    reviews: 8,
    rating: 1.7,
    inventory: [],
  },
  {
    id: "10",
    name: "Access Pharma",
    license: "PHX-3613-2025",
    location: "Abeokuta, Ogun State, Nigeria",
    owner: "Dr. Aisha Bello",
    verified: true,
    phone: "+2347055556677",
    reviews: 47,
    rating: 4.0,
    inventory: {
      Antacids: [
        { name: "Antacid", stock: 6, price: 2870 },
        { name: "Ranitidine 150mg", stock: 9, price: 1200 },
      ],
      Hormonal: [{ name: "Insulin Glargine", stock: 4, price: 5500 }],
      BloodPressure: [{ name: "Amlodipine 10mg", stock: 16, price: 1400 }],
      SkinCare: [
        { name: "Clotrimazole Cream", stock: 13, price: 1600 },
        { name: "Betamethasone Cream", stock: 10, price: 1700 },
      ],
      Injections: [{ name: "Gentamicin Injection", stock: 6, price: 2500 }],
      Electrolytes: [
        { name: "Magnesium Sulfate", stock: 5, price: 2000 },
        { name: "Zinc Sulphate Syrup", stock: 28, price: 1000 },
        { name: "ORS Sachet", stock: 100, price: 300 },
      ],
      Cough: [{ name: "Cough Syrup (Expectorant)", stock: 21, price: 1800 }],
    },
  },
  {
    id: "11",
    name: "VitalMed",
    license: "PHX-3688-2025",
    location: "Port Harcourt, Rivers, Nigeria",
    owner: "Dr. Oluchi Nnaji",
    verified: true,
    phone: "+2347061239876",
    reviews: 95,
    rating: 4.6,
    inventory: {
      Antibiotics: [
        { name: "Doxycycline 100mg", stock: 11, price: 1900 },
        { name: "Metronidazole 400mg", stock: 20, price: 1100 },
      ],
      Antihistamines: [{ name: "Chlorphenamine", stock: 4, price: 7650 }],
      Antifungals: [
        { name: "Fluconazole 150mg", stock: 7, price: 2100 },
        { name: "Miconazole Oral Gel", stock: 9, price: 2300 },
      ],
      BloodPressure: [{ name: "Nifedipine 20mg", stock: 18, price: 1600 }],
      BloodThinners: [{ name: "Warfarin 5mg", stock: 5, price: 2800 }],
      Hormonal: [{ name: "Levothyroxine 50mcg", stock: 13, price: 2000 }],
      Vitamins: [
        { name: "Multivitamins", stock: 15, price: 5500 },
        { name: "Calcium + Vitamin D3", stock: 30, price: 1700 },
      ],
      Minerals: [{ name: "Iron Supplement (Ferrous Sulfate)", stock: 25, price: 1000 }],
      Antacids: [{ name: "Antacid Suspension", stock: 22, price: 900 }],
    },
  },
  {
    id: "12",
    name: "CareFirst Pharmacy",
    license: "PHX-3715-2025",
    location: "Owerri Imo-State, Nigeria",
    owner: "Dr. Henry Ezeh",
    verified: true,
    phone: "+2347033338888",
    reviews: 82,
    rating: 4.2,
    inventory: {
      Antibiotics: [
        { name: "Penicillin V 250mg", stock: 6, price: 2400 },
        { name: "Chloroquine Phosphate", stock: 12, price: 1800 },
      ],
      PainRelief: [
        { name: "Paracetamol", stock: 20, price: 3200 },
        { name: "Cough Suppressant (Dextromethorphan)", stock: 14, price: 1500 },
        { name: "Codeine Phosphate Syrup", stock: 8, price: 2500 },
      ],
      Vitamins: [
        { name: "Vitamin C Tablets", stock: 50, price: 700 },
        { name: "Neurovite Forte", stock: 19, price: 1600 },
      ],
      Digestive: [{ name: "Loperamide 2mg", stock: 40, price: 800 }],
      Neurological: [
        { name: "Sodium Valproate 200mg", stock: 9, price: 2600 },
        { name: "Melatonin 3mg", stock: 10, price: 2700 },
      ],
      Hormonal: [{ name: "Oral Contraceptive Pill", stock: 15, price: 1900 }],
    },
  },
];

// --- keep your other exports here (products, articles, etc.) ---

// 💊 Centralized alternative medicine suggestions
export const alternativeSuggestions = {
  "Ventolin Inhaler": ["Salbutamol", "Levosalbutamol"],
  "Paracetamol": ["Acetaminophen", "Panadol"],
  "Ibuprofen": ["Diclofenac", "Naproxen"],
  "Cough Syrup": ["Expectorant", "Lozenges"],

  "Amoxicillin 500mg": ["Augmentin", "Ampicillin"],
  "Ciprofloxacin 500mg": ["Levofloxacin", "Ofloxacin"],
  "Azithromycin 250mg": ["Clarithromycin", "Erythromycin"],
  "Augmentin 625mg": ["Amoxicillin + Clavulanic Acid"],

  "Cetirizine 10mg": ["Loratadine", "Fexofenadine"],
  "Cetirizine": ["Loratadine", "Fexofenadine"],
  "Chlorpheniramine Maleate": ["Diphenhydramine", "Loratadine"],
  "Loratadine": ["Cetirizine", "Fexofenadine"],

  "Omeprazole 20mg": ["Pantoprazole", "Esomeprazole"],
  "Antacid": ["Ranitidine 150mg", "Omeprazole 20mg"],

  "Artemether/Lumefantrine": ["Coartem", "Dihydroartemisinin/Piperaquine"],
  "Coartem 80/480mg": ["Artemether/Lumefantrine", "Fansidar"],

  "Folic Acid 5mg": ["Vitamin B-Complex", "Multivitamins"],
  "Multivitamin Complex": ["Vitamin C", "Vitamin D3 + Calcium"],

  "Metformin 1000mg": ["Glimepiride", "Pioglitazone"],
  "Metformin": ["Glimepiride", "Pioglitazone"],

  "Lisinopril 10mg": ["Enalapril", "Losartan"],
  "Losartan 50mg": ["Valsartan", "Telmisartan"],

  "Simvastatin 40mg": ["Atorvastatin", "Rosuvastatin"],
  "Atorvastatin 20mg": ["Rosuvastatin", "Simvastatin"],

  "Diclofenac Sodium 100mg": ["Ibuprofen", "Naproxen"],

  "Prednisone 20mg": ["Hydrocortisone", "Methylprednisolone"],

  "Erythromycin 500mg": ["Azithromycin", "Clarithromycin"],

  "Hydroxychloroquine 200mg": ["Chloroquine", "Artemether/Lumefantrine"],
  "Salbutamol Syrup": ["Ventolin Inhaler", "Levosalbutamol"],

  "Lorazepam 2mg": ["Diazepam", "Clonazepam"],
  "Diazepam 5mg": ["Lorazepam", "Clonazepam"],
  "Nitrazepam 5mg": ["Temazepam", "Clonazepam"],

  "Clopidogrel 75mg": ["Aspirin", "Prasugrel"],

  "Ketoconazole Shampoo": ["Clotrimazole Cream", "Miconazole"],

  "Sildenafil 50mg": ["Tadalafil", "Vardenafil"],

  "Magnesium Sulfate": ["Calcium Gluconate", "Zinc Sulphate"],
  "ORS Sachet": ["Zinc Sulphate Syrup", "Electrolyte Mix"],

  "Gentamicin Injection": ["Ceftriaxone", "Amikacin"],

  "Insulin Glargine": ["Insulin Aspart", "Insulin Lispro"],

  "Warfarin 5mg": ["Apixaban", "Rivaroxaban"],

  "Levothyroxine 50mcg": ["Liothyronine", "Thyroxine"],

  "Vitamin C": ["Ascorbic Acid", "Multivitamin Complex"],
  "Neurovite Forte": ["Vitamin B12", "Vitamin B-Complex"],

  "Sodium Valproate 200mg": ["Carbamazepine", "Lamotrigine"],
  "Melatonin 3mg": ["Clonazepam", "Diazepam"],

  "Oral Contraceptive Pill": ["Emergency Contraceptive", "Intrauterine Device"],

  "Fluconazole 150mg": ["Itraconazole", "Ketoconazole"],
  "Miconazole Oral Gel": ["Clotrimazole", "Nystatin"],

  // Fallback trigger
  "Consult Pharmacist": ["Consult Pharmacist"],
};

// Home page / sections data
// ---------- Categories (with slugs + keywords) ----------
export const categories = [
  {
    label: "Must haves",
    slug: "must-haves",
    image: "/images/must.webp",
    bgGradient: "bg-gradient-to-b from-yellow-100 to-yellow-50",
    keywords: ["must have", "everyday", "daily", "essential", "essentials"],
  },
  {
    label: "Sports nutrition",
    slug: "sports-nutrition",
    image: "/images/sports.webp",
    bgGradient: "bg-gradient-to-b from-blue-100 to-blue-50",
    keywords: ["sports", "nutrition", "protein", "whey", "bcaa", "creatine", "preworkout"],
  },
  {
    label: "Vitamins & supplements",
    slug: "vitamins-and-supplements",
    image: "/images/vit.webp",
    bgGradient: "bg-gradient-to-b from-pink-100 to-pink-50",
    keywords: ["vitamin", "supplement", "multivitamin", "omega", "d3", "b-complex", "zinc"],
  },
  {
    label: "Skin care",
    slug: "skin-care",
    image: "/images/skin.webp",
    bgGradient: "bg-gradient-to-b from-purple-100 to-purple-50",
    keywords: ["skin", "face", "cleanser", "moisturizer", "serum", "acne", "sunscreen"],
  },
  {
    label: "Diabetes essentials",
    slug: "diabetes-essentials",
    image: "/images/dis.webp",
    bgGradient: "bg-gradient-to-b from-green-100 to-green-50",
    keywords: ["diabetes", "glucose", "glucometer", "test strip", "insulin"],
  },
  {
    label: "Heart health",
    slug: "heart-health",
    image: "/images/heartt.webp",
    bgGradient: "bg-gradient-to-b from-red-100 to-red-50",
    keywords: ["heart", "cardio", "cholesterol", "omega", "bp", "hypertension"],
  },
  {
    label: "Ayurvedic care",
    slug: "ayurvedic-care",
    image: "/images/ay.webp",
    bgGradient: "bg-gradient-to-b from-amber-100 to-amber-50",
    keywords: ["ayurveda", "herbal", "chyawanprash", "kadha", "asava", "lozenge"],
  },
];

// ---------- Brands (with slugs) ----------
export const brands = [
  { name: "Evion", slug: "evion", img: "/images/evion.png", link: "#", bg: "bg-green-50" },
  { name: "Nasoclear", slug: "nasoclear", img: "/images/nasoclear.png", link: "#", bg: "bg-blue-50" },
  { name: "Pharmeasy", slug: "pharmeasy", img: "/images/Pharmeasy.jpg", link: "#", bg: "bg-yellow-50" },
  { name: "Diatall", slug: "diatall", img: "/images/Diataal.png", link: "#", bg: "bg-yellow-100" },
  { name: "Dulcoflex", slug: "dulcoflex", img: "/images/Dulcoflex.png", link: "#", bg: "bg-green-100" },
  { name: "Neurobion", slug: "neurobion", img: "/images/Neurobionn.png", link: "#", bg: "bg-red-50" },
];

// mockData.js

// --- Lab tests (expanded, dynamic-friendly) ---
export const labTests = [
  {
    id: "lt-healthy-2025",
    slug: "healthy-2025-full-body-checkup",
    discount: "60% OFF",
    title: "Healthy 2025 Full Body Checkup",
    desc: "Comprehensive preventive screening for overall health.",
    oldPrice: 3599,
    newPrice: 1449,
    image: "/images/body.png",
    images: ["/images/health.png", "/images/healthh.png", "/images/healthhh.png"],
    bg: "bg-blue-50",
    link: "/lab-test/healthy-2025-full-body-checkup",

    // dynamic profile fields
    rating: 4.6,
    reviews: 276,
    sampleType: "Blood + Urine",
    fastingRequired: "8–10 hours (water allowed)",
    homeSample: true,
    reportTime: "24–36 hrs",
    parametersCount: 82,
    parameters: [
      { group: "Complete Blood Count (CBC)", items: ["Hemoglobin", "WBC", "Platelets"] },
      { group: "Liver Function (LFT)", items: ["SGPT", "SGOT", "Bilirubin (Total/Direct)"] },
      { group: "Kidney Function (KFT)", items: ["Creatinine", "Urea", "Uric Acid"] },
      { group: "Lipid Profile", items: ["Total Cholesterol", "HDL", "LDL", "Triglycerides"] },
      { group: "Diabetes", items: ["Fasting Glucose", "HbA1c"] },
      { group: "Thyroid", items: ["TSH", "T3", "T4"] },
    ],
    preparation: [
      "Overnight fasting (8–10 hrs) advised.",
      "Avoid alcohol for 24 hrs before the test.",
      "Inform the phlebotomist about ongoing medication.",
    ],
    whoIsItFor: ["Annual preventive health", "Desk workers", "Age 25+"],
    partnerLabs: ["MediLab Diagnostics", "PrimePath Labs", "Accurate Path"],
    faqs: [
      { q: "Can I drink water during fasting?", a: "Yes, plain water is allowed unless advised otherwise." },
      { q: "Is a home sample available?", a: "Yes. Trained phlebotomists collect samples at your location." },
      { q: "When will I get my report?", a: "Within 24–36 hours of sample collection in most cities." },
    ],
    articles: [
      { title: "How to prepare for a full body checkup", link: "/articles/full-body-checkup-prep", img: "/images/healthcare.webp" },
      { title: "Decoding your blood report: basics", link: "/articles/blood-report-basics", img: "/images/diab.png" },
    ],
  },
  {
    id: "lt-diabetes-care",
    slug: "diabetes-care",
    discount: "43% OFF",
    title: "Diabetes Care",
    desc: "Monitoring & screening bundle for diabetes control.",
    oldPrice: 1399,
    newPrice: 799,
    image: "/images/care.png",
    images: ["/images/diet.png", "/images/diett.png", "/images/diettt.png"],
    bg: "bg-amber-50",
    link: "/lab-test/diabetes-care",

    rating: 4.4,
    reviews: 188,
    sampleType: "Blood",
    fastingRequired: "8–10 hours (for FBS)",
    homeSample: true,
    reportTime: "12–24 hrs",
    parametersCount: 7,
    parameters: [
      { group: "Diabetes", items: ["Fasting Glucose (FBS)", "Post‑prandial Glucose (PPBS)", "HbA1c"] },
      { group: "Kidney", items: ["Creatinine", "Urine Microalbumin"] },
      { group: "Lipid (optional add‑on)", items: ["LDL", "HDL", "Triglycerides"] },
    ],
    preparation: ["Overnight fasting required.", "Carry previous reports for better comparison."],
    whoIsItFor: ["Known diabetics", "Prediabetes", "Family history"],
    partnerLabs: ["MediLab Diagnostics", "CarePath Labs"],
    faqs: [
      { q: "Is fasting mandatory?", a: "For FBS yes; HbA1c alone does not require fasting." },
      { q: "Can I continue medicines?", a: "Take medicines as prescribed unless doctor asks otherwise." },
    ],
    articles: [{ title: "HbA1c vs FBS: what’s the difference?", link: "/articles/hba1c-vs-fbs", img: "/images/hyper.png" }],
  },
  {
    id: "lt-basic-health",
    slug: "basic-health-checkup",
    discount: "53% OFF",
    title: "Basic Health Checkup",
    desc: "Assesses 47 essential parameters to gauge baseline health.",
    oldPrice: 2249,
    newPrice: 1049,
    image: "/images/bsic.png",
    images: ["/images/basic.png", "/images/basicc.png", "/images/basiccc.png"],
    bg: "bg-blue-50",
    link: "/lab-test/basic-health-checkup",

    rating: 4.5,
    reviews: 143,
    sampleType: "Blood + Urine",
    fastingRequired: "8 hrs",
    homeSample: true,
    reportTime: "24 hrs",
    parametersCount: 47,
    parameters: [
      { group: "CBC", items: ["Hemoglobin", "RBC Count", "PCV", "MCV", "MCHC"] },
      { group: "LFT", items: ["SGPT", "SGOT", "ALP", "Albumin"] },
      { group: "KFT", items: ["Creatinine", "Urea", "Sodium", "Potassium"] },
    ],
    preparation: ["Fasting recommended.", "Avoid strenuous exercise same morning."],
    whoIsItFor: ["New employees", "Pre‑insurance", "General screening"],
    partnerLabs: ["PrimePath Labs"],
    faqs: [{ q: "Is urine sample required?", a: "Yes, a spot urine sample may be collected." }],
    articles: [{ title: "What does a CBC tell you?", link: "/articles/cbc-basics", img: "/images/enterogermina.png" }],
  },
  {
    id: "lt-aarogyam",
    slug: "aarogyam-full-body-checkup-with-vitamins",
    discount: "46% OFF",
    title: "Aarogyam Full Body Checkup with Vitamins",
    desc: "Advanced panel with thyroid, vitamins, and vital minerals.",
    oldPrice: 4599,
    newPrice: 2499,
    image: "/images/checkup.png",
    images: ["/images/vit.png", "/images/vitt.png", "/images/vittt.png"],
    bg: "bg-amber-50",
    link: "/lab-test/aarogyam-full-body-checkup-with-vitamins",

    rating: 4.7,
    reviews: 92,
    sampleType: "Blood",
    fastingRequired: "10–12 hrs",
    homeSample: true,
    reportTime: "36–48 hrs",
    parametersCount: 95,
    parameters: [
      { group: "CBC + ESR", items: ["Hemoglobin", "ESR"] },
      { group: "Thyroid", items: ["TSH", "T3", "T4"] },
      { group: "Vitamins", items: ["Vitamin D (25‑OH)", "Vitamin B12"] },
      { group: "Iron Studies", items: ["Ferritin", "TIBC"] },
    ],
    preparation: ["Fast overnight.", "Stop biotin 48 hrs before test if possible."],
    whoIsItFor: ["Exhaustion & hair fall", "Thyroid symptoms", "Annual advanced screen"],
    partnerLabs: ["Accurate Path", "HealthFirst Labs"],
    faqs: [{ q: "Why avoid biotin?", a: "Biotin can interfere with some immunoassays, giving spurious values." }],
    articles: [{ title: "Vitamin D: why it matters", link: "/articles/vitamin-d-basics", img: "/images/depura.png" }],
  },
];


export const topDoctors = [
  {
    id: "d-aisha-bello",
    name: "Dr. Aisha Bello",
    specialty: "Cardiologist",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 132,
    fee: 15000, // NGN
    experienceYears: 12,
    hospital: "Lagos Heart Centre",
    languages: ["English", "Yoruba", "Hausa"],
    img: "/images/aisha.png",
    images: ["/images/aisha.png", "/images/aisha.png", "/images/aisha.png"],
    about:
      "Consultant Cardiologist with special interest in preventive cardiology, hypertension, and heart failure management.",
    services: [
      "Cardiac consultation",
      "ECG & Echocardiography review",
      "Hypertension management",
      "Cholesterol & lifestyle counseling",
    ],
    education: [
      { degree: "MBBS", school: "University of Lagos", year: 2010 },
      { degree: "FWACP (Cardiology)", school: "West African College of Physicians", year: 2016 },
    ],
    awards: ["Best Young Cardiologist (2018)", "Community Heart Health Award (2021)"],
    availability: {
      days: ["Mon", "Wed", "Fri"],
      slots: ["09:00", "10:30", "12:00", "15:30"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 700 100 2222", email: "a.bello@medilab.example" },
    geo: { lat: 6.5244, lng: 3.3792 },
    bg: "bg-blue-50",
  },

  {
    id: "d-john-okeke",
    name: "Dr. John Okeke",
    specialty: "Pediatrician",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviews: 98,
    fee: 12000,
    experienceYears: 10,
    hospital: "Abuja Children’s Hospital",
    languages: ["English", "Igbo"],
    img: "/images/john.png",
    images: ["/images/john.png", "/images/john.png", "/images/john.png"],
    about:
      "Friendly pediatrician focused on child wellness, immunization schedules, and common childhood conditions.",
    services: [
      "Newborn & child wellness checks",
      "Immunization counseling",
      "Nutrition guidance",
      "Fever, cough & common illnesses",
    ],
    education: [
      { degree: "MBBS", school: "University of Nigeria, Nsukka", year: 2012 },
      { degree: "FMC Paediatrics", school: "National Postgraduate Medical College", year: 2018 },
    ],
    awards: ["Outstanding Pediatric Care Award (2020)"],
    availability: {
      days: ["Tue", "Thu", "Sat"],
      slots: ["08:30", "10:00", "11:30", "14:00"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 700 333 4444", email: "j.okeke@medilab.example" },
    geo: { lat: 9.0579, lng: 7.4951 },
    bg: "bg-green-50",
  },

  {
    id: "d-mary-uduak",
    name: "Dr. Mary Uduak",
    specialty: "Dermatologist",
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviews: 110,
    fee: 13000,
    experienceYears: 11,
    hospital: "Skin & Aesthetics Clinic PH",
    languages: ["English", "Ibibio"],
    img: "/images/mary.png",
    images: ["/images/mary.png", "/images/mary.png", "/images/mary.png"],
    about:
      "Dermatologist with expertise in acne, eczema, pigmentation, and cosmetic dermatology procedures.",
    services: [
      "Acne & eczema treatment",
      "Skin allergy testing",
      "Chemical peels",
      "Hyperpigmentation therapy",
    ],
    education: [
      { degree: "MBBS", school: "University of Uyo", year: 2011 },
      { degree: "FWACP (Dermatology)", school: "WACP", year: 2017 },
    ],
    awards: ["Dermatology Service Excellence (2019)"],
    availability: {
      days: ["Mon", "Thu", "Fri"],
      slots: ["09:30", "11:00", "12:30", "16:00"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 701 222 7788", email: "m.uduak@medilab.example" },
    geo: { lat: 4.8156, lng: 7.0498 },
    bg: "bg-yellow-50",
  },

  {
    id: "d-ibrahim-sule",
    name: "Dr. Ibrahim Sule",
    specialty: "Neurologist",
    location: "Kano, Nigeria",
    rating: 4.9,
    reviews: 85,
    fee: 17000,
    experienceYears: 13,
    hospital: "Kano Neuro Centre",
    languages: ["English", "Hausa"],
    img: "/images/ibrahim.png",
    images: ["/images/ibrahim.png", "/images/ibrahim.png", "/images/ibrahim.png"],
    about:
      "Neurologist specializing in stroke care, headaches, seizures, and neurodegenerative disorders.",
    services: [
      "Stroke risk assessment",
      "Headache & migraine management",
      "Seizure disorders",
      "Movement disorders",
    ],
    education: [
      { degree: "MBBS", school: "Bayero University Kano", year: 2009 },
      { degree: "FWACP (Neurology)", school: "WACP", year: 2016 },
    ],
    awards: ["NeuroCare Leadership Award (2022)"],
    availability: {
      days: ["Wed", "Fri", "Sat"],
      slots: ["10:00", "11:30", "13:00", "15:00"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 809 123 9999", email: "i.sule@medilab.example" },
    geo: { lat: 12.0022, lng: 8.5920 },
    bg: "bg-indigo-50",
  },

  {
    id: "d-fatima-oladipo",
    name: "Dr. Fatima Oladipo",
    specialty: "Endocrinologist",
    location: "Ibadan, Nigeria",
    rating: 4.8,
    reviews: 121,
    fee: 16000,
    experienceYears: 12,
    hospital: "Endocrine & Diabetes Centre",
    languages: ["English", "Yoruba"],
    img: "/images/fatima.png",
    images: ["/images/fatima.png", "/images/fatima.png", "/images/fatima.png"],
    about:
      "Endocrinologist focusing on diabetes, thyroid disorders, and metabolic syndrome management.",
    services: [
      "Diabetes care plans",
      "Thyroid evaluation",
      "Obesity & metabolism counseling",
      "Hormonal assessments",
    ],
    education: [
      { degree: "MBBS", school: "University of Ibadan", year: 2011 },
      { degree: "FMC Endocrinology", school: "NPMCN", year: 2018 },
    ],
    awards: ["Diabetes Care Impact Award (2020)"],
    availability: {
      days: ["Tue", "Thu", "Sat"],
      slots: ["09:00", "10:30", "12:00", "14:30"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 816 666 2233", email: "f.oladipo@medilab.example" },
    geo: { lat: 7.3775, lng: 3.9470 },
    bg: "bg-pink-50",
  },

  {
    id: "d-emeka-uche",
    name: "Dr. Emeka Uche",
    specialty: "Orthopedic Surgeon",
    location: "Enugu, Nigeria",
    rating: 4.7,
    reviews: 102,
    fee: 18000,
    experienceYears: 14,
    hospital: "Eastern OrthoCare",
    languages: ["English", "Igbo"],
    img: "/images/emeka.png",
    images: ["/images/emeka.png", "/images/emeka.png", "/images/emeka.png"],
    about:
      "Orthopedic surgeon handling fractures, sports injuries, joint problems, and minimally invasive procedures.",
    services: [
      "Fracture & trauma care",
      "Sports injury management",
      "Knee & hip pain",
      "Arthroscopic procedures",
    ],
    education: [
      { degree: "MBBS", school: "UNN", year: 2008 },
      { degree: "FMC Orthopedics", school: "NPMCN", year: 2016 },
    ],
    awards: ["Ortho Innovation Award (2021)"],
    availability: {
      days: ["Mon", "Wed", "Fri"],
      slots: ["08:30", "10:00", "12:00", "15:00"],
      online: false,
      inPerson: true,
    },
    contact: { phone: "+234 705 111 9090", email: "e.uche@medilab.example" },
    geo: { lat: 6.459964, lng: 7.548949 },
    bg: "bg-orange-50",
  },

  {
    id: "d-grace-nwosu",
    name: "Dr. Grace Nwosu",
    specialty: "General Practitioner",
    location: "Benin City, Nigeria",
    rating: 4.9,
    reviews: 143,
    fee: 8000,
    experienceYears: 9,
    hospital: "CityCare Clinic",
    languages: ["English"],
    img: "/images/grace.png",
    images: ["/images/grace.png", "/images/grace.png", "/images/grace.png"],
    about:
      "GP providing holistic primary care, routine checkups, and chronic disease follow-up for families.",
    services: [
      "General consultation",
      "Chronic disease follow-up",
      "Minor procedures",
      "Preventive health checks",
    ],
    education: [
      { degree: "MBBS", school: "University of Benin", year: 2014 },
      { degree: "Family Medicine Residency", school: "UBTH", year: 2019 },
    ],
    awards: ["Community Family Care Award (2022)"],
    availability: {
      days: ["Mon", "Tue", "Thu", "Sat"],
      slots: ["09:00", "10:15", "11:30", "13:30", "16:00"],
      online: true,
      inPerson: true,
    },
    contact: { phone: "+234 809 555 7788", email: "g.nwosu@medilab.example" },
    geo: { lat: 6.3350, lng: 5.6037 },
    bg: "bg-purple-50",
  },

  // (Optional) A few more doctors to flesh out /doctors page
  {
    id: "d-samuel-adeoye",
    name: "Dr. Samuel Adeoye",
    specialty: "ENT Surgeon",
    location: "Ilorin, Nigeria",
    rating: 4.6,
    reviews: 73,
    fee: 14000,
    experienceYears: 11,
    hospital: "Ilorin ENT Institute",
    languages: ["English", "Yoruba"],
    img: "/images/samuel.png",
    images: ["/images/samuel.png", "/images/samuel.png", "/images/samuel.png"],
    about: "ENT surgeon with focus on sinus disease, ear infections, and voice disorders.",
    services: ["Sinusitis care", "Ear microsuction", "Allergy & voice clinics"],
    education: [
      { degree: "MBBS", school: "University of Ilorin", year: 2011 },
      { degree: "FMCS (ENT)", school: "NPMCN", year: 2017 },
    ],
    awards: [],
    availability: { days: ["Tue", "Fri"], slots: ["10:00", "12:00", "14:00"], online: false, inPerson: true },
    contact: { phone: "+234 701 123 4444", email: "s.adeoye@medilab.example" },
    geo: { lat: 8.4966, lng: 4.5421 },
    bg: "bg-blue-50",
  },
  {
    id: "d-ngozi-okafor",
    name: "Dr. Ngozi Okafor",
    specialty: "Obstetrician/Gynecologist",
    location: "Awka, Nigeria",
    rating: 4.8,
    reviews: 92,
    fee: 15000,
    experienceYears: 12,
    hospital: "Women’s Health Centre",
    languages: ["English", "Igbo"],
    img: "/images/ngozi.jpeg",
    images: ["/images/ngozi.jpeg", "/images/ngozi.jpeg", "/images/ngozi.jpeg"],
    about:
      "OB/GYN providing antenatal care, fertility counseling, and minimally invasive gynecological procedures.",
    services: ["Antenatal & postnatal", "Fertility counseling", "Gynecologic scans"],
    education: [
      { degree: "MBBS", school: "UNIZIK", year: 2010 },
      { degree: "FMCOG", school: "NPMCN", year: 2017 },
    ],
    awards: ["Maternal Care Excellence (2021)"],
    availability: { days: ["Mon", "Wed", "Sat"], slots: ["09:00", "11:00", "13:00"], online: true, inPerson: true },
    contact: { phone: "+234 815 222 8899", email: "n.okafor@medilab.example" },
    geo: { lat: 6.2100, lng: 7.0741 },
    bg: "bg-rose-50",
  },
];

// ---------- Products (Home) ----------
export const products = [
  {
    title: "Shelcal Total Supplement With Your Daily Nutrition Vanilla Flavour Box 400 Gm",
    image: "/images/shell.png",
    images: ["/images/shell.png", "/images/she.png", "/images/shee.png"],
    mrp: 820,
    price: 713.4,
    discount: 13,
    brand: "Shelcal",
    rating: 4.4,
    reviews: 132,
    highlights: ["Supports bone health", "With Vitamin D3", "Once daily"],
    bgGradient: "bg-gradient-to-b from-yellow-100 to-white",
    description:
      "Shelcal Total is a calcium and Vitamin D3 supplement designed to support bone mineral density and muscle function. Suitable for adults with increased calcium needs.",
    specs: [
      "Form: Film-coated tablets",
      "Actives: Calcium + Vitamin D3",
      "Suggested use: Once daily after meals",
      "Allergen info: Lactose-free, gluten-free",
      "Manufacturer: Shelcal Laboratories"
    ],
    reviewsList: [
      { name: "Amaka", rating: 5, comment: "Knee pains reduced after 3 weeks.", date: "2025-04-11" },
      { name: "Chinedu", rating: 4, comment: "Easy to swallow, fair price.", date: "2025-03-22" }
    ],
    ratingBreakdown: { 5: 58, 4: 28, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "Calcium & Vitamin D: Daily Needs", image: "/images/article-calcium.png", link: "/articles/calcium-vitd" },
      { title: "Bone Health After 30: What Changes?", image: "/images/article-bone.png", link: "/articles/bone-health-30" }
    ]
  },
  {
    title: "Kofol Rub – for cough, cold, blocked nose, headache, body ache, muscle stiffness, and breathing difficulty.",
    image: "/images/koff.png",
    images: ["/images/koff.png", "/images/kof.png", "/images/koof.png"],
    mrp: 50,
    price: 43.5,
    discount: 13,
    brand: "Kofol",
    rating: 4.2,
    reviews: 88,
    highlights: ["Soothes sore throat", "Herbal blend", "Sugar-free"],
    bgGradient: "bg-gradient-to-b from-green-100 to-white",
    description:
      "Kofol lozenges combine herbal extracts to soothe throat irritation and dryness without added sugar. Ideal for travelers and public speakers.",
    specs: [
      "Form: Sugar-free lozenges",
      "Flavour: Mint-herbal",
      "Pack size: 60 lozenges",
      "Usage: Dissolve slowly in mouth",
      "Suitable for diabetics: Yes (consult physician)"
    ],
    reviewsList: [
      { name: "Uduak", rating: 4, comment: "Fast relief and gentle taste.", date: "2025-05-03" },
      { name: "Seyi", rating: 5, comment: "Always in my bag. Works!", date: "2025-04-02" }
    ],
    ratingBreakdown: { 5: 46, 4: 35, 3: 12, 2: 5, 1: 2 },
    articles: [
      { title: "Sore Throat: When to See a Doctor", image: "/images/article-throat.png", link: "/articles/sore-throat-guide" },
      { title: "Sugar-Free Remedies: Pros & Cons", image: "/images/article-sugarfree.png", link: "/articles/sugarfree-remedies" }
    ]
  },
  {
    title: "Tedibar Atogla Baby Lotion 200ml",
    image: "/images/tedd.png",
    images: ["/images/tedd.png", "/images/teed.png", "/images/teddd.png"],
    mrp: 635,
    price: 520.7,
    discount: 18,
    brand: "Tedibar",
    rating: 4.6,
    reviews: 210,
    highlights: ["Gentle on skin", "Dermatologically tested", "Paraben-free"],
    bgGradient: "bg-gradient-to-b from-pink-100 to-white",
    description:
      "A lightweight, dermatologically tested lotion crafted for delicate infant skin. Locks in moisture and supports the skin barrier without harsh additives.",
    specs: [
      "Volume: 200 ml",
      "Free from: Parabens, phthalates",
      "Dermatologist tested: Yes",
      "Texture: Fast-absorbing, non-greasy",
      "Fragrance: Mild baby-safe scent"
    ],
    reviewsList: [
      { name: "Ijeoma", rating: 5, comment: "Cleared dry patches in a week.", date: "2025-02-18" },
      { name: "Bisi", rating: 4, comment: "Soft skin, pleasant fragrance.", date: "2025-03-02" }
    ],
    ratingBreakdown: { 5: 64, 4: 24, 3: 7, 2: 3, 1: 2 },
    articles: [
      { title: "Newborn Skincare Basics", image: "/images/article-babycare.png", link: "/articles/newborn-skincare" },
      { title: "How to Choose Baby Lotions", image: "/images/article-choose-lotion.png", link: "/articles/choose-baby-lotion" }
    ]
  },
  {
    title: "Pilgrim 3% Redensyl & 4% Anagain Advance",
    image: "/images/pil.png",
    images: ["/images/pill.png", "/images/piil.png", "/images/piiil.png"],
    mrp: 545,
    price: 392.4,
    discount: 28,
    brand: "Pilgrim",
    rating: 4.3,
    reviews: 156,
    highlights: ["Hair fall control", "Clinically tested actives", "Non-sticky"],
    bgGradient: "bg-gradient-to-b from-orange-100 to-white",
    description:
      "A leave‑in serum with Redensyl & Anagain to reduce hair fall and support fuller-looking hair. Non-sticky formula for daily use.",
    specs: [
      "Actives: Redensyl 3%, Anagain 4%",
      "Application: Leave-in, no rinse",
      "Hair type: All, including colored hair",
      "Use: Once daily on clean scalp",
      "Paraben/SLS: Free"
    ],
    reviewsList: [
      { name: "Habiba", rating: 5, comment: "Baby hair growth after 1 month.", date: "2025-05-01" },
      { name: "Kunle", rating: 4, comment: "Less shedding, nice texture.", date: "2025-04-08" }
    ],
    ratingBreakdown: { 5: 51, 4: 31, 3: 11, 2: 5, 1: 2 },
    articles: [
      { title: "Hair Fall: Common Causes", image: "/images/article-hairfall.png", link: "/articles/hairfall-causes" },
      { title: "Actives Like Redensyl Explained", image: "/images/article-actives.png", link: "/articles/redensyl-guide" }
    ]
  },
  {
    title: "Combiflam Ms Tube Of 30gm Cream",
    image: "/images/comm.png",
    images: ["/images/comm.png", "/images/combi.png", "/images/combb.png"],
    mrp: 140,
    price: 121.8,
    discount: 13,
    brand: "Combiflam",
    rating: 4.1,
    reviews: 98,
    highlights: ["Topical pain relief", "Fast absorbing", "Cooling effect"],
    bgGradient: "bg-gradient-to-b from-blue-100 to-white",
    description:
      "Topical analgesic cream formulated to provide quick relief from muscle aches and minor sprains. Cools on contact and absorbs quickly.",
    specs: [
      "Net weight: 30 g",
      "Use: 2–3 times daily on affected area",
      "Sensation: Cooling effect",
      "Do not apply: Broken/irritated skin",
      "For external use only"
    ],
    reviewsList: [
      { name: "Gbenga", rating: 4, comment: "Good for post‑workout soreness.", date: "2025-01-29" },
      { name: "Mary", rating: 5, comment: "Fast relief for shoulder pain.", date: "2025-03-20" }
    ],
    ratingBreakdown: { 5: 42, 4: 33, 3: 15, 2: 6, 1: 4 },
    articles: [
      { title: "Topical Pain Relievers 101", image: "/images/article-topical.png", link: "/articles/topical-analgesics" },
      { title: "R.I.C.E. for Sprains", image: "/images/article-rice.png", link: "/articles/rice-method" }
    ]
  },
  {
    title: "Baidyanath Nagpur Chyawanprash Special",
    image: "/images/baid.png",
    images: ["/images/baid.png", "/images/Chya.png", "/images/Chyaa.png"],
    mrp: 460,
    price: 299,
    discount: 35,
    brand: "Baidyanath",
    rating: 4.5,
    reviews: 187,
    highlights: ["Immunity booster", "Ayurvedic formula", "Rich in amla"],
    bgGradient: "bg-gradient-to-b from-red-100 to-white",
    description:
      "Traditional Ayurvedic formulation with amla and herbs to support immunity and vitality. Enjoy daily with milk or toast.",
    specs: [
      "Type: Ayurvedic herbal jam",
      "Key herb: Amla (Indian gooseberry)",
      "Use: 1–2 tsp daily",
      "Allergen info: Vegetarian",
      "Storage: Cool, dry place"
    ],
    reviewsList: [
      { name: "Felix", rating: 5, comment: "Great taste, energy boost.", date: "2025-02-07" },
      { name: "Ngozi", rating: 4, comment: "Kids like it with milk.", date: "2025-04-12" }
    ],
    ratingBreakdown: { 5: 60, 4: 26, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "Chyawanprash: What’s Inside?", image: "/images/article-chy.png", link: "/articles/chyawanprash-inside" },
      { title: "Daily Immunity Habits", image: "/images/article-immunity.png", link: "/articles/immunity-habits" }
    ]
  }
];

// ---------- Trending ----------
export const trendingProducts = [
  {
    title: "Shelcal 500mg Strip Of 15 Tablets",
    image: "/images/shel.png",
    images: ["/images/shel.png", "/images/cal.png", "/images/call.png"],
    mrp: 1580,
    price: 1221.2,
    discount: 23,
    brand: "Shelcal",
    rating: 4.4,
    reviews: 265,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white-50",
    description:
      "Shelcal 500 mg tablets provide elemental calcium to maintain bone strength and reduce risk of deficiency in adults.",
    specs: [
      "Strength: 500 mg",
      "Pack size: 15 tablets",
      "Use: Daily as advised",
      "With food: Recommended",
      "Suitable for seniors: Yes (consult doctor)"
    ],
    reviewsList: [
      { name: "Ruth", rating: 5, comment: "My bones feel stronger.", date: "2025-05-10" },
      { name: "Sola", rating: 4, comment: "Works as expected.", date: "2025-04-04" }
    ],
    ratingBreakdown: { 5: 57, 4: 29, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "Bone Density & Aging", image: "/images/article-density.png", link: "/articles/bone-density" },
      { title: "How Much Calcium Do You Need?", image: "/images/article-intake.png", link: "/articles/calcium-intake" }
    ]
  },
  {
    title: "Abzorb Total Skin Relief Dusting Powder",
    image: "/images/abz.webp",
    images: ["/images/abz.webp", "/images/fun.png", "/images/fung.png"],
    mrp: 750,
    price: 600,
    discount: 20,
    brand: "Abzorb",
    rating: 4.3,
    reviews: 140,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white-50",
    description:
      "Cooling dusting powder designed to absorb sweat, reduce friction, and keep skin fresh in hot/humid weather.",
    specs: [
      "Type: Medicated dusting powder",
      "Use: After bath or before activity",
      "Areas: Underarms, feet, folds",
      "Fragrance: Mild, fresh",
      "Dermatologist tested: Yes"
    ],
    reviewsList: [
      { name: "Emeka", rating: 4, comment: "Great for gym days.", date: "2025-01-16" },
      { name: "Hauwa", rating: 5, comment: "No more rashes in heat!", date: "2025-03-11" }
    ],
    ratingBreakdown: { 5: 50, 4: 32, 3: 11, 2: 5, 1: 2 },
    articles: [
      { title: "Preventing Heat Rashes", image: "/images/article-heat.png", link: "/articles/heat-rash-prevent" },
      { title: "Skin Hygiene in the Tropics", image: "/images/article-hygiene.png", link: "/articles/skin-hygiene" }
    ]
  },
  {
    title: "Liveasy Wellness Calcium Magnesium",
    image: "/images/liv.png",
    images: ["/images/liv.png", "/images/livee.png", "/images/liveea.png"],
    mrp: 480,
    price: 384,
    discount: 20,
    brand: "Liveasy",
    rating: 4.2,
    reviews: 101,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
    description:
      "Balanced calcium and magnesium with Vitamin D for bones and muscle function. Helpful for active adults.",
    specs: [
      "Combo: Calcium + Magnesium + Vitamin D",
      "Use: Once daily with meals",
      "Allergen info: Gluten-free",
      "Tablets: Easy to swallow",
      "Country of origin: India"
    ],
    reviewsList: [
      { name: "Tope", rating: 4, comment: "Less leg cramps at night.", date: "2025-02-26" },
      { name: "Fola", rating: 5, comment: "Excellent value.", date: "2025-03-17" }
    ],
    ratingBreakdown: { 5: 45, 4: 34, 3: 12, 2: 6, 1: 3 },
    articles: [
      { title: "Magnesium & Muscle Health", image: "/images/article-mag.png", link: "/articles/magnesium-muscle" },
      { title: "Understanding Electrolytes", image: "/images/article-electrolyte.png", link: "/articles/electrolytes" }
    ]
  },
  {
    title: "Evion 400mg Strip Of 20 Capsules",
    image: "/images/evionn.png",
    images: ["/images/evionn.png", "/images/ev.png", "/images/evv.png"],
    mrp: 350,
    price: 298,
    discount: 15,
    brand: "Evion",
    rating: 4.4,
    reviews: 190,
    bgGradient: "bg-gradient-to-b from-green-100 to-white-50",
    description:
      "Vitamin E softgels supporting skin health and antioxidative protection. Often used for dryness and oxidative stress.",
    specs: [
      "Strength: 400 mg Vitamin E",
      "Form: Softgel capsules",
      "Pack size: 20 capsules",
      "Use: Once daily or as directed",
      "With meals: Recommended"
    ],
    reviewsList: [
      { name: "Ada", rating: 5, comment: "Skin looks healthier.", date: "2025-05-07" },
      { name: "Yemi", rating: 4, comment: "Good but be consistent.", date: "2025-03-27" }
    ],
    ratingBreakdown: { 5: 55, 4: 30, 3: 10, 2: 3, 1: 2 },
    articles: [
      { title: "Vitamin E Benefits & Safety", image: "/images/article-vitE.png", link: "/articles/vitamin-e-benefits" },
      { title: "Antioxidants 101", image: "/images/article-antioxidants.png", link: "/articles/antioxidants-basics" }
    ]
  },
  {
    title: "Revital H Men Multivitamin",
    image: "/images/rev.png",
    images: ["/images/rev.png", "/images/revv.png", "/images/reeev.jpg"],
    mrp: 650,
    price: 520,
    discount: 20,
    brand: "Revital",
    rating: 4.3,
    reviews: 164,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
    description:
      "Daily multivitamin and minerals for men to support energy, immunity, and metabolism. Designed for modern busy lifestyles.",
    specs: [
      "Form: Tablets",
      "Key vits: B‑complex, D, C, Zinc",
      "Use: Once daily after breakfast",
      "Caffeine-free: Yes",
      "Vegetarian: Yes"
    ],
    reviewsList: [
      { name: "Tobi", rating: 5, comment: "Energy improved noticeably.", date: "2025-02-02" },
      { name: "Henry", rating: 4, comment: "Solid multi, no jitters.", date: "2025-03-15" }
    ],
    ratingBreakdown: { 5: 49, 4: 33, 3: 11, 2: 5, 1: 2 },
    articles: [
      { title: "Choosing a Multivitamin", image: "/images/article-multi.png", link: "/articles/choose-multivitamin" },
      { title: "Micronutrients for Energy", image: "/images/article-energy.png", link: "/articles/micronutrients-energy" }
    ]
  },
  {
    title: "Dr. Morepen Gluco One Bg 03 Glucometer",
    image: "/images/morr.png",
    images: ["/images/morr.png", "/images/DrM.png", "/images/Dr.jpg"],
    mrp: 900,
    price: 765,
    discount: 15,
    brand: "Dr. Morepen",
    rating: 4.2,
    reviews: 122,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white-50",
    description:
      "Compact glucometer with quick readings and easy strip loading. Designed for reliable home blood glucose monitoring.",
    specs: [
      "Reading time: ~5 seconds",
      "Memory: Up to 300 results",
      "Coding: No code required",
      "Battery: Replaceable coin cell",
      "Warranty: 1 year (as per brand)"
    ],
    reviewsList: [
      { name: "Kola", rating: 4, comment: "Accurate and fast.", date: "2025-01-09" },
      { name: "Blessing", rating: 5, comment: "Great for my parents.", date: "2025-03-25" }
    ],
    ratingBreakdown: { 5: 44, 4: 36, 3: 12, 2: 5, 1: 3 },
    articles: [
      { title: "How to Use a Glucometer", image: "/images/article-gluco.png", link: "/articles/use-glucometer" },
      { title: "Interpreting Fasting vs PP Levels", image: "/images/article-glucose.png", link: "/articles/glucose-levels" }
    ]
  }
];

// ---------- Deals ----------
export const deals = [
  {
    name: "Depura Vitamin D3 60k Sugar Free Oral...",
    img: "/images/depura.png",
    images: ["/images/depura.png", "/images/dep.webp", "/images/depp.webp"],
    mrp: 114.93,
    price: 108.03,
    discount: 6,
    link: "#",
    brand: "Depura",
    bgGradient: "bg-gradient-to-br from-orange-200 to-yellow-50",
    description:
      "High‑strength Vitamin D3 to support calcium absorption and immune function. Sugar‑free formulation.",
    specs: [
      "Strength: 60,000 IU",
      "Form: Oral solution",
      "Use: As directed by physician",
      "Allergen info: Sugar‑free",
      "Country of origin: India"
    ],
    reviewsList: [
      { name: "Onyeka", rating: 5, comment: "Vitamin D levels improved.", date: "2025-04-18" },
      { name: "Faith", rating: 4, comment: "Convenient dosing.", date: "2025-03-10" }
    ],
    ratingBreakdown: { 5: 53, 4: 32, 3: 9, 2: 4, 1: 2 },
    articles: [
      { title: "Vitamin D & Immunity", image: "/images/article-vitD.png", link: "/articles/vitamin-d-immunity" },
      { title: "When to Supplement Vitamin D", image: "/images/article-supplement.png", link: "/articles/when-supplement" }
    ]
  },
  {
    name: "Evion 400mg Strip Of 20 Capsule",
    img: "/images/ev.png",
    images: ["/images/ev.png", "/images/evv.png", "/images/evion.png"],
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    brand: "Evion",
    bgGradient: "bg-gradient-to-br from-green-100 to-green-50",
    description:
      "Vitamin E softgels that help protect cells from oxidative stress and support skin health.",
    specs: [
      "Strength: 400 mg",
      "Pack size: 20 caps",
      "Use: Daily with meals",
      "Storage: Below 25°C",
      "Manufacturer: Merck Ltd."
    ],
    reviewsList: [
      { name: "Kate", rating: 4, comment: "Skin feels hydrated.", date: "2025-02-20" },
      { name: "Jide", rating: 5, comment: "Trusted brand.", date: "2025-04-29" }
    ],
    ratingBreakdown: { 5: 52, 4: 34, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "Skin Antioxidants Explained", image: "/images/article-skin.png", link: "/articles/skin-antioxidants" },
      { title: "Vitamin E: Dosage & Myths", image: "/images/article-vitE2.png", link: "/articles/vitamin-e-dosage" }
    ]
  },
  {
    name: "Sevenseas Original Capsule 100`S",
    img: "/images/sevenseas.png",
    images: ["/images/sevenseas.png", "/images/sea.png", "/images/sae.png"],
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    brand: "Sevenseas",
    bgGradient: "bg-gradient-to-br from-orange-100 to-yellow-50",
    description:
      "Cod liver oil capsules with natural omega‑3 and vitamins A & D for heart, brain, and vision support.",
    specs: [
      "Source: Cod liver oil",
      "Omega‑3: EPA & DHA",
      "Vitamins: A & D",
      "Use: Daily as directed",
      "Allergen: Fish oil"
    ],
    reviewsList: [
      { name: "Opeyemi", rating: 5, comment: "Good for joints.", date: "2025-03-05" },
      { name: "Zainab", rating: 4, comment: "No aftertaste for me.", date: "2025-01-30" }
    ],
    ratingBreakdown: { 5: 55, 4: 30, 3: 9, 2: 4, 1: 2 },
    articles: [
      { title: "Omega‑3: EPA vs DHA", image: "/images/article-omega.png", link: "/articles/omega3-epa-dha" },
      { title: "Fish Oil: Safety & Quality", image: "/images/article-fish.png", link: "/articles/fish-oil-quality" }
    ]
  },
  {
    name: "Cetaphil Gentle Skin Cleanser - 125ml",
    img: "/images/ceta.png",
    images: ["/images/ceta.png", "/images/cet.png", "/images/ce.png"],
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    brand: "Cetaphil",
    bgGradient: "bg-gradient-to-br from-blue-100 to-white-50",
    description:
      "Non‑irritating, soap‑free cleanser for sensitive skin. Gently removes impurities without stripping moisture.",
    specs: [
      "Volume: 125 ml",
      "Soap‑free: Yes",
      "Fragrance: Mild",
      "Dermatologist recommended: Yes",
      "Skin types: Dry, sensitive, normal"
    ],
    reviewsList: [
      { name: "Tessy", rating: 5, comment: "Holy grail for sensitive skin.", date: "2025-04-09" },
      { name: "Boma", rating: 4, comment: "Leaves skin soft.", date: "2025-02-01" }
    ],
    ratingBreakdown: { 5: 58, 4: 28, 3: 8, 2: 4, 1: 2 },
    articles: [
      { title: "Cleansers for Sensitive Skin", image: "/images/article-cleanser.png", link: "/articles/sensitive-cleansers" },
      { title: "Barrier Repair Basics", image: "/images/article-barrier.png", link: "/articles/skin-barrier" }
    ]
  },
  {
    name: "Saliac Foaming Face Wash Foaming Bottle Salicylic Acid Of 60 Ml",
    img: "/images/saliac.webp",
    images: ["/images/saliac.webp", "/images/sal.png", "/images/sall.png"],
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    brand: "Saliac",
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
    description:
      "Foaming face wash with salicylic acid to unclog pores and reduce acne. Gentle enough for daily use.",
    specs: [
      "Volume: 60 ml",
      "Active: Salicylic acid",
      "Skin type: Oily/Acne‑prone",
      "Use: Twice daily",
      "Non‑comedogenic: Yes"
    ],
    reviewsList: [
      { name: "Favour", rating: 5, comment: "Breakouts reduced visibly.", date: "2025-05-02" },
      { name: "Ibrahim", rating: 4, comment: "Foam is light and effective.", date: "2025-03-19" }
    ],
    ratingBreakdown: { 5: 54, 4: 31, 3: 9, 2: 4, 1: 2 },
    articles: [
      { title: "Salicylic Acid: How It Works", image: "/images/article-salicylic.png", link: "/articles/salicylic-acid" },
      { title: "Acne Routine for Beginners", image: "/images/article-acne.png", link: "/articles/acne-routine" }
    ]
  },
  {
    name: "Grd Smart Vanilla Whey Protein Jar Of 200 G",
    img: "/images/grrd.png",
    images: ["/images/grrd.png", "/images/grdd.png", "/images/grd.png"],
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    brand: "GRD",
    bgGradient: "bg-gradient-to-br from-orange-100 to-white-50",
    description:
      "Whey protein powder with vanilla flavor to support recovery and daily protein goals. Mixes smoothly in milk or water.",
    specs: [
      "Net weight: 200 g",
      "Protein source: Whey",
      "Servings: ~10 (20 g each)",
      "Mixability: High",
      "Added sugar: No"
    ],
    reviewsList: [
      { name: "Ike", rating: 4, comment: "Good taste, mixes well.", date: "2025-02-11" },
      { name: "Joy", rating: 5, comment: "Great for quick shakes.", date: "2025-04-30" }
    ],
    ratingBreakdown: { 5: 48, 4: 35, 3: 11, 2: 4, 1: 2 },
    articles: [
      { title: "How Much Protein Do You Need?", image: "/images/article-protein.png", link: "/articles/protein-needs" },
      { title: "Whey vs Plant Protein", image: "/images/article-whey-plant.png", link: "/articles/whey-vs-plant" }
    ]
  }
];

// ---------- Wellness Essentials ----------
export const wellnessEssentials = [
  {
    title: "Depura Vitamin D3 60k Sugar Free Oral Solution",
    image: "/images/depura.png",
    images: ["/images/depura.png", "/images/dep.avif", "/images/depp.avif"],
    oldPrice: 114.93,
    newPrice: 94.24,
    discount: 18,
    brand: "Depura",
    rating: 4.4,
    reviews: 98,
    bgGradient: "bg-gradient-to-br from-orange-100 to-white-50",
    description:
      "High‑dose Vitamin D3 solution formulated to correct deficiency and support immune health. Sugar‑free.",
    specs: [
      "Potency: 60,000 IU",
      "Form: Oral liquid",
      "Dose: As prescribed",
      "Storage: Below 25°C",
      "Allergen info: Sugar‑free"
    ],
    reviewsList: [
      { name: "Ola", rating: 5, comment: "Energy levels improved.", date: "2025-03-06" },
      { name: "Peace", rating: 4, comment: "Pleasant taste for a D3.", date: "2025-04-01" }
    ],
    ratingBreakdown: { 5: 56, 4: 30, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "Vitamin D & Sunlight", image: "/images/article-sun.png", link: "/articles/vitd-sun" },
      { title: "Deficiency Signs to Watch", image: "/images/article-deficiency.png", link: "/articles/vitd-deficiency" }
    ]
  },
  {
    title: "Sugar Free Gold Plus Packet Of 500 Pellets",
    image: "/images/sugar.png",
    images: ["/images/sugar.png", "/images/sug.png", "/images/sugg.png"],
    oldPrice: 320.0,
    newPrice: 281.6,
    discount: 12,
    brand: "Sugar Free",
    rating: 4.1,
    reviews: 76,
    bgGradient: "bg-gradient-to-br from-yellow-100 to-white-50",
    description:
      "Low‑calorie sweetener pellets suitable for hot and cold beverages. Helps reduce sugar intake.",
    specs: [
      "Pellets: 500 count",
      "Sweetener type: Low‑calorie blend",
      "Heat stable: Yes",
      "Ideal for: Tea, coffee, lemonade",
      "Suitable for diabetics: Consult physician"
    ],
    reviewsList: [
      { name: "Chuka", rating: 4, comment: "No aftertaste in tea.", date: "2025-05-08" },
      { name: "Muna", rating: 5, comment: "Handy for travel.", date: "2025-02-19" }
    ],
    ratingBreakdown: { 5: 44, 4: 36, 3: 12, 2: 5, 1: 3 },
    articles: [
      { title: "Artificial vs Natural Sweeteners", image: "/images/article-sweetener.png", link: "/articles/sweeteners" },
      { title: "Cutting Sugar Safely", image: "/images/article-sugar-cut.png", link: "/articles/cut-sugar" }
    ]
  },
  {
    title: "Enterogermina Suspension 10 X 5 Ml",
    image: "/images/enterogermina.png",
    images: ["/images/enterogermina.png", "/images/ent.png", "/images/entt.jpg"],
    oldPrice: 732.0,
    newPrice: 563.64,
    discount: 23,
    brand: "Enterogermina",
    rating: 4.3,
    reviews: 144,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
    description:
      "Probiotic suspension that helps restore gut flora during or after antibiotics and supports digestive comfort.",
    specs: [
      "Format: 10 x 5 ml vials",
      "Strain: Bacillus clausii",
      "Use: 1–2 vials/day or as directed",
      "Flavor: Neutral",
      "Storage: Room temp (see label)"
    ],
    reviewsList: [
      { name: "Ngozi", rating: 5, comment: "Worked after antibiotics.", date: "2025-02-13" },
      { name: "Samson", rating: 4, comment: "Easy to give kids.", date: "2025-03-01" }
    ],
    ratingBreakdown: { 5: 52, 4: 33, 3: 10, 2: 3, 1: 2 },
    articles: [
      { title: "Probiotics & Gut Health", image: "/images/article-gut.png", link: "/articles/probiotics-gut" },
      { title: "Antibiotics: Protect Your Microbiome", image: "/images/article-microbiome.png", link: "/articles/antibiotics-microbiome" }
    ]
  },
  {
    title: "Neurobion Forte Strip Of 30 Tablets",
    image: "/images/neurobion.png",
    images: ["/images/neurobion.png", "/images/neu.png", "/images/nue.png"],
    oldPrice: 46.1,
    newPrice: 46.1,
    discount: 0,
    brand: "Neurobion",
    rating: 4.2,
    reviews: 201,
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
    description:
      "B‑complex vitamin supplement helpful for nerve health and energy metabolism.",
    specs: [
      "Vitamins: B1, B6, B12",
      "Pack size: 30 tablets",
      "Use: Daily with meals",
      "Allergen info: Gluten‑free",
      "Caution: Follow physician advice"
    ],
    reviewsList: [
      { name: "Grace", rating: 5, comment: "Less tingling in feet.", date: "2025-04-06" },
      { name: "Uche", rating: 4, comment: "Useful combo B‑vitamins.", date: "2025-01-25" }
    ],
    ratingBreakdown: { 5: 47, 4: 35, 3: 12, 2: 4, 1: 2 },
    articles: [
      { title: "B‑Vitamins & Nerve Health", image: "/images/article-bvit.png", link: "/articles/bvit-nerve" },
      { title: "B12 Deficiency Signs", image: "/images/article-b12.png", link: "/articles/b12-deficiency" }
    ]
  },
  {
    title: "Sebamed Clear Face Cleansing Foam - 150ml",
    image: "/images/sebamed.png",
    images: ["/images/sebamed.png", "/images/seb.png", "/images/seba.png"],
    oldPrice: 680.0,
    newPrice: 564.4,
    discount: 17,
    brand: "Sebamed",
    rating: 4.5,
    reviews: 175,
    bgGradient: "bg-gradient-to-br from-pink-100 to-red-50",
    description:
      "pH 5.5 foaming cleanser that supports skin barrier while controlling oil. Suitable for sensitive and acne‑prone skin.",
    specs: [
      "Volume: 150 ml",
      "pH: 5.5",
      "Skin type: Oily/Sensitive",
      "SLS/SLES: Free",
      "Dermatologically tested: Yes"
    ],
    reviewsList: [
      { name: "Rita", rating: 5, comment: "Skin feels balanced, not tight.", date: "2025-03-29" },
      { name: "Daniel", rating: 4, comment: "Foam is gentle, effective.", date: "2025-05-05" }
    ],
    ratingBreakdown: { 5: 59, 4: 27, 3: 9, 2: 3, 1: 2 },
    articles: [
      { title: "pH & Your Skin Barrier", image: "/images/article-ph.png", link: "/articles/skin-ph" },
      { title: "Acne‑Safe Cleansing Routine", image: "/images/article-acne-wash.png", link: "/articles/acne-cleansing" }
    ]
  },
  {
    title: "Lite Glo Face Wash Tube Of 100 Ml",
    image: "/images/lite.png",
    images: ["/images/lite.png", "/images/lit.png", "/images/litt.jpg"],
    oldPrice: 499.0,
    newPrice: 429.14,
    discount: 14,
    brand: "Lite Glo",
    rating: 4.0,
    reviews: 66,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
    description:
      "Daily face wash that refreshes dull skin and removes impurities. Gentle formula for everyday use.",
    specs: [
      "Volume: 100 ml",
      "Skin type: Normal to combination",
      "Fragrance: Light citrus",
      "Use: Morning and night",
      "Paraben-free: Yes"
    ],
    reviewsList: [
      { name: "Femi", rating: 4, comment: "Skin feels fresh, not dry.", date: "2025-02-06" },
      { name: "Tolani", rating: 4, comment: "Nice fragrance, good lather.", date: "2025-04-21" }
    ],
    ratingBreakdown: { 5: 38, 4: 40, 3: 14, 2: 5, 1: 3 },
    articles: [
      { title: "Daily Skincare Basics", image: "/images/article-daily.png", link: "/articles/daily-skincare" },
      { title: "Choosing a Face Wash", image: "/images/article-facewash.png", link: "/articles/choose-face-wash" }
    ]
  }
];

// inside mockData.js
export const articles = [
    {
      title: "What is Hepatitis A? Causes, Symptoms, and How It Spreads",
      img: "/images/hep.png",
      link: "/articles/hepatitis-a",
    },
    {
      title: "Everything You Need to Know About the Hepatitis A Vaccine",
      img: "/images/vac.png",
      link: "/articles/hepatitis-a-vaccine",
    },
    {
      title: "Everything To Know About the Influenza Vaccine & Its Importance",
      img: "/images/influ.png",
      link: "/articles/influenza-vaccine",
    },
    {
      title: "HPV Vaccine: What is It, When to Be Taken, Importance & Side Effects",
      img: "/images/hpv.png",
      link: "/articles/hpv-vaccine",
    },
    {
      title: "Managing Hypertension: Diet, Lifestyle & Medication",
      img: "/images/hyper.png",
      link: "/articles/hypertension-management",
    },
    {
      title: "Understanding Type 2 Diabetes: Causes & Daily Tips",
      img: "/images/diab.png",
      link: "/articles/type2-diabetes-guide",
    },
    {
      title: "Mental Health: Recognizing Signs of Anxiety & Stress",
      img: "/images/mental.png",
      link: "/articles/mental-health-awareness",
    },
  ];


// Re-export to match your imports elsewhere
export { products as newLaunchesProducts, topDoctors as doctors };