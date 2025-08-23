import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CATEGORIES, categoryBySlug } from "../data/categoryConfig";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import {
  ChevronRight,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Search,
  X,
  Loader2,
  ChevronDown,
} from "lucide-react";

/** ------------------------------------------------------
 * Small UI helpers
 * -----------------------------------------------------*/
const Chip = ({ children, onClick, selected }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1 rounded-full text-xs border mr-2 mb-2 transition ${
      selected
        ? "bg-emerald-600 text-white border-emerald-600"
        : "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
    }`}
  >
    {children}
  </button>
);

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const money = (n) =>
  typeof n === "number"
    ? `₦${n.toLocaleString()}`
    : n
    ? `₦${Number(n).toLocaleString()}`
    : "—";

/** ------------------------------------------------------
 * Local storage helpers (cart + wishlist)
 * -----------------------------------------------------*/
const CART_KEY = "medilab_cart";
const WISHLIST_KEY = "medilab_wishlist";

function readLS(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) || typeof v === "object" ? v : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("medilab:storage", { detail: { key, value } }));
}

/** ------------------------------------------------------
 * Cards
 * -----------------------------------------------------*/
function ProductCard({ item, onAddToCart, onToggleWishlist, wished }) {
  const inStock = item.inStock !== false; // default true unless explicitly false
  return (
    <div className="group rounded-2xl border bg-white hover:shadow-md transition p-3">
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-50">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.02] transition"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
        <button
          type="button"
          onClick={() => onToggleWishlist(item)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2 rounded-full p-2 shadow transition ${
            wished ? "bg-rose-500 text-white" : "bg-white/90 text-rose-500 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
        </button>

        {!inStock && (
          <span className="absolute left-2 top-2 text-[10px] font-semibold uppercase tracking-wide bg-gray-800 text-white px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>

      <div className="mt-3">
        <div className="text-xs text-gray-500 truncate" title={item.brand || "—"}>
          {item.brand || "—"}
        </div>
        <Link
          to={`/product/${item.slug || item.id}`}
          className="font-medium text-gray-900 line-clamp-2"
        >
          {item.name}
        </Link>

        <div className="flex items-center gap-1 mt-1 text-amber-500" aria-label="Rating">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-xs text-gray-600">{item.rating ?? "4.6"}</span>
        </div>

        <div className="mt-2 font-semibold text-gray-900">{money(item.price)}</div>

        <button
          type="button"
          disabled={!inStock}
          onClick={() => onAddToCart(item)}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm py-2 transition ${
            inStock
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-4 h-4" /> {inStock ? "Add to cart" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}

function ArticleCard({ item, categoryLabel }) {
  return (
    <Link
      to={`/article/${item.slug || item.id}`}
      className="block rounded-2xl border bg-white hover:shadow-md transition overflow-hidden"
    >
      <div className="relative aspect-[16/9] bg-gray-100">
        {item.image && (
          <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <div className="text-[11px] text-emerald-700 font-semibold uppercase tracking-wide">
          {categoryLabel}
        </div>
        <div className="mt-1 font-semibold text-gray-900 line-clamp-2">{item.title}</div>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.excerpt}</p>
      </div>
    </Link>
  );
}

function ServiceCard({ item }) {
  return (
    <div className="rounded-2xl border bg-white p-4 hover:shadow-md transition">
      <div className="font-semibold text-gray-900">{item.name}</div>
      <p className="text-sm text-gray-600 mt-1">{item.short}</p>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-gray-900 font-semibold">{money(item.price)}</div>
        <Link
          to={`/services/${item.slug || item.id}`}
          className="inline-flex items-center gap-1 text-emerald-700 hover:underline text-sm"
        >
          Book <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

/** ------------------------------------------------------
 * Firestore fetch (simple paging)
 * -----------------------------------------------------*/
async function fetchPage({ col, slug, pageSize = 12, cursor = null, orderByField = "createdAt" }) {
  const base = [where("category", "==", slug), orderBy(orderByField, "desc"), limit(pageSize)];
  const qy = cursor
    ? query(collection(db, col), ...base, startAfter(cursor))
    : query(collection(db, col), ...base);
  const snap = await getDocs(qy);
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const nextCursor = snap.docs.length ? snap.docs[snap.docs.length - 1] : null;
  return { items, nextCursor };
}

/** ------------------------------------------------------
 * Main Page
 * -----------------------------------------------------*/
export default function CategoryHub() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const config = categoryBySlug(slug);

  // tabs: Shop | Learn | Services
  const [tab, setTab] = useState("shop");

  // filters
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("relevance"); // relevance | priceAsc | priceDesc | rating | newest

  // mobile filter drawer
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [prodCursor, setProdCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [articles, setArticles] = useState([]);
  const [services, setServices] = useState([]);

  // wishlist/cart state
  const [wishlist, setWishlist] = useState(() => readLS(WISHLIST_KEY, []));
  const [toast, setToast] = useState(null); // {text, type}

  // auto-load more sentinel
  const loadMoreRef = useRef(null);

  // read hash (#shop|#learn|#services) *and* query params
  useEffect(() => {
    const applyFromURL = () => {
      const h = (window.location.hash || "#shop").replace("#", "");
      if (["shop", "learn", "services"].includes(h)) setTab(h);
      const sp = new URLSearchParams(window.location.search);
      setQ(sp.get("q") || "");
      setBrand(sp.get("brand") || "");
      setPriceMin(sp.get("min") || "");
      setPriceMax(sp.get("max") || "");
      setSort(sp.get("sort") || "relevance");
    };
    applyFromURL();
    window.addEventListener("hashchange", applyFromURL);
    return () => window.removeEventListener("hashchange", applyFromURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // persist filters to URL (without navigation)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (q) sp.set("q", q); else sp.delete("q");
    if (brand) sp.set("brand", brand); else sp.delete("brand");
    if (priceMin) sp.set("min", priceMin); else sp.delete("min");
    if (priceMax) sp.set("max", priceMax); else sp.delete("max");
    if (sort && sort !== "relevance") sp.set("sort", sort); else sp.delete("sort");
    const url = new URL(window.location.href);
    url.search = sp.toString();
    window.history.replaceState({}, "", url.toString());
  }, [q, brand, priceMin, priceMax, sort, location.pathname]);

  // load data on slug change
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!config) return;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const [p, a, s] = await Promise.all([
          fetchPage({ col: "products", slug }),
          fetchPage({ col: "articles", slug, pageSize: 6 }),
          fetchPage({ col: "services", slug, pageSize: 6 }),
        ]);
        setProducts(p.items);
        setProdCursor(p.nextCursor);
        setArticles(a.items);
        setServices(s.items);
      } catch (err) {
        console.error(err);
        setError("We couldn't load this category. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // auto load more when sentinel visible (Shop tab only)
  useEffect(() => {
    if (!prodCursor || tab !== "shop") return;
    const node = loadMoreRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loadingMore) {
        (async () => {
          setLoadingMore(true);
          try {
            const { items, nextCursor } = await fetchPage({
              col: "products",
              slug,
              cursor: prodCursor,
            });
            setProducts((prev) => [...prev, ...items]);
            setProdCursor(nextCursor);
          } finally {
            setLoadingMore(false);
          }
        })();
      }
    }, { rootMargin: "200px" });
    obs.observe(node);
    return () => obs.disconnect();
  }, [prodCursor, slug, tab, loadingMore]);

  // brand options derived from loaded products
  const brandOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.brand && set.add(String(p.brand)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products]);

  // compute filtered + sorted products
  const filteredProducts = useMemo(() => {
    let list = products;
    if (q.trim()) {
      const t = q.trim().toLowerCase();
      list = list.filter((p) =>
        [p.name, p.brand, p.short, p.description]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(t))
      );
    }
    if (brand) list = list.filter((p) => (p.brand || "").toLowerCase() === brand.toLowerCase());
    const min = priceMin !== "" ? Number(priceMin) : null;
    const max = priceMax !== "" ? Number(priceMax) : null;
    if (min != null) list = list.filter((p) => Number(p.price) >= min);
    if (max != null) list = list.filter((p) => Number(p.price) <= max);

    // sorting
    const sorted = [...list];
    switch (sort) {
      case "priceAsc":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "priceDesc":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        sorted.sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0));
        break;
      case "newest":
        sorted.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        break;
      default:
        // relevance: keep current order
        break;
    }
    return sorted;
  }, [products, q, brand, priceMin, priceMax, sort]);

  // actions: cart & wishlist
  const addToCart = (item) => {
    const cart = readLS(CART_KEY, []);
    const idx = cart.findIndex((it) => it.id === item.id);
    if (idx >= 0) {
      cart[idx].qty = (cart[idx].qty || 1) + 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, qty: 1 });
    }
    writeLS(CART_KEY, cart);
    setToast({ text: `${item.name} added to cart`, type: "success" });
    setTimeout(() => setToast(null), 2000);
  };

  const toggleWishlist = (item) => {
    let next = Array.isArray(wishlist) ? [...wishlist] : [];
    const exists = next.some((w) => w.id === item.id);
    if (exists) next = next.filter((w) => w.id !== item.id);
    else next.push({ id: item.id, name: item.name, image: item.image });
    setWishlist(next);
    writeLS(WISHLIST_KEY, next);
  };

  if (!config) {
    return (
      <div className="pt-28 px-4 max-w-5xl mx-auto">
        <p className="text-gray-700">Category not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-emerald-700 hover:underline">
          Go Home
        </button>
      </div>
    );
  }

  const Icon = config.Icon;

  // helper to change tab and push hash
  const switchTab = (k) => {
    setTab(k);
    const url = new URL(window.location.href);
    url.hash = `#${k}`;
    window.history.replaceState({}, "", url.toString());
  };

  const resetFilters = () => {
    setQ("");
    setBrand("");
    setPriceMin("");
    setPriceMax("");
    setSort("relevance");
  };

  const ResultsHeader = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* left */}
      <div>
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
          {filteredProducts.length === 1 ? "item" : "items"}
        </div>
        {(q || brand || priceMin || priceMax) && (
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            {q && <Chip onClick={() => setQ("")}>Search: “{q}” ✕</Chip>}
            {brand && <Chip onClick={() => setBrand("")}>Brand: {brand} ✕</Chip>}
            {priceMin && <Chip onClick={() => setPriceMin("")}>Min: {priceMin} ✕</Chip>}
            {priceMax && <Chip onClick={() => setPriceMax("")}>Max: {priceMax} ✕</Chip>}
            <button
              type="button"
              onClick={resetFilters}
              className="text-emerald-700 hover:underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* right */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products"
            className="w-full sm:w-64 pl-9 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
            aria-label="Search products"
          />
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <label className="text-xs text-gray-500">Sort</label>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border text-sm focus:ring-2 focus:ring-emerald-500"
              aria-label="Sort products"
            >
              <option value="relevance">Relevance</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Mobile filter button */}
        <button
          type="button"
          onClick={() => setShowFiltersMobile(true)}
          className="sm:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white"
          aria-label="Open filters"
        >
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>
    </div>
  );

  const SidebarFilters = () => (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-2 font-semibold text-gray-900">
        <Filter className="w-4 h-4" /> Filters
      </div>

      {/* Brand */}
      <div className="mt-4">
        <label className="text-xs text-gray-500">Brand</label>
        {brandOptions.length ? (
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All brands</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        ) : (
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. GSK"
            className="mt-1 w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        )}
      </div>

      {/* Price */}
      <div className="mt-4">
        <label className="text-xs text-gray-500">Price (₦)</label>
        <div className="flex gap-2">
          <input
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            type="number"
            placeholder="Min"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            type="number"
            placeholder="Max"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* Popular subcategories */}
      <div className="mt-4">
        <div className="text-xs text-gray-500 mb-2">Popular</div>
        <div className="flex flex-wrap -m-1">
          {config.subcategories.slice(0, 8).map((s) => (
            <Chip key={s} onClick={() => setQ(s)} selected={q.toLowerCase() === s.toLowerCase()}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      {/* Sort (mobile + sidebar) */}
      <div className="mt-4">
        <label className="text-xs text-gray-500">Sort by</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="mt-4 w-full text-sm text-emerald-700 hover:underline"
      >
        Reset filters
      </button>
    </div>
  );

  return (
    <main className="pt-24 sm:pt-28">
      <Helmet>
        <title>{config.hero.title} | MediLab</title>
        <meta name="description" content={config.hero.subtitle} />
      </Helmet>

      {/* HERO */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl overflow-hidden bg-emerald-50 border">
            <div className="grid md:grid-cols-[1.4fr,1fr]">
              <div className="p-6 sm:p-10">
                <div className={`inline-flex items-center gap-2 font-semibold ${config.color}`}>
                  <Icon className="w-5 h-5" /> {config.label}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-2 text-gray-900">
                  {config.hero.title}
                </h1>
                <p className="text-gray-700 mt-2">{config.hero.subtitle}</p>

                {/* subcategory chips */}
                <div className="mt-4 -m-1">
                  {config.subcategories.map((s) => (
                    <Chip key={s} onClick={() => { setQ(s); switchTab("shop"); }} selected={q.toLowerCase() === s.toLowerCase()}>
                      {s}
                    </Chip>
                  ))}
                </div>

                {/* quick pivots */}
                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => switchTab("shop")}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      tab === "shop" ? "bg-white" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Shop
                  </button>
                  <button
                    onClick={() => switchTab("learn")}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      tab === "learn" ? "bg-white" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Learn
                  </button>
                  <button
                    onClick={() => switchTab("services")}
                    className={`px-3 py-2 rounded-lg border text-sm ${
                      tab === "services" ? "bg-white" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    Services
                  </button>
                </div>
              </div>

              <div className="relative min-h-[220px] hidden md:block">
                {config.hero.image && (
                  <img
                    src={config.hero.image}
                    alt={config.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mt-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-emerald-700">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-700">{config.label}</span>
          </nav>
        </div>
      </section>

      {/* BODY */}
      <section className="mt-6 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b">
          {["shop", "learn", "services"].map((k) => (
            <button
              key={k}
              onClick={() => switchTab(k)}
              className={`px-4 py-3 text-sm font-semibold -mb-px border-b-2 ${
                tab === k ? "border-emerald-600 text-emerald-700" : "border-transparent text-gray-600"
              }`}
            >
              {k === "shop" ? "Shop" : k === "learn" ? "Learn" : "Services"}
            </button>
          ))}
        </div>

        {/* Grid layout: sidebar + content */}
        <div className="grid lg:grid-cols-[280px,1fr] gap-6 mt-6">
          {/* Sidebar filters (only for Shop tab) */}
          <aside className="lg:sticky lg:top-24 self-start hidden lg:block">
            {tab === "shop" ? (
              <SidebarFilters />
            ) : (
              <div className="rounded-2xl border bg-white p-4 text-sm text-gray-600">
                <div className="font-semibold text-gray-900">About this section</div>
                <p className="mt-2">Discover curated content and services tailored to {config.label.toLowerCase()}.</p>
              </div>
            )}

            {/* Safety/assurance card */}
            <div className="mt-4 rounded-2xl border bg-white p-4 text-sm text-gray-600">
              <div className="font-semibold text-gray-900">Why shop with MediLab</div>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Licensed pharmacies & genuine products</li>
                <li>Secure payments & fast delivery</li>
                <li>Pharmacist chat support</li>
              </ul>
            </div>
          </aside>

          {/* Content */}
          <div>
            {tab === "shop" && (
              <>
                <ResultsHeader />

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <Skeleton key={i} className="h-64" />
                    ))}
                  </div>
                ) : filteredProducts.length ? (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {filteredProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          item={p}
                          onAddToCart={addToCart}
                          onToggleWishlist={toggleWishlist}
                          wished={wishlist?.some?.((w) => w.id === p.id)}
                        />
                      ))}
                    </div>

                    {/* Load more */}
                    {prodCursor && (
                      <>
                        <div ref={loadMoreRef} />
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={async () => {
                              setLoadingMore(true);
                              const { items, nextCursor } = await fetchPage({
                                col: "products",
                                slug,
                                cursor: prodCursor,
                              });
                              setProducts((prev) => [...prev, ...items]);
                              setProdCursor(nextCursor);
                              setLoadingMore(false);
                            }}
                            className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 inline-flex items-center gap-2"
                          >
                            {loadingMore && <Loader2 className="w-4 h-4 animate-spin" />} Load more
                          </button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="mt-6 rounded-2xl border bg-white p-6 text-center">
                    <div className="text-lg font-semibold text-gray-900">No matching products</div>
                    <p className="text-sm text-gray-600 mt-1">
                      Try adjusting your filters or search term.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 inline-flex items-center justify-center px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </>
            )}

            {tab === "learn" && (
              <>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-48" />
                    ))}
                  </div>
                ) : articles.length ? (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {articles.map((a) => (
                        <ArticleCard key={a.id} item={a} categoryLabel={config.label} />
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <Link
                        to={`/learn/${slug}`}
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                      >
                        View more articles
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 text-gray-600">No articles yet.</div>
                )}
              </>
            )}

            {tab === "services" && (
              <>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-40" />
                    ))}
                  </div>
                ) : services.length ? (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {services.map((s) => (
                        <ServiceCard key={s.id} item={s} />
                      ))}
                    </div>
                    <div className="flex justify-center mt-6">
                      <Link
                        to={`/services?cat=${slug}`}
                        className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                      >
                        Browse all services
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="mt-6 text-gray-600">No services yet.</div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* SEO: related links */}
      <section className="mt-10 mb-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-sm text-gray-600">
          <div className="font-semibold text-gray-900">Explore more</div>
          <div className="flex flex-wrap gap-3 mt-2">
            {CATEGORIES.filter((c) => c.slug !== slug)
              .slice(0, 6)
              .map((c) => (
                <Link key={c.slug} to={`/hub/${c.slug}`} className="text-emerald-700 hover:underline">
                  {c.label}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFiltersMobile(false)}
            aria-hidden
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-gray-900">Filters</div>
              <button
                type="button"
                onClick={() => setShowFiltersMobile(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 border-t pt-3">
              <SidebarFilters />
            </div>
            <button
              type="button"
              onClick={() => setShowFiltersMobile(false)}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 text-white text-sm py-2"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full bg-gray-900 text-white text-sm px-4 py-2 shadow-lg">
            {toast.text}
          </div>
        </div>
      )}
    </main>
  );
}
