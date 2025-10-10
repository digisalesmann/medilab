// src/components/rewards/RedeemModal.jsx
import React from "react";
import { motion } from "framer-motion";

export default function RedeemModal({ open, item, onClose, onConfirm, canAfford }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ y: 10, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 10, opacity: 0, scale: 0.98 }}
        className="relative z-10 max-w-lg w-full bg-white rounded-2xl shadow-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-2">Confirm Redeem</h3>
        {item ? (
          <>
            <p className="text-sm text-gray-600">You're redeeming <b>{item.name}</b> for <b>{item.cost} pts</b>.</p>
            {item.minSpend && <p className="text-xs text-gray-500 mt-2">Min spend: ₦{item.minSpend}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancel</button>
              <button
                onClick={() => onConfirm(item.id)}
                disabled={!canAfford}
                className={`px-4 py-2 rounded-lg font-semibold ${canAfford ? "bg-emerald-600 text-white" : "bg-gray-200 text-gray-500"}`}
              >
                {canAfford ? "Confirm" : "Insufficient points"}
              </button>
            </div>
          </>
        ) : (
          <p>No item selected.</p>
        )}
      </motion.div>
    </div>
  );
}
