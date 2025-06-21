import React, { useState } from 'react';
import { MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 💊 Mock alternative suggestions
function getAlternativeMedicines(name) {
  const altMap = {
    paracetamol: ['Acetaminophen', 'Panadol', 'Ibuprofen'],
    ibuprofen: ['Diclofenac', 'Naproxen', 'Aspirin'],
    amoxicillin: ['Ampicillin', 'Azithromycin', 'Ciprofloxacin'],
    'cough syrup': ['Expectorant', 'Lozenges', 'Antihistamine'],
    default: ['Consult Pharmacist'],
  };
  const keyword = name.toLowerCase().split(' ')[0];
  return altMap[keyword] || altMap.default;
}

const mockPharmacies = [
  {
    id: "1",
    name: "HealthPlus Pharmacy",
    location: "Owerri Imo-State",
    distance: 3.2,
    hasMedicine: true,
    inventory: [
      { name: 'Amoxicillin 500mg', stock: 12, price: 1200 },
      { name: 'Paracetamol', stock: 34, price: 1600 },
      { name: 'Ventolin Inhaler', stock: 0, price: 1200 },
      { name: 'Ibuprofen 400mg', stock: 20, price: 1000 },
      { name: 'Ciprofloxacin 500mg', stock: 15, price: 1800 },
      { name: 'Metformin 1000mg', stock: 25, price: 2000 },
      { name: 'Lisinopril 10mg', stock: 18, price: 1500 },
      { name: 'Cetirizine 10mg', stock: 40, price: 900 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Augmentin 625mg', stock: 5, price: 3200 },
      { name: 'Omeprazole 20mg', stock: 50, price: 1100 },
      { name: 'Artemether/Lumefantrine', stock: 8, price: 2800 },
      { name: 'Coartem 80/480mg', stock: 6, price: 3000 },
      { name: 'Folic Acid 5mg', stock: 60, price: 700 },
      { name: 'Chlorpheniramine Maleate', stock: 22, price: 800 },
    ],
  },
  {
    id: "2",
    name: "MediStore",
    location: "Owerri Imo-State",
    distance: 6.5,
    hasMedicine: true,
    inventory: [
      { name: 'Lorazepam 2mg', stock: 7, price: 2900 },
      { name: 'Diazepam 5mg', stock: 12, price: 2200 },
      { name: 'Prednisone 20mg', stock: 10, price: 2100 },
      { name: 'Losartan 50mg', stock: 14, price: 1700 },
      { name: 'Simvastatin 40mg', stock: 9, price: 1900 },
      { name: 'Hydroxychloroquine 200mg', stock: 6, price: 2600 },
      { name: 'Salbutamol Syrup', stock: 11, price: 1300 },
      { name: 'Diclofenac Sodium 100mg', stock: 30, price: 1000 },
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
    ],
  },
  {
    id: "3",
    name: "CityMed Pharmacy",
    location: "Yaba, Lagos, Nigeria",
    distance: 11.4,
    hasMedicine: true,
    inventory: [
      { name: 'Cetirizine', stock: 10, price: 2200 },
      { name: 'Metformin', stock: 7, price: 1950 },
      { name: 'Simvastatin 40mg', stock: 9, price: 1900 },
      { name: 'Hydroxychloroquine 200mg', stock: 6, price: 2600 },
      { name: 'Salbutamol Syrup', stock: 11, price: 1300 },
      { name: 'Diclofenac Sodium 100mg', stock: 30, price: 1000 },
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Augmentin 625mg', stock: 5, price: 3200 },
      { name: 'Omeprazole 20mg', stock: 50, price: 1100 },
      { name: 'Artemether/Lumefantrine', stock: 8, price: 2800 },
      { name: 'Coartem 80/480mg', stock: 6, price: 3000 },
      { name: 'Folic Acid 5mg', stock: 60, price: 700 },
      { name: 'Chlorpheniramine Maleate', stock: 22, price: 800 },
      { name: 'Levosalbutamol', stock: 28, price: 900 },
    ],
  },
  {
  id: "4",
  name: "LifeCare Drugs",
  location: "Victoria Island, Lagos, Nigeria",
  distance: 4.7,
  hasMedicine: true,
  inventory: [
      { name: 'Loratadine', stock: 8, price: 1900 },
      { name: 'Vitamin C', stock: 21, price: 2800 },
      { name: 'Cetirizine', stock: 10, price: 3400 },
      { name: 'Simvastatin 40mg', stock: 9, price: 1900 },
      { name: 'Hydroxychloroquine 200mg', stock: 6, price: 2600 },
      { name: 'Salbutamol Syrup', stock: 11, price: 1300 },
      { name: 'Diclofenac Sodium 100mg', stock: 30, price: 1000 },
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Amoxicillin 500mg', stock: 12, price: 1200 },
      { name: 'Paracetamol', stock: 34, price: 1600 },
      { name: 'Ventolin Inhaler', stock: 0, price: 1200 },
      { name: 'Ibuprofen 400mg', stock: 20, price: 1000 },
      { name: 'Ciprofloxacin 500mg', stock: 15, price: 1800 },
      { name: 'Metformin 1000mg', stock: 25, price: 2000 },
      { name: 'Lisinopril 10mg', stock: 18, price: 1500 },
    ],
},
{
  id: "5",
  name: "GreenMed Pharmacy",
  location: "Maitama, Abuja, Nigeria",
  distance: 8.9,
  hasMedicine: false,
  inventory: [],
},
{
  id: "6",
  name: "PrimeCare Pharmacy",
  location: "Wuse Zone 2, Abuja, Nigeria",
  distance: 2.3,
  hasMedicine: true,
  inventory: [
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Amoxicillin 500mg', stock: 12, price: 1200 },
      { name: 'Paracetamol', stock: 34, price: 1600 },
      { name: 'Ventolin Inhaler', stock: 0, price: 1200 },
      { name: 'Ibuprofen 400mg', stock: 20, price: 1000 },
    ],
},
{
  id: "7",
  name: "Silverline Pharmacy",
  location: "Wuse Zone 2, Abuja",
  distance: 6.1,
  hasMedicine: true,
  inventory: [
      { name: 'Amoxicillin 250mg', stock: 6, price: 3200 },
      { name: 'Nitrazepam 5mg', stock: 6, price: 2200 },
      { name: 'Clopidogrel 75mg', stock: 14, price: 2700 },
      { name: 'Atorvastatin 20mg', stock: 18, price: 2100 },
      { name: 'Cimetidine 200mg', stock: 7, price: 1300 },
      { name: 'Domperidone 10mg', stock: 12, price: 1400 },
      { name: 'Albendazole 400mg', stock: 16, price: 1500 },
      { name: 'Hydralazine 25mg', stock: 5, price: 2400 },
      { name: 'Sildenafil 50mg', stock: 10, price: 2900 },
      { name: 'Ketoconazole Shampoo', stock: 9, price: 3200 },
      { name: 'Vitamin B-Complex Injection', stock: 3, price: 3500 },
    ],
},
{
  id: "8",
  name: "Wellcare Pharmacy",
  location: "Asaba, Delta State, Nigeria",
  distance: 3.9,
  hasMedicine: true,
  inventory: [
      { name: 'Ibuprofen', stock: 18, price: 4600 },
      { name: 'Loratadine', stock: 8, price: 6700 },
      { name: 'Vitamin C', stock: 21, price: 9900 },
      { name: 'Cetirizine', stock: 10, price: 2360 },
      { name: 'Metformin', stock: 7, price: 1150 },
      { name: 'Simvastatin 40mg', stock: 9, price: 1900 },
      { name: 'Hydroxychloroquine 200mg', stock: 6, price: 2600 },
      { name: 'Salbutamol Syrup', stock: 11, price: 1300 },
      { name: 'Diclofenac Sodium 100mg', stock: 30, price: 1000 },
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Amoxicillin 500mg', stock: 12, price: 1200 },
    ],
},
{
  id: "9",
  name: "MedEase",
  location: "Enugu, Enugu State, Nigeria",
  distance: 9.5,
  hasMedicine: false,
  inventory: [],
},
{
  id: "10",
  name: "Access Pharma",
  location: "Abeokuta, Ogun State, Nigeria",
  distance: 1.8,
  hasMedicine: true,
  inventory: [
      { name: 'Antacid', stock: 6, price: 2870 },
      { name: 'Insulin Glargine', stock: 4, price: 5500 },
      { name: 'Amlodipine 10mg', stock: 16, price: 1400 },
      { name: 'Ranitidine 150mg', stock: 9, price: 1200 },
      { name: 'Clotrimazole Cream', stock: 13, price: 1600 },
      { name: 'Betamethasone Cream', stock: 10, price: 1700 },
      { name: 'Magnesium Sulfate', stock: 5, price: 2000 },
      { name: 'Gentamicin Injection', stock: 6, price: 2500 },
      { name: 'Zinc Sulphate Syrup', stock: 28, price: 1000 },
      { name: 'ORS Sachet', stock: 100, price: 300 },
      { name: 'Cough Syrup (Expectorant)', stock: 21, price: 1800 }
    ],
},
{
  id: "11",
  name: "VitalMed",
  location: "Port Harcourt, Rivers, Nigeria",
  distance: 10.2,
  hasMedicine: true,
  inventory: [
      { name: 'Multivitamins', stock: 15, price: 5500 },
      { name: 'Chlorphenamine', stock: 4, price: 7650 },
      { name: 'Nifedipine 20mg', stock: 18, price: 1600 },
      { name: 'Doxycycline 100mg', stock: 11, price: 1900 },
      { name: 'Fluconazole 150mg', stock: 7, price: 2100 },
      { name: 'Miconazole Oral Gel', stock: 9, price: 2300 },
      { name: 'Iron Supplement (Ferrous Sulfate)', stock: 25, price: 1000 },
      { name: 'Levothyroxine 50mcg', stock: 13, price: 2000 },
      { name: 'Warfarin 5mg', stock: 5, price: 2800 },
      { name: 'Metronidazole 400mg', stock: 20, price: 1100 },
      { name: 'Calcium + Vitamin D3', stock: 30, price: 1700 },
      { name: 'Antacid Suspension', stock: 22, price: 900 },
    ],
},
{
  id: "12",
  name: "CareFirst Pharmacy",
  location: "Owerri Imo-State, Nigeria",
  distance: 7.4,
  hasMedicine: true,
  inventory: [
      { name: 'Paracetamol', stock: 20, price: 3200 },
      { name: 'Cough Suppressant (Dextromethorphan)', stock: 14, price: 1500 },
      { name: 'Codeine Phosphate Syrup', stock: 8, price: 2500 },
      { name: 'Penicillin V 250mg', stock: 6, price: 2400 },
      { name: 'Chloroquine Phosphate', stock: 12, price: 1800 },
      { name: 'Neurovite Forte', stock: 19, price: 1600 },
      { name: 'Loperamide 2mg', stock: 40, price: 800 },
      { name: 'Sodium Valproate 200mg', stock: 9, price: 2600 },
      { name: 'Vitamin C Tablets', stock: 50, price: 700 },
      { name: 'Melatonin 3mg', stock: 10, price: 2700 },
      { name: 'Oral Contraceptive Pill', stock: 15, price: 1900 },
    ],
},
];

export default function Pharmacies() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(10);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultMessage, setConsultMessage] = useState('');
  const navigate = useNavigate();

  const trimmedQuery = query.trim().toLowerCase();
  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '').trim();

  const filtered = mockPharmacies.filter((pharm) => {
    const matchName = pharm.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery);
    const matchDrug = pharm.inventory?.some((med) =>
      med.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
    );
    return pharm.distance <= radius && (matchName || matchDrug);
  });

  const handleViewPharmacy = (pharmacyId) => {
    navigate(`/pharmacy/${pharmacyId}?q=${encodeURIComponent(query)}`);
  };

  const showSuggestions = query && filtered.length === 0;

  return (
    <div className="pt-24 pb-24 max-w-6xl mx-auto px-4 space-y-8 bg-gray-50">
      {showConsultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Consult a Pharmacist</h3>
            <textarea
              rows="4"
              placeholder="Type your concern or question..."
              className="w-full border rounded p-2 mb-3"
              value={consultMessage}
              onChange={(e) => setConsultMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConsultModal(false)} className="text-sm text-gray-500">Cancel</button>
              <button
                onClick={() => {
                  alert('Your message has been sent to the pharmacist.');
                  setShowConsultModal(false);
                  setConsultMessage('');
                }}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full space-y-2">
            <p>
              No pharmacies or medicines matching "<strong>{query}</strong>" found within {radius}km.
            </p>
            {showSuggestions && (
              <div className="text-sm text-green-700 space-y-2">
                <strong>Try alternatives:</strong>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {getAlternativeMedicines(trimmedQuery).map((alt, idx) => (
                    alt === 'Consult Pharmacist' ? (
                      <button
                        key={idx}
                        onClick={() => setShowConsultModal(true)}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200"
                      >
                        {alt}
                      </button>
                    ) : (
                      <button
                        key={idx}
                        onClick={() => setQuery(alt)}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200"
                      >
                        {alt}
                      </button>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          filtered.map((pharmacy) => {
            const matchingMeds = pharmacy.inventory?.filter((med) =>
              med.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
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
                  {pharmacy.inventory.length > 0 ? (
                    <span className="text-green-600 font-medium">
                      {pharmacy.inventory.length} medicine{pharmacy.inventory.length > 1 ? 's' : ''} available
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">No medicines in stock</span>
                  )}
                </div>
                {query && matchingMeds?.length > 0 && (
                  <div className="text-sm mt-1 text-green-700">
                    <strong>Match:</strong>{' '}
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