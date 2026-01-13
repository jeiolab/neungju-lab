import React, { useState, useEffect } from 'react';
import { QuizQuestion, IncorrectQuestion } from '../types';
import { generateQuizQuestions } from '../services/geminiService';
import { CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';

interface QuizProps {
  onScoreUpdate: (score: number, incorrect: IncorrectQuestion[]) => void;
}

const Quiz: React.FC<QuizProps> = ({ onScoreUpdate }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [incorrectList, setIncorrectList] = useState<IncorrectQuestion[]>([]);

  const loadQuestions = async () => {
    setLoading(true);
    setFinished(false);
    setCurrentIdx(0);
    setScore(0);
    setIncorrectList([]);
    
    // Attempt to load from API
    const generated = await generateQuizQuestions();
    
    if (generated.length > 0) {
        setQuestions(generated);
    } else {
        // Fallback static questions
        setQuestions([
            { id: 1, question: "카이사르 암호의 키(Key)는 무엇을 의미하나요?", options: ["알파벳의 총 개수", "알파벳을 이동시키는 칸의 수", "암호문의 길이", "만든 사람의 이름"], correctAnswer: 1, explanation: "카이사르 암호에서 키는 알파벳을 몇 칸 밀어서 치환할지를 결정하는 숫자입니다.", tags: ["키", "원리"] },
            { id: 2, question: "'HELLO'를 키 1로 암호화하면?", options: ["IFMMP", "GDKKN", "HELLO", "ZKDDN"], correctAnswer: 0, explanation: "H->I, E->F, L->M, L->M, O->P로 한 칸씩 뒤로 밀립니다.", tags: ["치환"] },
            { id: 3, question: "카이사르 암호의 가장 큰 약점은?", options: ["키가 너무 복잡하다", "컴퓨터로만 풀 수 있다", "글자의 빈도가 변하지 않는다", "키가 100개 이상이다"], correctAnswer: 2, explanation: "단순 치환 암호는 원문의 글자 빈도 특성(예: 'e'가 많음)이 암호문에도 그대로 드러나 빈도 분석에 취약합니다.", tags: ["한계"] }
        ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const isCorrect = optionIdx === questions[currentIdx].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 10);
    } else {
        const wrong: IncorrectQuestion = {
            questionId: questions[currentIdx].id,
            question: questions[currentIdx].question,
            userAnswer: optionIdx,
            correctAnswer: questions[currentIdx].correctAnswer,
            explanation: questions[currentIdx].explanation,
            tags: questions[currentIdx].tags,
            date: new Date().toISOString()
        };
        setIncorrectList(prev => [...prev, wrong]);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      onScoreUpdate(score + (selectedOption === questions[currentIdx].correctAnswer ? 10 : 0), incorrectList);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500">AI가 퀴즈를 생성하고 있습니다...</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">퀴즈 완료!</h2>
        <div className="text-6xl font-black text-indigo-600 mb-6">{score}점</div>
        <p className="text-slate-600 mb-8">
            {score >= 80 ? "훌륭합니다! 암호 전문가시네요!" : "수고하셨습니다! 오답 노트를 확인해보세요."}
        </p>
        <button 
          onClick={loadQuestions}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={20} /> 다시 도전하기
        </button>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const q = questions[currentIdx];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-bold text-slate-400">문제 {currentIdx + 1} / {questions.length}</span>
        <span className="text-sm font-bold text-indigo-600">{score}점</span>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
            {q.question}
        </h3>
        
        <div className="space-y-3">
          {q.options.map((opt, idx) => {
            let className = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium ";
            
            if (isAnswered) {
                if (idx === q.correctAnswer) className += "border-green-500 bg-green-50 text-green-800 ";
                else if (idx === selectedOption) className += "border-red-500 bg-red-50 text-red-800 ";
                else className += "border-slate-100 text-slate-400 ";
            } else {
                className += "border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-700 ";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswered}
                className={className}
              >
                <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {isAnswered && idx === q.correctAnswer && <CheckCircle className="text-green-500" size={20} />}
                    {isAnswered && idx === selectedOption && idx !== q.correctAnswer && <XCircle className="text-red-500" size={20} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {isAnswered && (
        <div className="animate-fade-in-up">
            <div className="bg-slate-100 p-4 rounded-xl mb-4 text-sm text-slate-700">
                <strong>💡 해설:</strong> {q.explanation}
            </div>
            <button 
                onClick={nextQuestion}
                className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
                {currentIdx < questions.length - 1 ? "다음 문제" : "결과 보기"}
            </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
