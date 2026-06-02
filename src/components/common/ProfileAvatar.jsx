import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

const ProfileAvatar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef();

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";

  // Close dropdown when clicking outside
  const handleBlur = (e) => {
    if (!wrapRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={wrapRef}
      className="profile-wrap"
      tabIndex={-1}
      onBlur={handleBlur}
    >
      {/* ── Avatar button ── */}
      <button
        className="avatar-btn"
        onClick={() => setOpen((o) => !o)}
        title="My Profile"
      >
        <span className="avatar-ring" />
        {user?.avatar ? (
          <img src={user.avatar} alt="profile" className="avatar-img" />
        ) : (
          <span className="avatar-initials">{getInitials(user?.name)}</span>
        )}
      </button>

      {/* ── Dropdown ── */}
      {open && <ProfileDropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default ProfileAvatar;