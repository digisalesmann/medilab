import React, { useMemo, useState, useRef } from "react";
import {
  Trash2,
  ArrowLeft,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Gift,
  Clock,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCarousel from "../components/ProductCarousel";

/*
 * Replace this with your actual cart context hook; signature assumed:
 * const { items, totals, updateQty, removeFromCart, clearCart, addToCart } = useCart();
 */
import { useCart } from "../context/CartContext";

// --- DYNAMIC DATA SIMULATION ---
// (Data remains the same for functionality)
const DYNAMIC_SECTIONS_DATA = {
  VIEWED: [
    { id: "v1", name: "Infrared Thermometer Digital (3 modes)", price: 8500, image: "/images/ther.jpg", tag: "TRENDING" },
    { id: "v2", name: "First Aid Kit (Travel Edition)", price: 6200, image: "/images/first-aid.jpg" },
    { id: "v3", name: "Blood Pressure Monitor (Wrist Cuff)", price: 15900, image: "/images/bp.jpg", tag: "BEST SELLER" },
    { id: "v4", name: "Digital Scale Body Weight & BMI", price: 3400, originalPrice: 4000, image: "/images/scale.jpg", tag: "15% OFF" },
  ],
  RECENTLY_VIEWED: [
    { id: "r_v1", name: "Hand Sanitizer Gel 1L Refill", price: 2900, image: "/images/sanitizer-large.jpg" },
    { id: "r_v2", name: "Pain Relief Patches (5 Pack)", price: 1800, image: "/images/patches.jpg" },
  ],
  WISHLIST: [
    { id: "w1", name: "Advanced Glucometer Kit (100 Strips)", price: 12500, originalPrice: 15000, image: "/images/glucometer.jpg", tag: "20% OFF" },
    { id: "w2", name: "Multi-Vitamin Gummies (Kids 60ct)", price: 4100, image: "/images/gummies.jpg" },
    { id: "w3", name: "Nasal Spray Decongestant (Long-Lasting)", price: 1950, image: "/images/nasal-spray.jpg" },
    { id: "w4", name: "Compression Socks (Size L)", price: 3800, image: "/images/socks.jpg" },
    { id: "w5", name: "Posture Corrector Brace", price: 6500, originalPrice: 7500, image: "/images/brace.jpg" },
    { id: "w6", name: "Aromatherapy Diffuser", price: 9200, image: "/images/diffuser.jpg" },
    { id: "w7", name: "Electric Heating Pad", price: 5100, image: "/images/heating-pad.jpg" },
    { id: "w8", name: "Sleep Aid Melatonin 5mg", price: 4900, image: "/images/melatonin.jpg" },
  ],
  MORE_TO_LOVE: [
    { id: "m1", name: "Zinc Supplements 50mg (90 caps)", price: 3500, originalPrice: 4200, image: "/images/zinc.jpg", tag: "FAST SELL" },
    { id: "m2", name: "Omega-3 Fish Oil Capsules (120ct)", price: 7800, image: "/images/omega.jpg" },
    { id: "m3", name: "Electrolyte Powder Sachets (10-Pack)", price: 1800, image: "/images/electrolyte.jpg" },
    { id: "m4", name: "Digital Pregnancy Test (2-Pack)", price: 4900, image: "/images/pregnancy-test.jpg" },
    { id: "m5", name: "Gauze Rolls Sterile (3 Pack)", price: 1200, image: "/images/gauze.jpg" },
    { id: "m6", name: "Throat Lozenges (Menthol 24ct)", price: 450, image: "/images/lozenge.jpg" },
  ],
};


export default function CartPage() {
  const navigate = useNavigate();
  // Ensure defaults are handled for context destructuring
  const { items = [], totals, updateQty, removeFromCart, clearCart, addToCart } = useCart();

  // Local UI state
  const [setLoading] = useState(false); // Retain setLoading for future async ops
  const [checkedMap, setCheckedMap] = useState({});
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [deliverySlot, setDeliverySlot] = useState(null);
  const [useInsurance, setUseInsurance] = useState(false);
  const [updating, setUpdating] = useState({});
  const qtyDebounceRef = useRef({});

  // State to manage the dynamic sections (Wishlist/Saved for Later)
  const [dynamicProducts, setDynamicProducts] = useState({
      wishlist: DYNAMIC_SECTIONS_DATA.WISHLIST,
      recommended: DYNAMIC_SECTIONS_DATA.VIEWED,
      recentlyViewed: DYNAMIC_SECTIONS_DATA.RECENTLY_VIEWED,
      moreToLove: DYNAMIC_SECTIONS_DATA.MORE_TO_LOVE,
  });


  // --- CART CORE LOGIC ---

  const grouped = useMemo(() => {
    const g = {};
    (items || []).forEach((it) => {
      const vendor = it.pharmacyId || "default";
      const isLowStock = it.stock && it.stock < 5 && it.stock > 0;
      if (!g[vendor]) g[vendor] = { vendorName: it.pharmacyName || "MediStore HQ", items: [] };
      g[vendor].items.push({ ...it, isLowStock });
    });
    return g;
  }, [items]);

  const safeTotals = totals || { subtotal: items.reduce((s, i) => s + i.price * (i.qty || 1), 0) };
  const shippingCost = shippingMethod === "express" ? 500 : 0;
  const insuranceCost = useInsurance ? 200 : 0;
  const discount = couponApplied?.discount || 0;
  const grandTotal = safeTotals.subtotal - discount + shippingCost + insuranceCost;

  const changeQtyOptimistic = (sku, vendorId, nextQty) => {
    setUpdating((u) => ({ ...u, [`${sku}-${vendorId}`]: true }));
    clearTimeout(qtyDebounceRef.current[`${sku}-${vendorId}`]);
    qtyDebounceRef.current[`${sku}-${vendorId}`] = setTimeout(async () => {
      try {
        await updateQty(sku, vendorId, nextQty);
      } catch (err) {
        console.error("Qty update failed", err);
      } finally {
        setUpdating((u) => ({ ...u, [`${sku}-${vendorId}`]: false }));
      }
    }, 350);
  };

  const removeSelected = async () => {
    setLoading(true);
    try {
      const keys = Object.keys(checkedMap).filter((k) => checkedMap[k]);
      for (const k of keys) {
        const [sku, vendor] = k.split("|");
        await removeFromCart(sku, vendor);
      }
      setCheckedMap({});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!coupon) return;
    setLoading(true);
    try {
      if (coupon.trim().toUpperCase() === "MEDI1000") {
        setCouponApplied({ code: "MEDI1000", discount: 1000, label: "Welcome Discount" });
      } else {
        setCouponApplied({ invalid: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const onCheckout = async () => {
    const payload = { items, totals: safeTotals, shippingMethod, deliverySlot, coupon: couponApplied, insurance: useInsurance };
    console.log("Checkout payload", payload);
    navigate("/checkout", { state: { orderDraft: payload } });
  };

  const deliverySlots = useMemo(() => {
    const base = new Date();
    const arr = [];
    for (let i = 0; i < 4; i++) {
        const d = new Date(base.getTime() + i * 24 * 3600 * 1000);
        arr.push({
            id: `slot-${i}`,
            label: `${d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}`,
            window: i === 0 ? "Today • 2pm - 6pm" : "9am - 6pm",
        });
    }
    return arr;
  }, []);

  const toggleCheck = (sku, vendorId) => {
    const key = `${sku}|${vendorId}`;
    setCheckedMap((m) => ({ ...m, [key]: !m[key] }));
  };


  // --- DYNAMIC ACTIONS FOR CAROUSELS ---
  const handleProductAction = (product, actionType, source) => {
    const itemToAdd = {
        sku: product.id,
        name: product.name,
        price: product.price,
        qty: 1,
        pharmacyId: "default",
        pharmacyName: "MediStore HQ",
        image: product.image,
    };

    if (actionType === 'add' || actionType === 'move') {
        addToCart(itemToAdd);

        if (source === 'wishlist' && actionType === 'move') {
            setDynamicProducts((prev) => ({
                ...prev,
                wishlist: prev.wishlist.filter((p) => p.id !== product.id),
            }));
        }
    } else if (actionType === 'remove' && source === 'wishlist') {
        setDynamicProducts((prev) => ({
            ...prev,
            wishlist: prev.wishlist.filter((p) => p.id !== product.id),
        }));
    }
  };


  // Empty Cart State
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-24 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center py-20 bg-white rounded-2xl shadow-xl border border-dashed border-emerald-200">
          <Package className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Time to stock up on your health essentials. Check out our great deals!</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
          >
            Start Shopping Now
          </button>
        </div>

        <ProductCarousel
            title="Popular Health Essentials"
            subtitle="Start your cart with our best sellers."
            products={dynamicProducts.moreToLove.slice(0, 4)}
            onAction={(p, action) => handleProductAction(p, action, 'empty-recommendations')}
            sectionId="empty-recommendations"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Refined for mobile spacing */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Health Cart ({items.length} items)</h1>
            <p className="text-sm text-gray-600 mt-1 hidden sm:block">
              All items are secured and ready for fast, verified delivery.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="hidden sm:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-700 transition"
            aria-label="Continue shopping"
          >
            <ArrowLeft className="w-4 h-4" /> Continue shopping
          </button>
        </div>

        {/* Main grid: Stacked on mobile, 2/3 and 1/3 on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Items (Order 1 on mobile) */}
          <section className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Bulk actions - condensed for mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl shadow-md border-t-4 border-emerald-600">
              <div className="flex items-center gap-4">
                <input
                  id="bulk-check-all"
                  type="checkbox"
                  aria-label="Select all"
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newMap = {};
                    items.forEach((it) => { newMap[`${it.sku}|${it.pharmacyId}`] = checked; });
                    setCheckedMap(newMap);
                  }}
                  className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="bulk-check-all" className="text-sm sm:text-base text-gray-700 font-medium">
                    Select All ({Object.keys(checkedMap).filter((k) => checkedMap[k]).length})
                </label>

                <button
                  onClick={removeSelected}
                  disabled={Object.keys(checkedMap).filter((k) => checkedMap[k]).length === 0}
                  className="ml-2 inline-flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-full border border-rose-300 text-rose-600 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" /> Remove
                </button>
              </div>
              <div className="text-sm text-gray-500 hidden sm:block">
                <span className="font-semibold text-gray-800">₦{safeTotals.subtotal.toLocaleString()}</span> subtotal
              </div>
            </div>

            {/* Items grouped by vendor */}
            {Object.keys(grouped).map((vendorId) => {
              const vendor = grouped[vendorId];
              return (
                <div key={vendorId} className="bg-white rounded-xl sm:rounded-2xl border shadow-lg overflow-hidden">
                  {/* Vendor Header */}
                  <div className="p-3 sm:p-4 border-b border-emerald-100 flex items-center justify-between bg-emerald-50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs sm:text-sm">
                        {vendor.vendorName[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-emerald-800">{vendor.vendorName}</div>
                        <div className="text-xs text-emerald-600 hidden sm:flex items-center gap-1 mt-0.5">
                          <Truck className="w-3 h-3" /> Ships directly from this verified pharmacy
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{vendor.items.length} item{vendor.items.length > 1 ? "s" : ""}</div>
                  </div>

                  {/* Item List (Detailed UI) */}
                  <div className="divide-y divide-gray-100">
                    {vendor.items.map((it) => {
                      const key = `${it.sku}|${it.pharmacyId}`;
                      const isUpdating = updating[`${it.sku}-${it.pharmacyId}`];
                      return (
                        <article key={key} className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-start hover:bg-emerald-50/50 transition">
                            {/* Checkbox */}
                            <div className="flex-shrink-0 pt-2">
                                <input type="checkbox" checked={!!checkedMap[key]} onChange={() => toggleCheck(it.sku, it.pharmacyId)} aria-label={`Select ${it.name}`} className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            </div>
                            {/* Product Image */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden border flex-shrink-0">
                                {it.image ? (<img src={it.image} alt={it.name} className="object-contain h-full w-full p-1.5 sm:p-2" />) : (<div className="text-xs text-gray-400">No image</div>)}
                            </div>
                            {/* Product Details & Actions */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">{it.name}</h3>
                                        {it.isLowStock && (<p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1"> Limited Stock!</p>)}
                                        <div className="mt-2 text-md text-emerald-700 font-bold hidden sm:block">₦{it.price.toLocaleString()}</div>
                                    </div>
                                    {/* Small remove button */}
                                    <button onClick={() => removeFromCart(it.sku, it.pharmacyId)} className="text-gray-400 hover:text-rose-600 flex-shrink-0" aria-label={`Remove ${it.name}`}><Trash2 className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                                </div>

                                <div className="mt-3 flex items-center justify-between gap-3">
                                    {/* Qty Control */}
                                    <div className="flex items-center border rounded-full overflow-hidden">
                                        <button onClick={() => {const next = Math.max(1, (it.qty || 1) - 1);changeQtyOptimistic(it.sku, it.pharmacyId, next);}} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={it.qty <= 1} aria-label={`Decrease quantity of ${it.name}`}><Minus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                                        <span className={`w-7 sm:w-8 text-center text-sm font-medium ${isUpdating ? 'text-emerald-600' : 'text-gray-800'}`}>{it.qty}</span>
                                        <button onClick={() => {const next = (it.qty || 1) + 1;changeQtyOptimistic(it.sku, it.pharmacyId, next);}} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled={it.qty >= (it.stock || 9999)} aria-label={`Increase quantity of ${it.name}`}><Plus className="w-3 h-3 sm:w-4 sm:h-4" /></button>
                                    </div>

                                    <div className="text-md font-bold text-gray-900 sm:hidden">₦{((it.qty || 1) * it.price).toLocaleString()}</div>
                                    <div className="text-md font-bold text-gray-900 hidden sm:block">₦{((it.qty || 1) * it.price).toLocaleString()}</div>
                                </div>
                                {isUpdating && <div className="text-xs text-emerald-600 mt-1">Updating quantity...</div>}
                            </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Right: Order summary (Order 2 on mobile) */}
          <aside className="space-y-4">
            <div className="bg-white rounded-xl sm:rounded-2xl border shadow-xl p-5 sm:p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="font-extrabold text-lg sm:text-xl text-emerald-800">Checkout Summary</h3>
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">₦{safeTotals.subtotal.toLocaleString()}</span>
                </div>
                {/* Shipping */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-left">Shipping Method</div>
                    <select
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                      className="mt-1 border border-emerald-300 rounded-lg px-2 py-1 text-xs sm:text-sm bg-white focus:ring-emerald-500 focus:border-emerald-500"
                      aria-label="Shipping method"
                    >
                      <option value="standard">Standard (2-4 days) - Free</option>
                      <option value="express">Express (Next Day) - ₦500</option>
                    </select>
                  </div>
                  <span className={`font-medium ${shippingCost > 0 ? "text-gray-900" : "text-emerald-600"}`}>
                    {shippingCost > 0 ? `+₦${shippingCost.toLocaleString()}` : "FREE"}
                  </span>
                </div>
                {/* Insurance & Delivery Slot */}
                <div className="flex justify-between items-center">
                  <label htmlFor="insurance" className="flex items-center gap-2 cursor-pointer">
                    <input id="insurance" type="checkbox" checked={useInsurance} onChange={() => setUseInsurance((s) => !s)} className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-medium">Order Insurance</span>
                  </label>
                  <span className={`font-medium ${useInsurance ? "text-gray-900" : "text-gray-400"}`}>
                    {useInsurance ? `+₦${insuranceCost.toLocaleString()}` : "Optional"}
                  </span>
                </div>
                <div className="pt-2">
                  <div className="font-medium mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600" /> Select Delivery Time</div>
                  <div className="grid grid-cols-2 gap-2">
                    {deliverySlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setDeliverySlot(slot.id)}
                        className={`text-left text-xs sm:text-sm px-2 py-1.5 rounded-lg border-2 transition ${deliverySlot === slot.id ? "border-emerald-600 bg-emerald-50 font-bold" : "border-gray-200 hover:border-emerald-300"}`}
                      >
                        <div className="font-medium">{slot.label}</div>
                        <div className="text-xs text-gray-500">{slot.window}</div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Coupon */}
                <div className="py-2">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2"><Gift className="w-4 h-4 text-emerald-600" /> Apply Promo Code</div>
                  <div className="flex gap-2">
                    <input aria-label="Promo code" value={coupon} onChange={(e) => setCoupon(e.target.value)} type="text" placeholder="e.g. MEDI1000" className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                    <button onClick={applyCoupon} className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">Apply</button>
                  </div>
                  {couponApplied ? (
                    couponApplied.invalid ? (<div className="text-rose-600 text-xs mt-2 font-medium">❌ Invalid code. Please check again.</div>) : (
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-emerald-700 font-medium">Coupon **{couponApplied.code}** Applied!</span>
                        <span className="text-red-600 font-semibold">-₦{couponApplied.discount.toLocaleString()}</span>
                      </div>
                    )
                  ) : null}
                </div>
                <hr className="my-3 border-emerald-100" />
                <div className="flex justify-between text-xl font-extrabold items-center">
                  <span>Grand Total</span>
                  <span className="text-emerald-700">₦{grandTotal.toLocaleString()}</span>
                </div>
                <button onClick={onCheckout} className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-emerald-500/50 shadow-lg hover:bg-emerald-700 transition hidden lg:block" aria-label="Proceed to checkout">
                  Proceed to Checkout ({items.length} items)
                </button>
                <div className="flex items-center justify-center pt-2">
                  <button onClick={() => clearCart()} className="px-4 py-2 text-sm text-gray-500 hover:text-rose-600 transition">Clear Entire Cart</button>
                </div>
              </div>
            </div>

            {/* Premium Trust/Guarantee Block (kept as is) */}
            <div className="bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-200 p-4 text-sm shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="font-bold text-emerald-800">Your Health, Secured.</div>
              </div>
              <ul className="space-y-2 text-gray-600 text-xs">
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-500" /> **Express Delivery** to major cities (check eligibility at checkout).</li>
                <li className="flex items-center gap-2"><Gift className="w-4 h-4 text-emerald-500" /> Guaranteed **Quality & Authenticity** from licensed pharmacies.</li>
                <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-500" /> Free shipping on all orders over **₦10,000**.</li>
              </ul>
            </div>
          </aside>
        </div>

        {/* -------------------- PREMIUM DYNAMIC SECTIONS -------------------- */}
        
        <ProductCarousel
            title="Customers Who Viewed This Also Viewed"
            subtitle="Popular pairings to complete your current purchase."
            products={dynamicProducts.recommended}
            onAction={handleProductAction}
            sectionId="also-viewed"
        />

        <ProductCarousel
            title="Recently Viewed Items"
            subtitle="Did you forget something? Easy to add back."
            products={dynamicProducts.recentlyViewed}
            onAction={handleProductAction}
            sectionId="recently-viewed"
        />

        {dynamicProducts.wishlist.length > 0 && (
            <ProductCarousel
                title={`Your Wishlist (${dynamicProducts.wishlist.length})`}
                subtitle="Move items you saved earlier directly to your cart."
                products={dynamicProducts.wishlist}
                showWishlistActions={true}
                onAction={handleProductAction}
                sectionId="wishlist"
            />
        )}

        <ProductCarousel
            title="More to Love"
            subtitle="Great deals and essential medicines trending now."
            products={dynamicProducts.moreToLove}
            onAction={handleProductAction}
            sectionId="more-to-love"
        />

      </div>

      {/* Mobile Sticky Bottom Bar (Only visible on screens smaller than lg) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-emerald-200 p-3 shadow-2xl lg:hidden z-40">
        <div className="flex justify-between items-center max-w-xl mx-auto">
          <div className="text-sm">
            <div className="text-gray-500">Total:</div>
            <div className="text-lg font-bold text-emerald-700">
              ₦{grandTotal.toLocaleString()}
            </div>
          </div>
          <button
            onClick={onCheckout}
            className="w-2/3 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold text-base shadow-lg hover:bg-emerald-700 transition"
            aria-label="Proceed to checkout"
          >
            Checkout ({items.length})
          </button>
        </div>
      </div>
    </main>
  );
}