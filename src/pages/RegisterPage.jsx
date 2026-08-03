import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/common/ThemeToggle";
import styles from "./AuthPages.module.css";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
    <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
  </svg>
);

const PERKS = [
  { icon: "⚡", text: "Sub-100ms real-time trade ticks" },
  { icon: "🤖", text: "AI Price Prediction & LLM analysis" },
  { icon: "📊", text: "Interactive mountain & candle charts" },
  { icon: "📰", text: "Live real-time market news stream" },
];

export default function RegisterPage() {
  const { register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleManualRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await register(email, password, displayName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not complete registration.");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Could not complete sign-up. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} aria-hidden="true" />

      <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className={`${styles.card} ${styles.cardWide}`}>
        {/* Left panel — perks */}
        <div className={styles.leftPanel}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>StockPulse</span>
          </div>
          <h2 className={styles.panelTitle}>Start trading smarter</h2>
          <p className={styles.panelSub}>
            Join StockPulse to access real-time market data, AI predictions, and live market streaming.
          </p>
          <ul className={styles.perkList}>
            {PERKS.map(({ icon, text }) => (
              <li key={text} className={styles.perkItem}>
                <span className={styles.perkIcon}>{icon}</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <span className={styles.statVal}>50K+</span>
              <span className={styles.statLbl}>Users</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>99.9%</span>
              <span className={styles.statLbl}>Uptime</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statVal}>&lt;100ms</span>
              <span className={styles.statLbl}>Latency</span>
            </div>
          </div>
        </div>

        {/* Right panel — sign-up form */}
        <div className={styles.rightPanel}>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Register with Email & Password or Google to unlock full terminal capabilities.
          </p>

          {error && (
            <div className={styles.errorBox} role="alert">
              <span className={styles.errorIcon}>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleManualRegister} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginBottom: "4px" }}>FULL NAME</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Morgan"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "5px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginBottom: "4px" }}>EMAIL ADDRESS *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "5px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px"
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginBottom: "4px" }}>PASSWORD (MIN 6 CHARS) *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "5px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={busy || loading}
              style={{
                marginTop: "4px",
                padding: "10px",
                background: "linear-gradient(135deg, #16a34a, #059669)",
                border: "none",
                borderRadius: "5px",
                color: "#ffffff",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer"
              }}
            >
              {busy ? "CREATING ACCOUNT..." : "CREATE ACCOUNT WITH EMAIL"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", margin: "10px 0", gap: "10px" }}>
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>OR</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          </div>

          <button
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={busy || loading}
          >
            <GoogleIcon />
            <span>{busy ? "Creating account…" : "Sign up with Google"}</span>
          </button>

          <p className={styles.legalNote}>
            By continuing you agree to our{" "}
            <a href="#terms" className={styles.link}>Terms</a> and{" "}
            <a href="#privacy" className={styles.link}>Privacy Policy</a>.
          </p>

          <div className={styles.divider} />

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" className={styles.link}>Sign in</Link>
          </p>
        </div>
      </div>

      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />
    </div>
  );
}