/**
 * src/services/api.js
 *
 * Axios instance pre-configured for the StockPulse backend REST API.
 * All components/hooks import from here — never create raw axios instances elsewhere.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — attach auth token if present ───────────────────────
api.interceptors.request.use(
  (config) => {
    // Extend here for JWT: config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalise errors ──────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";

    const appError = new Error(message);
    appError.statusCode = error.response?.status || 0;
    appError.originalError = error;
    return Promise.reject(appError);
  }
);

// ── Stock endpoints ──────────────────────────────────────────────────────────

/** Fetch a single stock quote */
export const fetchStockQuote = (symbol) =>
  api.get(`/stocks`, { params: { symbol } });

/** Fetch multiple stock quotes */
export const fetchMultipleQuotes = (symbols) =>
  api.get(`/stocks/multiple`, { params: { symbols: symbols.join(",") } });

/** Get current WebSocket subscriptions */
export const fetchSubscriptions = () => api.get(`/stocks/subscriptions`);

/** Subscribe a symbol via REST (triggers WS subscription on backend) */
export const subscribeSymbol = (symbol) =>
  api.post(`/stocks/subscribe`, { symbol });

/** Unsubscribe a symbol via REST */
export const unsubscribeSymbol = (symbol) =>
  api.delete(`/stocks/subscribe`, { data: { symbol } });

/** Health check */
export const fetchHealth = () => api.get(`/stocks/health`);

export default api;
