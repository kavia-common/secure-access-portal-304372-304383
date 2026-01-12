import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * AdminDashboard - /admin route (role: admin).
 */
export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="h1">Admin</h1>
          <div className="muted">Administrative overview and tools.</div>
        </div>
        <div className="badge badge-primary">Admin</div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-title">Role-based access control</div>
          <div className="muted">
            You have elevated privileges as <strong>{user?.email}</strong>.
          </div>
        </div>

        <div className="card">
          <div className="card-title">Management</div>
          <ul className="list">
            <li>Manage users and roles (coming soon).</li>
            <li>Audit logs (coming soon).</li>
            <li>System settings (coming soon).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
