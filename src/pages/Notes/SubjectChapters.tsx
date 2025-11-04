import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../components/ui/Button";
import { ChevronLeft, BookOpen, Search, Filter, Grid, List, Clock, FileText, Play, Star, Eye, Download, Award, TrendingUp, ChevronRight, Zap } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'order' | 'name' | 'popularity'>('order');
  const [filterType, setFilterType] = useState<'all' | 'available' | 'coming-soon'>('all');

  const decodedSubjectId = decodeURIComponent(subjectId || "");

  // Function to check if a note file exists
  const checkNoteExists = async (chapterId: string): Promise<boolean> => {
    try {
      const encodedSemester = encodeURIComponent(`Semester ${semesterId}`);
      const encodedSubject = encodeURIComponent(decodedSubjectId);
      const filePath = `/notes/${encodedSemester}/${encodedSubject}/${chapterId}.html`;
      const response = await fetch(filePath, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const loadChaptersWithAvailability = async () => {
      const data = chapterData.find(
        (subject) => subject.courseCode === decodedSubjectId
      );
      
      if (data) {
        // Check availability for each chapter
        const enhancedChapters = await Promise.all(
          data.chapters.map(async (chapter, index) => {
            const available = await checkNoteExists(chapter.id);
            return {
              ...chapter,
              views: Math.floor(Math.random() * 500) + 50,
              downloads: Math.floor(Math.random() * 200) + 20,
              rating: (Math.random() * 2 + 3).toFixed(1),
              duration: Math.floor(Math.random() * 30) + 10,
              difficulty: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
              lastUpdated: Math.floor(Math.random() * 30) + 1,
              available
            };
          })
        );
        setSubjectChapters({ ...data, chapters: enhancedChapters });
      } else {
        setSubjectChapters(null);
      }
      setLoading(false);
    };

    const timer = setTimeout(loadChaptersWithAvailability, 1200);
    return () => clearTimeout(timer);
  }, [decodedSubjectId, semesterId]);

  // Filter and sort chapters
  const filteredChapters = useMemo(() => {
    if (!subjectChapters) return [];
    
    let filtered = subjectChapters.chapters.filter((chapter) => {
      const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' ||
        (filterType === 'available' && chapter.available !== false) ||
        (filterType === 'coming-soon' && chapter.available === false);
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popularity':
          return (b.views || 0) - (a.views || 0);
        default:
          return a.id - b.id;
      }
    });
  }, [searchQuery, subjectChapters, sortBy, filterType]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const getSubjectStats = () => {
    if (!subjectChapters) return { total: 0, available: 0, avgRating: 0, totalViews: 0 };
    
    const total = subjectChapters.chapters.length;
    const available = subjectChapters.chapters.filter(c => c.available !== false).length;
    const avgRating = subjectChapters.chapters.reduce((sum, c) => sum + parseFloat(c.rating || '0'), 0) / total;
    const totalViews = subjectChapters.chapters.reduce((sum, c) => sum + (c.views || 0), 0);
    
    return { total, available, avgRating: avgRating.toFixed(1), totalViews };
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
          <motion.h3 
            className="text-xl font-semibold text-gray-700 mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Chapters
          </motion.h3>
          <p className="text-gray-500">Preparing your study materials...</p>
        </motion.div>
      </div>
    );
  }

  if (!subjectChapters) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Subject Not Found</h2>
          <p className="text-gray-600 mb-6">No chapters found for "{decodedSubjectId}"</p>
          <Button
            onClick={() => navigate(`/notes/semester/${semesterId}`)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
        </motion.div>
      </div>
    );
  }

  const stats = getSubjectStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-12 sm:py-16 lg:py-20 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-90"></div>
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(159, 122, 234, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 80%, rgba(99, 102, 241, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <div className="relative max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-start mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(`/notes/semester/${semesterId}`)}
              className="text-white hover:bg-white/20 border border-white/30 text-sm sm:text-base"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Subjects
            </Button>
          </motion.div>
          
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <BookOpen className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                {decodedSubjectId}
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-6 sm:mb-8 px-4 sm:px-0">
                Explore {stats.total} chapters with comprehensive study materials
              </p>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { icon: FileText, label: 'Total Chapters', value: stats.total },
                { icon: Award, label: 'Available', value: stats.available }
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-300" />
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-indigo-100">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Controls Section */}
      <motion.section 
        className="py-6 sm:py-8 px-4 bg-white/80 backdrop-blur-sm border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row lg:flex-row justify-between items-stretch sm:items-center gap-4">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
              {[{ key: 'all', label: 'All', fullLabel: 'All Chapters' }, { key: 'available', label: 'Available' }, { key: 'coming-soon', label: 'Soon', fullLabel: 'Coming Soon' }].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterType(filter.key as any)}
                  className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base ${
                    filterType === filter.key
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  title={filter.fullLabel || filter.label}
                >
                  <span className="sm:hidden">{filter.label}</span>
                  <span className="hidden sm:inline">{filter.fullLabel || filter.label}</span>
                </button>
              ))}
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>
              
              <div className="flex gap-3 sm:gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                >
                  <option value="order">Default</option>
                  <option value="name">Name</option>
                  <option value="popularity">Views</option>
                </select>
                
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Results Info */}
          {searchQuery && (
            <motion.div 
              className="mb-6 sm:mb-8 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-blue-800 text-sm sm:text-base">
                <span className="font-semibold">Search results for "{searchQuery}":</span>
                {' '}
                {filteredChapters.length > 0 ? (
                  `Found ${filteredChapters.length} chapter(s)`
                ) : (
                  'No matching chapters found'
                )}
              </p>
            </motion.div>
          )}

          {/* Chapters Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' : 'space-y-3 sm:space-y-4'}
          >
            <AnimatePresence>
              {filteredChapters.length === 0 ? (
                <motion.div 
                  className="col-span-full text-center py-12 sm:py-16 px-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No chapters found</h3>
                  <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
                </motion.div>
              ) : (
                filteredChapters.map((chapter, index) => {
                  const available = chapter.available !== false;
                  const difficultyColors = {
                    'Beginner': 'bg-green-100 text-green-800',
                    'Intermediate': 'bg-yellow-100 text-yellow-800',
                    'Advanced': 'bg-red-100 text-red-800'
                  };

                  const cardContent = (
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      className="group h-full"
                    >
                      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full transition-all duration-300 ${
                        available ? 'hover:shadow-xl cursor-pointer' : 'opacity-75'
                      }`}>
                        {/* Header */}
                        <div className="p-4 sm:p-6">
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                              available ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-400'
                            }`}>
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div className="flex flex-col gap-1 sm:gap-2">
                              {!available && (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full whitespace-nowrap">
                                  Coming Soon
                                </span>
                              )}
                              {available && (
                                <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${difficultyColors[chapter.difficulty]}`}>
                                  {chapter.difficulty}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <h3 className={`text-base sm:text-lg font-bold mb-2 line-clamp-2 ${
                            available ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {chapter.title}
                          </h3>
                          
                          {chapter.description && (
                            <p className={`text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3 ${
                              available ? 'text-gray-600' : 'text-gray-500'
                            }`}>
                              {chapter.description}
                            </p>
                          )}
                        </div>



                        {/* Footer */}
                        <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 ${
                          available ? 'bg-gray-50 group-hover:bg-indigo-50' : 'bg-gray-50'
                        }`}>
                          {available ? (
                            <div className="flex items-center justify-center">
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="text-xs sm:text-sm text-gray-500">Materials coming soon</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );

                  return (
                    <motion.div
                      key={chapter.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onClick={() => available && navigate(
                        `/notes/semester/${semesterId}/subject/${encodeURIComponent(
                          decodedSubjectId
                        )}/chapter/${chapter.id}`
                      )}
                    >
                      {cardContent}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
