// src/pages/ProductProfile.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  newLaunchesProducts,
  trendingProducts,
  wellnessEssentials,
  deals,
  products as homeProducts,
} from "../data/mockData";
import { useCart } from "../context/CartContext";

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
  const price = Number(p.price ?? p.newPrice ?? 0);
  const mrp = Number(p.mrp ?? p.oldPrice ?? 0);
  const discount = p.discount ?? (mrp > 0 && price > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0);
  const bgGradient = p.bgGradient || "bg-white";
  const images = Array.isArray(p.images) && p.images.length ? p.images : [image];

  // optional extra fields you can add in mockData in the future:
  const brand = p.brand || "MediLab";
  const rating = Number(p.rating || 4.3);
  const reviews = Number(p.reviews || 87);
  const highlights = p.highlights || null;
  const description =
    p.description ||
    "This is a high-quality wellness product curated by MediLab. For best results, follow the usage instructions provided on the label.";

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
  };
}

function getAllCatalogProducts() {
  return catalogLists()
    .flatMap((arr) => arr || [])
    .map(normalizeProduct)
    // de-dup by slug
    .reduce((acc, p) => {
      if (!acc.some((x) => x.__slug === p.__slug)) acc.push(p);
      return acc;
    }, []);
}

function pickRelated(base, all, limit = 10) {
  if (!base) return [];
  const key = base.__title.toLowerCase().split(" ")[0]; // crude similarity
  const pool = all.filter((p) => p.__slug !== base.__slug);
  const close = pool.filter((p) => p.__title.toLowerCase().includes(key));
  const out = (close.length ? close : pool).slice(0, limit);
  return out;
}

function pickFrequentlyBought(base, all, limit = 6) {
  if (!base) return [];
  // Prefer items from same section names if your data adds a tag later; for now random-ish:
  const pool = all.filter((p) => p.__slug !== base.__slug);
  return pool.slice(0, limit);
}

/* simple card used by rails */
function ProductTile({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-40 sm:w-48 lg:w-52 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-lg cursor-pointer transition"
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

/* ----------------- page ----------------- */

export default function ProductProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const allProducts = useMemo(getAllCatalogProducts, []);
  const product = useMemo(() => allProducts.find((p) => p.__slug === slug) || null, [slug, allProducts]);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);

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
    __reviews: reviews,
    __images: images,
    __bg: bg,
    __description: description,
    __highlights: highlights,
  } = product;

  const savings =
    mrp > price ? `You save ₦${(mrp - price).toLocaleString()} (${discount}% off)` : null;

  const canAdd = qty > 0;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addToCart({
      sku: product.sku || product.__slug,
      name: title,
      image: images[activeImg] || product.__image,
      price,
      qty,
      pharmacyId: "global",
      pharmacyName: "MediLab Marketplace",
    });
    navigate("/cart");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      <div className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Media gallery (smaller hero, thumbnails) */}
          <div className="w-full lg:w-5/12">
            <div className={`w-full border rounded-xl ${bg} flex items-center justify-center p-4`}>
              <img
                src={images[activeImg]}
                alt={`${title} - ${activeImg + 1}`}
                className="max-h-[360px] object-contain"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border rounded-lg p-1 w-16 h-16 flex items-center justify-center ${
                    i === activeImg ? "ring-2 ring-emerald-500" : ""
                  }`}
                >
                  <img src={src} alt={`thumb-${i}`} className="max-h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info + CTAs */}
          <div className="w-full lg:w-7/12 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {brand}
              </span>
              {discount > 0 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                  {discount}% OFF
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">{title}</h1>

            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 20 20"
                    className={`w-4 h-4 ${i < Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.634 1.122 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-gray-900">₦{Number(price).toLocaleString()}</span>
              {mrp > price && (
                <span className="text-sm text-gray-400 line-through">₦{Number(mrp).toLocaleString()}</span>
              )}
            </div>
            {savings && <p className="text-sm text-emerald-700 font-medium">{savings}</p>}

            {/* Qty + CTA (sticky on desktop) */}
            <div className="flex items-center gap-3 pt-1">
              <label className="text-sm text-gray-700">Qty</label>
              <input
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 border rounded-md px-3 py-2"
              />
              <button
                disabled={!canAdd}
                onClick={handleAddToCart}
                className={`px-5 py-2 rounded text-white transition ${
                  canAdd ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </div>

            {/* Highlights / About */}
            {highlights ? (
              <div className="pt-2">
                <h3 className="font-semibold mb-2">Key highlights</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="pt-2">
                <h3 className="font-semibold mb-2">About this item</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related items */}
      <section className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Related items</h3>
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

      {/* Frequently bought together */}
      <section className="mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Frequently bought together</h3>
        <div className="flex gap-3 scroll-hide overflow-x-scroll pb-2">
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
