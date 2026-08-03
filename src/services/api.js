
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://stock-app-1-7imv.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

const FINNHUB_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const BASE = "https://finnhub.io/api/v1";

export const fetchQuote = (symbol) =>
  axios.get(`${BASE}/quote`, {
    params: { symbol, token: FINNHUB_KEY },
  });

export const fetchCompanyProfile = (symbol) =>
  axios.get(`${BASE}/stock/profile2`, {
    params: { symbol, token: FINNHUB_KEY },
  });
// ── Request interceptor — attach stored JWT ───────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sp_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred";
    const appError      = new Error(message);
    appError.statusCode = error.response?.status || 0;
    appError.originalError = error;
    return Promise.reject(appError);
  }
);

// ── Auth endpoints ────────────────────────────────────────────────────────────
export const loginUser            = (data)    => api.post(`/auth/login`, data);
export const registerUser         = (data)    => api.post(`/auth/register`, data);
export const googleAuthUser       = (idToken) => api.post(`/auth/google`, { idToken });
export const fetchMe              = ()        => api.get(`/auth/me`);
export const updateProfileApi     = (data)    => api.put(`/auth/profile`, data);

// ── Stock endpoints ───────────────────────────────────────────────────────────
export const fetchStockQuote      = (symbol)  => api.get(`/stocks`, { params: { symbol } });
export const fetchMultipleQuotes  = (symbols) => api.get(`/stocks/multiple`, { params: { symbols: symbols.join(",") } });
export const fetchSubscriptions   = ()        => api.get(`/stocks/subscriptions`);
export const subscribeSymbol      = (symbol)  => api.post(`/stocks/subscribe`, { symbol });
export const unsubscribeSymbol    = (symbol)  => api.delete(`/stocks/subscribe`, { data: { symbol } });
export const fetchHealth          = ()        => api.get(`/stocks/health`);
export const fetchAiPrediction    = (symbol)  => api.get(`/stocks/ai-prediction`, { params: { symbol } });
export const fetchMarketNews      = ()        => api.get(`/stocks/news`);

export default api;
