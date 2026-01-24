import React, { useState } from 'react';
import { 
  BookOpen, Layers, Zap, AlertTriangle, HelpCircle, 
  Check, X, ThumbsUp 
} from 'lucide-react';
import { Project } from '../types';
import * as GeminiService from '../services/geminiService';

// --- THEORY TAB ---
export const TheoryTab: React.FC = () => (
  <div className="animate-fade-in max-w-4xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
            <Layers size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">문제 분해 (Decomposition)</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          큰 문제는 해결하기 어려워 보여요! 분해란 큰 문제(예: "지구 온난화")를 작고 해결 가능한 조각(예: "방을 나갈 때 불 끄기")으로 나누는 것을 말해요.
        </p>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
          <strong>예시:</strong> "스마트 급식실" 문제는 이렇게 나눌 수 있어요: <br/>
          1. 사람 감지하기 <br/> 2. 사람 수 세기 <br/> 3. 숫자 보여주기
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">추상화 (Abstraction)</h2>
        </div>
        <p className="text-slate-600 leading-relaxed">
          복잡한 세부 사항은 무시하세요. 추상화는 중요한 핵심 데이터에만 집중하는 거예요. 급식실 줄에 서 있는 학생의 이름이나 학년은 몰라도 돼요. 그냥 "사람이 있다"는 사실만 중요하죠.
        </p>
        <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-500">
          <strong>예시:</strong> 센서는 학생의 키나 점심 메뉴 취향은 무시하고, 단순히 "1명"이라는 숫자로만 처리해요.
        </div>
      </div>
    </div>
    
    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-8 text-white text-center">
      <h3 className="text-2xl font-bold mb-2">입력(Input) - 처리(Process) - 출력(Output)</h3>
      <p className="opacity-90 max-w-2xl mx-auto">
        모든 컴퓨터 시스템은 이 순서로 작동해요. 눈(입력)으로 공을 보고, 뇌(처리)에서 잡아야겠다고 생각하면, 손(출력)이 움직여서 공을 잡는 것과 같아요.
      </p>
    </div>
  </div>
);

// --- QUIZ TAB ---
const QUIZ_ITEMS = [
  { id: 'q1', text: '문제를 명확하게 정의하기', order: 1 },
  { id: 'q2', text: '필요한 데이터 찾기', order: 2 },
  { id: 'q3', text: '센서와 액추에이터 선택하기', order: 3 },
  { id: 'q4', text: '알고리즘 설계하기', order: 4 },
];

export const QuizTab: React.FC = () => {
  const [items, setItems] = useState([...QUIZ_ITEMS].sort(() => Math.random() - 0.5));
  const [success, setSuccess] = useState(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setItems(newItems);
    setSuccess(false);
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, idx) => item.order === idx + 1);
    setSuccess(isCorrect);
    if (!isCorrect) alert("순서가 조금 다른 것 같아요. 논리적인 흐름을 생각해보세요!");
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">퍼즐: 발명 과정 순서 맞추기</h2>
      <p className="text-slate-500 mb-8">문제 해결 과정을 올바른 순서대로 나열해보세요.</p>
      
      <div className="space-y-3 mb-8">
        {items.map((item, idx) => (
          <div key={item.id} className={`p-4 rounded-xl border-2 flex justify-between items-center transition-all ${success ? 'border-green-400 bg-green-50' : 'border-slate-200 bg-white'}`}>
             <span className="font-bold text-slate-400 mr-4">#{idx + 1}</span>
             <span className="font-semibold text-slate-700 flex-1 text-left">{item.text}</span>
             <div className="flex flex-col gap-1">
               <button onClick={() => moveItem(idx, 'up')} className="text-slate-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === 0 || success}>▲</button>
               <button onClick={() => moveItem(idx, 'down')} className="text-slate-400 hover:text-blue-500 disabled:opacity-30" disabled={idx === items.length - 1 || success}>▼</button>
             </div>
          </div>
        ))}
      </div>

      {success ? (
        <div className="p-4 bg-green-100 text-green-700 rounded-xl font-bold animate-bounce flex justify-center items-center gap-2">
          <Check size={24} /> 정답입니다! 논리적인 발명가시네요!
        </div>
      ) : (
        <button onClick={checkOrder} className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">
          정답 확인
        </button>
      )}
    </div>
  );
};

// --- THINKING TAB ---
export const ThinkingTab: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [effects, setEffects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedProject) return;
    setLoading(true);
    const proj = projects.find(p => p.id === selectedProject);
    if (proj) {
      const results = await GeminiService.generateSideEffects(proj.title + ": " + proj.problem);
      setEffects(results);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-8">
        <h2 className="text-xl font-bold text-orange-800 mb-2 flex items-center gap-2">
          <AlertTriangle size={24}/> 비판적 사고 (Critical Thinking)
        </h2>
        <p className="text-orange-700 text-sm">
          모든 발명에는 예상치 못한 부작용이 있을 수 있어요. 현명한 발명가는 문제가 생기기 전에 미리 예측한답니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
        <label className="block font-bold text-slate-700 mb-3">비평할 프로젝트 선택:</label>
        <div className="flex gap-4">
          <select 
            className="flex-1 p-3 border border-slate-300 rounded-lg"
            onChange={(e) => setSelectedProject(e.target.value)}
            value={selectedProject}
          >
            <option value="">-- 프로젝트 선택 --</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
          <button 
            onClick={handleAnalyze} 
            disabled={!selectedProject || loading}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? '분석 중...' : '부작용 예측하기'}
          </button>
        </div>
      </div>

      {effects.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-700">예상되는 문제점들:</h3>
          {effects.map((effect, idx) => (
            <div key={idx} className="p-4 bg-white border-l-4 border-red-400 shadow-sm rounded-r-xl flex gap-3">
              <HelpCircle className="text-red-400 shrink-0" />
              <p className="text-slate-600">{effect}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- GALLERY TAB ---
export const GalleryTab: React.FC = () => {
  const mockProjects = [
    { title: "조용한 도서관", problem: "공부할 때 너무 시끄러워요", device: "소리 센서 + 경고등" },
    { title: "화분 지키미", problem: "교실 화분이 자꾸 말라 죽어요", device: "습도 센서 + 물 펌프" },
    { title: "자동 환풍기", problem: "체육관 냄새가 너무 심해요", device: "공기질 센서 + 대형 환풍기" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {mockProjects.map((p, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mb-4 flex items-center justify-center">
            <Zap className="text-blue-400 opacity-50" size={48} />
          </div>
          <h3 className="font-bold text-lg text-slate-800 mb-1">{p.title}</h3>
          <p className="text-xs text-slate-400 uppercase font-bold mb-3">{p.device}</p>
          <p className="text-slate-600 text-sm">"{p.problem}"</p>
        </div>
      ))}
    </div>
  );
};
