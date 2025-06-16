import React, { useRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { UploadCloud, FilePlus, MapPin, PhoneCall, PackageCheck } from "lucide-react";

export default function PrescriptionOrderSection() {
  return (
    <>
      <div className="w-full flex justify-center px-2 mt-6">
        <div className="flex flex-col md:flex-row bg-[#f3f8fe] border border-[#e3eefd] rounded-2xl w-full max-w-6xl p-5 md:p-6 gap-6 items-center md:items-stretch">
          {/* Left Side */}
          <div className="flex flex-col md:w-1/2 items-center md:items-start justify-center gap-4">
            <UploadCloud size={48} strokeWidth={1.5} className="text-[#008375]" />
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-1">Order with Prescription</h2>
              <p className="text-gray-600 text-sm md:text-base mb-2">
                Upload your prescription and get your medicines delivered.
              </p>
            </div>
            <button className="flex items-center gap-2 bg-[#008375] hover:bg-[#00695c] text-white font-medium px-6 py-2.5 rounded-lg shadow transition text-sm md:text-base">
              <FilePlus size={20} />
              Upload Prescription
            </button>
          </div>

          {/* Right Side */}
          <div className="flex-1 w-full flex flex-col justify-center">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3">How it works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Step icon={<FilePlus size={20} className="text-[#3b82f6]" />} text="Upload your prescription photo" />
              <Step icon={<MapPin size={20} className="text-[#3b82f6]" />} text="Enter your delivery address" />
              <Step icon={<PhoneCall size={20} className="text-[#3b82f6]" />} text="We'll call to confirm medicines" />
              <Step icon={<PackageCheck size={20} className="text-[#3b82f6]" />} text="Sit back! Delivery is on the way" />
            </div>
          </div>
        </div>
      </div>

      {/* New Launches Section */}
      <NewLaunches />

      {/* Shop by Categories Section */}
      <ShopByCategories />
      <TrendingNearYou />
    </>
  );
}

function Step({ icon, text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-[#e3eefd] p-2 rounded-lg">{icon}</div>
      <p className="text-gray-700 text-sm md:text-base">{text}</p>
    </div>
  );
}

const categories = [
  {
    label: "Must haves",
    image: "/images/must.webp",
    bgGradient: "bg-gradient-to-b from-yellow-100 to-yellow-50",
  },
  {
    label: "Sports nutrition",
    image: "/images/sports.webp",
    bgGradient: "bg-gradient-to-b from-blue-100 to-blue-50",
  },
  {
    label: "Vitamins & supplements",
    image: "/images/vit.webp",
    bgGradient: "bg-gradient-to-b from-pink-100 to-pink-50",
  },
  {
    label: "Skin care",
    image: "/images/skin.webp",
    bgGradient: "bg-gradient-to-b from-purple-100 to-purple-50",
  },
  {
    label: "Diabetes essentials",
    image: "/images/dis.webp",
    bgGradient: "bg-gradient-to-b from-green-100 to-green-50",
  },
  {
    label: "Heart health",
    image: "/images/heartt.webp",
    bgGradient: "bg-gradient-to-b from-red-100 to-red-50",
  },
  {
    label: "Ayurvedic care",
    image: "/images/ay.webp",
    bgGradient: "bg-gradient-to-b from-amber-100 to-amber-50",
  },
  {
    label: "Heart health",
    image: "/images/heartt.webp",
    bgGradient: "bg-gradient-to-b from-red-100 to-red-50",
  },
  {
    label: "Ayurvedic care",
    image: "/images/ay.webp",
    bgGradient: "bg-gradient-to-b from-amber-100 to-amber-50",
  },
];

function ShopByCategories() {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto mt-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        Shop by Categories
      </h2>

      {/* Grid on mobile/tab, horizontal scroll on desktop */}
      <div className="relative">
        <div
          ref={scrollRef}
          className={`
            grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4
            lg:flex lg:gap-4 lg:overflow-x-auto lg:scroll-smooth lg:pb-4 scrollbar-hide
          `}
        >
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center rounded-lg p-4 min-w-[110px] sm:min-w-[130px] md:min-w-[150px] lg:min-w-[160px] bg-white shadow-md ${cat.bgGradient} cursor-pointer hover:shadow-lg transition duration-300`}
              onClick={() => console.log("Clicked:", cat.label)}
            >
              <img
                src={cat.image}
                alt={cat.label}
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 object-contain mb-2"
                draggable={false}
              />
              <span className="text-sm sm:text-base font-medium text-gray-700 text-center px-2">
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scroll arrow on desktop only */}
        <button
          onClick={scrollRight}
          className="hidden lg:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
          aria-label="Scroll right"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* View All button on mobile/tab only */}
      <div className="mt-6 flex justify-center lg:hidden">
        <button className="w-[85%] sm:w-[65%] md:w-[50%] text-teal-600 border border-teal-600 px-6 py-2.5 rounded-md text-base font-medium hover:bg-teal-50 transition">
          View All Categories
        </button>
      </div>

      {/* Mobile divider */}
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4" />
    </section>
  );
}

const products = [
  {
    title: "Shelcal Total Supplement With You...",
    image: "/images/shell.png",
    mrp: 820,
    price: 713.4,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-yellow-100 to-white",
  },
  {
    title: "Kofol Lozenge 60 No'S",
    image: "/images/koff.png",
    mrp: 50,
    price: 43.5,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-green-100 to-white",
  },
  {
    title: "Tedibar Atogla Baby Lotion 200ml",
    image: "/images/tedd.png",
    mrp: 635,
    price: 520.7,
    discount: 18,
    bgGradient: "bg-gradient-to-b from-pink-100 to-white",
  },
  {
    title: "Pilgrim 3% Redensyl & 4% Anagain Advance",
    image: "/images/pill.png",
    mrp: 545,
    price: 392.4,
    discount: 28,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white",
  },
  {
    title: "Combiflam Ms Tube Of 30gm Cream",
    image: "/images/comm.png",
    mrp: 140,
    price: 121.8,
    discount: 13,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white",
  },
  {
    title: "Baidyanath Nagpur Chyawanprash Special",
    image: "/images/baid.png",
    mrp: 460,
    price: 299,
    discount: 35,
    bgGradient: "bg-gradient-to-b from-red-100 to-white",
  },
];

function NewLaunches() {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 px-2">
     <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
  <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">New Launches</h2>
  <p className="text-sm sm:text-lg text-gray-500 mb-4 sm:mb-6">New wellness range just for you!</p>
  
  <div className="relative">
    <div
      ref={scrollRef}
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth scrollbar-hide"
    >
      {products.map((item, idx) => (
        <div
  key={idx}
  className={`
    flex-shrink-0 
    w-40 sm:w-60 lg:w-56
    ${item.bgGradient} 
    border border-gray-200 
    rounded-xl sm:rounded-2xl lg:rounded-xl
    flex flex-col items-center 
    p-3 sm:p-4 lg:p-3.5
    shadow-sm hover:shadow-lg 
    transition-shadow duration-300 
    cursor-pointer
  `}
>
  <img
    src={item.image}
    alt={item.title}
    className="w-20 h-20 sm:w-28 sm:h-28 lg:w-24 lg:h-24 object-contain mb-3"
    draggable={false}
  />
  <div className="w-full">
    <p className="text-xs sm:text-base lg:text-sm font-medium text-gray-800 mb-1 truncate">
      {item.title}
    </p>
    <div className="text-xs sm:text-sm lg:text-xs text-gray-400 mb-1">
      MRP <span className="line-through">₦{item.mrp.toLocaleString()}</span>
    </div>
    <div className="flex items-baseline gap-1 sm:gap-2 lg:gap-1.5">
      <span className="text-sm sm:text-lg lg:text-base font-semibold text-gray-900">
        ₦{item.price.toLocaleString()}
      </span>
      <span className="text-[10px] sm:text-sm lg:text-xs text-red-500 font-semibold">
        ({item.discount}%)
      </span>
    </div>
  </div>
</div>

      ))}
    </div>

    {/* Scroll button (only visible on desktop) */}
    <button
      onClick={scrollRight}
      className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
      aria-label="Scroll right"
    >
      <FaChevronRight />
    </button>
  </div>
  <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
</section>
  );
}

const trendingProducts = [
  {
    title: "Shelcal 500mg Strip Of 15 Tablets",
    image: "/images/shel.png",
    mrp: 1580,
    price: 1221.2,
    discount: 23,
    bgGradient: "bg-gradient-to-b from-yellow-100 to-white-50",
  },
  {
    title: "Abzorb Total Skin Relief Dusting Powder",
    image: "/images/abz.webp",
    mrp: 750,
    price: 600,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-blue-100 to-white-50",
  },
  {
    title: "Liveasy Wellness Calcium Magnesium",
    image: "/images/liv.png",
    mrp: 480,
    price: 384,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
  },
  {
    title: "Evion 400mg Strip Of 20 Capsules",
    image: "/images/evionn.png",
    mrp: 350,
    price: 298,
    discount: 15,
    bgGradient: "bg-gradient-to-b from-green-100 to-white-50",
  },
  {
    title: "Revital H Men Multivitamin",
    image: "/images/rev.png",
    mrp: 650,
    price: 520,
    discount: 20,
    bgGradient: "bg-gradient-to-b from-orange-100 to-white-50",
  },
  {
    title: "Dr. Morepen Gluco One Bg 03 Glucometer",
    image: "/images/morr.png",
    mrp: 900,
    price: 765,
    discount: 15,
    bgGradient: "bg-gradient-to-b from-pink-100 to-white-50",
  },
];

function TrendingNearYou() {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto mt-8 sm:mt-12 px-2">
  <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1">Trending Near You</h2>
  <p className="text-sm sm:text-lg text-gray-500 mb-4 sm:mb-6">Popular in your city</p>

  <div className="relative">
    <div
      ref={scrollRef}
      className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 sm:pb-4 scroll-smooth scrollbar-hide"
    >
      {trendingProducts.map((item, idx) => (
        <div
          key={idx}
         className={`flex-shrink-0 w-40 sm:w-60 lg:w-56 ${item.bgGradient} border border-gray-200 rounded-xl sm:rounded-2xl lg:rounded-xl flex flex-col items-center p-3 sm:p-4 lg:p-3.5 shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 sm:w-28 sm:h-28 lg:w-24 lg:h-24 object-contain mb-3"
            draggable={false}
          />
          <div className="w-full">
            <p className="text-xs sm:text-base font-medium text-gray-800 mb-1 truncate">{item.title}</p>
            <div className="text-xs sm:text-sm text-gray-400 mb-1">
              MRP <span className="line-through">₦{item.mrp.toLocaleString()}</span>
            </div>
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-sm sm:text-lg font-semibold text-gray-900">₦{item.price.toLocaleString()}</span>
              <span className="text-[10px] sm:text-sm text-red-500 font-semibold">({item.discount}% off)</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Right Scroll Arrow - Desktop Only */}
    <button
      onClick={scrollRight}
      className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 bg-gray-800 hover:bg-teal-600 text-white w-10 h-10 items-center justify-center rounded-full shadow transition-colors duration-300 z-10"
      aria-label="Scroll right"
    >
      <FaChevronRight />
    </button>
  </div>
  <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
</section>
  );
}