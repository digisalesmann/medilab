// src/pages/PrescriptionSuccess.jsx
import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function PrescriptionSuccess() {
  const params = new URLSearchParams(useLocation().search);
  const id = params.get("id");
  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-2">Prescription Uploaded ✅</h1>
      <p className="text-gray-600 mb-4">Your reference ID: <span className="font-mono">{id}</span></p>
      <p className="text-gray-600 mb-6">We’ll review and call you to confirm your medicines shortly.</p>
      <Link to="/" className="text-white bg-[#008375] hover:bg-[#00695c] px-4 py-2 rounded-lg">Back to Home</Link>
    </div>
  );
}