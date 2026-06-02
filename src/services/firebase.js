

import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// ── Firebase project config ───────────────────────────────────────────────────
// Values come from .env  (VITE_ prefix exposes them to the browser build)
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialise Firebase app (singleton — safe to call multiple times)
const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ── Google provider ───────────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ── Auth helpers ──────────────────────────────────────────────────────────────

/** Open Google sign-in popup and return the Firebase user object */
export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/** Sign the current user out of Firebase */
export const firebaseSignOut = () => signOut(auth);

/**
 * Subscribe to Firebase auth-state changes.
 * Returns the unsubscribe function — call it in a useEffect cleanup.
 */
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback);

export default app;