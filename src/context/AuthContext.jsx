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
  const sendPhoneOTP = async (phoneE164) => {
    // ensure <div id="recaptcha-container" /> exists in the page
    const verifier = initRecaptcha("recaptcha-container", "invisible");
    return signInWithPhoneNumber(auth, phoneE164, verifier);
  };

  // Returns Firebase UserCredential (so caller can read .user)
  const confirmPhoneOTP = (confirmationResult, code) => {
    return confirmationResult.confirm(code);
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