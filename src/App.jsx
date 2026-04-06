// src/App.jsx
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LandingPage  from "@/pages/LandingPage";
import LoginPage    from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UserProfile  from "@/pages/UserProfile";
import Dashboard    from "@/pages/Dashboard";

import useSocket        from "@/hooks/useSocket";
import useStockData     from "@/hooks/useStockData";
import useAuthListener  from "@/hooks/useAuthListener";

import { selectWatchlist }  from "@/store/slices/stocksSlice";
import { selectUser, selectInitialized } from "@/store/slices/authSlice";

const toastStyles = {
  style: {
    background:  "var(--bg-elevated)",
    color:       "var(--text-primary)",
    border:      "1px solid var(--border-default)",
    fontFamily:  "var(--font-mono)",
    fontSize:    "12px",
    borderRadius:"4px",
  },
  error:   { iconTheme: { primary: "var(--loss-bright)",  secondary: "var(--bg-elevated)" } },
  success: { iconTheme: { primary: "var(--live-color)",   secondary: "var(--bg-elevated)" } },
};

// ── Protected route — redirects to /login if not authed ──────
const Protected = ({ children }) => {
  const user        = useSelector(selectUser);
  const initialized = useSelector(selectInitialized);
  if (!initialized) return <div style={{ display:"none" }} />;
  return user ? children : <Navigate to="/login" replace />;
};

// ── Redirect authed users away from login/register ───────────
const GuestOnly = ({ children }) => {
  const user        = useSelector(selectUser);
  const initialized = useSelector(selectInitialized);
  if (!initialized) return <div style={{ display:"none" }} />;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// ── Dashboard inner — hooks that need Redux ───────────────────
const DashboardInner = () => {
  const watchlist = useSelector(selectWatchlist);
  useSocket(watchlist);
  useStockData();
  return (
    <>
      <Dashboard />
      <Toaster position="bottom-right" toastOptions={toastStyles} />
    </>
  );
};

// ── Root ─────────────────────────────────────────────────────
const AppInner = () => {
  // Listen for Firebase auth state changes → hydrates Redux
  useAuthListener();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage onLaunch={() => window.location.href = "/dashboard"} />} />

      {/* Guest only (redirect to /dashboard if already logged in) */}
      <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />

      {/* Protected */}
      <Route path="/dashboard" element={<Protected><DashboardInner /></Protected>} />
      <Route path="/profile"   element={<Protected><UserProfile /></Protected>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AppInner />
  </BrowserRouter>
);

export default App;
