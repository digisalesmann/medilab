import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { user, initializing } = useAuth();

  if (initializing) return null; // or a loading spinner

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

const ADMIN_EMAIL = "admin@medilab.com";

export function AdminRoute() {
  const { user, initializing } = useAuth();

  if (initializing) return null;

  const isAdmin = (user?.email || "").toLowerCase() === ADMIN_EMAIL;
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}
