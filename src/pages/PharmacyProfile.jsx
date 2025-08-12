import React, { useState } from 'react';
import { Star, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import ReserveModal from '../components/ReserveModal';
import { useNotifications } from '../context/NotificationContext';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Respiratory: [
        { name: "Ventolin Inhaler", stock: 0, price: 1200 }
      ],
      Diabetes: [
        { name: "Metformin 1000mg", stock: 25, price: 2000 }
      ],
      Cardiovascular: [
        { name: "Lisinopril 10mg", stock: 18, price: 1500 }
      ],
      "Antihistamines / Allergy": [
        { name: "Cetirizine 10mg", stock: 40, price: 900 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 }
      ],
      "Antacids / Stomach": [
        { name: "Omeprazole 20mg", stock: 50, price: 1100 }
      ],
      Antimalarials: [
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 }
      ],
      "Vitamins & Supplements": [
        { name: "Folic Acid 5mg", stock: 60, price: 700 }
      ]
    }
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
    inventory: {
      "Neurology / Psychiatry": [
        { name: "Lorazepam 2mg", stock: 7, price: 2900 },
        { name: "Diazepam 5mg", stock: 12, price: 2200 }
      ],
      Steroids: [
        { name: "Prednisone 20mg", stock: 10, price: 2100 }
      ],
      Cardiovascular: [
        { name: "Losartan 50mg", stock: 14, price: 1700 },
        { name: "Simvastatin 40mg", stock: 9, price: 1900 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 }
      ],
      "Vitamins & Supplements": [
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ]
    }
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
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Cetirizine", stock: 10, price: 2200 },
        { name: "Chlorpheniramine Maleate", stock: 22, price: 800 }
      ],
      Diabetes: [
        { name: "Metformin", stock: 7, price: 1950 }
      ],
      Cardiovascular: [
        { name: "Simvastatin 40mg", stock: 9, price: 1900 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 },
        { name: "Artemether/Lumefantrine", stock: 8, price: 2800 },
        { name: "Coartem 80/480mg", stock: 6, price: 3000 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Levosalbutamol", stock: 28, price: 900 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Augmentin 625mg", stock: 5, price: 3200 }
      ],
      "Antacids / Stomach": [
        { name: "Omeprazole 20mg", stock: 50, price: 1100 }
      ],
      "Vitamins & Supplements": [
        { name: "Folic Acid 5mg", stock: 60, price: 700 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ]
    }
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
    inventory: {
      "Antihistamines / Allergy": [
        { name: "Loratadine", stock: 8, price: 1900 },
        { name: "Cetirizine", stock: 10, price: 3400 }
      ],
      "Vitamins & Supplements": [
        { name: "Vitamin C", stock: 21, price: 2800 },
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ],
      Cardiovascular: [
        { name: "Simvastatin 40mg", stock: 9, price: 1900 },
        { name: "Lisinopril 10mg", stock: 18, price: 1500 }
      ],
      Antimalarials: [
        { name: "Hydroxychloroquine 200mg", stock: 6, price: 2600 }
      ],
      Respiratory: [
        { name: "Salbutamol Syrup", stock: 11, price: 1300 },
        { name: "Ventolin Inhaler", stock: 0, price: 1200 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
        { name: "Ciprofloxacin 500mg", stock: 15, price: 1800 }
      ],
      Diabetes: [
        { name: "Metformin 1000mg", stock: 25, price: 2000 }
      ]
    }
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
    inventory: {
      Antibiotics: [
        { name: "Erythromycin 500mg", stock: 8, price: 2400 },
        { name: "Azithromycin 250mg", stock: 10, price: 2500 },
        { name: "Amoxicillin 500mg", stock: 12, price: 1200 }
      ],
      "Vitamins & Supplements": [
        { name: "Multivitamin Complex", stock: 35, price: 1500 }
      ],
      "Pain Relievers / Anti-inflammatory": [
        { name: "Paracetamol", stock: 34, price: 1600 },
        { name: "Ibuprofen 400mg", stock: 20, price: 1000 }
      ],
      Respiratory: [
        { name: "Ventolin Inhaler", stock: 10, price: 1200 }
      ]
    }
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
    inventory: {
      Antibiotics: [
        { name: "Amoxicillin 250mg", stock: 6, price: 3200 }
      ],
      "Neurology / Psychiatry": [
        { name: "Nitrazepam 5mg", stock: 6, price: 2200 }
      ],
      Cardiovascular: [
        { name: "Clopidogrel 75mg", stock: 14, price: 2700 },
        { name: "Atorvastatin 20mg", stock: 18, price: 2100 },
        { name: "Hydralazine 25mg", stock: 5, price: 2400 }
      ],
      "Antacids / Stomach": [
        { name: "Cimetidine 200mg", stock: 7, price: 1300 },
        { name: "Domperidone 10mg", stock: 12, price: 1400 }
      ],
      "Anthelmintics / Antiparasitics": [
        { name: "Albendazole 400mg", stock: 16, price: 1500 }
      ],
      "Men's Health": [
        { name: "Sildenafil 50mg", stock: 10, price: 2900 }
      ],
      "Dermatological / Skin Care": [
        { name: "Ketoconazole Shampoo", stock: 9, price: 3200 }
      ],
      "Vitamins & Supplements": [
        { name: "Vitamin B-Complex Injection", stock: 3, price: 3500 }
      ]
    }
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
    inventory: {
    Antibiotics: [
      { name: "Amoxicillin 500mg", stock: 12, price: 1200 },
      { name: "Azithromycin 250mg", stock: 10, price: 2500 },
      { name: "Erythromycin 500mg", stock: 8, price: 2400 },
    ],
    Antihistamines: [
      { name: "Cetirizine", stock: 10, price: 2360 },
      { name: "Loratadine", stock: 8, price: 6700 },
    ],
    PainRelief: [
      { name: "Ibuprofen", stock: 18, price: 4600 },
      { name: "Diclofenac Sodium 100mg", stock: 30, price: 1000 },
    ],
    Antimalarials: [],
    Diabetes: [
      { name: "Metformin", stock: 7, price: 1150 },
    ],
    Cholesterol: [
      { name: "Simvastatin 40mg", stock: 9, price: 1900 },
    ],
    Respiratory: [
      { name: "Salbutamol Syrup", stock: 11, price: 1300 },
    ],
    Supplements: [
      { name: "Multivitamin Complex", stock: 35, price: 1500 },
    ],
  }
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
    inventory: {
    Antacids: [
      { name: "Antacid", stock: 6, price: 2870 },
      { name: "Ranitidine 150mg", stock: 9, price: 1200 },
    ],
    Hormonal: [
      { name: "Insulin Glargine", stock: 4, price: 5500 },
    ],
    BloodPressure: [
      { name: "Amlodipine 10mg", stock: 16, price: 1400 },
    ],
    SkinCare: [
      { name: "Clotrimazole Cream", stock: 13, price: 1600 },
      { name: "Betamethasone Cream", stock: 10, price: 1700 },
    ],
    Injections: [
      { name: "Gentamicin Injection", stock: 6, price: 2500 },
    ],
    Electrolytes: [
      { name: "Magnesium Sulfate", stock: 5, price: 2000 },
      { name: "Zinc Sulphate Syrup", stock: 28, price: 1000 },
      { name: "ORS Sachet", stock: 100, price: 300 },
    ],
    Cough: [
      { name: "Cough Syrup (Expectorant)", stock: 21, price: 1800 },
    ],
  }
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
    inventory: {
    Antibiotics: [
      { name: "Doxycycline 100mg", stock: 11, price: 1900 },
      { name: "Metronidazole 400mg", stock: 20, price: 1100 },
    ],
    Antihistamines: [
      { name: "Chlorphenamine", stock: 4, price: 7650 },
    ],
    Antifungals: [
      { name: "Fluconazole 150mg", stock: 7, price: 2100 },
      { name: "Miconazole Oral Gel", stock: 9, price: 2300 },
    ],
    BloodPressure: [
      { name: "Nifedipine 20mg", stock: 18, price: 1600 },
    ],
    BloodThinners: [
      { name: "Warfarin 5mg", stock: 5, price: 2800 },
    ],
    Hormonal: [
      { name: "Levothyroxine 50mcg", stock: 13, price: 2000 },
    ],
    Vitamins: [
      { name: "Multivitamins", stock: 15, price: 5500 },
      { name: "Calcium + Vitamin D3", stock: 30, price: 1700 },
    ],
    Minerals: [
      { name: "Iron Supplement (Ferrous Sulfate)", stock: 25, price: 1000 },
    ],
    Antacids: [
      { name: "Antacid Suspension", stock: 22, price: 900 },
    ],
  }
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
    inventory: {
    Antibiotics: [
      { name: "Penicillin V 250mg", stock: 6, price: 2400 },
      { name: "Chloroquine Phosphate", stock: 12, price: 1800 },
    ],
    PainRelief: [
      { name: "Paracetamol", stock: 20, price: 3200 },
      { name: "Cough Suppressant (Dextromethorphan)", stock: 14, price: 1500 },
      { name: "Codeine Phosphate Syrup", stock: 8, price: 2500 },
    ],
    Vitamins: [
      { name: "Vitamin C Tablets", stock: 50, price: 700 },
      { name: "Neurovite Forte", stock: 19, price: 1600 },
    ],
    Digestive: [
      { name: "Loperamide 2mg", stock: 40, price: 800 },
    ],
    Neurological: [
      { name: "Sodium Valproate 200mg", stock: 9, price: 2600 },
      { name: "Melatonin 3mg", stock: 10, price: 2700 },
    ],
    Hormonal: [
      { name: "Oral Contraceptive Pill", stock: 15, price: 1900 },
    ],
  }
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
  const navigate = useNavigate();
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
  const [selectedCategory, setSelectedCategory] = useState("All Categories");


  if (!pharmacy) return <div className="text-center py-10 text-gray-500">Pharmacy not found.</div>;

  const initials = pharmacy.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const normalizedQuery = query.toLowerCase().replace(/\s+/g, '').trim();
 const filteredInventory = {};

Object.entries(pharmacy.inventory).forEach(([category, items]) => {
  const categoryMatch = category.toLowerCase().includes(normalizedQuery);
  const matchingDrugs = items.filter(drug =>
    drug.name.toLowerCase().replace(/\s+/g, '').includes(normalizedQuery)
  );

  if (categoryMatch || matchingDrugs.length > 0) {
    // If it's a category match, show all items. Otherwise, just show matching drugs
    filteredInventory[category] = categoryMatch ? items : matchingDrugs;
  }
});

  const updateStock = () => {
  // Do nothing — stock is auto-computed from localStorage in ReserveModal
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

      <div className="mb-4 text-left w-full">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow hover:bg-green-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

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

  {/* Category Filter Dropdown */}
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Filter by Category
    </label>
    <div className="relative w-full md:w-64">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full appearance-none border border-green-500 text-sm text-gray-800 rounded-lg px-4 py-2 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <option value="All Categories">All Categories</option>
        {Object.keys(pharmacy.inventory).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      {/* Green Arrow */}
      <div className="pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-green-600">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>

  {/* Filtered & Grouped Medicines */}
  {query ? (
    Object.keys(filteredInventory).length > 0 ? (
      Object.entries(
        selectedCategory === "All Categories"
          ? filteredInventory
          : { [selectedCategory]: filteredInventory[selectedCategory] || [] }
      ).map(([category, drugs]) => (
        <div key={category} className="mb-6">
          <h4 className="text-md font-semibold text-gray-700 mb-2">{category}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {drugs.map((drug, idx) => {
              const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
              const usedStock = reservations
                .filter(r => r.medicine === drug.name && r.pharmacyId === pharmacy.id)
                .reduce((sum, r) => sum + Number(r.quantity), 0);
              const available = Math.max(0, drug.stock - usedStock);

              return (
                <div key={idx} className="p-4 bg-white rounded-xl shadow border flex flex-col justify-between">
                  <div>
                    <h4 className="text-md font-semibold text-gray-800">{drug.name}</h4>
                    <p className="text-sm text-green-700 mt-1 font-medium">₦{drug.price.toLocaleString()}</p>
                    <p className={`text-sm mt-1 font-medium ${available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {available > 0 ? `In stock: ${available}` : 'Out of stock'}
                    </p>
                  </div>

                  {available > 0 ? (
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
              );
            })}
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-700 py-6 space-y-4">
        <p className="font-medium">
          No medicines found matching <strong>"{query}"</strong>.
        </p>
        <div className="text-sm text-green-700">
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
      </div>
    )
  ) : (
    Object.entries(
      selectedCategory === "All Categories"
        ? pharmacy.inventory
        : { [selectedCategory]: pharmacy.inventory[selectedCategory] || [] }
    ).map(([category, drugs]) => (
      <div key={category} className="mb-6">
        <h4 className="text-md font-semibold text-gray-700 mb-2">{category}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {drugs.map((drug, idx) => {
            const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
            const usedStock = reservations
              .filter(r => r.medicine === drug.name && r.pharmacyId === pharmacy.id)
              .reduce((sum, r) => sum + Number(r.quantity), 0);
            const available = Math.max(0, drug.stock - usedStock);

            return (
              <div key={idx} className="p-4 bg-white rounded-xl shadow border flex flex-col justify-between">
                <div>
                  <h4 className="text-md font-semibold text-gray-800">{drug.name}</h4>
                  <p className="text-sm text-green-700 mt-1 font-medium">₦{drug.price.toLocaleString()}</p>
                  <p className={`text-sm mt-1 font-medium ${available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {available > 0 ? `In stock: ${available}` : 'Out of stock'}
                  </p>
                </div>

                {available > 0 && (
                  <button
                    onClick={() => setSelectedMedicine(drug)}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg"
                  >
                    Reserve
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ))
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