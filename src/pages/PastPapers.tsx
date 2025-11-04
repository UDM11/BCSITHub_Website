import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Download, Calendar, School, FileText,
  Filter, Plus, Search, Eye, Star, TrendingUp, Users, Clock, BookOpen, Award, ChevronRight, Grid, List, SortAsc, X
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { UploadPaperModal } from '../components/Notes/UploadPaperModal';
import Backendless from 'backendless';
import LoginRedirectModal from '../components/common/LoginRedirectModal';

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

const examTypes = [
  { value: 'midterm', label: 'Midterm' },
  { value: 'pre-board', label: 'Pre-board' },
  { value: 'final', label: 'Final' },
];

const colleges = [
  { value: 'Pokhara University', label: 'Pokhara University' },
  { value: 'Ace Institute of Management', label: 'Ace Institute of Management' },
  { value: 'SAIM College', label: 'SAIM College' },
  { value: 'Apollo International College', label: 'Apollo International College' },
  { value: 'Quest International College', label: 'Quest International College' },
  { value: 'Shubhashree College of Management', label: 'Shubhashree College of Management' },
  { value: 'Liberty College', label: 'Liberty College' },
  { value: 'Uniglobe College', label: 'Uniglobe College' },
  { value: 'Medhavi College', label: 'Medhavi College' },
  { value: 'Crimson College of Technology', label: 'Crimson College of Technology' },
  { value: 'Rajdhani Model College', label: 'Rajdhani Model College' },
  { value: 'Excel Business College', label: 'Excel Business College' },
  { value: 'Malpi International College', label: 'Malpi International College' },
  { value: 'Nobel College', label: 'Nobel College' },
  { value: 'Boston International College', label: 'Boston International College' },
  { value: 'Pokhara College of Management', label: 'Pokhara College of Management' },
  { value: 'Apex College', label: 'Apex College' },
  { value: 'Other', label: 'Other College' }
];

interface Paper {
  objectId?: string;
  title: string;
  subject: string;
  semester: number;
  examType: string;
  college: string;
  uploadedAt: string | Date;
  uploadedBy: string;
  downloads: number;
  approved: boolean;
  fileUrl: string;
  ownerId?: string;
}

