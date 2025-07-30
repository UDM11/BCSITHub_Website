// src/components/Notes/PaperCard.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Backendless from 'backendless';
import LoginRedirectModal from '../common/LoginRedirectModal';
import { toast } from 'sonner';

type Paper = {
  objectId: string;
  title: string;
  fileUrl: string;
  downloads: number;
};

interface Props {
  paper: Paper;
}

export const PaperCard: React.FC<Props> = ({ paper }) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }

    if (!paper.fileUrl) {
      toast.error("File URL is missing or invalid.");
      return;
    }

    // ✅ Open the file in a new tab before any async logic
    window.open(paper.fileUrl, '_blank');

    // ✅ Update the download count in Backendless
    try {
      await Backendless.Data.of("PastPapers").save({
        objectId: paper.objectId,
        downloads: (paper.downloads || 0) + 1,
      });
    } catch (err) {
      console.error('Failed to update download count:', err);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-900 flex flex-col justify-between h-full">
        <div>
          <h3 className="font-semibold text-lg mb-2 text-zinc-900 dark:text-zinc-100">
            {paper.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Downloads: {paper.downloads}
          </p>
        </div>
        <Button
          icon={Download}
          className="w-full mt-auto"
          onClick={handleDownload}
        >
          {isAuthenticated ? 'Download Paper' : 'Login Required'}
        </Button>
      </div>

      {/* 🔐 Login modal for unauthenticated users */}
      <LoginRedirectModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
