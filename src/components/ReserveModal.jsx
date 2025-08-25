import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Minus, Plus, Clock, Truck, Phone, Share2, Check } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";

/**
 * ReserveModal
 * - Bottom-sheet on mobile, centered dialog on desktop
 * - After confirm, shows QR without closing
 * - Parent should NOT close the modal in onConfirm
 */
export default function ReserveModal({
  medicine,
  pharmacy,
  onClose,
  updateStock,
  onConfirm,
  assumeStockIfMissing = 50,
}) {
  const [quantity, setQuantity] = useState(1);
  const [deliveryWindow, setDeliveryWindow] = useState("3–7 Days");
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId] = useState(uuidv4());

  const scrollRef = useRef(null);
  const closeBtnRef = useRef(null);

  const safePharmacyId = String(pharmacy?.id ?? "");
  const safePharmacyName = String(pharmacy?.name ?? "");
  const safeMedicineName = String(medicine?.name ?? "");
  const unitPrice = Number(medicine?.price ?? 0);

  // Lock page scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  // Available stock with fallback; consider BOTH legacy "pharmacy" (name) and "pharmacyId" (id)
  const availableStock = useMemo(() => {
    const raw = Number(medicine?.stock);
    const base = Number.isFinite(raw) && raw >= 0 ? raw : assumeStockIfMissing;

    try {
      const existing = JSON.parse(localStorage.getItem("reservations") || "[]");
      const used = existing
        .filter((r) => {
          const samePharmacyById = String(r.pharmacyId ?? "") === safePharmacyId && !!safePharmacyId;
          const samePharmacyByName =
            String(r.pharmacy ?? "") === safePharmacyName && !!safePharmacyName;
          const sameMed = String(r.medicine ?? "") === safeMedicineName;
          return (samePharmacyById || samePharmacyByName) && sameMed;
        })
        .reduce((sum, r) => sum + Number(r.quantity || 0), 0);

      return Math.max(base - used, 0);
    } catch {
      return base;
    }
  }, [medicine?.stock, assumeStockIfMissing, safePharmacyId, safePharmacyName, safeMedicineName]);

  // Keep quantity sane
  useEffect(() => {
    setQuantity((q) => {
      if (!availableStock) return 1;
      if (!q || q < 1) return 1;
      if (q > availableStock) return availableStock;
      return q;
    });
  }, [availableStock]);

  const subtotal = useMemo(() => unitPrice * (quantity || 0), [unitPrice, quantity]);

  const close = useCallback(() => onClose?.(), [onClose]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // Focus the close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  const adjustQty = (delta) => {
    if (!availableStock) return;
    setQuantity((q) => Math.max(1, Math.min((q || 1) + delta, availableStock)));
  };

  const handleConfirm = () => {
    if (!availableStock) {
      alert("This item is currently out of stock.");
      return;
    }
    if (!Number.isFinite(quantity) || quantity < 1) {
      alert("Please enter a valid quantity (1 or more).");
      return;
    }
    if (quantity > availableStock) {
      alert(`Only ${availableStock} in stock. Reduce quantity and try again.`);
      return;
    }

    const reservation = {
      id: reservationId,
      createdAt: new Date().toISOString(),
      pharmacyId: safePharmacyId,
      pharmacyName: safePharmacyName,
      medicine: safeMedicineName,
      quantity,
      deliveryWindow,
      pickupSlot: "08:00–16:00",
      unitPrice,
      subtotal,
      verified: false,
      userName: "Anonymous",
    };

    // Save reservation (include legacy "pharmacy" name for backward compatibility)
    try {
      const list = JSON.parse(localStorage.getItem("reservations") || "[]");
      list.push({ ...reservation, pharmacy: safePharmacyName });
      localStorage.setItem("reservations", JSON.stringify(list));
    } catch {}

    // Reward points
    try {
      const user =
        JSON.parse(localStorage.getItem("currentUser") || "null") || {
          email: localStorage.getItem("userEmail") || "anonymous@medilab.com",
          points: 0,
        };
      user.points = Number(user.points || 0) + 10;
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch {}

    // Flip to QR view (do NOT close)
    setConfirmed(true);

    // Notify parent (do NOT close the modal in parent)
    updateStock?.(safeMedicineName, safePharmacyId, quantity);
    onConfirm?.(quantity);

    // Scroll QR into view on small screens
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const downloadPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = document.getElementById("reservation-preview");
      const canvas = await html2canvas(element, { scale: 2 });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const ratio = canvas.height / canvas.width;
      const w = pageW - 40;
      const h = w * ratio;
      pdf.addImage(img, "PNG", 20, 20, w, h);
      pdf.save(`Reservation_${reservationId}.pdf`);
    } catch (e) {
      console.error(e);
      alert("Could not generate PDF. Please try again.");
    }
  };

  const whatsappHref = useMemo(() => {
  const phone = String(pharmacy?.phone || "").replace(/\D/g, "");
  const msg = encodeURIComponent(
    `Hello ${safePharmacyName}, I just reserved ${quantity} x ${safeMedicineName} (ID: ${reservationId}).`
  );
  return phone ? `https://wa.me/${phone}?text=${msg}` : `https://wa.me/?text=${msg}`;
}, [pharmacy?.phone, quantity, safeMedicineName, reservationId, safePharmacyName]);


  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-title"
      className="fixed inset-0 z-[100]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel: bottom-sheet on mobile, centered on desktop */}
      <div
        className="
          absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          w-full sm:w-[520px] bg-white shadow-2xl
          rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col
          h-[90dvh] sm:max-h-[85vh]
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 id="reserve-title" className="text-base sm:text-lg font-semibold">
            {confirmed ? "Reservation Confirmed" : `Reserve ${safeMedicineName}`}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={close}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div ref={scrollRef} className="p-4 overflow-y-auto flex-1 min-h-0">
          {!confirmed ? (
            <>
              {/* Summary */}
              <div className="rounded-lg border p-3 bg-gray-50 mb-3">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{safePharmacyName}</div>
                  <div className="text-gray-500">{safeMedicineName}</div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-md bg-white border p-2">
                    <div className="text-gray-500">Unit Price</div>
                    <div className="font-semibold">
                      {unitPrice ? `₦${unitPrice.toLocaleString()}` : "—"}
                    </div>
                  </div>
                  <div className="rounded-md bg-white border p-2">
                    <div className="text-gray-500">Available</div>
                    <div className="font-semibold">{availableStock}</div>
                  </div>
                </div>
              </div>

              {/* Quantity */}
              <label className="block text-sm font-medium">Quantity</label>
              <div className="mt-1 inline-flex items-stretch rounded-lg border overflow-hidden">
                <button
                  type="button"
                  onClick={() => adjustQty(-1)}
                  className="px-4 h-11 disabled:opacity-40"
                  disabled={quantity <= 1 || !availableStock}
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <input
                  type="number"
                  min={1}
                  max={availableStock || undefined}
                  value={quantity}
                  onChange={(e) => {
                    const n = Number(e.target.value || 0);
                    if (!Number.isFinite(n)) return;
                    const clamped = !availableStock ? 1 : Math.max(1, Math.min(n, availableStock));
                    setQuantity(clamped);
                  }}
                  className="w-24 text-center outline-none h-11"
                />
                <button
                  type="button"
                  onClick={() => adjustQty(1)}
                  className="px-4 h-11 disabled:opacity-40"
                  disabled={!availableStock || quantity >= availableStock}
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">In stock: {availableStock}</div>

              {/* Delivery window */}
              <div className="mt-4">
                <label className="block text-sm font-medium">Delivery Window</label>
                <select
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                >
                  <option value="1–3 Days">1–3 Days</option>
                  <option value="3–7 Days">3–7 Days</option>
                  <option value="7–14 Days">7–14 Days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Truck className="w-4 h-4" /> Estimated based on logistics and distance
                </p>
              </div>

              {/* Pickup slot */}
              <div className="mt-4">
                <label className="block text-sm font-medium">Pickup Window</label>
                <input
                  type="text"
                  value="08:00–16:00"
                  disabled
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> During working hours
                </p>
              </div>

              {/* Subtotal */}
              <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {unitPrice ? `₦${subtotal.toLocaleString()}` : "—"}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  You’ll earn <b>10 points</b> when you complete this reservation.
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg border p-3 bg-gray-50 mb-3 text-center text-sm text-gray-700">
                <Check className="w-5 h-5 inline mr-1 text-emerald-600" />
                Reservation saved. Show this QR at pickup or for delivery.
              </div>

              <div id="reservation-preview" className="bg-white p-4 rounded-lg border">
                <div className="flex justify-center">
                  <QRCodeCanvas
                    value={JSON.stringify(
                      {
                        id: reservationId,
                        pharmacyId: safePharmacyId,
                        pharmacyName: safePharmacyName,
                        medicine: safeMedicineName,
                        quantity,
                        deliveryWindow,
                        pickupSlot: "08:00–16:00",
                      },
                      null,
                      2
                    )}
                    size={200}
                  />
                </div>

                <div className="mt-4 text-sm text-gray-700 space-y-1 text-center">
                  <div><strong>Pharmacy:</strong> {safePharmacyName}</div>
                  <div><strong>Medicine:</strong> {safeMedicineName}</div>
                  <div><strong>Quantity:</strong> {quantity}</div>
                  <div><strong>Delivery Window:</strong> {deliveryWindow}</div>
                  <div><strong>Pickup Window:</strong> 08:00–16:00</div>
                  <div><strong>Reservation ID:</strong> {reservationId}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer — equal buttons on mobile, neat on desktop */}
        <div className="p-4 border-t bg-white">
          {!confirmed ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={close}
                className="h-11 text-sm rounded-lg border hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="h-11 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Confirm & Generate QR
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={downloadPDF}
                className="h-11 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => window.print()}
                className="h-11 text-sm rounded-lg border hover:bg-gray-50"
              >
                Print
              </button>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="h-11 text-sm rounded-lg border hover:bg-gray-50 inline-flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </a>
              <button
                onClick={close}
                className="h-11 text-sm rounded-lg border hover:bg-gray-50"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Helper row */}
        <div className="px-4 pb-4 text-[11px] text-gray-500 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Need help? Call the pharmacy for urgent requests.
        </div>
      </div>
    </div>,
    document.body
  );
}