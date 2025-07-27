import React, { useState, useEffect } from 'react';
import {
  Download,
  Calendar,
  FileText,
  UploadCloud,
  Search,
  ExternalLink,
} from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  date: Date;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  category: 'Exam' | 'Admission' | 'Result' | 'General';
}

const categories = ['Exam', 'Admission', 'Result', 'General'];

const UploadNoticeForm: React.FC<{ onUploadSuccess: (notice: Notice) => void }> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Exam' | 'Admission' | 'Result' | 'General'>('Exam');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileName || !fileUrl) {
      alert('Please fill in all fields');
      return;
    }

    const newNotice: Notice = {
      id: Date.now().toString(),
      title,
      category,
      date: new Date(),
      fileName,
      fileUrl,
      fileSize: fileSize || 'Unknown',
    };

    onUploadSuccess(newNotice);

    setTitle('');
    setCategory('Exam');
    setFileName('');
    setFileUrl('');
    setFileSize('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input type="text" className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notice title" required />
      </div>
      <div>
        <label className="block font-medium mb-1">Category</label>
        <select className="w-full border px-3 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value as Notice['category'])}>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">File Name</label>
        <input type="text" className="w-full border px-3 py-2 rounded" value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="example.pdf" required />
      </div>
      <div>
        <label className="block font-medium mb-1">File URL</label>
        <input type="url" className="w-full border px-3 py-2 rounded" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="https://example.com/file.pdf" required />
      </div>
      <div>
        <label className="block font-medium mb-1">File Size (optional)</label>
        <input type="text" className="w-full border px-3 py-2 rounded" value={fileSize} onChange={(e) => setFileSize(e.target.value)} placeholder="e.g. 300 KB" />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Upload Notice</button>
    </form>
  );
};

const PUNotices: React.FC = () => {
  const isAdmin = true;

  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    const sampleNotices: Notice[] = [];
    setNotices(sampleNotices);
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = searchTerm ? notice.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
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
    if (notice.fileUrl && notice.fileUrl !== '#') {
      window.open(notice.fileUrl, '_blank');
    } else {
      alert('File URL not available.');
    }
  };

  const handleUploadSuccess = (newNotice: Notice) => {
    setNotices((prev) => [newNotice, ...prev]);
    setShowUploadForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing PU Notices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PU Notices</h1>
          <p className="text-xl text-gray-600 mb-6">
            Official notices and documents from Pokhara University specifically related to the BCSIT program.
          </p>

          <div className="flex justify-center flex-wrap gap-3 mb-6">
            <a
              href="https://exam.pu.edu.np:9094/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              aria-label="PU Result Portal"
            >
              <ExternalLink className="h-5 w-5" />
              <span>PU Result Portal</span>
            </a>

            {isAdmin && (
              <button
                onClick={() => setShowUploadForm(!showUploadForm)}
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                <UploadCloud className="h-5 w-5" />
                <span>{showUploadForm ? 'Cancel Upload' : 'Upload Notice'}</span>
              </button>
            )}
          </div>
        </div>

        {showUploadForm && isAdmin && (
          <div className="mb-8">
            <UploadNoticeForm onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

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
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
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
              <div key={notice.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="h-6 w-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{notice.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(notice.category)}`}>{notice.category}</span>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{notice.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div><span className="font-medium">File:</span> {notice.fileName}</div>
                      <div><span className="font-medium">Size:</span> {notice.fileSize}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(notice)}
                    className="ml-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notices found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or check back later for new notices.</p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About PU Notices</h3>
              <p className="text-gray-600 leading-relaxed">
                This section contains official notices, circulars, and documents published by Pokhara University specifically related to the BCSIT program. All documents are uploaded by authorized administrators and are authentic university communications. For the most up-to-date information, always refer to the official Pokhara University website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PUNotices;
