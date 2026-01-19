import React from 'react';
import { THEORY_CARDS } from '../constants';
import * as Icons from 'lucide-react';

export const Theory: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">정보 보호와 공유의 기초</h2>
      <p className="text-gray-600 mb-8">안전하고 가치 있는 프로젝트를 위해 꼭 알아야 할 개념들입니다.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {THEORY_CARDS.map((card) => {
          // Dynamically resolve icon
          const IconComponent = (Icons as any)[card.icon] || Icons.HelpCircle;
          
          return (
            <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full mr-4 text-indigo-600">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{card.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {card.content}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold 
                    ${card.category === 'sharing' ? 'bg-blue-100 text-blue-800' : 
                      card.category === 'protection' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                    #{card.category === 'sharing' ? '공유의가치' : card.category === 'protection' ? '정보보호' : '균형잡기'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-2 flex items-center">
          <Icons.AlertTriangle className="mr-2" size={20}/>
          더 알아보기: 클라우드 공유 시 주의사항
        </h3>
        <ul className="list-disc list-inside text-yellow-900 space-y-2 text-sm">
          <li><strong>링크 공유:</strong> '링크가 있는 모든 사용자' 설정은 편리하지만, 링크가 유출되면 누구나 볼 수 있습니다.</li>
          <li><strong>편집 권한:</strong> 꼭 필요한 팀원에게만 '편집자' 권한을 주고, 나머지는 '뷰어'나 '댓글 작성자'로 설정하세요.</li>
          <li><strong>접근 로그:</strong> 누가 언제 문서에 들어왔는지 기록을 확인하는 습관을 들이세요.</li>
        </ul>
      </div>
    </div>
  );
};