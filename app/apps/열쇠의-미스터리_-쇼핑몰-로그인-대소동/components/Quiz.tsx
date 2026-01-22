import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Play } from 'lucide-react';
import { analyzeVulnerability } from '../services/geminiService';

const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "앨리스가 밥에게 비밀 편지를 보내려 합니다. 밥만 읽을 수 있게 하려면 무엇으로 잠가야 할까요?",
    options: ["앨리스의 공개키", "앨리스의 개인키", "밥의 공개키", "밥의 개인키"],
    correctAnswer: 2,
    explanation: "밥의 공개키로 잠가야 밥의 개인키로만 열 수 있습니다."
  },
  {
    id: 2,
    question: "대칭키 암호화 방식의 가장 큰 단점은 무엇인가요?",
    options: ["암호화 속도가 느리다", "키 배송(교환) 문제가 있다", "복호화가 불가능하다", "키 길이가 너무 길다"],
    correctAnswer: 1,
    explanation: "대칭키는 송신자와 수신자가 같은 키를 공유해야 하는데, 이 키를 전달하는 과정이 위험합니다."
  },
  {
    id: 3,
    question: "HTTPS 웹사이트에서 사용하는 실제 방식은?",
    options: ["오직 비대칭키만 사용한다", "오직 대칭키만 사용한다", "처음에만 비대칭키로 대칭키를 교환하고, 이후 대칭키를 쓴다", "암호화를 하지 않는다"],
    correctAnswer: 2,
    explanation: "속도와 보안 두 마리 토끼를 잡기 위해 하이브리드 방식을 사용합니다."
  }
];

interface Props {
  onCorrect: () => void;
  onWrong: () => void;
}

const Quiz: React.FC<Props> = ({ onCorrect, onWrong }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentQ = INITIAL_QUESTIONS[currentQIndex];

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    if (selectedOption === currentQ.correctAnswer) {
      onCorrect();
    } else {
      onWrong();
      setIsLoading(true);
      const wrongText = currentQ.options[selectedOption];
      const report = await analyzeVulnerability(currentQ.question, wrongText);
      setAiReport(report);
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQIndex < INITIAL_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAiReport(null);
    } else {
      alert("모든 문제를 풀었습니다!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-500 font-bold">Question {currentQIndex + 1} / {INITIAL_QUESTIONS.length}</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">보안 모의고사</span>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-6">{currentQ.question}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !isSubmitted && setSelectedOption(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all
                ${isSubmitted && idx === currentQ.correctAnswer ? 'border-green-500 bg-green-50' : ''}
                ${isSubmitted && selectedOption === idx && idx !== currentQ.correctAnswer ? 'border-red-500 bg-red-50' : ''}
                ${!isSubmitted && selectedOption === idx ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}
              `}
              disabled={isSubmitted}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isSubmitted && idx === currentQ.correctAnswer && <CheckCircle className="text-green-500" />}
                {isSubmitted && selectedOption === idx && idx !== currentQ.correctAnswer && <XCircle className="text-red-500" />}
              </div>
            </button>
          ))}
        </div>

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`mt-8 w-full py-3 rounded-lg font-bold text-white transition-colors flex justify-center items-center
              ${selectedOption === null ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            정답 제출 <Play size={16} className="ml-2" />
          </button>
        )}

        {isSubmitted && (
          <div className="mt-8 space-y-4">
             {selectedOption !== currentQ.correctAnswer ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                   <h3 className="flex items-center text-red-700 font-bold mb-2">
                     <AlertTriangle className="mr-2" /> 보안 취약점 경고 리포트
                   </h3>
                   {isLoading ? (
                     <div className="text-slate-500 text-sm animate-pulse">AI가 취약점을 분석중입니다...</div>
                   ) : (
                     <p className="text-sm text-slate-700">{aiReport}</p>
                   )}
                </div>
             ) : (
               <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
                  <strong>정답입니다!</strong> {currentQ.explanation}
               </div>
             )}
             
             <button 
               onClick={handleNext}
               className="w-full bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 transition-colors"
             >
               다음 문제
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
