import React from "react";

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
    <section className="px-4 sm:px-6 md:px-8 py-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Frequently Booked Lab Tests</h2>
        <a href="/lab-tests" className="text-teal-600 font-medium text-sm hover:underline">View All</a>
      </div>

      <div className="
  flex space-x-4
  overflow-x-auto
  scrollbar-hide
  pb-4
  md:overflow-x-hidden  /* disables scroll on desktop */
">
  {labTests.map((test, idx) => (
    <a
      href={test.link}
      key={idx}
      className={`min-w-[240px] sm:min-w-[260px] md:min-w-[280px] ${test.bg}
        p-4 rounded-2xl relative flex flex-col justify-between
        shadow-sm hover:shadow-md hover:scale-[1.02]
        transition-all duration-300 cursor-pointer
      `}
      style={{ height: "280px" }}  // ↓ reduced height
    >
      <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded w-fit mb-2">
        {test.discount}
      </span>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">
          {test.title}
        </h3>
        {test.desc && (
          <p className="text-sm text-gray-600">{test.desc}</p>
        )}
      </div>

      {/* 💡 Price Section Aligned Left */}
      <div className="mt-3 text-left">
        <p className="text-xs line-through text-gray-400">{formatCurrency(test.oldPrice)}</p>
        <p className="text-lg font-bold text-gray-800">{formatCurrency(test.newPrice)}</p>
      </div>

      {/* 📦 Image still stays in bottom right */}
      <img
        src={test.image}
        alt={test.title}
        className="absolute bottom-2 right-3 w-16 sm:w-20 object-contain pointer-events-none"
      />
    </a>
  ))}
</div>
    </section>
  );
};

export default LabTestSection;


const products = [
  {
    title: "Depura Vitamin D3 60k Sugar Free Oral Solution",
    image: "/images/depura.webp",
    oldPrice: 114.93,
    newPrice: 94.24,
    discount: 18,
  },
  {
    title: "Sugar Free Gold Plus Packet Of 500 Pellets",
    image: "/images/sugar.webp",
    oldPrice: 320.0,
    newPrice: 281.6,
    discount: 12,
  },
  {
    title: "Enterogermina Suspension 10 X 5 Ml",
    image: "/images/enterogermina.webp",
    oldPrice: 732.0,
    newPrice: 563.64,
    discount: 23,
  },
  {
    title: "Neurobion Forte Strip Of 30 Tablets",
    image: "/images/neurobion.webp",
    oldPrice: 46.1,
    newPrice: 46.1,
    discount: 0,
  },
  {
    title: "Sebamed Clear Face Cleansing Foam - 150ml",
    image: "/images/sebamed.webp",
    oldPrice: 680.0,
    newPrice: 564.4,
    discount: 17,
  },
  {
    title: "Lite Glo Face Wash Tube Of 100 Ml",
    image: "/images/lite.webp",
    oldPrice: 499.0,
    newPrice: 429.14,
    discount: 14,
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
    <div className="px-4 py-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        Wellness Essentials of the Week
      </h2>
      <p className="text-gray-500 mb-6">Super charge your immunity with us</p>

      <div className="overflow-x-auto md:overflow-x-visible">
        <div className="
          grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))]
          md:grid-cols-3 gap-4
          w-[800px] sm:w-[900px] md:w-full
          md:auto-cols-auto
          md:grid
        ">
          {products.map((product, i) => (
  <a
    href={`/product/${i}`} // You can replace with real product link
    key={i}
    className="block bg-white border rounded-lg shadow-sm p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200 min-w-[200px]"
  >
    <img
      src={product.image}
      alt={product.title}
      className="w-full h-32 object-contain mb-3"
    />
    <h3 className="text-sm font-medium text-gray-900 leading-tight mb-1">
      {product.title.length > 50
        ? product.title.slice(0, 50) + "..."
        : product.title}
    </h3>
    <p className="text-xs text-gray-400 line-through">
      MRP {formatNaira(product.oldPrice)}
    </p>
    <div className="flex justify-between items-center">
      <p className="text-base font-semibold text-gray-800">
        {formatNaira(product.newPrice)}
      </p>
      {product.discount > 0 && (
        <span className="text-xs text-red-500 font-medium">
          ({product.discount}%)
        </span>
      )}
    </div>
  </a>
))}

        </div>
      </div>
    </div>
  );
}