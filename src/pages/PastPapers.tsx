import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload, Download, Calendar, School, FileText,
  Filter, Plus, Search
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { UploadPaperModal } from '../components/Notes/UploadPaperModal';
import Backendless from 'backendless';

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
  { value: 'Rajdhani Model College', label: 'Rajdhani Model College' },
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
}

export function PastPapers() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedExamType, setSelectedExamType] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        
        let queryBuilder = Backendless.DataQueryBuilder.create();
        
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
    return paper.approved || (user?.role === 'admin');
  });

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'midterm': return 'text-blue-600 bg-blue-100';
      case 'pre-board': return 'text-yellow-600 bg-yellow-100';
      case 'final': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
    // Increment download count
    // Note: You might want to implement this in Backendless with a custom business logic
  };

  const handleResetFilters = () => {
    setSelectedSemester('');
    setSelectedExamType('');
    setSelectedCollege('');
    setSearchQuery('');
  };

  const handleUploadClick = () => {
    if (!user) {
      alert('Please login or signup to upload papers.');
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
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading papers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Past Question Papers</h1>
            <p className="text-xl text-gray-600">
              Access and share previous exam papers from different colleges
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <br></br>
            <Button icon={Plus} onClick={handleUploadClick}>
              Upload Paper
            </Button>
          </motion.div>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button icon={Search} type="button">Search</Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Filter Papers</h3>
                </div>
                {(selectedSemester || selectedExamType || selectedCollege) && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select 
                  label="Semester" 
                  value={selectedSemester} 
                  onChange={e => { e.preventDefault(); setSelectedSemester(e.target.value); }}
                  options={semesters} 
                  placeholder="All Semesters" 
                />
                <Select 
                  label="Exam Type" 
                  value={selectedExamType} 
                  onChange={e => { e.preventDefault(); setSelectedExamType(e.target.value); }}
                  options={examTypes} 
                  placeholder="All Types" 
                />
                <Select 
                  label="College" 
                  value={selectedCollege} 
                  onChange={e => { e.preventDefault(); setSelectedCollege(e.target.value); }}
                  options={colleges} 
                  placeholder="All Colleges" 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {(selectedSemester || selectedExamType || selectedCollege || searchQuery) && (
          <div className="mb-4 flex justify-end">
            <Button variant="outline" onClick={handleResetFilters}>
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper, index) => (
            <motion.div
              key={paper.objectId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{paper.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <School className="w-4 h-4" />
                        <span>{paper.college}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                        Sem {paper.semester}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(paper.examType)}`}>
                        {paper.examType ? paper.examType.charAt(0).toUpperCase() + paper.examType.slice(1) : 'Unknown'}
                      </div>
                      {!paper.approved && user?.role === 'admin' && (
                        <div className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div><span className="font-medium">Subject:</span> {paper.subject}</div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Uploaded {new Date(paper.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    <div><span className="font-medium">By:</span> {paper.uploadedBy}</div>
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>{paper.downloads} downloads</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {paper.approved ? (
                      <Button className="w-full" icon={Download} onClick={() => {
                        if (!user) {
                          alert('Please login or signup to download papers.');
                          return;
                        }
                        handleDownload(paper.fileUrl);
                      }}>
                        Download Paper
                      </Button>
                    ) : user?.role === 'admin' ? (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => paper.objectId && handleApprove(paper.objectId)}>Approve</Button>
                        <Button variant="danger" size="sm" className="flex-1" onClick={() => paper.objectId && handleReject(paper.objectId)}>Reject</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" className="w-full" disabled>
                        Pending Approval
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPapers.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600">Try adjusting your filters or be the first to upload a paper!</p>
            {(selectedSemester || selectedExamType || selectedCollege) && (
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={handleResetFilters}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <UploadPaperModal
            onClose={() => setShowUploadModal(false)}
            user={user || {}}
            onUploadSuccess={() => {
              setSelectedSemester('');
              setSelectedExamType('');
              setSelectedCollege('');
              setSearchQuery('');
            }}
          />
        )}
      </div>
    </div>
  );
}