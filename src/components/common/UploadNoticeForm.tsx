import React, { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../../lib/supabase';

interface Notice {
  id: string;
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

const categories = ['Exam', 'Admission', 'Result', 'General'];

const UploadNoticeForm: React.FC<UploadNoticeFormProps> = ({ onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Exam');
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
      setError('Title is required.');
      return;
    }
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setError('');

    const timestamp = Date.now();
    const filePath = `notices/${timestamp}_${file.name}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('notice-pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('notice-pdfs').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      const newNotice: Notice = {
        id: timestamp.toString(),
        title,
        date: new Date(),
        fileUrl: publicUrl,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        category: category as Notice['category'],
      };

      onUploadSuccess(newNotice);

      // Reset form
      setTitle('');
      setCategory('Exam');
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError('Failed to upload notice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6"
      aria-busy={uploading}
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Upload New Notice</h2>

      {error && (
        <div className="mb-4 text-red-600 font-medium" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
          Notice Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Enter notice title"
          disabled={uploading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          disabled={uploading}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="file" className="block font-medium mb-1 text-gray-700 dark:text-gray-300">
          PDF File
        </label>
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
