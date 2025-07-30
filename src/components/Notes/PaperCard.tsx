// src/components/Notes/PaperCard.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Backendless from 'backendless';
import LoginRedirectModal from '../common/LoginRedirectModal'; // ✅ Import the modal

type Paper = {
  objectId: string; // Backendless uses objectId as the primary key
  title: string;
  fileUrl: string;
  downloads: number;
};

interface Props {
  paper: Paper;
}

export const PaperCard: React.FC<Props> = ({ paper }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false); // ✅ Modal state

  const handleDownload = async () => {
    if (!isAuthenticated) {
      setShowModal(true); // ✅ Show modal instead of alert
      return;
    }

    // ✅ Open the file in a new tab
    window.open(paper.fileUrl, '_blank');

    // ✅ Increment download count in Backendless
    try {
      const updatedPaper = { ...paper, downloads: (paper.downloads || 0) + 1 };
      await Backendless.Data.of("PastPapers").save(updatedPaper);
    } catch (err) {
      console.error('Failed to update download count:', err);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-900">
        <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
          Downloads: {paper.downloads}
        </p>
        <Button
          icon={Download}
          className="w-full"
          onClick={handleDownload}
        >
          {isAuthenticated ? 'Download Paper' : 'Login Required'}
        </Button>
      </div>

      {/* ✅ Modal component */}
      <LoginRedirectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
