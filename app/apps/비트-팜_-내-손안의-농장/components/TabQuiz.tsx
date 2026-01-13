import React, { useState } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { BrainCircuit, Check, X, RefreshCw } from 'lucide-react';

interface QuizState {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export const TabQuiz: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const loadNewQuiz = async () => {
    setLoading(true);
    setSelectedOption(null);
    setIsCorrect(null);
    setQuiz(null);
    
    const data = await generateQuizQuestion();
    setQuiz(data);
    setLoading(false);
  };

  // Load initial quiz
  React.useEffect(() => {
    loadNewQuiz();
  }, []);

  const handleSelectOption = (option: string) => {
    if (selectedOption || !quiz) return;
    setSelectedOption(option);
    setIsCorrect(option === quiz.answer);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 animate-fade-in min-h-[500px] flex flex-col justify-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
            <BrainCircuit /> 스마트 팜 스피드 퀴즈
        </h2>
        <p className="text-stone-600">AI가 출제하는 문제를 맞춰보세요!</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
        {loading && (
            <div className="p-12 text-center">
                <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-500 animate-pulse">AI 선생님이 문제를 만들고 있어요...</p>
            </div>
        )}

        {!loading && quiz && (
            <div className="p-8">
                <h3 className="text-xl font-bold text-stone-900 mb-6 leading-relaxed">
                    Q. {quiz.question}
                </h3>

                <div className="space-y-3">
                    {quiz.options.map((option, idx) => {
                        let btnClass = "w-full p-4 rounded-xl text-left border-2 transition-all font-medium text-stone-700 hover:bg-stone-50 border-stone-200";
                        
                        if (selectedOption) {
                            if (option === quiz.answer) {
                                btnClass = "w-full p-4 rounded-xl text-left border-2 font-bold bg-green-50 border-green-500 text-green-800";
                            } else if (option === selectedOption) {
                                btnClass = "w-full p-4 rounded-xl text-left border-2 bg-red-50 border-red-500 text-red-800";
                            } else {
                                btnClass = "w-full p-4 rounded-xl text-left border-2 border-stone-100 text-stone-400";
                            }
                        }

                        return (
                            <button 
                                key={idx} 
                                onClick={() => handleSelectOption(option)}
                                className={btnClass}
                                disabled={!!selectedOption}
                            >
                                <span className="mr-2 opacity-60">{idx + 1}.</span> {option}
                            </button>
                        );
                    })}
                </div>

                {selectedOption && (
                    <div className={`mt-6 p-4 rounded-xl animate-fade-in ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex items-center gap-2 font-bold mb-2">
                            {isCorrect ? <Check className="text-green-600"/> : <X className="text-red-600"/>}
                            <span className={isCorrect ? 'text-green-800' : 'text-red-800'}>
                                {isCorrect ? '정답입니다!' : '아쉽네요, 틀렸습니다.'}
                            </span>
                        </div>
                        <p className="text-stone-700 text-sm leading-relaxed">
                            {quiz.explanation}
                        </p>
                    </div>
                )}
            </div>
        )}

        {!loading && quiz && (
             <div className="bg-stone-50 p-4 border-t border-stone-200 flex justify-center">
                <button 
                    onClick={loadNewQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-full hover:bg-stone-700 font-bold transition-transform active:scale-95 shadow-md"
                >
                    <RefreshCw size={18} /> 다음 문제 풀기
                </button>
             </div>
        )}
      </div>
    </div>
  );
};
