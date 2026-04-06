// src/services/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

// ── Providers ────────────────────────────────────────────────
export const googleProvider  = new GoogleAuthProvider();
export const githubProvider  = new GithubAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

// ── Helpers ──────────────────────────────────────────────────

/** Upsert a user document in Firestore after any sign-in */
export const upsertUserDoc = async (user) => {
  const ref  = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      uid:         user.uid,
      displayName: user.displayName ?? "",
      email:       user.email ?? "",
      photoURL:    user.photoURL ?? "",
      provider:    user.providerData[0]?.providerId ?? "password",
      createdAt:   new Date().toISOString(),
      bio:         "",
      phone:       "",
      location:    "",
      website:     "",
    });
  }
  return (await getDoc(ref)).data();
};

/** Update editable profile fields in Firestore */
export const updateUserProfile = async (uid, fields) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { ...fields, updatedAt: new Date().toISOString() });
};

/** Fetch full user profile from Firestore */
export const fetchUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ── Auth actions ─────────────────────────────────────────────

export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGithub = () =>
  signInWithPopup(auth, githubProvider);

export const signInWithTwitter = () =>
  signInWithPopup(auth, twitterProvider);

export const registerWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseSignOut = () => signOut(auth);

export { onAuthStateChanged, updateProfile };
