// src/pages/ServiceHub.jsx
import { useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";

// Import EVERYTHING so we can safely probe real keys without breaking if missing
import * as data from "../data/mockData";

// ---------- Safe Slugify ----------
const slugify = (str) => (str ? String(str).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") : "");

// ---------- Small helpers ----------
const pick = (...keys) => keys.map((k) => data?.[k]).find(Boolean) || [];
const take = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []);

const first = (obj, ...keys) => keys.map((k) => obj?.[k]).find((v) => v != null);

const DOCTOR_ROUTE_BASE = "/doctors"; // change to "/doctor" if that's your route

const ensureLeadingSlash = (p) =>
  typeof p === "string" && p.trim() ? (p.startsWith("/") ? p : `/${p}`) : "/";


const resolveDoctorLink = (item) => {
  // Prefer explicit URLs/paths if present
  const explicit =
    item?.profileUrl || item?.profile || item?.url || item?.to || item?.href;
  if (typeof explicit === "string" && explicit.trim()) {
    if (/^https?:\/\//i.test(explicit)) return explicit; // external
    return ensureLeadingSlash(explicit); // internal path
  }
  // Otherwise build from an identifier
  const idOrSlug =
    item?.slug || item?.handle || item?.username || item?.id || item?.name;
  if (idOrSlug) {
    return `${ensureLeadingSlash(DOCTOR_ROUTE_BASE)}/${slugify(idOrSlug)}`;
  }
  return ensureLeadingSlash(DOCTOR_ROUTE_BASE);
};

// Normalize any “card-ish” item into our rail/list shape
const norm = {
  slide(item, fallbackTo = "/") {
    return {
      title: first(item, "title", "name", "label") || "Untitled",
      img: first(item, "image", "img", "banner", "cover"),
      to:
        first(item, "to", "href", "link") ||
        (item?.slug ? `${fallbackTo}/${slugify(item.slug)}` : fallbackTo),
    };
  },


  product(item) {
    const title = first(item, "title", "name");
    return {
      title: title || "Product",
      img: first(item, "image", "img"),
      to: `/product/${slugify(title)}`,
    };
  },

  brand(item) {
    const title = first(item, "name", "title");
    return {
      title: title || "Brand",
      img: first(item, "image", "img", "logo"),
      to: `/brand/${slugify(title)}`,
    };
  },

  lab(item) {
    const title = first(item, "title", "name");
    return {
      title: title || "Lab Test",
      img: first(item, "image", "img", "icon"),
      to: `/lab-tests/${slugify(first(item, "slug", "name", "title"))}`,
    };
  },

  doctor(item) {
    const name = first(item, "name", "title");
    return {
      title: name || "Doctor",
      subtitle: first(item, "specialty", "department", "role"),
      img: first(item, "image", "img", "avatar"),
       to: resolveDoctorLink(item),
    };
  },

  article(item) {
    const title = first(item, "title", "name");
    return {
      title: title || "Article",
      img: first(item, "image", "img", "cover"),
      snippet: first(item, "snippet", "summary", "excerpt"),
      to: `/blogs/${slugify(title)}`,
    };
  },
};

// ---------- Card with balanced images ----------
const RailCard = ({ title, to, img, subtitle, snippet, fit = "cover" }) => {
  const isExternal = typeof to === "string" && /^https?:\/\//i.test(to);
  const Wrapper = ({ children }) =>
    isExternal ? (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-44 sm:w-52 h-52 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
      >
        {children}
      </a>
    ) : (
      <Link
        to={to}
        className="flex-shrink-0 w-44 sm:w-52 h-52 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
      >
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <div
        className={[
          "w-full h-28 border-b border-gray-100 overflow-hidden",
          fit === "contain" ? "bg-white" : "bg-gray-50",
        ].join(" ")}
      >
        {img ? (
          <img
            src={img}
            alt={title}
            className={["w-full h-full", fit === "contain" ? "object-contain p-3" : "object-cover"].join(" ")}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>

      <div className="px-3 pt-2 pb-3">
        <p className="text-sm font-semibold text-gray-900 truncate">{title}</p>
        {subtitle && <p className="text-[11px] text-gray-500 truncate">{subtitle}</p>}
        {snippet && <p className="text-[11px] text-gray-600 mt-1 line-clamp-2">{snippet}</p>}
      </div>
    </Wrapper>
  );
};

export default function ServiceHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split("/").pop();

  // PLUS: go straight to /plus
  useEffect(() => {
    if (slug === "plus") navigate("/plus", { replace: true });
  }, [slug, navigate]);

  const cfg = useMemo(() => {
    const base = {
      title: "Services",
      tagline: "Everything you need, in one place.",
      railItems: [],
      railHint: "",
      listItems: [],
      listHint: "",
    };

    // ===== REAL DATA HOOKUP (with graceful fallbacks) =====
    // HOME slides (main horizontal) for Medicines/Healthcare
    const homeSlidesAll = pick("homeSlides", "slides", "featuredSlides");
    const homeSlidesMedicine = pick("homeSlidesMedicine", "medicineSlides");

    // Frequently booked lab tests
    const frequentLabTests = pick("frequentLabTests", "labTestsFrequent", "topLabTests");

    // Real doctors
    const doctorsFeatured = pick("featuredDoctors", "doctorsFeatured", "topDoctors", "doctors");

    // Real healthcare products
    const healthcareFeatured = pick("featuredHealthcare", "healthcareFeatured", "essentialsFeatured", "products");

    // Real articles
    const blogArticles = pick("articles", "blogArticles", "blogs");

    // Brands & generic datasets (fallbacks)
    const brands = pick("brands");
    const labTests = pick("labTests");
    const products = pick("products");
    const doctors = pick("doctors");
    const blogs = pick("blogs");

    const sections = {
      // ----------------------- Medicines (real home slides rail + trending products list)
      medicine: () => {
        const slidesRaw = homeSlidesMedicine.length ? homeSlidesMedicine : homeSlidesAll;
        const rail = take(slidesRaw.map((s) => {
          // Try to route smartly if the slide has type
          const type = s?.type?.toLowerCase?.();
          if (type === "brand") return { ...norm.brand(s), fit: "contain" };
          if (type === "product") return { ...norm.product(s), fit: "contain" };
          return { ...norm.slide(s, "/medicine"), fit: "contain" };
        }), 10);

        const trending = take(products, 10).map((p) => ({ ...norm.product(p), fit: "contain" }));

        // FINAL fallback if nothing real is present
        const fallbackBrands = take(brands, 10).map((b) => ({ ...norm.brand(b), fit: "contain" }));

        return {
          ...base,
          title: "Medicines",
          tagline: "Your main shelves from Home, right here.",
          railItems: rail.length ? rail : fallbackBrands,
          railHint: rail.length ? "Featured this week" : "Popular brands",
          listItems: trending,
          listHint: trending.length ? "Trending products" : "",
        };
      },

      // ----------------------- Lab Tests (real frequently booked in rail + more list)
      "lab-tests": () => {
        const rail = take(frequentLabTests.length ? frequentLabTests : labTests, 10)
          .map((t) => ({ ...norm.lab(t), fit: "contain" }));

        // For the list, show more tests (without images)
        const more = take(labTests, 10).map((t) => ({
          title: first(t, "name", "title"),
          to: `/lab-tests/${slugify(first(t, "slug", "name", "title"))}`,
        }));

        return {
          ...base,
          title: "Lab Tests",
          tagline: "Frequently booked diagnostics and more.",
          railItems: rail,
          railHint: "Frequently booked",
          listItems: more,
          listHint: "Other tests",
        };
      },

      // ----------------------- Doctor Consult (real featured doctors)
      "doctor-consult": () => {
        const railSrc = doctorsFeatured.length ? doctorsFeatured : doctors;
        const rail = take(railSrc, 10).map((d) => ({ ...norm.doctor(d), fit: "cover" }));
        return {
          ...base,
          title: "Doctor Consult",
          tagline: "Top consults from your main lineup.",
          railItems: rail,
          railHint: "Top doctors",
          listItems: [],
        };
      },

      // ----------------------- Healthcare & Essentials (real featured shelves)
      healthcare: () => {
        const railSrc = healthcareFeatured.length ? healthcareFeatured : products;
        const rail = take(railSrc, 10).map((p) => ({ ...norm.product(p), fit: "contain" }));

        // More items as a simple list
        const more = take(products, 10).map((p) => ({
          title: first(p, "title", "name"),
          to: `/product/${slugify(first(p, "title", "name"))}`,
        }));

        return {
          ...base,
          title: "Healthcare & Essentials",
          tagline: "Your real featured shelves, neatly organized.",
          railItems: rail,
          railHint: "Featured",
          listItems: more,
          listHint: "More items",
        };
      },

      // ----------------------- Health Blogs (real articles)
      "health-blogs": () => {
        const railSrc = blogArticles.length ? blogArticles : blogs;
        const rail = take(railSrc, 8).map((b) => ({ ...norm.article(b), fit: "cover" }));
        return {
          ...base,
          title: "Health Blogs",
          tagline: "Latest reads from your real articles.",
          railItems: rail,
          railHint: "Editor’s picks",
        };
      },

      // ----------------------- PLUS (redirected in useEffect)
      plus: () => ({
        ...base,
        title: "MediLab Plus",
        tagline: "Redirecting to PLUS…",
        listItems: [{ title: "Go to PLUS", to: "/plus" }],
        listHint: "Membership",
      }),

      // ----------------------- Keep empty (as requested)
      wellness: () => ({ ...base, title: "Wellness", tagline: "Content coming soon." }),
      fitness: () => ({ ...base, title: "Fitness", tagline: "Content coming soon." }),
    };

    return sections[slug] ? sections[slug]() : base;
  }, [slug]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 space-y-10">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{cfg.title}</h1>
          <p className="text-gray-600 mt-2">{cfg.tagline}</p>
        </header>

        {/* Rail */}
        {cfg.railItems?.length > 0 && (
          <section>
            {cfg.railHint && <p className="text-xs text-gray-500 mb-2">{cfg.railHint}</p>}
            <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
              {cfg.railItems.map((item, i) => (
                <RailCard key={i} {...item} />
              ))}
            </div>
          </section>
        )}

        {/* List */}
        {cfg.listItems?.length > 0 && (
          <section>
            {cfg.listHint && <p className="text-xs text-gray-500 mb-2">{cfg.listHint}</p>}
            <ul className="rounded-2xl border border-gray-200 bg-white divide-y">
              {cfg.listItems.map((it, i) => (
                <li key={i}>
                  <Link to={it.to} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition">
                    <span className="text-sm font-medium text-gray-900">{it.title}</span>
                    <RiArrowRightSLine className="text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}