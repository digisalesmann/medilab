import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // TODO: backend API call here
      await new Promise((r) => setTimeout(r, 1500));
      setMessage(
        'If this email exists in our system, a password reset link has been sent. Please check your inbox.'
      );
    } catch {
      setError('Failed to send password reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 via-blue-50 to-white px-4">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-emerald-700">MediLab</h1>
        <p className="mt-2 text-gray-700 max-w-md mx-auto">
          Securely recover your password to access your MediLab account.
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Forgot Password
        </h2>

        {message && <p className="mb-5 text-green-700 text-center">{message}</p>}
        {error && <p className="mb-5 text-red-600 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <label htmlFor="email" className="block font-medium text-gray-800">
            Enter your registered email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded-md px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} MediLab. All rights reserved.
      </footer>
    </div>
  );
};

export default ForgotPassword;
