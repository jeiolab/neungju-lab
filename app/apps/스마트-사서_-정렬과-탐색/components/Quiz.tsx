import React, { useState, useEffect } from 'react';
import { generateQuizQuestion } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle, BrainCircuit } from 'lucide-react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const Quiz: React.FC = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const fetchQuestion = async () => {
    setLoading(true);
    setSelected(null);
    const q = await generateQuizQuestion();
    setQuestion(q);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (question && idx === question.correctIndex) {
      setScore(s => s + 10);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-4" />
        <p className="text-stone-500">AI 사서에게 문제를 요청하는 중...</p>
      </div>
    );
  }

  if (!question) return <div className="text-center p-10">퀴즈를 불러오지 못했습니다.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit className="text-amber-600" />
          사서 자격 시험
        </h2>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold text-sm">
          점수: {score} XP
        </span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-stone-200">
        <h3 className="text-xl font-medium text-stone-800 mb-6">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            let statusClass = "border-stone-200 hover:bg-stone-50 hover:border-amber-300";
            if (selected !== null) {
              if (idx === question.correctIndex) statusClass = "bg-green-50 border-green-500 ring-1 ring-green-500";
              else if (idx === selected) statusClass = "bg-red-50 border-red-500";
              else statusClass = "border-stone-100 opacity-50";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${statusClass}`}
              >
                <span>{opt}</span>
                {selected !== null && idx === question.correctIndex && <CheckCircle2 className="text-green-600 w-5 h-5" />}
                {selected === idx && idx !== question.correctIndex && <XCircle className="text-red-600 w-5 h-5" />}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-6 p-4 bg-stone-50 rounded-lg border border-stone-200 animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-bold text-stone-700 mb-1">해설:</h4>
            <p className="text-stone-600 text-sm">{question.explanation}</p>
            <button 
              onClick={fetchQuestion}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
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