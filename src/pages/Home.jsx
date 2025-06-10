import { Link } from 'react-router-dom';
import { RiSearchLine, RiCameraLine, RiFileList2Line } from "react-icons/ri";

export default function Home() {
  const services = [
    {
      title: "Medicine",
      subtitle: "SAVE 25%",
      image: "/images/medicine.webp",
      link: "/medicine",
    },
    {
      title: "Lab Tests",
      subtitle: "UPTO 70% OFF",
      image: "/images/lab-test.webp",
      link: "/lab-tests",
    },
    {
      title: "Doctor Consult",
      subtitle: "",
      image: "/images/doctor.webp",
      link: "/doctor-consult",
    },
    {
      title: "Healthcare",
      subtitle: "UPTO 60% OFF",
      image: "/images/healthcare.webp",
      link: "/healthcare",
    },
    {
      title: "Health Blogs",
      subtitle: "",
      image: "/images/heart.webp",
      link: "/health-blogs",
    },
    {
      title: "PLUS",
      subtitle: "SAVE 5% EXTRA",
      image: "/images/plus.webp",
      link: "/plus",
    },
    {
      title: "Offers",
      subtitle: "",
      image: "/images/gift.webp",
      link: "/offers",
    },
  ];

  return (

  <main className="min-h-screen w-full bg-gradient-to-br paddin from-blue-100 via-green-100 to-blue-200 px-2 sm:px-4 md:px-16 pt-28 pb-2">
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

      <div className="max-w-xl mx-auto flex items-center bg-white shadow-md rounded-full overflow-hidden px-2 sm:px-4 py-2">
        <RiSearchLine className="text-gray-400 text-lg sm:text-xl mr-1 sm:mr-2" />
        <input
          type="text"
          placeholder="Search for Shampoo"
          className="flex-grow outline-none text-xs sm:text-sm text-gray-700 bg-transparent"
        />
        <button
          type="button"
          className="flex items-center justify-center bg-transparent text-gray-400 hover:text-teal-600 rounded-full p-1 sm:p-2 mr-1 sm:mr-2"
          title="Search by image"
          onClick={() => {
            document.getElementById('image-upload-input').click();
          }}
        >
          <RiCameraLine className="text-lg sm:text-xl" />
        </button>
        <input
          id="image-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => {
            // Handle image upload for search here
          }}
        />
        <button className="bg-emerald-600 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-full hover:bg-green-700 transition text-xs sm:text-base">
          Search
        </button>
      </div>
    </div>

      {/* Services Grid */}
      <div className="mt-12">
  <div className="
    grid grid-flow-col sm:grid-flow-row sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7
    gap-4 sm:gap-6
    overflow-x-auto sm:overflow-x-visible
    px-1 sm:px-0
    scrollbar-hide
  ">
    {services.map((item, index) => (
      <Link
        to={item.link}
        key={index}
        className="
          min-w-[120px] sm:min-w-0
          flex flex-col items-center
          bg-white border border-gray-100 rounded-xl shadow-sm
          hover:shadow-md hover:-translate-y-1 hover:scale-105
          transition-all duration-200
          mx-2 sm:mx-0
          py-4
        "
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-2"
        />
        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
        {item.subtitle && (
          <p className="text-xs text-red-500 font-semibold">{item.subtitle}</p>
        )}
      </Link>
    ))}
  </div>
</div>

    </main>
  );
}