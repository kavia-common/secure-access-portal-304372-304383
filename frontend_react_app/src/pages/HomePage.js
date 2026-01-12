import React from "react";
import { Link } from "react-router-dom";

/**
 * PUBLIC_INTERFACE
 * HomePage - simple landing route.
 */
export default function HomePage() {
  return (
    <div className="page">
      <div className="center">
        <div className="card hero">
          <div className="card-title">Secure Access Portal</div>
          <div className="muted">
            Sign in to access your dashboard. Admins can manage access and roles.
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
