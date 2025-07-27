// src/components/Notes/PaperCard.tsx
import React from 'react';
import { Button } from '@/components/url/Button';
import { Download } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

type Paper = {
  id: string;
  title: string;
  fileUrl: string;
  downloads: number;
};

interface Props {
  paper: Paper;
}

export const PaperCard: React.FC<Props> = ({ paper }) => {
  const handleDownload = async () => {
    window.open(paper.fileUrl, '_blank');
    try {
      const paperRef = doc(db, 'past-papers', paper.id);
      await updateDoc(paperRef, {
        downloads: increment(1),
      });
    } catch (error) {
      console.error('Failed to update download count:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
      <p className="text-sm text-gray-500 mb-2">Downloads: {paper.downloads}</p>
      <Button
        icon={Download}
        className="w-full"
        onClick={handleDownload}
      >
        Download Paper
      </Button>
    </div>
  );
};
