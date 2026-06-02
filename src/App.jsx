import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext"; // ← NEW
import Dashboard    from "@/pages/Dashboard";
import LandingPage  from "@/pages/LandingPage";
import LoginPage    from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage  from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import useSocket    from "@/hooks/useSocket";
import useStockData from "@/hooks/useStockData";
import { selectWatchlist } from "@/store/slices/stocksSlice";

const LandingPageWithNav = () => {
  const navigate = useNavigate();
  return <LandingPage onLaunch={() => navigate("/login")} />;
};

const AppInner = () => {
  const watchlist = useSelector(selectWatchlist);
  useSocket(watchlist);
  useStockData();

  return (
    <>
      <Dashboard />
      <Toaster
        position="bottom-right"
        toastOptions={{
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
        }}
      />
    </>
  );
};

const App = () => (
  <AuthProvider> {/* ← WRAP HERE */}
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LandingPageWithNav />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppInner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;