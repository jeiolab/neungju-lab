import React from 'react';
import { Concept } from '../types';
import { BookOpen, FileText, Terminal } from 'lucide-react';

interface Props {
  concept: Concept;
}

export const ConceptCard: React.FC<Props> = ({ concept }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        {concept.category === 'Standard' ? (
          <Terminal className="text-blue-500 w-6 h-6" />
        ) : (
          <FileText className="text-orange-500 w-6 h-6" />
        )}
        <h3 className="text-lg font-bold text-gray-800">{concept.title}</h3>
      </div>
      <p className="text-gray-600 mb-4 whitespace-pre-line">{concept.content}</p>
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 px-2 py-1 bg-gray-700 text-xs text-gray-300 rounded-bl">Code Example</div>
        <pre>{concept.codeSnippet}</pre>
      </div>
    </div>
  );
};
