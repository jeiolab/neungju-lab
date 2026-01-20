import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Check, X, HelpCircle } from 'lucide-react';

interface TabQuizProps {
  onScoreUpdate: (score: number) => void;
}

const TabQuiz: React.FC<TabQuizProps> = ({ onScoreUpdate }) => {
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionIdx.toString() }));
  };

  const handleTextChange = (qId: number, val: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    QUIZ_DATA.forEach(q => {
      const userAns = answers[q.id];
      if (!userAns) return;

      if (q.type === 'multiple') {
        if (parseInt(userAns) === q.answer) calculatedScore++;
      } else {
        if (userAns.toLowerCase().trim() === (q.answer as string).toLowerCase().trim()) calculatedScore++;
      }
    });

    setScore(calculatedScore);
    onScoreUpdate(calculatedScore);
    setSubmitted(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
        <HelpCircle />
        개념 확인 퀴즈
      </h2>
      
      <div className="space-y-8">
        {QUIZ_DATA.map((q, idx) => (
          <div key={q.id} className="border-b pb-6 last:border-0">
            <div className="flex gap-2 items-start mb-3">
              <span className="bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded text-sm mt-0.5">Q{idx + 1}</span>
              <p className="text-lg font-medium text-gray-800">{q.question}</p>
            </div>

            <div className="ml-9">
              {q.type === 'multiple' && q.options ? (
                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[q.id] === oIdx.toString();
                    const isCorrect = q.answer === oIdx;
                    let bgClass = "bg-gray-50 border-gray-200 hover:bg-gray-100";
                    
                    if (submitted) {
                        if (isCorrect) bgClass = "bg-green-100 border-green-400 text-green-800 font-bold";
                        else if (isSelected && !isCorrect) bgClass = "bg-red-50 border-red-300 text-red-800";
                    } else if (isSelected) {
                        bgClass = "bg-indigo-50 border-indigo-400 text-indigo-900";
                    }

                    return (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionSelect(q.id, oIdx)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${bgClass}`}
                          disabled={submitted}
                        >
                          {opt}
                        </button>
                    );
                  })}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="답을 입력하세요"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleTextChange(q.id, e.target.value)}
                  disabled={submitted}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                      submitted 
                        ? (answers[q.id]?.toLowerCase().trim() === String(q.answer).toLowerCase() ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')
                        : 'bg-white border-gray-300'
                  }`}
                />
              )}

              {submitted && (
                <div className="mt-3 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
                  <span className="font-bold mr-2">해설:</span> {q.explanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200"
        >
          제출하기
        </button>
      ) : (
        <div className="mt-6 text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-xl font-bold text-gray-700 mb-2">총점: <span className="text-indigo-600 text-3xl">{score} / {QUIZ_DATA.length}</span></p>
            <p className="text-gray-500">오답 노트를 확인하고 다시 학습해보세요!</p>
        </div>
      )}
    </div>
  );
};

export default TabQuiz;