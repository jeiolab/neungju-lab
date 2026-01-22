import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ShieldAlert, BrainCircuit, CheckCircle2, XCircle } from 'lucide-react';
import { QuizQuestion } from '../types';

interface Props {
  setMastery: React.Dispatch<React.SetStateAction<number>>;
}

export const HackingDefense: React.FC<Props> = ({ setMastery }) => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const generateQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setCurrentQIndex(0);
    setShowResult(false);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = ai.models;
        
        const response = await model.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate 3 multiple-choice questions about Huffman Coding and basic Encryption suitable for a computer science student. Return strictly JSON. Write the question, options, and explanation in Korean.",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.INTEGER },
                            question: { type: Type.STRING },
                            options: { 
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.INTEGER, description: "Index of correct answer 0-3" },
                            explanation: { type: Type.STRING }
                        }
                    }
                }
            }
        });
        
        if (response.text) {
            setQuestions(JSON.parse(response.text));
        }
    } catch (error) {
        console.error("Quiz gen failed", error);
        // Fallback questions
        setQuestions([
            {
                id: 1,
                question: "허프만 트리에서 가장 짧은 코드를 부여받는 문자는 무엇입니까?",
                options: ["가장 자주 등장하는 문자", "가장 적게 등장하는 문자", "모음", "자음"],
                correctAnswer: 0,
                explanation: "공간을 절약하기 위해 허프만 코딩은 가장 빈번하게 사용되는 문자에 가장 짧은 이진 코드를 할당합니다."
            },
             {
                id: 2,
                question: "허프만 트리를 만들기 전에 노드 목록을 어떻게 처리해야 합니까?",
                options: ["무작위로 섞는다", "빈도수 순으로 정렬한다 (낮은 순)", "알파벳 순으로 정렬한다", "16진수로 변환한다"],
                correctAnswer: 1,
                explanation: "항상 가장 빈도수가 낮은 두 개의 노드를 먼저 결합해야 하므로 정렬이 필수적입니다."
            }
        ]);
    } finally {
        setLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    
    if (index === questions[currentQIndex].correctAnswer) {
        setMastery(prev => Math.min(100, prev + 10));
    } else {
        setMastery(prev => Math.max(0, prev - 5));
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
    } else {
        // End of quiz
        setQuestions([]);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-green-400">
            <BrainCircuit className="animate-pulse mb-4" size={48} />
            <p>위협 시뮬레이션 생성 중...</p>
        </div>
    );
  }

  if (questions.length === 0) {
      return (
          <div className="text-center p-12">
              <ShieldAlert className="mx-auto text-red-500 mb-4" size={64} />
              <h2 className="text-2xl font-bold text-white mb-2">시스템 취약 (SYSTEM VULNERABLE)</h2>
              <p className="text-slate-400 mb-6">방어 등급을 올리기 위해 훈련 시뮬레이션을 완료하세요.</p>
              <button 
                onClick={generateQuiz}
                className="bg-green-600 hover:bg-green-500 text-black font-bold px-8 py-3 rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all"
              >
                  시뮬레이션 시작
              </button>
          </div>
      );
  }

  const q = questions[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6 text-slate-400 text-sm uppercase tracking-widest">
            <span>문제 {currentQIndex + 1} / {questions.length}</span>
            <span>난이도: HARD</span>
        </div>

        <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg mb-6 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6">{q.question}</h3>
            <div className="space-y-3">
                {q.options.map((opt, idx) => {
                    let statusClass = "border-slate-700 bg-slate-800 hover:bg-slate-700";
                    if (showResult) {
                        if (idx === q.correctAnswer) statusClass = "border-green-500 bg-green-900/30 text-green-300";
                        else if (idx === selectedOption) statusClass = "border-red-500 bg-red-900/30 text-red-300";
                        else statusClass = "opacity-50 border-slate-800";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={showResult}
                            className={`w-full text-left p-4 rounded border-2 transition-all ${statusClass}`}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>

        {showResult && (
            <div className="bg-slate-800 p-4 rounded border-l-4 border-yellow-500 animate-in fade-in slide-in-from-bottom-2">
                <h4 className="font-bold text-yellow-500 mb-1">디브리핑 (DEBRIEFING):</h4>
                <p className="text-slate-300">{q.explanation}</p>
                
                <div className="mt-4 flex justify-end">
                    <button 
                        onClick={nextQuestion}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded font-bold"
                    >
                        {currentQIndex < questions.length - 1 ? "다음 위협" : "훈련 완료"}
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};