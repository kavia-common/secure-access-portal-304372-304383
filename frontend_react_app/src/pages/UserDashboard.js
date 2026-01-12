import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * UserDashboard - /dashboard route (role: user).
 */
export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="h1">Dashboard</h1>
          <div className="muted">Welcome back{user?.email ? `, ${user.email}` : ""}.</div>
        </div>
        <div className="badge badge-success">User</div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-title">Your access</div>
          <div className="muted">
            You are signed in as a <strong>{user?.role || "user"}</strong>.
          </div>
        </div>

        <div className="card">
          <div className="card-title">Next steps</div>
          <ul className="list">
            <li>View your assigned resources (coming soon).</li>
            <li>Request elevated access (coming soon).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
