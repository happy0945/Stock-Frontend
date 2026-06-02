import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthChange,
  signInWithGoogle,
  firebaseSignOut,
} from "@/services/firebase";
import api from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const { data } = await api.post("/auth/google", { idToken });
          setProfile(data.user);
          localStorage.setItem("sp_token", data.token);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
        localStorage.removeItem("sp_token");
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    await firebaseSignOut();
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/auth/me");
      setProfile(data.user);
    } catch {/* silent */}
  };

  // ── NEW: update name/email/avatar locally + persist to backend ──
  const updateProfile = async (updatedFields) => {
    // Optimistically update UI immediately
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    try {
      const { data } = await api.patch("/auth/profile", updatedFields);
      setProfile(data.user); // sync with server response
    } catch {
      // If backend fails, revert to refreshed profile
      await refreshProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginWithGoogle,
        logout,
        refreshProfile,
        updateProfile, // ← NEW
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

export default AuthContext;