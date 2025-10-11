// src/pages/Home.jsx
import { Link, useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiCameraLine,
  RiFileList2Line,
  RiFlashlightLine,
  RiFirstAidKitLine,
  RiCalendarEventLine,
  RiPulseLine,
  RiMapPinLine,
  RiCloseLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { useEffect, useMemo, useRef, useState } from "react";
import { suggest } from "../search/engine"; 
import MobileQuickAndActivity from "../components/MobileQuickAndActivity";

// --- Location Selector/Display Component (Refined) ---
const LocationDisplay = ({ location, onLocationChange }) => {
  return (
    <button
      onClick={onLocationChange}
      className="flex items-center gap-1.5 text-blue-700 bg-blue-50/70 border border-blue-200 backdrop-blur-sm rounded-full px-3 py-1 text-xs sm:text-sm font-medium hover:bg-blue-100 transition duration-200 shadow-md absolute top-4 left-4 z-20"
      title="Change delivery location"
    >
      <RiMapPinLine className="text-base" />
      <span className="truncate max-w-[150px] sm:max-w-none">{location}</span>
      <RiArrowRightLine className="w-3 h-3 text-blue-400 ml-0.5" />
    </button>
  );
};
// -------------------------------------------------------------

export default function Home() {
  const navigate = useNavigate();
  const servicesScrollRef = useRef(null);

  // Location State (simplified for display)
  const [userLocation] = useState("Lagos, Nigeria (Auto)");

  const handleLocationChange = () => {
    alert("Location picker functionality coming soon!");
  };

  // Search state
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);
  
  // FIX: The 'serviceIcons' object has been completely removed to resolve the unused variable warning.
  // The service data already holds the correct React component for the icon.

  // Services (memoized)
  const services = useMemo(
    () => [
      {
        title: "Order Medicine",
        subtitle: "SAVE 25%",
        icon: RiFirstAidKitLine,
        link: "/services/medicine",
        accent: "from-emerald-500/20",
        isPrimary: true, // Flag for visual distinction
      },
      {
        title: "Book Lab Tests",
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
        title: "PLUS Program",
        subtitle: "SAVE 5% EXTRA",
        icon: RiFlashlightLine,
        link: "/services/plus",
        accent: "from-amber-500/20",
      },
      {
        title: "Fitness",
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

  // Debounced suggestions
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = window.setTimeout(() => {
      const docs = suggest(q, 8); 
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

  const pharmacies = [
    { id: "p1", name: "Green Cross Pharmacy", lat: 5.380, lng: 7.020, distance: "1.2 km" },
    { id: "p2", name: "Medix Hub Central", lat: 5.401, lng: 7.050, distance: "2.5 km" },
    { id: "p3", name: "Wellness Point", lat: 5.390, lng: 7.030, distance: "0.8 km" },
  ];

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-2 sm:px-4 md:px-16 pt-20 pb-6">
      
      {/* Premium Location Display */}
      <LocationDisplay location={userLocation} onLocationChange={handleLocationChange} />

      {/* Search Area */}
      <div className="text-center pt-8"> 
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-gray-800 drop-shadow-sm">
          What are you looking for?
        </h2>

        {/* Prescription Subtitle */}
        <div className="flex justify-center items-center flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <RiFileList2Line className="text-base sm:text-lg" />
            <span>Order with prescription.</span>
          </div>
        </div>

        {/* Search - Premium UX */}
        <div ref={boxRef} className="relative mx-auto w-full max-w-full sm:max-w-xl lg:max-w-2xl">
          <label htmlFor="global-search" className="sr-only">
            Search products or health queries
          </label>

          <div
            className={`flex items-center bg-white shadow-xl rounded-full overflow-hidden px-3 py-1.5 ring-2 transition duration-300 ${
              focused ? "ring-emerald-500 scale-[1.01]" : "ring-white/0 focus-within:ring-emerald-300"
            }`}
          >
            <RiSearchLine className="text-gray-400 text-xl mr-2" />

            <input
              id="global-search"
              type="text"
              placeholder="Search medicines, lab tests, wellness…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onKeyDown={onKeyDown}
              className="flex-grow outline-none text-base text-gray-800 bg-transparent py-2 min-w-0"
              autoComplete="off"
            />

            {/* Clear */}
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="text-gray-400 hover:text-gray-600 p-1.5 transition"
                aria-label="Clear search"
                title="Clear"
              >
                <RiCloseLine className="text-xl" />
              </button>
            )}
            
            <input id="image-upload-input" type="file" accept="image/*" className="hidden" />

            {/* Image Search button inside the search bar */}
            <button
              type="button"
              className="flex items-center justify-center text-gray-400 hover:text-emerald-600 rounded-full p-1.5 transition mr-2"
              title="Search by image"
              onClick={() => document.getElementById("image-upload-input")?.click()}
              aria-label="Search by image"
            >
              <RiCameraLine className="text-xl" />
            </button>

            <button
              onClick={() => submitSearch()}
              className="bg-emerald-600 text-white px-4 py-2.5 rounded-full hover:bg-emerald-700 transition text-sm font-semibold shadow-md"
              aria-label="Perform search"
              title="Search"
            >
              {loading ? "..." : "Search"}
            </button>
          </div>
          
          {/* Suggestions Dropdown */}
          {focused && (suggestions.length > 0 || (!!q && !loading)) && (
            <div
              className="absolute z-30 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 text-left overflow-hidden"
              role="listbox"
              aria-label="Search suggestions"
            >
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  Searching for {`"${q}"`}...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No matches found. Press <kbd className="font-mono bg-gray-100 px-1 rounded">Enter</kbd> to perform a full search.
                </div>
              ) : (
                <ul className="max-h-72 overflow-auto divide-y divide-gray-100">
                  {suggestions.map((it, i) => (
                    <li key={`${it.id}-${i}`} className="p-0">
                      <button
                        type="button"
                        onClick={() => {
                          setFocused(false);
                          setSuggestions([]);
                          navigate(it.url);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50/50 focus:bg-emerald-50/50 flex items-center justify-between transition"
                      >
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] uppercase font-bold text-emerald-600">
                            {it.type}
                          </span>
                          <span className="text-gray-900 font-medium mt-0.5">{it.title}</span>
                          {it.subtitle && <span className="text-gray-500 text-xs">{it.subtitle}</span>}
                        </div>
                        <RiArrowRightLine className="text-gray-400 w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SERVICES - MOBILE FUNCTIONALITY & UI */}
      <section className="mt-8 sm:mt-10"> 
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 px-1 sm:px-0">
          Essential Services
        </h3>

        <div className="relative">
          {/* FADE GRADIENT: Left side fade indicator (mobile scroll UX) */}
          {/* Adjusted gradient stop to match the main background colors */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:hidden bg-gradient-to-r from-blue-100/70 via-green-100/30 to-transparent pointer-events-none z-10" />

          <div
            ref={servicesScrollRef}
            className="
              grid grid-flow-col auto-cols-[140px] snap-x snap-mandatory
              sm:grid-flow-row sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7
              gap-4 sm:gap-6
              overflow-x-auto overflow-y-visible sm:overflow-x-visible
              -mx-2 sm:mx-0 px-2 sm:px-0 py-3 scrollbar-hide
            "
            role="region"
            aria-label="Primary healthcare services"
          >
            {services.map((item) => {
              const Icon = item.icon; // Use the component directly from the item object
              const isPrimaryAction = item.isPrimary;

              return (
                <Link
                  to={item.link}
                  key={item.title}
                  className={`
                    group relative flex flex-col items-center justify-between h-full
                    bg-white border border-gray-100 rounded-2xl
                    shadow-lg hover:shadow-xl hover:-translate-y-1
                    transition-all duration-300 ease-in-out
                    p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-emerald-400
                    snap-center
                    ${isPrimaryAction 
                        ? 'border-4 border-emerald-500/50 shadow-emerald-200/50 scale-105 sm:scale-100' 
                        : ''}
                  `}
                  aria-label={`${item.title}${item.subtitle ? ` – ${item.subtitle}` : ""}`}
                >
                  {/* Premium visual: Gradient hover border effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${
                      item.accent || "from-emerald-500/20"
                    } to-transparent opacity-0 group-hover:opacity-100 transition duration-500`}
                  />

                  {/* Icon (Used directly as component) */}
                  <div className={`p-3 rounded-full bg-white shadow-md relative z-[1] border-2 border-white mb-3 text-emerald-600`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  {/* Text content */}
                  <div className="flex flex-col items-center relative z-[1] text-center w-full">
                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1">{item.title}</p>
                    {item.subtitle ? (
                      <span className="mt-0.5 text-[10px] font-extrabold tracking-wider text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-md">
                        {item.subtitle}
                      </span>
                    ) : (
                      <span className="h-4" /> 
                    )}
                  </div>
                  {/* BEST USE CASE: RIBBON */}
                  {isPrimaryAction && (
                    <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-lg rotate-6">
                        MOST POPULAR
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          {/* FADE GRADIENT: Right side fade indicator (mobile scroll UX) */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:hidden bg-gradient-to-l from-blue-200/70 via-green-100/30 to-transparent pointer-events-none z-10" />
        </div>
      </section>

      <MobileQuickAndActivity pharmacies={pharmacies} />
    </main>
  );
}