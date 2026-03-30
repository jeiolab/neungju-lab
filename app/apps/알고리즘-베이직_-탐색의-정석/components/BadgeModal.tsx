import React, { useEffect, useState } from 'react';
import { Badge } from '../types';
import { Trophy, X } from 'lucide-react';

interface BadgeModalProps {
  badge: Badge | null;
  onClose: () => void;
}

const BadgeModal: React.FC<BadgeModalProps> = ({ badge, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [badge]);

  if (!badge || !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 relative transform transition-all scale-100 shadow-2xl text-center border-4 border-yellow-300">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
            <X className="w-6 h-6" />
        </button>
        
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
             <span className="text-5xl">{badge.icon}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">배지 획득!</h2>
        <div className="text-xl font-bold text-yellow-600 mb-4">{badge.name}</div>
        <p className="text-slate-600 mb-6">{badge.description}</p>
        
        <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
            멋져요!
        </button>
      </div>
    </div>
  );
};

export default BadgeModal;