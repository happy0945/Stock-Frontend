import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal"

// const ProfileDropdown = ({ onClose }) => {
//   const { user, signOut } = useAuth();
//   const [showEdit, setShowEdit] = useState(false);

//   const getInitials = (name) =>
//     name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

//   const handleSignOut = () => {
//     onClose();
//     signOut();
//   };

//   return (
//     <>
//       <div className="profile-dropdown">
//         {/* ── Header ── */}
//         <div className="dd-header">
//           <div
//             className="dd-avatar"
//             onClick={() => { setShowEdit(true); onClose(); }}
//             title="Change photo"
//           >
//             {user?.avatar ? (
//               <img src={user.avatar} alt="profile" className="dd-avatar-img" />
//             ) : (
//               <span>{getInitials(user?.name)}</span>
//             )}
//             <div className="dd-avatar-hover">Change</div>
//           </div>
//           <div className="dd-info">
//             <p className="dd-name">{user?.name}</p>
//             <p className="dd-email">{user?.email}</p>
//           </div>
//         </div>

//         {/* ── Section 1 ── */}
//         <div className="dd-section">
//           <button className="dd-item" onClick={() => { setShowEdit(true); onClose(); }}>
//             <EditIcon /> Edit profile
//           </button>
//           <button className="dd-item">
//             <SettingsIcon /> Preferences
//           </button>
//         </div>

//         {/* ── Section 2 ── */}
//         <div className="dd-section">
//           <button className="dd-item">
//             <UserIcon /> Account settings
//           </button>
//           <button className="dd-item">
//             <CardIcon /> Billing
//           </button>
//           <button className="dd-item">
//             <BagIcon /> Subscription
//           </button>
//         </div>

//         {/* ── Sign Out ── */}
//         <div className="dd-section">
//           <button className="dd-item danger" onClick={handleSignOut}>
//             <LogoutIcon /> Sign out
//           </button>
//         </div>
//       </div>

//       {/* Edit modal rendered outside dropdown */}
//       {showEdit && <EditProfileModal onClose={() => setShowEdit(false)} />}
//     </>
//   );
// };

const ProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [showEdit, setShowEdit] = useState(false);

  const getInitials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "??";

  const handleSignOut = async () => {
    onClose();
    await logout();
  };

  // ✅ FIX: Don't call onClose() here. The modal lives in this component's
  // fragment, so closing the dropdown before setState runs destroys the state.
  const handleOpenEdit = () => {
    setShowEdit(true);
  };

  return (
    <>
      <div className="profile-dropdown">
        {/* ── Header ── */}
        <div className="dd-header">
          <div
            className="dd-avatar"
            onClick={handleOpenEdit}   // ✅ removed onClose()
            title="Change photo"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt="profile" className="dd-avatar-img" />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
            <div className="dd-avatar-hover">Change</div>
          </div>
          <div className="dd-info">
            <p className="dd-name">{user?.name}</p>
            <p className="dd-email">{user?.email}</p>
          </div>
        </div>

        {/* ── Section 1 ── */}
        <div className="dd-section">
          <button className="dd-item" onClick={handleOpenEdit}>  {/* ✅ removed onClose() */}
            <EditIcon /> Edit profile
          </button>
          <button className="dd-item">
            <SettingsIcon /> Preferences
          </button>
        </div>

        {/* ── Section 2 ── */}
        <div className="dd-section">
          <button className="dd-item">
            <UserIcon /> Account settings
          </button>
          <button className="dd-item">
            <CardIcon /> Billing
          </button>
          <button className="dd-item">
            <BagIcon /> Subscription
          </button>
        </div>

        {/* rest of sections unchanged ... */}
        <div className="dd-section">
          <button className="dd-item danger" onClick={handleSignOut}>
            <LogoutIcon /> Sign out
          </button>
        </div>
      </div>

      {/* ✅ Modal closes dropdown when it saves/cancels */}
      {showEdit && (
        <EditProfileModal
          onClose={() => {
            setShowEdit(false);
            onClose(); // close the dropdown too, after modal is done
          }}
        />
      )}
    </>
  );
};

// ── Inline SVG icons ──
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M11 2a2.5 2.5 0 010 3.5L4 13H1v-3L8.5 2.5A2.5 2.5 0 0111 2z"/>
  </svg>
);
const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="3"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.22 3.22l1.42 1.42M11.36 11.36l1.42 1.42M3.22 12.78l1.42-1.42M11.36 4.64l1.42-1.42"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="5" r="2.5"/>
    <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5"/>
  </svg>
);
const CardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="14" height="10" rx="1.5"/>
    <path d="M1 6h14"/>
  </svg>
);
const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="4" width="14" height="9" rx="1.5"/>
    <path d="M5 4V2.5A1.5 1.5 0 016.5 1h3A1.5 1.5 0 0111 2.5V4M6 9h4"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M6 14H2a1 1 0 01-1-1V3a1 1 0 011-1h4M11 11l3-3-3-3M14 8H6"/>
  </svg>
);

export default ProfileDropdown;