import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-4 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow-lg tracking-tight">
        DataSort
      </h1>
      <p className="text-slate-400 font-medium text-lg">
        데이터 분리수거 대작전 ♻️
      </p>
    </header>
  );
};

export default Header;
