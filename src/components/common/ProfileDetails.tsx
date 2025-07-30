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
      <section
        aria-live="polite"
        className="w-full max-w-md bg-white shadow-md rounded-xl p-6"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile Information</h2>
        <p className="text-center text-gray-500 py-8">No profile data available</p>
      </section>
    );
  }

  return (
    <section
      aria-label="User profile information"
      className="w-full max-w-md bg-white shadow-md rounded-xl p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">Profile Information</h2>

      <dl className="flex flex-col gap-4 text-sm sm:text-base">
        <div className="flex items-center justify-between">
          <dt className="font-semibold text-gray-700">Name:</dt>
          <dd className="text-gray-900 text-right">{profile.name || "-"}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="font-semibold text-gray-700">Email:</dt>
          <dd className="text-gray-900 text-right">{profile.email || "-"}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="font-semibold text-gray-700">Semester:</dt>
          <dd className="text-gray-900 text-right">{profile.semester || "-"}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="font-semibold text-gray-700">College:</dt>
          <dd className="text-gray-900 text-right">{profile.college || "-"}</dd>
        </div>

        <div className="flex items-center justify-between">
          <dt className="font-semibold text-gray-700">Role:</dt>
          <dd className="text-gray-900 text-right">{getRoleDisplay(profile.role)}</dd>
        </div>

        {profile.avatarUrl && (
          <div className="flex flex-col items-center mt-6">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name || "User"}'s avatar`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              loading="lazy"
            />
          </div>
        )}
      </dl>
    </section>
  );
};

export default ProfileDetails;
