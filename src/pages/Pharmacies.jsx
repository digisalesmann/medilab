import React, { useState } from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockPharmacies = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    location: "Owerri Imo-State",
    distance: 3.2,
    hasMedicine: true,
    stock: 10,
    inventory: [
      { name: 'Amoxicillin 500mg' },
      { name: 'Paracetamol' },
    ],
  },
  {
    id: 2,
    name: "MediStore",
    location: "Owerri Imo-State",
    distance: 6.5,
    hasMedicine: true,
    stock: 2,
    inventory: [
      { name: 'Ibuprofen' },
      { name: 'Cough Syrup' },
    ],
  },
  {
    id: 3,
    name: "Wellness Pharmacy",
    location: "Lekki",
    distance: 11.4,
    hasMedicine: false,
    stock: 0,
    inventory: [],
  },
  {
  id: 4,
  name: "CityMed Pharmacy",
  location: "Yaba, Lagos",
  distance: 4.7,
  hasMedicine: true,
  stock: 5,
  inventory: [
    { name: 'Cetirizine' },
    { name: 'Metformin' },
  ],
},
{
  id: 5,
  name: "LifeCare Drugs",
  location: "Victoria Island, Lagos",
  distance: 8.9,
  hasMedicine: true,
  stock: 12,
  inventory: [
    { name: 'Loratadine' },
    { name: 'Vitamin C' },
  ],
},
{
  id: 6,
  name: "GreenMed Pharmacy",
  location: "Maitama, Abuja",
  distance: 2.3,
  hasMedicine: false,
  stock: 0,
  inventory: [],
},
{
  id: 7,
  name: "PrimeCare Pharmacy",
  location: "Wuse Zone 2, Abuja",
  distance: 6.1,
  hasMedicine: true,
  stock: 7,
  inventory: [
    { name: 'Azithromycin' },
    { name: 'Paracetamol' },
  ],
},
{
  id: 8,
  name: "Silverline Pharmacy",
  location: "Ikeja, Lagos",
  distance: 3.9,
  hasMedicine: true,
  stock: 3,
  inventory: [
    { name: 'Amoxicillin 250mg' },
  ],
},
{
  id: 9,
  name: "Wellcare Pharmacy",
  location: "Asaba, Delta State",
  distance: 9.5,
  hasMedicine: true,
  stock: 9,
  inventory: [
    { name: 'Ibuprofen' },
    { name: 'Diclofenac' },
  ],
},
{
  id: 10,
  name: "MedEase",
  location: "Enugu, Enugu State",
  distance: 1.8,
  hasMedicine: false,
  stock: 0,
  inventory: [],
},
{
  id: 11,
  name: "Access Pharma",
  location: "Abeokuta, Ogun State",
  distance: 10.2,
  hasMedicine: true,
  stock: 6,
  inventory: [
    { name: 'Cough Syrup' },
    { name: 'Antacid' },
  ],
},
{
  id: 12,
  name: "VitalMed",
  location: "Port Harcourt, Rivers",
  distance: 7.4,
  hasMedicine: true,
  stock: 4,
  inventory: [
    { name: 'Multivitamins' },
    { name: 'Chlorphenamine' },
  ],
},
{
  id: 13,
  name: "CareFirst Pharmacy",
  location: "Owerri Imo-State",
  distance: 2.6,
  hasMedicine: true,
  stock: 8,
  inventory: [
    { name: 'Paracetamol' },
    { name: 'Loperamide' },
  ],
}
];

export default function Pharmacies() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const navigate = useNavigate();

  // Normalize query
  const lowerQuery = query.toLowerCase();

  // Filter pharmacies by radius + search term in name or inventory
  const filtered = mockPharmacies.filter((pharm) => {
    const matchName = pharm.name.toLowerCase().includes(lowerQuery);
    const matchDrug = pharm.inventory?.some((med) =>
      med.name.toLowerCase().includes(lowerQuery)
    );
    return pharm.distance <= radius && (matchName || matchDrug);
  });

  const handleViewPharmacy = (pharmacyId) => {
    navigate(`/pharmacy/${pharmacyId}?q=${encodeURIComponent(query)}`);
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
          filtered.map((pharmacy) => {
            const matchingMeds = pharmacy.inventory?.filter((med) =>
              med.name.toLowerCase().includes(lowerQuery)
            );

            return (
              <div
                key={pharmacy.id}
                className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{pharmacy.name}</h3>
                  <span className="text-sm text-gray-500">
                    {pharmacy.distance} km
                  </span>
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

                {/* Highlight matched drug names */}
                {query && matchingMeds?.length > 0 && (
                  <div className="text-sm mt-1 text-green-700">
                    <strong>Match:</strong>{" "}
                    {matchingMeds.map((m) => m.name).join(', ')}
                  </div>
                )}

                <button
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 w-fit"
                  onClick={() => handleViewPharmacy(pharmacy.id)}
                >
                  View Pharmacy
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
