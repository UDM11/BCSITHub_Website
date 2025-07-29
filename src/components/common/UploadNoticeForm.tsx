import React, { useState, ChangeEvent, FormEvent } from 'react';
import backendless from '../../lib/backendless';

interface Notice {
  objectId?: string;
  title: string;
  date: Date;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  category: 'Exam' | 'Admission' | 'Result' | 'General';
}

interface UploadNoticeFormProps {
  onUploadSuccess: (newNotice: Notice) => void;
}

const categories: Notice['category'][] = ['Exam', 'Admission', 'Result', 'General'];

const UploadNoticeForm: React.FC<UploadNoticeFormProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Notice['category']>('Exam');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      setFile(null);
      return;
    }

    setError('');
    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Notice title is required.');
      return;
    }

    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadedFile = await backendless.Files.upload(file, 'notice-pdfs', true);
      const publicUrl = uploadedFile.fileURL; // ✅ Correct public file URL

      const noticeToSave = {
        title: title.trim(),
        date: new Date(),
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        category,
      };

      const savedNotice = await backendless.Data.of('PU_Notices').save(noticeToSave);
      onUploadSuccess(savedNotice);

      // Reset form
      setTitle('');
      setCategory('Exam');
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 space-y-5">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Upload New PU Notice</h2>
      {error && <p className="text-red-600 font-medium">{error}</p>}

      <div>
        <label htmlFor="title" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Notice Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={uploading}
          placeholder="e.g., Exam Schedule for Fall 2025"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Notice['category'])}
          disabled={uploading}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="file" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">PDF File</label>
        <input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full file:cursor-pointer file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-md"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 disabled:opacity-60"
      >
        {uploading ? 'Uploading...' : 'Upload Notice'}
      </button>
    </form>
  );
};

export default UploadNoticeForm;
