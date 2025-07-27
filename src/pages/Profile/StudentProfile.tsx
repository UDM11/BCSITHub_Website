import React, { useState } from "react";
import { useProfile, ProfileData } from "../../context/ProfileContext";
import ProfileDetails from "../../components/Profile/ProfileDetails";
import EditProfileForm from "../../components/Profile/EditProfileForm";
import AvatarUpload from "../../components/Profile/AvatarUpload";
import { Loader2, Pencil } from "lucide-react";

const StudentProfile = () => {
  const { profile, updateProfile, loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  const handleProfileUpdate = async (data: ProfileData) => {
    try {
      setSubmitting(true);
      await updateProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Optionally show error toast here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>

      <div className="flex flex-col items-center space-y-6">
        {/* Avatar */}
        <AvatarUpload
          uid={profile.email} // Better use currentUser.uid if available
          currentAvatarUrl={profile.avatarUrl}
          onUploadComplete={(url) =>
            updateProfile({ ...profile, avatarUrl: url })
          }
        />

        {/* Profile Info */}
        {!isEditing ? (
          <>
            <ProfileDetails profile={profile} />
            <button
              onClick={() => setIsEditing(true)}
              disabled={submitting}
              className={`mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Pencil size={16} /> Edit Profile
            </button>
          </>
        ) : (
          <>
            <EditProfileForm
              defaultValues={profile}
              onSubmit={handleProfileUpdate}
              isSubmitting={submitting}
            />
            <button
              onClick={() => setIsEditing(false)}
              disabled={submitting}
              className="text-sm text-gray-500 hover:text-red-500 mt-2"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
