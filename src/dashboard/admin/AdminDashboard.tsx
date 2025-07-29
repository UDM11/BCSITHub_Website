// src/dashboard/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import Backendless from "backendless";
import { PaperCard } from "../../components/Notes/PaperCard";

interface Paper {
  objectId: string;   // Backendless uses objectId as default PK
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
    try {
      // Query all papers ordered by timestamp descending
      const queryBuilder = Backendless.DataQueryBuilder.create();
      queryBuilder.setSortBy(["timestamp DESC"]);

      const data: Paper[] = await Backendless.Data.of("past_papers").find(queryBuilder);
      setPapers(data);
    } catch (error: any) {
      console.error("Error fetching papers:", error);
      toast.error(error.message || "Failed to fetch papers");
    } finally {
      setLoading(false);
    }
  };

  const approvePaper = async (id: string) => {
    try {
      await Backendless.Data.of("past_papers").save({
        objectId: id,
        approved: true,
      });
      toast.success("Paper approved");
      fetchPapers();
    } catch (error: any) {
      console.error("Error approving paper:", error);
      toast.error(error.message || "Failed to approve paper");
    }
  };

  const rejectPaper = async (id: string) => {
    try {
      await Backendless.Data.of("past_papers").remove(id);
      toast.success("Paper rejected");
      fetchPapers();
    } catch (error: any) {
      console.error("Error rejecting paper:", error);
      toast.error(error.message || "Failed to reject paper");
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
              key={paper.objectId}
              className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow"
            >
              <PaperCard
                paper={{
                  id: paper.objectId,
                  title: paper.title || "Untitled",
                  file_url: paper.file_url || "",
                  downloads: 0, // Extend schema if needed
                }}
              />
              <p className="text-xs mt-2 text-gray-600">
                Uploaded by: {paper.uploaded_by || "Unknown"}
                <br />
                Uploaded on:{" "}
                {paper.timestamp
                  ? new Date(paper.timestamp).toLocaleString()
                  : "Unknown"}
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => approvePaper(paper.objectId)}
                  disabled={paper.approved}
                >
                  {paper.approved ? "✅ Approved" : "Approve"}
                </Button>
                <Button onClick={() => rejectPaper(paper.objectId)} variant="destructive">
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
