

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import styles from "./ProfilePage.module.css";

// ── Avatar helper ─────────────────────────────────────────────────────────────
const Avatar = ({ src, name, size = 80 }) => {
  const [err, setErr] = useState(false);
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        className={styles.avatarImg}
        style={{ width: size, height: size }}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className={styles.avatarFallback}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
};

// ── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ label, value, mono = false }) => (
  <div className={styles.field}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={`${styles.fieldValue} ${mono ? styles.mono : ""}`}>
      {value || <span className={styles.empty}>—</span>}
    </span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState("");

  // Edit form state — prefill from MongoDB profile, fallback to Firebase user
  const [form, setForm] = useState({
    displayName: profile?.displayName || user?.displayName || "",
    bio:         profile?.bio || "",
    phone:       profile?.phone || "",
    location:    profile?.location || "",
    website:     profile?.website || "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = () => {
    setForm({
      displayName: profile?.displayName || user?.displayName || "",
      bio:         profile?.bio || "",
      phone:       profile?.phone || "",
      location:    profile?.location || "",
      website:     profile?.website || "",
    });
    setEditing(true);
    setSuccess(false);
    setError("");
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.put("/auth/profile", form);
      await refreshProfile();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const displayName = profile?.displayName || user?.displayName || "Trader";
  const email       = profile?.email       || user?.email       || "";
  const photoURL    = profile?.photoURL    || user?.photoURL    || "";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  return (
    <div className={styles.page}>
      <div className={styles.gridBg} aria-hidden="true" />

      <div className={styles.container}>
        {/* ── Header bar ── */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Sign Out
          </button>
        </div>

        {/* ── Profile card ── */}
        <div className={styles.card}>
          {/* Avatar + identity */}
          <div className={styles.heroSection}>
            <div className={styles.avatarWrap}>
              <Avatar src={photoURL} name={displayName} size={88} />
              <span className={styles.onlineDot} title="Verified via Google" />
            </div>
            <div className={styles.identity}>
              <h1 className={styles.name}>{displayName}</h1>
              <p className={styles.emailText}>{email}</p>
              <div className={styles.badges}>
                <span className={styles.badge}>
                  <span className={styles.badgeDot} />
                  Google Account
                </span>
                {profile?.role && (
                  <span className={`${styles.badge} ${styles.badgeGold}`}>
                    {profile.role}
                  </span>
                )}
              </div>
            </div>
            {!editing && (
              <button className={styles.editBtn} onClick={handleEdit}>
                Edit Profile
              </button>
            )}
          </div>

          <div className={styles.divider} />

          {/* ── Feedback banners ── */}
          {success && (
            <div className={styles.successBox}>
              ✓ Profile updated successfully.
            </div>
          )}
          {error && !editing && (
            <div className={styles.errorBox}>⚠ {error}</div>
          )}

          {/* ── View mode ── */}
          {!editing && (
            <div className={styles.fieldsGrid}>
              <Field label="Display Name" value={displayName} />
              <Field label="Email"        value={email} mono />
              <Field label="Phone"        value={profile?.phone} mono />
              <Field label="Location"     value={profile?.location} />
              <Field label="Website"      value={profile?.website} mono />
              <Field label="Bio"          value={profile?.bio} />
              <Field label="Member Since" value={memberSince} mono />
              <Field label="Provider"     value="Google OAuth" />
            </div>
          )}

          {/* ── Edit mode ── */}
          {editing && (
            <form className={styles.form} onSubmit={handleSave} noValidate>
              {error && (
                <div className={styles.errorBox}>⚠ {error}</div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="displayName">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    className={styles.input}
                    value={form.displayName}
                    onChange={handleChange}
                    maxLength={60}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    className={styles.input}
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                    maxLength={30}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    className={styles.input}
                    value={form.location}
                    onChange={handleChange}
                    placeholder="New York, NY"
                    maxLength={80}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="url"
                    className={styles.input}
                    value={form.website}
                    onChange={handleChange}
                    placeholder="https://yoursite.com"
                    maxLength={120}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label className={styles.label} htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="A short bio about yourself…"
                    rows={3}
                    maxLength={280}
                  />
                  <span className={styles.charCount}>
                    {form.bio.length}/280
                  </span>
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}