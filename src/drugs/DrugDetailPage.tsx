import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function DrugDetailPage() {
  const { id } = useParams();
  const [drug, setDrug] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/drugs/${id}`);
        setDrug(res.data);
      } catch (err) {
        console.error("Failed to fetch drug:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!drug) return <div className="pt-24 text-center">Drug not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-bold text-emerald-700 mb-2">
        {drug.brandName || drug.genericName}
      </h1>
      <p className="text-gray-600 mb-4">{drug.genericName}</p>
      {drug.manufacturer && (
        <p className="text-gray-500 mb-4">By {drug.manufacturer}</p>
      )}
      {drug.description && (
        <p className="text-gray-700 whitespace-pre-line">{drug.description}</p>
      )}
      {drug.PharmacyStock?.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Stock Availability</h2>
          <ul className="space-y-1 text-sm">
            {drug.PharmacyStock.map((s: any, i: number) => (
              <li key={i} className="text-gray-600">
                Pharmacy #{s.pharmacyId}: {s.quantity} available
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
