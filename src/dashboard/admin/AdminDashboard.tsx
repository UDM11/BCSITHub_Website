// src/dashboard/admin/AdminDashboard.tsx
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { PaperCard } from '../../components/Notes/PaperCard';

interface Paper {
  id: string;
  title?: string;
  description?: string;
  file_url?: string;
  uploaded_by?: string;
  timestamp?: string;
  approved?: boolean;
}

export default function AdminDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('past_papers')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching papers:', error);
      toast.error(error.message);
    } else {
      setPapers(data);
    }
    setLoading(false);
  };

  const approvePaper = async (id: string) => {
    const { error } = await supabase
      .from('past_papers')
      .update({ approved: true })
      .eq('id', id);

    if (error) {
      console.error('Error approving paper:', error);
      toast.error(error.message);
    } else {
      toast.success('Paper approved');
      fetchPapers();
    }
  };

  const rejectPaper = async (id: string) => {
    const { error } = await supabase
      .from('past_papers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error rejecting paper:', error);
      toast.error(error.message);
    } else {
      toast.success('Paper rejected');
      fetchPapers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : papers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
            >
              <PaperCard
                paper={{
                  id: paper.id,
                  title: paper.title || 'Untitled',
                  fileUrl: paper.file_url || '',
                  downloads: 0, // Optional: can extend schema to include this
                }}
              />
              <p className="text-xs mt-2 text-gray-600">
                Uploaded by: {paper.uploaded_by || 'Unknown'}<br />
                Uploaded on: {paper.timestamp
                  ? new Date(paper.timestamp).toLocaleString()
                  : 'Unknown'}
              </p>
              <div className="flex gap-2 mt-3">
                <Button onClick={() => approvePaper(paper.id)} disabled={paper.approved}>
                  {paper.approved ? '✅ Approved' : 'Approve'}
                </Button>
                <Button
                  onClick={() => rejectPaper(paper.id)}
                  variant="destructive"
                >
                  ❌ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No papers found.</p>
      )}
    </div>
  );
}