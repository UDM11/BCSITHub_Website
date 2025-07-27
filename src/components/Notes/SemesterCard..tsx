import React from 'react';

type Props = {
  title: string;
  onClick: () => void;
};

const SemesterCard = ({ title, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer p-6 rounded-xl shadow-md bg-blue-100 hover:bg-blue-200 transition-all text-center"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
};

export default SemesterCard;
