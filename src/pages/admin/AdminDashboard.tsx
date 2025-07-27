import { useEffect, useState } from 'react';
import {
  getDocs,
  collection,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Button } from '../../components/ui/Button';

interface Paper {
  id: string;
  title?: string;
  description?: string;
  downloadURL?: string;
  uploadedBy?: string;
  timestamp?: Timestamp;
  approved?: boolean;
}

export default function AdminDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'pastPapers')); //  Check your collection name
      const fetchedPapers: Paper[] = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedPapers.push({ ...(data as Omit<Paper, 'id'>), id: docSnap.id });
      });

      setPapers(fetchedPapers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching papers:', error);
      toast.error(error instanceof Error ? error.message : 'Error fetching papers');
      setLoading(false);
    }
  };

  const approvePaper = async (id: string) => {
    try {
      await updateDoc(doc(db, 'pastPapers', id), { approved: true });
      toast.success('Paper approved');
      fetchPapers();
    } catch (error) {
      console.error('Error approving paper:', error);
      toast.error(error instanceof Error ? error.message : 'Error approving paper');
    }
  };

  const rejectPaper = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'pastPapers', id));
      toast.success('Paper deleted');
      fetchPapers();
    } catch (error) {
      console.error('Error rejecting paper:', error);
      toast.error(error instanceof Error ? error.message : 'Error rejecting paper');
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
              <h2 className="text-xl font-semibold mb-2">
                {paper.title || 'Untitled'}
              </h2>
              <p className="text-sm mb-2">{paper.description || 'No description'}</p>
              {paper.downloadURL && (
                <a
                  href={paper.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mb-2 block"
                >
                  Download
                </a>
              )}
              <p className="text-xs mb-2">Uploaded by: {paper.uploadedBy || 'Unknown'}</p>
              <p className="text-xs mb-4">
                Uploaded on:{' '}
                {paper.timestamp
                  ? paper.timestamp.toDate().toLocaleString()
                  : 'Unknown'}
              </p>
              <div className="flex gap-2">
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
