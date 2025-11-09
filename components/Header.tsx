import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-6">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 mb-2">
        Simulasi Prediksi Kata LLM
      </h1>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto">
        Visualisasikan bagaimana Large Language Model (LLM) "memikirkan" kata berikutnya dengan membandingkan vektor konteks dan vektor kata.
      </p>
    </header>
  );
};

export default Header;
