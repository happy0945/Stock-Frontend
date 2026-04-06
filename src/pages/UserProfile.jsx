// src/pages/UserProfile.jsx
import { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectUser,
  selectAuthLoading,
  selectAuthError,
  updateProfile_,
  logout,
  clearError,
} from "@/store/slices/authSlice";
import styles from "./UserProfile.module.css";

// ── Avatar ────────────────────────────────────────────────────
const Avatar = ({ user }) => {
  const initials = (user.displayName || user.email || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={styles.avatarWrap}>
      {user.photoURL ? (
        <img src={user.photoURL} alt={user.displayName} className={styles.avatarImg} />
      ) : (
        <div className={styles.avatarFallback}>{initials}</div>
      )}
      <div className={styles.avatarBadge}>
        {providerIcon(user.provider)}
      </div>
    </div>
  );
};

const providerIcon = (provider) => {
  if (provider === "google.com")  return <GoogleDot />;
  if (provider === "github.com")  return <GithubDot />;
  if (provider === "twitter.com") return <TwitterDot />;
  return <span className={styles.emailDot}>@</span>;
};

// ── Stat box ──────────────────────────────────────────────────
const StatBox = ({ label, value }) => (
  <div className={styles.statBox}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue}>{value || "—"}</span>
  </div>
);

// ── Editable field ────────────────────────────────────────────
const Field = ({ label, name, value, onChange, type = "text", placeholder, readOnly }) => (
  <div className={styles.field}>
    <label className={styles.fieldLabel}>{label}</label>
    <input
      className={`${styles.fieldInput} ${readOnly ? styles.fieldReadOnly : ""}`}
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </div>
);

