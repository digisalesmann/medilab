import React, { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { QrCode } from "lucide-react"; // Or use any QR icon you prefer

export default function ScannerInput({ onVerify, verifyMessage }) {
  const scannerRef = useRef(null);
  const [scannerVisible, setScannerVisible] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [loading, setLoading] = useState(false);

  const startScanner = async () => {
    if (scannerVisible || scannerRef.current) return;

    setScannerVisible(true);
    setTimeout(() => {
      const qrRegion = document.getElementById("qr-reader-box");
      if (!qrRegion) {
        console.error("QR region not found");
        setScannerVisible(false);
        return;
      }

      const scanner = new Html5Qrcode("qr-reader-box");
      scannerRef.current = scanner;

      scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          onVerify(decodedText);
          scanner.stop().then(() => scanner.clear());
          setScannerVisible(false);
        },
        (err) => {
          console.warn("QR scan error", err);
        }
      ).catch((err) => {
        console.error("Failed to start QR scanner", err);
        setScannerVisible(false);
      });
    }, 300); // Delay to ensure div is mounted
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
        setScannerVisible(false);
      });
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      setLoading(true);
      onVerify(manualCode.trim());
      setManualCode("");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleManualSubmit} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Enter Reservation ID"
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>

      <button
        onClick={scannerVisible ? stopScanner : startScanner}
        className="bg-gray-100 border border-emerald-600 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-600 hover:text-white transition flex items-center gap-2 w-max"
      >
        <QrCode size={18} />
        {scannerVisible ? "Stop Scanner" : "Scan QR Code"}
      </button>

      {scannerVisible && (
        <div className="w-full flex justify-center">
          <div
            id="qr-reader-box"
            className="w-[300px] h-[300px] border rounded-lg mt-4"
          ></div>
        </div>
      )}

      {verifyMessage && (
        <p
          className={`text-sm mt-2 ${
            verifyMessage.startsWith("✅")
              ? "text-emerald-700"
              : verifyMessage.startsWith("⚠")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {verifyMessage}
        </p>
      )}
    </div>
  );
}
