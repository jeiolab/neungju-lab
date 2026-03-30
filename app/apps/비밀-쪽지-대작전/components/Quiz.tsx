import React, { useState } from 'react';
import { QuizQuestion, QuizResult } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Trophy } from 'lucide-react';

interface QuizProps {
  onComplete: (result: QuizResult) => void;
}

const QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "누구나 읽을 수 있는 원래의 메시지를 무엇이라고 할까요?", options: ["암호문", "평문", "주문", "해독문"], correctAnswer: 1, explanation: "평문(Plaintext)은 암호화되지 않은 일반 텍스트입니다.", difficulty: "초급" },
  { id: 2, question: "평문을 암호문으로 바꾸는 과정을 무엇이라고 할까요?", options: ["복호화", "암호화", "전산화", "시각화"], correctAnswer: 1, explanation: "평문을 암호문으로 변환하는 것은 암호화(Encryption)입니다.", difficulty: "초급" },
  { id: 3, question: "암호화와 복호화에 반드시 필요한 '이것'은 무엇일까요?", options: ["자물쇠", "열쇠(Key)", "망치", "지도"], correctAnswer: 1, explanation: "키(Key)가 있어야 암호를 만들거나 풀 수 있습니다.", difficulty: "초급" },
  { id: 4, question: "스파르타에서 사용한 막대봉을 이용한 암호 방식은?", options: ["스키테일", "카이사르", "에니그마", "비즈네르"], correctAnswer: 0, explanation: "스키테일 암호는 막대봉에 가죽끈을 감아 사용했습니다.", difficulty: "중급" },
  { id: 5, question: "카이사르 암호는 글자를 어떻게 변환하나요?", options: ["순서를 섞는다", "일정한 수만큼 민다", "그림으로 바꾼다", "삭제한다"], correctAnswer: 1, explanation: "카이사르 암호는 알파벳을 일정 간격으로 밀어서 치환합니다.", difficulty: "중급" },
  { id: 6, question: "암호문을 다시 평문으로 되돌리는 과정은?", options: ["암호화", "복호화", "재부팅", "초기화"], correctAnswer: 1, explanation: "암호를 푸는 것은 복호화(Decryption)입니다.", difficulty: "중급" },
  { id: 7, question: "키(Key)를 잃어버리면 어떻게 될까요?", options: ["새로 사면 된다", "암호문을 영영 풀 수 없다", "자동으로 풀린다", "상관없다"], correctAnswer: 1, explanation: "키가 없으면 암호문을 원래대로 복구할 수 없습니다.", difficulty: "고급" },
  { id: 8, question: "'C -> F' (3칸 이동) 규칙일 때, 'A'는 무엇으로 변할까요?", options: ["C", "D", "E", "F"], correctAnswer: 1, explanation: "A -> B -> C -> D (3칸 이동)", difficulty: "고급" },
  { id: 9, question: "보안에서 가장 중요한 원칙 중 하나는?", options: ["키는 아무에게나 준다", "키를 안전하게 관리한다", "암호문은 숨기지 않는다", "평문으로 저장한다"], correctAnswer: 1, explanation: "키 관리(Key Management)가 보안의 핵심입니다.", difficulty: "고급" },
  { id: 10, question: "현대 암호가 사용되는 곳이 아닌 것은?", options: ["인터넷 뱅킹", "와이파이 비밀번호", "친구와의 귓속말", "메신저 대화"], correctAnswer: 2, explanation: "직접적인 귓속말은 디지털 암호화 기술이 사용되지 않습니다.", difficulty: "중급" },
];

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const currentQ = QUESTIONS[currentIdx];

  const handleConfirm = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQ.correctAnswer;
    setIsConfirmed(true);

    if (isCorrect) {
      setScore(s => s + 10);
    } else {
      setWrongAnswers(prev => [...prev, currentQ.id]);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedOption(null);
      setIsConfirmed(false);
    } else {
      setShowResult(true);
      onComplete({ score, wrongAnswers, completed: true });
    }
  };

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border-t-8 border-indigo-500 animate-fade-in">
        <div className="text-center mb-8">
          <Trophy size={64} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-slate-800">훈련 종료!</h2>
          <p className="text-xl mt-2 text-slate-600">
            점수: <span className="font-bold text-indigo-600 text-3xl">{score}</span> / 100
          </p>
          <div className="mt-4">
             {score >= 80 ? (
               <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">🎉 보안 견습생 배지 획득!</span>
             ) : (
               <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full font-bold">조금만 더 노력해보자!</span>
             )}
          </div>
        </div>

        {wrongAnswers.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle size={20}/> 오답 노트 (다시 확인해봐!)
            </h3>
            <ul className="space-y-4">
              {QUESTIONS.filter(q => wrongAnswers.includes(q.id)).map(q => (
                <li key={q.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-slate-700 text-sm mb-1">Q. {q.question}</p>
                  <p className="text-red-600 text-sm">💡 {q.explanation}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm font-medium text-slate-500">
        <span>Question {currentIdx + 1} / {QUESTIONS.length}</span>
        <span className={`px-2 py-1 rounded ${currentQ.difficulty === '초급' ? 'bg-green-100 text-green-700' : currentQ.difficulty === '중급' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
          난이도: {currentQ.difficulty}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6">{currentQ.question}</h2>
        
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !isConfirmed && setSelectedOption(idx)}
              disabled={isConfirmed}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2
                ${isConfirmed 
                  ? idx === currentQ.correctAnswer 
                    ? 'bg-green-100 border-green-500 text-green-800' 
                    : idx === selectedOption 
                      ? 'bg-red-100 border-red-500 text-red-800' 
                      : 'border-slate-100 text-slate-400'
                  : idx === selectedOption 
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                    : 'bg-slate-50 border-transparent hover:bg-indigo-50 hover:border-indigo-200'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{idx + 1}. {opt}</span>
                {isConfirmed && idx === currentQ.correctAnswer && <CheckCircle className="text-green-600"/>}
                {isConfirmed && idx === selectedOption && idx !== currentQ.correctAnswer && <XCircle className="text-red-600"/>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feedback & Navigation */}
      {isConfirmed && (
        <div className={`p-4 rounded-xl mb-6 animate-fade-in ${selectedOption === currentQ.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          <p className="font-bold flex items-center gap-2">
            {selectedOption === currentQ.correctAnswer ? '정답이야! 👏' : '앗, 키가 맞지 않아! 🔐'}
          </p>
          <p className="mt-1 text-sm opacity-90">{currentQ.explanation}</p>
        </div>
      )}

      <button
        onClick={isConfirmed ? handleNext : handleConfirm}
        disabled={selectedOption === null}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all
          ${selectedOption === null 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-[1.02]'
          }
        `}
      >
        {isConfirmed ? (currentIdx === QUESTIONS.length - 1 ? '결과 확인하기' : '다음 문제') : '정답 확인'}
      </button>
    </div>
  );
};

export default Quiz;