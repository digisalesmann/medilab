import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const labTests = [
  {
    discount: "60% OFF",
    title: "Healthy 2025 Full Body Checkup",
    desc: "Diagnostic tool for screening and monitoring of your health",
    oldPrice: 3599,
    newPrice: 1449,
    image: "/images/body.png",
    bg: "bg-blue-50",
    link: "#"
  },
  {
    discount: "43% OFF",
    title: "Diabetes Care",
    desc: "Specially designed package to cover the preventive care aspects...",
    oldPrice: 1399,
    newPrice: 799,
    image: "/images/care.png",
    bg: "bg-amber-50",
    link: "#"
  },
  {
    discount: "53% OFF",
    title: "Basic Health Checkup",
    desc: "Assesses health of 47 essential body parameters",
    oldPrice: 2249,
    newPrice: 1049,
    image: "/images/bsic.png",
    bg: "bg-blue-50",
    link: "#"
  },
  {
    discount: "46% OFF",
    title: "Aarogyam Full Body Checkup with Vitamins",
    desc: "",
    oldPrice: 4599,
    newPrice: 2499,
    image: "/images/checkup.png",
    bg: "bg-amber-50",
    link: "#"
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);

const LabTestSection = () => {
  return (
    <section className="px-3 sm:px-6 md:px-8 py-4 sm:py-6 bg-white">
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
  <div className="flex justify-between items-center mb-3 sm:mb-4">
    <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Frequently Booked Lab Tests</h2>
    <a href="/lab-tests" className="text-teal-600 font-medium text-xs sm:text-sm hover:underline">View All</a>
  </div>

  <div className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide pb-3 sm:pb-4 md:overflow-x-hidden">
    {labTests.map((test, idx) => (
      <a
        href={test.link}
        key={idx}
        className={`min-w-[200px] sm:min-w-[260px] md:min-w-[280px] ${test.bg}
          p-3 sm:p-4 rounded-xl sm:rounded-2xl relative flex flex-col justify-between
          shadow-sm hover:shadow-md hover:scale-[1.02]
          transition-all duration-300 cursor-pointer
        `}
        style={{ height: "240px" }}  // reduced from 280px
      >
        <span className="bg-red-500 text-white text-[10px] sm:text-xs font-semibold px-2 py-1 rounded w-fit mb-2">
          {test.discount}
        </span>

        <div className="flex-1">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 leading-snug">
            {test.title}
          </h3>
          {test.desc && (
            <p className="text-xs sm:text-sm text-gray-600">{test.desc}</p>
          )}
        </div>

        <div className="mt-2 sm:mt-3 text-left">
          <p className="text-[11px] sm:text-xs line-through text-gray-400">{formatCurrency(test.oldPrice)}</p>
          <p className="text-base sm:text-lg font-bold text-gray-800">{formatCurrency(test.newPrice)}</p>
        </div>

        <img
          src={test.image}
          alt={test.title}
          className="absolute bottom-2 right-2 w-14 sm:w-20 object-contain pointer-events-none"
        />
      </a>
    ))}
  </div>
  <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
</section>
  );
};

export default LabTestSection;


const products = [
  {
    title: "Depura Vitamin D3 60k Sugar Free Oral Solution",
    image: "/images/depura.png",
    oldPrice: 114.93,
    newPrice: 94.24,
    discount: 18,
    bgGradient: "bg-gradient-to-br from-orange-100 to-white-50",
  },
  {
    title: "Sugar Free Gold Plus Packet Of 500 Pellets",
    image: "/images/sugar.png",
    oldPrice: 320.0,
    newPrice: 281.6,
    discount: 12,
    bgGradient: "bg-gradient-to-br from-yellow-100 to-white-50",
  },
  {
    title: "Enterogermina Suspension 10 X 5 Ml",
    image: "/images/enterogermina.png",
    oldPrice: 732.0,
    newPrice: 563.64,
    discount: 23,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
  },
  {
    title: "Neurobion Forte Strip Of 30 Tablets",
    image: "/images/neurobion.png",
    oldPrice: 46.1,
    newPrice: 46.1,
    discount: 0,
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
  },
  {
    title: "Sebamed Clear Face Cleansing Foam - 150ml",
    image: "/images/sebamed.png",
    oldPrice: 680.0,
    newPrice: 564.4,
    discount: 17,
    bgGradient: "bg-gradient-to-br from-pink-100 to-red-50",
  },
  {
    title: "Lite Glo Face Wash Tube Of 100 Ml",
    image: "/images/lite.png",
    oldPrice: 499.0,
    newPrice: 429.14,
    discount: 14,
    bgGradient: "bg-gradient-to-br from-blue-100 to-purple-50",
  },
];

const formatNaira = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

export const WellnessGrid = () => {
  return (
    <div className="px-3 py-4 sm:px-4 sm:py-6">
      <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
        Wellness Essentials of the Week
      </h2>
      <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">
        Super charge your immunity with us
      </p>

      {/* Wrapper enables horizontal scroll on mobile, grid on desktop */}
      <div className="overflow-x-auto scrollbar-hide md:overflow-visible">
        <div
          className="
            flex md:grid gap-3 sm:gap-4
            md:grid-cols-3
            flex-nowrap md:flex-wrap
            min-w-[600px] sm:min-w-[700px] md:min-w-0
          "
        >
          {products.map((product, i) => (
            <a
              href={`/product/${i}`}
              key={i}
              className={`flex-shrink-0 md:flex-shrink ${product.bgGradient} border rounded-md sm:rounded-lg shadow-sm p-3 sm:p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200 min-w-[160px] sm:min-w-[200px] md:min-w-0 w-[160px] sm:w-[200px] md:w-auto`}
            >
              <div className="w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-24 sm:h-32 object-contain mb-2"
                />
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-snug mb-1">
                  {product.title.length > 50
                    ? product.title.slice(0, 50) + "..."
                    : product.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-400 line-through">
                  MRP {formatNaira(product.oldPrice)}
                </p>
                <div className="flex justify-between items-center">
                  <p className="text-sm sm:text-base font-semibold text-gray-800">
                    {formatNaira(product.newPrice)}
                  </p>
                  {product.discount > 0 && (
                    <span className="text-[11px] sm:text-xs text-red-500 font-medium">
                      ({product.discount}%)
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const brands = [
  {
    name: 'Evion',
    img: '/images/evion.png', // Replace with your actual paths
    link: '#',
    bg: 'bg-green-50',
  },
  {
    name: 'Nasoclear',
    img: '/images/nasoclear.png',
    link: '#',
    bg: 'bg-blue-50',
  },
  {
    name: 'Pharmeasy',
    img: '/images/Pharmeasy.jpg',
    link: '#',
    bg: 'bg-yellow-50',
  },
  {
    name: 'Diatall',
    img: '/images/Diataal.png',
    link: '#',
    bg: 'bg-yellow-100',
  },
  {
    name: 'Dulcoflex',
    img: '/images/Dulcoflex.png',
    link: '#',
    bg: 'bg-green-100',
  },
  {
    name: 'Neurobion',
    img: '/images/Neurobionn.png',
    link: '#',
    bg: 'bg-red-50',
  },
];

const FeaturedBrands = () => {
  return (
    <div className="py-8 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Featured Brands</h2>
      <p className="text-gray-600 mb-6">Pick from our favourite brands</p>

      <div className="flex overflow-x-auto space-x-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-hide pb-2">
        {brands.map((brand, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <a
  href={brand.link}
  className={`flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-xl shadow hover:shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center justify-center ${brand.bg}`}
>
  <img
    src={brand.img}
    alt={brand.name}
    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain rounded-xl"
  />
</a>
            <div className="mt-2 text-gray-800 font-medium text-center w-full">{brand.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { LabTestSection, FeaturedBrands };

const deals = [
  {
    name: "Depura Vitamin D3 60k Sugar Free Oral...",
    img: "/images/depura.png",
    mrp: 114.93,
    price: 108.03,
    discount: 6,
    link: "#",
    bgGradient: "bg-gradient-to-br from-yellow-100 to-yellow-50",
  },
  {
    name: "Evion 400mg Strip Of 20 Capsule",
    img: "/images/evionn.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-green-100 to-green-50",
  },
  {
    name: "Sevenseas Original Capsule 100`S",
    img: "/images/sevenseas.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-orange-100 to-yellow-50",
  },
  {
    name: "Cetaphil Gentle Skin Cleanser - 125ml",
    img: "/images/cetaphil.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-blue-100 to-white-50",
  },
  {
    name: "Saliac Foaming Face Wash Foaming Bottle Salicylic Acid Of 60 Ml",
    img: "/images/saliac.webp",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-red-100 to-white-50",
  },
  {
    name: "Grd Smart Vanilla Whey Protein Jar Of 200 G",
    img: "/images/grd.png",
    mrp: 86.87,
    price: 79.92,
    discount: 8,
    link: "#",
    bgGradient: "bg-gradient-to-br from-green-100 to-white-50",
  },
  // ...add more deals as needed
];

function formatCurrencyNGN(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(value);
}

function formatTimer(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export const DealsOfTheDay = () => {
  const scrollRef = useRef(null);
  const [timer, setTimer] = useState(15 * 60 + 17); // 15:17 in seconds

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const scroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-10">
      {/* Heading + Timer + View All */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
            Deals of the Day
          </h2>
          <div className="flex items-center bg-orange-500 text-white font-semibold px-3 py-1.5 rounded-lg text-sm">
            <span className="mr-2">⏰</span>
            {timer > 0
              ? `${formatTimer(timer)} MINS LEFT, HURRY!`
              : "Offer Expired"}
          </div>
        </div>
        <a
          href="/deals"
          className="text-teal-600 font-semibold hover:underline text-sm sm:text-base"
        >
          View All
        </a>
      </div>

      {/* Scrollable Product Row */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-320)}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 hover:bg-teal-600 hover:text-white text-gray-700 w-10 h-10 rounded-full items-center justify-center shadow transition-colors duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-1 sm:px-8 pt-3 pb-4 scroll-smooth"
        >
          {deals.map((deal, idx) => (
            <a
              href={deal.link}
              key={idx}
              className={`flex-shrink-0 w-44 sm:w-52 md:w-60 ${deal.bgGradient} border border-gray-200 rounded-2xl flex flex-col items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 hover:scale-105 transition-all duration-200 cursor-pointer p-3 sm:p-4`}
            >
              <img
                src={deal.img}
                alt={deal.name}
                className="w-20 h-20 sm:w-28 sm:h-28 object-contain mb-3"
                draggable={false}
              />
              <div className="w-full">
                <p className="text-sm sm:text-base font-medium text-gray-800 mb-1 truncate">
                  {deal.name}
                </p>
                <div className="text-xs sm:text-sm text-gray-400 mb-1">
                  MRP{" "}
                  <span className="line-through">
                    {formatCurrencyNGN(deal.mrp)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                    {formatCurrencyNGN(deal.price)}
                  </span>
                  <span className="text-xs sm:text-sm text-red-500 font-semibold">
                    ({deal.discount}%)
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(320)}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 hover:bg-teal-600 hover:text-white text-gray-700 w-10 h-10 rounded-full items-center justify-center shadow transition-colors duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
    </section>
  );
};