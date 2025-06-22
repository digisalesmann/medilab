import React, { useState } from 'react';
import { Star, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import ReserveModal from '../components/ReserveModal';
import { useNotifications } from '../context/NotificationContext';

export const mockPharmacies = [
  {
    id: "1",
    name: 'HealthPlus Pharmacy',
    license: 'PHX-3289-2025',
    location: 'Owerri Imo-State',
    owner: 'Dr. Ada Okeke',
    verified: true,
    phone: '+2348001234567',
    reviews: 128,
    rating: 4.6,
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
    name: 'MediStore',
    license: 'PHX-2210-2025',
    location: 'Owerri Imo-State',
    owner: 'Dr. John Ibrahim',
    verified: true,
    phone: '+2348009876543',
    reviews: 75,
    rating: 4.2,
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
    name: 'CityMed Pharmacy',
    license: 'PHX-3301-2025',
    location: 'Yaba, Lagos, Nigeria',
    owner: 'Dr. Tolu Adebayo',
    verified: true,
    phone: '+2347012345678',
    reviews: 102,
    rating: 4.5,
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
    name: 'LifeCare Drugs',
    license: 'PHX-3388-2025',
    location: 'Victoria Island, Lagos, Nigeria',
    owner: 'Dr. Ifeoma Umeh',
    verified: true,
    phone: '+2347034567890',
    reviews: 89,
    rating: 4.4,
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
    name: 'GreenMed Pharmacy',
    license: 'PHX-3402-2025',
    location: 'Maitama, Abuja, Nigeria',
    owner: 'Dr. Musa Danjuma',
    verified: false,
    phone: '+2347067890123',
    reviews: 6,
    rating: 2.3,
    inventory: [],
  },
  {
    id: "6",
    name: 'PrimeCare Pharmacy',
    license: 'PHX-3415-2025',
    location: 'Wuse Zone 2, Abuja, Nigeria',
    owner: 'Dr. Grace Nwankwo',
    verified: true,
    phone: '+2347087654321',
    reviews: 116,
    rating: 4.7,
    inventory: [
      { name: 'Erythromycin 500mg', stock: 8, price: 2400 },
      { name: 'Multivitamin Complex', stock: 35, price: 1500 },
      { name: 'Azithromycin 250mg', stock: 10, price: 2500 },
      { name: 'Amoxicillin 500mg', stock: 12, price: 1200 },
      { name: 'Paracetamol', stock: 34, price: 1600 },
      { name: 'Ventolin Inhaler', stock: 10, price: 1200 },
      { name: 'Ibuprofen 400mg', stock: 20, price: 1000 },
    ],
  },
  {
    id: "7",
    name: 'Silverline Pharmacy',
    license: 'PHX-3492-2025',
    location: 'Ikeja, Lagos, Nigeria',
    owner: 'Dr. Emeka Obi',
    verified: true,
    phone: '+2347011122233',
    reviews: 59,
    rating: 4.1,
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
    name: 'Wellcare Pharmacy',
    license: 'PHX-3524-2025',
    location: 'Asaba, Delta State, Nigeria',
    owner: 'Dr. Kemi Bassey',
    verified: true,
    phone: '+2347098765432',
    reviews: 71,
    rating: 4.3,
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
    name: 'MedEase',
    license: 'PHX-3570-2025',
    location: 'Enugu, Enugu State, Nigeria',
    owner: 'Dr. Chuka Eze',
    verified: false,
    phone: '+2347044433221',
    reviews: 8,
    rating: 1.7,
    inventory: [],
  },
  {
    id: "10",
    name: 'Access Pharma',
    license: 'PHX-3613-2025',
    location: 'Abeokuta, Ogun State, Nigeria',
    owner: 'Dr. Aisha Bello',
    verified: true,
    phone: '+2347055556677',
    reviews: 47,
    rating: 4.0,
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
    name: 'VitalMed',
    license: 'PHX-3688-2025',
    location: 'Port Harcourt, Rivers, Nigeria',
    owner: 'Dr. Oluchi Nnaji',
    verified: true,
    phone: '+2347061239876',
    reviews: 95,
    rating: 4.6,
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
    name: 'CareFirst Pharmacy',
    license: 'PHX-3715-2025',
    location: 'Owerri Imo-State, Nigeria',
    owner: 'Dr. Henry Ezeh',
    verified: true,
    phone: '+2347033338888',
    reviews: 82,
    rating: 4.2,
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
  }
];

const alternativeSuggestions = {
  "Ventolin Inhaler": ["Salbutamol", "Levosalbutamol"],
  "Paracetamol": ["Acetaminophen", "Panadol"],
  "Ibuprofen": ["Diclofenac", "Naproxen"],
  "Cough Syrup": ["Expectorant", "Lozenges"],
};

function getAlternativeMedicines(name) {
  const cleaned = name.toLowerCase().replace(/\s+/g, '');
  const matchedKey = Object.keys(alternativeSuggestions).find(
    (key) => key.toLowerCase().replace(/\s+/g, '') === cleaned
  );
  return alternativeSuggestions[matchedKey] || ["Consult Pharmacist"];
}

export default function PharmacyProfile() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q')?.toLowerCase() || '';

  const [pharmacies, setPharmacies] = useState(mockPharmacies);
  const pharmacyIndex = pharmacies.findIndex((p) => p.id === id);
  const pharmacy = pharmacies[pharmacyIndex];
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultMessage, setConsultMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbackList, setFeedbackList] = useState([]);
  const { addNotification } = useNotifications();


  if (!pharmacy) return <div className="text-center py-10 text-gray-500">Pharmacy not found.</div>;

  const initials = pharmacy.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '').trim();
  const filteredInventory = pharmacy.inventory.filter(drug =>
    drug.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
  );

  const updateStock = (medicineName, pharmacyId, quantityUsed) => {
  setPharmacies((prevPharmacies) =>
    prevPharmacies.map((pharm) => {
      if (pharm.id === pharmacyId) {
        return {
          ...pharm,
          inventory: pharm.inventory.map((item) =>
            item.name === medicineName
              ? { ...item, stock: Math.max(0, item.stock - quantityUsed) }
              : item
          ),
        };
      }
      return pharm;
    })
  );
};


  const submitFeedback = () => {
    if (!rating || !comment.trim()) return alert("Please enter rating and comment");
    const newFeedback = { rating, comment };
    setFeedbackList([...feedbackList, newFeedback]);
    setRating(0);
    setComment('');

    const updatedPharmacies = pharmacies.map((p, index) =>
      index === pharmacyIndex ? { ...p, reviews: p.reviews + 1 } : p
    );
    setPharmacies(updatedPharmacies);

    alert("Thank you for your feedback!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-12 space-y-10">
      {selectedMedicine && (
        <ReserveModal
          medicine={selectedMedicine}
          pharmacy={pharmacy}
          onClose={() => setSelectedMedicine(null)}
          updateStock={updateStock}
          onConfirm={(quantity) => {
            addNotification(`${selectedMedicine.name} reserved successfully from ${pharmacy.name}`);
            setSelectedMedicine(null); // Close modal
          }}
        />
      )}

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

      <div className="bg-white shadow-xl text-left rounded-2xl p-6 space-y-6 border">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
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
                  className={`w-4 h-4 ${i < Math.round(pharmacy.rating) ? 'fill-yellow-400' : ''}`}
                />
              ))}
              <span className="text-sm text-gray-700 ml-1">
                ({pharmacy.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

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

      <div className="bg-white shadow-md rounded-2xl p-6 border">
        <h3 className="text-xl font-semibold mb-4">Available Medicines</h3>
        {query && filteredInventory.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {filteredInventory.map((drug, idx) => (
      <div key={idx} className="p-4 bg-white rounded-xl shadow border flex flex-col justify-between">
        <div>
          <h4 className="text-md font-semibold text-gray-800">{drug.name}</h4>
          {drug.price && (
            <p className="text-sm text-green-700 mt-1 font-medium">
              ₦{drug.price.toLocaleString()}
            </p>
          )}
          <p
            className={`text-sm mt-1 font-medium ${
              drug.stock > 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {drug.stock > 0 ? `In stock: ${drug.stock}` : 'Out of stock'}
          </p>
        </div>

        {drug.stock > 0 ? (
          <button
            onClick={() => setSelectedMedicine(drug)}
            className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg"
          >
            Reserve
          </button>
        ) : (
          <div className="mt-4 text-sm text-blue-800">
            <p className="mb-1">Suggested alternatives:</p>
            <div className="flex flex-wrap gap-2">
              {getAlternativeMedicines(drug.name).map((alt, i) =>
                alt.toLowerCase() === 'consult pharmacist' ? (
                  <button
                    key={i}
                    onClick={() => setShowConsultModal(true)}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200"
                  >
                    {alt}
                  </button>
                ) : (
                  <span
                    key={i}
                    className="px-3 py-1 ml-4 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200"
                  >
                    {alt}
                  </span>
                )
              )}
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
) : query && filteredInventory.length === 0 ? (
  <>
    <p className="text-center text-gray-600 font-medium py-4">
      No medicines found matching <strong>"{query}"</strong>.
    </p>
    <div className="text-center text-sm text-green-700">
      Try these alternatives:
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {getAlternativeMedicines(query).map((alt, i) =>
          alt.toLowerCase() === "consult pharmacist" ? (
            <button
              key={i}
              onClick={() => setShowConsultModal(true)}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs hover:bg-green-200"
            >
              {alt}
            </button>
          ) : (
            <span
              key={i}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200"
            >
              {alt}
            </span>
          )
        )}
      </div>
    </div>
  </>
) : (
  // When no query, show normal list without alternatives
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {pharmacy.inventory.map((drug, idx) => (
      <div key={idx} className="p-4 bg-white rounded-xl shadow border flex flex-col justify-between">
        <div>
          <h4 className="text-md font-semibold text-gray-800">{drug.name}</h4>
          {drug.price && (
            <p className="text-sm text-green-700 mt-1 font-medium">
              ₦{drug.price.toLocaleString()}
            </p>
          )}
          <p
            className={`text-sm mt-1 font-medium ${
              drug.stock > 0 ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {drug.stock > 0 ? `In stock: ${drug.stock}` : 'Out of stock'}
          </p>
        </div>

        {drug.stock > 0 && (
          <button
              onClick={() => setSelectedMedicine(drug)}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg"
            >
              Reserve
          </button>
        )}
      </div>
    ))}
  </div>
)}
</div>
       <div className="bg-white shadow-md rounded-2xl p-6 border space-y-6">
        <h3 className="text-xl font-semibold mb-2">Leave Feedback</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 cursor-pointer ${i <= rating ? 'fill-yellow-400 text-yellow-500' : 'text-gray-300'}`}
              onClick={() => setRating(i)}
            />
          ))}
        </div>
        <textarea
          placeholder="Write your feedback here..."
          className="w-full border rounded p-2"
          rows="3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={submitFeedback}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Feedback
        </button>

        {feedbackList.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold mb-2">Recent Feedback</h4>
            <ul className="space-y-2">
              {feedbackList.map((fb, idx) => (
                <li key={idx} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-sm text-left text-gray-700">{fb.comment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}