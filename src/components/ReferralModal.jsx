// src/components/ReferralModal.jsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useRewards } from "../context/RewardsContext";

export default function ReferralModal({ open, onClose }) {
  const { user } = useRewards();

  const referralCode = user?.referralCode || "";
  const shareLink = useMemo(() => {
    if (!referralCode) return window.location.origin;
    // direct users to your signup route with ?ref=
    return `${window.location.origin}/signup?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="relative z-10 max-w-md w-full bg-white rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold mb-2">Refer a Friend</h3>
        <p className="text-sm text-gray-600">Share this link — you'll earn a referral bonus when your friend completes their first order.</p>

        <div className="mt-4 flex items-center gap-2">
          <input readOnly value={shareLink} className="flex-1 px-3 py-2 rounded border" />
          <button
            className="px-3 py-2 bg-emerald-600 text-white rounded"
            onClick={() => navigator.clipboard.writeText(shareLink)}
          >
            Copy
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">Tip: Send the link via WhatsApp, email, or social share.</div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Close</button>
        </div>
      </motion.div>
    </div>
  );
}
