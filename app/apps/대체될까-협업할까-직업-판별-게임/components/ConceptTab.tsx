import React from 'react';
import { CONCEPTS } from '../constants';
import { UserStats } from '../types';
import * as Lucide from 'lucide-react';

interface ConceptTabProps {
  mastery: Record<string, number>;
}

const ConceptTab: React.FC<ConceptTabProps> = ({ mastery }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h2 className="text-lg font-bold text-blue-900 mb-1">💡 오늘의 개념</h2>
        <p className="text-sm text-blue-700">
          디지털 사회에서 직업이 어떻게 변하는지 핵심 키워드를 알아봅시다. 
          카드를 눌러 내용을 확인하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONCEPTS.map((concept) => {
          const IconComponent = (Lucide as any)[concept.iconName] || Lucide.HelpCircle;
          const userMastery = mastery[concept.id] || 0;
          
          return (
            <div 
              key={concept.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden group"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${userMastery >= 100 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    <IconComponent size={24} />
                  </div>
                  <div className="text-xs font-medium text-gray-400">
                    숙련도 {userMastery}%
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {concept.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {concept.description}
                </p>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex items-start space-x-2">
                    <Lucide.Key size={14} className="mt-1 text-yellow-500 flex-shrink-0" />
                    <p className="text-xs text-gray-700 font-medium">
                      {concept.keyPoint}
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-1 w-full bg-gray-100">
                <div 
                  className="h-full bg-green-500 transition-all duration-1000" 
                  style={{ width: `${userMastery}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConceptTab;