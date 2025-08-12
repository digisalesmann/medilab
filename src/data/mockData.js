// Central mock data for the whole app

export const mockPharmacies = [
  {
    id: "1",
    name: 'HealthPlus Pharmacy',
    license: 'PHX-3289-2025',
    location: 'Owerri Imo-State',
    owner: 'Dr. Ada Okeke',
    verified: true,
    phone: '+2348001234567',
    reviews: 128,
    rating: 4.6,
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Respiratory: [
        { name: "Ventolin Inhaler", stock: 0, price: 1200 }
      ],
      Diabetes: [
        { name: "Metformin 1000mg", stock: 25, price: 2000 }
      ],
      Cardiovascular: [
        { name: "Lisinopril 10mg", stock: 18, price: 1500 }
      ],
      "Antihistamines / Allergy": [
        { name: "Cetirizine 10mg", stock: 40, price: 900 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 }
      ],
      "Antacids / Stomach": [
        { name: "Omeprazole 20mg", stock: 50, price: 1100 }
      ],
      Antimalarials: [
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 }
      ],
      "Vitamins & Supplements": [
        { name: "Folic Acid 5mg", stock: 60, price: 700 }
      ]
    }
  },
  {
    id: "2",
    name: 'MediStore',
    license: 'PHX-2210-2025',
    location: 'Owerri Imo-State',
    owner: 'Dr. John Ibrahim',
    verified: true,
    phone: '+2348009876543',
    reviews: 75,
    rating: 4.2,
    inventory: {
      "Neurology / Psychiatry": [
        { name: "Lorazepam 2mg", stock: 7, price: 2900 },
        { name: "Diazepam 5mg", stock: 12, price: 2200 }
      ],
      Steroids: [
        { name: "Prednisone 20mg", stock: 10, price: 2100 }
      ],
      Cardiovascular: [
        { name: "Losartan 50mg", stock: 14, price: 1700 },
        { name: "Simvastatin 40mg", stock: 9, price: 1900 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 }
      ],
      "Vitamins & Supplements": [
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ]
    }
  },
  {
    id: "3",
    name: 'CityMed Pharmacy',
    license: 'PHX-3301-2025',
    location: 'Yaba, Lagos, Nigeria',
    owner: 'Dr. Tolu Adebayo',
    verified: true,
    phone: '+2347012345678',
    reviews: 102,
    rating: 4.5,
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Cetirizine", stock: 10, price: 2200 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 }
      ],
      Diabetes: [
        { name: "Metformin", stock: 7, price: 1950 }
      ],
      Cardiovascular: [
        { name: "Simvastatin 40mg", stock: 9, price: 1900 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 },
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Levosalbutamol", stock: 28, price: 900 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 }
      ],
      "Antacids / Stomach": [
        { name: "Omeprazole 20mg", stock: 50, price: 1100 }
      ],
      "Vitamins & Supplements": [
        { name: "Folic Acid 5mg", stock: 60, price: 700 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ]
    }
  },
  {
    id: "4",
    name: 'LifeCare Drugs',
    license: 'PHX-3388-2025',
    location: 'Victoria Island, Lagos, Nigeria',
    owner: 'Dr. Ifeoma Umeh',
    verified: true,
    phone: '+2347034567890',
    reviews: 89,
    rating: 4.4,
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Loratadine", stock: 8, price: 1900 },
        { name: "Cetirizine", stock: 10, price: 3400 }
      ],
      "Vitamins & Supplements": [
        { name: "Vitamin C", stock: 21, price: 2800 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ],
      Cardiovascular: [
        { name: "Simvastatin 40mg", stock: 9, price: 1900 },
        { name: "Lisinopril 10mg", stock: 18, price: 1500 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Ventolin Inhaler", stock: 0, price: 1200 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 }
      ],
      Diabetes: [
        { name: "Metformin 1000mg", stock: 25, price: 2000 }
      ]
    }
  },
  {
    id: "5",
    name: 'GreenMed Pharmacy',
    license: 'PHX-3402-2025',
    location: 'Maitama, Abuja, Nigeria',
    owner: 'Dr. Musa Danjuma',
    verified: false,
    phone: '+2347067890123',
    reviews: 6,
    rating: 2.3,
    inventory: [],
  },
  {
    id: "6",
    name: 'PrimeCare Pharmacy',
    license: 'PHX-3415-2025',
    location: 'Wuse Zone 2, Abuja, Nigeria',
    owner: 'Dr. Grace Nwankwo',
    verified: true,
    phone: '+2347087654321',
    reviews: 116,
    rating: 4.7,
    inventory: {
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 }
      ],
      "Vitamins & Supplements": [
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Respiratory: [
        { name: "Ventolin Inhaler", stock: 10, price: 1200 }
      ]
    }
  },
  {
    id: "7",
    name: 'Silverline Pharmacy',
    license: 'PHX-3492-2025',
    location: 'Ikeja, Lagos, Nigeria',
    owner: 'Dr. Emeka Obi',
    verified: true,
    phone: '+2347011122233',
    reviews: 59,
    rating: 4.1,
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 250mg", stock: 6, price: 3200 }
      ],
      "Neurology / Psychiatry": [
        { name: "Nitrazepam 5mg", stock: 6, price: 2200 }
      ],
      Cardiovascular: [
        { name: "Clopidogrel 75mg", stock: 14, price: 2700 },
        { name: "Atorvastatin 20mg", stock: 18, price: 2100 },
        { name: "Hydralazine 25mg", stock: 5, price: 2400 }
      ],
      "Antacids / Stomach": [
        { name: "Cimetidine 200mg", stock: 7, price: 1300 },
        { name: "Domperidone 10mg", stock: 12, price: 1400 }
      ],
      "Anthelmintics / Antiparasitics": [
        { name: "Albendazole 400mg", stock: 16, price: 1500 }
      ],
      "Men's Health": [
        { name: "Sildenafil 50mg", stock: 10, price: 2900 }
      ],
      "Dermatological / Skin Care": [
        { name: "Ketoconazole Shampoo", stock: 9, price: 3200 }
      ],
      "Vitamins & Supplements": [
        { name: "Vitamin B-Complex Injection", stock: 3, price: 3500 }
      ]
    }
  },
  {
    id: "8",
    name: 'Wellcare Pharmacy',
    license: 'PHX-3524-2025',
    location: 'Asaba, Delta State, Nigeria',
    owner: 'Dr. Kemi Bassey',
    verified: true,
    phone: '+2347098765432',
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
    Diabetes: [
      { name: "Metformin", stock: 7, price: 1150 },
    ],
    Cholesterol: [
      { name: "Simvastatin 40mg", stock: 9, price: 1900 },
    ],
    Respiratory: [
      { name: "Salbutamol Syrup", stock: 11, price: 1300 },
    ],
    Supplements: [
      { name: "Multivitamin Complex", stock: 35, price: 1500 },
    ],
  }
  },
  {
    id: "9",
    name: 'MedEase',
    license: 'PHX-3570-2025',
    location: 'Enugu, Enugu State, Nigeria',
    owner: 'Dr. Chuka Eze',
    verified: false,
    phone: '+2347044433221',
    reviews: 8,
    rating: 1.7,
    inventory: [],
  },
  {
    id: "10",
    name: 'Access Pharma',
    license: 'PHX-3613-2025',
    location: 'Abeokuta, Ogun State, Nigeria',
    owner: 'Dr. Aisha Bello',
    verified: true,
    phone: '+2347055556677',
    reviews: 47,
    rating: 4.0,
    inventory: {
    Antacids: [
      { name: "Antacid", stock: 6, price: 2870 },
      { name: "Ranitidine 150mg", stock: 9, price: 1200 },
    ],
    Hormonal: [
      { name: "Insulin Glargine", stock: 4, price: 5500 },
    ],
    BloodPressure: [
      { name: "Amlodipine 10mg", stock: 16, price: 1400 },
    ],
    SkinCare: [
      { name: "Clotrimazole Cream", stock: 13, price: 1600 },
      { name: "Betamethasone Cream", stock: 10, price: 1700 },
    ],
    Injections: [
      { name: "Gentamicin Injection", stock: 6, price: 2500 },
    ],
    Electrolytes: [
      { name: "Magnesium Sulfate", stock: 5, price: 2000 },
      { name: "Zinc Sulphate Syrup", stock: 28, price: 1000 },
      { name: "ORS Sachet", stock: 100, price: 300 },
    ],
    Cough: [
      { name: "Cough Syrup (Expectorant)", stock: 21, price: 1800 },
    ],
  }
  },
  {
    id: "11",
    name: 'VitalMed',
    license: 'PHX-3688-2025',
    location: 'Port Harcourt, Rivers, Nigeria',
    owner: 'Dr. Oluchi Nnaji',
    verified: true,
    phone: '+2347061239876',
    reviews: 95,
    rating: 4.6,
    inventory: {
    Antibiotics: [
      { name: "Doxycycline 100mg", stock: 11, price: 1900 },
      { name: "Metronidazole 400mg", stock: 20, price: 1100 },
    ],
    Antihistamines: [
      { name: "Chlorphenamine", stock: 4, price: 7650 },
    ],
    Antifungals: [
      { name: "Fluconazole 150mg", stock: 7, price: 2100 },
      { name: "Miconazole Oral Gel", stock: 9, price: 2300 },
    ],
    BloodPressure: [
      { name: "Nifedipine 20mg", stock: 18, price: 1600 },
    ],
    BloodThinners: [
      { name: "Warfarin 5mg", stock: 5, price: 2800 },
    ],
    Hormonal: [
      { name: "Levothyroxine 50mcg", stock: 13, price: 2000 },
    ],
    Vitamins: [
      { name: "Multivitamins", stock: 15, price: 5500 },
      { name: "Calcium + Vitamin D3", stock: 30, price: 1700 },
    ],
    Minerals: [
      { name: "Iron Supplement (Ferrous Sulfate)", stock: 25, price: 1000 },
    ],
    Antacids: [
      { name: "Antacid Suspension", stock: 22, price: 900 },
    ],
  }
  },
  {
    id: "12",
    name: 'CareFirst Pharmacy',
    license: 'PHX-3715-2025',
    location: 'Owerri Imo-State, Nigeria',
    owner: 'Dr. Henry Ezeh',
    verified: true,
    phone: '+2347033338888',
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
    Digestive: [
      { name: "Loperamide 2mg", stock: 40, price: 800 },
    ],
    Neurological: [
      { name: "Sodium Valproate 200mg", stock: 9, price: 2600 },
      { name: "Melatonin 3mg", stock: 10, price: 2700 },
    ],
    Hormonal: [
      { name: "Oral Contraceptive Pill", stock: 15, price: 1900 },
    ],
  }
  }
];

