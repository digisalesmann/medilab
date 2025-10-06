import React from "react";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy recommended products (can be replaced with API)
const recommended = [
  { id: 1, name: "Vitamin C 1000mg", price: 4500, image: "/images/vitamin-c.jpg" },
  { id: 2, name: "Face Mask (Pack of 10)", price: 2500, image: "/images/mask.jpg" },
  { id: 3, name: "Hand Sanitizer 500ml", price: 1500, image: "/images/sanitizer.jpg" },
];

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, totals } = useCart();
  const navigate = useNavigate();

  const inc = (i) => updateQty(i.sku, i.pharmacyId, Math.min(i.qty + 1, i.stock || 999));
  const dec = (i) => updateQty(i.sku, i.pharmacyId, Math.max(1, i.qty - 1));

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 pt-24 pb-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-sm text-gray-600 mb-6 hover:text-emerald-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Continue Shopping
      </button>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 sm:p-12 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Browse products and add them to your cart.</p>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow border p-4 sm:p-6">
              <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
              <div className="divide-y">
                {items.map((i) => (
                  <div key={`${i.sku}-${i.pharmacyId}`} className="py-6 flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gray-50 border rounded-lg flex items-center justify-center mb-4 sm:mb-0">
                      {i.image ? (
                        <img src={i.image} alt={i.name} className="max-h-full object-contain rounded" />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between w-full">
                        <div>
                          <h2 className="font-semibold text-gray-900">{i.name}</h2>
                          <p className="text-xs text-gray-500">{i.pharmacyName}</p>
                          <p className="text-sm text-emerald-700 font-medium mt-1">
                            ₦{i.price.toLocaleString()} each
                          </p>
                          <p className="text-xs text-gray-500">Stock: {i.stock ?? "N/A"}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(i.sku, i.pharmacyId)}
                          className="text-red-500 hover:text-red-600 mt-2 sm:mt-0"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {/* Quantity & Total */}
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dec(i)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            max={i.stock || 999}
                            value={i.qty}
                            onChange={(e) =>
                              updateQty(
                                i.sku,
                                i.pharmacyId,
                                Math.max(1, Math.min(Number(e.target.value || 1), i.stock || 999))
                              )
                            }
                            className="w-14 border rounded text-center text-sm"
                          />
                          <button
                            onClick={() => inc(i)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          ₦{(i.qty * i.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => clearCart()}
                  className="w-full sm:w-auto px-4 py-2 rounded border hover:bg-gray-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow border p-4 sm:p-6 h-fit sticky top-28">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{items.reduce((sum, i) => sum + (i.qty || 1), 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₦{totals.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Discount</span>
                  <span>- ₦0</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-emerald-700">
                    ₦{totals.subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Promo code input */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
          {/* Recommended Products */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">You might also like</h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {recommended.map((p) => (
                <div
                  key={p.id}
                  className="w-44 sm:w-56 bg-white border rounded-xl shadow hover:shadow-lg transition p-4 flex-shrink-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-24 sm:h-32 mx-auto object-contain mb-3"
                  />
                  <h3 className="text-sm font-medium text-gray-800">{p.name}</h3>
                  <p className="text-emerald-700 font-semibold mt-1">
                    ₦{p.price.toLocaleString()}
                  </p>
                  <button className="mt-3 w-full px-3 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
