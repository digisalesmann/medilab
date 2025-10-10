// src/pages/Rewards.jsx
import React, { useState } from "react";
import { useRewards } from "../context/RewardsContext";
import RedeemModal from "../components/rewards/RedeemModal";
import ReferralModal from "../components/ReferralModal";
import AuthGate from "../components/AuthGate";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Gift, Crown } from "lucide-react";

export default function RewardsPage() {
  return (
    <AuthGate>
      <RewardsInner />
    </AuthGate>
  );
}

function RewardsInner() {
  // Move all hooks to the top, before any return
  const {
    user, txns, vouchers, missions, catalog, tiers,
    dailyCheckIn, canDailyCheckIn, completeMission, redeem,
  } = useRewards();

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [refOpen, setRefOpen] = useState(false);

  // guard
  if (!user) return null;

  const currentTier = tiers.find(t => t.id === user.tier) || tiers[0] || { name: "Bronze", icon: "🔰" };
  const nextTier = (() => {
    const idx = tiers.findIndex(t => t.id === currentTier.id);
    return tiers[idx + 1] || null;
  })();
  const toNext = nextTier ? Math.max(0, nextTier.min - user.lifetime) : 0;

  const openRedeem = (item) => { setSelected(item); setModalOpen(true); };
  const closeRedeem = () => { setSelected(null); setModalOpen(false); };
  const onConfirmRedeem = async (id) => {
    try {
      await redeem(id);
      closeRedeem();
      alert("Voucher issued! Check 'Vouchers'.");
    } catch (err) {
      alert(err.message || "Redeem failed");
    }
  };

  // Avatar fallback: show photoURL if present, otherwise use initials SVG (data URL)
  const avatarSrc = user.photoURL || getInitialsAvatar(user.name || user.email || "U");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Profile + Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Profile Card */}
          <ProfileCard user={user} currentTier={currentTier} avatarSrc={avatarSrc} onOpenRef={() => setRefOpen(true)} />

          {/* Main Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl shadow-lg text-white p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-3">
                  <Crown className="w-6 h-6 -mt-0.5 text-yellow-300" />
                  Rewards Center
                </h1>
                <p className="text-sm opacity-90 mt-1 max-w-xl">
                  {currentTier.icon} <b>{currentTier.name}</b> Tier • Lifetime <b>{user.lifetime}</b> pts
                  {nextTier && <> • <span className="font-medium">{toNext}</span> pts to {nextTier.name}</>}
                </p>

                {nextTier && (
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full" style={{ background: "linear-gradient(90deg,#ffd166,#ffd166,#f6c84c)", width: `${Math.min(100, Math.round((user.lifetime / nextTier.min) * 100))}%` }} />
                    </div>
                    <div className="text-xs mt-2 opacity-90">Progress to {nextTier.name}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <button onClick={() => (canDailyCheckIn() ? dailyCheckIn() : alert("Come back tomorrow!"))} className={`px-4 py-2 rounded-lg font-semibold shadow-md text-sm ${canDailyCheckIn() ? "bg-yellow-400 text-emerald-900 hover:bg-yellow-300" : "bg-white/30 text-white opacity-80"}`}>
                  {canDailyCheckIn() ? "+5 Daily Check-in" : "Checked in"}
                </button>

                <div className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm font-semibold text-sm">
                  Balance: <span className="font-bold">{user.points} pts</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Missions */}
        <Section title="🎯 Missions">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions && missions.length > 0 ? missions.map(m => {
              const def = MISSION_DEF[m.id] || { name: m.id, desc: "", reward: 0, repeatable: "once" };
              const doneToday = m.lastDoneISO && new Date(m.lastDoneISO).toDateString() === new Date().toDateString();
              const completed = !!m.completed;
              const disabled = (def.repeatable === "once" && completed) || (def.repeatable === "daily" && doneToday);

              // Special: refer — show share button instead of "Complete"
              if (m.id === "refer") {
                return (
                  <motion.div key={m.id} whileHover={{ scale: 1.02 }} className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition">
                    <div className="font-semibold text-emerald-700">{def.name}</div>
                    <div className="text-sm text-gray-600 mt-2">{def.desc}</div>
                    <div className="text-sm mt-2 text-emerald-800">Reward: +{def.reward} pts</div>
                    <button onClick={() => setRefOpen(true)} className="mt-3 w-full py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700">
                      {completed ? "Refer Completed" : "Share & Invite"}
                    </button>
                    <div className="text-xs text-gray-500 mt-2">You'll get points when your friend completes their first order.</div>
                  </motion.div>
                );
              }

              return (
                <motion.div key={m.id} whileHover={{ scale: 1.02 }} className={`rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition ${disabled ? "opacity-60" : ""}`}>
                  <div className="font-semibold text-emerald-700">{def.name}</div>
                  <div className="text-sm text-gray-600 mt-2">{def.desc}</div>
                  <div className="text-sm mt-2 text-emerald-800">Reward: +{def.reward} pts</div>
                  <button disabled={disabled} onClick={() => completeMission(m.id)} className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold ${disabled ? "bg-gray-200 text-gray-500" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                    {disabled ? "Completed" : "Complete Mission"}
                  </button>
                </motion.div>
              );
            }) : <p className="text-sm text-gray-600">No missions available.</p>}
          </div>
        </Section>

        {/* Catalog */}
        <Section title="🎁 Rewards Catalog">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog && catalog.length ? catalog.map(item => {
              const can = user.points >= item.cost;
              return (
                <motion.div key={item.id} whileHover={{ scale: 1.02 }} className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md flex flex-col">
                  <div className="font-semibold text-emerald-700 flex items-center gap-2"><Gift className="w-5 h-5 text-yellow-500" /> {item.name}</div>
                  <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                  <div className="text-sm mt-3">Cost: <b>{item.cost}</b> pts</div>
                  {item.minSpend && <div className="text-xs text-gray-500">Min spend ₦{item.minSpend}</div>}
                  <button onClick={() => openRedeem(item)} disabled={!can} className={`mt-auto py-2 rounded-lg font-semibold text-sm ${can ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500"}`}>
                    Redeem
                  </button>
                </motion.div>
              );
            }) : <p className="text-sm text-gray-600">No catalog items.</p>}
          </div>
        </Section>

        {/* Vouchers */}
        <Section title="🎟️ Your Vouchers">
          {vouchers && vouchers.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vouchers.map(v => {
                const expired = new Date(v.expiresAtISO) < new Date();
                const statusColor = expired ? "bg-red-100 text-red-700" : v.redeemed ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-800";
                return (
                  <motion.div key={v.code} whileHover={{ scale: 1.02 }} className="rounded-2xl border p-5 bg-white shadow-sm relative">
                    <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${statusColor}`}>{v.redeemed ? "Used" : expired ? "Expired" : "Active"}</div>
                    <div className="font-semibold text-emerald-700">{v.name}</div>
                    <div className="text-sm text-gray-600">{voucherLabel(v)}</div>
                    <div className="text-xs text-gray-500 mt-2">Expires {formatDistanceToNow(new Date(v.expiresAtISO), { addSuffix: true })}</div>
                    <div className="text-xs font-mono mt-2 bg-gray-50 px-2 py-1 rounded">{v.code}</div>
                  </motion.div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-600">No vouchers yet.</p>}
        </Section>

        {/* Activity */}
        <Section title="📜 Activity Log">
          {txns && txns.length ? (
            <ul className="space-y-2">
              {txns.map(t => (
                <li key={t.id} className="rounded-xl border bg-white p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <div className="text-sm font-semibold text-emerald-800">{t.type === "earn" ? `+${t.amount}` : `-${t.amount}`} pts • {t.label}</div>
                    <div className="text-xs text-gray-500">{formatDistanceToNow(new Date(t.atISO), { addSuffix: true })}</div>
                  </div>
                  {t.meta?.code && <div className="text-[11px] font-mono bg-gray-100 px-2 py-1 rounded">{t.meta.code}</div>}
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-gray-600">No activity yet.</p>}
        </Section>
      </div>

      <RedeemModal open={modalOpen} item={selected} onClose={closeRedeem} onConfirm={onConfirmRedeem} canAfford={selected ? user.points >= selected.cost : false} />
      <ReferralModal open={refOpen} onClose={() => setRefOpen(false)} />
    </div>
  );
}

/* ---------- Small helpers & UI pieces ---------- */

function Section({ title, children }) {
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-emerald-800">{title}</h2>
      {children}
    </motion.section>
  );
}

function ProfileCard({ user, currentTier, avatarSrc, onOpenRef }) {
  const initials = (user.name || user.email || "U").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border shadow-sm p-5 flex items-center gap-4">
      <div className="relative">
        <img
          src={avatarSrc}
          alt={user.name || initials}
          className="w-16 h-16 rounded-full object-cover shadow-md"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = getInitialsAvatar(initials); }}
        />
        <div className="absolute -bottom-0.5 -right-1">
          <TierBadge tier={currentTier} />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <div className="text-left">
            <div className="text-lg font-semibold text-emerald-800">{user.name || "User"}</div>
            <div className="text-sm text-gray-500">{user.email || "—"}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Points</div>
            <div className="text-xl font-bold text-emerald-700">{user.points}</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Lifetime: <span className="font-semibold">{user.lifetime}</span> pts
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold">{user.lifetime < 220 ? 220 - user.lifetime : 0}</span> pts left
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={onOpenRef} className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm">Refer a friend</button>
        </div>
      </div>
    </motion.div>
  );
}

function TierBadge({ tier = { name: "Bronze", icon: "🔰" } }) {
  const name = (tier.name || "").toLowerCase();
  const color = name.includes("gold") ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : name.includes("silver") ? "bg-gradient-to-r from-gray-300 to-gray-400" : name.includes("platinum") ? "bg-gradient-to-r from-slate-200 to-slate-400" : "bg-gradient-to-r from-amber-500 to-amber-700";
  return (
    <div className={`rounded-full p-0.5 shadow-sm`} style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.06)" }}>
      <div className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide inline-flex items-center gap-2 ${color}`}>
        <span className="text-white">{tier.icon || "⭐"}</span>
        <span className="text-white capitalize">{tier.name}</span>
      </div>
    </div>
  );
}

// small utility: generate data-url svg avatar from initials
function getInitialsAvatar(name = "U") {
  const initials = name.split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'><rect width='100%' height='100%' fill='#10B981'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='52' font-family='Arial' fill='white'>${initials}</text></svg>`);
  return `data:image/svg+xml;utf8,${svg}`;
}

/* mission defs */
const MISSION_DEF = {
  daily: { id: "daily", name: "Daily Check-in", desc: "Come back every day", reward: 5, repeatable: "daily" },
  profile: { id: "profile", name: "Complete Profile", desc: "Add phone & address", reward: 20, repeatable: "once" },
  first: { id: "first", name: "Place First Order", desc: "Reserve any item", reward: 50, repeatable: "once" },
  refer: { id: "refer", name: "Refer a Friend", desc: "Invite a friend to sign up and order", reward: 100, repeatable: "once" },
};

function voucherLabel(v) {
  if (!v) return "Voucher";
  if (v.kind === "percent") return `-${v.discount || 10}% ${v.cap ? `₦${v.cap}` : ""}`;
  if (v.kind === "fixed") return `₦${v.discount || 0} off`;
  if (v.kind === "token") return "Free shipping";
  return "Voucher";
}
