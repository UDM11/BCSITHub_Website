// src/components/Notes/PaperCard.tsx
import React from 'react';
import { Button } from '../ui/Button';
import { Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

type Paper = {
  id: string;
  title: string;
  file_url: string;
  downloads: number;
};

interface Props {
  paper: Paper;
}

export const PaperCard: React.FC<Props> = ({ paper }) => {
  const { isAuthenticated } = useAuth();

  const handleDownload = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to download papers.');
      return;
    }

    // Open the file in a new tab
    window.open(paper.file_url, '_blank');

    // Increment download count in Supabase
    try {
      const { error } = await supabase
        .from('past_papers')
        .update({ downloads: paper.downloads + 1 })
        .eq('id', paper.id);

      if (error) {
        console.error('Failed to update download count:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error during download update:', err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 dark:bg-zinc-900">
      <h3 className="font-semibold text-lg mb-2">{paper.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
        Downloads: {paper.downloads}
      </p>
      <Button
        icon={Download}
        className="w-full"
        onClick={handleDownload}
        disabled={!isAuthenticated}
      >
        {isAuthenticated ? 'Download Paper' : 'Login Required'}
      </Button>
    </div>
  );
};
