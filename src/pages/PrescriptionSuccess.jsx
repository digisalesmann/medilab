"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, FileText, Loader2, MapPin, Phone } from "lucide-react";
import axios from "axios";

// ✅ Use port 5000 (backend)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export default function PrescriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPrescription = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/prescriptions/${id}`, {
          withCredentials: true, // ✅ allow cookies/sessions if needed
        });
        setPrescription(res.data);
      } catch (err) {
        console.error("❌ Error fetching prescription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescription();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <p className="text-red-600 font-medium mb-4">❌ Prescription not found</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 sm:p-10 w-full max-w-md text-center">
        {/* ✅ Success icon */}
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />

        {/* ✅ Heading */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Prescription Uploaded Successfully 🎉
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Our pharmacist will review your prescription and contact you shortly.
        </p>

        {/* ✅ Prescription details */}
        <div className="space-y-3 text-left">
          {prescription.fileUrl && (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <FileText className="w-5 h-5 text-blue-600" />
              <a
                href={`${API_BASE}${prescription.fileUrl}`} // ✅ prepend API_BASE
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View uploaded file
              </a>
            </div>
          )}

          {prescription.address && (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>{prescription.address}</span>
            </div>
          )}

          {prescription.phone && (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <Phone className="w-5 h-5 text-blue-600" />
              <span>{prescription.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
            <span className="font-semibold">Status:</span>
            <span className="capitalize px-2 py-1 rounded-lg bg-yellow-100 text-yellow-800 text-sm">
              {prescription.status || "pending"}
            </span>
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate(`/prescriptions/track?id=${id}`)}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            Track Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
