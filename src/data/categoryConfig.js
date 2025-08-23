// Central config used by Header, CategoryHub, SEO, etc.
import {
  Stethoscope,
  FileText,
  Dumbbell,
  Baby,
  Cpu,
  Leaf,
  Dog,
  Sparkles,
} from "lucide-react";

export const CATEGORIES = [
  {
    slug: "medicine",
    label: "Medicine",
    Icon: Stethoscope,
    color: "text-emerald-600",
    hero: {
      title: "Prescription & OTC Medicines",
      subtitle:
        "Shop genuine prescription and over-the-counter meds from licensed pharmacies. Fast delivery and pharmacist support.",
      image:
        "https://images.pexels.com/photos/3873172/pexels-photo-3873172.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Pain Relief",
      "Antibiotics",
      "Allergy",
      "Cold & Flu",
      "Digestive Health",
      "Heart Health",
      "Diabetes Care",
      "Women's Health",
    ],
  },
  {
    slug: "health-info",
    label: "Health Info",
    Icon: FileText,
    color: "text-teal-600",
    hero: {
      title: "Guides, Conditions & Self-Care",
      subtitle:
        "Reliable health articles reviewed by professionals. Learn symptoms, treatments, prevention and lifestyle tips.",
      image:
        "https://images.pexels.com/photos/4021803/pexels-photo-4021803.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Conditions A-Z",
      "Medication Guides",
      "Nutrition",
      "Mental Health",
      "Sexual Health",
      "Healthy Living",
    ],
  },
  {
    slug: "fitness",
    label: "Fitness",
    Icon: Dumbbell,
    color: "text-orange-600",
    hero: {
      title: "Supplements & Performance",
      subtitle:
        "Protein, pre-workout, electrolytes and recovery essentials to power every goal—from beginner to pro.",
      image:
        "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Protein",
      "Pre-Workout",
      "BCAAs",
      "Creatine",
      "Electrolytes",
      "Recovery",
    ],
  },
  {
    slug: "mom-baby",
    label: "Mom & Baby",
    Icon: Baby,
    color: "text-pink-600",
    hero: {
      title: "Maternity & Baby Essentials",
      subtitle:
        "Prenatal vitamins, diapers, formula and gentle care products approved for moms and little ones.",
      image:
        "https://images.pexels.com/photos/3875210/pexels-photo-3875210.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Prenatal",
      "Postnatal",
      "Baby Care",
      "Formula",
      "Diapers",
      "Bath & Skin",
    ],
  },
  {
    slug: "devices",
    label: "Devices",
    Icon: Cpu,
    color: "text-blue-600",
    hero: {
      title: "Health Devices & Monitoring",
      subtitle:
        "Blood pressure monitors, glucometers, thermometers and smart devices to track your health at home.",
      image:
        "https://images.pexels.com/photos/4226122/pexels-photo-4226122.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "BP Monitors",
      "Glucometers",
      "Thermometers",
      "Nebulizers",
      "Pulse Oximeters",
      "Smart Scales",
    ],
  },
  {
    slug: "wellness",
    label: "Wellness",
    Icon: Leaf,
    color: "text-green-600",
    hero: {
      title: "Vitamins, Sleep & Immune Support",
      subtitle:
        "Daily vitamins, minerals, herbal blends and sleep aids to help you feel your best.",
      image:
        "https://images.pexels.com/photos/4045662/pexels-photo-4045662.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Multivitamins",
      "Vitamin C & D",
      "Immune Support",
      "Sleep",
      "Stress",
      "Joint Care",
    ],
  },
  {
    slug: "pet-supplies",
    label: "Pet Supplies",
    Icon: Dog,
    color: "text-amber-600",
    hero: {
      title: "Pet Health & Care",
      subtitle:
        "Vet-approved supplements, hygiene products and care accessories for dogs and cats.",
      image:
        "https://images.pexels.com/photos/4587995/pexels-photo-4587995.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Supplements",
      "Dental Care",
      "Shampoo",
      "Flea & Tick",
      "Grooming",
    ],
  },
  {
    slug: "skin-care-beauty",
    label: "Skin Care/Beauty",
    Icon: Sparkles,
    color: "text-violet-600",
    hero: {
      title: "Dermatologist-Trusted Skin Care",
      subtitle:
        "SPF, retinol, acne care and brightening solutions curated for healthy, radiant skin.",
      image:
        "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    },
    subcategories: [
      "Cleanser",
      "Moisturizer",
      "SPF",
      "Retinol",
      "Acne Care",
      "Brightening",
    ],
  },
];

// helpers
export const categoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);
export const categoryPath = (slug, tab = "shop") => `/hub/${slug}#${tab}`;
