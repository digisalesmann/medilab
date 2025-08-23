import React from "react";
import { Link } from "react-router-dom";
import {
  Stethoscope,        // Medicine
  FileText,           // Health Info
  Dumbbell,           // Fitness
  Baby,               // Mom & Baby
  Cpu,                // Devices
  Leaf,               // Wellness
  Dog,                // Pet Supplies
  Sparkles,           // Skin/Beauty
  ArrowUpRight,
  Star,
  ShieldCheck,
  Truck,
} from "lucide-react";

/**
 * DATA MODEL
 * - Each category can define: slug, icon, description, highlights, subcategories, featured brands, and promos.
 * - You can safely remove/add items; the UI adapts automatically.
 */
const CATEGORIES = [
  {
    key: "medicine",
    name: "Medicine",
    slug: "/category/medicine",
    icon: Stethoscope,
    color: "emerald",
    description: "Prescription & OTC drugs from verified pharmacies.",
    highlights: ["Rx & OTC", "NDA certified", "Cold-chain handling"],
    subcategories: [
      { name: "Prescription (Rx)", to: "/category/medicine/prescription", badge: "Rx" },
      { name: "Over‑the‑Counter", to: "/category/medicine/otc", badge: "OTC" },
      { name: "Chronic Care", to: "/category/medicine/chronic" },
      { name: "Pain & Fever", to: "/category/medicine/analgesics" },
      { name: "Cough, Cold & Flu", to: "/category/medicine/cold-flu" },
      { name: "Antibiotics ⚠", to: "/category/medicine/antibiotics" },
    ],
    brands: ["Pfizer", "GSK", "Sanofi", "Novartis", "Emzor"],
    promos: [{ title: "Up to 10% off Rx refills", to: "/plus" }],
  },

  {
    key: "health-info",
    name: "Health Info",
    slug: "/category/health-info",
    icon: FileText,
    color: "sky",
    description: "Doctor‑reviewed guides, symptoms, and self‑care tips.",
    highlights: ["Doctor reviewed", "Localised content", "Plain‑English"],
    subcategories: [
      { name: "Conditions A‑Z", to: "/category/health-info/conditions" },
      { name: "Drugs A‑Z", to: "/category/health-info/drugs" },
      { name: "Lab Tests A‑Z", to: "/category/health-info/labs" },
      { name: "First Aid", to: "/category/health-info/first-aid" },
      { name: "Women’s Health", to: "/category/health-info/women" },
      { name: "Men’s Health", to: "/category/health-info/men" },
    ],
    brands: ["MediLab Library", "WHO", "CDC"],
    promos: [{ title: "Free symptom checker", to: "/services/symptom-checker" }],
  },

  {
    key: "fitness",
    name: "Fitness",
    slug: "/category/fitness",
    icon: Dumbbell,
    color: "orange",
    description: "Nutrition, supplements, and performance accessories.",
    highlights: ["Whey & Creatine", "Electrolytes", "Accessories"],
    subcategories: [
      { name: "Supplements", to: "/category/fitness/supplements" },
      { name: "Protein & Gain", to: "/category/fitness/protein" },
      { name: "Weight Management", to: "/category/fitness/weight" },
      { name: "Electrolytes", to: "/category/fitness/electrolytes" },
      { name: "Accessories", to: "/category/fitness/accessories" },
      { name: "Sports Recovery", to: "/category/fitness/recovery" },
    ],
    brands: ["Optimum", "MyProtein", "Gatorade", "ONNIT"],
  },

  {
    key: "mom-baby",
    name: "Mom & Baby",
    slug: "/category/mom-baby",
    icon: Baby,
    color: "pink",
    description: "Maternity care, baby food, diapers, and essentials.",
    highlights: ["Trusted brands", "Gentle formulas", "Paediatric safe"],
    subcategories: [
      { name: "Maternity Care", to: "/category/mom-baby/maternity" },
      { name: "Baby Food & Formula", to: "/category/mom-baby/food" },
      { name: "Diapers & Wipes", to: "/category/mom-baby/diapers" },
      { name: "Bath & Skincare", to: "/category/mom-baby/skincare" },
      { name: "Vitamins", to: "/category/mom-baby/vitamins" },
      { name: "Feeding & Nursing", to: "/category/mom-baby/feeding" },
    ],
    brands: ["Johnson’s", "Huggies", "Pampers", "Cerelac"],
    promos: [{ title: "Bundle & save on diapers", to: "/deals" }],
  },

  {
    key: "devices",
    name: "Devices",
    slug: "/category/devices",
    icon: Cpu,
    color: "indigo",
    description: "Medical devices and smart health gadgets.",
    highlights: ["Warranty", "ISO compliant", "On‑site support"],
    subcategories: [
      { name: "BP Monitors", to: "/category/devices/bp" },
      { name: "Glucometers", to: "/category/devices/glucose" },
      { name: "Nebulisers", to: "/category/devices/nebuliser" },
      { name: "Thermometers", to: "/category/devices/thermometer" },
      { name: "Pulse Oximeters", to: "/category/devices/pulse-ox" },
      { name: "Smart Wearables", to: "/category/devices/wearables" },
    ],
    brands: ["Omron", "Roche", "Microlife", "Beurer"],
  },

  {
    key: "wellness",
    name: "Wellness",
    slug: "/category/wellness",
    icon: Leaf,
    color: "green",
    description: "Vitamins, minerals, and everyday self‑care.",
    highlights: ["Vegan options", "Third‑party tested", "Great prices"],
    subcategories: [
      { name: "Multivitamins", to: "/category/wellness/multivitamins" },
      { name: "Immunity", to: "/category/wellness/immunity" },
      { name: "Sleep & Calm", to: "/category/wellness/sleep" },
      { name: "Gut Health", to: "/category/wellness/gut" },
      { name: "Heart Health", to: "/category/wellness/heart" },
      { name: "Joint Care", to: "/category/wellness/joint" },
    ],
    brands: ["Nature Made", "Vitafusion", "NOW Foods", "Blackmores"],
  },

  {
    key: "pets",
    name: "Pet Supplies",
    slug: "/category/pets",
    icon: Dog,
    color: "amber",
    description: "Vet‑approved care and nutrition for your pets.",
    highlights: ["Vet‑approved", "Safe dosing", "Great taste"],
    subcategories: [
      { name: "Flea & Tick", to: "/category/pets/flea-tick" },
      { name: "Vitamins", to: "/category/pets/vitamins" },
      { name: "Shampoo & Grooming", to: "/category/pets/grooming" },
      { name: "Dental Care", to: "/category/pets/dental" },
      { name: "Digestive Care", to: "/category/pets/digestive" },
      { name: "Food & Treats", to: "/category/pets/food" },
    ],
    brands: ["Royal Canin", "Pedigree", "Frontline"],
  },

  {
    key: "beauty",
    name: "Skin Care/Beauty",
    slug: "/category/beauty",
    icon: Sparkles,
    color: "rose",
    description: "Dermatologist‑recommended skincare and cosmetics.",
    highlights: ["Derm‑tested", "Fragrance‑free picks", "SPF essentials"],
    subcategories: [
      { name: "Cleansers", to: "/category/beauty/cleansers" },
      { name: "Moisturisers", to: "/category/beauty/moisturisers" },
      { name: "Sunscreen (SPF)", to: "/category/beauty/spf" },
      { name: "Treatment Serums", to: "/category/beauty/serums" },
      { name: "Acne Care", to: "/category/beauty/acne" },
      { name: "Body Care", to: "/category/beauty/body" },
    ],
    brands: ["CeraVe", "La Roche‑Posay", "The Ordinary", "Nivea"],
    promos: [{ title: "Derm‑approved SPF picks", to: "/category/beauty/spf" }],
  },
];

