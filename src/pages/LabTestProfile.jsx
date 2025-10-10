import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import {
  Droplets, Clock, Home, Percent, Beaker, Star, Info, BadgeCheck, FileText, Users,
  Baby, Activity, HeartPulse, Stethoscope, ShieldCheck, Syringe, UserRound, Hospital, ChevronLeft, ChevronRight as ChevronRightIcon,
  SlidersHorizontal, CheckCircle, MessageSquare, ClipboardList, ArrowRight, BookOpen, Clock3, MapPin, CalendarCheck, Book
} from "lucide-react";
// Since this is a single file simulation, we'll mock these utilities
// In a real project, we would use react-router-dom and other external imports
const useParams = () => ({ slug: "advanced-thyroid-panel" });
const useNavigate = () => (path) => console.log("Navigate to:", path);

// --- MOCK DATA (Enriched for premium functionality) ---
const mockLabTests = [
  {
    title: "Advanced Thyroid Panel",
    name: "Thyroid Health Check",
    slug: "advanced-thyroid-panel",
    desc: "A comprehensive analysis of your thyroid function, including TSH, T3, T4, and crucial antibodies, offering deeper insights into metabolic and autoimmune health. This panel is highly recommended for those with unexplained fatigue, weight changes, or a family history of thyroid issues.",
    newPrice: 12500,
    oldPrice: 18000,
    discount: "30% OFF",
    sampleType: "Blood",
    fastingRequired: "10-12 hours required",
    homeSample: true,
    reportTime: "24-36 Hours",
    parametersCount: 12,
    rating: 4.8,
    reviews: 789,
    image: "https://placehold.co/400x300/e0f2f1/047857?text=Thyroid+Test",
    images: [
      "https://placehold.co/400x300/e0f2f1/047857?text=Thyroid+Test",
      "https://placehold.co/400x300/f0fdf4/16a34a?text=Sample+Collection",
      "https://placehold.co/400x300/f0f9ff/0369a1?text=Lab+Report+Analysis",
    ],
    bg: "bg-emerald-50",
    whoIsItFor: ["Women (esp. pregnant)", "Men over 40", "Fatigue/Weight issues", "Autoimmune concerns"],
    preparation: [
      "Fasting is mandatory for 10-12 hours before sample collection.",
      "Inform phlebotomist if you are on any thyroid medication.",
      "Avoid strenuous exercise 24 hours prior to the test.",
      "Ensure adequate rest the night before.",
    ],
    parameters: [
      { group: "Core Thyroid Hormones", items: ["TSH", "Free T3", "Free T4"] },
      { group: "Antibodies", items: ["Anti-TPO", "Thyroglobulin Antibodies"] },
      { group: "Metabolic Markers", items: ["Vitamin D", "Ferritin", "B12"] },
    ],
    partnerLabs: ["Global Diagnostics Inc.", "Precision Health Labs", "Apex Medical Centers"],
    faqs: [
      { q: "What is TSH and why is it important?", a: "Thyroid-stimulating hormone (TSH) controls thyroid hormone production. Abnormal levels can indicate an underactive or overactive thyroid. This is the primary marker for initial screening." },
      { q: "Is home sample collection safe?", a: "Yes, our certified phlebotomists follow strict hygiene protocols using single-use, sterile equipment and wear full PPE." },
      { q: "How do I understand my report?", a: "The detailed report includes reference ranges and clinical interpretations. We also offer a free consultation with a health expert to explain your results and next steps." },
    ],
    articles: [
      { title: "The silent epidemic: Understanding Thyroid Disorders", link: "#", img: "https://placehold.co/300x150/f0fdf4/16a34a?text=The+Silent+Epidemic" },
      { title: "Nutrition tips for a healthy thyroid", link: "#", img: "https://placehold.co/300x150/f0f9ff/0369a1?text=Nutrition+Tips" },
      { title: "When to screen for TPO antibodies", link: "#", img: "https://placehold.co/300x150/e0f2f1/047857?text=Screening+Guidelines" },
    ],
  },
  {
    title: "Comprehensive Wellness Profile",
    name: "Wellness Check",
    slug: "comprehensive-wellness-profile",
    desc: "Full body check covering liver, kidney, blood sugar, lipid panel, and more for overall health assessment. Recommended for annual check-ups.",
    newPrice: 8500,
    oldPrice: 10000,
    discount: "15% OFF",
    sampleType: "Blood",
    fastingRequired: "8-10 hours required",
    homeSample: true,
    reportTime: "24 Hours",
    parametersCount: 75,
    rating: 4.6,
    reviews: 1200,
    image: "https://placehold.co/400x300/f0fdf4/16a34a?text=Wellness+Check",
    images: ["https://placehold.co/400x300/f0fdf4/16a34a?text=Wellness+Check"],
    bg: "bg-green-50",
    whoIsItFor: ["General Checkup", "Adults (Annual)", "Diabetic Screening", "Fitness Tracking"],
    preparation: ["Fasting for 8-10 hours is advised.", "Drink plenty of water."],
    parameters: [
      { group: "Blood Sugar", items: ["Fasting Glucose", "HbA1c"] },
      { group: "Lipid Profile", items: ["Total Cholesterol", "LDL", "HDL", "Triglycerides"] },
      { group: "Liver Function", items: ["SGOT", "SGPT", "Bilirubin"] },
      { group: "Kidney Function", items: ["Creatinine", "Urea", "Uric Acid"] },
    ],
    partnerLabs: ["Global Diagnostics Inc.", "Precision Health Labs"],
    faqs: [
      { q: "What is the benefit of 75+ parameters?", a: "It provides a holistic view of your body's major organ systems, catching potential issues earlier than a basic checkup." },
    ],
    articles: [
      { title: "The Importance of Annual Screening", link: "#", img: "https://placehold.co/300x150/f0fdf4/16a34a?text=Annual+Screening" },
      { title: "Decoding Your Lipid Profile", link: "#", img: "https://placehold.co/300x150/f0f9ff/0369a1?text=Lipid+Profile" },
    ],
  },
];

