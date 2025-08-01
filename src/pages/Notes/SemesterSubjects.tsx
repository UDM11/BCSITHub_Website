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
  const [semester, setSemester] = useState(() =>
    semestersData.find((sem) => sem.id === Number(semesterId))
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundSemester = semestersData.find((sem) => sem.id === Number(semesterId));
      setSemester(foundSemester || null);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [semesterId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Subjects...</p>
        </div>
      </div>
    );
  }

  if (!semester) {
    return (
      <div className="text-center py-12 text-red-600 text-lg">
        Semester not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/notes')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Semesters
          </Button>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800"
          >
            {semester.name} - Subjects
          </motion.h2>

          <div className="w-[120px]" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {semester.subjects.map((subject, index) => (
            <motion.div
              key={subject.courseCode + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Link
                to={`/notes/semester/${semesterId}/subject/${encodeURIComponent(
                  subject.courseCode
                )}`}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="text-center py-6">
                    <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-700">
                      {subject.courseName}
                    </h3>
                    <p className="text-sm text-gray-500">{subject.courseCode}</p>
                    <p className="text-sm text-gray-500">
                      Credits: {subject.credits}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
