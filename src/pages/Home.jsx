// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiCameraLine,
  RiFileList2Line,
  RiFlashlightLine,
  RiFirstAidKitLine,
  RiCalendarEventLine,
  RiMapPinLine,
  RiArrowRightSLine,
  RiPulseLine,
} from "react-icons/ri";
import { useEffect, useMemo, useRef, useState } from "react";
import { suggest } from "../search/engine";

export default function Home() {
  const navigate = useNavigate();
  const [pharmacyDistance, setPharmacyDistance] = useState("1.2km");
  const [userLocation, setUserLocation] = useState(null);
  const servicesScrollRef = useRef(null);

  // Search state
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  // Simulate fetching user location
  useEffect(() => {
    const timer = setTimeout(() => {
      setUserLocation({ lat: 28.6139, lng: 77.209 });
      setPharmacyDistance("0.8km");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Icon map for services
  const serviceIcons = useMemo(
    () => ({
      medicine: RiFirstAidKitLine,
      lab: RiCalendarEventLine,
      consult: RiFileList2Line,
      healthcare: RiFirstAidKitLine,
      blogs: RiFileList2Line,
      plus: RiFlashlightLine,
      offers: RiFlashlightLine,
      fitness: RiPulseLine,
    }),
    []
  );

  // Services (memoized)
  const services = useMemo(
    () => [
      {
        title: "Medicine",
        subtitle: "SAVE 25%",
        icon: RiFirstAidKitLine,
        link: "/services/medicine",
        accent: "from-emerald-500/20",
      },
      {
        title: "Lab Tests",
        subtitle: "UP TO 70% OFF",
        icon: RiCalendarEventLine,
        link: "/services/lab-tests",
        accent: "from-violet-500/20",
      },
      {
        title: "Doctor Consult",
        icon: RiFileList2Line,
        link: "/services/doctor-consult",
        accent: "from-sky-500/20",
      },
      {
        title: "Healthcare",
        subtitle: "UP TO 60% OFF",
        icon: RiFirstAidKitLine,
        link: "/services/healthcare",
        accent: "from-teal-500/20",
      },
      {
        title: "Health Blogs",
        icon: RiFileList2Line,
        link: "/services/health-blogs",
        accent: "from-rose-500/20",
      },
      {
        title: "PLUS",
        subtitle: "SAVE 5% EXTRA",
        icon: RiFlashlightLine,
        link: "/services/plus",
        accent: "from-amber-500/20",
      },
      {
        title: "Fitness & Wellness",
        subtitle: "SHOP NOW",
        icon: RiPulseLine,
        link: "/services/fitness-wellness",
        accent: "from-lime-500/20",
      },
    ],
    []
  );

  // Close suggestions on outside click
  useEffect(() => {
    const onDocClick = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setFocused(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Debounced suggestions using shared engine
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const docs = suggest(q, 8); // returns SearchDoc[]
      setSuggestions(docs);
      setLoading(false);
    }, 220);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [q]);

  const submitSearch = (term) => {
    const query = (term || q).trim();
    if (!query) return;
    setFocused(false);
    setSuggestions([]);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") submitSearch();
    if (e.key === "Escape") setFocused(false);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-2 sm:px-4 md:px-16 pt-28 pb-6">
      {/* Search Area */}
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4">
          What are you looking for?
        </h2>

        <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <RiFileList2Line className="text-base sm:text-lg" />
            <span>Order with prescription.</span>
          </div>
        </div>

        {/* Search */}
        <div ref={boxRef} className="relative mx-auto w-full max-w-full sm:max-w-xl lg:max-w-2xl">
          <label htmlFor="global-search" className="sr-only">
            Search products or health queries
          </label>

          <div
            className={`flex items-center bg-white/95 shadow-sm rounded-full overflow-hidden px-2 sm:px-3 py-1.5 ring-1 ring-gray-200 transition ${
              focused ? "ring-2 ring-emerald-400" : "focus-within:ring-emerald-300"
            }`}
          >
            <RiSearchLine className="text-gray-400 text-lg sm:text-xl mr-1 sm:mr-2" />

            <input
              id="global-search"
              type="text"
              placeholder="Search medicines, lab tests, wellness…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={onKeyDown}
              className="flex-grow outline-none text-sm sm:text-base text-gray-700 bg-transparent py-2 min-w-0"
              autoComplete="off"
            />

            {/* Clear */}
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-gray-400 hover:text-gray-600 px-1 sm:px-1.5"
                aria-label="Clear search"
                title="Clear"
              >
                ×
              </button>
            )}

            {/* Image search (placeholder) */}
            <button
              type="button"
              className="flex items-center justify-center text-gray-400 hover:text-emerald-600 rounded-full p-1 sm:p-1.5 mr-1 sm:mr-2 transition"
              title="Search by image"
              onClick={() => document.getElementById("image-upload-input")?.click()}
              aria-label="Search by image"
            >
              <RiCameraLine className="text-lg sm:text-xl" />
            </button>
            <input id="image-upload-input" type="file" accept="image/*" className="hidden" />

            <button
              onClick={() => submitSearch()}
              className="bg-emerald-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-emerald-700 transition text-xs sm:text-sm"
            >
              {loading ? "…" : "Search"}
            </button>
          </div>

          {/* Suggestions dropdown */}
          {focused && (suggestions.length > 0 || (!!q && !loading)) && (
            <div
              className="absolute z-30 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200 text-left overflow-hidden"
              role="listbox"
              aria-label="Search suggestions"
            >
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">No matches. Press Enter to search.</div>
              ) : (
                <ul className="max-h-72 overflow-auto">
                  {suggestions.map((it, i) => (
                    <li key={`${it.id}-${i}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setFocused(false);
                          setSuggestions([]);
                          navigate(it.url);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 focus:bg-emerald-50 flex items-center gap-2"
                      >
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                          {it.type}
                        </span>
                        <span className="text-gray-900">{it.title}</span>
                        {it.subtitle && <span className="text-gray-500 ml-1">— {it.subtitle}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      <section className="mt-8 sm:mt-10">
        <div className="flex items-center justify-between mb-2 px-1 sm:px-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">Explore services</h3>
        </div>

        <div className="relative">
          <div
            ref={servicesScrollRef}
            className="
              grid grid-flow-col auto-cols-[minmax(128px,1fr)]
              sm:grid-flow-row sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7
              gap-3 sm:gap-6
              overflow-x-auto overflow-y-visible sm:overflow-x-visible
              pl-1 pr-1 scrollbar-hide py-3
            "
            role="region"
            aria-label="Primary healthcare services"
          >
            {services.map((item) => {
              const Icon = serviceIcons[item.icon] || RiFirstAidKitLine;
              return (
                <Link
                  to={item.link}
                  key={item.title}
                  className="
                    group relative flex flex-col items-center
                    bg-white/95 border border-gray-100 rounded-xl
                    shadow-sm hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-200
                    pt-6 pb-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                  "
                  aria-label={`${item.title}${item.subtitle ? ` – ${item.subtitle}` : ""}`}
                >
                  <div
                    className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br ${
                      item.accent || "from-emerald-500/20"
                    } to-transparent opacity-0 group-hover:opacity-100 transition`}
                  />
                  <div className="absolute -top-2.5 sm:-top-3 right-2 sm:right-3 bg-white border border-gray-200 rounded-full p-1 shadow-sm z-10">
                    <Icon className="text-emerald-600 w-4 h-4" />
                  </div>

                  <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mb-2 mt-1 relative z-[1]" />

                  <p className="text-xs sm:text-sm font-semibold text-gray-900 relative z-[1]">{item.title}</p>
                  {item.subtitle ? (
                    <span className="mt-1 text-[10px] sm:text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full relative z-[1]">
                      {item.subtitle}
                    </span>
                  ) : (
                    <span className="h-4" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mobile‑Only Quick Actions & Nearby */}
      <section className="md:hidden space-y-3 px-2 mt-6">
        <div className="grid grid-flow-col auto-cols-[minmax(110px,1fr)] gap-3">
          <QuickAction
            label="Emergency"
            icon={<RiFlashlightLine className="text-xl mb-2 animate-pulse" />}
            color="text-emerald-600"
            onClick={() => navigate("/emergency")}
          />
          <QuickAction
            label="First Aid"
            icon={<RiFirstAidKitLine className="text-xl mb-2" />}
            color="text-blue-600"
            onClick={() => navigate("/first-aid")}
          />
          <QuickAction
            label="Book Lab"
            icon={<RiCalendarEventLine className="text-xl mb-2" />}
            color="text-purple-600"
            onClick={() => navigate("/lab-booking")}
          />
        </div>

        <button
          onClick={() => navigate("/nearby-pharmacies")}
          className="flex items-center justify-between w-full bg-white/95 px-4 py-3 rounded-lg border border-gray-200 shadow-xs hover:shadow-sm active:bg-gray-50 transition text-left"
          aria-label="Nearest pharmacy"
        >
          <div className="flex items-center gap-2">
            <RiMapPinLine className={`${userLocation ? "text-emerald-600" : "text-gray-400"} text-lg`} />
            <span className="text-xs font-medium">
              {userLocation ? (
                <>
                  Nearest pharmacy: <strong className="text-emerald-700">{pharmacyDistance}</strong>
                </>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Locating...
                  <span className="inline-block w-16 h-2 rounded bg-gray-200 animate-pulse" />
                </span>
              )}
            </span>
          </div>
          <RiArrowRightSLine className="text-gray-500" />
        </button>
      </section>

      {/* Mobile weekly activity */}
      <div className="md:hidden bg-white/95 p-3 mx-2 mt-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-800 mb-2 flex items-center">
          <RiPulseLine className="text-rose-500 mr-1" /> Weekly Activity
        </p>
        <div className="h-16 flex items-end gap-1">
          {[3, 5, 7, 4, 6, 8, 5].map((v, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-200 rounded-t-sm" style={{ height: `${v * 10}%` }} />
          ))}
        </div>
      </div>
    </main>
  );
}

/* ---------- Small components ---------- */
function QuickAction({ label, icon, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-white/95 backdrop-blur-sm ${color} py-3 px-1 rounded-xl border border-gray-100 shadow-sm hover:shadow-md text-xs font-medium flex flex-col items-center min-h-[100px] justify-between transition-all hover:-translate-y-0.5 active:scale-95`}
      type="button"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}