const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const StarRow = ({ value = 0, size = 16, className = "" }) => {
  const r = Math.round(value);
  return (
    <div className={`inline-flex items-center ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`mr-0.5 ${i < r ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
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
  if (s.includes("fatigue") || s.includes("weight")) return SlidersHorizontal;
  if (s.includes("autoimmune")) return ShieldCheck;
  return Stethoscope;
};

// --- PREMIUM COMPONENTS ---

const IconStatCard = ({ icon: Icon, title, value }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm transition hover:shadow-md w-full">
    <div className="p-3 rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0">
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-left truncate">
      <p className="text-xs sm:text-sm font-medium text-gray-500">{title}</p>
      <p className="text-sm sm:text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
)

// New sticky element for mobile/scroll action (Functional CTA)
const StickyBookingPanel = ({ title, price, oldPrice, discount, navigate, bookingRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  // This hook detects when the main booking section has scrolled out of view
  useEffect(() => {
    const handleScroll = () => {
      if (!bookingRef.current) return;
      const { top } = bookingRef.current.getBoundingClientRect();
      const scrolledPast = top < -200; // Show the sticky bar if the main booking button is scrolled past
      setIsVisible(scrolledPast);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bookingRef]);

  // If the ref is not ready, we rely on the component being unmounted/re-rendered.
  if (!bookingRef || !bookingRef.current) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[100] p-3 bg-white border-t shadow-lg md:hidden transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex items-center justify-between gap-4 max-w-xl mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-600 truncate">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              ₦{Number(price).toLocaleString()}
            </span>
            {oldPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₦{Number(oldPrice).toLocaleString()}
              </span>
            )}
          </div>
          {discount && (
            <span className="text-xs text-emerald-600 font-medium">
              ({discount})
            </span>
          )}
        </div>
        <button
          className="flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
          onClick={() => console.log("Book Now clicked")}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function PremiumLabTestProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Ref for the main booking button area to determine when to show the sticky bar
  const bookingTriggerRef = useRef(null);

  // 1) Find test (memoized)
  const test = useMemo(() => {
    const bySlug = (mockLabTests || []).find((t) => t.slug === slug);
    if (bySlug) return bySlug;
    return (mockLabTests || []).find((t) => slugify(t.title || t.name || "") === slug) || null;
  }, [slug]);

  // 2) Derive safe fallbacks
  const title = test?.title || test?.name || "Premium Lab Test";
  const desc = test?.desc || "";
  const image = test?.image || "https://placehold.co/400x300/cccccc/333333?text=Test+Image";
  const gallery = useMemo(() => {
    const imgs = Array.isArray(test?.images) ? test.images : [];
    const g = (imgs.length ? imgs : [image]).filter(Boolean);
    return g.length ? g : ["https://placehold.co/400x300/cccccc/333333?text=Test+Image"];
  }, [test?.images, image]);

  // 3) Gallery State and Touch/Keyboard Logic
  const [active, setActive] = useState(0);

  // Reset state on test change
  useEffect(() => {
    setActive(0);
    setActiveTab("overview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

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
    if (Math.abs(dx) > 40) { // Set a minimum swipe distance
      setActive((i) => (dx < 0 ? (i + 1) % gallery.length : (i - 1 + gallery.length) % gallery.length));
    }
    startX.current = null;
  };

  // 4) Not found
  if (!test) {
    return (
      <div className="px-4 py-20 text-center">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Test not found</h2>
        <button
          onClick={() => navigate("/lab-tests")}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
        >
          Back
        </button>
      </div>
    );
  }

  // 5) Safe to read all fields
  const {
    newPrice, oldPrice, discount, sampleType, fastingRequired, homeSample, reportTime, parametersCount,
    parameters = [], preparation = [], whoIsItFor = [], partnerLabs = [], rating = 4.5, reviews = 0,
    faqs = [], articles = [], bg,
  } = test;

  const TabButton = ({ tab, label, Icon }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center py-3 text-sm font-semibold transition ${
        activeTab === tab
          ? "border-b-2 border-emerald-600 text-emerald-700 bg-emerald-50"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-4 h-4 mr-1 hidden sm:block" /> {label}
    </button>
  );

  const ArticleCard = ({ article }) => (
    <a href={article.link} className="block group">
      <div
        className="rounded-2xl border border-gray-200 shadow-lg overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col"
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${article.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
      >
        <div className="p-5 flex flex-col justify-between flex-grow">
            <div className="flex items-center text-xs font-semibold text-emerald-600 mb-2">
                <Book className="w-4 h-4 mr-1.5" /> HEALTH INSIGHT
            </div>
            <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition text-left">{article.title}</h4>
        </div>
        <div className="p-5 border-t border-gray-100 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center justify-between text-sm font-semibold text-emerald-600">
                Read Article
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
      </div>
    </a>
  );

  const getTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <section className="space-y-8 text-left">
            {/* Key Benefits */}
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Key Benefits of This Premium Panel</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-emerald-50/70 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Health Expert Consultation</h4>
                  <p className="text-sm text-gray-700">Receive a free call from a certified doctor to discuss your comprehensive report.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-emerald-50/70 shadow-sm">
                <Clock3 className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Fastest Report Time</h4>
                  <p className="text-sm text-gray-700">Guaranteed digital report delivery within **{reportTime}** or sooner.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl border bg-emerald-50/70 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">Accredited Partner Labs</h4>
                  <p className="text-sm text-gray-700">Processing done only at ISO-certified and nationally recognized labs for maximum reliability.</p>
                </div>
              </div>
            </div>

            {/* Who Is It For */}
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Who is this test for?</h3>
              {whoIsItFor.length === 0 ? (
                <p className="text-sm text-gray-600">Applies broadly to adults unless otherwise specified.</p>
              ) : (
                <ul className="flex flex-wrap gap-3 text-left">
                  {whoIsItFor.map((w) => {
                    const Icon = whoIcon(w);
                    return (
                      <li
                        key={w}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition text-sm font-medium text-emerald-800 shadow-sm"
                      >
                        <Icon className="w-4 h-4 text-emerald-600" />
                        <span>{w}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Partner Labs */}
            <div className="pt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">Our Trusted Partner Labs</h3>
              {partnerLabs.length === 0 ? (
                <p className="text-sm text-gray-600">Partner labs will be shown at checkout based on your location.</p>
              ) : (
                <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {partnerLabs.map((lab) => (
                    <li
                      key={lab}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border bg-white hover:border-emerald-300 hover:shadow-lg transition cursor-pointer shadow-md"
                    >
                      <Hospital className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800 text-left">{lab}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        );

      case "parameters":
        return (
          <section className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Detailed Test Parameters</h3>
            <p className="text-base text-gray-600">The **{title}** package includes a detailed analysis of **{parametersCount}+** markers, categorized below for clarity and in-depth health insight.</p>
            {parameters.length === 0 ? (
              <p className="text-sm text-gray-600">Parameter details will be provided in your report.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parameters.map((grp) => (
                  <div key={grp.group} className="rounded-2xl border bg-white p-6 shadow-xl hover:shadow-2xl transition">
                    <h4 className="text-xl font-bold text-emerald-700 mb-4 border-b pb-2">{grp.group}</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      {grp.items.map((it, idx) => (
                        <p key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                          <span className="text-left">{it}</span>
                        </p>
                      ))}
                    </div>
                    <button className="mt-4 text-sm font-semibold text-emerald-600 hover:text-emerald-800 transition flex items-center">
                        View Clinical Significance <ArrowRight className="w-3 h-3 ml-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case "preparation":
        return (
          <section className="space-y-8 text-left">
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Preparation Guide & FAQs</h3>

            {/* Fasting Alert */}
            {fastingRequired && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-4 shadow-md">
                <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-bold text-amber-800 text-lg">MANDATORY FASTING ALERT</h4>
                  <p className="text-sm text-amber-800 mt-1">**{fastingRequired}** is strictly required. Please adhere to this to ensure the highest accuracy of your results, particularly for blood sugar and lipid markers.</p>
                </div>
              </div>
            )}

            {/* Preparation Steps */}
            <div className="pt-2">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Detailed Preparation Steps</h4>
                {preparation.length === 0 ? (
                    <p className="text-sm text-gray-600">No special preparation required. You're all set!</p>
                ) : (
                    <ul className="space-y-4 text-base text-gray-700">
                    {preparation.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:border-emerald-300 transition">
                        <BadgeCheck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-left">{p}</span>
                        </li>
                    ))}
                    </ul>
                )}
            </div>

            {/* FAQs */}
            <div className="pt-4">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h4>
                <div className="divide-y rounded-2xl border bg-white shadow-xl">
                    {faqs.length === 0 ? (
                        <p className="p-4 text-sm text-gray-600 text-left">No specific FAQs for this test yet. Please contact support for any questions.</p>
                    ) : (
                        faqs.map((f, i) => (
                            <details key={i} className="p-4 group text-left transition duration-300">
                                <summary className="cursor-pointer text-base font-medium text-gray-900 flex items-center justify-between hover:text-emerald-700 transition">
                                    <span className="flex items-center">
                                        <FileText className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                                        {f.q}
                                    </span>
                                    <ChevronRightIcon className="w-5 h-5 text-gray-400 transform transition-transform duration-300 group-open:rotate-90 flex-shrink-0 ml-4" />
                                </summary>
                                <p className="mt-3 text-sm text-gray-700 pl-7">{f.a}</p>
                            </details>
                        ))
                    )}
                </div>
            </div>
          </section>
        );

      case "reviews":
        return (
          <section className="space-y-6 text-left">
            <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Customer Ratings & Reviews</h3>
            <div className="grid md:grid-cols-2 gap-8 md:items-stretch">

              {/* Rating Summary */}
              <div className="rounded-2xl bg-emerald-50 p-6 flex flex-col justify-center border border-emerald-200 shadow-xl text-left">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-gray-900">{Number(rating).toFixed(1)}</span>
                  <StarRow value={rating} size={28} />
                </div>
                <p className="mt-2 text-base font-semibold text-gray-700">{reviews.toLocaleString()} Verified Customer Ratings</p>
                <div className="mt-6 space-y-3">
                  {[5, 4, 3, 2, 1].map((s) => {
                    // Mock distribution for visualization
                    const pct = s === 5 ? 64 : s === 4 ? 19 : s === 3 ? 7 : s === 2 ? 3 : 7;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <div className="w-12 text-base font-semibold text-gray-700">{s} Star</div>
                        <div className="flex-1 h-3 rounded-full bg-white overflow-hidden border border-gray-200">
                          <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="w-10 text-right text-sm font-medium text-gray-600">{pct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latest Reviews List */}
              <div className="rounded-2xl border bg-white p-5 shadow-xl text-left">
                <h4 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Latest User Feedback</h4>
                <ul className="space-y-5">
                  <li className="border-b pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <UserRound className="w-4 h-4 text-emerald-600" /> A. K. - <span className="text-emerald-600">Verified Buyer</span>
                      </div>
                      <div className="text-xs text-gray-500">1 week ago</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRow value={5} size={14} className="flex-shrink-0" />
                      <span className="text-sm text-gray-500">5.0 - Excellent Service</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      Smooth home sample collection and detailed report. The follow-up call with the doctor was highly informative! Worth the premium price.
                    </p>
                  </li>
                  <li className="border-b pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <UserRound className="w-4 h-4 text-emerald-600" /> O. B. - <span className="text-emerald-600">Verified Buyer</span>
                      </div>
                      <div className="text-xs text-gray-500">3 weeks ago</div>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <StarRow value={4} size={14} className="flex-shrink-0" />
                      <span className="text-sm text-gray-500">4.0 - Very Good</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">
                      Report arrived next day. Collector was professional. Wish the app provided more tracking updates. The results were clear.
                    </p>
                  </li>
                </ul>
                <button className="mt-6 w-full py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition shadow-sm">
                    Read All {reviews.toLocaleString()} Reviews
                </button>
              </div>
            </div>
          </section>
        );

      case "resources":
        return (
            <section className="space-y-6 text-left">
                <h3 className="text-2xl font-bold text-gray-900 border-b pb-2">Health Resources & Related Articles</h3>
                <p className="text-base text-gray-600">Deepen your understanding of your health with expertly curated articles and guides related to the **{title}** test.</p>
                {articles.length === 0 ? (
                    <div className="p-8 bg-gray-50 rounded-xl border text-center">
                        <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-base text-gray-600">No related articles are available for this test yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((a, i) => <ArticleCard key={i} article={a} />)}
                    </div>
                )}
            </section>
        );


      default:
        return <div className="p-8 text-left text-gray-600">Content for this tab is not available.</div>;
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-4 pt-24 pb-28 md:pb-16 font-inter min-h-screen">
      {/* Sticky Booking Panel for Mobile */}
      <StickyBookingPanel
        title={title}
        price={newPrice}
        oldPrice={oldPrice}
        discount={discount}
        navigate={navigate}
        bookingRef={bookingTriggerRef} // Pass the ref to monitor the scroll position
      />

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6 text-left">
        <button onClick={() => navigate("/lab-tests")} className="hover:text-emerald-600 transition">
          <span className="font-medium">Lab Tests</span>
        </button>
        <span className="mx-1.5">/</span>
        <span className="text-gray-900 font-bold">{title}</span>
      </div>

      {/* ======================= Product Header & Booking Section ======================= */}
      <section className="bg-white rounded-3xl p-5 md:p-8 shadow-2xl border border-gray-100">
        <div className="grid grid-cols-12 gap-8 lg:gap-12">

          {/* LEFT: Product Info & Key Stats */}
          <div className="col-span-12 lg:col-span-7 space-y-6 text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{title}</h1>
            <p className="mt-2 text-lg text-gray-700 leading-relaxed">{desc}</p>

            {/* Ratings Bar */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-1">
                <span className="text-xl font-bold text-gray-900">{Number(rating).toFixed(1)}</span>
                <StarRow value={rating} size={20} />
              </div>
              <span className="text-sm text-gray-500">({reviews.toLocaleString()} Verified Reviews)</span>
              <div className="h-5 w-px bg-gray-300 mx-2 hidden sm:block" />
              <button className="hidden sm:inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition" onClick={() => setActiveTab("reviews")}>
                  See Detailed Reviews <MessageSquare className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Core Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              <IconStatCard icon={Droplets} title="Sample Type" value={sampleType || "N/A"} />
              <IconStatCard icon={Clock} title="Report Time" value={reportTime || "48+ Hours"} />
              <IconStatCard icon={Beaker} title="Parameters" value={`${parametersCount}+ Tests`} />
              <IconStatCard icon={Home} title="Collection" value={homeSample ? "Home Available" : "Lab Only"} />
            </div>

            {/* Mobile Booking Controls - Trigger for Sticky Panel */}
            <div className="pt-4 lg:hidden" ref={bookingTriggerRef}>
              <h3 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Schedule & Book</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="date"
                      aria-label="Collection Date"
                      className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
                      defaultValue={new Date().toISOString().slice(0, 10)}
                    />
                  </div>
                  <div className="relative">
                    <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="time"
                      aria-label="Collection Time"
                      className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
                      defaultValue="09:00"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      aria-label="Collection Pincode"
                      placeholder="Collection Pincode"
                      className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col text-left">
                    <span className="text-xs text-gray-500 line-through">₦{Number(oldPrice).toLocaleString()}</span>
                    <span className="text-2xl font-bold text-gray-900">₦{Number(newPrice).toLocaleString()}</span>
                  </div>
                  <button className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold shadow-lg hover:bg-emerald-700 transition active:scale-95" onClick={() => console.log("Book Now clicked from main area")}>
                    Book This Premium Test
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Image Gallery & Desktop Booking */}
          <div className="col-span-12 lg:col-span-5 space-y-6">

            {/* Gallery */}
            <div
              className={`rounded-3xl ${bg || "bg-gray-50"} border border-gray-200 overflow-hidden relative flex items-center justify-center shadow-xl aspect-video w-full`}
              tabIndex={0}
              aria-label="Test images carousel"
              onKeyDown={onKeyDown}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {gallery[active] && (
                <img
                  src={gallery[active]}
                  alt={`${title} (${active + 1}/${gallery.length})`}
                  className="w-full h-full object-cover transition duration-300"
                />
              )}
              {/* Navigation Buttons */}
              {gallery.length > 1 && (
                <>
                  <button
                    onClick={() => setActive((i) => (i - 1 + gallery.length) % gallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 border shadow-md hover:bg-white transition z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setActive((i) => (i + 1) % gallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 border shadow-md hover:bg-white transition z-10"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}
              {/* Discount Badge */}
              {discount && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-1 text-sm font-bold text-white bg-emerald-600 px-3 py-1.5 rounded-full shadow-lg">
                  <Percent className="w-4 h-4" /> SAVE {discount}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {gallery.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide justify-center">
                {gallery.slice(0, 6).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`w-16 h-16 flex-shrink-0 border-2 rounded-xl p-0.5 transition focus:outline-none focus:ring-4 focus:ring-emerald-300 ${
                      i === active ? "border-emerald-500 ring-4 ring-emerald-300 shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={src} alt={`${title} ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Booking Card (Sticky on Large Screens) */}
            <div className="hidden lg:block sticky top-28 bg-white p-6 rounded-3xl border shadow-xl text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Your Health Assessment</h3>
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-extrabold text-emerald-700">₦{Number(newPrice).toLocaleString()}</span>
                {oldPrice != null && (
                  <span className="text-xl text-gray-500 line-through">₦{Number(oldPrice).toLocaleString()}</span>
                )}
              </div>

              <div className="space-y-3 mb-4">
                  <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                          type="date"
                          aria-label="Collection Date"
                          className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                          defaultValue={new Date().toISOString().slice(0, 10)}
                      />
                  </div>
                  <div className="relative" ref={bookingTriggerRef}>
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                          type="text"
                          aria-label="Collection Pincode"
                          placeholder="Enter Collection Pincode"
                          className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                          required
                      />
                  </div>
              </div>
              <button className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-lg shadow-xl hover:bg-emerald-700 transition active:scale-[0.98]">
                  Proceed to Checkout
              </button>
              <p className="mt-3 text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5" /> Fast, Simple, and Secure Booking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Details Tabs Section --- */}
      <div className="mt-12">
        {/* Tab Navigation */}
        <div className="sticky top-0 md:top-20 z-40 bg-white border-b border-gray-200 shadow-md md:shadow-none -mx-4 md:mx-0">
          <div className="max-w-7xl mx-auto flex overflow-x-auto scrollbar-hide">
            <TabButton tab="overview" label="Overview" Icon={Info} />
            <TabButton tab="parameters" label="Parameters" Icon={SlidersHorizontal} />
            <TabButton tab="preparation" label="Prep & FAQ" Icon={ClipboardList} />
            <TabButton tab="reviews" label={`Reviews (${reviews})`} Icon={Star} />
            <TabButton tab="resources" label="Health Resources" Icon={BookOpen} /> {/* NEW TAB */}
          </div>
        </div>

        {/* Tab Content */}
        <div className="pt-8 md:pt-12 bg-white rounded-3xl md:p-8 mt-4 shadow-xl">
          {getTabContent()}
        </div>
      </div>
    </div>
  );
}