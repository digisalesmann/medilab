import React from "react";
import { createPortal } from "react-dom";

export default function RedeemModal({ open, item, onClose, onConfirm, canAfford }) {
  if (!open || !item) return null;
  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
                      w-full sm:w-[460px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-5">
        <h3 className="text-lg font-semibold mb-2">Redeem “{item.name}”</h3>
        <p className="text-sm text-gray-600">{item.desc}</p>
        <p className="mt-3 text-sm">
          Cost: <b>{item.cost} pts</b>
          {item.minSpend ? <> • Min spend: ₦{item.minSpend.toLocaleString()}</> : null}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button onClick={onClose} className="h-11 rounded-lg border hover:bg-gray-50">Cancel</button>
          <button
            onClick={() => { onConfirm(item.id); }}
            disabled={!canAfford}
            className={`h-11 rounded-lg ${canAfford ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500"}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}