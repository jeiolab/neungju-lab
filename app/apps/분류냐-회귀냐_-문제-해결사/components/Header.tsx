import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
                <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-bold text-lg md:text-xl text-gray-800 tracking-tight">
                분류냐 회귀냐 <span className="text-indigo-600">문제 해결사</span>
            </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
