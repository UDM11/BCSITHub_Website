import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { ChevronLeft, BookOpen, Search } from "lucide-react";
import {
  chapterData,
  SubjectChapters as SubjectChaptersType,
} from "../../data/chapterData";

export default function SubjectChapters() {
  const { semesterId, subjectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subjectChapters, setSubjectChapters] =
    useState<SubjectChaptersType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const decodedSubjectId = decodeURIComponent(subjectId || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = chapterData.find(
        (subject) => subject.courseCode === decodedSubjectId
      );
      setSubjectChapters(data || null);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [decodedSubjectId]);

  // Filter chapters based on search query
  const filteredChapters = useMemo(() => {
    if (!subjectChapters) return [];
    return subjectChapters.chapters.filter((chapter) =>
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subjectChapters]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="space-y-4 w-full max-w-3xl px-4">
          {/* Skeleton loader for heading */}
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          {/* Skeleton loader for list */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (!subjectChapters) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <BookOpen className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-red-600 text-lg font-medium mb-4">
          No chapters found for subject "{decodedSubjectId}"
        </p>
        <Button onClick={() => navigate(`/notes/semester/${semesterId}`)}>
          Back to Subjects
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar: Back Button, Title, Search */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6 flex-wrap">
          <Button
            variant="ghost"
            onClick={() => navigate(`/notes/semester/${semesterId}`)}
            className="flex items-center gap-1 hover:bg-indigo-100 hover:text-indigo-700 rounded-md px-3 py-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Subjects
          </Button>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-black text-center"
          >
            {decodedSubjectId} - Chapters
          </motion.h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Chapter Count */}
        <p className="text-gray-500 mb-4">
          {filteredChapters.length} Chapter
          {filteredChapters.length !== 1 ? "s" : ""} Available
        </p>

        {/* Chapters List */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 gap-6"
        >
          {filteredChapters.length === 0 ? (
            <div className="text-gray-500 text-center py-10">
              No chapters match your search.
            </div>
          ) : (
            filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer bg-gray-100 border border-gray-200 rounded-lg shadow p-4 hover:bg-gray-50 flex items-center gap-3"
                onClick={() =>
                  navigate(
                    `/notes/semester/${semesterId}/subject/${encodeURIComponent(
                      decodedSubjectId
                    )}/chapter/${chapter.id}`
                  )
                }
              >
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500 flex-shrink-0" />
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                    {chapter.title}
                  </h3>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mt-1 max-w-xl">
                      {chapter.description.length > 120
                        ? chapter.description.slice(0, 120) + "..."
                        : chapter.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
}