// ── Main ──────────────────────────────────────────────────────
const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user     = useSelector(selectUser);
  const loading  = useSelector(selectAuthLoading);
  const error    = useSelector(selectAuthError);

  const [editing, setEditing] = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [form, setForm] = useState({
    displayName: user?.displayName ?? "",
    bio:         user?.bio         ?? "",
    phone:       user?.phone       ?? "",
    location:    user?.location    ?? "",
    website:     user?.website     ?? "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e) => {
    dispatch(clearError());
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const res = await dispatch(updateProfile_({ uid: user.uid, fields: form }));
    if (!res.error) {
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const isOAuth = user.provider !== "password";
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className={styles.page}>
      <div className={styles.bgGlow} />
      <div className={styles.bgGrid} />

      {/* Top nav */}
      <header className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <div className={styles.topBarLogo}>
          <span className={styles.logoMark}>▲</span>
          <span className={styles.logoText}>STOCKPULSE</span>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout} disabled={loading}>
          {loading ? "…" : "Sign Out"}
        </button>
      </header>

      <div className={styles.container}>
        {/* Left — identity card */}
        <aside className={styles.sidebar}>
          <div className={styles.identityCard}>
            <Avatar user={user} />
            <div className={styles.idName}>{user.displayName || "Anonymous"}</div>
            <div className={styles.idEmail}>{user.email}</div>
            <div className={styles.providerBadge}>
              {providerLabel(user.provider)}
            </div>

            <div className={styles.statsGrid}>
              <StatBox label="MEMBER SINCE" value={memberSince} />
              <StatBox label="PROVIDER"     value={providerLabel(user.provider)} />
              <StatBox label="LOCATION"     value={user.location} />
              <StatBox label="WEBSITE"      value={user.website ? shortenUrl(user.website) : ""} />
            </div>

            {user.bio && (
              <div className={styles.bioDisplay}>
                <span className={styles.bioLabel}>BIO</span>
                <p className={styles.bioText}>{user.bio}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right — edit panel */}
        <main className={styles.main}>
          {/* Success banner */}
          {saved && (
            <div className={styles.successBanner}>
              ✓ Profile updated successfully
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div className={styles.errorBanner}>
              ⚠ {error}
            </div>
          )}

          {/* Section: Account Info */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionLabel}>ACCOUNT INFORMATION</span>
                <h2 className={styles.sectionTitle}>Personal Details</h2>
              </div>
              <div className={styles.sectionActions}>
                {editing ? (
                  <>
                    <button className={styles.cancelBtn} onClick={() => setEditing(false)}>
                      Cancel
                    </button>
                    <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                      {loading ? "Saving…" : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button className={styles.editBtn} onClick={() => setEditing(true)}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <Field
                label="DISPLAY NAME"
                name="displayName"
                value={editing ? form.displayName : user.displayName}
                onChange={handleChange}
                placeholder="Your name"
                readOnly={!editing}
              />
              <Field
                label="EMAIL"
                name="email"
                value={user.email}
                readOnly
                placeholder="—"
              />
              <Field
                label="PHONE"
                name="phone"
                value={editing ? form.phone : user.phone}
                onChange={handleChange}
                placeholder={editing ? "+1 (555) 000-0000" : "Not set"}
                readOnly={!editing}
              />
              <Field
                label="LOCATION"
                name="location"
                value={editing ? form.location : user.location}
                onChange={handleChange}
                placeholder={editing ? "New York, USA" : "Not set"}
                readOnly={!editing}
              />
              <Field
                label="WEBSITE"
                name="website"
                value={editing ? form.website : user.website}
                onChange={handleChange}
                placeholder={editing ? "https://yoursite.com" : "Not set"}
                readOnly={!editing}
              />
            </div>

            {/* Bio */}
            <div className={styles.field} style={{ marginTop: "4px" }}>
              <label className={styles.fieldLabel}>BIO</label>
              <textarea
                className={`${styles.fieldTextarea} ${!editing ? styles.fieldReadOnly : ""}`}
                name="bio"
                value={editing ? form.bio : user.bio}
                onChange={handleChange}
                placeholder={editing ? "Tell the market who you are…" : "Not set"}
                readOnly={!editing}
                rows={3}
              />
            </div>
          </section>

          {/* Section: Security */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <span className={styles.sectionLabel}>SECURITY</span>
                <h2 className={styles.sectionTitle}>Authentication</h2>
              </div>
            </div>

            <div className={styles.securityGrid}>
              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>🔐</div>
                <div>
                  <div className={styles.securityCardTitle}>Sign-In Method</div>
                  <div className={styles.securityCardSub}>{providerLabel(user.provider)}</div>
                </div>
                <div className={`${styles.securityBadge} ${styles.badgeActive}`}>Active</div>
              </div>

              {isOAuth && (
                <div className={styles.securityCard}>
                  <div className={styles.securityIcon}>🔗</div>
                  <div>
                    <div className={styles.securityCardTitle}>OAuth Account</div>
                    <div className={styles.securityCardSub}>Managed by {providerLabel(user.provider)}</div>
                  </div>
                  <div className={`${styles.securityBadge} ${styles.badgeInfo}`}>Linked</div>
                </div>
              )}

              <div className={styles.securityCard}>
                <div className={styles.securityIcon}>🔴</div>
                <div>
                  <div className={styles.securityCardTitle}>Session Management</div>
                  <div className={styles.securityCardSub}>Redis-backed token blacklisting on logout</div>
                </div>
                <div className={`${styles.securityBadge} ${styles.badgeActive}`}>Enabled</div>
              </div>
            </div>
          </section>

          {/* Danger zone */}
          <section className={styles.dangerSection}>
            <span className={styles.sectionLabel}>DANGER ZONE</span>
            <div className={styles.dangerCard}>
              <div>
                <div className={styles.dangerTitle}>Sign out of all sessions</div>
                <div className={styles.dangerSub}>This will invalidate your current session token via Redis.</div>
              </div>
              <button className={styles.dangerBtn} onClick={handleLogout} disabled={loading}>
                {loading ? "…" : "Sign Out →"}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// ── Helpers ───────────────────────────────────────────────────
const providerLabel = (p) => {
  if (p === "google.com")  return "Google";
  if (p === "github.com")  return "GitHub";
  if (p === "twitter.com") return "Twitter / X";
  return "Email & Password";
};

const shortenUrl = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const GoogleDot  = () => <svg width="12" height="12" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>;
const GithubDot  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>;
const TwitterDot = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;

export default UserProfile;
