import React, { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { PenTool, Save } from 'lucide-react';

interface ReflectionTabProps {
  reflections: UserProgress['reflections'];
  onSave: (field: keyof UserProgress['reflections'], value: string) => void;
  deepDiveData: any; // Simplified for now
}

const ReflectionTab: React.FC<ReflectionTabProps> = ({ reflections, onSave, deepDiveData }) => {
  const [localState, setLocalState] = useState(reflections);
  const [showSavedMsg, setShowSavedMsg] = useState(false);

  useEffect(() => {
    setLocalState(reflections);
  }, [reflections]);

  const handleChange = (field: keyof UserProgress['reflections'], value: string) => {
    setLocalState(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (field: keyof UserProgress['reflections']) => {
    onSave(field, localState[field]);
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  };

  return (
    <div className="pb-20 space-y-8">
      {/* Deep Dive Mini-Comp */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <PenTool className="mr-2" /> 
          더 알아보기: K=3 vs K=5
        </h2>
        <p className="mb-4 text-indigo-100 text-sm">
          군집 수를 3개에서 5개로 늘리면 데이터는 더 세분화되지만, 
          "이게 무슨 그룹이지?" 하고 해석하기 어려워질 수 있어요. 직접 생각해보고 기록해봅시다.
        </p>
        
        <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
          <label className="block text-sm font-medium text-indigo-100 mb-2">내가 생각한 해석:</label>
          <textarea 
            className="w-full bg-white/20 border border-indigo-300/30 rounded-lg p-3 text-white placeholder-indigo-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            rows={2}
            placeholder="예: K가 5가 되니까 칼로리는 비슷한데 양만 다른 것도 다른 그룹이 되었다..."
            value={localState.deepDive}
            onChange={(e) => handleChange('deepDive', e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => handleSave('deepDive')}
              className="px-4 py-1 bg-white text-indigo-600 rounded text-xs font-bold hover:bg-indigo-50"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {/* Structured Reflection */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-800 border-l-4 border-indigo-600 pl-3">생각해볼 문제</h3>
        
        {[
          { 
            key: 'condition', 
            title: '1. 조건 바꾸기', 
            desc: '거리 계산 방식을 유클리디안에서 맨해튼으로 바꾸면 어떤 간식이 다른 그룹으로 이동할 것 같나요?' 
          },
          { 
            key: 'counterExample', 
            title: '2. 반례 찾기', 
            desc: '칼로리와 양만으로 "건강한 간식" 그룹을 완벽하게 만들 수 있을까요? 예외가 있다면?' 
          },
          { 
            key: 'application', 
            title: '3. 적용 설계하기', 
            desc: '우리 반 친구들을 군집화한다면, 키/몸무게 말고 어떤 데이터를 넣으면 재밌는 그룹이 나올까요?' 
          }
        ].map((item) => (
          <div key={item.key} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
              rows={3}
              placeholder="내 생각을 자유롭게 적어보세요..."
              value={localState[item.key as keyof UserProgress['reflections']]}
              onChange={(e) => handleChange(item.key as keyof UserProgress['reflections'], e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                onClick={() => handleSave(item.key as keyof UserProgress['reflections'])}
                className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Save size={14} className="mr-1.5" />
                내 답 저장
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSavedMsg && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg animate-fade-in-up">
          저장되었습니다! ✨
        </div>
      )}
    </div>
  );
};

export default ReflectionTab;