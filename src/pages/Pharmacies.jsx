// GeoSearchPharmacy.jsx
import React, { useState } from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockPharmacies = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    location: "Lagos Island",
    distance: 3.2,
    hasMedicine: true,
    stock: 10
  },
  {
    id: 2,
    name: "MediStore",
    location: "Victoria Island",
    distance: 6.5,
    hasMedicine: true,
    stock: 2
  },
  {
    id: 3,
    name: "Wellness Pharmacy",
    location: "Lekki",
    distance: 11.4,
    hasMedicine: false,
    stock: 0
  }
];

export default function Pharmacies() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);

  const filtered = mockPharmacies.filter(
    (pharm) =>
      pharm.distance <= radius &&
      pharm.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useNavigate();

const handleViewPharmacy = (pharmacyId) => {
  navigate(`/pharmacy/${pharmacyId}`);
};


  return (
    <div className="pt-24 pb-24 max-w-6xl mx-auto px-4 space-y-8 bg-gray-50">
      {/* Search & Radius Filter */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center w-full md:w-2/3 gap-3 border rounded-xl px-4 py-2">
          <Search className="text-green-500" />
          <input
            type="text"
            placeholder="Search medicine or pharmacy..."
            className="w-full outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-1/3">
          <SlidersHorizontal className="text-green-600" />
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full accent-green-600"
          />
          <span className="text-sm">{radius} km</span>
        </div>
      </div>

      {/* Results */}
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No pharmacies found within {radius}km.
          </p>
        ) : (
          filtered.map((pharmacy) => (
            <div
              key={pharmacy.id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                <span className="text-sm text-gray-500">{pharmacy.distance} km</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {pharmacy.location}
              </div>
              <div className="text-sm">
                {pharmacy.hasMedicine ? (
                  <span className="text-green-600 font-medium">
                    In stock: {pharmacy.stock} units
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Not in stock</span>
                )}
              </div>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 w-fit"
                onClick={() => handleViewPharmacy(pharmacy.id)}
              >
                View Pharmacy
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
