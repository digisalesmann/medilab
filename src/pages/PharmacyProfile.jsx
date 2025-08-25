import React, { useEffect, useMemo, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  Share2,
  MessageCircle,
  Download,
  Search,
  ChevronDown,
} from "lucide-react";
import ReserveModal from "../components/ReserveModal";
import { useNotifications } from "../context/NotificationContext";
import { mockPharmacies, alternativeSuggestions } from "../data/mockData";

/* ---------- helpers ---------- */
const money = (n) =>
  typeof n === "number" ? `₦${n.toLocaleString()}` : n ? `₦${Number(n).toLocaleString()}` : "—";

function getAlternativeMedicines(name) {
  if (!name) return ["Consult Pharmacist"];
  const cleaned = String(name).toLowerCase().replace(/\s+/g, "");
  const matchedKey = Object.keys(alternativeSuggestions || {}).find(
    (key) => key.toLowerCase().replace(/\s+/g, "") === cleaned
  );
  return (alternativeSuggestions && alternativeSuggestions[matchedKey]) || ["Consult Pharmacist"];
}

const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const reservationsFor = (pharmacyId) =>
  JSON.parse(localStorage.getItem("reservations") || "[]").filter(
    (r) => String(r.pharmacyId) === String(pharmacyId)
  );

const availableStock = (pharmacyId, drug) => {
  const used = reservationsFor(pharmacyId)
    .filter((r) => r.medicine === drug.name)
    .reduce((sum, r) => sum + Number(r.quantity), 0);
  return Math.max(0, Number(drug.stock || 0) - used);
};

