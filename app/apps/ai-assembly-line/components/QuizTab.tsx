import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { Wrench, Check, X, RefreshCw } from 'lucide-react';

interface QuizData {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const QuizTab: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setSelectedOption(null);
    setIsCorrect(null);
    setQuiz(null);

    const data = await generateQuizQuestion();
    if (data) {
      setQuiz(data);
    } else {
      // Fallback quiz if API fails or no key
      setQuiz({
        question: "데이터 전처리(Preprocessing) 과정을 건너뛰고 바로 학습을 시키면 어떤 문제가 발생할까요?",
        options: [
          "학습 속도가 빨라진다.",
          "모델이 데이터를 제대로 이해하지 못해 성능이 떨어진다.",
          "아무 문제 없다.",
          "컴퓨터가 고장난다."
        ],
        answer: 1,
        explanation: "전처리는 데이터의 노이즈, 결측치, 이상치를 제거하여 모델이 패턴을 잘 찾도록 돕는 필수 과정입니다. 'Garbage In, Garbage Out' 원칙을 기억하세요!"
      });
      if (process.env.API_KEY) {
          setError("AI 생성에 실패하여 기본 퀴즈를 불러왔습니다.");
      }
    }
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null || !quiz) return;
    setSelectedOption(index);
    setIsCorrect(index === quiz.answer);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 rounded-lg overflow-y-auto">
      {!quiz && !loading && (
        <div className="text-center">
          <div className="bg-white p-6 rounded-full inline-block shadow-lg mb-6 text-factory-600">
            <Wrench className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-factory-800 mb-2">오개념 수리공</h2>
          <p className="text-factory-500 mb-6 max-w-md">
            잘못된 머신러닝 지식은 공장 가동을 멈추게 합니다.<br/>
            수리공 퀴즈를 통해 엔지니어 등급을 올리세요!
          </p>
          <button 
            onClick={fetchQuiz}
            className="bg-factory-800 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-factory-900 transition-all flex items-center gap-2 mx-auto"
          >
            퀴즈 시작하기
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-factory-500 mx-auto mb-4" />
          <p className="text-factory-600 font-medium">AI가 새로운 문제를 출제 중입니다...</p>
        </div>
      )}

      {quiz && !loading && (
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">POP QUIZ</span>
            {error && <span className="text-xs text-orange-500">{error}</span>}
          </div>
          
          <h3 className="text-xl font-bold text-factory-900 mb-8 leading-relaxed">
            Q. {quiz.question}
          </h3>

          <div className="space-y-3">
            {quiz.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all flex justify-between items-center
                  ${selectedOption === null 
                    ? 'border-slate-100 hover:border-blue-300 hover:bg-blue-50' 
                    : idx === quiz.answer 
                      ? 'border-green-500 bg-green-50 text-green-800' 
                      : idx === selectedOption 
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-slate-100 opacity-50'
                  }
                `}
              >
                <span>{option}</span>
                {selectedOption !== null && idx === quiz.answer && <Check className="w-5 h-5 text-green-600" />}
                {selectedOption !== null && idx === selectedOption && idx !== quiz.answer && <X className="w-5 h-5 text-red-600" />}
              </button>
            ))}
          </div>

          {selectedOption !== null && (
            <div className="mt-8 pt-6 border-t border-slate-100 animation-fade-in">
              <h4 className={`font-bold mb-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '정답입니다! 🎉' : '아쉽네요, 틀렸습니다.'}
              </h4>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg text-sm">
                💡 <strong>해설:</strong> {quiz.explanation}
              </p>
              
              <button 
                onClick={fetchQuiz}
                className="mt-6 w-full py-3 bg-factory-800 text-white rounded-lg font-bold hover:bg-factory-900 transition-colors"
              >
                다음 문제 풀기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizTab;