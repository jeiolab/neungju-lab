import React from 'react';
import { THEORIES } from '../constants';

const TheoryTab: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {THEORIES.map((theory, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-indigo-900 mb-2">{theory.category}</h3>
          <p className="text-slate-600">{theory.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default TheoryTab;