export function PastPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalMessage, setLoginModalMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'downloads' | 'name'>('date');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const papersPerPage = 18;

  const { user } = useAuth();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);

        let queryBuilder = Backendless.DataQueryBuilder.create();
        queryBuilder.setSortBy(['uploadedAt DESC']);
        queryBuilder.setPageSize(50);

        if (selectedSemester) {
          queryBuilder.setWhereClause(`semester = ${selectedSemester}`);
        }

        if (selectedExamType) {
          const existingWhere = queryBuilder.getWhereClause();
          queryBuilder.setWhereClause(
            existingWhere
              ? `${existingWhere} AND examType = '${selectedExamType}'`
              : `examType = '${selectedExamType}'`
          );
        }

        if (selectedCollege) {
          const existingWhere = queryBuilder.getWhereClause();
          queryBuilder.setWhereClause(
            existingWhere
              ? `${existingWhere} AND college = '${selectedCollege}'`
              : `college = '${selectedCollege}'`
          );
        }

        const result = await Backendless.Data.of('PastPapers').find<Paper>(queryBuilder);
        setPapers(result);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [selectedSemester, selectedExamType, selectedCollege]);

  const filteredPapers = papers.filter(paper => {
    if (searchQuery && !paper.subject.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return paper.approved || (user?.role === 'admin') || (user?.objectId === paper.ownerId);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredPapers.length / papersPerPage);
  const startIndex = (currentPage - 1) * papersPerPage;
  const endIndex = startIndex + papersPerPage;
  const currentPapers = filteredPapers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemester, selectedExamType, selectedCollege, searchQuery]);

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'text-blue-600 bg-blue-100';
      case 'pre-board': return 'text-yellow-600 bg-yellow-100';
      case 'final': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownload = async (paper: Paper) => {
    if (!user) {
      setLoginModalMessage("Please login or signup to download papers.");
      setShowLoginModal(true);
      return;
    }
    
    try {
      window.open(paper.fileUrl, '_blank');
      
      await Backendless.Data.of('PastPapers').save<Paper>({
        objectId: paper.objectId,
        downloads: (paper.downloads || 0) + 1
      });
      
      setPapers(prev => prev.map(p => 
        p.objectId === paper.objectId 
          ? { ...p, downloads: (p.downloads || 0) + 1 } 
          : p
      ));
    } catch (error) {
      console.error("Error updating download count:", error);
    }
  };

  const handleResetFilters = () => {
    setSelectedSemester('');
    setSelectedExamType('');
    setSelectedCollege('');
    setSearchQuery('');
  };

  const handleUploadClick = () => {
    if (!user) {
      setLoginModalMessage("Please login or signup to upload papers.");
      setShowLoginModal(true);
      return;
    }
    setShowUploadModal(true);
  };

  const handleApprove = async (paperId: string) => {
    try {
      await Backendless.Data.of('PastPapers').save<Paper>({
        objectId: paperId,
        approved: true
      });
      setPapers((prev) => prev.map(p => p.objectId === paperId ? { ...p, approved: true } : p));
    } catch (error) {
      alert('Failed to approve paper.');
    }
  };

  const handleReject = async (paperId: string) => {
    if (!window.confirm('Are you sure you want to reject and delete this paper?')) return;
    try {
      await Backendless.Data.of('PastPapers').remove(`objectId = '${paperId}'`);
      setPapers((prev) => prev.filter(p => p.objectId !== paperId));
    } catch (error) {
      alert('Failed to reject paper.');
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
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Past Papers</h3>
            <p className="text-gray-500">Preparing your study resources...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section 
        className="relative py-16 sm:py-20 lg:py-24 px-4 overflow-hidden"
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
            <FileText className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Past Question Papers
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-indigo-100 mb-8 px-4 sm:px-0">
              Access and share previous exam papers from different colleges
            </p>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {[
              { icon: FileText, label: 'Total Papers', value: papers.length },
              { icon: School, label: 'Colleges', value: colleges.length },
              { icon: Users, label: 'Contributors', value: '50+' },
              { icon: Download, label: 'Downloads', value: papers.reduce((sum, p) => sum + (p.downloads || 0), 0) }
            ].map((stat, index) => (
              <motion.div 
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                <div className="text-xs sm:text-sm text-indigo-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex justify-start"
          >
            <Button 
              onClick={handleUploadClick} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Upload Paper
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Controls Section */}
        <motion.section 
          className="py-6 sm:py-8 px-4 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="date">Latest</option>
                <option value="downloads">Most Downloaded</option>
                <option value="name">Name</option>
              </select>
              
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

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                    <select
                      value={selectedSemester}
                      onChange={(e) => setSelectedSemester(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Semesters</option>
                      {semesters.map((semester) => (
                        <option key={semester.value} value={semester.value}>
                          {semester.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <select
                      value={selectedExamType}
                      onChange={(e) => setSelectedExamType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {examTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                    <select
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">All Colleges</option>
                      {colleges.map((college) => (
                        <option key={college.value} value={college.value}>
                          {college.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {(selectedSemester || selectedExamType || selectedCollege) && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" onClick={handleResetFilters}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Papers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
        >
          <AnimatePresence>
            {currentPapers.map((paper, index) => (
              <motion.div
                key={paper.objectId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="h-full bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{paper.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                          <School className="w-4 h-4" />
                          <span className="truncate">{paper.college}</span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">Subject: {paper.subject}</div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                          Sem {paper.semester}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(paper.examType)}`}>
                          {paper.examType ? paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1) : 'Unknown'}
                        </div>
                        {!paper.approved && (
                          <div className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                            {user?.objectId === paper.ownerId ? 'Your Upload' : 'Pending'}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Uploaded {new Date(paper.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">By: {paper.uploadedBy}</span>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Download className="w-4 h-4" />
                          <span>{paper.downloads || 0}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {paper.approved ? (
                        <Button 
                          className="w-full bg-indigo-600 hover:bg-indigo-700" 
                          onClick={() => handleDownload(paper)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Paper
                        </Button>
                      ) : user?.role === 'admin' ? (
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:bg-green-50 hover:text-green-700 hover:border-green-300" 
                            onClick={() => paper.objectId && handleApprove(paper.objectId)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-300" 
                            onClick={() => paper.objectId && handleReject(paper.objectId)}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : user?.objectId === paper.ownerId ? (
                        <Button variant="ghost" className="w-full" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Waiting for Approval
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full" disabled>
                          <Clock className="w-4 h-4 mr-2" />
                          Pending Approval
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div 
            className="flex justify-center items-center space-x-2 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2"
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 min-w-[40px] ${
                  currentPage === page 
                    ? 'bg-indigo-600 text-white' 
                    : 'hover:bg-indigo-50 hover:text-indigo-700'
                }`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2"
            >
              Next
            </Button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredPapers.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.4 }} 
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or be the first to upload a paper!</p>
            {(selectedSemester || selectedExamType || selectedCollege) && (
              <Button
                variant="outline"
                className="mb-4"
                onClick={handleResetFilters}
              >
                Clear Filters
              </Button>
            )}
            <Button
              onClick={handleUploadClick}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Paper
            </Button>
          </motion.div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <UploadPaperModal
              onClose={() => setShowUploadModal(false)}
              user={user || {}}
              onUploadSuccess={(newPaper) => {
                setPapers(prev => [newPaper, ...prev]);
                setSelectedSemester('');
                setSelectedExamType('');
                setSelectedCollege('');
                setSearchQuery('');
              }}
            />
          )}
        </AnimatePresence>

        {/* Login Redirect Modal */}
        <LoginRedirectModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          message={loginModalMessage}
        />
      </div>
    </div>
  );
}