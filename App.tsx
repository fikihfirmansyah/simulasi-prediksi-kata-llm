import React, { useState, useCallback, useMemo } from 'react';
import { Vector, VectorDictionary, TargetContexts, PredictionResult } from './types';
import PoemDisplay from './components/PoemDisplay';
import SimulationControls from './components/SimulationControls';
import PredictionResultDisplay from './components/PredictionResultDisplay';
import VectorTable from './components/VectorTable';
import Header from './components/Header';
import VectorChart from './components/VectorChart';

const POEM = "Bunga di taman mekar indah.\nWanginya harum semerbak,\nMenyentuh hati yang rindu.";

const VECTOR_DICTIONARY: VectorDictionary = {
  "bunga": [0.95, 0.2, 0.1],
  "taman": [0.9, 0.1, 0.2],
  "indah": [0.4, 0.7, 0.3],
  "wanginya": [0.8, 0.3, 0.1],
  "harum": [0.85, 0.25, 0.15],
  "semerbak": [0.88, 0.35, 0.2],
  "menyentuh": [0.1, 0.6, 0.8],
  "hati": [0.2, 0.9, 0.5],
  "rindu": [0.1, 0.95, 0.4],
  "tersenyum": [0.3, 0.8, 0.9],
  "meja": [0.1, -0.5, -0.8],
  "berlari": [-0.2, 0.1, 0.95],
  "gunung": [0.98, -0.1, 0.05],
  "sedih": [0.15, 0.92, 0.3],
};

const TARGET_CONTEXTS: TargetContexts = {
  "Bunga di": [0.92, 0.15, 0.18],
  "Menyentuh": [0.15, 0.92, 0.45],
  "Wanginya harum": [0.86, 0.3, 0.18],
  "Hati yang": [0.15, 0.98, 0.42],
};

const calculateEuclideanDistance = (vec1: Vector, vec2: Vector): number => {
  const dx = vec1[0] - vec2[0];
  const dy = vec1[1] - vec2[1];
  const dz = vec1[2] - vec2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const App: React.FC = () => {
  const suggestedPrompts = useMemo(() => Object.keys(TARGET_CONTEXTS), []);
  const [prompt, setPrompt] = useState<string>(suggestedPrompts[0]);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTargetVector, setCurrentTargetVector] = useState<Vector | null>(null);

  const handleSimulation = useCallback(() => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
        setError("Silakan masukkan prompt.");
        setPrediction(null);
        setCurrentTargetVector(null);
        return;
    }

    const targetContextVector = TARGET_CONTEXTS[trimmedPrompt];

    if (!targetContextVector) {
      setError(`Prompt "${trimmedPrompt}" tidak memiliki Vektor Konteks Target yang telah ditentukan. Coba salah satu prompt yang disarankan.`);
      setPrediction(null);
      setCurrentTargetVector(null);
      return;
    }
    
    setError(null);
    setCurrentTargetVector(targetContextVector);

    let bestMatch = { word: '', distance: Infinity };

    for (const word in VECTOR_DICTIONARY) {
      const wordVector = VECTOR_DICTIONARY[word];
      const distance = calculateEuclideanDistance(targetContextVector, wordVector);

      if (distance < bestMatch.distance) {
        bestMatch = { word, distance };
      }
    }

    setPrediction({
      predictedWord: bestMatch.word,
      distance: bestMatch.distance,
      fullSentence: `${trimmedPrompt} ${bestMatch.word}`,
    });
  }, [prompt]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="lg:col-span-2">
           <Header />
        </div>
        
        <div className="flex flex-col gap-8">
          <PoemDisplay poem={POEM} />
          <SimulationControls 
            prompt={prompt}
            setPrompt={setPrompt}
            handleSimulation={handleSimulation}
            suggestedPrompts={suggestedPrompts}
          />
          <PredictionResultDisplay prediction={prediction} error={error} />
        </div>
        
        <div className="flex flex-col gap-8">
          <VectorTable 
            dictionary={VECTOR_DICTIONARY}
            highlightedWord={prediction?.predictedWord || null}
          />
          <VectorChart 
             dictionary={VECTOR_DICTIONARY}
             highlightedWord={prediction?.predictedWord || null}
             targetContext={currentTargetVector}
          />
        </div>
      </div>
    </div>
  );
};

export default App;