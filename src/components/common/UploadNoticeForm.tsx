import React, { useState, ChangeEvent, FormEvent } from 'react';

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
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selectedFile);
    }
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

    // Simulate upload delay and create a new Notice object
    setTimeout(() => {
      const newNotice: Notice = {
        id: Date.now().toString(),
        title,
        date: new Date(),
        fileUrl: URL.createObjectURL(file), // replace with real uploaded file URL in production
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        category: category as Notice['category'],
      };

      onUploadSuccess(newNotice);

      setTitle('');
      setCategory('Exam');
      setFile(null);
      setUploading(false);
    }, 1500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
      aria-busy={uploading}
    >
      <h2 className="text-xl font-semibold mb-4">Upload New Notice</h2>

      {error && (
        <div className="mb-4 text-red-600 font-medium" role="alert">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block font-medium mb-1">
          Notice Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter notice title"
          disabled={uploading}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="category" className="block font-medium mb-1">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label htmlFor="file" className="block font-medium mb-1">
          PDF File
        </label>
        <input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200"
      >
        {uploading ? 'Uploading...' : 'Upload Notice'}
      </button>
    </form>
  );
};

export default UploadNoticeForm;
