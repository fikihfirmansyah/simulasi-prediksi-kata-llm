import React from 'react';
import { PredictionResult } from '../types';

interface PredictionResultDisplayProps {
  prediction: PredictionResult | null;
  error: string | null;
}

const PredictionResultDisplay: React.FC<PredictionResultDisplayProps> = ({ prediction, error }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg min-h-[160px] flex flex-col justify-center">
      <h2 className="text-2xl font-semibold mb-3 text-sky-400">Hasil Prediksi</h2>
      {error ? (
        <div className="text-red-400 bg-red-900/30 border border-red-500/50 p-3 rounded-md">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      ) : prediction ? (
        <div className="space-y-3">
          <p className="text-xl">
            <span className="text-gray-400">{prediction.fullSentence.split(' ').slice(0, -1).join(' ')}</span>
            <strong className="text-2xl font-bold text-green-400"> {prediction.predictedWord}</strong>
          </p>
          <p className="text-gray-300 bg-gray-700/50 p-3 rounded-md text-sm">
            <span className="font-bold text-green-400">Penjelasan:</span> Kata '{prediction.predictedWord}' dipilih karena vektornya memiliki jarak terdekat (skor <span className="font-mono">{prediction.distance.toFixed(4)}</span>) dengan Vektor Konteks Target.
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Hasil prediksi akan muncul di sini setelah simulasi dijalankan.</p>
      )}
    </div>
  );
};

export default PredictionResultDisplay;
