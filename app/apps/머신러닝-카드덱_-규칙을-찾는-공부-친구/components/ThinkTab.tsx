import React, { useState } from 'react';
import { ThinkProblem, UserState } from '../types';
import { THINK_PROBLEMS } from '../constants';
import { PenTool, Save, Eye } from 'lucide-react';

interface ThinkTabProps {
  userState: UserState;
  onSaveAnswer: (problemId: string, answer: string) => void;
}

const ThinkTab: React.FC<ThinkTabProps> = ({ userState, onSaveAnswer }) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tempAnswer, setTempAnswer] = useState('');

  const handleOpen = (id: string) => {
    setActiveId(id);
    setTempAnswer(userState.thinkAnswers[id] || '');
  };

  const handleSave = () => {
    if (activeId) {
      onSaveAnswer(activeId, tempAnswer);
      setActiveId(null);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="bg-indigo-600 p-4 rounded-xl text-white mb-6">
        <h2 className="font-bold text-lg mb-1">생각해볼 문제</h2>
        <p className="text-indigo-200 text-sm">정답은 없습니다. 논리적으로 생각해보세요!</p>
      </div>

      {THINK_PROBLEMS.map(prob => {
        const savedAnswer = userState.thinkAnswers[prob.id];
        const isEditing = activeId === prob.id;

        return (
            <div key={prob.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded mr-2 ${
                            prob.type === 'condition' ? 'bg-blue-100 text-blue-700' :
                            prob.type === 'counterexample' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                            {prob.type === 'condition' ? '조건 바꾸기' : prob.type === 'counterexample' ? '반례 찾기' : '적용 설계'}
                        </span>
                        <h3 className="inline font-bold text-gray-800">{prob.title}</h3>
                    </div>
                </div>

                <div className="p-4">
                    <p className="text-gray-700 mb-4 text-sm font-medium">{prob.description}</p>
                    
                    {isEditing ? (
                        <div className="space-y-3">
                            <textarea
                                className="w-full p-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                rows={4}
                                placeholder="내 생각을 자유롭게 적어보세요..."
                                value={tempAnswer}
                                onChange={(e) => setTempAnswer(e.target.value)}
                            />
                            <div className="flex gap-2 justify-end">
                                <button 
                                    onClick={() => setActiveId(null)}
                                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                                >
                                    취소
                                </button>
                                <button 
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2"
                                >
                                    <Save size={14}/> 저장하기
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {savedAnswer ? (
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-600 italic mb-3">
                                    "{savedAnswer}"
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic mb-3">아직 작성된 답변이 없습니다.</p>
                            )}
                            <button 
                                onClick={() => handleOpen(prob.id)}
                                className="w-full py-2 border border-indigo-200 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50 flex items-center justify-center gap-2"
                            >
                                <PenTool size={14}/> {savedAnswer ? '답변 수정하기' : '답변 작성하기'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
      })}
    </div>
  );
};

export default ThinkTab;
