// src/dashboard/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import Backendless from "backendless";
import { PaperCard } from "../../components/Notes/PaperCard";

interface Paper {
  objectId: string;
  title: string;
  subject: string;
  semester: number;
  examType: string;
  college: string;
  uploadedAt: string | Date;
  uploadedBy: string;
  downloads: number;
  approved: boolean;
  fileUrl: string;
}

export default function AdminDashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnapprovedPapers();
  }, []);

  const fetchUnapprovedPapers = async () => {
    setLoading(true);
    try {
      const queryBuilder = Backendless.DataQueryBuilder.create();
      queryBuilder.setWhereClause("approved = false");
      queryBuilder.setSortBy(["uploadedAt DESC"]);

      const data: Paper[] = await Backendless.Data.of("PastPapers").find(queryBuilder);
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
      await Backendless.Data.of("PastPapers").save({
        objectId: id,
        approved: true,
      });
      toast.success("Paper approved");
      fetchUnapprovedPapers();
    } catch (error: any) {
      console.error("Error approving paper:", error);
      toast.error(error.message || "Failed to approve paper");
    }
  };

  const rejectPaper = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to reject this paper?");
    if (!confirmed) return;

    try {
      await Backendless.Data.of("PastPapers").remove(id);
      toast.success("Paper rejected");
      fetchUnapprovedPapers();
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
                  objectId: paper.objectId,
                  title: paper.title,
                  fileUrl: paper.fileUrl,
                  downloads: paper.downloads || 0,
                }}
              />
              <p className="text-xs mt-2 text-gray-600">
                <strong>Uploaded by:</strong> {paper.uploadedBy || "Unknown"}<br />
                <strong>Subject:</strong> {paper.subject} <br />
                <strong>Semester:</strong> {paper.semester} <br />
                <strong>College:</strong> {paper.college} <br />
                <strong>Exam Type:</strong> {paper.examType} <br />
                <strong>Uploaded on:</strong>{" "}
                {paper.uploadedAt
                  ? new Date(paper.uploadedAt).toLocaleString()
                  : "Unknown"}
              </p>
              <div className="flex gap-2 mt-3">
                <Button onClick={() => approvePaper(paper.objectId)}>
                  ✅ Approve
                </Button>
                <Button onClick={() => rejectPaper(paper.objectId)} variant="destructive">
                  ❌ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No unapproved papers found.</p>
      )}
    </div>
  );
}
