import React from 'react';
import { Star, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useParams } from 'react-router-dom';

const mockPharmacies = [
  {
    id: "1",
    name: 'HealthPlus Pharmacy',
    license: 'PHX-3289-2025',
    location: 'Lagos Island, Nigeria',
    owner: 'Dr. Ada Okeke',
    verified: true,
    phone: '+2348001234567',
    reviews: 128,
    rating: 4.6,
    inventory: [
      { name: 'Amoxicillin 500mg', stock: 12 },
      { name: 'Paracetamol', stock: 34 },
      { name: 'Ventolin Inhaler', stock: 0 },
    ],
  },
  {
    id: "2",
    name: 'MediStore',
    license: 'PHX-2210-2025',
    location: 'Victoria Island',
    owner: 'Dr. John Ibrahim',
    verified: true,
    phone: '+2348009876543',
    reviews: 75,
    rating: 4.2,
    inventory: [
      { name: 'Ibuprofen', stock: 22 },
      { name: 'Cough Syrup', stock: 5 },
    ],
  },
];

export default function PharmacyProfile() {
  const { id } = useParams();
  const pharmacy = mockPharmacies.find((p) => p.id === id);

  if (!pharmacy) {
    return <div className="text-center py-10 text-gray-500">Pharmacy not found.</div>;
  }

  // Get initials for avatar badge
  const initials = pharmacy.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-12 space-y-10">
      {/* Pharmacy Info Card */}
      <div className="bg-white shadow-xl text-left rounded-2xl p-6 space-y-6 border">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Left section */}
          <div className="flex items-start gap-4 w-full md:w-2/3">
            <div className="bg-green-100 text-green-800 font-bold w-12 h-12 rounded-full flex items-center justify-center text-lg">
              {initials}
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">{pharmacy.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                {pharmacy.location}
              </div>
              <p className="text-sm text-gray-500">License: {pharmacy.license}</p>
              <p className="text-sm text-gray-500">Owner: {pharmacy.owner}</p>
            </div>
          </div>

          {/* Right section */}
          <div className="w-full md:w-1/3 flex flex-col items-start md:items-end gap-3">
            {pharmacy.verified && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 mr-1" />
                Verified Pharmacy
              </span>
            )}
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(pharmacy.rating) ? 'fill-yellow-400' : ''
                  }`}
                />
              ))}
              <span className="text-sm text-gray-700 ml-1">
                ({pharmacy.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Phone */}
        <div className="pt-2">
          <a
            href={`tel:${pharmacy.phone}`}
            className="inline-flex items-center text-sm text-green-600 hover:underline"
          >
            <Phone className="w-4 h-4 mr-1" />
            {pharmacy.phone}
          </a>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white shadow-md rounded-2xl p-6 border">
        <h3 className="text-xl font-semibold mb-4">Available Medicines</h3>
        <ul className="divide-y divide-gray-200">
          {pharmacy.inventory.map((drug, idx) => (
            <li key={idx} className="flex justify-between items-center py-3">
              <span className="text-gray-800">{drug.name}</span>
              {drug.stock > 0 ? (
                <span className="text-sm text-green-600 font-medium">
                  In stock: {drug.stock}
                </span>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of stock</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
