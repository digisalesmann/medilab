import React from "react";
import { categories } from "../data/mockData";
import { Link } from "react-router-dom"; // If Next.js, replace with next/link

const CategoriesPage = () => {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
        All Categories
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`} // Next.js: href={`/category/${cat.slug}`}
            className={`rounded-xl shadow-md overflow-hidden flex flex-col items-center justify-center p-4 cursor-pointer hover:shadow-lg transition ${cat.bgGradient}`}
          >
            <img
              src={cat.image}
              alt={cat.label}
              className="w-20 h-20 object-contain mb-3"
            />
            <span className="font-semibold text-gray-700">{cat.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;