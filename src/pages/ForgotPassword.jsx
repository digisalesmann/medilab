import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  RiMailLine,
  RiSendPlaneLine,
  RiArrowLeftLine,
  RiCheckboxCircleLine, // <-- CORRECTED ICON NAME
  RiAlertLine,
  RiLoader4Line,
} from 'react-icons/ri';

// Simple email validation helper
const isValidEmail = (email) => {
  // Basic regex for email format
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: 'initial', message: '' }); // type: 'initial' | 'success' | 'error'
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setStatus({ type: 'initial', message: '' });

    if (!isValidEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }
    
    setLoading(true);

    try {
      // **TODO:** Replace this with your actual Firebase/Backend API call (e.g., sendPasswordResetEmail)
      console.log(`Attempting to send reset link to: ${email}`);
      
      // Simulated API delay
      await new Promise((r) => setTimeout(r, 2000));

      // Use the standard secure message for security best practices
      setStatus({
        type: 'success',
        message:
          'A password reset link has been sent to your email address (if it exists in our system). Please check your spam folder if you don\'t see it.',
      });
    } catch (err) {
      // In a real application, you might handle specific error codes here.
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.',
      });
      console.error('Password reset failed:', err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Conditional rendering for the success state
  if (status.type === 'success') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10 text-center border-t-4 border-emerald-500">
          <RiCheckboxCircleLine className="text-6xl text-emerald-500 mx-auto mb-6 animate-pulse" /> {/* <-- CORRECTED USAGE */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-8">{status.message}</p>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-md"
          >
            <RiArrowLeftLine /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  // Initial/Error form view
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 px-4 py-16">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-emerald-700 leading-tight">MediLab</h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto">
          Enter your email to receive a secure link to reset your password.
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 transition-all duration-300">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Trouble Logging In?
        </h2>

        {/* Dynamic Status Message */}
        {status.type === 'error' && (
          <div className="flex items-center gap-2 bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            <RiAlertLine className="text-xl flex-shrink-0" />
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Registered Email Address
            </label>
            <div className="relative">
              <RiMailLine className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                id="email"
                type="email"
                placeholder="e.g., patient@medilab.com"
                className="w-full border border-gray-300 rounded-xl px-12 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-150 disabled:bg-gray-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin text-xl" /> Sending...
              </>
            ) : (
              <>
                <RiSendPlaneLine className="text-xl" /> Send Reset Link
              </>
            )}
          </button>
        </form>
      </div>

      {/* Back to Login Link */}
      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-800 transition"
        >
          <RiArrowLeftLine className="mr-1" /> Remember your password? Go back to Login
        </Link>
      </div>
      
      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MediLab. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPassword;