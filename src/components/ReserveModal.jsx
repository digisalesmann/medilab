import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';

export default function ReserveModal({ medicine, pharmacy, onClose, updateStock, onConfirm }) {
  const [quantity, setQuantity] = useState(1);
  const [availableStock, setAvailableStock] = useState(medicine.stock);
  const [confirmed, setConfirmed] = useState(false);
  const [reservationId] = useState(uuidv4());
  const [deliveryWindow, setDeliveryWindow] = useState('3-7 Days');
  const [pickupSlot] = useState('8:00 AM - 4:00 PM');

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem('reservations') || '[]');
    const usedStock = existing
      .filter(r => r.medicine === medicine.name && r.pharmacy === pharmacy.name)
      .reduce((sum, r) => sum + Number(r.quantity), 0);
    setAvailableStock(Math.max(medicine.stock - usedStock, 0));
  }, [medicine.name, pharmacy.name, medicine.stock]);

  const handleConfirm = () => {
  if (quantity < 1 || quantity > availableStock) {
    alert(`Please enter a quantity between 1 and ${availableStock}`);
    return;
  }

  const reservationData = {
    id: reservationId,
    pharmacyId: pharmacy.id,
    pharmacyName: pharmacy.name,
    medicine: medicine.name,
    quantity,
    pickupSlot,
    deliveryWindow,
  };

  const newReservation = {
    ...reservationData,
    userName: 'Anonymous',
    pharmacy: pharmacy.name,
    verified: false,
  };

  // Save reservation
  const existing = JSON.parse(localStorage.getItem('reservations') || '[]');
  existing.push(newReservation);
  localStorage.setItem('reservations', JSON.stringify(existing));

  // ✅ PHASE 1: Reward user with 10 points
  const user = JSON.parse(localStorage.getItem('currentUser')) || {
    email: localStorage.getItem('userEmail') || 'anonymous@medilab.com',
    points: 0,
  };
  user.points += 10; // 🪙 Earn 10 points
  localStorage.setItem('currentUser', JSON.stringify(user));

  setAvailableStock(availableStock - quantity);
  setConfirmed(true);

  if (typeof updateStock === 'function') {
    updateStock(medicine.name, pharmacy.id, quantity);
  }

  if (typeof onConfirm === 'function') {
    onConfirm(quantity);
  }
};

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Reserve {medicine.name}</h2>

        {confirmed ? (
          <>
            <p className="text-sm mb-2 text-center">Show this QR code during pickup:</p>
            <div className="flex justify-center">
              <QRCodeCanvas value={JSON.stringify({
                id: reservationId,
                pharmacyId: pharmacy.id,
                pharmacyName: pharmacy.name,
                medicine: medicine.name,
                quantity,
                pickupSlot,
                deliveryWindow
              })} size={180} />
            </div>
            <p className="text-xs mt-4 text-gray-500 text-center">
              Pharmacy: {pharmacy.name} <br />
              Quantity: {quantity} | Pickup Time: {pickupSlot} <br />
              Delivery: {deliveryWindow} <br />
              <strong>Reservation ID:</strong> {reservationId}
            </p>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Available: {availableStock}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Delivery Window</label>
                <select
                  value={deliveryWindow}
                  onChange={(e) => setDeliveryWindow(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
                >
                  <option value="1-3 Days">1–3 Days</option>
                  <option value="3-7 Days">3–7 Days</option>
                  <option value="7-14 Days">7–14 Days</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Estimated based on delivery logistics</p>
              </div>
              <div>
                <label className="text-sm font-medium">Pickup Time</label>
                <input
                  type="text"
                  value={pickupSlot}
                  disabled
                  className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <button
              onClick={handleConfirm}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            >
              Confirm & Generate QR
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
