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

export default function Home() {
  const navigate = useNavigate();
  const [pharmacyDistance, setPharmacyDistance] = useState("1.2km");
  const [userLocation, setUserLocation] = useState(null);
  const servicesScrollRef = useRef(null);

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

  const services = [
  {
    title: "Medicine",
    subtitle: "SAVE 25%",
    icon: RiFirstAidKitLine,
    link: "/medicine",
    accent: "from-emerald-500/20",
  },
  {
    title: "Lab Tests",
    subtitle: "UP TO 70% OFF",
    icon: RiCalendarEventLine,
    link: "/lab-tests",
    accent: "from-violet-500/20",
  },
  {
    title: "Doctor Consult",
    icon: RiFileList2Line,
    link: "/doctor-consult",
    accent: "from-sky-500/20",
  },
  {
    title: "Healthcare",
    subtitle: "UP TO 60% OFF",
    icon: RiFirstAidKitLine,
    link: "/healthcare",
    accent: "from-teal-500/20",
  },
  {
    title: "Health Blogs",
    icon: RiFileList2Line,
    link: "/health-blogs",
    accent: "from-rose-500/20",
  },
  {
    title: "PLUS",
    subtitle: "SAVE 5% EXTRA",
    icon: RiFlashlightLine,
    link: "/plus",
    accent: "from-amber-500/20",
  },
  {
    title: "Fitness & Wellness",
    subtitle: "SHOP NOW",
    icon: RiPulseLine,
    link: "/fitness-wellness",
    accent: "from-lime-500/20",
  },
];

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

        {/* Search input */}
        <label
          htmlFor="global-search"
          className="sr-only"
        >
          Search products or health queries
        </label>
        <div className="max-w-xl mx-auto flex items-center bg-white/95 shadow-sm rounded-full overflow-hidden px-2 sm:px-3 py-1.5 ring-1 ring-gray-200 focus-within:ring-emerald-300 transition">
          <RiSearchLine className="text-gray-400 text-lg sm:text-xl mr-1 sm:mr-2" />
          <input
            id="global-search"
            type="text"
            placeholder="Search for Shampoo"
            className="flex-grow outline-none text-xs sm:text-sm text-gray-700 bg-transparent py-2"
            autoComplete="off"
          />

          {/* Image search */}
          <button
            type="button"
            className="flex items-center justify-center text-gray-400 hover:text-emerald-600 rounded-full p-1 sm:p-1.5 mr-1 sm:mr-2 transition"
            title="Search by image"
            onClick={() => document.getElementById("image-upload-input")?.click()}
            aria-label="Search by image"
          >
            <RiCameraLine className="text-lg sm:text-xl" />
          </button>
          <input
            id="image-upload-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => {
              // TODO: wire image-based search
            }}
          />

          <button className="bg-emerald-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-emerald-700 transition text-xs sm:text-sm">
            Search
          </button>
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
              overflow-x-auto sm:overflow-x-visible
              pl-1 pr-1 scrollbar-hide pb-2
            "
            role="region"
            aria-label="Primary healthcare services"
          >
            {services.map((item, index) => {
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
                    py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
                  "
                  aria-label={`${item.title}${item.subtitle ? ` – ${item.subtitle}` : ""}`}
                >
                  {/* Glow ring on hover */}
                  <div
                    className={`
                      pointer-events-none absolute inset-0 rounded-xl
                      bg-gradient-to-br ${item.accent || "from-emerald-500/20"} to-transparent
                      opacity-0 group-hover:opacity-100 transition
                    `}
                  />
                  {/* Icon chip */}
                  <div className="absolute -top-3 right-3 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                    <Icon className="text-emerald-600 w-4 h-4" />
                  </div>

                  <item.icon className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mb-2 relative z-[1]" />


                  {/* Texts */}
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 relative z-[1]">
                    {item.title}
                  </p>
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

      {/* ▼ Mobile‑Only Quick Actions & Nearby */}
      <section className="md:hidden space-y-3 px-2 mt-6">
        {/* Quick Actions */}
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

        {/* Pharmacy Location Widget */}
        <button
          onClick={() => navigate("/nearby-pharmacies")}
          className="
            flex items-center justify-between 
            w-full bg-white/95 px-4 py-3
            rounded-lg border border-gray-200
            shadow-xs hover:shadow-sm
            active:bg-gray-50 transition
            text-left
          "
          aria-label="Nearest pharmacy"
        >
          <div className="flex items-center gap-2">
            <RiMapPinLine
              className={`
                text-lg
                ${userLocation ? "text-emerald-600" : "text-gray-400"}
              `}
            />
            <span className="text-xs font-medium">
              {userLocation ? (
                <>
                  Nearest pharmacy:{" "}
                  <strong className="text-emerald-700">{pharmacyDistance}</strong>
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

      {/* Mobile weekly activity (kept, with subtle polish) */}
      <div className="md:hidden bg-white/95 p-3 mx-2 mt-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs font-medium text-gray-800 mb-2 flex items-center">
          <RiPulseLine className="text-rose-500 mr-1" /> Weekly Activity
        </p>
        <div className="h-16 flex items-end gap-1">
          {[3, 5, 7, 4, 6, 8, 5].map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-200 rounded-t-sm"
              style={{ height: `${v * 10}%` }}
            />
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
      className={`
        bg-white/95 backdrop-blur-sm
        ${color}
        py-3 px-1
        rounded-xl
        border border-gray-100
        shadow-sm hover:shadow-md
        text-xs font-medium
        flex flex-col items-center
        min-h-[100px]
        justify-between
        transition-all
        hover:-translate-y-0.5
        active:scale-95
      `}
      type="button"
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
