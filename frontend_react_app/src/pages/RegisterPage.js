import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/**
 * PUBLIC_INTERFACE
 * RegisterPage - /register route. Uses a modal dialog for the form.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const emailValid = validateEmail(email);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formValid) {
      setError("Please enter a valid email and a password of at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ email, password, name: name.trim() || undefined });
      setSuccess("Account created. You can now log in.");
      // Some APIs auto-login; if so, sending user to dashboard is OK.
      // We keep it simple: take user to login.
      setTimeout(() => navigate("/login", { replace: true }), 500);
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Modal
        isOpen={isOpen}
        title="Create account"
        onClose={() => {
          setIsOpen(false);
          navigate("/", { replace: true });
        }}
      >
        <form onSubmit={onSubmit} className="form">
          <label className="label">
            Name (optional)
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </label>

          <label className="label">
            Email
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              required
            />
            {!emailValid && email.length > 0 && <div className="field-error">Enter a valid email.</div>}
          </label>

          <label className="label">
            Password
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
            {!passwordValid && password.length > 0 && (
              <div className="field-error">Password must be at least 6 characters.</div>
            )}
          </label>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={!formValid || submitting}>
            {submitting ? "Creating…" : "Create account"}
          </button>

          <div className="form-footer">
            <span className="muted">Already have an account?</span> <Link to="/login">Log in</Link>
          </div>
        </form>
      </Modal>
    </div>
  );
}
