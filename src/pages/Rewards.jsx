import React, { useMemo, useState } from "react";
import { useRewards } from "../context/RewardsContext";
import RedeemModal from "../components/rewards/RedeemModal";
import { formatDistanceToNow } from "date-fns";

export default function Rewards() {
  const {
    user, txns, vouchers, missions, catalog, tiers,
    dailyCheckIn, canDailyCheckIn, completeMission, redeem,
  } = useRewards();

  const currentTier = tiers.find(t => t.id === user.tier) || tiers[0];
  const nextTier = useMemo(() => {
    const idx = tiers.findIndex(t => t.id === currentTier.id);
    return tiers[idx + 1] || null;
  }, [tiers, currentTier]);

  const toNext = nextTier ? Math.max(0, nextTier.min - user.lifetime) : 0;

  // modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openRedeem = (item) => { setSelected(item); setModalOpen(true); };
  const closeRedeem = () => { setSelected(null); setModalOpen(false); };
  const onConfirmRedeem = (id) => { redeem(id); closeRedeem(); alert("Voucher issued! Check the 'Vouchers' section."); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-emerald-700">Rewards & Vouchers</h1>
              <p className="text-sm text-gray-600">
                {currentTier.icon} <b>{currentTier.name}</b> Member • Lifetime: {user.lifetime} pts
                {nextTier && <> • {toNext} pts to <b>{nextTier.name}</b></>}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => (canDailyCheckIn() ? dailyCheckIn() : alert("Come back tomorrow for check-in!"))}
                className={`px-4 py-2 rounded-lg font-semibold ${canDailyCheckIn() ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500"}`}
              >
                {canDailyCheckIn() ? "Daily Check-in +5" : "Checked in today"}
              </button>
              <div className="px-4 py-2 rounded-lg border bg-white">
                Balance: <b>{user.points} pts</b>
              </div>
            </div>
          </div>
        </header>

        {/* Missions */}
        <section className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Missions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {missions.map(m => {
              const def = MISSION_DEF[m.id];
              const doneToday = m.lastDoneISO && new Date(m.lastDoneISO).toDateString() === new Date().toDateString();
              const disabled =
                (def.repeatable === "once" && m.completed) ||
                (def.repeatable === "daily" && doneToday);

              return (
                <div key={m.id} className="rounded-xl border p-4">
                  <div className="font-semibold">{def.name}</div>
                  <div className="text-sm text-gray-600">{def.desc}</div>
                  <div className="text-sm mt-1">Reward: <b>+{def.reward}</b> pts</div>
                  <button
                    disabled={disabled}
                    onClick={() => completeMission(m.id)}
                    className={`mt-3 h-10 px-3 rounded-lg text-sm font-semibold ${disabled ? "bg-gray-200 text-gray-500" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                  >
                    {disabled ? "Completed" : "Complete"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Catalog */}
        <section className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Rewards Catalog</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {catalog.map(item => {
              const can = user.points >= item.cost;
              return (
                <div key={item.id} className="rounded-xl border p-4 flex flex-col">
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                  <div className="text-sm mt-2">Cost: <b>{item.cost}</b> pts</div>
                  {item.minSpend ? <div className="text-xs text-gray-500">Min spend ₦{item.minSpend.toLocaleString()}</div> : null}
                  <button
                    onClick={() => openRedeem(item)}
                    disabled={!can}
                    className={`mt-auto h-10 rounded-lg text-sm font-semibold ${can ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-200 text-gray-500"}`}
                  >
                    Redeem
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vouchers */}
        <section className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Your Vouchers</h2>
          {vouchers.length === 0 ? (
            <p className="text-sm text-gray-600">No vouchers yet. Redeem from the catalog above.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vouchers.map(v => {
                const expired = new Date(v.expiresAtISO) < new Date();
                return (
                  <div key={v.code} className={`rounded-xl border p-4 ${expired ? "opacity-60" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{v.name}</div>
                        <div className="text-sm text-gray-600">{voucherLabel(v)}</div>
                      </div>
                      <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{v.code}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Expires {formatDistanceToNow(new Date(v.expiresAtISO), { addSuffix: true })}
                      {v.minSpend ? <> • Min spend ₦{v.minSpend.toLocaleString()}</> : null}
                    </div>
                    <div className="mt-3 text-xs">
                      Status:{" "}
                      <span className={`font-semibold ${v.redeemed ? "text-emerald-700" : expired ? "text-red-600" : "text-gray-700"}`}>
                        {v.redeemed ? "Used" : expired ? "Expired" : "Active"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Activity */}
        <section className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          {txns.length === 0 ? (
            <p className="text-sm text-gray-600">No activity yet.</p>
          ) : (
            <ul className="space-y-2">
              {txns.map(t => (
                <li key={t.id} className="rounded-xl border p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">
                      {t.type === "earn" ? `+${t.amount}` : `-${t.amount}`} pts • {t.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(t.atISO), { addSuffix: true })}
                    </div>
                  </div>
                  {t.meta?.code ? (
                    <div className="text-[11px] font-mono bg-gray-100 px-2 py-1 rounded">{t.meta.code}</div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Redeem modal */}
      <RedeemModal
        open={modalOpen}
        item={selected}
        onClose={closeRedeem}
        onConfirm={onConfirmRedeem}
        canAfford={selected ? user.points >= selected.cost : false}
      />
    </div>
  );
}

const MISSION_DEF = {
  daily:   { id: "daily",   name: "Daily Check-in",    desc: "Come back every day",         reward: 5,  repeatable: "daily" },
  profile: { id: "profile", name: "Complete Profile",  desc: "Add phone & address",         reward: 20, repeatable: "once"  },
  first:   { id: "first",   name: "Place First Order", desc: "Reserve any item",             reward: 50, repeatable: "once"  },
  refer:   { id: "refer",   name: "Refer a Friend",    desc: "Friend places an order",       reward: 100,repeatable: "multi" },
};

function voucherLabel(v) {
  if (v.kind === "percent") return `-10% ${v.cap ? `₦${v.cap.toLocaleString()}` : ""}`;
  if (v.kind === "fixed")   return `-₦${Number(v.discount||0).toLocaleString()}`;
  if (v.kind === "token")   return "Free shipping token";
  return "Voucher";
}