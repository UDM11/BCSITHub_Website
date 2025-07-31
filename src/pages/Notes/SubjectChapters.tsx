import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

import { chapterData, SubjectChapters as SubjectChaptersType } from '../../data/chapterData';

export default function SubjectChapters() {
  const { semesterId, subjectId } = useParams();
  const navigate = useNavigate();

  // Decode subjectId in case it has URL-encoded characters like spaces
  const decodedSubjectId = decodeURIComponent(subjectId || '');

  // Find chapters for the current subject code (after decoding)
  const subjectChapters: SubjectChaptersType | undefined = chapterData.find(
    (subject) => subject.courseCode === decodedSubjectId
  );

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
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/notes/semester/${semesterId}`)}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Subjects
          </Button>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-gray-800 text-center"
          >
            {decodedSubjectId} - Chapters
          </motion.h2>

          <div className="w-[120px]" /> {/* Empty space to balance layout */}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {subjectChapters.chapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer bg-gray-100 border border-gray-200 rounded-lg shadow p-4 hover:bg-gray-50"
              onClick={() =>
                navigate(
                  `/notes/semester/${semesterId}/subject/${encodeURIComponent(
                    decodedSubjectId
                  )}/chapter/${chapter.id}`
                )
              }
            >
              <h3 className="text-xl font-semibold text-gray-800">{chapter.title}</h3>
              {chapter.description && (
                <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
