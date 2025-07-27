import React from 'react';
import PaperList from '../../components/Notes/PaperList';
import { UploadPaperModal } from '../../components/Notes/UploadPaperModal';

const NotesPage = () => {
  return (
    <div>
      <h1>Notes & Past Papers</h1>
      <UploadPaperModal onClose={() => {}} user={{ name: 'Test User' }} />
      <PaperList />
    </div>
  );
};

export default NotesPage;
