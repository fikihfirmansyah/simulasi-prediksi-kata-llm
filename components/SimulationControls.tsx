import React from 'react';

interface SimulationControlsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleSimulation: () => void;
  suggestedPrompts: string[];
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ prompt, setPrompt, handleSimulation, suggestedPrompts }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-sky-400">Kontrol Simulasi</h2>
      
      <div>
        <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-1">
          Masukkan Prompt:
        </label>
        <input
          id="prompt-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Contoh: Bunga di"
          className="w-full bg-gray-900 border border-gray-600 rounded-md py-2 px-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      <div>
        <p className="text-sm font-medium text-gray-300 mb-2">Atau coba prompt ini:</p>
        <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((p) => (
                <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                    {p}
                </button>
            ))}
        </div>
      </div>

      <button
        onClick={handleSimulation}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 transform hover:scale-105"
      >
        Simulasikan Prediksi
      </button>
    </div>
  );
};

export default SimulationControls;