const exportCSV = (rows, filename = "inventory.csv") => {
  if (!rows?.length) return;
  const quote = (v) => `'${String(v ?? "").replace(/"/g, '""')}'`;
  const header = Object.keys(rows[0]).map(quote).join(",");
  const body = rows.map((r) => Object.values(r).map(quote).join(",")).join("\n");
  const csv = [header, body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------- component ---------- */
export default function PharmacyProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const qs = useQuery();
  const initialQ = (qs.get("q") || "").trim();
  const { addNotification } = useNotifications();

  // ✅ Find pharmacy (and normalize list) inside useMemo to avoid changing deps
  const pharmacy = useMemo(() => {
    const list = Array.isArray(mockPharmacies) ? mockPharmacies : [];
    return list.find((p) => String(p.id) === String(id));
  }, [id]);

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("relevance"); // relevance | priceAsc | priceDesc | stockDesc | nameAsc

  // feedback (persist per pharmacy)
  const feedbackKey = `pharmacyFeedback:${id}`;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(feedbackKey)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(feedbackKey, JSON.stringify(feedbackList));
  }, [feedbackList, feedbackKey]);

  const categories = useMemo(
    () => Object.keys(pharmacy?.inventory || {}),
    [pharmacy?.inventory]
  );

  const flatInventory = useMemo(() => {
    if (!pharmacy) return [];
    const out = [];
    for (const [cat, items] of Object.entries(pharmacy.inventory || {})) {
      (items || []).forEach((d) =>
        out.push({
          category: cat,
          name: d.name,
          price: Number(d.price || 0),
          stock: Number(d.stock || 0),
          available: availableStock(pharmacy.id, d),
        })
      );
    }
    return out;
  }, [pharmacy]);

  const filtered = useMemo(() => {
    let rows = flatInventory;

    if (selectedCategory !== "All") {
      rows = rows.filter((r) => r.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().replace(/\s+/g, "");
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().replace(/\s+/g, "").includes(q) ||
          r.category.toLowerCase().replace(/\s+/g, "").includes(q)
      );
    }

    if (inStockOnly) {
      rows = rows.filter((r) => r.available > 0);
    }

    const by = {
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      stockDesc: (a, b) => b.available - a.available,
      nameAsc: (a, b) => a.name.localeCompare(b.name),
    }[sort];

    if (by) rows = [...rows].sort(by);
    return rows;
  }, [flatInventory, selectedCategory, query, inStockOnly, sort]);

  // ✅ Safe early return (after hooks)
  if (!pharmacy) {
    return (
      <div className="pt-24 sm:pt-28 px-4 max-w-5xl mx-auto text-center">
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900 inline-block">
          <div className="font-semibold">Pharmacy not found.</div>
          <p className="text-sm mt-1">
            Check the URL or go back to the home page.
          </p>
        </div>
        <div>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-emerald-700 hover:underline"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const initials = pharmacy.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const onShare = async () => {
    const shareData = {
      title: pharmacy.name,
      text: `Check ${pharmacy.name} on MediLab`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("Link copied to clipboard.");
      }
    } catch {
      /* ignore */
    }
  };

  const whatsappHref = `https://wa.me/${(pharmacy.phone || "").replace(/\D/g, "")}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    pharmacy.location || ""
  )}`;

  const submitFeedback = () => {
    if (!rating || !comment.trim()) return alert("Please enter rating and comment");
    const entry = { rating, comment, at: new Date().toISOString() };
    setFeedbackList((prev) => [entry, ...prev]);
    setRating(0);
    setComment("");
    alert("Thank you for your feedback!");
  };

  return (
    <main className="max-w-6xl mx-auto px-4 pt-20 sm:pt-24 pb-24 space-y-6 sm:space-y-8">
      {/* Header Card */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
          {/* Left */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="bg-emerald-100 text-emerald-800 font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base">
              {initials}
            </div>
            <div>
              <h1 className="text-xl text-left sm:text-2xl font-extrabold text-gray-900">{pharmacy.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                <span className="inline-flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {pharmacy.location}
                </span>
                <span className="hidden sm:inline text-gray-400">•</span>
                <span>License: {pharmacy.license}</span>
                {pharmacy.owner && (
                  <>
                    <span className="hidden sm:inline text-gray-400">•</span>
                    <span>Owner: {pharmacy.owner}</span>
                  </>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {pharmacy.verified && (
                  <span className="inline-flex items-center text-emerald-700 text-xs sm:text-sm font-medium">
                    <ShieldCheck className="w-4 h-4 mr-1" />
                    Verified Pharmacy
                  </span>
                )}
                <span className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(pharmacy.rating || 0) ? "fill-amber-400" : ""}`}
                    />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-700 ml-1">
                    {Number(pharmacy.rating || 0).toFixed(1)} ({pharmacy.reviews} reviews)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:items-center w-full sm:w-auto">
            <a href={`tel:${pharmacy.phone || ""}`} className="btn-outline col-span-2 sm:col-span-1">
              <span className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border">
                <Phone className="w-4 h-4" />
                Call
              </span>
            </a>
            <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline">
              <span className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </span>
            </a>
            <a href={mapsHref} target="_blank" rel="noreferrer" className="btn-outline">
              <span className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border">
                <MapPin className="w-4 h-4" />
                Map
              </span>
            </a>
            <button onClick={onShare} className="btn-outline">
              <span className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border">
                <Share2 className="w-4 h-4" />
                Share
              </span>
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <KPI label="Total SKUs" value={flatInventory.length} />
          <KPI label="In-stock SKUs" value={flatInventory.filter((r) => r.available > 0).length} />
          <KPI label="Rating" value={Number(pharmacy.rating || 0).toFixed(1)} />
          <KPI label="Reviews" value={pharmacy.reviews} />
        </div>
      </section>

      {/* Tools Bar */}
      <section className="bg-white border rounded-2xl shadow-sm p-3 sm:p-4 md:sticky md:top-20 z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row md:items-center gap-2 w-full">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search this pharmacy (drug or category)"
                className="w-full pl-9 pr-3 py-2 rounded-lg border"
              />
            </div>

            <div className="relative w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-56 md:w-auto appearance-none pl-3 pr-8 py-2 rounded-lg border"
              >
                <option value="All">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <label className="inline-flex items-center gap-2 text-sm ml-0 md:ml-1">
              <input
                type="checkbox"
                className="accent-emerald-600"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In stock only
            </label>
          </div>

          <div className="flex flex-col pr-6 sm:flex-row sm:items-center gap-2 w-full md:w-auto">
        {/* Sort Dropdown */}
        <div className="relative flex-shrink-0 w-full sm:w-56">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 rounded-lg border"
            aria-label="Sort"
          >
            <option value="relevance">Relevance</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
            <option value="stockDesc">Stock: High → Low</option>
            <option value="nameAsc">Name: A → Z</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Export Button */}
        <div className="flex-shrink-0">
          <button
            onClick={() =>
              exportCSV(
                filtered.map((r) => ({
                  Category: r.category,
                  Name: r.name,
                  Price: r.price,
                  Stock: r.stock,
                  Available: r.available,
                })),
                `${pharmacy.name}-inventory.csv`
              )
            }
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 w-full sm:w-auto"
            title="Export inventory CSV"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

        </div>
      </section>

      {/* Inventory */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3">Available Medicines</h3>

        {filtered.length === 0 ? (
          <EmptyResults
            query={query}
            onConsult={() => alert("Your message has been sent to the pharmacist.")}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((row) => {
              const drug = { name: row.name, stock: row.stock, price: row.price };
              const available = row.available;
              return (
                <div
                  key={`${row.category}:${row.name}`}
                  className="p-3 sm:p-4 bg-white rounded-xl shadow border flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] sm:text-xs text-gray-500 mb-1">{row.category}</div>
                    <h4 className="text-sm sm:text-md font-semibold text-gray-900">{row.name}</h4>
                    <p className="text-sm text-emerald-700 mt-1 font-medium">{money(row.price)}</p>
                    <p
                      className={`text-sm mt-1 font-medium ${
                        available > 0 ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {available > 0 ? `In stock: ${available}` : "Out of stock"}
                    </p>
                  </div>

                  {available > 0 ? (
                    <button
                      onClick={() => setSelectedMedicine(drug)}
                      className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2 px-4 rounded-lg"
                    >
                      Reserve
                    </button>
                  ) : (
                    <div className="mt-3 text-sm">
                      <p className="text-gray-700 mb-1 text-center">Suggested alternatives:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {getAlternativeMedicines(row.name).map((alt, i) =>
                          alt.toLowerCase() === "consult pharmacist" ? (
                            <button
                              key={i}
                              onClick={() =>
                                alert("Your message has been sent to the pharmacist.")
                              }
                              className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs hover:bg-emerald-200"
                            >
                              {alt}
                            </button>
                          ) : (
                            <span
                              key={i}
                              className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-md text-xs"
                            >
                              {alt}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Feedback */}
      <section className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Leave feedback</h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${
                i <= rating ? "fill-amber-400 text-amber-500" : "text-gray-300"
              }`}
              onClick={() => setRating(i)}
            />
          ))}
        </div>
        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full border rounded-lg p-2"
        />
        <button
          onClick={submitFeedback}
          className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
        >
          Submit Feedback
        </button>

        {feedbackList.length > 0 && (
          <div className="pt-2">
            <h4 className="font-semibold mb-2">Recent feedback</h4>
            <ul className="space-y-2">
              {feedbackList.map((fb, idx) => (
                <li key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{fb.comment}</p>
                  <div className="text-[11px] text-gray-400 mt-1">
                    {new Date(fb.at).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {selectedMedicine && (
        <ReserveModal
          medicine={selectedMedicine}
          pharmacy={pharmacy}
          onClose={() => setSelectedMedicine(null)}
          updateStock={() => {}}
          onConfirm={(quantity) => {
            // just show notification, don’t close
            addNotification(
              `${selectedMedicine.name} reserved successfully from ${pharmacy.name}`
            );
          }}
        />
      )}
    </main>
  );
}

/* ---------- tiny components ---------- */
function KPI({ label, value }) {
  return (
    <div className="rounded-xl border bg-white p-3 sm:p-4">
      <div className="text-[11px] sm:text-xs text-gray-500">{label}</div>
      <div className="text-lg sm:text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function EmptyResults({ query, onConsult }) {
  return (
    <div className="text-center text-gray-700 py-8 space-y-3">
      <p className="font-medium">
        No medicines found matching <strong>"{query}"</strong>.
      </p>
      <div className="text-sm text-emerald-700">
        Try these alternatives:
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {getAlternativeMedicines(query).map((alt, i) =>
            alt.toLowerCase() === "consult pharmacist" ? (
              <button
                key={i}
                onClick={onConsult}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs hover:bg-emerald-200"
              >
                {alt}
              </button>
            ) : (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
              >
                {alt}
              </span>
            )
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Can’t find what you need?{" "}
        <Link to="/services?cat=pharmacist" className="text-emerald-700 hover:underline">
          Chat with a pharmacist
        </Link>
      </div>
    </div>
  );
}