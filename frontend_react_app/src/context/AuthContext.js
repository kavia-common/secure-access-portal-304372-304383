import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/apiClient";

const AuthContext = createContext(null);

function safeParseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function getStoredToken() {
  // Keep token in memory, but allow persistence for convenience.
  // If you want purely in-memory, remove localStorage usage.
  return window.localStorage.getItem("access_token") || "";
}

function setStoredToken(token) {
  if (!token) {
    window.localStorage.removeItem("access_token");
  } else {
    window.localStorage.setItem("access_token", token);
  }
}

/**
 * PUBLIC_INTERFACE
 * useAuth - access auth state and actions.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * AuthProvider - provides auth state/actions:
 * - token (string)
 * - user ({ id, email, role, ... } | null)
 * - login/register/logout actions
 * - revalidateMe to refetch /auth/me
 */
export function AuthProvider({ children, onUnauthorized }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    setToken("");
    setStoredToken("");
    setUser(null);
  }, []);

  const handleUnauthorized = useCallback(() => {
    logout();
    if (typeof onUnauthorized === "function") onUnauthorized();
  }, [logout, onUnauthorized]);

  const revalidateMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }

    // Backend contract assumption: GET /auth/me returns { user: {...} } or user object.
    const me = await apiRequest("/auth/me", {
      method: "GET",
      token,
      onUnauthorized: handleUnauthorized
    });

    const resolvedUser = me?.user || me;
    setUser(resolvedUser || null);
    return resolvedUser || null;
  }, [token, handleUnauthorized]);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        if (token) {
          await revalidateMe();
        }
      } catch {
        // If /auth/me fails, keep user null but retain token until 401 handler clears it.
      } finally {
        if (mounted) setIsBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [token, revalidateMe]);

  const login = useCallback(async ({ email, password }) => {
    const payload = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
      token: "",
      onUnauthorized: handleUnauthorized
    });

    // Common patterns: { accessToken, user } or { token, user }
    const accessToken = payload?.accessToken || payload?.token || "";
    const nextUser = payload?.user || payload?.data?.user || null;

    if (!accessToken) {
      throw new Error("Login succeeded but no access token was returned by the API.");
    }

    setToken(accessToken);
    setStoredToken(accessToken);
    setUser(nextUser);

    // If API doesn't return user, fetch it.
    if (!nextUser) await revalidateMe();

    return { token: accessToken, user: nextUser };
  }, [handleUnauthorized, revalidateMe]);

  const register = useCallback(async ({ email, password, name }) => {
    const payload = await apiRequest("/auth/register", {
      method: "POST",
      body: { email, password, name },
      token: "",
      onUnauthorized: handleUnauthorized
    });

    // Some APIs auto-login on register, others return only a message.
    const accessToken = payload?.accessToken || payload?.token || "";
    const nextUser = payload?.user || null;

    if (accessToken) {
      setToken(accessToken);
      setStoredToken(accessToken);
      setUser(nextUser);
      if (!nextUser) await revalidateMe();
    }

    return payload;
  }, [handleUnauthorized, revalidateMe]);

  const value = useMemo(() => {
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isBootstrapping,
      login,
      register,
      logout,
      revalidateMe
    };
  }, [token, user, isBootstrapping, login, register, logout, revalidateMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
