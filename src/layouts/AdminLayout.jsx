// src/layouts/AdminLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b">
        <h1 className="text-xl font-bold text-emerald-700">MediLab Admin</h1>
        <div className="space-x-6">
          <Link to="/admin/dashboard" className="text-emerald-600 hover:underline font-medium">
            Dashboard
          </Link>
          <Link to="/admin/panel" className="text-emerald-600 hover:underline font-medium">
            Verification
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
