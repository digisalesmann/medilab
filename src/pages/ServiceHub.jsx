import React, { useMemo, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// --- Inline SVG Icons (Replacing react-icons/ri and adding more) ---
const SVG_ICONS = {
  // RiArrowRightSLine
  ArrowRightS: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  ),
  // RiPillLine - Medicine
  Pill: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16 11V7l-4 4-2-2 4-4H8a5 5 0 00-5 5v8a5 5 0 005 5h10a5 5 0 005-5v-8a5 5 0 00-5-5zM8 20a3 3 0 01-3-3v-8a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-3 3H8z" />
    </svg>
  ),
  // RiFlaskLine - Lab Tests
  Flask: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v2h-2zm-2 3h6l-1 10H8l-1-10zm2 10h4v2h-4z" />
    </svg>
  ),
  // RiUserHeartLine - Doctor Consult
  UserHeart: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      <path d="M17.43 14.14c.14.02.29.04.43.04 1.49 0 2.94-.96 3.57-2.31.27-.58.42-1.24.42-1.93 0-2.21-1.79-4-4-4-1.39 0-2.61.69-3.36 1.74l-1.35 1.95 1.35 1.95c.75 1.05 1.97 1.74 3.36 1.74z" fill="none"/>
    </svg>
  ),
  // RiTShirtLine - Healthcare/Essentials (changed to a more general health icon)
  Bandage: (props) => (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M18.89 12.08c-.28-.27-.68-.41-1.07-.41h-2.12l.62-2.12c.16-.54-.01-1.12-.41-1.52l-1.41-1.41c-.4-.4-.98-.56-1.52-.41l-2.12.62v-2.12c0-.39-.14-.79-.41-1.07l-1.04-1.04c-.26-.26-.64-.4-1.04-.4s-.78.14-1.04.4L3.89 6.89c-.26.26-.4.64-.4 1.04s.14.78.4 1.04l1.04 1.04c.28.28.41.68.41 1.07v2.12l-.62 2.12c-.16.54.01 1.12.41 1.52l1.41 1.41c.4.4.98.56 1.52.41l2.12-.62h2.12c.39 0 .79.14 1.07.41l1.04 1.04c.26.26.64.4 1.04.4s.78-.14 1.04-.4l4.18-4.18c.26-.26.4-.64.4-1.04s-.14-.78-.4-1.04l-1.04-1.04zm-1.04 1.04l-1.04 1.04c-.28.28-.68.41-1.07.41h-2.12l-.62 2.12c-.16.54.01 1.12.41 1.52l1.41 1.41c.4.4.98.56 1.52.41l2.12-.62v-2.12c0-.39.14-.79.41-1.07l1.04-1.04c.26-.26.4-.64.4-1.04s-.14-.78-.4-1.04l-1.04-1.04c-.28-.28-.68-.41-1.07-.41h-2.12l-.62-2.12c-.16-.54.01-1.12.41-1.52l1.41-1.41c.4-.4.98-.56 1.52-.41l2.12.62v2.12c0 .39.14.79.41 1.07z" />
      </svg>
  ),
  // RiBookOpenLine - Blogs
  BookOpen: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21 21v-2c0-1.1-.9-2-2-2h-3v-2h3c2.21 0 4-1.79 4-4s-1.79-4-4-4h-3V5h3c2.21 0 4-1.79 4-4H12c-2.21 0-4 1.79-4 4v.13l-1.7-1.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L7 6.13V21h14zm-2 0H5v-2h14v2z" />
    </svg>
  ),
  // RiLeafLine - Wellness
  Leaf: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17 8c-2.76 0-5 2.24-5 5v7H8v-7c0-2.76-2.24-5-5-5H1v12h18V13c0-2.76-2.24-5-5-5zm-2 0h-2v2h2v-2z" />
    </svg>
  ),
  // RiRunLine - Fitness
  Run: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-1 2.5H11v11h1v-4h1v-7zm7.5 1h-2v11h2v-4h1v-7zm-4-1h-2v11h2v-4h1v-7z" />
    </svg>
  ),
  // RiStarLine
  Star: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  ),
};

