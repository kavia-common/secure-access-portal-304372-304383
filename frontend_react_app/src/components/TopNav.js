import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * TopNav - top application navigation bar.
 */
export default function TopNav({ onToggleDrawer }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="topnav">
      <div className="topnav-left">
        <button className="icon-btn" onClick={onToggleDrawer} aria-label="Toggle navigation drawer">
          ☰
        </button>
        <Link to="/" className="brand">
          Secure Access Portal
        </Link>
      </div>

      <div className="topnav-right">
        {user ? (
          <>
            <div className="chip" title={user.email}>
              <span className="chip-dot" />
              <span className="chip-text">{user.role || "user"}</span>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="btn btn-secondary" to="/login">
              Login
            </Link>
            <Link className="btn btn-primary" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
