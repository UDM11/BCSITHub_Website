// src/pages/notes/ChapterNotes.tsx
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ChevronLeft, ChevronRight, Download, BookOpen, Clock, Eye, Share2, Bookmark, Menu, X, Search, ZoomIn, ZoomOut, RotateCcw, Printer, FileText, Star, Users, Calendar, Tag } from "lucide-react";
import html2pdf from "html2pdf.js";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AuthRequiredModal from "../../components/common/AuthRequiredModal";
import { chapterData } from "../../data/chapterData";

export default function ChapterNotes() {
  const { semesterId, subjectId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAuthenticated = !!user;

  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [readingTime, setReadingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Block scroll when modal or sidebar is open
  useEffect(() => {
    document.body.style.overflow = (showModal || sidebarOpen) ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal, sidebarOpen]);

  // Calculate reading time and progress
  useEffect(() => {
    if (htmlContent) {
      const text = htmlContent.replace(/<[^>]*>/g, '');
      const words = text.split(/\s+/).length;
      setReadingTime(Math.ceil(words / 200)); // 200 words per minute
    }
  }, [htmlContent]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get subject chapters
  const subjectChapters = useMemo(() => {
    if (!subjectId) return null;
    return chapterData.find((s) => s.courseCode === decodeURIComponent(subjectId)) || null;
  }, [subjectId]);

  const chapters = subjectChapters?.chapters || [];
  const currentIndex = chapters.findIndex((c) => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  // Fetch HTML notes
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

    const delay = new Promise((res) => setTimeout(res, 1500));
    Promise.all([
      fetch(filePath).then((res) => {
        if (!res.ok) throw new Error("Note not found.");
        return res.text();
      }),
      delay,
    ])
      .then(([data]) => setHtmlContent(data))
      .catch(() => setError("This chapter note does not exist or failed to load."))
      .finally(() => setLoading(false));
  }, [semesterId, subjectId, chapterId]);

  useEffect(() => {
    if (chapterId) document.title = `${chapterId.toUpperCase()} Notes | BCSITHub`;
  }, [chapterId]);

  const downloadAsPDF = () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
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

  const adjustFontSize = (increment: number) => {
    setFontSize(prev => Math.max(12, Math.min(24, prev + increment)));
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const shareContent = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${chapterId} Notes - BCSITHub`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="relative w-20 h-20 mx-auto mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Chapter Notes</h3>
            <p className="text-gray-500">Preparing your study materials...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 z-50"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Header */}
      <motion.header 
        className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/notes/semester/${semesterId}/subject/${subjectId}`)}
                className="flex items-center gap-1 sm:gap-2 hover:bg-indigo-50 hover:text-indigo-700 px-2 sm:px-3"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Back</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden hover:bg-indigo-50 px-2"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 text-center px-2 sm:px-4 min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                {chapterId?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden md:block truncate">
                {decodeURIComponent(subjectId || '')}
              </p>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBookmark}
                className={`hover:bg-indigo-50 px-2 ${isBookmarked ? 'text-yellow-500' : 'text-gray-500'}`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={shareContent}
                className="hover:bg-indigo-50 text-gray-500 px-2 hidden xs:flex"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={downloadAsPDF}
                className="hidden sm:flex items-center gap-1 sm:gap-2 hover:bg-indigo-600 hover:text-white px-2 sm:px-3"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline text-sm">PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <>
              {sidebarOpen && (
                <motion.div
                  className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSidebarOpen(false)}
                />
              )}
              
              <motion.aside
                className="fixed lg:sticky top-14 sm:top-16 left-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-72 sm:w-80 bg-white border-r border-gray-200 z-40 lg:z-auto overflow-y-auto"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Chapter Info</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      className="lg:hidden"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>



                  {/* Reading Tools */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Reading Tools</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">Font Size</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => adjustFontSize(-2)}
                            className="h-8 w-8 p-0"
                          >
                            <ZoomOut className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{fontSize}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => adjustFontSize(2)}
                            className="h-8 w-8 p-0"
                          >
                            <ZoomIn className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chapter Navigation */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Navigation</h3>
                    <div className="space-y-2">
                      {prevChapter && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto hover:bg-indigo-50"
                          onClick={() => navigate(`/notes/semester/${semesterId}/subject/${subjectId}/chapter/${prevChapter.id}`)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Previous</p>
                            <p className="text-xs text-gray-500 truncate">{prevChapter.title}</p>
                          </div>
                        </Button>
                      )}
                      
                      {nextChapter && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left p-3 h-auto hover:bg-indigo-50"
                          onClick={() => navigate(`/notes/semester/${semesterId}/subject/${subjectId}/chapter/${nextChapter.id}`)}
                        >
                          <ChevronRight className="w-4 h-4 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">Next</p>
                            <p className="text-xs text-gray-500 truncate">{nextChapter.title}</p>
                          </div>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 w-full min-w-0">
          <motion.div 
            className="w-full max-w-none lg:max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Content Header */}
            <motion.div 
              className="mb-4 sm:mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 overflow-x-auto">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Semester {semesterId}</span>
                <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{decodeURIComponent(subjectId || '')}</span>
                <ChevronRight className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="text-indigo-600 font-medium whitespace-nowrap">{chapterId}</span>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4">
                <div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {chapterId?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} Notes
                  </h1>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Updated recently</span>
                      <span className="xs:hidden">Recent</span>
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={downloadAsPDF}
                  className="sm:hidden bg-indigo-600 hover:bg-indigo-700 w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </motion.div>

            {/* Notes Content */}
            <motion.article
              ref={contentRef}
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 xl:p-12 overflow-x-auto"
              style={{ fontSize: `${Math.max(14, fontSize - 2)}px` }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {error ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Not Available</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                />
              )}
            </motion.article>

            {/* Navigation Footer */}
            <motion.div 
              className="mt-6 sm:mt-8 lg:mt-12 flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {/* Progress indicator */}
              <div className="text-center">
                <span className="text-xs sm:text-sm text-gray-500">
                  Chapter {currentIndex + 1} of {chapters.length}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / chapters.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center gap-4">
                {prevChapter ? (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/notes/semester/${semesterId}/subject/${subjectId}/chapter/${prevChapter.id}`)}
                    className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 flex-1 sm:flex-none min-w-0"
                  >
                    <ChevronLeft className="w-4 h-4 flex-shrink-0" />
                    <div className="text-left min-w-0">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="font-medium text-sm truncate">{prevChapter.title}</p>
                    </div>
                  </Button>
                ) : (
                  <div className="flex-1 sm:flex-none" />
                )}

                {nextChapter ? (
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/notes/semester/${semesterId}/subject/${subjectId}/chapter/${nextChapter.id}`)}
                    className="flex items-center gap-2 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 flex-1 sm:flex-none min-w-0"
                  >
                    <div className="text-right min-w-0">
                      <p className="text-xs text-gray-500">Next</p>
                      <p className="font-medium text-sm truncate">{nextChapter.title}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  </Button>
                ) : (
                  <div className="flex-1 sm:flex-none" />
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && <AuthRequiredModal onClose={() => setShowModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
