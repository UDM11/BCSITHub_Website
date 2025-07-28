// src/components/Notes/UploadPaperModal.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
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
  onUploadSuccess?: () => void;
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

export function UploadPaperModal({ onClose, user, onUploadSuccess }: UploadPaperModalProps) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [examType, setExamType] = useState('');
  const [college, setCollege] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Prevent background scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleUpload = async () => {
    if (!title || !subject || !semester || !examType || !college || files.length === 0) {
      setMessage('Please fill all fields and upload at least one file.');
      return;
    }
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setMessage('Only PDF or image files (jpg, png) are allowed.');
        return;
      }
    }
    setLoading(true);
    setMessage('');
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `papers/${Date.now()}_${file.name}`;
        // Upload to Supabase Storage
        const { error: storageError } = await supabase.storage
          .from('past-papers')
          .upload(filePath, file);
        if (storageError) throw storageError;
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('past-papers')
          .getPublicUrl(filePath);
        const fileUrl = urlData?.publicUrl;
        // Save metadata in Supabase Table
        const { error: dbError } = await supabase.from('past_papers').insert([
          {
            title,
            subject,
            semester: parseInt(semester),
            exam_type: examType,
            college,
            file_url: fileUrl,
            uploaded_by: user?.name || user?.email || 'Unknown',
            downloads: 0,
            approved: false,
            uploaded_at: new Date().toISOString(),
          },
        ]);
        if (dbError) throw dbError;
      }
      setMessage('All files uploaded successfully!');
      setTitle('');
      setSubject('');
      setSemester('');
      setExamType('');
      setCollege('');
      setFiles([]);
      if (typeof onUploadSuccess === 'function') onUploadSuccess();
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
          label="Upload Files"
          accept="application/pdf,image/jpeg,image/png,image/jpg"
          multiple
          onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
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
