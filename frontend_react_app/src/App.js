import React, { useCallback } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AppShell from "./layouts/AppShell";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function AuthProviderWithRedirect({ children }) {
  const navigate = useNavigate();

  const onUnauthorized = useCallback(() => {
    // Central 401 handling: redirect to login.
    navigate("/login", { replace: true });
  }, [navigate]);

  return <AuthProvider onUnauthorized={onUnauthorized}>{children}</AuthProvider>;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <BrowserRouter>
      <AuthProviderWithRedirect>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedRoute requiredRole="user" />}>
              <Route path="/dashboard" element={<UserDashboard />} />
            </Route>

            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AuthProviderWithRedirect>
    </BrowserRouter>
  );
}

export default App;
