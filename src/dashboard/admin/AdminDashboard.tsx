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
      queryBuilder.setSortBy(["uploadedAt ASC"]);

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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading...</p>
      ) : papers.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <div
              key={paper.objectId}
              className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-5 flex flex-col justify-between"
            >
              <PaperCard
                paper={{
                  objectId: paper.objectId,
                  title: paper.title,
                  fileUrl: paper.fileUrl,
                  downloads: paper.downloads || 0,
                }}
              />
              <div className="mt-4 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Uploaded by:</strong> {paper.uploadedBy || "Unknown"}
                </p>
                <p>
                  <strong>Subject:</strong> {paper.subject}
                </p>
                <p>
                  <strong>Semester:</strong> {paper.semester}
                </p>
                <p>
                  <strong>College:</strong> {paper.college}
                </p>
                <p>
                  <strong>Exam Type:</strong> {paper.examType}
                </p>
                <p>
                  <strong>Uploaded on:</strong>{" "}
                  {paper.uploadedAt
                    ? new Date(paper.uploadedAt).toLocaleString()
                    : "Unknown"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  onClick={() => approvePaper(paper.objectId)}
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                >
                  ✅ Approve
                </Button>
                <Button
                  onClick={() => rejectPaper(paper.objectId)}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  ❌ Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No unapproved papers found.</p>
      )}
    </div>
  );
}
