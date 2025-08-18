import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut as fbSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithRedirect,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, googleProvider, appleProvider, initRecaptcha } from "../lib/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  // ---- Email/Password ----
  const registerWithEmail = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(cred.user, { displayName });
    return cred.user;
  };

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // ---- Google ----
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

  // ---- Apple (popup on desktop, redirect on iOS) ----
  const loginWithApple = () => {
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const forceRedirect =
      process.env.REACT_APP_USE_REDIRECT_FOR_APPLE === "true";
    return isIOS || forceRedirect
      ? signInWithRedirect(auth, appleProvider)
      : signInWithPopup(auth, appleProvider);
  };

  // ---- Phone OTP ----
  // Returns Firebase ConfirmationResult
 // AuthContext.jsx (inside the component scope)

const sendPhoneOTP = async (phoneE164) => {
  // Always make sure the container exists globally (index.html) and is visible enough (not display:none)
  // Our initRecaptcha creates/reuses a single invisible verifier tied to #recaptcha-container
  const verifier = initRecaptcha("recaptcha-container"); // size handled inside as "invisible"
  if (!verifier) throw new Error("reCAPTCHA is not available.");

  // Render if not rendered yet (some SDK versions require explicit render())
  if (!verifier.rendered) {
    try {
      await verifier.render();
    } catch (e) {
      // If the instance got into a bad state, nuke and recreate once
      try { window.recaptchaVerifier?.clear?.(); } catch {}
      window.recaptchaVerifier = null;
      const v2 = initRecaptcha("recaptcha-container");
      await v2.render();
    }
  }

  // E.164 very light sanity check (optional)
  if (!/^\+[\d]{7,15}$/.test(phoneE164)) {
    throw new Error("Enter a valid phone number in international format (e.g. +2348012345678).");
  }

  // Return the confirmationResult; store it in a ref on the calling component
  return signInWithPhoneNumber(auth, phoneE164, window.recaptchaVerifier);
};

const confirmPhoneOTP = async (confirmationResult, code) => {
  if (!confirmationResult) {
    throw new Error("No pending verification. Please send the OTP again.");
  }
  const pin = String(code || "").trim();
  if (pin.length < 6) {
    throw new Error("Enter the 6‑digit verification code.");
  }

  try {
    // Returns a full UserCredential (use .user)
    return await confirmationResult.confirm(pin);
  } catch (e) {
    // If the verifier expired, clear it so the next send recreates it
    const msg = (e && e.message) || "";
    if (/expired|timeout|recaptcha/i.test(msg)) {
      try { window.recaptchaVerifier?.clear?.(); } catch {}
      window.recaptchaVerifier = null;
    }
    throw e;
  }
};

  const logout = () => fbSignOut(auth);

  const value = {
    user,
    initializing,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    sendPhoneOTP,
    confirmPhoneOTP, // 👈 make sure this exact name is exported
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!initializing && children}
    </AuthContext.Provider>
  );
}