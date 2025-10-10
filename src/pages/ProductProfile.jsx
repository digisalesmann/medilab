// src/pages/ProductProfile.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newLaunchesProducts,
  trendingProducts,
  wellnessEssentials,
  deals,
  products as homeProducts,
} from "../data/mockData";
import { useCart } from "../context/CartContext";
import {
  Star,
  CheckCircle2,
  Info,
  ListChecks,
  FileText,
  Newspaper,
  Minus,
  Plus,
} from "lucide-react";

// --- Existing Articles and Helper Functions (omitted for brevity) ---
// (All existing functions like slugify, catalogLists, normalizeProduct, getAllCatalogProducts,
// pickRelated, pickFrequentlyBought, buildRatingBreakdown, sampleReviews, and ProductTile are assumed to be here)

// Start of copied/modified helper functions
function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
function catalogLists() {
  return [homeProducts, newLaunchesProducts, trendingProducts, wellnessEssentials, deals].filter(
    Array.isArray
  );
}

function normalizeProduct(p) {
  const title = p.title || p.name || "Product";
  const image = p.image || p.img || "/images/placeholder.png";

  const rawImages = (Array.isArray(p.images) && p.images.length ? p.images : [image]).filter(Boolean);
  const images =
    rawImages.length >= 3
      ? rawImages
      : [...rawImages, ...Array.from({ length: 3 - rawImages.length }).map(() => rawImages[0])];

  const price = Number(p.price ?? p.newPrice ?? 0);
  const mrp = Number(p.mrp ?? p.oldPrice ?? 0);
  const discount = p.discount ?? (mrp > 0 && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);
  const bgGradient = p.bgGradient || "bg-white";

  const brand = p.brand || "MediLab";
  const rating = Number(p.rating || 4.3);
  const reviews = Number(p.reviews || 87);

  const highlights =
    p.highlights ||
    [
      "Quality assured and sourced from trusted suppliers",
      "Carefully packaged for safe delivery",
      "Suitable for everyday wellness routines",
    ];

  const description =
    p.description ||
    `Discover ${title}: a high-quality wellness product curated by ${brand}. For best results, follow the usage instructions provided on the label.`;

  const specs =
    p.specs ||
    [
      "Country of origin: Nigeria",
      "Shelf life: 24 months",
      "Storage: Cool, dry place away from sunlight",
      "Manufacturer: MediLab Partners",
    ];

  const productReviews = Array.isArray(p.reviewsList) ? p.reviewsList : null;
  const productArticles = Array.isArray(p.articles) ? p.articles : null;

  return {
    ...p,
    __slug: slugify(title),
    __title: title,
    __image: image,
    __images: images,
    __price: price || mrp || 0,
    __mrp: mrp,
    __discount: discount,
    __bg: bgGradient,
    __brand: brand,
    __rating: rating,
    __reviews: reviews,
    __highlights: highlights,
    __description: description,
    __specs: specs,
    __reviewsList: productReviews,
    __articles: productArticles,
  };
}

function getAllCatalogProducts() {
  return catalogLists()
    .flatMap((arr) => arr || [])
    .map(normalizeProduct)
    .reduce((acc, p) => {
      if (!acc.some((x) => x.__slug === p.__slug)) acc.push(p);
      return acc;
    }, []);
}

function pickRelated(base, all, limit = 10) {
  if (!base) return [];
  const key = base.__title.toLowerCase().split(" ")[0];
  const pool = all.filter((p) => p.__slug !== base.__slug);
  const close = pool.filter((p) => p.__title.toLowerCase().includes(key));
  return (close.length ? close : pool).slice(0, limit);
}
function pickFrequentlyBought(base, all, limit = 6) {
  if (!base) return [];
  const pool = all.filter((p) => p.__slug !== base.__slug);
  return pool.slice(0, limit);
}

