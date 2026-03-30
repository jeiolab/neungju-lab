import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { getQuizHint } from '../services/geminiService';

const QUESTIONS = [
  {
    id: 1,
    question: "__init__ 메소드 안에서 인스턴스의 속성을 설정할 때 사용하는 키워드는 무엇인가요?",
    code: "def __init__(self, name):\n    _______.name = name",
    answer: "self",
    explanation: "'self'는 현재 생성되고 있는 자기 자신(인스턴스)을 가리킵니다."
  },
  {
    id: 2,
    question: "객체를 만들기 위한 '설계도'를 정의하는 키워드는?",
    code: "_______ Hero:\n    def __init__(self): pass",
    answer: "class",
    explanation: "'class'는 새로운 타입을 정의할 때 사용하는 키워드입니다."
  },
  {
    id: 3,
    question: "Player 클래스를 이용해 'p1'이라는 인스턴스를 생성하는 올바른 코드는?",
    code: "p1 = _______()",
    answer: "Player",
    explanation: "클래스 이름을 함수처럼 호출하면 인스턴스가 생성됩니다."
  }
];

const QuizTab: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);

  const activeQuestion = QUESTIONS[currentQ];

  const handleSubmit = () => {
    if (input.trim().toLowerCase() === activeQuestion.answer.toLowerCase()) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const handleNext = () => {
    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
      setInput('');
      setStatus('idle');
      setHint('');
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);
    const hintText = await getQuizHint(activeQuestion.question);
    setHint(hintText);
    setLoadingHint(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">코딩 퀴즈 (Code Challenge)</h2>
            <span className="text-gray-500">문제 {currentQ + 1} / {QUESTIONS.length}</span>
        </div>

        <div className="mb-6">
            <p className="text-lg text-gray-700 mb-4">{activeQuestion.question}</p>
            <div className="bg-gray-50 p-4 rounded-lg font-mono text-indigo-600 whitespace-pre text-sm overflow-x-auto border-l-4 border-indigo-500">
                {activeQuestion.code}
            </div>
        </div>

        <div className="flex gap-4 mb-6">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={status === 'correct'}
                placeholder="정답을 입력하세요..."
                className="flex-1 bg-gray-50 border border-gray-300 rounded px-4 py-2 text-gray-900 focus:outline-none focus:border-indigo-500"
            />
            <button 
                onClick={handleSubmit}
                disabled={status === 'correct'}
                className={`px-6 py-2 rounded font-bold transition ${status === 'correct' ? 'bg-gray-300 text-gray-500' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
            >
                정답 확인
            </button>
        </div>

        {status === 'correct' && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg mb-4 flex items-start gap-3 animate-fade-in">
                <CheckCircle className="text-emerald-600 shrink-0" />
                <div>
                    <h4 className="font-bold text-emerald-600">정답입니다!</h4>
                    <p className="text-emerald-700 text-sm">{activeQuestion.explanation}</p>
                    {currentQ < QUESTIONS.length - 1 ? (
                        <button onClick={handleNext} className="mt-2 text-sm underline hover:text-emerald-800">다음 문제 →</button>
                    ) : (
                        <p className="mt-2 font-bold">모든 퀴즈를 완료했습니다!</p>
                    )}
                </div>
            </div>
        )}

        {status === 'incorrect' && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4 flex items-center gap-3 animate-pulse">
                <XCircle className="text-red-600" />
                <span className="text-red-700">틀렸습니다. 다시 시도해보세요.</span>
            </div>
        )}

        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
            <button 
                onClick={handleGetHint} 
                disabled={loadingHint || !!hint}
                className="text-sm text-yellow-600 flex items-center gap-2 hover:text-yellow-700"
            >
                <HelpCircle size={16} /> 
                {loadingHint ? "AI에게 물어보는 중..." : "힌트가 필요하신가요?"}
            </button>
            {hint && (
                <span className="text-sm text-yellow-700 bg-yellow-50 px-3 py-1 rounded border border-yellow-200">{hint}</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default QuizTab;