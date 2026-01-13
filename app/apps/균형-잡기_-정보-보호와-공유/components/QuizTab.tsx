import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';
import { Card, Button } from './ui/UIComponents';
import { gradeEssay } from '../services/geminiService';
import { Check, X, HelpCircle, Loader2 } from 'lucide-react';

interface QuizTabProps {
    addScore: (score: number) => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ addScore }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string; aiFeedback?: string } | null>(null);
  const [isGrading, setIsGrading] = useState(false);

  const question = QUIZ_DATA[currentQIndex];
  const isLastQuestion = currentQIndex === QUIZ_DATA.length - 1;

  const handleObjectiveSubmit = (option: string) => {
    const isCorrect = option === question.correctAnswer;
    setFeedback({
      isCorrect,
      msg: isCorrect ? '정답입니다! +10점' : `오답입니다. 정답은 '${question.correctAnswer}' 입니다.`,
    });
    if (isCorrect) addScore(10);
  };

  const handleShortAnswerSubmit = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === question.correctAnswer?.toLowerCase();
    setFeedback({
      isCorrect,
      msg: isCorrect ? '정답입니다! +20점' : `오답입니다. 정답은 '${question.correctAnswer}' 입니다.`,
    });
     if (isCorrect) addScore(20);
  };

  const handleEssaySubmit = async () => {
    setIsGrading(true);
    const result = await gradeEssay(question.question, userAnswer);
    setIsGrading(false);
    
    setFeedback({
      isCorrect: result.score >= 7,
      msg: `AI 채점 점수: ${result.score}/10점`,
      aiFeedback: result.feedback
    });
    addScore(result.score);
  };

  const nextQuestion = () => {
    if (isLastQuestion) return;
    setFeedback(null);
    setUserAnswer('');
    setCurrentQIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center text-slate-500 text-sm font-bold">
        <span>QUESTION {currentQIndex + 1} / {QUIZ_DATA.length}</span>
        <span className={`px-2 py-1 rounded ${question.difficulty === 'hard' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
            {question.difficulty.toUpperCase()}
        </span>
      </div>

      <Card className="min-h-[200px] flex flex-col justify-center">
        <h3 className="text-xl font-bold text-slate-800 mb-4">{question.question}</h3>
        
        {/* Objective Type */}
        {question.type === 'objective' && !feedback && (
          <div className="grid gap-3">
            {question.options?.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleObjectiveSubmit(opt)}
                className="p-3 text-left border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Short Answer / Essay Type */}
        {question.type !== 'objective' && !feedback && (
          <div className="space-y-4">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={question.type === 'short_answer' ? "단답형 정답을 입력하세요" : "서술형 답변을 입력하세요"}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={question.type === 'essay' ? 4 : 1}
            />
            <Button 
                onClick={question.type === 'short_answer' ? handleShortAnswerSubmit : handleEssaySubmit}
                disabled={!userAnswer.trim() || isGrading}
                className="w-full"
            >
                {isGrading ? <Loader2 className="animate-spin mx-auto"/> : '제출하기'}
            </Button>
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className={`mt-6 p-4 rounded-xl ${feedback.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3 mb-2">
                {feedback.isCorrect ? <Check className="text-green-600"/> : <X className="text-red-600"/>}
                <span className={`font-bold ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback.msg}
                </span>
            </div>
            
            {question.explanation && (
                <div className="mt-2 text-sm text-slate-600 flex gap-2">
                    <HelpCircle className="w-4 h-4 shrink-0 mt-0.5"/>
                    <p>{question.explanation}</p>
                </div>
            )}

            {feedback.aiFeedback && (
                 <div className="mt-3 text-sm bg-white p-3 rounded-lg border border-slate-200 text-slate-700">
                    <span className="font-bold text-purple-600">🤖 AI Feedback: </span>
                    {feedback.aiFeedback}
                 </div>
            )}

            <div className="mt-4 flex justify-end">
                 {isLastQuestion ? (
                    <Button onClick={() => alert("퀴즈 완료! 다른 탭에서 더 학습해보세요.")} variant="secondary">완료</Button>
                 ) : (
                    <Button onClick={nextQuestion}>다음 문제</Button>
                 )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default QuizTab;
