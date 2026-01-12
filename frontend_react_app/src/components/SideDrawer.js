import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * SideDrawer - left navigation drawer for dashboard pages.
 */
export default function SideDrawer({ isOpen, onClose }) {
  const { user } = useAuth();

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? "open" : ""}`} onClick={onClose} />
      <aside className={`drawer ${isOpen ? "open" : ""}`} aria-label="Side navigation">
        <div className="drawer-header">
          <div className="drawer-title">Navigation</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close drawer">
            ×
          </button>
        </div>

        <nav className="drawer-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `drawer-link ${isActive ? "active" : ""}`}>
            User Dashboard
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin" className={({ isActive }) => `drawer-link ${isActive ? "active" : ""}`}>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="drawer-footer">
          <div className="muted">
            {user ? (
              <>
                Signed in as <strong>{user.email}</strong>
              </>
            ) : (
              "Not signed in"
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
