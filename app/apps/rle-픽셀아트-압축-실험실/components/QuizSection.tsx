import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_DATA } from '../constants';
import { Button } from './Button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QuizSectionProps {
  onMasteryUpdate: (id: number, correct: boolean) => void;
  masteryMap: Record<number, boolean>;
  wrongNotes: number[];
}

export const QuizSection: React.FC<QuizSectionProps> = ({ onMasteryUpdate, masteryMap, wrongNotes }) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number>(QUIZ_DATA[0].id);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activeQuestion = QUIZ_DATA.find(q => q.id === activeQuestionId);

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !activeQuestion) return;
    
    const isCorrect = selectedOption === activeQuestion.correctIndex;
    onMasteryUpdate(activeQuestion.id, isCorrect);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    const currentIndex = QUIZ_DATA.findIndex(q => q.id === activeQuestionId);
    if (currentIndex < QUIZ_DATA.length - 1) {
      setActiveQuestionId(QUIZ_DATA[currentIndex + 1].id);
      resetState();
    }
  };

  const handleRetry = () => {
      resetState();
  }

  const resetState = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }

  const difficultyColor = {
      easy: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      hard: 'text-red-600 bg-red-50'
  };

  if (!activeQuestion) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="flex gap-1 mb-4">
        {QUIZ_DATA.map((q) => (
            <button
                key={q.id}
                onClick={() => { setActiveQuestionId(q.id); resetState(); }}
                className={`h-2 flex-1 rounded-full transition-colors ${
                    q.id === activeQuestionId ? 'bg-blue-600' :
                    masteryMap[q.id] ? 'bg-green-400' : 
                    wrongNotes.includes(q.id) ? 'bg-red-300' : 'bg-slate-200'
                }`}
            />
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${difficultyColor[activeQuestion.difficulty]}`}>
                {activeQuestion.difficulty}
            </span>
            <span className="text-slate-400 text-sm">문제 {activeQuestion.id} / {QUIZ_DATA.length}</span>
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {activeQuestion.question}
        </h2>

        <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
                let stateClass = "border-slate-200 hover:bg-slate-50";
                if (selectedOption === idx) stateClass = "border-blue-500 bg-blue-50 ring-1 ring-blue-500";
                if (isSubmitted) {
                    if (idx === activeQuestion.correctIndex) stateClass = "border-green-500 bg-green-50 text-green-700 font-bold";
                    else if (selectedOption === idx) stateClass = "border-red-500 bg-red-50 text-red-700";
                }

                return (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={isSubmitted}
                        className={`w-full p-4 text-left border rounded-xl transition-all flex justify-between items-center ${stateClass}`}
                    >
                        <span>{option}</span>
                        {isSubmitted && idx === activeQuestion.correctIndex && <CheckCircle size={20} className="text-green-600" />}
                        {isSubmitted && selectedOption === idx && idx !== activeQuestion.correctIndex && <XCircle size={20} className="text-red-600" />}
                    </button>
                );
            })}
        </div>

        {isSubmitted && (
            <div className="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-200 animate-fade-in">
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                    <AlertCircle size={16}/> 해설
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">{activeQuestion.explanation}</p>
            </div>
        )}

        <div className="mt-8 flex justify-end gap-3">
            {isSubmitted ? (
                <>
                    {selectedOption !== activeQuestion.correctIndex && (
                        <Button variant="secondary" onClick={handleRetry}>다시 풀기</Button>
                    )}
                    <Button onClick={handleNext} disabled={activeQuestion.id === QUIZ_DATA[QUIZ_DATA.length-1].id}>
                        다음 문제
                    </Button>
                </>
            ) : (
                <Button onClick={handleSubmit} disabled={selectedOption === null}>
                    정답 확인
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};