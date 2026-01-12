const DEFAULT_BASE_URL = "http://localhost:3001";

/**
 * Read API base URL from env. CRA exposes only REACT_APP_* vars.
 */
function getApiBaseUrl() {
  const fromEnv = process.env.REACT_APP_API_BASE_URL;
  return (fromEnv && fromEnv.trim()) ? fromEnv.trim() : DEFAULT_BASE_URL;
}

/**
 * Build standard headers for JSON APIs.
 */
function buildHeaders(token, extraHeaders) {
  const headers = {
    "Content-Type": "application/json",
    ...(extraHeaders || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

/**
 * PUBLIC_INTERFACE
 * apiRequest - Fetch wrapper for backend API calls.
 * - Automatically prefixes with REACT_APP_API_BASE_URL (defaults to http://localhost:3001)
 * - Adds Authorization header when token is present
 * - Sends credentials for compatibility with backends that use cookies
 * - Calls onUnauthorized on 401 so UI can redirect to login
 */
export async function apiRequest(path, { method = "GET", token, body, headers, onUnauthorized } = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers: buildHeaders(token, headers),
    credentials: "include",
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) {
    if (typeof onUnauthorized === "function") onUnauthorized();
  }

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (payload && payload.message) ||
      (typeof payload === "string" && payload) ||
      `Request failed with status ${res.status}`;

    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}
