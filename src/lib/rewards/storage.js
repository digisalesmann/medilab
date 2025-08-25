// Versioned, safe localStorage helpers for rewards
const NS = "rewards";
const VERSION = "v2";

const keys = {
  user: `${NS}:${VERSION}:user`,             // { points, lifetime, tier, streak, lastCheckInISO }
  txns: `${NS}:${VERSION}:transactions`,     // [{id,type,amount,label,meta,atISO}]
  vouchers: `${NS}:${VERSION}:vouchers`,     // [{code,name,discount,kind,minSpend,expiresAtISO,redeemed}]
  catalog: `${NS}:${VERSION}:catalog`,       // cache for catalog config
  missions: `${NS}:${VERSION}:missions`,     // user mission state
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function write(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export const storage = {
  keys,
  read,
  write,
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  },
};