import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, GraduationCap, Clock, Award, ChevronDown, Search, Filter, Grid, List } from 'lucide-react';
import { semesterData, specializationData } from '../data/syllabusData';


export function Syllabus() {
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
  const [expandedSpecialization, setExpandedSpecialization] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState<'semesters' | 'specializations'>('semesters');

  const toggleItem = (id: string, type: 'semester' | 'specialization') => {
    if (type === 'semester') {
      setExpandedSemester(prev => (prev === id ? null : id));
    } else {
      setExpandedSpecialization(prev => (prev === id ? null : id));
    }
  };

  const getFilteredData = () => {
    if (!searchTerm) return { semesters: semesterData, specializations: specializationData };
    
    const filteredSemesters = Object.fromEntries(
      Object.entries(semesterData).filter(([_, semester]) =>
        semester.courses.some(course => 
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.code?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    
    const filteredSpecializations = Object.fromEntries(
      Object.entries(specializationData).filter(([_, spec]) =>
        spec.courses.some(course => 
          course.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
    
    return { semesters: filteredSemesters, specializations: filteredSpecializations };
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? 
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">{part}</span> : 
        part
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300 }
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
          <motion.h3 
            className="text-xl font-semibold text-gray-700 mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Loading Curriculum
          </motion.h3>
          <p className="text-gray-500">Preparing your academic journey...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
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
        
        <div className="relative max-w-6xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <GraduationCap className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              BCSIT Curriculum
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto">
              Comprehensive 4-year Bachelor's program designed for the digital age
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-8 text-indigo-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>8 Semesters</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>127+ Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>5 Specializations</span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Controls Section */}
      <motion.section 
        className="py-8 px-4 bg-white/80 backdrop-blur-sm border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              {['semesters', 'specializations'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-white text-indigo-600 shadow-md'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Search and View Controls */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Results Info */}
          {searchTerm && (
            <motion.div 
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-blue-800">
                <span className="font-semibold">Search results for "{searchTerm}":</span>
                {' '}
                {Object.keys(getFilteredData().semesters).length + Object.keys(getFilteredData().specializations).length > 0 ? (
                  `Found in ${Object.keys(getFilteredData().semesters).length} semester(s) and ${Object.keys(getFilteredData().specializations).length} specialization(s)`
                ) : (
                  'No matching courses found'
                )}
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === 'semesters' ? (
              <motion.div
                key="semesters"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -100 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}
              >
                {Object.entries(getFilteredData().semesters).map(([id, semester]) => (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <div
                        onClick={() => toggleItem(id, 'semester')}
                        className="cursor-pointer p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden"
                      >
                        <motion.div 
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                              <span className="text-xl font-bold">{id}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{semester.title}</h3>
                              <p className="text-indigo-100">{semester.courses.length} Courses</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSemester === id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-6 h-6" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSemester === id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 space-y-3">
                              {semester.courses
                                .filter(course => !searchTerm || 
                                  course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  course.code?.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((course, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">{highlightText(course.name, searchTerm)}</p>
                                    <p className="text-sm text-gray-500">{course.code && highlightText(course.code, searchTerm)}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {course.credits} Credits
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="specializations"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: 100 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}
              >
                {Object.entries(getFilteredData().specializations).map(([id, spec]) => (
                  <motion.div
                    key={id}
                    variants={itemVariants}
                    whileHover="hover"
                    className="group"
                  >
                    <motion.div
                      variants={cardHoverVariants}
                      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <div
                        onClick={() => toggleItem(id, 'specialization')}
                        className="cursor-pointer p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white relative overflow-hidden"
                      >
                        <motion.div 
                          className="absolute inset-0 bg-white/10"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                              <Award className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold">{spec.title}</h3>
                              <p className="text-emerald-100">{spec.courses.length} Courses</p>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSpecialization === id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-6 h-6" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedSpecialization === id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 space-y-3">
                              {spec.courses
                                .filter(course => !searchTerm || 
                                  course.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((course, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors"
                                >
                                  <div>
                                    <p className="font-medium text-gray-900">{highlightText(course.name, searchTerm)}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                      {course.credits} Credits
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}