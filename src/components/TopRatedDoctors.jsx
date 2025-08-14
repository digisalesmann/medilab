// src/components/TopRatedDoctors.jsx
import React, { useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaMotorcycle, FaPills, FaMapMarkerAlt } from "react-icons/fa";
import { doctors } from "../data/mockData"; // <- uses your mock doctors

/* --- small helpers --- */
function slugify(s = "") {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* --- Card for each doctor --- */
function DoctorCard({ doc, onClick }) {
  const safeRating = Number(doc.rating || 0);
  return (
    <button
      onClick={onClick}
      className={`min-w-[200px] sm:min-w-[240px] md:min-w-[260px] ${doc.bg || "bg-gray-50"}
        p-3 rounded-xl relative flex flex-col shadow-sm hover:shadow-md
        hover:-translate-y-1 hover:scale-[1.03]
        transition-all duration-200 cursor-pointer text-left focus:outline-none`}
      aria-label={`View ${doc.name}`}
      type="button"
    >
      <img
        src={doc.img}
        alt={doc.name}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2 mx-auto border"
      />
      <div className="text-center">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800">
          {doc.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500">{doc.specialty}</p>
        <p className="text-xs text-gray-400">{doc.location}</p>

        <div className="mt-1 text-xs sm:text-sm flex justify-center items-center gap-2">
          <span className="inline-flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 20 20"
                className={`w-4 h-4 ${i < Math.round(safeRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              >
                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.954L10 0l2.95 5.956 6.562.954-4.756 4.634 1.122 6.545z" />
              </svg>
            ))}
          </span>
          <span className="text-gray-700">{safeRating.toFixed(1)}</span>
          <span className="text-gray-400">({doc.reviews})</span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-gray-500">{doc.experienceYears}+ yrs exp</span>
        {doc.fee && (
          <span className="font-semibold text-emerald-700">
            ₦{Number(doc.fee).toLocaleString()}
          </span>
        )}
      </div>
    </button>
  );
}

/* --- Top Rated Doctors (dynamic) --- */
export const TopRatedDoctors = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // choose up to 12 best-rated doctors
  const top = useMemo(() => {
    return [...(doctors || [])]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 12);
  }, []);

  return (
    <section className="px-3 sm:px-6 py-5 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          Top Rated Doctors Near You
        </h2>
        <button
          onClick={() => navigate("/doctors")}
          className="text-teal-600 font-medium text-xs sm:text-sm hover:underline"
        >
          See All
        </button>
      </div>

      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pt-2 pb-5" ref={scrollRef}>
          <div className="flex space-x-4 w-max">
            {top.map((doc) => (
              <DoctorCard
                key={doc.id}
                doc={doc}
                onClick={() =>
                  navigate(`/doctor/${doc.id}/${slugify(`${doc.name}-${doc.specialty}`)}`)
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
    </section>
  );
};

/* ----------------- keep the rest (with tiny polish) ----------------- */

// components/HealthArticles.jsx
export const HealthArticles = () => {
  const articles = [
    {
      title: "What is Hepatitis A? Causes, Symptoms, and How It Spreads",
      img: "/images/hep.png",
      link: "/articles/hepatitis-a",
    },
    {
      title: "Everything You Need to Know About the Hepatitis A Vaccine",
      img: "/images/vac.png",
      link: "/articles/hepatitis-a-vaccine",
    },
    {
      title: "Everything To Know About the Influenza Vaccine & Its Importance",
      img: "/images/influ.png",
      link: "/articles/influenza-vaccine",
    },
    {
      title: "HPV Vaccine: What is It, When to Be Taken, Importance & Side Effects",
      img: "/images/hpv.png",
      link: "/articles/hpv-vaccine",
    },
    {
      title: "Managing Hypertension: Diet, Lifestyle & Medication",
      img: "/images/hyper.png",
      link: "/articles/hypertension-management",
    },
    {
      title: "Understanding Type 2 Diabetes: Causes & Daily Tips",
      img: "/images/diab.png",
      link: "/articles/type2-diabetes-guide",
    },
    {
      title: "Mental Health: Recognizing Signs of Anxiety & Stress",
      img: "/images/mental.png",
      link: "/articles/mental-health-awareness",
    },
  ];

  return (
    <section className="px-3 sm:px-5 py-5 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
          Health Articles
        </h2>
        <a
          href="/articles"
          className="text-teal-600 text-xs sm:text-sm font-medium hover:underline"
        >
          View All
        </a>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-1 sm:mx-0">
        <div className="flex space-x-3 px-1 sm:px-0 w-max">
          {articles.map((article, index) => (
            <a
              href={article.link}
              key={index}
              className="min-w-[160px] sm:min-w-[200px] max-w-[220px] bg-white rounded-lg shadow-sm hover:shadow-md transition hover:scale-[1.015]"
            >
              <img
                src={article.img}
                alt={article.title}
                className="w-full h-28 sm:h-32 object-cover rounded-t-lg"
              />
              <div className="p-2">
                <h3 className="text-xs sm:text-sm text-gray-800 font-medium line-clamp-3">
                  {article.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
      <div className="lg:hidden relative w-screen left-1/2 -translate-x-1/2 h-2 bg-[#e9eff6] my-4"></div>
    </section>
  );
};

export const WhyChooseUs = () => {
  const stats = [
    {
      icon: <FaUsers className="text-yellow-500 text-3xl mb-2" />,
      title: "46 Million+",
      desc: "Registered users as of June 14, 2025",
    },
    {
      icon: <FaMotorcycle className="text-teal-600 text-3xl mb-2" />,
      title: "66 Million+",
      desc: "Orders delivered till date",
    },
    {
      icon: <FaPills className="text-green-600 text-3xl mb-2" />,
      title: "60,000+",
      desc: "Unique items sold in 6 months",
    },
    {
      icon: <FaMapMarkerAlt className="text-red-500 text-3xl mb-2" />,
      title: "19,000+",
      desc: "Pin codes serviced in 3 months",
    },
  ];

  return (
    <section className="px-4 py-8 bg-gray-50">
      <div className="text-center mb-6 lg:text-left">
        <h2 className="text-2xl font-bold text-gray-800">Why Choose Us?</h2>
      </div>

      {/* Mobile & Tablet Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:hidden">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Desktop Horizontal Layout */}
      <div className="hidden lg:flex justify-start gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="w-1/4 bg-white p-4 rounded-xl shadow flex flex-col items-center text-center"
          >
            {item.icon}
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
