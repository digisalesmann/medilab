// src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const isAdmin = currentUser?.isAdmin;

  return isAdmin ? children : <Navigate to="/login" />;
}