// Small chips used across the grid
function Chip({ children, tone = "gray" }) {
  const palette = {
    gray: "bg-gray-100 text-gray-700",
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-700",
    orange: "bg-orange-50 text-orange-700",
    pink: "bg-pink-50 text-pink-700",
    indigo: "bg-indigo-50 text-indigo-700",
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${palette[tone] || palette.gray}`}>
      {children}
    </span>
  );
}

function CategoryCard({ c }) {
  const Icon = c.icon;
  const tone = c.color;

  return (
    <div className="group relative rounded-2xl border bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Top bar with icon + title */}
      <div className="flex items-start gap-3 p-4 md:p-5">
        <div className={`rounded-xl p-2.5 ring-1 ring-${tone}-100 bg-${tone}-50 text-${tone}-700`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link to={c.slug} className="text-base md:text-lg font-semibold text-gray-900 hover:text-emerald-700">
              {c.name}
            </Link>
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600" />
          </div>
          <p className="mt-1 text-sm text-gray-600">{c.description}</p>

          {/* Highlights */}
          {c.highlights?.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {c.highlights.map((h) => (
                <Chip key={h} tone={tone}>{h}</Chip>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* Content grid: subcategories + brands + trust strip */}
      <div className="px-4 md:px-5 pb-4 md:pb-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Subcategories list */}
          <div className="md:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {c.subcategories?.map((s) => (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group/row flex items-center justify-between rounded-lg border p-2 hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-700 group-hover/row:text-gray-900">{s.name}</span>
                  {s.badge && <Chip tone={tone}>{s.badge}</Chip>}
                </Link>
              ))}
            </div>
          </div>

          {/* Brands + promos */}
          <div className="md:col-span-4">
            {/* Featured brands (simple pills; replace with logos later) */}
            {!!c.brands?.length && (
              <>
                <div className="text-xs font-semibold text-gray-500 mb-1">Featured brands</div>
                <div className="flex flex-wrap gap-1.5">
                  {c.brands.slice(0, 6).map((b) => (
                    <Chip key={b} tone="gray">
                      <Star className="w-3 h-3 mr-1 opacity-70" />
                      {b}
                    </Chip>
                  ))}
                </div>
              </>
            )}

            {/* Promo(s) */}
            {!!c.promos?.length && (
              <div className="mt-3 space-y-2">
                {c.promos.map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="block rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-100"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust/benefits strip */}
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border bg-gray-50 px-3 py-2 text-xs text-gray-700">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Quality‑checked sellers
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            Same‑day delivery (cities)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Easy returns on eligible items
          </span>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPanel() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
      {/* Header */}
      <header className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shop by Category</h2>
        <p className="mt-1 text-sm text-gray-600">
          Explore medicines, wellness, devices, and more — all verified and delivered fast.
        </p>
      </header>

      {/* Search hint / optional quick search */}
      <div className="mb-6 hidden sm:block">
        <div className="relative max-w-xl">
          <input
            type="search"
            placeholder="Search products, brands or conditions…"
            className="w-full rounded-xl border px-4 py-2.5 pr-10 focus:ring-2 focus:ring-emerald-500 outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const q = e.currentTarget.value.trim();
                if (q) window.location.assign(`/search?q=${encodeURIComponent(q)}`);
              }
            }}
          />
          <ArrowUpRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Grid of category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {CATEGORIES.map((c) => (
          <CategoryCard key={c.key} c={c} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 md:mt-10 text-center">
        <Link
          to="/brands"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          Browse all brands <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}