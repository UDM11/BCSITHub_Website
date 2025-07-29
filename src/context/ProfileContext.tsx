import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import Backendless from "backendless";
import { useAuth } from "./AuthContext";

export interface ProfileData {
  objectId?: string;  // Backendless record id
  userId: string;     // user UID from auth
  name: string;
  email: string;
  semester: string;
  college: string;
  avatarUrl?: string;
}

interface ProfileContextType {
  profile: ProfileData | null;
  loading: boolean;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  profile: null,
  loading: true,
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // Avoid state updates after unmount
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!currentUser) {
      if (mountedRef.current) {
        setProfile(null);
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const queryBuilder = Backendless.DataQueryBuilder.create();
      queryBuilder.setWhereClause(`userId = '${currentUser.uid}'`);
      queryBuilder.setPageSize(1);

      const results = await Backendless.Data.of("users").find(queryBuilder);

      if (results.length > 0) {
        const fetchedProfile = results[0] as ProfileData;
        if (mountedRef.current) setProfile(fetchedProfile);
      } else {
        // Create new profile if none found
        const newProfile: ProfileData = {
          userId: currentUser.uid,
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email || "",
          semester: "",
          college: "",
          avatarUrl: "",
        };
        const savedProfile = await Backendless.Data.of("users").save(newProfile);
        if (mountedRef.current) setProfile(savedProfile);
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
        const queryBuilder = Backendless.DataQueryBuilder.create();
        queryBuilder.setWhereClause(`userId = '${currentUser.uid}'`);
        queryBuilder.setPageSize(1);

        const results = await Backendless.Data.of("users").find(queryBuilder);

        if (results.length > 0) {
          const existingProfile = results[0] as ProfileData;
          const updatedProfile = { ...existingProfile, ...data };
          await Backendless.Data.of("users").save(updatedProfile);
          if (mountedRef.current) setProfile(updatedProfile);
        } else {
          // Create new profile if not exists (unlikely)
          const newProfile = { userId: currentUser.uid, ...data } as ProfileData;
          const savedProfile = await Backendless.Data.of("users").save(newProfile);
          if (mountedRef.current) setProfile(savedProfile);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        updateProfile,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