/* ---------- local tile ---------- */
function ProductTile({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-lg cursor-pointer transition duration-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      aria-label={`View ${item.__title}`}
    >
      <div className={`w-full aspect-square rounded-lg ${item.__bg} flex items-center justify-center`}>
        <img src={item.__image} alt={item.__title} className="max-h-[80%] object-contain" />
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 line-clamp-2">{item.__title}</p>
        <div className="text-xs text-gray-400">
          {item.__mrp > item.__price && (
            <>
              MRP <span className="line-through">₦{Number(item.__mrp).toLocaleString()}</span>
              {" · "}
            </>
          )}
          <span className="font-semibold text-gray-900">₦{Number(item.__price).toLocaleString()}</span>
        </div>
        {item.__discount > 0 && (
          <p className="text-[11px] text-red-500 font-semibold mt-0.5">{item.__discount}% off</p>
        )}
      </div>
    </div>
  );
}

/* ---------- fallbacks for reviews & articles ---------- */
function buildRatingBreakdown(avg = 4.2) {
  const dist = [0, 0, 0, 0, 0];
  if (avg >= 4.5) dist.splice(0, 5, 6, 4, 9, 19, 62);
  else if (avg >= 4.0) dist.splice(0, 5, 7, 8, 10, 19, 56);
  else if (avg >= 3.5) dist.splice(0, 5, 9, 12, 26, 28, 25);
  else dist.splice(0, 5, 12, 18, 30, 24, 16);
  return dist; // 1..5 stars
}
function sampleReviews(title, rating, count) {
  const names = ["Adaobi", "Chukwuemeka", "Ifeoma", "Idris", "Ogechi", "Funmi", "Tunde", "Amara"];
  const comments = [
    `Works as described. Helped a lot with daily use of ${title}.`,
    "Packaging was neat and delivery was quick.",
    "Good value for money. Will reorder.",
    "Quality could be better but overall fine.",
    "Love the texture and it feels premium.",
    "Saw results after a week of consistent use.",
  ];
  const out = [];
  for (let i = 0; i < Math.min(6, Math.max(3, Math.ceil(count / 30))); i++) {
    out.push({
      user: names[i % names.length],
      rating: Math.max(3, Math.min(5, Math.round(rating + (Math.random() * 1 - 0.5)))),
      comment: comments[i % comments.length],
      daysAgo: 2 + i * 7,
    });
  }
  return out;
}
const articles = [
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

// --- New Tabbed Content Component ---

const TabbedContent = ({ sections, activeTab, setActiveTab }) => {
  const activeSection = sections.find(s => s.id === activeTab) || sections[0];

  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {/* Tabs Menu - Adjusted spacing for mobile */}
      <div className="border-b border-gray-200 overflow-x-auto scroll-hide">
        <nav className="-mb-px flex space-x-4 md:space-x-8 px-5 pt-3 w-max md:w-full" aria-label="Tabs">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`
                ${section.id === activeTab
                  ? "border-emerald-600 text-emerald-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
                whitespace-nowrap py-3 px-1 border-b-2 text-sm transition duration-150 ease-in-out focus:outline-none
              `}
            >
              <div className="flex items-center gap-2">
                {section.icon}
                <span>{section.title}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {activeSection.content}
      </div>
    </div>
  );
};

/* ----------------- page ----------------- */

// Utility class for hiding scrollbars but allowing scroll
const style = document.createElement('style');
style.innerHTML = `
.scroll-hide::-webkit-scrollbar {
    display: none;
}
.scroll-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}
`;
document.head.appendChild(style);