// Home page / sections data (recommend adding pharmacyId for perfect linking)
export const categories = [
  {
    label: "Must haves",
    image: "/images/must.webp",
    bgGradient: "bg-gradient-to-b from-yellow-100 to-yellow-50",
  },
  {
    label: "Sports nutrition",
    image: "/images/sports.webp",
    bgGradient: "bg-gradient-to-b from-blue-100 to-blue-50",
  },
  {
    label: "Vitamins & supplements",
    image: "/images/vit.webp",
    bgGradient: "bg-gradient-to-b from-pink-100 to-pink-50",
  },
  {
    label: "Skin care",
    image: "/images/skin.webp",
    bgGradient: "bg-gradient-to-b from-purple-100 to-purple-50",
  },
  {
    label: "Diabetes essentials",
    image: "/images/dis.webp",
    bgGradient: "bg-gradient-to-b from-green-100 to-green-50",
  },
  {
    label: "Heart health",
    image: "/images/heartt.webp",
    bgGradient: "bg-gradient-to-b from-red-100 to-red-50",
  },
  {
    label: "Ayurvedic care",
    image: "/images/ay.webp",
    bgGradient: "bg-gradient-to-b from-amber-100 to-amber-50",
  },
  {
    label: "Heart health",
    image: "/images/heartt.webp",
    bgGradient: "bg-gradient-to-b from-red-100 to-red-50",
  },
  {
    label: "Ayurvedic care",
    image: "/images/ay.webp",
    bgGradient: "bg-gradient-to-b from-amber-100 to-amber-50",
  },
];

