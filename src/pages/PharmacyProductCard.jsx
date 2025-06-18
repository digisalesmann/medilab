import { FaRegHeart } from 'react-icons/fa';

export default function PharmacyProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4">
      <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-3" />
      <h3 className="font-semibold text-base">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="font-bold text-green-700 mt-2">{formatCurrencyNGN(product.price)}</p>
      <div className="flex justify-between items-center mt-3">
        <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm">
          {product.requiresPrescription ? 'Order with Prescription' : 'Add to Cart'}
        </button>
        <button className="text-green-600 text-xl">
          <FaRegHeart />
        </button>
      </div>
    </div>
  );
}

function formatCurrencyNGN(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(value);
}
