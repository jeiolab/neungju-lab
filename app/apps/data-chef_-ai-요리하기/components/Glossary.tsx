import React from 'react';
import { GLOSSARY_TERMS } from '../constants';
import { X, BookOpen } from 'lucide-react';

interface GlossaryProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTerm: string | null;
}

export const Glossary: React.FC<GlossaryProps> = ({ isOpen, onClose, selectedTerm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative border-4 border-orange-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>
        
        <div className="flex items-center gap-2 mb-4 text-orange-600">
          <BookOpen size={28} />
          <h2 className="text-2xl font-bold">셰프의 용어 사전</h2>
        </div>

        {selectedTerm && GLOSSARY_TERMS[selectedTerm as keyof typeof GLOSSARY_TERMS] ? (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedTerm}</h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {GLOSSARY_TERMS[selectedTerm as keyof typeof GLOSSARY_TERMS]}
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {Object.entries(GLOSSARY_TERMS).map(([term, definition]) => (
              <div key={term} className="border-b border-gray-100 pb-2 last:border-0">
                <h3 className="font-bold text-orange-700">{term}</h3>
                <p className="text-sm text-gray-600">{definition}</p>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button 
            onClick={onClose}
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors font-bold"
          >
            알겠습니다!
          </button>
        </div>
      </div>
    </div>
  );
};

export const GlossaryTerm: React.FC<{ term: string; onClick: (term: string) => void }> = ({ term, onClick }) => {
  return (
    <span 
      onClick={() => onClick(term)}
      className="text-orange-600 font-bold cursor-pointer border-b border-dotted border-orange-400 hover:bg-orange-50 transition-colors inline-flex items-center gap-1"
    >
      {term}
    </span>
  );
};