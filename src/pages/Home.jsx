import { Link } from 'react-router-dom';
import { RiSearchLine, RiCameraLine, RiFileList2Line } from "react-icons/ri";
import { 
  RiFlashlightLine, 
  RiFirstAidKitLine, 
  RiCalendarEventLine,
  RiMapPinLine,
  RiArrowRightSLine 
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { RiPulseLine } from "react-icons/ri";

export default function Home() {
  const navigate = useNavigate();
  const [pharmacyDistance, setPharmacyDistance] = useState("1.2km");
  const [userLocation, setUserLocation] = useState(null);

   // Simulate fetching user location
  useEffect(() => {
    // In a real app, you would use geolocation API here
    const timer = setTimeout(() => {
      setUserLocation({
        lat: 28.6139,
        lng: 77.2090
      });
      setPharmacyDistance("0.8km"); // Update after "fetching"
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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
    {
      title: "Fitness & Wellness",
      subtitle: "SHOP NOW",
      image: "/images/store.png",
      link: "/fitness-wellness",
    },
  ];

  return (

  <main className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-green-100 to-blue-200 px-2 sm:px-4 md:px-16 pt-28 pb-4">
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
<div className="mt-8 sm:mt-12">
  <div className="
    grid grid-flow-col auto-cols-[minmax(120px,1fr)]
    sm:grid-flow-row sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7
    gap-3 sm:gap-6
    overflow-x-auto sm:overflow-x-visible
    pl-2 /* Left padding for first item */
    pr-2 /* Right padding for last item */
    scrollbar-hide
    pb-2 mb-3
  ">
    {services.map((item, index) => (
  <Link
    to={item.link}
    key={index}
    className={`
      flex flex-col items-center
      bg-white border border-gray-100 rounded-xl shadow-sm
      hover:shadow-md hover:-translate-y-1
      transition-all duration-200
      py-3 sm:py-4
      mx-0
      ${index === services.length - 1 ? 'lg:hidden' : ''}
    `}
  >
    <img
      src={item.image}
      alt={item.title}
      className="w-12 h-12 sm:w-16 sm:h-16 object-contain mb-1 sm:mb-2"
    />
    <p className="text-xs sm:text-sm font-semibold text-gray-800">{item.title}</p>
    {item.subtitle && (
      <p className="text-[10px] sm:text-xs text-red-500 font-semibold">{item.subtitle}</p>
    )}
  </Link>
))}

  </div>
</div>
{/* ▼ Mobile-Only Section ▼ */}
      <div className="md:hidden space-y-3 px-4 mb-6">
        {/* Quick Actions Bar */}
        <div className="grid grid-flow-col auto-cols-[minmax(110px,1fr)] gap-3">
          <button 
            onClick={() => navigate('/emergency')}
            className="
              bg-white/90 backdrop-blur-sm
              text-emerald-600
              py-3 px-1
              rounded-xl
              shadow-sm hover:shadow-md
              text-xs font-medium
              flex flex-col items-center
              min-h-[100px]
              justify-between
              transition-all
              hover:-translate-y-0.5
              active:scale-95
            "
          >
            <RiFlashlightLine className="text-xl mb-2 animate-pulse" />
            <span>Emergency</span>
          </button>
          
          <button 
            onClick={() => navigate('/first-aid')}
            className="
              bg-white/90 backdrop-blur-sm
              text-blue-600
              py-3 px-1
              rounded-xl
              shadow-sm hover:shadow-md
              text-xs font-medium
              flex flex-col items-center
              min-h-[100px]
              justify-between
              transition-all
              hover:-translate-y-0.5
              active:scale-95
            "
          >
            <RiFirstAidKitLine className="text-xl mb-2" />
            <span>First Aid</span>
          </button>
          
          <button 
            onClick={() => navigate('/lab-booking')}
            className="
              bg-white/90 backdrop-blur-sm
              text-purple-600
              py-3 px-1
              rounded-xl
              shadow-sm hover:shadow-md
              text-xs font-medium
              flex flex-col items-center
              min-h-[100px]
              justify-between
              transition-all
              hover:-translate-y-0.5
              active:scale-95
            "
          >
            <RiCalendarEventLine className="text-xl mb-2" />
            <span>Book Lab</span>
          </button>
        </div>

        {/* Pharmacy Location Widget */}
        <div 
          onClick={() => navigate('/nearby-pharmacies')}
          className="
            flex items-center justify-between 
            bg-white/90 px-4 py-3
            rounded-lg border border-gray-200
            shadow-xs hover:shadow-sm
            transition-all
            active:bg-gray-50
            cursor-pointer
          "
        >
          <div className="flex items-center gap-2">
            <RiMapPinLine className={`
              text-lg
              ${userLocation ? 'text-emerald-600 animate-pulse' : 'text-gray-400'}
            `} />
            <span className="text-xs font-medium">
              {userLocation ? (
                <>Nearest pharmacy: <strong className="text-emerald-700">{pharmacyDistance}</strong></>
              ) : (
                "Locating..."
              )}
            </span>
          </div>
          <RiArrowRightSLine className="text-gray-500" />
        </div>
      </div>

      {/* Services Grid (existing) */}
      <div className="mt-8 sm:mt-12">
        {/* ... your existing services grid ... */}
      </div>
      <div className="md:hidden bg-white p-3 mx-4 mb-4 rounded-xl shadow-sm">
  <p className="text-xs font-medium text-gray-800 mb-2 flex items-center">
    <RiPulseLine className="text-rose-500 mr-1" /> Weekly Activity
  </p>
  <div className="h-16 flex items-end gap-1">
    {[3, 5, 7, 4, 6, 8, 5].map((value, i) => (
      <div 
        key={i}
        className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-200 rounded-t-sm"
        style={{ height: `${value * 10}%` }}
      />
    ))}
  </div>
</div>
    </main>
  );
}