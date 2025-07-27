import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { storage } from '../../lib/appwrite';

type FileType = {
  $id: string;
  name: string;
};

const semesters = [
  { value: '1', label: '1st Semester' },
  { value: '2', label: '2nd Semester' },
  { value: '3', label: '3rd Semester' },
  { value: '4', label: '4th Semester' },
  { value: '5', label: '5th Semester' },
  { value: '6', label: '6th Semester' },
  { value: '7', label: '7th Semester' },
  { value: '8', label: '8th Semester' },
];

const PaperList = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await storage.listFiles('past-papers'); // Replace with your bucket ID
        setFiles(res.files);
      } catch (error) {
        console.error('Failed to fetch files', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const getFileViewUrl = (fileId: string) => {
    return storage.getFileView('past-papers', fileId).href;
  };

  if (loading) return <div>Loading papers...</div>;

  return (
    <div className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h3 className="text-2xl font-semibold mb-4">Uploaded Past Papers</h3>
      <ul className="list-disc list-inside space-y-2">
        {files.map((file) => (
          <li key={file.$id} className="text-indigo-700 hover:underline">
            {file.name}{' '}
            <a
              href={getFileViewUrl(file.$id)}
              target="_blank"
              rel="noreferrer"
              className="ml-2 text-indigo-500"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export function Notes() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-900 mb-2"
          >
            Notes & Study Materials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Access semester-wise notes and resources
          </motion.p>
        </div>

        {/* Semester Notes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {semesters.map((sem, index) => (
            <motion.div
              key={sem.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link to={`/notes/semester/${sem.value}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                  <CardContent className="text-center py-6">
                    <BookOpen className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">{sem.label}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Past Papers List */}
        <PaperList />
      </div>
    </div>
  );
}
