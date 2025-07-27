import React from 'react';
import { Link, useParams } from 'react-router-dom';

type Props = {
  subject: {
    code: string;
    name: string;
  };
};

const SubjectCard = ({ subject }: Props) => {
  const { semesterId } = useParams(); // Get semesterId from URL

  // Generate a URL-friendly subjectId
  const subjectId = subject.name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Link to={`/notes/semester/${semesterId}/subject/${subjectId}`}>
      <div className="p-4 border rounded-md shadow-sm bg-white hover:bg-gray-50 cursor-pointer transition duration-200">
        <h2 className="font-semibold">{subject.name}</h2>
        <p className="text-sm text-gray-600">{subject.code}</p>
      </div>
    </Link>
  );
};

export default SubjectCard;
