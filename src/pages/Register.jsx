import React from "react";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { BsPhone } from "react-icons/bs";

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-4 py-8">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-600">MediLab</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Create your account</p>
        </div>

        {/* Registration Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-left text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Victor Chinagoro"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Create a secure password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-md font-semibold hover:bg-emerald-700 transition"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center text-sm text-gray-500">
          <span className="bg-white px-2 relative z-10">or sign up with</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 z-0"></div>
        </div>

        {/* Third-party Options */}
        <div className="space-y-3">
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <FcGoogle size={22} className="mr-2" />
            Sign up with Google
          </button>
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <FaApple size={22} className="mr-2 text-black" />
            Sign up with Apple
          </button>
          <button className="flex items-center justify-center w-full border rounded-md py-2 font-medium hover:bg-gray-50 transition">
            <BsPhone size={20} className="mr-2 text-gray-700" />
            Sign up with Phone OTP
          </button>
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
