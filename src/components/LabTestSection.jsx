// src/components/LabTestSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🧩 bring your data from the central source
// Make sure these are exported in ../data/mockData.js
import {
  labTests as mockLabTests,
  wellnessEssentials as mockWellnessEssentials,
  brands as mockBrands,
  deals as mockDeals,
} from "../data/mockData";

/* ---------------------------- small utilities ---------------------------- */
const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const formatCurrency0 = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const formatCurrency2 = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(value);

/* =============================== COMPONENTS ============================== */

export default function LabTestSection() {
  const navigate = useNavigate();
  const labTests = Array.isArray(mockLabTests) ? mockLabTests : [];

  return (
    <section className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 bg-white">
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />

      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          Frequently Booked Lab Tests
        </h2>
        <button
          type="button"
          onClick={() => navigate("/lab-tests")}
          className="text-teal-600 font-medium text-xs sm:text-sm hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-3 sm:pb-4 md:overflow-x-hidden">
        {labTests.map((test, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => navigate(`/lab-tests/${slugify(test.title || test.name || `test-${idx}`)}`)}
            className={`min-w-[200px] sm:min-w-[260px] md:min-w-[280px] ${test.bg || "bg-blue-50"}
              p-3 sm:p-4 rounded-xl sm:rounded-2xl relative flex flex-col justify-between
              shadow-sm hover:shadow-md hover:scale-[1.02]
              transition-all duration-300 cursor-pointer text-left
            `}
            style={{ height: 240 }}
          >
            {test.discount && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded w-fit mb-2">
                {String(test.discount).toUpperCase()}
              </span>
            )}

            <div className="flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 leading-snug">
                {test.title || test.name}
              </h3>
              {test.desc && <p className="text-xs sm:text-sm text-gray-600">{test.desc}</p>}
            </div>

            <div className="mt-2 sm:mt-3 text-left">
              {test.oldPrice != null && (
                <p className="text-[11px] sm:text-xs line-through text-gray-400">
                  {formatCurrency0(test.oldPrice)}
                </p>
              )}
              {test.newPrice != null && (
                <p className="text-base sm:text-lg font-bold text-gray-800">
                  {formatCurrency0(test.newPrice)}
                </p>
              )}
            </div>

            {test.image && (
              <img
                src={test.image}
                alt={test.title || test.name}
                className="absolute bottom-2 right-2 w-14 sm:w-20 object-contain pointer-events-none"
              />
            )}
          </button>
        ))}
      </div>

      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
    </section>
  );
}

/* ----------------------- Wellness Essentials (rail) ---------------------- */

export const WellnessGrid = () => {
  const navigate = useNavigate();
  const wellnessEssentials = Array.isArray(mockWellnessEssentials) ? mockWellnessEssentials : [];

  return (
    <div className="px-3 py-4 sm:px-4 sm:py-6">
      <h2 className="text-lg text-left sm:text-2xl font-bold text-gray-900 mb-1">
        Wellness Essentials of the Week
      </h2>
      <p className="text-sm text-left sm:text-base text-gray-500 mb-4 sm:mb-6">
        Super charge your immunity with us
      </p>

      <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
        <div
          className="
            flex md:grid gap-3 sm:gap-4
            md:grid-cols-3
            flex-nowrap md:flex-wrap
            min-w-[600px] sm:min-w-[700px] md:min-w-0
          "
        >
          {wellnessEssentials.map((product, i) => {
            const title = product.title || product.name || `item-${i}`;
            const slug = slugify(title);
            return (
              <button
                type="button"
                key={i}
                onClick={() => navigate(`/product/${slug}`)}
                className={`flex-shrink-0 md:flex-shrink ${product.bgGradient || "bg-white"} border rounded-md sm:rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200 min-w-[160px] sm:min-w-[200px] md:min-w-0 w-[160px] sm:w-[200px] md:w-auto text-left`}
              >
                <div className="w-full">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={title}
                      className="w-full h-24 sm:h-32 object-contain mb-2"
                    />
                  )}
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-snug mb-1">
                    {title.length > 50 ? `${title.slice(0, 50)}...` : title}
                  </h3>
                  {product.oldPrice != null && (
                    <p className="text-[11px] sm:text-xs text-gray-400 line-through">
                      MRP {formatCurrency2(product.oldPrice)}
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    {product.newPrice != null && (
                      <p className="text-sm sm:text-base font-semibold text-gray-800">
                        {formatCurrency2(product.newPrice)}
                      </p>
                    )}
                    {product.discount > 0 && (
                      <span className="text-[11px] sm:text-xs text-red-500 font-medium">
                        ({product.discount}%)
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ----------------------------- Featured Brands --------------------------- */

export const FeaturedBrands = () => {
  const brands = Array.isArray(mockBrands) ? mockBrands : [];
  const navigate = useNavigate();

  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl text-left md:text-3xl font-bold text-gray-900 mb-1">Featured Brands</h2>
      <p className="text-gray-600 text-left mb-6">Pick from our favourite brands</p>

      <div className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2">
        {brands.map((brand, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              onClick={() => navigate(`/brand/${slugify(brand.name)}`)}
              className="flex-shrink-0 w-40 sm:w-60 lg:w-56 border border-gray-200 rounded-xl flex flex-col items-center p-3 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            >
              {brand.img && (
                <img
                  src={brand.img}
                  alt={brand.name}
                  className="w-full h-full object-contain rounded-xl"
                />
              )}
            </div>
            <div className="mt-2 text-gray-800 font-medium text-center w-full">
              {brand.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ----------------------------- Deals of the Day -------------------------- */

export const DealsOfTheDay = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(15 * 60 + 17); // 15:17
  const deals = Array.isArray(mockDeals) ? mockDeals : [];
  const scrollRef = React.useRef(null);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const formatTimer = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
            Deals of the Day
          </h2>
          <div className="flex items-center bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-lg text-sm">
            <span className="mr-2">⏰</span>
            {timer > 0 ? `${formatTimer(timer)} MINS LEFT, HURRY!` : "Offer Expired"}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/deals")}
          className="text-teal-600 font-semibold hover:underline text-sm sm:text-base"
        >
          View All
        </button>
      </div>

      {/* Compact, scrollable deals rail with reduced height */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide pb-2 pt-1"
      >
        {deals.map((deal, idx) => {
          const name = deal.name || deal.title || `deal-${idx}`;
          const slug = slugify(name);
          return (
            <button
              type="button"
              key={idx}
              onClick={() => navigate(`/product/${slug}`)}
              className={`flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-xl shadow hover:shadow-lg ${deal.bgGradient || "bg-white"} border border-gray-200 flex flex-col items-center justify-between p-2 sm:p-3 transition-all duration-200 cursor-pointer text-left`}
            >
              {deal.img && (
                <img
                  src={deal.img}
                  alt={name}
                  className="w-full h-16 sm:h-24 object-contain rounded-xl mb-2"
                  draggable={false}
                />
              )}
              <div className="w-full min-w-0 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm font-medium text-gray-800 mb-1 truncate">
                  {name}
                </p>
                {deal.mrp != null && (
                  <div className="text-[11px] sm:text-xs text-gray-400 mb-1">
                    MRP <span className="line-through">{formatCurrency2(deal.mrp)}</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  {deal.price != null && (
                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                      {formatCurrency2(deal.price)}
                    </span>
                  )}
                  {deal.discount != null && (
                    <span className="text-xs sm:text-sm text-red-500 font-semibold">
                      ({deal.discount}%)
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress bar under scroll (mobile only) */}
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
    </section>
  );
}

