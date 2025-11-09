import React from 'react';
import { VectorDictionary } from '../types';

interface VectorTableProps {
  dictionary: VectorDictionary;
  highlightedWord: string | null;
}

const VectorTable: React.FC<VectorTableProps> = ({ dictionary, highlightedWord }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-sky-400">Kamus Vektor (Simulasi Embedding)</h2>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-800">
            <tr>
              <th className="p-3 text-sm font-semibold text-gray-300 border-b border-gray-600">Kata</th>
              <th className="p-3 text-sm font-semibold text-gray-300 border-b border-gray-600 text-center">Vektor 3D (Alam, Emosi, Aksi)</th>
            </tr>
          </thead>
          <tbody>
            {/* FIX: Refactored from Object.entries to Object.keys to fix a TypeScript type inference issue with the vector. */}
            {Object.keys(dictionary).map(word => (
              <tr 
                key={word} 
                className={`transition-colors duration-300 ${highlightedWord === word ? 'bg-green-800/50' : 'hover:bg-gray-700/50'}`}
              >
                <td className={`p-3 font-medium border-b border-gray-700 ${highlightedWord === word ? 'text-green-300' : ''}`}>
                  {word}
                </td>
                <td className="p-3 font-mono text-center text-sm border-b border-gray-700">
                  [{dictionary[word].join(', ')}]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VectorTable;
