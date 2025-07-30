import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function SubjectNotes() {
  const { semesterId, subjectId } = useParams<{ semesterId: string; subjectId: string }>();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const normalizeSubjectId = (id: string) => id.toUpperCase().replace(/\s+/g, '-');

  useEffect(() => {
    const fetchPdf = async () => {
      if (!semesterId || !subjectId) {
        setError('Invalid semester or subject ID');
        setLoading(false);
        return;
      }

      const primaryPath = `/notes/${semesterId}/${normalizeSubjectId(subjectId)}.pdf`;
      const alternativePath = `/notes/${semesterId}/${subjectId.replace(/\s+/g, '').toUpperCase()}.pdf`;

      try {
        const resPrimary = await fetch(primaryPath, { method: 'HEAD' });
        if (resPrimary.ok) {
          setPdfUrl(primaryPath);
          setError('');
        } else {
          const resAlt = await fetch(alternativePath, { method: 'HEAD' });
          if (resAlt.ok) {
            setPdfUrl(alternativePath);
            setError('');
          } else {
            setError(`Notes for ${subjectId.replace(/-/g, ' ')} are not available.`);
            setPdfUrl('');
          }
        }
      } catch {
        setError(`Failed to load notes for ${subjectId.replace(/-/g, ' ')}`);
        setPdfUrl('');
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [semesterId, subjectId]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">
            {subjectId?.replace(/-/g, ' ')} (Semester {semesterId})
          </h1>
        </div>

        <div
          className="bg-white shadow rounded-lg p-4 text-gray-800 min-h-[400px]"
          aria-live="polite"
          aria-busy={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center h-full" role="status" aria-label="Loading notes">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-500 font-semibold mt-4">{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Back to Subjects
              </button>
            </div>
          ) : (
            <>
              <div className="w-full overflow-hidden rounded border">
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  title={`Notes for ${subjectId?.replace(/-/g, ' ')}`}
                  className="w-full h-[500px] sm:h-[600px]"
                  aria-label={`PDF viewer for notes of ${subjectId?.replace(/-/g, ' ')}`}
                />
              </div>
              <div className="mt-4 flex justify-center sm:justify-end">
                <a
                  href={pdfUrl}
                  download
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Download PDF notes for ${subjectId?.replace(/-/g, ' ')}`}
                >
                  Download PDF
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
