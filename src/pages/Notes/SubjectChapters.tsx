import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronLeft, BookOpen } from 'lucide-react';
import { chapterData, SubjectChapters as SubjectChaptersType } from '../../data/chapterData';

export default function SubjectChapters() {
  const { semesterId, subjectId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subjectChapters, setSubjectChapters] = useState<SubjectChaptersType | null>(null);

  const decodedSubjectId = decodeURIComponent(subjectId || '');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Chapters...</p>
        </div>
      </div>
    );
  }

  if (!subjectChapters) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">No chapters found for subject "{decodedSubjectId}"</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Placeholder motion div for smooth animation entry */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
        />

        {/* Responsive container for button + heading */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 flex-wrap mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/notes/semester/${semesterId}`)}
            className="flex items-center gap-1 transition-colors duration-300 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 rounded-md px-3 py-2 whitespace-nowrap"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Subjects
          </Button>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl font-bold text-black text-center whitespace-nowrap"
          >
            {decodedSubjectId} - Chapters
          </motion.h2>
        </div>

        {/* Single-column vertical layout always */}
        <div className="grid grid-cols-1 gap-6">
          {subjectChapters.chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
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
                  <p className="text-sm text-gray-600 mt-1 max-w-xl">{chapter.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
