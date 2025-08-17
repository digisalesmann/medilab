// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut as fbSignOut,
} from "firebase/auth";
// import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics"; // optional

// --- Your Firebase web config (copy from Firebase Console > Project settings > Your apps > Config)
const firebaseConfig = {
  apiKey: "AIzaSyCsEmIz9AATwOfIa-P_0FMsGBsKZi6GSLA",
  authDomain: "medilab-fdd83.firebaseapp.com",
  projectId: "medilab-fdd83",
  storageBucket: "medilab-fdd83.appspot.com", // ✅ correct pattern
  messagingSenderId: "184090197925",
  appId: "1:184090197925:web:8c18468caa49a852bc724c",
  measurementId: "G-K70W8PGW26",
};

// --- Initialize (guard against re-initializing during HMR)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// --- Auth
export const auth = getAuth(app);
auth.useDeviceLanguage(); // localize Auth UI & SMS

// --- Providers
export const googleProvider = new GoogleAuthProvider();

export const appleProvider = new OAuthProvider("apple.com");
// You may request additional scopes:
appleProvider.addScope("email");
appleProvider.addScope("name");

// --- Helper: Google popup sign-in
export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

// --- Helper: Apple popup sign-in (needs Apple setup in Firebase Console)
export async function signInWithApplePopup() {
  return await signInWithPopup(auth, appleProvider);
}

// --- Helpers: Phone OTP
// Place a <div id="recaptcha-container" /> on the page OR keep invisible (default)
export function initRecaptcha(containerId = "recaptcha-container", size = "invisible") {
  if (typeof window === "undefined") return null;

  // Re-use if already created
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size, // "invisible" or "normal"
    });
  }
  return window.recaptchaVerifier;
}

export async function sendPhoneOtp(phoneE164, containerId = "recaptcha-container") {
  // phoneE164 example: "+2348012345678"
  const verifier = initRecaptcha(containerId, "invisible");
  return await signInWithPhoneNumber(auth, phoneE164, verifier);
}

// The confirm result you get from sendPhoneOtp().confirm(code) completes sign-in.
// Example:
// const confirmation = await sendPhoneOtp("+2348012345678");
// const cred = await confirmation.confirm("123456");

// --- Sign out
export async function signOut() {
  return await fbSignOut(auth);
}

// --- (Optional) Analytics — enable only if you switched on Analytics in Firebase Console
// let analytics;
// try {
//   if (typeof window !== "undefined" && (await analyticsSupported())) {
//     analytics = getAnalytics(app);
//   }
// } catch (e) {
//   // analytics not supported or not enabled — safe to ignore
// }
// export { analytics };