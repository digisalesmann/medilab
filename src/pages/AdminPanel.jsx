import React, { useState, useEffect, useCallback } from 'react';
import ScannerInput from '../components/ScannerInput';

const MOCK_ADMIN_PHARMACY = "MediLab Central";

export default function AdminPanel() {
  const [reservations, setReservations] = useState([]);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('verificationLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });
  const [activeTab, setActiveTab] = useState("reservations");

  useEffect(() => {
    const saved = localStorage.getItem('reservations');
    if (saved) {
      setReservations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('verificationLogs', JSON.stringify(logs));
  }, [logs]);

  const verifyReservation = useCallback((reservationId) => {
    const existing = JSON.parse(localStorage.getItem("reservations") || "[]");
    const index = existing.findIndex(r => r.id === reservationId);
    const timestamp = new Date().toLocaleString();

    if (index === -1) {
      setVerifyMessage(`❌ Reservation ID "${reservationId}" not found.`);
      setLogs(prev => [...prev, { id: reservationId, status: "Not found", time: timestamp }]);
      return;
    }

    if (existing[index].verified) {
      setVerifyMessage(`⚠️ Reservation "${reservationId}" is already verified.`);
      setLogs(prev => [...prev, { id: reservationId, status: "Already verified", time: timestamp }]);
      return;
    }

    existing[index].verified = true;
    existing[index].verifiedAt = timestamp;
    localStorage.setItem("reservations", JSON.stringify(existing));
    setReservations(existing);
    setVerifyMessage(`✅ Reservation "${reservationId}" verified successfully.`);
    setLogs(prev => [...prev, { id: reservationId, status: "Verified", time: timestamp }]);
  }, []);

  const filteredReservations = reservations.filter(r => r.pharmacyName === MOCK_ADMIN_PHARMACY);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 pt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-emerald-700 mb-6">
          Admin Panel – {MOCK_ADMIN_PHARMACY}
        </h1>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab("reservations")} className={`px-4 py-2 rounded ${activeTab === "reservations" ? "bg-emerald-600 text-white" : "bg-white border text-emerald-700"}`}>
            Reservations
          </button>
          <button onClick={() => setActiveTab("logs")} className={`px-4 py-2 rounded ${activeTab === "logs" ? "bg-emerald-600 text-white" : "bg-white border text-emerald-700"}`}>
            Logs
          </button>
        </div>

        {activeTab === "reservations" && (
          <>
            <div className="bg-white rounded-xl shadow p-6 mb-10">
              <h2 className="text-xl font-semibold mb-4">Verify Reservation</h2>
              <ScannerInput onVerify={verifyReservation} verifyMessage={verifyMessage} />
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Active Reservations – MediLab Admin</h2>
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
          </>
        )}

        {activeTab === "logs" && (
          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h2 className="text-xl font-semibold mb-4">Verification Logs</h2>
            {logs.length === 0 ? (
              <p className="text-gray-600">No logs yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm font-medium">
                      <th className="px-4 py-2 border">#</th>
                      <th className="px-4 py-2 border">Reservation ID</th>
                      <th className="px-4 py-2 border">Status</th>
                      <th className="px-4 py-2 border">Time</th>
                      <th className="px-4 py-2 border">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i} className="text-sm">
                        <td className="px-4 py-2 border">{i + 1}</td>
                        <td className="px-4 py-2 border">{log.id}</td>
                        <td className={`px-4 py-2 border ${
                          log.status === "Verified"
                            ? "text-green-600"
                            : log.status === "Already verified"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}>
                          {log.status}
                        </td>
                        <td className="px-4 py-2 border">{log.time}</td>
                        <td className="px-4 py-2 border">
                          <button
                            onClick={() => {
                              const blob = new Blob(
                                [JSON.stringify(log, null, 2)],
                                { type: 'application/json' }
                              );
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `log-${log.id}.json`;
                              a.click();
                              URL.revokeObjectURL(url);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `all-verification-logs.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  Download All Logs
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
