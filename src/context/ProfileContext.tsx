import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "./AuthContext";

// Define profile structure
export interface ProfileData {
  name: string;
  email: string;
  semester: string;
  college: string;
  avatarUrl?: string;
}

// Define context type
interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create context
const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

// Custom hook
export const useProfile = () => useContext(ProfileContext);

// Provider component
export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Use a ref to track mounted status to avoid setting state on unmounted component
  const mountedRef = React.useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const profileRef = doc(db, "users", currentUser.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        if (mountedRef.current) setProfile(profileSnap.data() as ProfileData);
      } else {
        const newProfile: ProfileData = {
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email || "",
          semester: "",
          college: "",
          avatarUrl: "",
        };
        await setDoc(profileRef, newProfile);
        if (mountedRef.current) setProfile(newProfile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [currentUser]);

  const updateProfile = useCallback(
    async (data: Partial<ProfileData>) => {
      if (!currentUser) return;

      try {
        const profileRef = doc(db, "users", currentUser.uid);
        await setDoc(profileRef, data, { merge: true });
        if (mountedRef.current) setProfile(prev => ({ ...(prev ?? {}), ...data }));
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    } else {
      if (mountedRef.current) {
        setProfile(null);
        setLoading(false);
      }
    }
  }, [currentUser, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{ profile, loading, updateProfile, refreshProfile: fetchProfile }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
