import React from "react";

interface ProfileData {
  name?: string;
  email?: string;
  semester?: string;
  college?: string;
  avatarUrl?: string;
  role?: string; // Expected values: "student", "teacher", "admin"
}

interface ProfileDetailsProps {
  profile: ProfileData | null;
}

const getRoleDisplay = (role?: string) => {
  switch (role?.toLowerCase()) {
    case "student":
      return "Student (S)";
    case "teacher":
      return "Teacher (T)";
    case "admin":
      return "Admin (A)";
    default:
      return "-";
  }
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile Information</h2>
        <div className="text-center text-gray-500 py-8">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">Profile Information</h2>

      <div className="flex flex-col gap-4 text-sm sm:text-base">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Name:</span>
          <span className="text-gray-900 text-right">{profile.name || "-"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Email:</span>
          <span className="text-gray-900 text-right">{profile.email || "-"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Semester:</span>
          <span className="text-gray-900 text-right">{profile.semester || "-"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">College:</span>
          <span className="text-gray-900 text-right">{profile.college || "-"}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Role:</span>
          <span className="text-gray-900 text-right">{getRoleDisplay(profile.role)}</span>
        </div>

        {profile.avatarUrl && (
          <div className="flex flex-col items-center mt-6">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name || "User"}'s avatar`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
