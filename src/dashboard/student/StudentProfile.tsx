import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import AvatarUpload from "../../components/common/AvatarUpload";
import ProfileDetails from "../../components/common/ProfileDetails";
import EditProfileForm from "../../components/common/EditProfileForm";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserPapers = async () => {
      if (!user) return;

      const userId = user.id || user.objectId;
      if (!userId) return;

      setPapersLoading(true);
      try {
        const queryBuilder = Backendless.DataQueryBuilder.create()
          .setWhereClause(`ownerId = '${userId}'`)
          .setSortBy(["uploadedAt DESC"]); // Ensure field name matches your DB

        const fetched = await Backendless.Data.of("PastPapers").find(queryBuilder);

        const mapped = fetched.map((paper: any) => ({
          objectId: paper.objectId,
          title: paper.title,
          uploadedAt: paper.uploadedAt,
          approved: paper.approved,
        }));

        // Frontend fallback sort descending by uploadedAt
        mapped.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        setPapers(mapped);
      } catch (error) {
        console.error("Error fetching user papers:", error);
        setPapers([]);
      } finally {
        setPapersLoading(false);
      }
    };

    fetchUserPapers();
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

  const handleProfileUpdate = async (data: any) => {
    try {
      setIsSubmitting(true);
      await updateProfile(data);
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSubmitting(false);
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
          uid={user.id || user.objectId}
          currentAvatarUrl={profile?.avatarUrl}
          onUploadComplete={handleAvatarUploadComplete}
        />
        <div className="flex-1 w-full">
          {!isEditing ? (
            <>
              <ProfileDetails profile={profile} />
              <div className="mt-4 flex flex-col sm:flex-row sm:gap-4">
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  Edit Profile
                </Button>
              </div>
            </>
          ) : (
            <>
              <EditProfileForm
                defaultValues={{
                  name: profile?.name || "",
                  email: profile?.email || "",
                  semester: profile?.semester || "",
                  college: profile?.college || "",
                  avatarUrl: profile?.avatarUrl || "",
                }}
                onSubmit={handleProfileUpdate}
                isSubmitting={isSubmitting}
              />
              <div className="mt-4 flex flex-col sm:flex-row sm:gap-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
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
        onClick={() => signOut()}
        className="mt-10 bg-red-600 hover:bg-red-700 w-full md:w-auto"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default StudentProfile;
