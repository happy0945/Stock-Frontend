// src/services/authApi.js
// Communicates with the Express backend for Redis session management.

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const post = (path, body) =>
  fetch(`${BASE}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

/** Register session token in Redis */
export const createSession = async (idToken) => {
  const res = await post("/auth/session", { idToken });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json();
};

/** Blacklist token in Redis (logout) */
export const logoutSession = async (idToken) => {
  const res = await post("/auth/logout", { idToken });
  if (!res.ok) throw new Error("Failed to invalidate session");
  return res.json();
};

/** Verify token is not blacklisted */
export const verifySession = async (idToken) => {
  const res = await fetch(`${BASE}/auth/verify`, {
    method:  "GET",
    headers: { Authorization: `Bearer ${idToken}` },
    credentials: "include",
  });
  return res.ok;
};
