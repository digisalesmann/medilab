import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  products,
  trendingProducts,
  newLaunchesProducts,
  wellnessEssentials,
  deals,
  brands,
} from "../data/mockData";

/* ---------------- utils ---------------- */
const slugify = (s = "") =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function normalize(item) {
  if (!item) return null;
  const title = item.title || item.name || "Product";
  const image = item.image || item.img || "/images/placeholder.png";
  const mrp = Number(item.mrp ?? item.oldPrice ?? 0);
  const price = Number(item.price ?? item.newPrice ?? 0);
  const brand = item.brand || null;
  const bg = item.bgGradient || item.bg || "";

  let images = Array.isArray(item.images) && item.images.length ? item.images.filter(Boolean) : [image];
  while (images.length < 3) images.push(image);

  return {
    _slug: slugify(title),
    _title: title,
    _image: image,
    _images: images,
    _mrp: mrp,
    _price: price || mrp || 0,
    _brand: brand ? String(brand).toLowerCase() : "",
    _bg: bg,
    _raw: item,
  };
}

function buildCatalog() {
  const sources = [
    ...(Array.isArray(products) ? products : []),
    ...(Array.isArray(trendingProducts) ? trendingProducts : []),
    ...(Array.isArray(newLaunchesProducts) ? newLaunchesProducts : []),
    ...(Array.isArray(wellnessEssentials) ? wellnessEssentials : []),
    ...(Array.isArray(deals) ? deals : []),
  ];
  const normalized = sources.map(normalize).filter(Boolean);
  const uniq = [];
  const seen = new Set();
  for (const p of normalized) {
    if (!seen.has(p._slug)) {
      seen.add(p._slug);
      uniq.push(p);
    }
  }
  return uniq;
}

function findBrandBySlug(slug) {
  const list = Array.isArray(brands) ? brands : [];
  const match = list.find((b) => b.slug === slug) || list.find((b) => slugify(b.name) === slug);
  return match || null;
}

/* --------------- page ------------------ */
export default function BrandStore() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const brand = useMemo(() => findBrandBySlug(slug), [slug]);
  const brandKey = useMemo(() => (brand?.name ? brand.name.toLowerCase() : ""), [brand]);

  const catalog = useMemo(buildCatalog, []);
  const items = useMemo(() => {
    if (!brandKey) return catalog;
    // match by normalized brand name OR title contains brand (fallback)
    return catalog.filter((p) => {
      if (p._brand) return p._brand === brandKey;
      return p._title.toLowerCase().includes(brandKey);
    });
  }, [catalog, brandKey]);

  if (!brand) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-bold text-gray-900">Brand not found</h1>
        <p className="text-gray-600 mt-2">Please select another brand.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {brand.img && (
          <img src={brand.img} alt={brand.name} className="w-12 h-12 object-contain rounded" />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{brand.name}</h1>
          <p className="text-gray-600 text-sm">Explore items from {brand.name}</p>
        </div>
      </div>

      {/* Sort/filter stub */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">All</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Under ₦1,000</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Discounts</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Top Rated</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <button
            key={`${p._slug}-${i}`}
            onClick={() => navigate(`/product/${p._slug}`)}
            className="border rounded-xl p-3 bg-white text-left hover:shadow transition"
          >
            <div className={`${p._bg || "bg-gray-50"} rounded-lg h-32 flex items-center justify-center`}>
              <img src={p._image} alt={p._title} className="h-20 object-contain" />
            </div>
            <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
              {p._title}
            </p>
            <div className="text-xs text-gray-500">
              {p._mrp > p._price && (
                <>
                  <span className="line-through mr-1">₦{p._mrp.toLocaleString()}</span>
                </>
              )}
              <strong>₦{p._price.toLocaleString()}</strong>
            </div>
          </button>
        ))}
      </div>

      {items.length === 0 && (
        <div className="mt-8 text-gray-600">
          No products for this brand yet. Check back soon.
        </div>
      )}
    </div>
  );
}