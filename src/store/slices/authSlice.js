// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithGoogle,
  signInWithGithub,
  signInWithTwitter,
  registerWithEmail,
  loginWithEmail,
  firebaseSignOut,
  upsertUserDoc,
  fetchUserProfile,
  updateUserProfile,
  updateProfile,
  auth,
} from "@/services/firebase";
import { logoutSession, createSession } from "@/services/authApi";

// ── Async Thunks ─────────────────────────────────────────────

export const socialLogin = createAsyncThunk(
  "auth/socialLogin",
  async (provider, { rejectWithValue }) => {
    try {
      const handlers = {
        google:  signInWithGoogle,
        github:  signInWithGithub,
        twitter: signInWithTwitter,
      };
      const result  = await handlers[provider]();
      const profile = await upsertUserDoc(result.user);
      const token   = await result.user.getIdToken();
      await createSession(token);
      return serializeUser(result.user, profile);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const emailRegister = createAsyncThunk(
  "auth/emailRegister",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const result = await registerWithEmail(email, password);
      await updateProfile(result.user, { displayName });
      const profile = await upsertUserDoc(result.user);
      const token   = await result.user.getIdToken();
      await createSession(token);
      return serializeUser(result.user, profile);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const emailLogin = createAsyncThunk(
  "auth/emailLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const result  = await loginWithEmail(email, password);
      const profile = await fetchUserProfile(result.user.uid);
      const token   = await result.user.getIdToken();
      await createSession(token);
      return serializeUser(result.user, profile);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      if (token) await logoutSession(token); // blacklist in Redis
      await firebaseSignOut();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProfile_ = createAsyncThunk(
  "auth/updateProfile",
  async ({ uid, fields }, { rejectWithValue }) => {
    try {
      await updateUserProfile(uid, fields);
      // Also update Firebase Auth displayName if changed
      if (fields.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: fields.displayName });
      }
      return fields;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadProfile = createAsyncThunk(
  "auth/loadProfile",
  async (uid, { rejectWithValue }) => {
    try {
      return await fetchUserProfile(uid);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── Helpers ──────────────────────────────────────────────────
const serializeUser = (firebaseUser, profile) => ({
  uid:         firebaseUser.uid,
  email:       firebaseUser.email,
  displayName: firebaseUser.displayName ?? profile?.displayName ?? "",
  photoURL:    firebaseUser.photoURL    ?? profile?.photoURL    ?? "",
  provider:    firebaseUser.providerData[0]?.providerId ?? "password",
  bio:         profile?.bio      ?? "",
  phone:       profile?.phone    ?? "",
  location:    profile?.location ?? "",
  website:     profile?.website  ?? "",
  createdAt:   profile?.createdAt ?? "",
});

// ── Slice ────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:    null,
    loading: false,
    error:   null,
    initialized: false,
  },
  reducers: {
    setUser(state, action) {
      state.user        = action.payload;
      state.initialized = true;
    },
    clearUser(state) {
      state.user        = null;
      state.initialized = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending  = (state) => { state.loading = true;  state.error = null; };
    const rejected = (state, a) => { state.loading = false; state.error = a.payload; };

    // socialLogin
    builder
      .addCase(socialLogin.pending,   pending)
      .addCase(socialLogin.fulfilled, (state, a) => { state.loading = false; state.user = a.payload; state.initialized = true; })
      .addCase(socialLogin.rejected,  rejected)
    // emailRegister
      .addCase(emailRegister.pending,   pending)
      .addCase(emailRegister.fulfilled, (state, a) => { state.loading = false; state.user = a.payload; state.initialized = true; })
      .addCase(emailRegister.rejected,  rejected)
    // emailLogin
      .addCase(emailLogin.pending,   pending)
      .addCase(emailLogin.fulfilled, (state, a) => { state.loading = false; state.user = a.payload; state.initialized = true; })
      .addCase(emailLogin.rejected,  rejected)
    // logout
      .addCase(logout.pending,   pending)
      .addCase(logout.fulfilled, (state) => { state.loading = false; state.user = null; })
      .addCase(logout.rejected,  rejected)
    // updateProfile
      .addCase(updateProfile_.pending,   pending)
      .addCase(updateProfile_.fulfilled, (state, a) => { state.loading = false; if (state.user) Object.assign(state.user, a.payload); })
      .addCase(updateProfile_.rejected,  rejected)
    // loadProfile
      .addCase(loadProfile.fulfilled, (state, a) => { if (state.user && a.payload) Object.assign(state.user, a.payload); });
  },
});

export const { setUser, clearUser, clearError } = authSlice.actions;

// ── Selectors ────────────────────────────────────────────────
export const selectUser        = (s) => s.auth.user;
export const selectAuthLoading = (s) => s.auth.loading;
export const selectAuthError   = (s) => s.auth.error;
export const selectInitialized = (s) => s.auth.initialized;

export default authSlice.reducer;
