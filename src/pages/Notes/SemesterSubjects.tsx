import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { semestersData } from '../../data/notesData';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export default function SemesterSubjects() {
  const { semesterId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState(null);

  useEffect(() => {
    const foundSemester = semestersData.find((sem) => sem.id === Number(semesterId));
    setSemester(foundSemester || null);
    setLoading(false);
  }, [semesterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center" role="status" aria-live="polite" aria-busy="true">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
            aria-hidden="true"
          ></div>
          <p className="mt-4 text-gray-600">Loading Subjects...</p>
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="text-center py-12 text-red-600 text-lg">
        <p>Semester not found.</p>
        <Button
          onClick={() => navigate('/notes')}
          className="mt-6"
          aria-label="Back to Semesters"
        >
          Back to Semesters
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with back button and title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center sm:justify-between gap-3 flex-wrap mb-10"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/notes')}
            className="flex items-center gap-1 transition-colors duration-300 ease-in-out hover:bg-indigo-100 hover:text-indigo-700 rounded-md px-3 py-2 whitespace-nowrap"
            aria-label="Go back to semesters list"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            Back to Semesters
          </Button>

          <motion.div
            aria-label={`Subjects for ${semester.name}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-black text-center whitespace-nowrap">
              {semester.name} - Subjects ({semester.subjects.length})
            </h2>
          </motion.div>

          {/* Responsive spacer using flex-grow */}
          <div className="flex-grow" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {semester.subjects.map((subject, index) => {
            // Default available true if not specified
            const available = subject.available !== false;

            const cardContent = (
              <Card
                as={available ? undefined : 'div'}
                className={`cursor-pointer rounded-md transition-shadow ${
                  available
                    ? 'hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                tabIndex={available ? 0 : -1}
                aria-disabled={!available}
              >
                <CardContent className="text-center py-6 relative">
                  <BookOpen
                    className={`w-8 h-8 mx-auto mb-3 ${
                      available ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                  <h3
                    className={`text-lg font-semibold ${
                      available ? 'text-gray-700' : 'text-gray-500'
                    }`}
                  >
                    {subject.courseName}
                  </h3>
                  <p className={`text-sm ${available ? 'text-gray-500' : 'text-gray-400'}`}>
                    {subject.courseCode}
                  </p>
                  <p className={`text-sm ${available ? 'text-gray-500' : 'text-gray-400'}`}>
                    Credits: {subject.credits}
                  </p>
                  {!available && (
                    <span className="absolute top-3 right-3 bg-yellow-300 text-yellow-900 px-2 py-0.5 text-xs rounded font-semibold select-none">
                      Coming Soon
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            return (
              <motion.div
                key={subject.courseCode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
              >
                {available ? (
                  <Link
                    to={`/notes/semester/${semesterId}/subject/${encodeURIComponent(
                      subject.courseCode
                    )}`}
                    aria-label={`View notes for subject ${subject.courseName}`}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
