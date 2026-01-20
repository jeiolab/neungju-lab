import React, { useState } from 'react';
import { getHintForProblem } from '../services/geminiService';
import { Lightbulb, Send } from 'lucide-react';

const PROBLEMS = [
  {
    id: 1,
    type: '조건 바꾸기',
    title: '데이터가 계속 변한다면?',
    description: '도서관에 매일 새 책이 100권씩 들어오고, 헌 책이 50권씩 버려집니다. 사서 선생님은 책을 찾을 때 이진 탐색을 쓰고 싶어 하지만, 매번 정렬하는 것이 귀찮습니다. 어떤 상황에서 그냥 순차 탐색을 쓰는 게 더 나을까요?'
  },
  {
    id: 2,
    type: '반례 찾기',
    title: '이진 탐색의 함정',
    description: '친구 A가 말했습니다. "이진 탐색은 반씩 줄어드니까 100만 개 데이터도 20번이면 찾아. 그러니까 무조건 순차 탐색보다 빨라." 이 말이 틀린 경우(반례)를 구체적인 상황을 들어 설명해보세요.'
  },
  {
    id: 3,
    type: '적용 설계',
    title: '사전 앱 만들기',
    description: '단어 5만 개가 있는 영어 사전 앱을 만듭니다. 사용자가 단어를 검색할 때 어떤 알고리즘을 써야 할까요? 단, 사전 데이터는 앱 업데이트 때만 변경됩니다.'
  }
];

const ThinkTab: React.FC = () => {
  const [activeProblem, setActiveProblem] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '']);
  const [hints, setHints] = useState<string[]>(['', '', '']);
  const [loadingHint, setLoadingHint] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInputs = [...userInputs];
    newInputs[activeProblem] = e.target.value;
    setUserInputs(newInputs);
  };

  const requestHint = async () => {
    if (!userInputs[activeProblem] || userInputs[activeProblem].length < 5) {
      alert("내용을 조금 더 적어주세요. 그래야 AI 코치가 도움을 줄 수 있어요!");
      return;
    }
    
    setLoadingHint(true);
    const hint = await getHintForProblem(PROBLEMS[activeProblem].title, userInputs[activeProblem]);
    
    const newHints = [...hints];
    newHints[activeProblem] = hint;
    setHints(newHints);
    setLoadingHint(false);
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {PROBLEMS.map((prob, idx) => (
            <button
              key={prob.id}
              onClick={() => setActiveProblem(idx)}
              className={`flex-1 py-4 px-4 text-sm font-bold whitespace-nowrap ${
                activeProblem === idx 
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {prob.type}
            </button>
          ))}
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{PROBLEMS[activeProblem].title}</h3>
            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg">
              {PROBLEMS[activeProblem].description}
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              나의 생각 적어보기
            </label>
            <textarea
              className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 resize-none text-gray-700"
              placeholder="여기에 자유롭게 서술해보세요..."
              value={userInputs[activeProblem]}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="flex justify-between items-center">
             <button 
              onClick={requestHint}
              disabled={loadingHint}
              className="flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-4 py-2 rounded-full transition-colors"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {loadingHint ? 'AI가 생각 중...' : 'AI 코치에게 힌트 요청'}
            </button>
          </div>

          {hints[activeProblem] && (
            <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg animate-fade-in">
              <p className="text-sm font-bold text-indigo-800 mb-1">🤖 AI 코치의 조언</p>
              <p className="text-gray-700 text-sm">{hints[activeProblem]}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkTab;
