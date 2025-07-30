import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import AvatarUpload from "../../components/common/AvatarUpload";
import ProfileDetails from "../../components/common/ProfileDetails";
import { Button } from "../../components/ui/Button";
import Backendless from "backendless";

interface Paper {
  objectId: string;
  title: string;
  uploadedAt: string;
  approved: boolean;
}

const StudentProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile, refreshProfile } = useProfile();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [papersLoading, setPapersLoading] = useState(true);
  const [role, setRole] = useState<string>("");

  // Fetch user role and papers
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        const backendlessUser = await Backendless.UserService.getCurrentUser();
        if (backendlessUser && backendlessUser.role) {
          setRole(backendlessUser.role); // student | teacher | admin
        }

        const userId = user.uid ?? user.id;

        const queryBuilder = Backendless.DataQueryBuilder.create()
          .setWhereClause(`uploadedBy = '${userId}'`)
          .setSortBy(["uploadDate DESC"]);

        const fetched = await Backendless.Data.of("PastPapers").find(queryBuilder);

        const mapped = fetched.map((paper: any) => ({
          objectId: paper.objectId,
          title: paper.title,
          uploadedAt: paper.uploadDate,
          approved: paper.approved,
        }));

        setPapers(mapped);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setPapers([]);
      } finally {
        setPapersLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const handleAvatarUploadComplete = async (uploadedUrl: string) => {
    try {
      if (updateProfile) {
        await updateProfile({ avatarUrl: uploadedUrl });
        await refreshProfile();
      }
    } catch (err) {
      console.error("Failed to update avatar URL in profile:", err);
    }
  };

  if (!user && !profileLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <p className="text-red-600 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  if (profileLoading || papersLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <AvatarUpload
          uid={user.uid || user.id}
          currentAvatarUrl={profile?.avatarUrl}
          onUploadComplete={handleAvatarUploadComplete}
        />
        <ProfileDetails profile={profile} role={role} />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Uploaded Past Papers</h2>
        {papers.length > 0 ? (
          <ul className="space-y-4">
            {papers.map((paper) => (
              <li
                key={paper.objectId}
                className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
              >
                <p className="text-base">
                  <strong>Title:</strong> {paper.title}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Uploaded:</strong> {new Date(paper.uploadedAt).toLocaleString()}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  {paper.approved ? (
                    <span className="text-green-600">✅ Approved</span>
                  ) : (
                    <span className="text-yellow-600">⏳ Pending</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past papers uploaded yet.</p>
        )}
      </div>

      <Button
        onClick={() => signOut("backendless")}
        className="mt-10 bg-red-600 hover:bg-red-700 w-full md:w-auto"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default StudentProfile;
