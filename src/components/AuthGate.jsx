// src/components/AuthGate.jsx
import React from "react";
import { useRewards } from "../context/RewardsContext";

export default function AuthGate({ children }) {
  const { rawUser, signInWithGoogle, signOutUser } = useRewards();

  if (!rawUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-4">Sign in to access Rewards</h2>
        <div className="flex gap-3">
          <button onClick={signInWithGoogle} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Sign in with Google</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={signOutUser}
          className="px-3 py-1 bg-gray-100 text-emerald-700 rounded-lg hover:bg-gray-200 text-sm"
        >
          Sign out
        </button>
      </div>
      {children}
    </>
  );
}
