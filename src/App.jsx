/**
 * src/App.jsx
 * Root component — mounts providers, initialises data hooks, renders router.
 */

import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Dashboard from "@/pages/Dashboard";
import LandingPage from "@/pages/LandingPage";
import useSocket from "@/hooks/useSocket";
import useStockData from "@/hooks/useStockData";
import { selectWatchlist } from "@/store/slices/stocksSlice";

// Landing page wrapper — has access to router navigate
const LandingPageWithNav = () => {
  const navigate = useNavigate();
  return <LandingPage onLaunch={() => navigate("/dashboard")} />;
};

// Inner component so it has access to Redux store via hooks
const AppInner = () => {
  const watchlist = useSelector(selectWatchlist);

  // Initialise WebSocket connection
  useSocket(watchlist);

  // Load initial REST data + periodic refresh
  useStockData();

  return (
    <>
      <Dashboard />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-elevated)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-default)",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            borderRadius: "4px",
          },
          error: {
            iconTheme: { primary: "var(--loss-bright)", secondary: "var(--bg-elevated)" },
          },
          success: {
            iconTheme: { primary: "var(--live-color)", secondary: "var(--bg-elevated)" },
          },
        }}
      />
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Landing page — no Redux hooks needed */}
      <Route path="/" element={<LandingPageWithNav />} />

      {/* Dashboard — Redux + socket hooks live here */}
      <Route path="/dashboard" element={<AppInner />} />
    </Routes>
  </BrowserRouter>
);

export default App;