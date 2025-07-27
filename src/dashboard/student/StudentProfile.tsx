import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import AvatarUpload from "../../components/common/AvatarUpload";
import ProfileDetails from "../../components/common/ProfileDetails";
import { Button } from "../../components/ui/Button";
import { getUserPastPapers } from "../../services/uploadService";

interface Paper {
  id: string;
  title: string;
  uploadedAt: string;
  approved: boolean;
}

const StudentProfile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [papersLoading, setPapersLoading] = useState(true);

  useEffect(() => {
    const fetchPapers = async () => {
      if (user?.id || user?.uid) {
        setPapersLoading(true);
        try {
          const userId = user.uid ?? user.id;
          const fetched = await getUserPastPapers(userId);
          setPapers(fetched);
        } catch (error) {
          console.error("Error fetching papers:", error);
        } finally {
          setPapersLoading(false);
        }
      } else {
        setPapers([]);
        setPapersLoading(false);
      }
    };

    fetchPapers();
  }, [user]);

  if (!user && !profileLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">
            You must be logged in to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (papersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <AvatarUpload />
        <ProfileDetails profile={profile} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Your Uploaded Past Papers</h2>

        {papers.length > 0 ? (
          <ul className="space-y-3">
            {papers.map((paper) => (
              <li key={paper.id} className="border p-4 rounded-xl shadow-sm">
                <p>
                  <strong>Title:</strong> {paper.title}
                </p>
                <p>
                  <strong>Uploaded:</strong>{" "}
                  {new Date(paper.uploadedAt).toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {paper.approved ? "✅ Approved" : "⏳ Pending Approval"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past papers uploaded yet.</p>
        )}
      </div>

      <Button
        onClick={() => signOut("firebase")} // or 'supabase' as needed
        className="mt-8 bg-red-600 hover:bg-red-700 w-full md:w-auto"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default StudentProfile;
