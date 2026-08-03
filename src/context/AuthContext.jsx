import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  signInWithGoogle,
  firebaseSignOut,
} from "@/services/firebase";
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  googleAuthUser as apiGoogleAuth,
  fetchMe as apiFetchMe,
  updateProfileApi,
} from "@/services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = useCallback(async () => {
    const token = localStorage.getItem("sp_token");
    if (!token) {
      setProfile(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiFetchMe();
      if (data?.user) {
        setProfile(data.user);
        setUser(data.user);
      } else {
        localStorage.removeItem("sp_token");
        setProfile(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem("sp_token");
      setProfile(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Manual Email/Password Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      if (res?.token && res?.user) {
        localStorage.setItem("sp_token", res.token);
        setProfile(res.user);
        setUser(res.user);
        return res.user;
      }
      throw new Error(res?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Manual Email/Password Register
  const register = async (email, password, displayName) => {
    setLoading(true);
    try {
      const res = await apiRegister({ email, password, displayName });
      if (res?.token && res?.user) {
        localStorage.setItem("sp_token", res.token);
        setProfile(res.user);
        setUser(res.user);
        return res.user;
      }
      throw new Error(res?.error?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Login
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const firebaseUser = await signInWithGoogle();
      const idToken = await firebaseUser.getIdToken();
      const res = await apiGoogleAuth(idToken);

      if (res?.token && res?.user) {
        localStorage.setItem("sp_token", res.token);
        setProfile(res.user);
        setUser(res.user);
        return res.user;
      }
      throw new Error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut();
    } catch {
      /* ignore firebase signOut errors if logged in via local */
    }
    localStorage.removeItem("sp_token");
    setProfile(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const data = await apiFetchMe();
      if (data?.user) {
        setProfile(data.user);
        setUser(data.user);
      }
    } catch {/* silent */}
  };

  const updateProfile = async (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
    try {
      const data = await updateProfileApi(updatedFields);
      if (data?.user) setProfile(data.user);
    } catch {
      await refreshProfile();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: profile || user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshProfile,
        updateProfile,
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