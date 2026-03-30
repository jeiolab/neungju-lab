import React from 'react';
import { User, ShieldAlert, VenetianMask } from 'lucide-react';

interface CharacterProps {
  type: 'ALICE' | 'BOB' | 'HACKER';
  label: string;
  isActive?: boolean;
  className?: string;
}

const Character: React.FC<CharacterProps> = ({ type, label, isActive = false, className = '' }) => {
  const getColor = () => {
    switch (type) {
      case 'ALICE': return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'BOB': return 'text-green-600 bg-green-100 border-green-300';
      case 'HACKER': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'ALICE': return <User size={32} />;
      case 'BOB': return <User size={32} />;
      case 'HACKER': return <VenetianMask size={32} />;
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'} ${className}`}>
      <div className={`p-4 rounded-full border-4 shadow-lg flex items-center justify-center ${getColor()}`}>
        {getIcon()}
      </div>
      <span className="font-bold text-slate-700 bg-white px-3 py-1 rounded-full shadow-sm text-sm border border-slate-200">
        {label}
      </span>
    </div>
  );
};

export default Character;