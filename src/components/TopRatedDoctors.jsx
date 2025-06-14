import React from "react";

const topDoctors = [
  {
    name: "Dr. Aisha Bello",
    specialty: "Cardiologist",
    location: "Lagos, Nigeria",
    rating: 4.9,
    reviews: 132,
    img: "/images/aisha.png",
    bg: "bg-blue-50",
    link: "/doctors/aisha-bello",
  },
  {
    name: "Dr. John Okeke",
    specialty: "Pediatrician",
    location: "Abuja, Nigeria",
    rating: 4.8,
    reviews: 98,
    img: "/images/john.png",
    bg: "bg-green-50",
    link: "/doctors/john-okeke",
  },
  {
    name: "Dr. Mary Uduak",
    specialty: "Dermatologist",
    location: "Port Harcourt, Nigeria",
    rating: 4.7,
    reviews: 110,
    img: "/images/mary.png",
    bg: "bg-yellow-50",
    link: "/doctors/mary-uduak",
  },
  {
    name: "Dr. Ibrahim Sule",
    specialty: "Neurologist",
    location: "Kano, Nigeria",
    rating: 4.9,
    reviews: 85,
    img: "/images/ibrahim.png",
    bg: "bg-indigo-50",
    link: "/doctors/ibrahim-sule",
  },
  {
  name: "Dr. Fatima Oladipo",
  specialty: "Endocrinologist",
  location: "Ibadan, Nigeria",
  rating: 4.8,
  reviews: 121,
  img: "/images/fatima.png", // Use a high-quality PNG image
  bg: "bg-pink-50",
  link: "/doctors/fatima-oladipo",
},
{
  name: "Dr. Emeka Uche",
  specialty: "Orthopedic Surgeon",
  location: "Enugu, Nigeria",
  rating: 4.7,
  reviews: 102,
  img: "/images/emeka.png",
  bg: "bg-orange-50",
  link: "/doctors/emeka-uche",
},
{
  name: "Dr. Grace Nwosu",
  specialty: "General Practitioner",
  location: "Benin City, Nigeria",
  rating: 4.9,
  reviews: 143,
  img: "/images/grace.png",
  bg: "bg-purple-50",
  link: "/doctors/grace-nwosu",
}
];

export const TopRatedDoctors = () => {
  return (
    <section className="px-3 sm:px-6 py-5 bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
          Top Rated Doctors Near You
        </h2>
        <a
          href="/doctors"
          className="text-teal-600 font-medium text-xs sm:text-sm hover:underline"
        >
          See All
        </a>
      </div>

            <div className="overflow-x-auto scrollbar-hide pt-2 pb-5">
  <div className="flex space-x-4 w-max">
    {topDoctors.map((doctor, idx) => (
      <a
        href={doctor.link}
        key={idx}
        className={`min-w-[200px] sm:min-w-[240px] md:min-w-[260px] ${doctor.bg}
          p-3 rounded-xl relative flex flex-col shadow-sm hover:shadow-md
          hover:-translate-y-1 hover:scale-[1.05]
          transition-all duration-300 cursor-pointer`}
      >
        <img
          src={doctor.img}
          alt={doctor.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover mb-2 mx-auto"
        />
        <div className="text-center">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">
            {doctor.name}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500">{doctor.specialty}</p>
          <p className="text-xs text-gray-400">{doctor.location}</p>
          <div className="mt-1 text-yellow-500 text-xs sm:text-sm flex justify-center items-center gap-1">
            <span>⭐ {doctor.rating}</span>
            <span className="text-gray-400">({doctor.reviews})</span>
          </div>
        </div>
      </a>
    ))}
  </div>
</div>

</section>
  );
};

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
    </section>
  );
};