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
} from "lucide-react";

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

/* ----------------- helpers ----------------- */

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
      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md cursor-pointer transition"
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

/* ----------------- page ----------------- */

export default function ProductProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const allProducts = useMemo(getAllCatalogProducts, []);
  const product = useMemo(() => allProducts.find((p) => p.__slug === slug) || null, [slug, allProducts]);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

  const gallery = useMemo(() => {
    if (!product) return ["/images/placeholder.png", "/images/placeholder.png", "/images/placeholder.png"];
    const imgs = (product.__images?.length ? product.__images : [product.__image]).filter(Boolean);
    return imgs.length >= 3 ? imgs : [...imgs, ...Array.from({ length: 3 - imgs.length }).map(() => imgs[0])];
  }, [product]);

  useEffect(() => {
    setActiveImg(0);
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
    navigate("/cart");
  };

  const dist = buildRatingBreakdown(rating);
  const reviewsList = __reviewsList || sampleReviews(title, rating, reviewsCount);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      {/* PRIMARY: Gallery + Buy block */}
      <div className="bg-white border rounded-2xl shadow-sm">
        <div className="p-5 md:p-7 lg:p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* LEFT: Gallery */}
            <div
              className="col-span-12 lg:col-span-5 space-y-3"
              onKeyDown={onKeyDownGallery}
              tabIndex={0}
              aria-label="Product image gallery"
            >
              <div className={`w-full border rounded-xl ${bg} flex items-center justify-center p-4 md:p-5`}>
                <img
                  src={gallery[activeImg]}
                  alt={`${title} – ${activeImg + 1}`}
                  className="max-h-[320px] md:max-h-[360px] object-contain"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto scroll-hide">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`border rounded-lg p-1 w-16 h-16 flex items-center justify-center transition
                      ${i === activeImg ? "border-gray-900 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${title} – ${i + 1}`} className="max-h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Info & CTAs */}
            <div className="col-span-12 lg:col-span-7 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                  {brand}
                </span>
                {discount > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <h1 className="text-left text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 leading-snug">
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
                <span className="text-gray-500">{reviewsCount} ratings</span>
              </div>

              <div className="mt-4 flex items-end gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl md:text-3xl font-semibold text-gray-900">
                    ₦{Number(price).toLocaleString()}
                  </span>
                  {mrp > price && (
                    <span className="text-sm md:text-base text-gray-400 line-through">
                      ₦{Number(mrp).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              {savings && <p className="mt-1 text-sm text-emerald-700 font-medium">{savings}</p>}

              <div className="mt-5 flex items-center gap-3">
                <label className="text-sm text-gray-700" htmlFor="qty-input">Qty</label>
                <input
                  id="qty-input"
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 border rounded-md px-3 py-2"
                />
                <button
                  disabled={!canAdd}
                  onClick={handleAddToCart}
                  className={`px-5 py-2 rounded text-white transition shadow-sm
                    ${canAdd ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- PRODUCT OVERVIEW: individual sections (left-aligned, not inside hero card) ---------- */}
        <section className="mt-10 space-y-8">
          {/* Highlights */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Key Highlights</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {(highlights || []).map((h, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 text-left leading-snug">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg font-semibold text-gray-900">Specifications</h2>
            </div>
            <dl className="divide-y divide-gray-100">
              {(specs || []).map((s, i) => {
                const [label, ...rest] = s.split(":");
                const value = rest.join(":").trim();
                return (
                  <div key={i} className="py-2 grid grid-cols-3 gap-4">
                    <dt className="text-sm font-medium text-gray-500 col-span-1 text-left">
                      {label}
                    </dt>
                    <dd className="text-sm text-gray-900 col-span-2 text-left">
                      {value || "—"}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          {/* About */}
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">About this item</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed text-left">
              {description}
            </p>
          </div>
        </section>

      {/* ---------- RATINGS & REVIEWS (equal height/width, left-aligned) ---------- */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ratings & Reviews</h2>

        <div className="grid md:grid-cols-12 gap-5 items-stretch">
          {/* Score card */}
          <div className="md:col-span-6">
            <div className="bg-white border rounded-xl p-5 h-full min-h-[200px] flex flex-col justify-between">
              <div>
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
              <p className="text-xs text-gray-400 mt-4">
                Ratings are aggregated from verified buyers.
              </p>
            </div>
          </div>

          {/* Distribution */}
          <div className="md:col-span-6">
            <div className="bg-white border rounded-xl p-5 h-full min-h-[200px]">
              {[5, 4, 3, 2, 1].map((stars) => {
                const pct = dist[stars - 1];
                return (
                  <div key={stars} className="flex items-center gap-3 mb-2">
                    <div className="w-14 text-sm text-gray-600">{stars} stars</div>
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-700">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent reviews (left-aligned) */}
        <div className="mt-5 bg-white border rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-3 text-left">Recent Reviews</h3>
          <div className="space-y-4">
            {reviewsList.map((r, i) => (
              <div key={i} className="border rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800">{r.user}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-700 text-left">{r.comment}</p>
                <p className="mt-1 text-xs text-gray-400 text-left">{r.daysAgo} days ago</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RELATED ARTICLES ---------- */}
      <section className="px-3 sm:px-5 py-5 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <Newspaper className="w-5 h-5 text-purple-600" />
            <h2 className="text-base sm:text-lg font-bold text-gray-800">
              Health Articles
            </h2>
          </div>
          <a
            href="/articles"
            className="text-teal-600 text-xs sm:text-sm font-medium hover:underline"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-1 sm:mx-0">
          <div className="flex space-x-3 px-1 sm:px-0 w-max">
            {articles.map((article, index) => (
              <a
                href={article.link}
                key={index}
                className="min-w-[160px] sm:min-w-[200px] max-w-[220px] bg-white rounded-lg shadow-sm hover:shadow-md transition hover:scale-[1.015]"
              >
                <img
                  src={article.img}
                  alt={article.title}
                  className="w-full h-28 sm:h-32 object-cover rounded-t-lg"
                />
                <div className="p-2">
                  <h3 className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-3">
                    {article.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
      </section>

      {/* ---------- RELATED & FBT ---------- */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 text-left">Related items</h3>
        </div>
        <div className="flex gap-3 scroll-hide overflow-x-auto pb-2">
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
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 text-left">Frequently bought together</h3>
        </div>
        <div className="flex gap-3 scroll-hide overflow-x-auto pb-2">
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
