import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { BsPhone } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
  e.preventDefault();

  const isAdmin = email === "admin@medilab.com" && password === "4Sx4#AC9y4Mka*y";

  const user = {
    email,
    isAdmin,
    points: 0,
  };

  localStorage.setItem("currentUser", JSON.stringify(user));

  if (isAdmin) {
    navigate("/admin");
  } else {
    navigate("/");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600">MediLab</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back. Sign in to continue</p>
        </div>

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
            <Link to="/forgot-password" className="text-emerald-600 hover:underline">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <span className="bg-white px-2 relative z-10">or sign in with</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
        </div>

        {/* Third-party Auth Options */}
        <div className="space-y-3">
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <FcGoogle size={22} className="mr-2" />
            Continue with Google
          </button>
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <FaApple size={22} className="mr-2 text-black" />
            Continue with Apple
          </button>
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <BsPhone size={20} className="mr-2 text-gray-700" />
            Continue with Phone OTP
          </button>
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
