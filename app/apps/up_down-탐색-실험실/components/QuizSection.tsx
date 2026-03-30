import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";
import { QuizQuestion } from '../types';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface QuizSectionProps {
  apiKey: string | undefined;
}

export const QuizSection: React.FC<QuizSectionProps> = ({ apiKey }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuiz = async () => {
    if (!apiKey) {
        setError("API Key가 설정되지 않았습니다.");
        return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "순차 탐색과 이진 탐색, 알고리즘 효율성(Big O)에 대한 초보자용 퀴즈 3문제를 만들어주세요.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
                explanation: { type: Type.STRING }
              }
            }
          }
        }
      });

      const text = response.text;
      if (text) {
        const data = JSON.parse(text);
        setQuestions(data);
        setQuizStarted(true);
        setCurrentQIndex(0);
        setScore(0);
        setShowExplanation(false);
        setSelectedOption(null);
      }
    } catch (e) {
      console.error(e);
      setError("퀴즈 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      // Fallback questions could go here
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (idx: number) => {
    if (showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === questions[currentQIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
        // End of quiz
        setCurrentQIndex(prev => prev + 1);
    }
  };

  if (!quizStarted) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg border border-indigo-100 text-center">
        <h3 className="text-2xl font-bold text-indigo-900 mb-4">알고리즘 마스터 퀴즈</h3>
        <p className="text-gray-600 mb-6">AI가 생성하는 맞춤형 퀴즈로 탐색 알고리즘에 대한 이해도를 테스트해보세요!</p>
        
        {error && <div className="text-red-500 mb-4 bg-red-50 p-2 rounded">{error}</div>}

        <button 
          onClick={generateQuiz}
          disabled={loading || !apiKey}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition-all flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "퀴즈 시작하기"}
        </button>
        {!apiKey && <p className="text-xs text-gray-400 mt-2">API Key 설정이 필요합니다.</p>}
      </div>
    );
  }

  if (currentQIndex >= questions.length) {
      return (
        <div className="p-8 bg-white rounded-xl shadow-lg text-center animate-in fade-in zoom-in duration-300">
            <h3 className="text-3xl font-bold mb-4">퀴즈 완료!</h3>
            <div className="text-6xl font-black text-indigo-600 mb-4">{score} / {questions.length}</div>
            <p className="text-gray-600 mb-6">
                {score === questions.length ? "완벽합니다! 개념을 완전히 이해하셨군요. 🎉" : "수고하셨습니다! 오답 노트를 확인해보세요."}
            </p>
            <button 
                onClick={() => setQuizStarted(false)}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline"
            >
                다시 도전하기
            </button>
        </div>
      )
  }

  const q = questions[currentQIndex];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
        <span className="font-bold text-indigo-900">Q{currentQIndex + 1}</span>
        <span className="text-sm text-indigo-600 font-medium">진행률: {currentQIndex + 1}/{questions.length}</span>
      </div>
      
      <div className="p-6">
        <h4 className="text-lg font-bold text-gray-800 mb-6">{q.question}</h4>
        
        <div className="space-y-3">
          {q.options.map((option, idx) => {
             let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between ";
             if (showExplanation) {
                 if (idx === q.correctAnswer) btnClass += "border-green-500 bg-green-50 text-green-900";
                 else if (idx === selectedOption) btnClass += "border-red-500 bg-red-50 text-red-900";
                 else btnClass += "border-gray-100 text-gray-400 opacity-50";
             } else {
                 btnClass += "border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-gray-700";
             }

             return (
                <button 
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={btnClass}
                >
                    <span>{option}</span>
                    {showExplanation && idx === q.correctAnswer && <CheckCircle2 className="w-5 h-5 text-green-600"/>}
                    {showExplanation && idx === selectedOption && idx !== q.correctAnswer && <XCircle className="w-5 h-5 text-red-600"/>}
                </button>
             )
          })}
        </div>

        {showExplanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2">
                <p className="font-bold text-gray-900 mb-1">💡 해설</p>
                <p className="text-gray-700 text-sm leading-relaxed">{q.explanation}</p>
                <div className="mt-4 text-right">
                    <button 
                        onClick={nextQuestion}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        다음 문제
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
