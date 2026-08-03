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

export default function LoginPage() {
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
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
      setError(err.message || "Google sign-in failed. Please try again.");
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

      <div className={styles.card}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>StockPulse</span>
        </div>

        <div className={styles.divider} />

        <h1 className={styles.title}>Sign In</h1>
        <p className={styles.subtitle}>
          Access real-time markets, watchlist, and AI stock analytics.
        </p>

        {error && (
          <div className={styles.errorBox} role="alert">
            <span className={styles.errorIcon}>⚠</span> {error}
          </div>
        )}

        <form onSubmit={handleManualLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginBottom: "4px" }}>EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "5px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-secondary)", marginBottom: "4px" }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                borderRadius: "5px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={busy || loading}
            style={{
              marginTop: "4px",
              padding: "11px",
              background: "linear-gradient(135deg, #0284c7, #2563eb)",
              border: "none",
              borderRadius: "5px",
              color: "#ffffff",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer"
            }}
          >
            {busy ? "AUTHENTICATING..." : "SIGN IN WITH EMAIL"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", margin: "16px 0", gap: "10px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
        </div>

        <button
          className={styles.googleBtn}
          onClick={handleGoogle}
          disabled={busy || loading}
          aria-label="Sign in with Google"
        >
          <GoogleIcon />
          <span>{busy ? "Connecting…" : "Continue with Google"}</span>
        </button>

        <p className={styles.legalNote}>
          By signing in you agree to our{" "}
          <a href="#terms" className={styles.link}>Terms</a> and{" "}
          <a href="#privacy" className={styles.link}>Privacy Policy</a>.
        </p>

        <div className={styles.divider} />

        <p className={styles.switchText}>
          New here?{" "}
          <Link to="/register" className={styles.link}>
            Create an account
          </Link>
        </p>
      </div>

      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />
    </div>
  );
}