// --- Embedded Mock Data (Enhanced for Professional Variety) ---
const mockData = {
    // General Banners/Slides
    homeSlides: [
        { title: "Exclusive Premium Tier Access", slug: "promo-premium", image: "https://placehold.co/400x200/5a2d82/ffffff?text=Premium+Access+Upgrade", type: "promo" },
        { title: "Q4 Wellness Checkups", slug: "annual-checkup", image: "https://placehold.co/400x200/007bff/ffffff?text=Annual+Health+Focus", type: "service" },
        { title: "Tele-Health: Consult Instantly", slug: "telehealth-instant", image: "https://placehold.co/400x200/28a745/ffffff?text=Virtual+Care+Now", type: "service" },
    ],

    // 1. MEDICINE Specific
    featuredMedicines: [
        { name: "Sustained-Release Multi-Vitamins (30 Day)", slug: "sustained-vita", image: "https://placehold.co/200x200/f8d7da/721c24?text=Sustained+V+Complex", price: 34.99 },
        { name: "Chronic Care Prescription Management", slug: "chronic-refill", image: "https://placehold.co/200x200/d1ecf1/0c5460?text=Auto+Rx+Manage", type: "service" },
        { name: "Advanced Pain Relief Topical Gel", slug: "pain-gel", image: "https://placehold.co/200x200/fff3cd/856404?text=Topical+Relief", price: 19.50 },
    ],
    medicineQuickLinks: [
        { name: "Prescription Upload & Refill", slug: "rx-upload" },
        { name: "Antibiotics & Infections", slug: "infections" },
        { name: "Women's Health & Care", slug: "womens-health" },
        { name: "Medication Side Effect Lookup", slug: "side-effect-lookup" },
    ],

    // 2. LAB TESTS Specific
    featuredLabTests: [
        { name: "Ultimate Metabolic Health Panel", slug: "metabolic-panel", image: "https://placehold.co/100x100/3498db/ffffff?text=Metabolic", isKit: false, price: 299, subtitle: "Glucose, Liver, Kidney, Hormones" },
        { name: "Microbiome At-Home Test Kit", slug: "microbiome-kit", image: "https://placehold.co/100x100/e67e22/ffffff?text=Microbiome", isKit: true, price: 175, subtitle: "Gut Health Analysis" },
        { name: "Cardiac Risk Assessment Panel", slug: "cardiac-risk", image: "https://placehold.co/100x100/2ecc71/ffffff?text=Cardiac", isKit: false, price: 110, subtitle: "Advanced Lipid & Inflammation" },
    ],
    labTestCollections: [
        { name: "Sexual Health Screening", slug: "shs" },
        { name: "Nutritional Deficiency Testing", slug: "deficiency" },
        { name: "Heavy Metals & Toxicology", slug: "toxicology" },
    ],

    // 3. DOCTOR CONSULT Specific
    featuredDoctors: [
        { name: "Dr. Anya Sharma", specialty: "Virtual Cardiology", slug: "anya-sharma", image: "https://placehold.co/100x100/e91e63/ffffff?text=AS" },
        { name: "Dr. Leo Chen", specialty: "Tele-Dermatology", slug: "leo-chen", image: "https://placehold.co/100x100/9c27b0/ffffff?text=LC" },
        { name: "Dr. Zara Khan", specialty: "Mental Wellness", slug: "zara-khan", image: "https://placehold.co/100x100/ff9800/ffffff?text=ZK" },
    ],
    topSpecialties: [
        { name: "Behavioral Health", slug: "behavioral-health" },
        { name: "Chronic Pain Management", slug: "chronic-pain" },
        { name: "Pediatric Consultation (Video)", slug: "pediatrics-video" },
        { name: "Physiotherapy (Virtual)", slug: "physio-virtual" },
    ],

    // 4. HEALTHCARE Specific (Devices & Essentials)
    featuredEssentials: [
        { name: "Precision Digital Scale & Analyzer", slug: "smart-scale", image: "https://placehold.co/200x200/58385e/ffffff?text=Smart+Scale" },
        { name: "Premium Home First Aid Kit", slug: "aid-kit-pro", image: "https://placehold.co/200x200/4CAF50/ffffff?text=Aid+Kit+Pro" },
        { name: "Portable Pulse Oximeter", slug: "oximeter-port", image: "https://placehold.co/200x200/00BCD4/ffffff?text=Oximeter" },
    ],
    essentialCategories: [
        { name: "Diabetic Care & Supplies", slug: "diabetic-care" },
        { name: "Mobility & Support Aids", slug: "mobility" },
        { name: "Air Purification & Allergy", slug: "air-purify" },
    ],

    // 5. HEALTH BLOGS Specific (Expert Content)
    featuredArticles: [
        { title: "The Next Era of Longevity Science: What You Need to Know", slug: "longevity-science", summary: "A deep-dive into NAD+ therapy and cellular rejuvenation.", cover: "https://placehold.co/400x200/4CAF50/ffffff?text=Longevity+Research" },
        { title: "Understanding Your Lab Report: Markers of Inflammation", slug: "lab-inflammation", summary: "Focus on CRP, Homocysteine, and their clinical relevance.", cover: "https://placehold.co/400x200/2196F3/ffffff?text=Lab+Markers" },
        { title: "The Silent Epidemic: Identifying and Treating Burnout", slug: "burnout-guide", summary: "Expert strategies for managing professional and personal stress.", cover: "https://placehold.co/400x200/FF9800/ffffff?text=Burnout+Strategy" },
    ],

    // 6. WELLNESS Specific (Holistic & Mental Health)
    featuredWellness: [
        { name: "Mindfulness & CBT Digital Program", slug: "cbt-program", image: "https://placehold.co/200x200/795548/ffffff?text=Mind+Program", type: "program", subtitle: "Cognitive Behavioral Techniques" },
        { name: "High-Potency De-Stress Magnesium", slug: "magnesium-stress", image: "https://placehold.co/200x200/607D8B/ffffff?text=Magnesium+Calm", type: "product", price: 25.00 },
        { name: "Personalized Nutrition Consultation", slug: "nutrition-consult", image: "https://placehold.co/200x200/3F51B5/ffffff?text=Nutrition+Plan", type: "service", subtitle: "Dietary Assessment & Plan" },
    ],
    wellnessTopics: [
        { name: "Sleep Hygiene Optimization", slug: "sleep-optimize" },
        { name: "Digestive & Gut Health Focus", slug: "gut-health" },
        { name: "Emotional Resilience Coaching", slug: "resilience-coach" },
    ],

    // 7. FITNESS Specific (Performance & Recovery)
    featuredFitness: [
        { name: "Advanced Sport Recovery Massager", slug: "recovery-gun", image: "https://placehold.co/200x200/FF5722/ffffff?text=Recovery+Massager", type: "product" },
        { name: "Customized Strength & Conditioning Plan", slug: "strength-plan", image: "https://placehold.co/200x200/8BC34A/ffffff?text=Strength+Plan", type: "plan" },
        { name: "Injury Prevention Workshop (Virtual)", slug: "injury-workshop", image: "https://placehold.co/200x200/E91E63/ffffff?text=Injury+Prevent", type: "workshop" },
    ],
    fitnessPrograms: [
        { name: "Home Workout Plans (No Equipment)", slug: "home-workouts" },
        { name: "Endurance & Cardio Training", slug: "cardio" },
        { name: "Virtual Yoga and Mobility Classes", slug: "yoga-mobility" },
    ],
};