export const products = [
  {
    title: "Shelcal Total Supplement With You...",
    image: "/images/shell.png",
    mrp: 820,
    price: 713.4,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-yellow-100 to-white",
  },
  {
    title: "Kofol Lozenge 60 No'S",
    image: "/images/koff.png",
    mrp: 50,
    price: 43.5,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-green-100 to-white",
  },
  {
    title: "Tedibar Atogla Baby Lotion 200ml",
    image: "/images/tedd.png",
    mrp: 635,
    price: 520.7,
    discount: 18,
    bgGradient: "bg-gradient-to-b from-pink-100 to-white",
  },
  {
    title: "Pilgrim 3% Redensyl & 4% Anagain Advance",
    image: "/images/pill.png",
    mrp: 545,
    price: 392.4,
    discount: 28,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white",
  },
  {
    title: "Combiflam Ms Tube Of 30gm Cream",
    image: "/images/comm.png",
    mrp: 140,
    price: 121.8,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white",
  },
  {
    title: "Baidyanath Nagpur Chyawanprash Special",
    image: "/images/baid.png",
    mrp: 460,
    price: 299,
    discount: 35,
    bgGradient: "bg-gradient-to-b from-red-100 to-white",
  },
];

export const trendingProducts = [
  {
    title: "Shelcal 500mg Strip Of 15 Tablets",
    image: "/images/shel.png",
    mrp: 1580,
    price: 1221.2,
    discount: 23,
    bgGradient: "bg-gradient-to-b from-yellow-100 to-white-50",
  },
  {
    title: "Abzorb Total Skin Relief Dusting Powder",
    image: "/images/abz.webp",
    mrp: 750,
    price: 600,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white-50",
  },
  {
    title: "Liveasy Wellness Calcium Magnesium",
    image: "/images/liv.png",
    mrp: 480,
    price: 384,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
  },
  {
    title: "Evion 400mg Strip Of 20 Capsules",
    image: "/images/evionn.png",
    mrp: 350,
    price: 298,
    discount: 15,
    bgGradient: "bg-gradient-to-b from-green-100 to-white-50",
  },
  {
    title: "Revital H Men Multivitamin",
    image: "/images/rev.png",
    mrp: 650,
    price: 520,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
  },
  {
    title: "Dr. Morepen Gluco One Bg 03 Glucometer",
    image: "/images/morr.png",
    mrp: 900,
    price: 765,
    discount: 15,
    bgGradient: "bg-gradient-to-b from-pink-100 to-white-50",
  },
];

