import React from 'react';

interface PoemDisplayProps {
  poem: string;
}

const PoemDisplay: React.FC<PoemDisplayProps> = ({ poem }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-semibold mb-3 text-sky-400">Data Konteks (Puisi)</h2>
      <blockquote className="whitespace-pre-wrap text-gray-300 italic text-lg border-l-4 border-sky-500 pl-4">
        {poem}
      </blockquote>
    </div>
  );
};

export default PoemDisplay;
