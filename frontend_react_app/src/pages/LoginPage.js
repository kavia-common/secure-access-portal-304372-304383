import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

/**
 * PUBLIC_INTERFACE
 * LoginPage - /login route. Uses a modal dialog for the form.
 */
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = useMemo(() => {
    return (location.state && location.state.from) ? location.state.from : "/dashboard";
  }, [location.state]);

  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const emailValid = validateEmail(email);
  const passwordValid = password.length >= 6;
  const formValid = emailValid && passwordValid;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formValid) {
      setError("Please enter a valid email and a password of at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <Modal
        isOpen={isOpen}
        title="Log in"
        onClose={() => {
          setIsOpen(false);
          navigate("/", { replace: true });
        }}
      >
        <form onSubmit={onSubmit} className="form">
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
              autoComplete="current-password"
              required
            />
            {!passwordValid && password.length > 0 && (
              <div className="field-error">Password must be at least 6 characters.</div>
            )}
          </label>

          {error && <div className="alert alert-error">{error}</div>}

          <button className="btn btn-primary btn-block" type="submit" disabled={!formValid || submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="form-footer">
            <span className="muted">No account?</span> <Link to="/register">Create one</Link>
          </div>
        </form>
      </Modal>

      {!isOpen && (
        <div className="center">
          <div className="card">
            <div className="card-title">Login closed</div>
            <div className="muted">
              Go back to <Link to="/login">login</Link>.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
