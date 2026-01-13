import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "유튜브에서 다운로드한 최신 가요를 내 브이로그 배경음악으로 쓰고 싶어요. 출처를 '노래: OOO'이라고 남기면 괜찮을까요?",
    options: ["네, 출처를 밝혔으니 괜찮습니다.", "아니요, 저작권자의 허락 없이는 사용할 수 없습니다."],
    correctAnswer: 1,
    explanation: "출처를 밝힌다고 해서 저작권 침해가 사라지는 것은 아닙니다. 음원 저작권자의 명시적인 허락을 받거나, 저작권 걱정 없는 무료 음원을 사용해야 합니다."
  },
  {
    id: 2,
    question: "학교 수행평가 보고서를 작성하기 위해 뉴스 기사 내용 일부를 인용하고 출처를 정확히 표기했습니다. 이것은 저작권 침해일까요?",
    options: ["아니요, 정당한 범위 내의 인용은 허용됩니다.", "네, 기사 내용을 쓰는 것은 무조건 불법입니다."],
    correctAnswer: 0,
    explanation: "학교 교육 목적이나 비평, 연구 등을 위한 '정당한 범위' 내에서의 인용은 저작권법에서 허용하고 있습니다. 단, 출처는 반드시 표기해야 합니다."
  },
  {
    id: 3,
    question: "무료 이미지 사이트에서 '상업적 이용 불가(Non-Commercial)' 표시가 있는 사진을 받아서 학교 동아리 축제 포스터(무료 배포)에 사용했습니다. 괜찮을까요?",
    options: ["네, 영리 목적이 아니므로 괜찮습니다.", "아니요, 무조건 돈을 내야 합니다."],
    correctAnswer: 0,
    explanation: "학교 동아리 축제 포스터가 무료로 배포되고 영리 목적이 없다면 '비영리(NC)' 조건에 부합하므로 사용 가능합니다."
  }
];

const CopyrightQuiz: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentQ].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setScore(0);
    setShowExplanation(false);
    setSelectedOption(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="mb-6">
          {score === questions.length ? (
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
          ) : (
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={48} />
            </div>
          )}
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 완료!</h2>
        <p className="text-xl text-slate-600 mb-8">
          당신의 점수는 <span className="font-bold text-blue-600 text-2xl">{score}</span> / {questions.length} 입니다.
        </p>
        <button 
          onClick={resetQuiz}
          className="inline-flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition font-medium"
        >
          <RotateCcw size={20} />
          다시 도전하기
        </button>
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">저작권 상식 퀴즈</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Q{currentQ + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-medium text-slate-800 mb-8 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-4 mb-6 flex-1">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showExplanation && handleAnswer(idx)}
              disabled={showExplanation}
              className={`w-full p-4 text-left rounded-xl border-2 transition relative ${
                showExplanation
                  ? idx === question.correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : idx === selectedOption
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-slate-100 text-slate-400'
                  : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                 <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                    showExplanation && idx === question.correctAnswer ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300'
                 }`}>
                    {idx + 1}
                 </div>
                 {option}
              </div>
              {showExplanation && idx === question.correctAnswer && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
              {showExplanation && idx === selectedOption && idx !== question.correctAnswer && <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="animate-fade-in border-t border-slate-100 pt-6">
            <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
              <strong>해설:</strong> {question.explanation}
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center justify-center gap-2 transition"
            >
              다음 문제 <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CopyrightQuiz;