export default function ProductProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const allProducts = useMemo(getAllCatalogProducts, []);
  const product = useMemo(() => allProducts.find((p) => p.__slug === slug) || null, [slug, allProducts]);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // New state for tabs

  const gallery = useMemo(() => {
    if (!product) return ["/images/placeholder.png", "/images/placeholder.png", "/images/placeholder.png"];
    const imgs = (product.__images?.length ? product.__images : [product.__image]).filter(Boolean);
    return imgs.length >= 3 ? imgs : [...imgs, ...Array.from({ length: 3 - imgs.length }).map(() => imgs[0])];
  }, [product]);

  useEffect(() => {
    setActiveImg(0);
    setActiveTab("description"); // Reset tab on product change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const onKeyDownGallery = useCallback(
    (e) => {
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % gallery.length);
      else if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  const related = useMemo(() => pickRelated(product, allProducts, 10), [product, allProducts]);
  const frequentlyBought = useMemo(
    () => pickFrequentlyBought(product, allProducts, 6),
    [product, allProducts]
  );

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-600 mb-4">We couldn’t locate this item. Try browsing from the home page.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const {
    __title: title,
    __brand: brand,
    __price: price,
    __mrp: mrp,
    __discount: discount,
    __rating: rating,
    __reviews: reviewsCount,
    __bg: bg,
    __description: description,
    __highlights: highlights,
    __specs: specs,
    __reviewsList,
  } = product;

  const savings =
    mrp > price ? `You save ₦${(mrp - price).toLocaleString()} (${discount}% off)` : null;

  const canAdd = qty > 0;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addToCart({
      sku: product.sku || product.__slug,
      name: title,
      image: gallery[activeImg],
      price,
      qty,
      pharmacyId: "global",
      pharmacyName: "MediLab Marketplace",
    });
    // Removed navigation to cart for premium feel - a notification banner is typical instead.
    // navigate("/cart"); 
  };

  const dist = buildRatingBreakdown(rating);
  const reviewsList = __reviewsList || sampleReviews(title, rating, reviewsCount);

  // --- Tab Content Definitions (Same as before) ---
  const tabSections = [
    {
      id: "description",
      title: "About",
      icon: <FileText className="w-4 h-4 text-purple-600" />,
      content: (
        <p className="text-sm text-gray-700 leading-relaxed text-left">
          {description}
        </p>
      ),
    },
    {
      id: "highlights",
      title: "Key Highlights",
      icon: <ListChecks className="w-4 h-4 text-emerald-600" />,
      content: (
        // Adjusted to single column on mobile for better flow
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {(highlights || []).map((h, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700 text-left leading-snug">{h}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "specs",
      title: "Specifications",
      icon: <Info className="w-4 h-4 text-sky-600" />,
      content: (
        // Ensured specifications are readable on small screens
        <dl className="divide-y divide-gray-100">
          {(specs || []).map((s, i) => {
            const [label, ...rest] = s.split(":");
            const value = rest.join(":").trim();
            return (
              <div key={i} className="py-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                <dt className="text-sm font-medium text-gray-500 col-span-1 text-left">
                  {label}
                </dt>
                <dd className="text-sm text-gray-900 col-span-1 md:col-span-2 text-left">
                  {value || "—"}
                </dd>
              </div>
            );
          })}
        </dl>
      ),
    },
    {
      id: "reviews",
      title: `Reviews (${reviewsCount})`,
      icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />,
      content: (
        <>
          {/* Adjusted grid for review score for mobile (stacked) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Score card */}
            <div className="bg-gray-50 border rounded-lg p-4 h-full">
              <div className="text-left">
                <div className="text-4xl font-semibold text-gray-900">
                  {rating.toFixed(1)}
                  <span className="text-xl text-gray-400">/5</span>
                </div>
                <div className="mt-1 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{reviewsCount} Ratings</p>
              </div>
            </div>

            {/* Distribution */}
            <div className="bg-gray-50 border rounded-lg p-4 h-full">
              {[5, 4, 3, 2, 1].map((stars) => {
                const pct = dist[stars - 1];
                return (
                  <div key={stars} className="flex items-center gap-3 mb-2">
                    <div className="w-14 text-xs text-gray-600">{stars} stars</div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-8 text-right text-xs text-gray-700">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Recent reviews */}
          <div className="mt-5 space-y-4">
            <h4 className="font-semibold text-gray-900 text-left">Recent Reviews</h4>
            {reviewsList.map((r, i) => (
              <div key={i} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{r.user}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-700 text-left">{r.comment}</p>
                <p className="mt-1 text-xs text-gray-400 text-left">{r.daysAgo} days ago</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
  ];

  // --- New Quantity Selector Component ---
  const QtySelector = () => (
    <div className="flex items-center border border-gray-300 rounded-lg p-1">
      <button
        onClick={() => setQty(Math.max(1, qty - 1))}
        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition"
        aria-label="Decrease quantity"
        disabled={qty <= 1}
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
        className="w-10 text-center text-sm font-medium border-none focus:ring-0 p-0"
        aria-label="Quantity"
      />
      <button
        onClick={() => setQty(qty + 1)}
        className="p-1 text-gray-600 hover:bg-gray-100 rounded-md transition"
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:pb-8 bg-gray-50 min-h-screen">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">

        {/* LEFT COLUMN: Gallery & Product Details Tabs */}
        <div className="lg:col-span-8 space-y-8 pb-20 lg:pb-0">

          {/* GALLERY BLOCK */}
          <div className="bg-white border rounded-2xl shadow-lg p-4 sm:p-5 md:p-7">
            {/* Gallery */}
            <div
              className="space-y-4"
              onKeyDown={onKeyDownGallery}
              tabIndex={0}
              aria-label="Product image gallery"
            >
              {/* Main Image - Made height flexible for mobile */}
              <div className={`w-full border rounded-xl ${bg} flex items-center justify-center p-4 md:p-5 h-[300px] sm:h-[350px] md:h-[400px]`}>
                <img
                  src={gallery[activeImg]}
                  alt={`${title} – ${activeImg + 1}`}
                  className="max-h-full object-contain"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto scroll-hide">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`border-2 rounded-lg p-1 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition duration-200 flex-shrink-0
                      ${i === activeImg ? "border-emerald-600 shadow-md" : "border-gray-200 hover:border-gray-400"}`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${title} – ${i + 1}`} className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* MOBILE/TABLET HEADER (NEW POSITION) - 
            This block now sits *after* the gallery block in the flow, 
            and it is hidden on desktop (lg:hidden) 
          */}
          <div className="lg:hidden p-0"> {/* Removed container padding/border here since it's already in the gallery block */}
            <div className="text-left px-4 sm:px-0"> {/* Added left alignment for text */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 font-medium">
                  {brand}
                </span>
                {discount > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold">
                    SAVE {discount}%
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-2">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm mb-4">
                <div className="flex items-center" aria-label={`${rating} star rating`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{rating.toFixed(1)}</span>
                <span className="text-gray-400">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-gray-500 hover:text-emerald-600 transition"
                  aria-label={`View ${reviewsCount} reviews`}
                >
                  {reviewsCount} ratings
                </button>
              </div>
              {/* Price block for mobile/tablet just under the title/ratings */}
              <div className="flex items-end gap-3 pb-3">
                <span className="text-3xl font-bold text-emerald-700">
                  ₦{Number(price).toLocaleString()}
                </span>
                {mrp > price && (
                  <span className="text-lg text-gray-400 line-through">
                    ₦{Number(mrp).toLocaleString()}
                  </span>
                )}
              </div>
              {savings && <p className="text-sm text-emerald-700 font-medium mb-4">{savings}</p>}
            </div>
          </div>
          
          {/* PRODUCT OVERVIEW: Tabbed Sections */}
          <section>
            <h2 className="sr-only">Product Details</h2>
            <TabbedContent
              sections={tabSections}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </section>
        </div>
        
        {/* RIGHT COLUMN: Desktop Info & Purchase Block */}
        <div className="lg:col-span-4 text-left mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-28 space-y-6">

            {/* Product Header (Desktop Only) - This stays as a dedicated desktop header/price block */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200 font-medium">
                  {brand}
                </span>
                {discount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold">
                    SAVE {discount}%
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-snug">
                {title}
              </h1>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <div className="flex items-center" aria-label={`${rating} star rating`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">{rating.toFixed(1)}</span>
                <span className="text-gray-400">·</span>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-gray-500 hover:text-emerald-600 transition"
                  aria-label={`View ${reviewsCount} reviews`}
                >
                  {reviewsCount} ratings
                </button>
              </div>
            </div>

            {/* Price & CTA Card (Desktop Only) - Mobile uses a sticky bar */}
            <div className="hidden lg:block bg-white border rounded-xl p-5 shadow-lg">
              <div className="flex flex-col gap-3">
                
                {/* Price Block */}
                <div className="flex items-end gap-3 border-b pb-3">
                  <span className="text-3xl font-bold text-emerald-700">
                    ₦{Number(price).toLocaleString()}
                  </span>
                  {mrp > price && (
                    <span className="text-lg text-gray-400 line-through">
                      ₦{Number(mrp).toLocaleString()}
                    </span>
                  )}
                </div>
                {savings && <p className="text-sm text-emerald-700 font-medium">{savings}</p>}

                {/* Quantity and Cart */}
                <div className="mt-3 flex items-center gap-4">
                  <label className="text-sm text-gray-700 font-medium" htmlFor="qty-input-new">Quantity:</label>
                  <QtySelector />
                </div>

                <button
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                  className={`w-full px-5 py-3 mt-4 rounded-xl text-white font-semibold uppercase tracking-wider transition duration-200 shadow-md hover:shadow-lg
                    ${canAdd ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  {canAdd ? "Add to Cart" : "Out of Stock"}
                </button>
                
                {/* Trust Badges */}
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>In Stock</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-sky-500" />
                    <span>Free Shipping</span>
                  </div>
                </div>

              </div>
            </div>
            
          </div>
        </div>

      </div> {/* End of main grid */}
      
      {/* ------------------- STICKY MOBILE CTA BAR ------------------- */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-4 shadow-2xl z-20">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ₦{Number(price * qty).toLocaleString()}
            </span>
            {mrp > price && (
              <span className="text-xs text-gray-400 line-through">
                ₦{Number(mrp * qty).toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <QtySelector />
            <button
              disabled={!canAdd}
              onClick={handleAddToCart}
              className={`px-4 py-2 flex-1 rounded-xl text-white font-semibold text-sm transition duration-200 shadow-md
                ${canAdd ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"}`}
            >
              {canAdd ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
      {/* ----------------- END STICKY MOBILE CTA BAR ----------------- */}
      
      {/* ---------- RELATED ARTICLES (Moved outside the main grid for full-width look) ---------- */}
      <section className="mt-12 bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Related Health Insights
            </h2>
          </div>
          <a
            href="/articles"
            className="text-emerald-600 text-sm font-medium hover:underline whitespace-nowrap"
          >
            View All Articles &rarr;
          </a>
        </div>

        <div className="overflow-x-auto scroll-hide">
          <div className="flex space-x-4 w-max pb-2">
            {articles.slice(0, 4).map((article, index) => (
              <a
                href={article.link}
                key={index}
                className="min-w-[200px] max-w-[250px] bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition duration-300 block"
              >
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="text-sm text-gray-800 font-medium line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="text-xs text-emerald-600 mt-2">Read More</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RELATED & FBT (Re-styled section titles) ---------- */}
      <section className="mt-12">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-left mb-4">You Might Also Like</h3>
        <div className="flex gap-4 scroll-hide overflow-x-auto pb-2">
          {related.map((item) => (
            <ProductTile
              key={item.__slug}
              item={item}
              onClick={() => navigate(`/product/${item.__slug}`)}
            />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-left mb-4">Frequently Bought Together</h3>
        <div className="flex gap-4 scroll-hide overflow-x-auto pb-2">
          {frequentlyBought.map((item) => (
            <ProductTile
              key={item.__slug}
              item={item}
              onClick={() => navigate(`/product/${item.__slug}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}