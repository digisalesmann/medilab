import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { BsPhone } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "admin@medilab.com"; // keep your admin gate here

const Login = () => {
  const navigate = useNavigate();

  // Auth context functions (from the setup I shared)
  const {
    loginWithEmail,
    loginWithGoogle,
    loginWithApple,
    sendPhoneOTP,
    confirmPhoneOTP,
  } = useAuth();

  // UI state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Phone OTP state
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phone, setPhone] = useState(""); // E.164 format (+234...)
  const [otp, setOtp] = useState("");
  const confirmationRef = useRef(null);

  // --- Email/password login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const cred = await loginWithEmail(email.trim(), password);
      const user = cred.user;

      // Back-compat with your previous localStorage usage:
      const isAdmin = (user.email || "").toLowerCase() === ADMIN_EMAIL;
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: user.email,
          isAdmin,
          points: 0,
          uid: user.uid,
          name: user.displayName || "",
        })
      );

      navigate(isAdmin ? "/admin" : "/");
    } catch (ex) {
      setErr(ex.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  // --- Google ---
  const onGoogle = async () => {
    setErr("");
    setLoading(true);
    try {
      const cred = await loginWithGoogle();
      const user = cred.user;
      const isAdmin = (user.email || "").toLowerCase() === ADMIN_EMAIL;

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: user.email,
          isAdmin,
          points: 0,
          uid: user.uid,
          name: user.displayName || "",
        })
      );

      navigate(isAdmin ? "/admin" : "/");
    } catch (ex) {
      setErr(ex.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Apple ---
  const onApple = async () => {
    setErr("");
    setLoading(true);
    try {
      const cred = await loginWithApple();
      // When using signInWithRedirect on iOS, control returns after full page reload.
      // If using popup, we get here:
      if (cred?.user) {
        const user = cred.user;
        const isAdmin = (user.email || "").toLowerCase() === ADMIN_EMAIL;
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            isAdmin,
            points: 0,
            uid: user.uid,
            name: user.displayName || "",
          })
        );
        navigate(isAdmin ? "/admin" : "/");
      }
    } catch (ex) {
      // If it was a redirect flow, Firebase will complete sign-in on page load.
      // Show only real errors here:
      setErr(ex.message || "Apple sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Phone OTP ---
  const onPhoneClick = () => {
    setPhoneOpen((s) => !s);
    setErr("");
  };

  const onSendOTP = async () => {
    setErr("");
    setLoading(true);
    try {
      const confirmation = await sendPhoneOTP(phone.trim());
      confirmationRef.current = confirmation;
    } catch (ex) {
      setErr(ex.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async () => {
    setErr("");
    setLoading(true);
    try {
      const cred = await confirmPhoneOTP(confirmationRef.current, otp.trim());
      const user = cred.user;
      const isAdmin = (user.email || "").toLowerCase() === ADMIN_EMAIL;

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: user.email || "",
          isAdmin,
          points: 0,
          uid: user.uid,
          phone: user.phoneNumber || phone,
          name: user.displayName || "",
        })
      );

      navigate(isAdmin ? "/admin" : "/");
    } catch (ex) {
      setErr(ex.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-4 py-8">
      {/* Invisible reCAPTCHA target for phone auth */}
      <div id="recaptcha-container" className="hidden" />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600">MediLab</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back. Sign in to continue</p>
        </div>

        {/* Error banner */}
        {err && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {err}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <label className="block text-left text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-emerald-600 focus:outline-none"
                >
                  {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-emerald-600" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-emerald-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <span className="bg-white px-2 relative z-10">or sign in with</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
        </div>

        {/* Third-party Auth Options */}
        <div className="space-y-3">
          <button
            onClick={onGoogle}
            disabled={loading}
            className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FcGoogle size={22} className="mr-2" />
            Continue with Google
          </button>

          <button
            onClick={onApple}
            disabled={loading}
            className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <FaApple size={22} className="mr-2 text-black" />
            Continue with Apple
          </button>

          {/* Phone OTP toggle + flow */}
          <div className="w-full">
            <button
              onClick={onPhoneClick}
              type="button"
              className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition"
            >
              <BsPhone size={20} className="mr-2 text-gray-700" />
              {phoneOpen ? "Use Email/Password" : "Continue with Phone OTP"}
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
                      {loading ? "Verifying…" : "Verify & Sign In"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Register Link */}
        <p className="text-xs text-center mt-4 text-gray-600">
          Don’t have an account?
          <Link to="/register" className="text-emerald-600 hover:underline ml-1">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;