// --- Configuration ---
const DOCTOR_ROUTE_BASE = "/doctors"; 
const HUB_SECTIONS = [
  { slug: "medicine", name: "Medicine", icon: SVG_ICONS.Pill, to: "/hub/medicine" },
  { slug: "lab-tests", name: "Lab Tests", icon: SVG_ICONS.Flask, to: "/hub/lab-tests" },
  { slug: "doctor-consult", name: "Consult", icon: SVG_ICONS.UserHeart, to: "/hub/doctor-consult" },
  { slug: "healthcare", name: "Essentials", icon: SVG_ICONS.Bandage, to: "/hub/healthcare" }, // Icon changed
  { slug: "health-blogs", name: "Blogs", icon: SVG_ICONS.BookOpen, to: "/hub/health-blogs" },
  { slug: "wellness", name: "Wellness", icon: SVG_ICONS.Leaf, to: "/hub/wellness" },
  { slug: "fitness", name: "Fitness", icon: SVG_ICONS.Run, to: "/hub/fitness" },
];

// ---------- Utility Functions (Kept for Robustness) ----------
const slugify = (str) => (str ? String(str).toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-") : "");
const take = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n) : []);
const first = (obj, ...keys) => keys.map((k) => obj?.[k]).find((v) => v != null);
const ensureLeadingSlash = (p) => typeof p === "string" && p.trim() ? (p.startsWith("/") ? p : `/${p}`) : "/";

