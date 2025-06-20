import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from "html5-qrcode";

const MOCK_ADMIN_PHARMACY = "HealthPlus Pharmacy"; // mock admin's pharmacy

export default function AdminPanel() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  // Load reservations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('reservations');
    if (saved) {
      setReservations(JSON.parse(saved));
    }
  }, []);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Verify reservation function wrapped in useCallback
  const verifyReservation = useCallback((reservationId) => {
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
      setMessage(`Reservation with ID "${reservationId}" not found.`);
      return;
    }
    if (reservations[index].verified) {
      setMessage(`Reservation "${reservationId}" is already verified.`);
      return;
    }
    const updated = [...reservations];
    updated[index].verified = true;
    setReservations(updated);
    setMessage(`Reservation "${reservationId}" verified successfully!`);
  }, [reservations]);

  // QR Scanner setup
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render(
      (data) => {
        verifyReservation(data);
      },
      (err) => {
        setError(err);
      }
    );

    return () => {
      scanner.clear().catch((e) => console.error("Failed to clear scanner", e));
    };
  }, [verifyReservation]);

  // Filter reservations for this admin's pharmacy
  const filteredReservations = reservations.filter(
    (r) => r.pharmacy === MOCK_ADMIN_PHARMACY
  );

  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto pt-6 pb-10 p-2 sm:p-4 bg-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
        Admin Panel - {MOCK_ADMIN_PHARMACY}
      </h1>

      {/* QR Scanner Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">Scan Reservation QR Code</h2>
        <div id="qr-reader" style={{ width: "100%" }}></div>
        {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
        {message && <p className="text-green-700 mt-2">{message}</p>}
      </div>

      {/* Reservation List */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Reservations for {MOCK_ADMIN_PHARMACY}</h2>
        {filteredReservations.length === 0 ? (
          <p className="text-gray-600">No reservations found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredReservations.map((r) => (
              <li
                key={r.id}
                className={`p-4 border rounded flex justify-between items-center ${
                  r.verified ? 'bg-green-50 border-green-400' : 'bg-yellow-50 border-yellow-400'
                }`}
              >
                <div>
                  <p><strong>Reservation ID:</strong> {r.id}</p>
                  <p><strong>Medicine:</strong> {r.medicine}</p>
                  <p><strong>User:</strong> {r.userName}</p>
                  <p><strong>Status:</strong> {r.verified ? 'Verified ✅' : 'Pending ⏳'}</p>
                </div>
                {!r.verified && (
                  <button
                    onClick={() => verifyReservation(r.id)}
                    className="ml-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
                  >
                    Verify
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
