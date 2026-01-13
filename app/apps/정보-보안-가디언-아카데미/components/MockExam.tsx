import React, { useState, useEffect } from 'react';
import { MOCK_EXAM_QUESTIONS, MODULE_INFO } from '../constants';
import { QuizQuestion, ModuleType } from '../types';
import { CheckCircle2, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { getInstructorFeedback } from '../services/geminiService';

interface Props {
  onCorrectAnswer: (moduleId: ModuleType) => void;
  onWrongAnswer: (question: QuizQuestion) => void;
  instructorMessage: string;
  setInstructorMessage: (msg: string) => void;
}

const MockExam: React.FC<Props> = ({ onCorrectAnswer, onWrongAnswer, instructorMessage, setInstructorMessage }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  const question = MOCK_EXAM_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / MOCK_EXAM_QUESTIONS.length) * 100;

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null);
    setIsAnswered(false);
    setFeedback(null);
  }, [currentQuestionIndex]);

  const handleAnswer = async (answer: string) => {
    if (isAnswered) return;
    
    setSelectedOption(answer);
    setIsAnswered(true);

    const isCorrect = answer === question.correctAnswer;
    
    if (isCorrect) {
      setFeedback('CORRECT');
      onCorrectAnswer(question.moduleId);
      const msg = await getInstructorFeedback('CORRECT');
      setInstructorMessage(msg);
    } else {
      setFeedback('WRONG');
      onWrongAnswer(question);
      const msg = await getInstructorFeedback('INCORRECT', `문제: ${question.question}, 정답설명: ${question.explanation}`);
      setInstructorMessage(msg);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < MOCK_EXAM_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setInstructorMessage("다음 문제다. 긴장 늦추지 마라!");
    } else {
      // Finished
      setInstructorMessage("모든 훈련이 끝났다. 결과 보고서를 확인해라!");
    }
  };

  const isFinished = currentQuestionIndex === MOCK_EXAM_QUESTIONS.length - 1 && isAnswered;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1} / {MOCK_EXAM_QUESTIONS.length}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {MODULE_INFO[question.moduleId].title}
            </span>
            <span className={`text-xs font-bold px-2 py-1 rounded ${
                question.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
                {question.difficulty}
            </span>
        </div>
        
        <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                {question.question}
            </h2>

            <div className="space-y-3">
                {question.type === 'OX' ? (
                    <div className="grid grid-cols-2 gap-4">
                        {['O', 'X'].map((option) => (
                            <button
                                key={option}
                                onClick={() => handleAnswer(option)}
                                disabled={isAnswered}
                                className={`h-24 text-3xl font-black rounded-lg transition-all ${
                                    isAnswered
                                        ? option === question.correctAnswer
                                            ? 'bg-green-500 text-white ring-4 ring-green-200'
                                            : selectedOption === option
                                                ? 'bg-red-500 text-white ring-4 ring-red-200'
                                                : 'bg-slate-100 text-slate-300'
                                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-2 border-slate-200'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                ) : (
                    question.options?.map((option) => (
                        <button
                            key={option}
                            onClick={() => handleAnswer(option)}
                            disabled={isAnswered}
                            className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
                                isAnswered
                                    ? option === question.correctAnswer
                                        ? 'bg-green-50 border-green-500 text-green-700'
                                        : selectedOption === option
                                            ? 'bg-red-50 border-red-500 text-red-700'
                                            : 'bg-slate-50 border-slate-100 text-slate-400'
                                    : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700'
                            }`}
                        >
                            {option}
                        </button>
                    ))
                )}
            </div>
        </div>

        {/* Feedback Section */}
        {isAnswered && (
            <div className={`px-6 py-6 border-t ${feedback === 'CORRECT' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start gap-4">
                    {feedback === 'CORRECT' ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-1 ${feedback === 'CORRECT' ? 'text-green-800' : 'text-red-800'}`}>
                            {feedback === 'CORRECT' ? '정답이다!' : '오답이다!'}
                        </h3>
                        <p className="text-slate-700 mb-4">{question.explanation}</p>
                        
                        {!isFinished ? (
                             <button 
                             onClick={nextQuestion}
                             className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900 transition-colors"
                         >
                             다음 문제 <ArrowRight className="w-4 h-4" />
                         </button>
                        ) : (
                            <div className="text-slate-600 font-bold">
                                모든 훈련 완료. 상단 탭에서 결과를 확인하라.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Instructor Comments */}
      <div className="bg-slate-800 text-blue-100 p-4 rounded-lg flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-blue-400">
             <span className="text-xl">🤖</span>
          </div>
          <div className="flex-1">
              <p className="text-xs font-bold text-blue-400 uppercase mb-1">교관 메시지</p>
              <p className="font-medium animate-pulse">{instructorMessage}</p>
          </div>
      </div>
    </div>
  );
};

export default MockExam;