import React from "react";
import { useCart } from "../context/CartContext";
import { Trash2, ArrowLeft, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, totals } = useCart();
  const navigate = useNavigate();

  const inc = (i) => updateQty(i.sku, i.pharmacyId, Math.min(i.qty + 1, i.stock || 999));
  const dec = (i) => updateQty(i.sku, i.pharmacyId, Math.max(1, i.qty - 1));

  return (
    <div className="max-w-5xl mx-auto px-4 pt-28 pb-12">
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm text-gray-600 mb-4">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow border p-6">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            <div className="divide-y">
              {items.map((i) => (
                <div key={`${i.sku}-${i.pharmacyId}`} className="py-4 flex items-start gap-4">
                  <div className="w-20 h-20 bg-gray-50 border rounded flex items-center justify-center text-gray-400">
                    {i.image ? <img src={i.image} alt="" className="max-h-full object-contain" /> : "No image"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{i.name}</div>
                        <div className="text-xs text-gray-500">{i.pharmacyName}</div>
                        {typeof i.price === "number" && (
                          <div className="text-sm text-emerald-700 mt-1">₦{i.price.toLocaleString()}</div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">In stock: {i.stock ?? "N/A"}</div>
                      </div>
                      <button
                        onClick={() => removeFromCart(i.sku, i.pharmacyId)}
                        className="text-red-600 hover:text-red-700"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => dec(i)} className="border rounded w-8 h-8 grid place-items-center">
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={i.stock || 999}
                        value={i.qty}
                        onChange={(e) =>
                          updateQty(i.sku, i.pharmacyId, Math.max(1, Math.min(Number(e.target.value || 1), i.stock || 999)))
                        }
                        className="w-16 border rounded px-2 py-1 text-center"
                      />
                      <button onClick={() => inc(i)} className="border rounded w-8 h-8 grid place-items-center">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Items: <strong>{totals.itemCount}</strong>
              </div>
              <div className="text-lg font-semibold">
                Subtotal: <span className="text-emerald-700">₦{totals.subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => clearCart()} className="px-4 py-2 rounded border">
                Clear Cart
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
