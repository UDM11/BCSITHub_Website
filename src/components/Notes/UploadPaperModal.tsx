// src/components/Notes/UploadPaperModal.tsx
import React, { useState } from 'react';
import { storage, ID, databases } from '../../lib/appwrite';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { motion } from 'framer-motion';

interface User {
  name?: string;
  email?: string;
}

interface UploadPaperModalProps {
  onClose: () => void;
  user: User;
}

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
  { value: 'Other', label: 'Other College' },
];

export function UploadPaperModal({ onClose, user }: UploadPaperModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [examType, setExamType] = useState('');
  const [college, setCollege] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!title || !subject || !semester || !examType || !college || !file) {
      setMessage('Please fill all fields and upload a file.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1. Upload file to Appwrite Storage
      const uploadedFile = await storage.createFile(
        '6884d44c0014eeec5ba5', // <-- Replace with your Appwrite bucket ID
        ID.unique(),
        file,
        ['role:all'] // public read permission, adjust as needed
      );

      // 2. Save metadata to Appwrite Database
      await databases.createDocument(
        '6884e4a10013576029e0',   // <-- Replace with your Database ID
        '6884e6210018c64958a5',   // <-- Replace with your Collection ID
        ID.unique(),
        {
          title,
          subject,
          semester: parseInt(semester, 10),
          examType,
          college,
          fileId: uploadedFile.$id,  // reference uploaded file ID
          uploadedBy: user?.name || user?.email || 'Unknown',
          downloads: 0,
          approved: false,
          uploadedAt: new Date().toISOString(),
        }
      );

      setMessage('Paper uploaded successfully!');
      setTitle('');
      setSubject('');
      setSemester('');
      setExamType('');
      setCollege('');
      setFile(null);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setMessage(`Failed to upload. ${error.message || 'Try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800">Upload Past Paper</h2>

        <Input
          label="Paper Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Database Final 2024"
        />

        <Input
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Database Management System"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Semester" value={semester} onChange={(e) => setSemester(e.target.value)} options={semesters} />
          <Select label="Exam Type" value={examType} onChange={(e) => setExamType(e.target.value)} options={examTypes} />
          <Select label="College" value={college} onChange={(e) => setCollege(e.target.value)} options={colleges} />
        </div>

        <Input
          type="file"
          label="Upload PDF"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {message && (
          <p className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? 'Uploading...' : 'Submit'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
