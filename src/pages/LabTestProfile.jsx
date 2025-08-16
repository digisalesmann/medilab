// src/pages/LabTestProfile.jsx
import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { labTests } from "../data/mockData";
import {
  Droplets,
  Clock,
  Home,
  Percent,
  Beaker,
  Star,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
  BadgeCheck,
  FileText,
  Users,
  Baby,
  Activity,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Syringe,
  UserRound,
  Hospital,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  SlidersHorizontal
} from "lucide-react";

/* helpers */
const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const StarRow = ({ value = 0, size = 16 }) => {
  const r = Math.round(value);
  return (
    <div className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`mr-0.5 ${i < r ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
};

// map "who is this for" keywords to icons
const whoIcon = (label = "") => {
  const s = label.toLowerCase();
  if (s.includes("child") || s.includes("kid") || s.includes("pediatric")) return Baby;
  if (s.includes("women") || s.includes("female") || s.includes("pregnan")) return UserRound;
  if (s.includes("men") || s.includes("male")) return Users;
  if (s.includes("athlete") || s.includes("fitness")) return Activity;
  if (s.includes("heart") || s.includes("cardio")) return HeartPulse;
  if (s.includes("senior") || s.includes("elder")) return Users;
  if (s.includes("diabet")) return Syringe;
  if (s.includes("general")) return Stethoscope;
  return ShieldCheck;
};

export default function LabTestProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // 1) Find test (memoized)
  const test = useMemo(() => {
    const bySlug = (labTests || []).find((t) => t.slug === slug);
    if (bySlug) return bySlug;
    return (labTests || []).find((t) => slugify(t.title || t.name || "") === slug) || null;
  }, [slug]);

  // 2) Derive safe fallbacks so Hooks can run BEFORE any early return
  const title = test?.title || test?.name || "Lab Test";
  const desc = test?.desc || "";
  const image = test?.image || "/images/placeholder.png";
  const gallery = useMemo(() => {
    const imgs = Array.isArray(test?.images) ? test.images : [];
    const g = (imgs.length ? imgs : [image]).filter(Boolean);
    return g.length ? g : ["/images/placeholder.png"];
  }, [test?.images, image]);

  // 3) Hooks that must always be called
  const [active, setActive] = useState(0);
  useEffect(() => setActive(0), [slug]);

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % gallery.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + gallery.length) % gallery.length);
    },
    [gallery.length]
  );

  // touch swipe
  const startX = useRef(null);
  const onTouchStart = (e) => (startX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      setActive((i) => (dx < 0 ? (i + 1) % gallery.length : (i - 1 + gallery.length) % gallery.length));
    }
    startX.current = null;
  };

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [slug]);

  // 4) Now it's safe to early-return for "not found"
  if (!test) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-12">
        <div className="bg-white border rounded-2xl p-8 text-center shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test not found</h2>
          <p className="text-gray-600 mb-6">Try browsing other packages.</p>
          <button
            onClick={() => navigate("/lab-tests")}
            className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
          >
            Back to lab tests
          </button>
        </div>
      </div>
    );
  }

  // 5) Safe to read all fields
  const {
    newPrice,
    oldPrice,
    discount,
    sampleType,
    fastingRequired,
    homeSample,
    reportTime,
    parametersCount,
    parameters = [],
    preparation = [],
    whoIsItFor = [],
    partnerLabs = [],
    rating = 4.5,
    reviews = 0,
    faqs = [],
    articles = [],
    bg,
  } = test;

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <button onClick={() => navigate("/lab-tests")} className="hover:underline">
          Lab tests
        </button>
        <span className="mx-1.5">/</span>
        <span className="text-gray-700">{title}</span>
      </div>

      {/* ======================= Overview ======================= */}
      <section className="bg-white border rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="grid grid-cols-12 gap-8">
          {/* Media */}
          <div
            className="col-span-12 md:col-span-5"
            tabIndex={0}
            aria-label="Test images"
            onKeyDown={onKeyDown}
          >
            <div
              className={`rounded-2xl ${bg || "bg-gray-50"} border overflow-hidden relative flex items-center justify-center`}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {gallery[active] && (
                <img
                  src={gallery[active]}
                  alt={`${title} – ${active + 1}`}
                  className="w-full h-[300px] md:h-[360px] object-contain"
                />
              )}

              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((i) => (i - 1 + gallery.length) % gallery.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActive((i) => (i + 1) % gallery.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 border shadow hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
                {gallery.slice(0, 6).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-16 h-16 flex-shrink-0 border rounded-lg p-0.5 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      i === active ? "border-emerald-500" : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-contain rounded" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="col-span-12 md:col-span-7">
            <h1 className="text-2xl text-left md:text-3xl font-bold text-gray-900">{title}</h1>
            {desc && <p className="mt-2 text-left text-sm text-gray-700">{desc}</p>}

            <div className="mt-3 flex items-center gap-2 text-sm">
              <StarRow value={rating} />
              <span className="text-gray-500">({reviews} reviews)</span>
            </div>

            <div className="mt-4 flex flex-wrap items-start gap-6">
              {/* Price */}
              <div>
                {oldPrice != null && (
                  <div className="text-xs text-gray-500">
                    MRP <span className="line-through">₦{Number(oldPrice).toLocaleString()}</span>
                  </div>
                )}
                <div className="text-2xl font-semibold text-gray-900">
                  ₦{Number(newPrice).toLocaleString()}
                </div>
                {discount && (
                  <div className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <Percent className="w-3.5 h-3.5" /> {discount}
                  </div>
                )}
              </div>

              {/* Facts chips */}
              <div className="grid grid-cols-2 gap-2 text-sm min-w-[260px]">
                {sampleType && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
                    <Droplets className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{sampleType}</span>
                  </div>
                )}
                {reportTime && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{reportTime}</span>
                  </div>
                )}
                {parametersCount != null && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
                    <Beaker className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">{parametersCount}+ parameters</span>
                  </div>
                )}
                {homeSample && (
                  <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg border bg-gray-50 text-gray-700">
                    <Home className="w-4 h-4 text-emerald-600" />
                    <span className="truncate">Home sample</span>
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mt-3 flex items-center text-gray-600 text-sm">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Available daily, 8:00am – 6:00pm</span>
            </div>

            {/* Booking controls */}
            <div className="mt-5 grid sm:grid-cols-3 gap-2">
              <input
                type="date"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                defaultValue={new Date().toISOString().slice(0, 10)}
              />
              <input
                type="time"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                defaultValue="09:00"
              />
              <input
                type="text"
                placeholder="Collection address or PIN"
                className="border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                Book test
              </button>
              <button
                onClick={() => navigate("/lab-tests")}
                className="px-5 py-2.5 rounded-lg border hover:bg-gray-50 transition"
              >
                View all tests
              </button>
            </div>

            {fastingRequired && (
              <p className="mt-3 inline-flex item items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                <Info className="w-3.5 h-3.5" />
                Fasting: {fastingRequired}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Who is this for / Preparation */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Who is this for */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg text-left md:text-xl font-semibold text-gray-900 mb-4">
            Who is this test for?
            </h3>
            {whoIsItFor.length === 0 ? (
            <p className="text-sm text-gray-600">
                Applies broadly to adults unless otherwise specified.
            </p>
            ) : (
            <ul className="flex flex-wrap gap-3">
                {whoIsItFor.map((w) => {
                const Icon = whoIcon(w);
                return (
                    <li
                    key={w}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-gray-50 hover:bg-gray-100 transition text-sm text-gray-800"
                    >
                    <Icon className="w-4 h-4 text-emerald-600" />
                    <span>{w}</span>
                    </li>
                );
                })}
            </ul>
            )}
        </section>

        {/* Preparation */}
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg text-left md:text-xl font-semibold text-gray-900 mb-4">
            Preparation
            </h3>
            {preparation.length === 0 ? (
            <p className="text-sm text-gray-600">No special preparation required.</p>
            ) : (
            <ul className="space-y-2 text-sm text-gray-700">
                {preparation.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600 mt-0.5" />
                    <span>{p}</span>
                </li>
                ))}
            </ul>
            )}
        </section>
        </div>

        {/* Parameters */}
        <section className="mt-10">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Parameters included {parametersCount != null ? `(${parametersCount}+)` : ""}</h2>
        </div>
        {parameters.length === 0 ? (
          <p className="text-sm text-gray-600">Parameter details will be provided in your report.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {parameters.map((grp) => (
              <div key={grp.group} className="rounded-2xl border bg-white p-4">
                <h4 className="text-sm font-semibold text-left text-gray-900">{grp.group}</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {grp.items.map((it) => (
                    <span
                      key={it}
                      className="px-2.5 py-1 rounded-full border bg-gray-50 text-xs text-gray-800"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Partner labs */}
      <section className="mt-10">
        <h3 className="text-lg md:text-xl text-left font-semibold text-gray-900 mb-3">Partner labs</h3>
        {partnerLabs.length === 0 ? (
          <p className="text-sm text-gray-600">Partner labs will be shown at checkout based on your location.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {partnerLabs.map((lab) => (
              <li
                key={lab}
                className="flex items-center justify-between px-3 py-2 rounded-xl border bg-white hover:shadow-sm transition"
              >
                <div className="inline-flex items-center gap-2">
                  <Hospital className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm text-gray-800">{lab}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Ratings & Reviews */}
      <section className="mt-10">
        <h3 className="text-lg md:text-xl text-left font-semibold text-gray-900 mb-3">Ratings & Reviews</h3>
        <div className="grid md:grid-cols-2 gap-6 md:items-stretch">
          <div className="rounded-2xl border bg-gray-50 p-4 md:p-5 flex flex-col justify-center">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">{Number(rating).toFixed(1)}</span>
              <StarRow value={rating} />
              <span className="text-sm text-gray-500">({reviews} ratings)</span>
            </div>
            <div className="mt-4 space-y-2">
              {[5, 4, 3, 2, 1].map((s) => {
                const pct = s === 5 ? 64 : s === 4 ? 19 : s === 3 ? 7 : s === 2 ? 3 : 7;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className="w-8 text-xs text-gray-700">{s}★</div>
                    <div className="flex-1 h-2 rounded-full bg-white overflow-hidden border">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="w-10 text-right text-xs text-gray-500">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 md:p-5">
            <ul className="space-y-4">
              <li className="border rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">A. K.</div>
                  <div className="text-xs text-gray-500">1 week ago</div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StarRow value={5} size={14} />
                  <span className="text-xs text-gray-500">5.0</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  Smooth home sample collection and detailed report. Recommended.
                </p>
              </li>
              <li className="border rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-900">O. B.</div>
                  <div className="text-xs text-gray-500">3 weeks ago</div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <StarRow value={4} size={14} />
                  <span className="text-xs text-gray-500">4.0</span>
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  Report arrived next day. Collector was professional.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="mt-10">
          <h3 className="text-lg md:text-xl text-left font-semibold text-gray-900 mb-3">FAQs</h3>
          <div className="divide-y rounded-2xl border bg-white">
            {faqs.map((f, i) => (
              <details key={i} className="p-4 group">
                <summary className="cursor-pointer text-sm font-medium text-gray-900 flex items-center">
                  <FileText className="w-4 h-4 text-emerald-600 mr-2" />
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-left text-gray-700 pl-6">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {articles.length > 0 && (
        <section className="mt-10">
          <h3 className="text-lg md:text-xl font-semibold text-left text-gray-900 mb-3">Related articles</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {articles.map((a, idx) => (
              <a
                key={idx}
                href={a.link}
                className="flex-shrink-0 w-64 bg-white border rounded-xl p-3 hover:shadow-md transition text-left"
              >
                <img src={a.img} alt={a.title} className="w-full h-28 object-cover rounded-lg" />
                <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">{a.title}</p>
                <span className="inline-flex items-center text-emerald-700 text-xs font-medium mt-1">
                  Read more <ChevronRight className="w-4 h-4 ml-1" />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* You may also like */}
      <section className="mt-10">
        <h3 className="text-lg md:text-xl text-left font-semibold text-gray-900 mb-3">You may also like</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {(labTests || [])
            .filter((t) => (t.slug || slugify(t.title || "")) !== (test.slug || slugify(title || "")))
            .slice(0, 10)
            .map((t, i) => {
              const slugTo = t.slug || slugify(t.title || t.name || `test-${i}`);
              return (
                <button
                  key={slugTo}
                  onClick={() => navigate(`/lab-tests/${slugTo}`)}
                  className="flex-shrink-0 w-64 text-left rounded-xl border bg-white p-3 hover:shadow-md transition"
                >
                  <div className={`rounded-lg ${t.bg || "bg-gray-50"} flex items-center justify-center h-24 overflow-hidden`}>
                    <img src={t.image} alt={t.title || t.name} className="h-16 object-contain" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2">
                    {t.title || t.name}
                  </p>
                  {t.newPrice != null && (
                    <div className="mt-1 text-xs text-gray-700">
                      ₦{Number(t.newPrice).toLocaleString()}
                    </div>
                  )}
                </button>
              );
            })}
        </div>
      </section>
    </div>
  );
}