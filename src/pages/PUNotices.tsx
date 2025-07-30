import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  FileText,
  UploadCloud,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadNoticeForm from '../components/common/UploadNoticeForm';
import { motion } from 'framer-motion';
import Backendless from '../lib/backendless';
import { useNavigate } from 'react-router-dom';

interface Notice {
  objectId: string;
  title: string;
  date: Date;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  category: 'Exam' | 'Admission' | 'Result' | 'General';
}

const categories = ['Exam', 'Admission', 'Result', 'General'];

const LoginRedirectModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  message: string;
}> = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOk = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-xl w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold mb-3">Login Required</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-5">{message}</p>
        <button
          onClick={handleOk}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          OK
        </button>
      </div>
    </div>
  );
};

const PUNotices: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await Backendless.Data.of('PU_Notices').find();

        const formatted = data.map((item: any) => ({
          objectId: item.objectId,
          title: item.title,
          date: new Date(item.date),
          fileUrl: item.fileUrl,
          fileName: item.fileName,
          fileSize: item.fileSize,
          category: item.category,
        }));

        setNotices(formatted);
      } catch (err) {
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  useEffect(() => {
    if (showUploadModal || loginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showUploadModal, loginModalOpen]);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = searchTerm
      ? notice.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesCategory = selectedCategory ? notice.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Exam':
        return 'bg-red-100 text-red-800';
      case 'Admission':
        return 'bg-blue-100 text-blue-800';
      case 'Result':
        return 'bg-green-100 text-green-800';
      case 'General':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (notice: Notice) => {
    if (!user) {
      setLoginModalOpen(true);
      return;
    }

    if (notice.fileUrl && notice.fileUrl !== '#') {
      const link = document.createElement('a');
      link.href = notice.fileUrl;
      link.download = notice.fileName;
      link.target = '_blank';
      link.click();
    } else {
      alert('File URL not available.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing PU Notices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {loginModalOpen && (
        <LoginRedirectModal
          isOpen={loginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          message="Please login or signup to download notices."
        />
      )}

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section with y: -20 initial animation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">PU Notices</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Official notices and documents from Pokhara University specifically related to the BCSIT program.
            </p>

            <div className="flex flex-col sm:flex-row justify-center flex-wrap gap-3 mb-6">
              <a
                href="https://exam.pu.edu.np:9094/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors duration-200"
                aria-label="PU Result Portal"
              >
                <ExternalLink className="h-5 w-5" />
                <span>PU Result Portal</span>
              </a>

              {isAdmin && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  <UploadCloud className="h-5 w-5" />
                  <span>Upload Notice</span>
                </button>
              )}
            </div>
          </motion.div>

          {showUploadModal && isAdmin && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 sm:p-6 overflow-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg space-y-4 max-h-[90vh] overflow-auto"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-semibold text-gray-800">Upload Notice</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl leading-none"
                    aria-label="Close Upload Modal"
                  >
                    &times;
                  </button>
                </div>
                <UploadNoticeForm
                  onUploadSuccess={(newNotice) => {
                    setNotices((prev) => [newNotice, ...prev]);
                    setShowUploadModal(false);
                  }}
                />
              </motion.div>
            </div>
          )}

          {/* Content Section with y: 20 initial animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search Notices"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by Category"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredNotices.length} of {notices.length} notices
              </div>
            </div>

            <div className="space-y-4">
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <motion.div
                    key={notice.objectId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div className="flex-1 mb-4 sm:mb-0">
                      <div className="flex flex-wrap items-center space-x-3 mb-2">
                        <FileText className="h-6 w-6 text-blue-600 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-900 truncate max-w-full">{notice.title}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                            notice.category
                          )} flex-shrink-0`}
                        >
                          {notice.category}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {notice.date.toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">File:</span>{' '}
                          <span className="truncate max-w-xs inline-block">{notice.fileName}</span>
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {notice.fileSize}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(notice)}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 shrink-0"
                      aria-label={`Download ${notice.fileName}`}
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12"
                >
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search criteria or check back later for new notices.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PUNotices;