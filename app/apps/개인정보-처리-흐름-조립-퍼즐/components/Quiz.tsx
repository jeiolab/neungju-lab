import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { QUIZ_DATA } from '../constants';
import { evaluateSubjectiveAnswer } from '../services/geminiService';
import { Check, X, Sparkles, AlertCircle } from 'lucide-react';

const Quiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string | number>>({});
  const [feedback, setFeedback] = useState<Record<number, { score: number, text: string }>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);

  const question = QUIZ_DATA[currentIdx];
  const isLast = currentIdx === QUIZ_DATA.length - 1;

  const handleMultipleChoice = (optionIdx: number) => {
    if (feedback[question.id]) return; // already answered

    const isCorrect = optionIdx === question.correctAnswer;
    setUserAnswers({ ...userAnswers, [question.id]: optionIdx });
    setFeedback({
      ...feedback,
      [question.id]: {
        score: isCorrect ? 100 : 0,
        text: isCorrect ? '정답입니다!' : '오답입니다. 다시 한번 생각해보세요.'
      }
    });
  };

  const handleSubjectiveSubmit = async () => {
    const answer = userAnswers[question.id] as string;
    if (!answer || answer.trim().length < 5) {
      alert("답변을 조금 더 구체적으로 작성해주세요.");
      return;
    }

    setIsEvaluating(true);
    const result = await evaluateSubjectiveAnswer(question.question, answer, question.modelAnswer || '');
    setIsEvaluating(false);

    setFeedback({
      ...feedback,
      [question.id]: {
        score: result.score,
        text: result.feedback
      }
    });
  };

  const nextQuestion = () => {
    if (!isLast) setCurrentIdx(p => p + 1);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-slate-100 h-2 w-full">
        <div 
          className="bg-indigo-600 h-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / QUIZ_DATA.length) * 100}%` }}
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            문제 {currentIdx + 1} / {QUIZ_DATA.length}
          </span>
          <span className="text-slate-400 text-sm">{question.type === 'multiple-choice' ? '객관식' : '서술형'}</span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
          {question.question}
        </h3>

        {/* Content Area */}
        <div className="mb-8">
          {question.type === 'multiple-choice' && question.options ? (
            <div className="space-y-3">
              {question.options.map((opt, idx) => {
                const isSelected = userAnswers[question.id] === idx;
                const isAnswered = !!feedback[question.id];
                const isCorrect = question.correctAnswer === idx;
                
                let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                if (isAnswered) {
                  if (isCorrect) btnClass += "border-green-500 bg-green-50 text-green-900";
                  else if (isSelected) btnClass += "border-red-500 bg-red-50 text-red-900";
                  else btnClass += "border-slate-100 text-slate-400";
                } else {
                  btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-slate-50";
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleMultipleChoice(idx)}
                    className={btnClass}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                        ${isAnswered && isCorrect ? 'border-green-600 bg-green-600 text-white' : 'border-current'}
                      `}>
                        {idx + 1}
                      </div>
                      {opt}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <textarea
                value={(userAnswers[question.id] as string) || ''}
                onChange={(e) => !feedback[question.id] && setUserAnswers({...userAnswers, [question.id]: e.target.value})}
                placeholder="내용을 입력하세요..."
                disabled={!!feedback[question.id]}
                className="w-full h-32 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 resize-none"
              />
              {!feedback[question.id] && (
                <button
                  onClick={handleSubjectiveSubmit}
                  disabled={isEvaluating}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:bg-slate-300"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="animate-spin" size={18} /> AI 선생님이 채점 중...
                    </>
                  ) : (
                    <>
                      <Check size={18} /> 제출 및 AI 채점
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feedback Area */}
        {feedback[question.id] && (
          <div className={`p-5 rounded-lg mb-6 border ${
            feedback[question.id].score >= 70 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {feedback[question.id].score >= 70 ? <Check className="text-green-600" /> : <AlertCircle className="text-orange-500" />}
              <h4 className="font-bold text-slate-800">
                {question.type === 'multiple-choice' ? '해설' : `AI 피드백 (점수: ${feedback[question.id].score}점)`}
              </h4>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {question.type === 'multiple-choice' ? question.explanation : feedback[question.id].text}
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end">
          {!isLast && (
            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 disabled:opacity-50"
              disabled={!feedback[question.id]}
            >
              다음 문제
            </button>
          )}
          {isLast && feedback[question.id] && (
             <div className="text-indigo-600 font-bold animate-pulse">
               모든 퀴즈를 완료했습니다!
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;