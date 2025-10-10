// src/context/RewardsContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  getDocs,
  where,
} from "firebase/firestore";

const RewardsContext = createContext();

function makeReferralCode(uid) {
  const part = uid.slice(0, 6);
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${part}-${rnd}`;
}

export function RewardsProvider({ children }) {
  const [rawUser, setRawUser] = useState(null); // firebase auth user
  const [user, setUser] = useState(null);       // merged server user doc
  const [txns, setTxns] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [tiers, setTiers] = useState([]);

  const listenersRef = useRef([]);

  // On app load: capture referral param (if user clicked a share link)
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get("ref");
      if (ref) {
        localStorage.setItem("signup_ref", ref);
        // optionally remove query param from URL for neatness (not required)
        url.searchParams.delete("ref");
        window.history.replaceState({}, "", url.toString());
      }
    } catch (err) { /* ignore */ }
  }, []);

  // Auth state handling
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      // clear listeners if any
      listenersRef.current.forEach(u => u && u());
      listenersRef.current = [];

      if (!fbUser) {
        setRawUser(null);
        setUser(null);
        setTxns([]);
        setVouchers([]);
        setMissions([]);
        return;
      }

      setRawUser(fbUser);

      // Ensure a user doc exists and link referral if present in localStorage
      const userRef = doc(db, "users", fbUser.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        // Build base profile
        const newDoc = {
          uid: fbUser.uid,
          name: fbUser.displayName || "User",
          email: fbUser.email || "",
          photoURL: fbUser.photoURL || null,
          points: 0,
          lifetime: 0,
          tier: "bronze",
          createdAt: serverTimestamp(),
          lastCheckInISO: null,
          referralCode: makeReferralCode(fbUser.uid),
          referredBy: null,
          referralProcessed: false,
        };

        // If localStorage has a signup ref, map it to a real referrer uid (if exists)
        const signupRef = localStorage.getItem("signup_ref");
        if (signupRef) {
          // find user with that referralCode
          try {
            const q = query(collection(db, "users"), where("referralCode", "==", signupRef), );
            const found = await getDocs(q);
            if (!found.empty) {
              const refDoc = found.docs[0];
              newDoc.referredBy = refDoc.id;
            }
          } catch (err) {
            console.warn("ref lookup failed", err);
          }
        }

        await setDoc(userRef, newDoc);
      }

      // Realtime user doc listener
      const unsubUser = onSnapshot(userRef, s => {
        setUser({ id: s.id, ...(s.data() || {}) });
      });
      listenersRef.current.push(unsubUser);

      // Realtime transactions
      const txnQ = query(collection(db, "users", fbUser.uid, "transactions"), orderBy("createdAt", "desc"));
      const unsubTxns = onSnapshot(txnQ, snap => setTxns(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      listenersRef.current.push(unsubTxns);

      // Vouchers realtime
      const vQ = query(collection(db, "users", fbUser.uid, "vouchers"), orderBy("createdAt", "desc"));
      const unsubV = onSnapshot(vQ, snap => setVouchers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      listenersRef.current.push(unsubV);

      // Missions: read from user's missions subcollection if exists
      const mQ = query(collection(db, "users", fbUser.uid, "missions"));
      const unsubM = onSnapshot(mQ, snap => setMissions(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      listenersRef.current.push(unsubM);

      // load public config: catalog & tiers (admin-managed) - fallback if missing
      try {
        const catSnap = await getDocs(collection(db, "catalog"));
        if (!catSnap.empty) {
          setCatalog(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          // fallback
          setCatalog([
            { id: "v500", name: "₦500 Voucher", cost: 100, desc: "Discount on your next order", minSpend: 0, validDays: 7 },
            { id: "ship", name: "Free Shipping", cost: 200, desc: "Free shipping for next order", validDays: 7 },
          ]);
        }
      } catch (err) {
        setCatalog([
          { id: "v500", name: "₦500 Voucher", cost: 100, desc: "Discount on your next order", minSpend: 0, validDays: 7 },
          { id: "ship", name: "Free Shipping", cost: 200, desc: "Free shipping for next order", validDays: 7 },
        ]);
      }

      try {
        const tiersSnap = await getDocs(collection(db, "tiers"));
        if (!tiersSnap.empty) {
          setTiers(tiersSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setTiers([
            { id: "bronze", name: "Bronze", min: 0, icon: "🔰" },
            { id: "silver", name: "Silver", min: 100, icon: "🥈" },
            { id: "gold", name: "Gold", min: 250, icon: "🥇" },
            { id: "platinum", name: "Platinum", min: 500, icon: "💠" },
          ]);
        }
      } catch (err) {
        setTiers([
          { id: "bronze", name: "Bronze", min: 0, icon: "🔰" },
          { id: "silver", name: "Silver", min: 100, icon: "🥈" },
          { id: "gold", name: "Gold", min: 250, icon: "🥇" },
          { id: "platinum", name: "Platinum", min: 500, icon: "💠" },
        ]);
      }
    });

    return () => {
      unsubAuth();
      listenersRef.current.forEach(u => u && u());
      listenersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add a transaction record helper
  const addTransaction = useCallback(async (uid, label, amount, type = "earn", meta = {}) => {
    const txnRef = collection(db, "users", uid, "transactions");
    await addDoc(txnRef, {
      label,
      amount,
      type,
      meta,
      createdAt: serverTimestamp(),
      atISO: new Date().toISOString(),
    });
  }, []);

  // updatePoints with transaction safety
  const updatePoints = useCallback(async (uid, delta, label = "points update") => {
    const userRef = doc(db, "users", uid);
    await runTransaction(db, async (tx) => {
      const u = await tx.get(userRef);
      if (!u.exists()) throw new Error("User not found");
      const prev = u.data();
      const newPoints = (prev.points || 0) + delta;
      const newLifetime = (prev.lifetime || 0) + Math.max(0, delta);
      tx.update(userRef, { points: newPoints, lifetime: newLifetime });
      // add transaction doc
      const txRef = doc(collection(db, "users", uid, "transactions"));
      tx.set(txRef, {
        label,
        amount: delta,
        type: delta >= 0 ? "earn" : "spend",
        createdAt: serverTimestamp(),
        atISO: new Date().toISOString(),
      });
    });
  }, []);

  // Mission completion (respects once/daily)
  const completeMission = useCallback(async (missionId) => {
    if (!user?.id) throw new Error("Not signed in");
    const missionRef = doc(db, "users", user.id, "missions", missionId);

    // read mission def to decide behavior
    await runTransaction(db, async (tx) => {
      const mSnap = await tx.get(missionRef);
      const def = { // mirrored mission defs (should match your UI)
        daily: { repeatable: "daily", reward: 5 },
        profile: { repeatable: "once", reward: 20 },
        first: { repeatable: "once", reward: 50 },
        refer: { repeatable: "once", reward: 100 },
      }[missionId] || { repeatable: "once", reward: 0 };

      const nowISO = new Date().toISOString();

      if (def.repeatable === "once" && mSnap.exists() && mSnap.data().completed) {
        throw new Error("Mission already completed");
      }
      if (def.repeatable === "daily" && mSnap.exists()) {
        const last = mSnap.data().lastDoneISO;
        if (last) {
          const lastDate = new Date(last).toDateString();
          if (lastDate === new Date().toDateString()) {
            throw new Error("Already completed today");
          }
        }
      }

      // set mission doc
      tx.set(missionRef, { id: missionId, completed: true, lastDoneISO: nowISO }, { merge: true });
      // give reward to user
      const userRef = doc(db, "users", user.id);
      const userDoc = await tx.get(userRef);
      if (!userDoc.exists()) throw new Error("User missing");
      const prevPoints = userDoc.data().points || 0;
      const prevLifetime = userDoc.data().lifetime || 0;
      const newPoints = prevPoints + def.reward;
      const newLifetime = prevLifetime + Math.max(0, def.reward);
      tx.update(userRef, { points: newPoints, lifetime: newLifetime });

      // write transaction doc
      const txRef = doc(collection(db, "users", user.id, "transactions"));
      tx.set(txRef, {
        label: `Mission: ${missionId}`,
        amount: def.reward,
        type: "earn",
        createdAt: serverTimestamp(),
        atISO: new Date().toISOString(),
      });
    });
  }, [user]);

  // Daily check-in: transactional, safe against double-check
  const canDailyCheckIn = useCallback(() => {
    if (!user) return false;
    if (!user.lastCheckInISO) return true;
    const last = new Date(user.lastCheckInISO);
    return last.toDateString() !== new Date().toDateString();
  }, [user]);

  const dailyCheckIn = useCallback(async () => {
    if (!user?.id) throw new Error("Not signed in");
    const userRef = doc(db, "users", user.id);

    await runTransaction(db, async (tx) => {
      const uDoc = await tx.get(userRef);
      if (!uDoc.exists()) throw new Error("User missing");
      const prev = uDoc.data();
      const last = prev.lastCheckInISO ? new Date(prev.lastCheckInISO) : null;
      if (last && last.toDateString() === new Date().toDateString()) {
        throw new Error("Already checked in today");
      }
      const newPoints = (prev.points || 0) + 5;
      const newLifetime = (prev.lifetime || 0) + 5;
      tx.update(userRef, { points: newPoints, lifetime: newLifetime, lastCheckInISO: new Date().toISOString() });
      const txRef = doc(collection(db, "users", user.id, "transactions"));
      tx.set(txRef, { label: "Daily Check-in", amount: 5, type: "earn", createdAt: serverTimestamp(), atISO: new Date().toISOString() });
    });
  }, [user]);

  // Redeem catalog item (transactional)
  const redeem = useCallback(async (catalogId) => {
    if (!user?.id) throw new Error("Not signed in");
    const item = catalog.find(c => c.id === catalogId);
    if (!item) throw new Error("Item not found");

    await runTransaction(db, async (tx) => {
      const userRef = doc(db, "users", user.id);
      const uSnap = await tx.get(userRef);
      if (!uSnap.exists()) throw new Error("User missing");
      const points = uSnap.data().points || 0;
      if (points < item.cost) throw new Error("Insufficient points");
      // deduct
      tx.update(userRef, { points: points - item.cost });
      // add voucher
      const vRef = doc(collection(db, "users", user.id, "vouchers"));
      tx.set(vRef, {
        code: `VC-${Date.now().toString(36).toUpperCase()}`,
        name: item.name,
        kind: item.kind || "fixed",
        discount: item.discount || 0,
        minSpend: item.minSpend || null,
        createdAt: serverTimestamp(),
        expiresAtISO: new Date(Date.now() + (item.validDays || 7) * 86400000).toISOString(),
        redeemed: false,
        userId: user.id,
      });
      // tx entry
      const txRef = doc(collection(db, "users", user.id, "transactions"));
      tx.set(txRef, { label: `Redeem ${item.name}`, amount: -item.cost, type: "spend", createdAt: serverTimestamp(), atISO: new Date().toISOString() });
    });
  }, [user, catalog]);

  /**
   * registerOrder: to be called from your checkout/order completion process.
   * - Creates transaction for this user
   * - If this user was referred (user.referredBy) and referral hasn't been processed,
   *   then credit referrer and mark referral processed so it's one-time.
   *
   * @param {Object} order - { amount:number, label:string }
   */
  const registerOrder = useCallback(async (order = { amount: 0, label: "Order" }) => {
    if (!user?.id) throw new Error("Not signed in");
    await runTransaction(db, async (tx) => {
      const userRef = doc(db, "users", user.id);
      const uSnap = await tx.get(userRef);
      if (!uSnap.exists()) throw new Error("User missing");
      const u = uSnap.data();

      // write user's transaction
      const txRef = doc(collection(db, "users", user.id, "transactions"));
      tx.set(txRef, {
        label: order.label || "Order",
        amount: 0,
        type: "order",
        meta: { orderAmount: order.amount || 0 },
        createdAt: serverTimestamp(),
        atISO: new Date().toISOString(),
      });

      // If referred and not processed, credit the referrer (one-time)
      if (u.referredBy && !u.referralProcessed) {
        const refUid = u.referredBy;
        const refUserRef = doc(db, "users", refUid);
        const refSnap = await tx.get(refUserRef);
        if (refSnap.exists()) {
          // decide reward amount for referral success (example: 100 pts)
          const reward = 100;
          const prevPoints = refSnap.data().points || 0;
          const prevLifetime = refSnap.data().lifetime || 0;
          tx.update(refUserRef, { points: prevPoints + reward, lifetime: prevLifetime + reward });

          // mark referral as processed on the referred user's doc
          tx.update(userRef, { referralProcessed: true });

          // add referral record under referrer
          const refRecord = doc(collection(db, "users", refUid, "referrals"));
          tx.set(refRecord, {
            referredUid: user.id,
            atISO: new Date().toISOString(),
            createdAt: serverTimestamp(),
            award: reward,
            note: "Referral bonus for referred user's first order",
          });

          // add transaction for referrer
          const refTxn = doc(collection(db, "users", refUid, "transactions"));
          tx.set(refTxn, {
            label: `Referral bonus (${user.id})`,
            amount: reward,
            type: "earn",
            createdAt: serverTimestamp(),
            atISO: new Date().toISOString(),
          });

          // Optionally mark mission 'refer' completed for the referrer
          const refMissionRef = doc(db, "users", refUid, "missions", "refer");
          tx.set(refMissionRef, { id: "refer", completed: true, lastDoneISO: new Date().toISOString() }, { merge: true });
        }
      }
    });
  }, [user]);

  // auth helpers
  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  // Add a profile update helper using updateDoc
  const updateProfile = useCallback(async (updates = {}) => {
    if (!user?.id) throw new Error("Not signed in");
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, updates);
  }, [user]);

  // expose context value
  const value = {
    rawUser,
    user,
    txns,
    vouchers,
    missions,
    catalog,
    tiers,
    addTransaction,
    updatePoints,
    completeMission,
    canDailyCheckIn,
    dailyCheckIn,
    redeem,
    registerOrder,
    signInWithGoogle,
    signOutUser,
    updateProfile, // <-- now exposed and used
  };

  return <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>;
}

export const useRewards = () => useContext(RewardsContext);
