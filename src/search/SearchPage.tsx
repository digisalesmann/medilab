import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "./useSearch";

function useQueryParam(name: string) {
  const { search } = useLocation();
  return new URLSearchParams(search).get(name) || "";
}

export default function SearchPage() {
  const navigate = useNavigate();
  const initialQ = useQueryParam("q");
  const { query, setQuery, results, loading, error, count } = useSearch(initialQ);

  const handleSelect = (id: string | number) => {
    navigate(`/drug/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-2xl font-bold mb-4">Search Medicines</h1>

      <input
        className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        placeholder="Search for medicines, brands, or generics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      <div className="text-sm text-gray-600 mb-4">
        {loading
          ? "Searching..."
          : error
          ? "Error fetching results"
          : query && count === 0
          ? "No matches found"
          : `${count} result${count !== 1 ? "s" : ""}`}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((drug) => (
            <div
              key={drug.id}
              onClick={() => handleSelect(drug.id)}
              className="cursor-pointer border rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <h2 className="font-semibold text-emerald-700 text-lg mb-1">
                {drug.brandName || drug.genericName}
              </h2>
              {drug.genericName && (
                <p className="text-sm text-gray-600 italic">
                  Generic: {drug.genericName}
                </p>
              )}
              {drug.manufacturer && (
                <p className="text-sm text-gray-500">{drug.manufacturer}</p>
              )}
              {drug.PharmacyStock && drug.PharmacyStock.length > 0 ? (
                <p className="text-sm text-green-600 mt-2">
                  {drug.PharmacyStock.filter((s) => s.quantity > 0).length} pharmacies have stock
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-2">No stock info</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
