import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ChevronLeft, Download } from "lucide-react";
import html2pdf from "html2pdf.js";
import { motion } from "framer-motion";

export default function ChapterNotes() {
  const { semesterId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();

  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!semesterId || !subjectId || !chapterId) {
      setError("Missing URL parameters.");
      setLoading(false);
      return;
    }

    const encodedSemester = encodeURIComponent(`Semester ${semesterId}`);
    const encodedSubject = encodeURIComponent(subjectId);
    const filePath = `/notes/${encodedSemester}/${encodedSubject}/${chapterId}.html`;

    setLoading(true);
    setError(null);
    window.scrollTo(0, 0);

    // Simulate delay with fetch
    const delay = new Promise((res) => setTimeout(res, 1500)); // 1.5 seconds

    Promise.all([
      fetch(filePath)
        .then((res) => {
          if (!res.ok) throw new Error("Note not found.");
          return res.text();
        }),
      delay,
    ])
      .then(([data]) => {
        setHtmlContent(data);
      })
      .catch(() => {
        setError("This chapter note does not exist or failed to load.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [semesterId, subjectId, chapterId]);

  useEffect(() => {
    if (chapterId) {
      document.title = `${chapterId.toUpperCase()} Notes | BCSITHub`;
    }
  }, [chapterId]);

  const downloadAsPDF = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: 0.5,
      filename: `${chapterId}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(contentRef.current).save();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Note...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Breadcrumb */}
        <motion.div
          className="text-sm text-gray-600 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          Notes &gt; Semester {semesterId} &gt; {subjectId?.replace(/-/g, " ")} &gt;{" "}
          {chapterId}
        </motion.div>

        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6 flex-wrap gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
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

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
            {chapterId
              ?.replace(/-/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}{" "}
            Notes
          </h2>

          <Button
            variant="outline"
            className="flex items-center gap-1"
            onClick={downloadAsPDF}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </motion.div>

        {/* Notes Viewer */}
        <motion.div
          ref={contentRef}
          className="prose max-w-none border border-gray-200 rounded-md p-6 shadow-sm bg-gray-50 min-h-[300px] overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {error && (
            <div className="text-center text-red-600 font-semibold">
              <p>{error}</p>
              <Button
                variant="outline"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!error && (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
