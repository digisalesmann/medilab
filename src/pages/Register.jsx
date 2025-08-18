// src/pages/Register.jsx
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { BsPhone } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const {
    registerWithEmail,   // from AuthContext
    loginWithGoogle,
    loginWithApple,
    sendPhoneOTP,
    confirmPhoneOTP,
  } = useAuth();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // phone OTP state
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState(""); // +234...
  const [otp, setOtp] = useState("");
  const confirmationRef = useRef(null);

  // ui state
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const writeLocalUser = (userLike) => {
    // keep your older flow happy
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: userLike.email || "",
        uid: userLike.uid,
        name: userLike.displayName || name || "",
        phone: userLike.phoneNumber || "",
        points: 0,
        isAdmin: false, // signups aren't admins by default
      })
    );
  };

  // --- email/password sign up ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim()) return setErr("Please enter your full name.");
    if (!email.trim()) return setErr("Please enter a valid email.");
    if (pwd.length < 6) return setErr("Password should be at least 6 characters.");
    if (pwd !== confirmPwd) return setErr("Passwords do not match.");

    setLoading(true);
    try {
      const user = await registerWithEmail(email.trim(), pwd, name.trim()); // AuthContext updates profile name
      writeLocalUser(user);
      navigate("/");
    } catch (ex) {
      setErr(ex.message || "Could not create your account.");
    } finally {
      setLoading(false);
    }
  };

  // --- Google sign up ---
  const onGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const cred = await loginWithGoogle();
      writeLocalUser(cred.user);
      navigate("/");
    } catch (ex) {
      setErr(ex.message || "Google signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Apple sign up ---
  const onApple = async () => {
    setErr("");
    setLoading(true);
    try {
      const cred = await loginWithApple();
      if (cred?.user) {
        writeLocalUser(cred.user);
        navigate("/");
      }
    } catch (ex) {
      setErr(ex.message || "Apple signup failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Phone OTP sign up ---
  const onSendOTP = async () => {
    setErr("");
    if (!phone.trim().startsWith("+")) {
      return setErr("Use E.164 format, e.g. +2348012345678");
    }
    setLoading(true);
    try {
      const confirmation = await sendPhoneOTP(phone.trim());
      confirmationRef.current = confirmation; // move to code step
    } catch (ex) {
      setErr(ex.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async () => {
    setErr("");
    if (otp.trim().length < 6) return setErr("Enter the 6‑digit code.");
    setLoading(true);
    try {
      const cred = await confirmPhoneOTP(confirmationRef.current, otp.trim());
      // phone users may have no email/displayName yet
      writeLocalUser({
        uid: cred.user.uid,
        email: cred.user.email || "",
        phoneNumber: cred.user.phoneNumber || phone,
        displayName: cred.user.displayName || name,
      });
      navigate("/");
    } catch (ex) {
      setErr(ex.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-4 py-8">
      {/* Invisible recaptcha host for Phone Auth */}
      <div id="recaptcha-container" className="hidden" />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600">MediLab</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Create your account</p>
        </div>

        {/* Error */}
        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {err}
          </div>
        )}

        {/* Registration Form */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-left text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Victor Chinagoro"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Create a secure password"
              autoComplete="new-password"
              required
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Use at least 6 characters (mix letters & numbers for better security).
            </p>
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Re‑enter your password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <span className="bg-white px-2 relative z-10">or sign up with</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
        </div>

        {/* Third-party Options */}
        <div className="space-y-3">
          <button
            onClick={onGoogle}
            disabled={loading}
            className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FcGoogle size={22} className="mr-2" />
            Sign up with Google
          </button>

          <button
            onClick={onApple}
            disabled={loading}
            className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FaApple size={22} className="mr-2 text-black" />
            Sign up with Apple
          </button>

          {/* Phone OTP */}
          <div className="w-full">
            <button
              onClick={() => {
                setPhoneOpen((s) => !s);
                setErr("");
              }}
              type="button"
              className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition"
            >
              <BsPhone size={20} className="mr-2 text-gray-700" />
              {phoneOpen ? "Hide Phone OTP" : "Sign up with Phone OTP"}
            </button>

            {phoneOpen && (
              <div className="mt-3 space-y-3 border rounded-md p-3">
                {!confirmationRef.current ? (
                  <>
                    <div>
                      <label className="block text-left text-xs font-medium mb-1 text-gray-600">
                        Phone (E.164 format)
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+2348012345678"
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <button
                      onClick={onSendOTP}
                      disabled={loading || !phone}
                      className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      {loading ? "Sending…" : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-left text-xs font-medium mb-1 text-gray-600">
                        Enter 6‑digit code
                      </label>
                      <input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest"
                      />
                    </div>
                    <button
                      onClick={onVerifyOTP}
                      disabled={loading || otp.length < 6}
                      className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
                    >
                      {loading ? "Verifying…" : "Verify & Create Account"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Link to Login */}
        <p className="text-xs text-center mt-4 text-gray-600">
          Already have an account?
          <Link to="/login" className="text-emerald-600 hover:underline ml-1">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;