const resolveDoctorLink = (item) => {
  const explicit = first(item, "profileUrl", "profile", "url", "to", "href");
  if (typeof explicit === "string" && explicit.trim()) {
    if (/^https?:\/\//i.test(explicit)) return explicit;
    return ensureLeadingSlash(explicit); 
  }
  const idOrSlug = first(item, "slug", "handle", "username", "id", "name");
  if (idOrSlug) {
    return `${ensureLeadingSlash(DOCTOR_ROUTE_BASE)}/${slugify(idOrSlug)}`;
  }
  return ensureLeadingSlash(DOCTOR_ROUTE_BASE);
};

// Normalize any “card-ish” item into our rail/list shape
const norm = {
  slide: (item, fallbackTo = "/") => ({
    title: first(item, "title", "name", "label") || "Untitled",
    subtitle: first(item, "subtitle", "type"),
    img: first(item, "image", "img", "banner", "cover"),
    to: first(item, "to", "href", "link") || (item?.slug ? `${fallbackTo}/${slugify(item.slug)}` : fallbackTo),
  }),
  product: (item) => ({
    title: first(item, "name", "title") || "Product",
    subtitle: item.price ? `$${item.price.toFixed(2)}` : first(item, "subtitle"),
    img: first(item, "image", "img"),
    to: `/product/${slugify(first(item, "slug", "name", "title"))}`,
  }),
  lab: (item) => ({
    title: first(item, "name", "title") || "Lab Test",
    subtitle: first(item, "subtitle") || (item.isKit ? "At-Home Kit" : "In-Lab Appointment"),
    img: first(item, "image", "img", "icon"),
    to: `/lab-tests/${slugify(first(item, "slug", "name", "title"))}`,
  }),
  doctor: (item) => ({
    title: first(item, "name", "title") || "Doctor",
    subtitle: first(item, "specialty", "department", "role") || "Specialist",
    img: first(item, "image", "img", "avatar"),
    to: resolveDoctorLink(item),
  }),
  article: (item) => ({
    title: first(item, "title", "name") || "Article",
    img: first(item, "image", "img", "cover"),
    snippet: first(item, "snippet", "summary", "excerpt"),
    to: `/blogs/${slugify(first(item, "slug", "title"))}`,
  }),
  topic: (item, base) => ({
      title: first(item, "name", "title") || "Category",
      to: `${base}/${slugify(first(item, "slug", "name", "title"))}`,
  })
};

// ---------- Component: HubTabs (Sticky Navigation) ----------
const HubTabs = ({ currentSlug }) => {
    return (
        <nav 
            className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm"
            role="tablist"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex overflow-x-auto whitespace-nowrap -mb-px">
                    {HUB_SECTIONS.map((section) => {
                        const isActive = section.slug === currentSlug;
                        const Icon = section.icon;

                        return (
                            <Link
                                key={section.slug}
                                to={section.to}
                                role="tab"
                                aria-selected={isActive}
                                className={`
                                    flex items-center space-x-2 px-4 py-3 text-sm font-semibold transition-colors duration-200
                                    ${isActive
                                        ? "text-emerald-600 border-b-2 border-emerald-600"
                                        : "text-gray-500 hover:text-gray-800"
                                    }
                                `}
                            >
                                <Icon className="text-lg" />
                                <span>{section.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};


// ---------- Component: RailCard (Rectangular for Products/Articles/Labs) ----------
const RailCard = ({ title, to, img, subtitle, snippet, fit = "cover" }) => {
  const isExternal = typeof to === "string" && /^https?:\/\//i.test(to);
  const Wrapper = ({ children }) =>
    isExternal ? (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-44 sm:w-52 h-56 rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
      >
        {children}
      </a>
    ) : (
      <Link
        to={to}
        className="flex-shrink-0 w-44 sm:w-52 h-56 rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden group"
      >
        {children}
      </Link>
    );

  return (
    <Wrapper>
      <div
        className={[
          "w-full h-32 border-b border-gray-100 overflow-hidden",
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
            // Placeholder for image loading failure
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/e5e7eb/555?text=Content"; }}
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">No Image</div>
        )}
      </div>

      <div className="px-3 pt-2 pb-3 flex flex-col justify-between h-24">
        <div>
            <p className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition leading-tight">{title}</p>
            {subtitle && <p className="text-xs font-medium text-emerald-700/80 truncate mt-0.5">{subtitle}</p>}
        </div>
        {snippet && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{snippet}</p>}
      </div>
    </Wrapper>
  );
};

// ---------- Component: DoctorCard (Circular Avatars for Doctors) ----------
const DoctorCard = ({ title, to, img, subtitle }) => {
    return (
        <Link
            to={to}
            className="flex-shrink-0 w-36 h-48 flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group text-center"
        >
            <div className="w-20 h-20 rounded-full border-4 border-emerald-500/50 overflow-hidden shadow-md flex-shrink-0">
                {img ? (
                    <img
                        src={img}
                        alt={`Dr. ${title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/e5e7eb/555?text=DR"; }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">DR</div>
                )}
            </div>
            <div className="mt-3">
                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-600 transition">{title}</p>
                {subtitle && <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{subtitle}</p>}
            </div>
        </Link>
    );
};


// ---------- Component: ServiceHub Logic and Rendering ----------
export default function ServiceHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathnameParts = location.pathname.split("/").filter(Boolean);
  const slug = pathnameParts[pathnameParts.length - 1]; // Get the last part of the URL

  // PLUS: go straight to /plus if they navigate to /hub/plus
  useEffect(() => {
    if (slug === "plus") navigate("/plus", { replace: true });
  }, [slug, navigate]);

  const cfg = useMemo(() => {
    const base = {
      title: "Service Hub",
      tagline: "Select a professional category to find services, products, and experts.",
      viewAllLink: "/services",
      viewAllLabel: "View All Available Services",
      railItems: take(mockData.homeSlides, 3).map(s => norm.slide(s, "/home")), // Default to general banners
      railHint: "Featured promotions and announcements",
      listItems: [],
      listHint: "",
    };

    // Data selection shortcuts
    const sections = {
      // ----------------------- 1. Medicines
      medicine: () => {
        const rail = take(mockData.featuredMedicines, 6)
          .map((p) => ({ ...norm.product(p), fit: "contain" }));

        const list = take(mockData.medicineQuickLinks, 6)
          .map((t) => norm.topic(t, "/medicines/category"));
        
        return {
          ...base,
          title: "Online Pharmacy & Rx Management",
          tagline: "Premium prescription delivery, refill management, and trusted over-the-counter essentials.",
          viewAllLink: "/medicines",
          viewAllLabel: "Shop All Medications & Supplies",
          railItems: rail,
          railHint: "Featured Products & Prescription Services",
          listItems: list,
          listHint: "Quick Links by Health Category",
        };
      },

      // ----------------------- 2. Lab Tests
      "lab-tests": () => {
        const rail = take(mockData.featuredLabTests, 6)
          .map((t) => ({ ...norm.lab(t), fit: "contain" }));

        const list = take(mockData.labTestCollections, 6)
          .map((t) => norm.topic(t, "/lab-tests/collection"));

        return {
          ...base,
          title: "Diagnostic Testing & At-Home Kits",
          tagline: "Book advanced lab panels and receive personalized results. Home sample collection available.",
          viewAllLink: "/lab-tests",
          viewAllLabel: "Explore All Diagnostic Services",
          railItems: rail,
          railHint: "Popular Wellness & Disease Monitoring Panels",
          listItems: list,
          listHint: "Browse Test Collections",
        };
      },

      // ----------------------- 3. Doctor Consult
      "doctor-consult": () => {
        const rail = take(mockData.featuredDoctors, 8).map((d) => ({ ...norm.doctor(d), isDoctor: true, fit: "cover" }));
        
        const list = take(mockData.topSpecialties, 6).map(d => norm.topic(d, "/doctors/specialty"));

        return {
          ...base,
          title: "Specialist Tele-Consultation",
          tagline: "Connect instantly with verified, highly-rated specialists for virtual video or chat appointments.",
          viewAllLink: "/doctors",
          viewAllLabel: "Find & Book a Specialist Now",
          railItems: rail,
          railHint: "Top-Rated Virtual Visit Experts",
          listItems: list,
          listHint: "Browse by Top Specialties",
        };
      },

      // ----------------------- 4. Healthcare Essentials
      healthcare: () => {
        const rail = take(mockData.featuredEssentials, 6).map((p) => ({ ...norm.product(p), fit: "contain" }));

        const list = take(mockData.essentialCategories, 6)
          .map((p) => norm.topic(p, "/essentials/category"));

        return {
          ...base,
          title: "Medical Devices & Home Health Essentials",
          tagline: "Premium-grade health monitoring devices, mobility aids, and essential supplies.",
          viewAllLink: "/essentials",
          viewAllLabel: "Shop All Home Health Products",
          railItems: rail,
          railHint: "Featured Monitoring Devices",
          listItems: list,
          listHint: "Browse by Product Category",
        };
      },

      // ----------------------- 5. Health Blogs
      "health-blogs": () => {
        const rail = take(mockData.featuredArticles, 8).map((b) => ({ ...norm.article(b), fit: "cover" }));
        return {
          ...base,
          title: "Expert Health & Research Articles",
          tagline: "Stay informed with curated, peer-reviewed content on longevity, disease management, and wellness trends.",
          viewAllLink: "/blogs",
          viewAllLabel: "Read All Expert Content",
          railItems: rail,
          railHint: "Latest Research & Deep-Dives",
        };
      },

      // ----------------------- 6. Wellness
      wellness: () => {
        const rail = take(mockData.featuredWellness, 6).map((p) => ({ ...norm.product(p), fit: "contain" }));

        const list = take(mockData.wellnessTopics, 6)
          .map((t) => norm.topic(t, "/wellness/topic"));
          
        return { 
            ...base, 
            title: "Mind, Nutrition, and Holistic Health", 
            tagline: "Programs and products designed for mental clarity, stress reduction, and optimal nutritional balance.", 
            viewAllLink: "/wellness",
            viewAllLabel: "Explore All Wellness Programs",
            railItems: rail,
            railHint: "Featured Mental Health & Nutritional Support",
            listItems: list,
            listHint: "Focus Areas for Holistic Health",
        };
      },

      // ----------------------- 7. Fitness
      fitness: () => {
        const rail = take(mockData.featuredFitness, 6).map((p) => ({ ...norm.product(p), fit: "contain" }));

        const list = take(mockData.fitnessPrograms, 6)
            .map((t) => norm.topic(t, "/fitness/programs"));

        return { 
            ...base, 
            title: "Performance, Training, and Recovery", 
            tagline: "Professional-grade training plans, high-end gear, and specialized recovery services for peak performance.", 
            viewAllLink: "/fitness",
            viewAllLabel: "Find Training & Recovery Services",
            railItems: rail,
            railHint: "Top Gear & Specialized Recovery Services",
            listItems: list,
            listHint: "Browse Training Programs",
        };
      },
    };

    return sections[slug] ? sections[slug]() : base;
  }, [slug]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <HubTabs currentSlug={slug} />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
            
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">{cfg.title}</h1>
                <p className="text-gray-600 mt-2 max-w-3xl">{cfg.tagline}</p>
            </header>

            {/* --- Hero Link / Call to Action --- */}
            <Link
                to={cfg.viewAllLink}
                className="flex items-center justify-between p-5 bg-emerald-600 text-white rounded-xl shadow-xl hover:bg-emerald-700 transition-all duration-300 mb-10 transform hover:scale-[1.005]"
            >
                <span className="text-lg font-bold flex items-center">
                    <SVG_ICONS.Star className="text-2xl w-6 h-6 mr-3 animate-pulse text-yellow-300" />
                    {cfg.viewAllLabel}
                </span>
                <SVG_ICONS.ArrowRightS className="text-3xl w-8 h-8" />
            </Link>


            {/* --- Content Sections --- */}

            {/* Rail (Horizontal Scroll) - Featured Cards */}
            {cfg.railItems?.length > 0 && (
                <section className="mb-12">
                    {cfg.railHint && <h2 className="text-xl font-bold text-gray-800 mb-4">{cfg.railHint}</h2>}
                    <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                        {cfg.railItems.map((item, i) => (
                            // Determine card type based on context (Doctor Card for Doctor Consult slug)
                            slug === 'doctor-consult' ? (
                                <DoctorCard key={i} {...item} />
                            ) : (
                                <RailCard key={i} {...item} />
                            )
                        ))}
                    </div>
                </section>
            )}

            {/* List (Vertical Links) - Quick Links / Categories */}
            {cfg.listItems?.length > 0 && (
                <section className="mb-12">
                    {cfg.listHint && <h2 className="text-xl font-bold text-gray-800 mb-4">{cfg.listHint}</h2>}
                    <ul className="rounded-xl border border-gray-100 bg-white shadow-xl divide-y divide-gray-100">
                        {cfg.listItems.map((it, i) => (
                            <li key={i}>
                                <Link to={it.to} className="flex items-center justify-between px-5 py-4 hover:bg-emerald-50 transition rounded-xl group">
                                    <span className="text-base font-medium text-gray-900 group-hover:text-emerald-700 transition">
                                        {it.title}
                                    </span>
                                    <SVG_ICONS.ArrowRightS className="text-gray-400 group-hover:text-emerald-600 text-xl w-6 h-6 transition" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Empty State / Fallback */}
            {cfg.railItems?.length === 0 && cfg.listItems?.length === 0 && (
                <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-100">
                    <p className="text-lg font-semibold text-gray-800">No Content Available Yet</p>
                    <p className="text-gray-500 mt-2">We are curating specialized content for the **{cfg.title}** hub. Please check back later or explore another category.</p>
                </div>
            )}
        </main>
    </div>
  );
}
