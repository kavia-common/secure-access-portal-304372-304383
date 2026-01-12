import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute - guards nested routes.
 * Props:
 * - requiredRole?: string (e.g., "admin" or "user")
 */
export default function ProtectedRoute({ requiredRole }) {
  const { user, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div style={{ padding: 24 }}>
        <div className="card">
          <div className="card-title">Loading…</div>
          <div className="muted">Checking your session.</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div style={{ padding: 24 }}>
        <div className="card">
          <div className="card-title">Access denied</div>
          <div className="muted">You do not have permission to view this page.</div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
