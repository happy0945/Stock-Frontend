// src/pages/LoginPage.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  socialLogin,
  emailLogin,
  clearError,
  selectAuthLoading,
  selectAuthError,
} from "@/store/slices/authSlice";
import styles from "./AuthPages.module.css";

// ── Social button ─────────────────────────────────────────────
const SocialBtn = ({ provider, icon, label, onClick, disabled }) => (
  <button
    className={`${styles.socialBtn} ${styles[provider]}`}
    onClick={onClick}
    disabled={disabled}
    type="button"
  >
    <span className={styles.socialIcon}>{icon}</span>
    <span>{label}</span>
  </button>
);

// ── Main ──────────────────────────────────────────────────────
const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const loading   = useSelector(selectAuthLoading);
  const error     = useSelector(selectAuthError);

  const [form, setForm]     = useState({ email: "", password: "" });
  const [showPwd, setShow]  = useState(false);

  const handleChange = (e) => {
    dispatch(clearError());
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEmail = async (e) => {
    e.preventDefault();
    const res = await dispatch(emailLogin(form));
    if (!res.error) navigate("/dashboard");
  };

  const handleSocial = async (provider) => {
    const res = await dispatch(socialLogin(provider));
    if (!res.error) navigate("/dashboard");
  };

  return (
    <div className={styles.page}>
      {/* Background effects */}
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>▲</div>
          <span className={styles.logoText}>STOCKPULSE</span>
        </div>

        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your terminal</p>

        {/* Error */}
        {error && (
          <div className={styles.errorBanner}>
            <span>⚠</span> {friendlyError(error)}
          </div>
        )}

        {/* Social logins */}
        <div className={styles.socialGrid}>
          <SocialBtn
            provider="google"
            icon={<GoogleIcon />}
            label="Google"
            onClick={() => handleSocial("google")}
            disabled={loading}
          />
          <SocialBtn
            provider="github"
            icon={<GithubIcon />}
            label="GitHub"
            onClick={() => handleSocial("github")}
            disabled={loading}
          />
          <SocialBtn
            provider="twitter"
            icon={<TwitterIcon />}
            label="Twitter"
            onClick={() => handleSocial("twitter")}
            disabled={loading}
          />
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or continue with email</span>
          <span className={styles.dividerLine} />
        </div>

        {/* Email form */}
        <form onSubmit={handleEmail} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>EMAIL</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="trader@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>PASSWORD</label>
            <div className={styles.inputWrap}>
              <input
                className={styles.input}
                type={showPwd ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShow((s) => !s)}
                tabIndex={-1}
              >
                {showPwd ? "◉" : "○"}
              </button>
            </div>
          </div>

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign In →"}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.switchLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

// ── Tiny helpers ──────────────────────────────────────────────
const Spinner = () => <span className={styles.spinner} />;

const friendlyError = (msg) => {
  if (msg.includes("user-not-found"))  return "No account found with this email.";
  if (msg.includes("wrong-password"))  return "Incorrect password.";
  if (msg.includes("too-many-requests"))return "Too many attempts. Try again later.";
  if (msg.includes("popup-closed"))    return "Sign-in popup was closed.";
  if (msg.includes("account-exists"))  return "Account already exists with different provider.";
  return msg;
};

// SVG icons kept inline (no extra deps)
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default LoginPage;
