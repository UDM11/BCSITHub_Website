import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function SubjectNotes() {
  const { semesterId, subjectId } = useParams();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!semesterId || !subjectId) {
      setError('Invalid semester or subject ID');
      setLoading(false);
      return;
    }

    // Normalize subject ID to match your file naming convention
    const normalizedSubjectId = subjectId.toUpperCase().replace(/\s+/g, '-');
    const filePath = `/notes/${semesterId}/${normalizedSubjectId}.pdf`;

    // Create a hidden anchor to check file existence
    const link = document.createElement('a');
    link.href = filePath;
    link.style.display = 'none';
    document.body.appendChild(link);

    const checkFileExists = () => {
      fetch(filePath, { method: 'HEAD' })
        .then((res) => {
          if (res.ok) {
            setPdfUrl(filePath);
            setError('');
          } else {
            throw new Error('PDF not found');
          }
        })
        .catch(() => {
          // Try alternative naming pattern if first attempt fails
          const alternativePath = `/notes/${semesterId}/${subjectId.replace(/\s+/g, '').toUpperCase()}.pdf`;
          fetch(alternativePath, { method: 'HEAD' })
            .then((res) => {
              if (res.ok) {
                setPdfUrl(alternativePath);
                setError('');
              } else {
                throw new Error('PDF not found');
              }
            })
            .catch(() => {
              setError(`Notes for ${subjectId.replace(/-/g, ' ')} are not available.`);
              setPdfUrl('');
            });
        })
        .finally(() => {
          setLoading(false);
          document.body.removeChild(link);
        });
    };

    // Add event listener to handle offline case
    link.onerror = () => {
      setError(`Failed to load notes for ${subjectId.replace(/-/g, ' ')}`);
      setLoading(false);
      document.body.removeChild(link);
    };

    checkFileExists();
  }, [semesterId, subjectId]);

  // ... rest of your component remains the same ...
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
            aria-label="Go back"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            {subjectId?.replace(/-/g, ' ')} (Semester {semesterId})
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-gray-800 min-h-[400px]">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title={`Notes for ${subjectId?.replace(/-/g, ' ')}`}
              width="100%"
              height="600px"
              className="rounded border"
            />
          )}
        </div>
      </div>
    </div>
  );
}