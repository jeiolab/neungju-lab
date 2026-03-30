import React from 'react';
import { CONCEPTS } from '../constants';
import { Eye, MessageSquareText, Sparkles, ArrowRight } from 'lucide-react';

const icons: Record<string, React.ElementType> = {
  Eye,
  MessageSquareText,
  Sparkles
};

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI 핵심 기술 3대장</h2>
        <p className="text-gray-600">
          현대 AI 시스템을 지탱하는 세 가지 핵심 기둥을 이해해봅시다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CONCEPTS.map((concept) => {
          const Icon = icons[concept.iconName];
          return (
            <div key={concept.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 flex flex-col">
              <div className={`p-6 ${
                concept.category === 'VISION' ? 'bg-blue-50' : 
                concept.category === 'NLP' ? 'bg-green-50' : 'bg-purple-50'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    concept.category === 'VISION' ? 'bg-blue-100 text-blue-600' : 
                    concept.category === 'NLP' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon size={32} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {concept.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{concept.title}</h3>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-6 flex-1 leading-relaxed">
                  {concept.description}
                </p>
                
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-gray-900 flex items-center">
                    <ArrowRight size={16} className="mr-2 text-blue-500" />
                    핵심 키워드
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {concept.keywords.map((kw, idx) => (
                      <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TabTheory;