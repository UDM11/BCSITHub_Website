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
  objectId?: string;
  userId: string;
  name: string;
  email: string;
  semester: string;
  college: string;
  avatarUrl?: string;
  role: "student" | "teacher" | "admin";
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

        // Debug log for verification
        console.log("✅ Profile fetched from Backendless:", fetchedProfile);

        // Validate role, fallback to student if missing or invalid
        if (!fetchedProfile.role || !["student", "teacher", "admin"].includes(fetchedProfile.role)) {
          fetchedProfile.role = "student";
        }

        if (mountedRef.current) setProfile(fetchedProfile);
      } else {
        // Create new profile with default role student
        const newProfile: ProfileData = {
          userId: currentUser.uid,
          name: currentUser.displayName || "Anonymous",
          email: currentUser.email || "",
          semester: "",
          college: "",
          avatarUrl: "",
          role: "student",
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

          // Validate role before saving
          if (!updatedProfile.role || !["student", "teacher", "admin"].includes(updatedProfile.role)) {
            updatedProfile.role = "student";
          }

          await Backendless.Data.of("users").save(updatedProfile);
          if (mountedRef.current) setProfile(updatedProfile);
        } else {
          // Create new profile if none exists
          const newProfile = {
            userId: currentUser.uid,
            role: "student",
            ...data,
          } as ProfileData;
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
