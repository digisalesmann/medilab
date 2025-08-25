import { storage } from "./storage";

// ----------- Config (can come from API later) -----------
const TIERS = [
  { id: "bronze",   name: "Bronze",   min: 0,    icon: "🥉" },
  { id: "silver",   name: "Silver",   min: 200,  icon: "🥈" },
  { id: "gold",     name: "Gold",     min: 600,  icon: "🥇" },
  { id: "platinum", name: "Platinum", min: 1500, icon: "💎" },
];

const CATALOG = [
  { id: "fs-1",  name: "Free Shipping Token", cost: 80,  desc: "Covers standard delivery once.", kind: "token" },
  { id: "d10-1", name: "10% Site Discount",   cost: 120, desc: "10% off next order (max ₦2,000).", kind: "percent", cap: 2000 },
  { id: "v500",  name: "₦500 Voucher",        cost: 150, desc: "Applies to cart ≥ ₦4,000.", kind: "fixed",  minSpend: 4000 },
  { id: "v1500", name: "₦1,500 Voucher",      cost: 320, desc: "Applies to cart ≥ ₦10,000.", kind: "fixed", minSpend: 10000 },
];

const MISSIONS = [
  { id: "daily",  name: "Daily Check-in", desc: "Come back every day",     reward: 5,  repeatable: "daily" },
  { id: "profile",name: "Complete Profile", desc: "Add phone & address",   reward: 20, repeatable: "once"  },
  { id: "first",  name: "Place First Order", desc: "Reserve any item",     reward: 50, repeatable: "once"  },
  { id: "refer",  name: "Refer a Friend", desc: "Friend places an order",  reward: 100, repeatable: "multi"},
];

const EXPIRY_DAYS = 30;

// ----------- Utils -----------
const uuid = () => (crypto?.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random()}`);
const nowISO = () => new Date().toISOString();
const daysFromNowISO = (d) => new Date(Date.now() + d * 864e5).toISOString();

function tierFor(lifetime) {
  let current = TIERS[0];
  for (const t of TIERS) if (lifetime >= t.min) current = t;
  return current;
}

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function isSameDay(aISO, bISO) {
  if (!aISO || !bISO) return false;
  return aISO.slice(0,10) === bISO.slice(0,10);
}

function isYesterday(lastISO) {
  if (!lastISO) return false;
  const y = new Date(); y.setDate(y.getDate()-1);
  return isSameDay(lastISO, y.toISOString());
}

// ----------- Boot (idempotent) -----------
function boot() {
  const user = storage.read(storage.keys.user, null);
  if (!user) {
    const init = {
      points: 0,
      lifetime: 0,
      tier: "bronze",
      streak: 0,
      lastCheckInISO: "",
    };
    storage.write(storage.keys.user, init);
  }
  if (!storage.read(storage.keys.txns, null)) storage.write(storage.keys.txns, []);
  if (!storage.read(storage.keys.vouchers, null)) storage.write(storage.keys.vouchers, []);
  if (!storage.read(storage.keys.catalog, null)) storage.write(storage.keys.catalog, CATALOG);
  if (!storage.read(storage.keys.missions, null)) {
    const state = MISSIONS.map(m => ({ id: m.id, completed: false, times: 0, lastDoneISO: "" }));
    storage.write(storage.keys.missions, state);
  }
}
boot();

// ----------- Service API -----------
export const rewardsService = {
  // state getters
  getUser()        { return storage.read(storage.keys.user, {}); },
  getTxns()        { return storage.read(storage.keys.txns, []); },
  getVouchers()    { return storage.read(storage.keys.vouchers, []); },
  getCatalog()     { return storage.read(storage.keys.catalog, CATALOG); },
  getMissions()    { return storage.read(storage.keys.missions, []); },
  getTiers()       { return TIERS; },

  // earn
  earn(amount, label, meta = {}) {
    const amt = Math.max(0, Number(amount||0));
    if (!amt) return this.getUser();

    const u = this.getUser();
    u.points   += amt;
    u.lifetime += amt;
    u.tier      = tierFor(u.lifetime).id;
    storage.write(storage.keys.user, u);

    const txns = this.getTxns();
    txns.unshift({ id: uuid(), type: "earn", amount: amt, label: label||"Earn", meta, atISO: nowISO() });
    storage.write(storage.keys.txns, txns);
    return u;
  },

  // redeem -> returns voucher object (with code)
  redeem(catalogId) {
    const item = this.getCatalog().find(c => c.id === catalogId);
    if (!item) throw new Error("Item not found");

    const u = this.getUser();
    if (u.points < item.cost) throw new Error("Not enough points");

    u.points -= item.cost;
    storage.write(storage.keys.user, u);

    const code = `RWD-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
    const voucher = {
      code,
      name: item.name,
      kind: item.kind,       // token|percent|fixed
      discount: item.kind === "percent" ? 10 : item.kind === "fixed" ? (item.id === "v1500" ? 1500 : 500) : 0,
      cap: item.cap || null,
      minSpend: item.minSpend || 0,
      createdAtISO: nowISO(),
      expiresAtISO: daysFromNowISO(EXPIRY_DAYS),
      redeemed: false,
    };

    const vouchers = this.getVouchers();
    vouchers.unshift(voucher);
    storage.write(storage.keys.vouchers, vouchers);

    const txns = this.getTxns();
    txns.unshift({ id: uuid(), type: "redeem", amount: item.cost, label: item.name, meta: { code }, atISO: nowISO() });
    storage.write(storage.keys.txns, txns);

    return voucher;
  },

  markVoucherUsed(code) {
    const vouchers = this.getVouchers();
    const v = vouchers.find(x => x.code === code);
    if (!v) throw new Error("Voucher not found");
    v.redeemed = true;
    storage.write(storage.keys.vouchers, vouchers);
    return v;
  },

  // missions + streak
  canDailyCheckIn() {
    const u = this.getUser();
    return !isSameDay(u.lastCheckInISO, nowISO());
  },

  dailyCheckIn() {
    const u = this.getUser();

    // streak math
    if (isYesterday(u.lastCheckInISO)) {
      u.streak = (u.streak || 0) + 1;
    } else if (!isSameDay(u.lastCheckInISO, nowISO())) {
      u.streak = 1; // reset
    }
    u.lastCheckInISO = nowISO();
    storage.write(storage.keys.user, u);

    const base = 5;
    const streakBonus = Math.min(5, Math.floor(u.streak / 3)); // +1 every 3 days, up to +5
    return this.earn(base + streakBonus, "Daily check-in", { streak: u.streak, bonus: streakBonus });
  },

  completeMission(id) {
    const ms = this.getMissions();
    const m  = ms.find(x => x.id === id);
    const def = MISSIONS.find(x => x.id === id);
    if (!m || !def) return this.getUser();

    // gating
    const today = todayKey();
    const last  = m.lastDoneISO ? todayKey(new Date(m.lastDoneISO)) : "";
    const isDaily = def.repeatable === "daily";

    if (def.repeatable === "once" && m.completed) return this.getUser();
    if (isDaily && last === today) return this.getUser();

    m.completed = def.repeatable === "once" ? true : m.completed;
    m.times = (m.times || 0) + 1;
    m.lastDoneISO = nowISO();
    storage.write(storage.keys.missions, ms);

    return this.earn(def.reward, def.name, { missionId: id });
  },
};