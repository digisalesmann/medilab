// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const cfg = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "medilab-fdd83.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "medilab-fdd83",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "medilab-fdd83.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "184090197925",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:184090197925:web:8c18468caa49a852bc724c",
};

if (!cfg.apiKey) {
  throw new Error(
    "[firebase] Missing REACT_APP_FIREBASE_API_KEY. " +
      "Create .env.local with REACT_APP_* vars and restart dev server."
  );
}

export const app = initializeApp(cfg);
export const db = getFirestore(app);

export const auth = getAuth(app);
auth.useDeviceLanguage?.();

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider("apple.com");

// --- reCAPTCHA (phone auth) ---
function ensureRecaptchaContainer(id = "recaptcha-container") {
  if (typeof document === "undefined") return id;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("div");
    el.id = id;
    el.style.display = "none";
    document.body.appendChild(el);
  }
  return id;
}

export function initRecaptcha(containerId = "recaptcha-container") {
  if (typeof window === "undefined") return null;
  if (window.recaptchaVerifier) return window.recaptchaVerifier;
  const id = ensureRecaptchaContainer(containerId);
  window.recaptchaVerifier = new RecaptchaVerifier(auth, id, {
    size: "invisible",
    callback: () => {},
    "expired-callback": () => {
      try { window.recaptchaVerifier?.clear?.(); } catch {}
      window.recaptchaVerifier = null;
    },
  });
  return window.recaptchaVerifier;
}

export async function sendPhoneOtp(phoneE164) {
  const verifier = initRecaptcha();
  if (!verifier) throw new Error("reCAPTCHA not available");
  if (!verifier.rendered) {
    try { await verifier.render(); }
    catch {
      try { window.recaptchaVerifier?.clear?.(); } catch {}
      window.recaptchaVerifier = null;
      const v2 = initRecaptcha();
      await v2.render();
    }
  }
  return signInWithPhoneNumber(auth, phoneE164, window.recaptchaVerifier);
}
export function confirmPhoneOtp(confirmationResult, code) {
  return confirmationResult.confirm(code);
}

export function signInWithGooglePopup() {
  return signInWithPopup(auth, googleProvider);
}
export function signInWithApplePopup() {
  return signInWithPopup(auth, appleProvider);
}
export { signOut };