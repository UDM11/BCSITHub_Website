import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ChevronLeft } from "lucide-react";

export default function ChapterNotes() {
  const { semesterId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!semesterId || !subjectId || !chapterId) {
      setError("Missing URL parameters.");
      setLoading(false);
      return;
    }

    // Build file path inside public folder
    // Replace spaces with %20 for URL encoding
    const encodedSemester = encodeURIComponent(`Semester ${semesterId}`);
    const encodedSubject = encodeURIComponent(subjectId);
    const filePath = `/notes/${encodedSemester}/${encodedSubject}/${chapterId}.html`;

    setLoading(true);
    setError(null);

    fetch(filePath)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Note not found.");
        }
        return res.text();
      })
      .then((data) => {
        setHtmlContent(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [semesterId, subjectId, chapterId]);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() =>
              navigate(`/notes/semester/${semesterId}/subject/${subjectId}`)
            }
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Chapters
          </Button>

          <h2 className="text-3xl font-bold text-gray-800">
            {chapterId?.toUpperCase()} Notes
          </h2>

          <div className="w-[120px]" />
        </div>

        <div className="prose max-w-none border border-gray-200 rounded-md p-6 shadow-sm bg-gray-50 min-h-[300px] overflow-auto">
          {loading && <p className="text-center text-gray-500">Loading note...</p>}

          {error && (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          )}

          {!loading && !error && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </div>
      </div>
    </div>
  );
}