// Optional: deals/featured/wellness buckets — shape same as newLaunchesProducts
export const deals = [
    {
    name: "Depura Vitamin D3 60k Sugar Free Oral...",
    img: "/images/depura.png",
    mrp: 114.93,
    price: 108.03,
    discount: 6,
    link: "#",
    bgGradient: "bg-gradient-to-br from-yellow-100 to-yellow-50",
  },
  {
    name: "Evion 400mg Strip Of 20 Capsule",
    img: "/images/evionn.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-green-100 to-green-50",
  },
  {
    name: "Sevenseas Original Capsule 100`S",
    img: "/images/sevenseas.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-orange-100 to-yellow-50",
  },
  {
    name: "Cetaphil Gentle Skin Cleanser - 125ml",
    img: "/images/cetaphil.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-blue-100 to-white-50",
  },
  {
    name: "Saliac Foaming Face Wash Foaming Bottle Salicylic Acid Of 60 Ml",
    img: "/images/saliac.webp",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
  },
  {
    name: "Grd Smart Vanilla Whey Protein Jar Of 200 G",
    img: "/images/grd.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-green-100 to-white-50",
  },
];
export const brands = [
    {
    name: 'Evion',
    img: '/images/evion.png', // Replace with your actual paths
    link: '#',
    bg: 'bg-green-50',
  },
  {
    name: 'Nasoclear',
    img: '/images/nasoclear.png',
    link: '#',
    bg: 'bg-blue-50',
  },
  {
    name: 'Pharmeasy',
    img: '/images/Pharmeasy.jpg',
    link: '#',
    bg: 'bg-yellow-50',
  },
  {
    name: 'Diatall',
    img: '/images/Diataal.png',
    link: '#',
    bg: 'bg-yellow-100',
  },
  {
    name: 'Dulcoflex',
    img: '/images/Dulcoflex.png',
    link: '#',
    bg: 'bg-green-100',
  },
  {
    name: 'Neurobion',
    img: '/images/Neurobionn.png',
    link: '#',
    bg: 'bg-red-50',
  },
];
export const wellnessEssentials = [
    {
    title: "Depura Vitamin D3 60k Sugar Free Oral Solution",
    image: "/images/depura.png",
    oldPrice: 114.93,
    newPrice: 94.24,
    discount: 18,
    bgGradient: "bg-gradient-to-br from-orange-100 to-white-50",
  },
  {
    title: "Sugar Free Gold Plus Packet Of 500 Pellets",
    image: "/images/sugar.png",
    oldPrice: 320.0,
    newPrice: 281.6,
    discount: 12,
    bgGradient: "bg-gradient-to-br from-yellow-100 to-white-50",
  },
  {
    title: "Enterogermina Suspension 10 X 5 Ml",
    image: "/images/enterogermina.png",
    oldPrice: 732.0,
    newPrice: 563.64,
    discount: 23,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
  },
  {
    title: "Neurobion Forte Strip Of 30 Tablets",
    image: "/images/neurobion.png",
    oldPrice: 46.1,
    newPrice: 46.1,
    discount: 0,
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
  },
  {
    title: "Sebamed Clear Face Cleansing Foam - 150ml",
    image: "/images/sebamed.png",
    oldPrice: 680.0,
    newPrice: 564.4,
    discount: 17,
    bgGradient: "bg-gradient-to-br from-pink-100 to-red-50",
  },
  {
    title: "Lite Glo Face Wash Tube Of 100 Ml",
    image: "/images/lite.png",
    oldPrice: 499.0,
    newPrice: 429.14,
    discount: 14,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
  },
];

export { products as newLaunchesProducts };