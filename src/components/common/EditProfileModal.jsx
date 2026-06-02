import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import "@/styles/profile.css";

const EditProfileModal = ({ onClose }) => {
  const { profile, updateProfile } = useAuth(); 
  const fileRef = useRef();
  const [saving, setSaving] = useState(false); 

  const [form, setForm] = useState({
    name:     profile?.name     || "",
    email:    profile?.email    || "",
    username: profile?.username || "",
    avatar:   profile?.avatar   || null,
  });

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      setForm((prev) => ({ ...prev, avatar: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form); // ✅ await the async call
      onClose();
    } catch {
      // updateProfile already reverts on failure, just stop loading
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIX 1: Stop propagation so overlay click doesn't fire
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}> {/* ✅ FIX 2: stop all bubbling from modal content */}
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Photo upload - label wraps input directly, no button, no .click() needed */}
            <div className="avatar-upload-row">
                <label
                    htmlFor="avatar-upload"
                    className="upload-avatar"
                    style={{ cursor: "pointer" }}
                    onClick={(e) => e.stopPropagation()} // ✅ stop label click bubbling to overlay
                >
                    {form.avatar ? (
                    <img src={form.avatar} alt="preview" className="upload-avatar-img" />
                    ) : (
                    <span>{getInitials(form.name)}</span>
                    )}
                </label>

            <div>
                <label
                    htmlFor="avatar-upload"
                    className="upload-btn"
                    onClick={(e) => e.stopPropagation()} // ✅ stop this label click too
                >
                    Upload photo
                </label>
                <p className="upload-hint">JPG or PNG · Max 2MB</p>

                {/* input is controlled by htmlFor, no ref or .click() needed */}
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                        e.stopPropagation(); // ✅ stop input change bubbling
                        handlePhotoUpload(e);
                    }}
                />
            </div>
            </div>

          {/* Fields */}
          <div className="form-field">
            <label>Full name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />
          </div>
          <div className="form-field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="@handle"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save changes"} {/* ✅ loading feedback */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;