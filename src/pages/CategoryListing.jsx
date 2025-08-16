import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  products,
  trendingProducts,
  newLaunchesProducts,
  wellnessEssentials,
  deals,
  categories,
} from "../data/mockData";

/* ---------------- utils ---------------- */
const slugify = (s = "") =>
  String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const asArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/** Normalize a product-like object coming from any rail */
function normalize(item) {
  if (!item) return null;
  const title = item.title || item.name || "Product";
  const image = item.image || item.img || "/images/placeholder.png";
  const mrp = Number(item.mrp ?? item.oldPrice ?? 0);
  const price = Number(item.price ?? item.newPrice ?? 0);
  const brand = item.brand || null;
  const bg = item.bgGradient || item.bg || "";

  // images[] for gallery
  let images = Array.isArray(item.images) && item.images.length ? item.images.filter(Boolean) : [image];
  while (images.length < 3) images.push(image);

  // tags/categories (strings), tolerant
  const tagSet = [
    ...asArray(item.category),
    ...asArray(item.categories),
    ...asArray(item.tags),
  ]
    .map(String)
    .map((x) => x.trim())
    .filter(Boolean);

  return {
    _slug: slugify(title),
    _title: title,
    _image: image,
    _images: images,
    _mrp: mrp,
    _price: price || mrp || 0,
    _brand: brand ? String(brand) : "",
    _bg: bg,
    _raw: item,
    _tags: tagSet.map((t) => t.toLowerCase()),
  };
}

/** Build one catalog from all rails and de-dup by slug */
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

/** try to locate the selected category; supports slug or label */
function findCategoryBySlug(slug) {
  const list = Array.isArray(categories) ? categories : [];
  const bySlug = list.find((c) => c.slug === slug);
  if (bySlug) return bySlug;
  return list.find((c) => slugify(c.label) === slug) || null;
}

/* --------------- page ------------------ */
export default function CategoryListing() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const catalog = useMemo(buildCatalog, []);
  const selectedCategory = useMemo(() => findCategoryBySlug(slug), [slug]);

  const needle = useMemo(
    () => (selectedCategory?.label ? selectedCategory.label.toLowerCase() : ""),
    [selectedCategory]
  );

  // optional category keywords for better matching (add keywords array to categories in mockData if you want)
  const categoryKeywords = useMemo(
    () =>
      (selectedCategory?.keywords || [])
        .map((k) => String(k).toLowerCase().trim())
        .filter(Boolean),
    [selectedCategory]
  );

  const filtered = useMemo(() => {
    if (!needle) return catalog;

    return catalog.filter((p) => {
      // 1) explicit tag/category match
      const tagHit =
        p._tags.includes(needle) ||
        p._tags.includes(slug) ||
        p._tags.some((t) => t.replace(/\s+/g, "-") === slug);

      // 2) keyword hit (if provided on the category)
      const titleLower = p._title.toLowerCase();
      const keywordHit =
        categoryKeywords.length > 0 &&
        categoryKeywords.some((kw) => titleLower.includes(kw));

      // 3) heuristic: if title includes the category label words
      const labelWords = needle.split(/\s+/).filter(Boolean);
      const heuristic =
        labelWords.length > 0 && labelWords.every((w) => titleLower.includes(w));

      return tagHit || keywordHit || heuristic;
    });
  }, [catalog, needle, categoryKeywords, slug]);

  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-2xl font-bold text-gray-900">Category not found</h1>
        <p className="text-gray-600 mt-2">Please select another category.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        {selectedCategory.image && (
          <img
            src={selectedCategory.image}
            alt={selectedCategory.label}
            className="w-10 h-10 object-contain rounded"
          />
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCategory.label}</h1>
          <p className="text-gray-600 text-sm">Browse handpicked items in {selectedCategory.label}</p>
        </div>
      </div>

      {/* Filters (stub for future) */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">All</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Under ₦1,000</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Discounts</button>
        <button className="px-3 py-1.5 text-sm border rounded-full hover:bg-gray-50">Top Rated</button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((p, i) => (
          <button
            key={`${p._slug}-${i}`}
            onClick={() => navigate(`/product/${p._slug}`)}
            className="border rounded-xl p-3 bg-white text-left hover:shadow transition"
            aria-label={`Open ${p._title}`}
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

      {/* Empty-state */}
      {filtered.length === 0 && (
        <div className="mt-8 text-gray-600">
          No items matched this category yet. Try another filter.
        </div>
      )}
    </div>
  );
}