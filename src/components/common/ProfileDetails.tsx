import React from 'react';

interface ProfileData {
  name?: string;
  email?: string;
  semester?: string;
  college?: string;
  avatarUrl?: string;
}

interface ProfileDetailsProps {
  profile: ProfileData | null; // Allow profile to be null
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Profile Information</h2>
        <div className="text-center text-gray-500 py-8">
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Profile Information</h2>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <span className="font-semibold w-24 text-gray-700">Name:</span>
          <span className="text-gray-900">{profile.name || '-'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold w-24 text-gray-700">Email:</span>
          <span className="text-gray-900">{profile.email || '-'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold w-24 text-gray-700">Semester:</span>
          <span className="text-gray-900">{profile.semester || '-'}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-semibold w-24 text-gray-700">College:</span>
          <span className="text-gray-900">{profile.college || '-'}</span>
        </div>
        {profile.avatarUrl && (
          <div className="flex flex-col items-center mt-4">
            <img
              src={profile.avatarUrl}
              alt={`${profile.name || 'User'}'s avatar`}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDetails;
