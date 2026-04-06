// src/hooks/useAuthListener.js
// Syncs Firebase auth state into Redux on app boot.

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "@/services/firebase";
import { fetchUserProfile, auth } from "@/services/firebase";
import { setUser, clearUser } from "@/store/slices/authSlice";

const useAuthListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        dispatch(setUser({
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
        }));
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsub();
  }, [dispatch]);
};

export default useAuthListener;
