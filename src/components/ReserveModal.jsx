import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

export default function ReserveModal({ medicine, pharmacy, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [pickupTime, setPickupTime] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (pickupTime) setConfirmed(true);
  };

  const reservationData = {
    pharmacyId: pharmacy.id,
    pharmacyName: pharmacy.name,
    medicine: medicine.name,
    quantity,
    pickupTime,
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
              <QRCodeCanvas value={JSON.stringify(reservationData)} size={180} />
            </div>
            <p className="text-xs mt-4 text-gray-500 text-center">
              Pharmacy: {pharmacy.name} <br />
              Quantity: {quantity} | Time: {new Date(pickupTime).toLocaleString()}
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
                  max={medicine.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pickup Time</label>
                <input
                  type="datetime-local"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full border rounded px-3 py-2 mt-1"
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
