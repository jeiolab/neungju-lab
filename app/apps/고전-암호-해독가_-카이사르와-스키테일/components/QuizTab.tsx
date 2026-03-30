import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { caesarCipher, scytaleCipher } from '../services/cipherUtils';
import { Trophy, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';

const INITIAL_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    type: 'caesar',
    question: "가장 기초적인 문제입니다. Shift 키는 1입니다.",
    cipherText: "IBM",
    key: 1,
    answer: "HAL",
    hint: "각 알파벳을 뒤로 한 칸씩만 보내보세요."
  },
  {
    id: 2,
    type: 'caesar',
    question: "황제의 이름입니다. 키는 3입니다.",
    cipherText: "FDHVDU",
    key: 3,
    answer: "CAESAR",
    hint: "C -> F (3칸 이동). 반대로 하려면 -3을 해보세요."
  },
  {
    id: 3,
    type: 'scytale',
    question: "막대의 지름(행)은 2입니다.",
    cipherText: "HLEOL",
    key: 2,
    answer: "HELLO",
    hint: "두 줄로 글자를 배치해보세요. H, L, E, O, L..."
  },
   {
    id: 4,
    type: 'caesar',
    question: "한글도 가능합니다! 키는 1입니다.",
    cipherText: "나",
    key: 1,
    answer: "가",
    hint: "'가' 다음은 '각'... 이 아니라 유니코드 순서입니다. '가'의 유니코드는 44032, '나'는 45208이 아닙니다. 이 앱의 로직은 단순 유니코드 +1 입니다. '가' 다음 글자는 '각'입니다. 앗, 퀴즈 데이터 오류일까요? 이 앱의 로직대로면 '가'+1 = '각'입니다. 문제를 수정합니다: 암호문 '각', 키 1 -> 평문 '가'"
  }
];

// Correcting logic for Q4 based on implementation
const FIXED_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        type: 'caesar',
        question: "IBM 컴퓨터의 이름 유래에 대한 농담이 있습니다.",
        cipherText: "IBM",
        key: 1,
        answer: "HAL", // H->I, A->B, L->M
        hint: "알파벳 순서에서 바로 앞 글자를 생각하세요."
    },
    {
        id: 2,
        type: 'caesar',
        question: "로마의 장군. 키값(Shift)은 3입니다.",
        cipherText: "FDHVDU",
        key: 3,
        answer: "CAESAR",
        hint: "D에서 3을 빼면 A입니다."
    },
    {
        id: 3,
        type: 'scytale',
        question: "작은 막대에 감긴 띠. 지름(행)은 2입니다.",
        cipherText: "HLOEL", // H E L L O -> 2 rows: H L O / E L _ -> H L O E L
        key: 2,
        answer: "HELLO",
        hint: "지그재그로 읽어보세요."
    },
    {
        id: 4,
        type: 'scytale',
        question: "지름 2인 막대입니다. 숨겨진 단어는?",
        key: 2,
        cipherText: "KYE",
        answer: "KEY",
        hint: "총 3글자입니다."
    }
]

export const QuizTab: React.FC = () => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const question = FIXED_QUESTIONS[currentQIndex];

  const handleSubmit = () => {
    const cleanUser = userAnswer.toUpperCase().replace(/\s/g, '');
    const cleanAnswer = question.answer.toUpperCase().replace(/\s/g, '');

    if (cleanUser === cleanAnswer) {
      setFeedback('correct');
      setScore(s => s + 10);
      setTimeout(() => {
        setFeedback(null);
        setUserAnswer('');
        setShowHint(false);
        if (currentQIndex < FIXED_QUESTIONS.length - 1) {
          setCurrentQIndex(curr => curr + 1);
        } else {
            alert(`축하합니다! 모든 문제를 해결했습니다. 최종 점수: ${score + 10}`);
            setCurrentQIndex(0);
            setScore(0);
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center bg-stone-800 text-stone-100 p-4 rounded-lg shadow-md">
        <div className="flex items-center space-x-2">
          <Trophy className="text-yellow-500" />
          <span className="font-bold text-lg">명탐정 랭킹: {score}점</span>
        </div>
        <div className="text-sm text-stone-400">
          문제 {currentQIndex + 1} / {FIXED_QUESTIONS.length}
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-stone-200 relative overflow-hidden">
        {feedback === 'correct' && (
             <div className="absolute inset-0 bg-green-100/90 flex items-center justify-center z-10 animate-pulse">
                <CheckCircle size={64} className="text-green-600" />
             </div>
        )}
        {feedback === 'incorrect' && (
             <div className="absolute inset-0 bg-red-100/90 flex items-center justify-center z-10 animate-pulse">
                <AlertCircle size={64} className="text-red-600" />
             </div>
        )}

        <div className="mb-6">
           <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-2 ${question.type === 'caesar' ? 'bg-amber-600' : 'bg-stone-600'}`}>
              {question.type === 'caesar' ? '카이사르 암호' : '스키테일 암호'}
           </span>
           <h3 className="text-2xl font-serif font-bold text-stone-800">{question.question}</h3>
        </div>

        <div className="space-y-6">
           <div className="bg-stone-100 p-4 rounded-lg border border-stone-300">
              <p className="text-sm text-stone-500 uppercase tracking-widest mb-1">암호문 (Ciphertext)</p>
              <p className="text-3xl font-mono font-bold text-stone-900 tracking-widest">{question.cipherText}</p>
              <p className="text-sm text-stone-500 mt-2">
                 Key ({question.type === 'caesar' ? 'Shift' : 'Diameter'}): <span className="font-bold text-stone-800">{question.key}</span>
              </p>
           </div>

           <div className="space-y-2">
             <label className="block text-sm font-bold text-stone-700">평문(정답)을 입력하세요:</label>
             <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="flex-1 p-3 border-2 border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 uppercase font-mono"
                  placeholder="ANSWER"
                />
                <button 
                  onClick={handleSubmit}
                  className="bg-amber-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-amber-700 transition-colors shadow-md"
                >
                  해독
                </button>
             </div>
           </div>

           <div className="pt-4 border-t border-stone-100">
              <button 
                onClick={() => setShowHint(!showHint)}
                className="flex items-center text-sm text-stone-500 hover:text-amber-600 transition-colors"
              >
                <HelpCircle size={16} className="mr-1" />
                {showHint ? "힌트 숨기기" : "힌트 보기"}
              </button>
              {showHint && (
                  <p className="mt-2 text-sm text-amber-700 bg-amber-50 p-2 rounded animate-fade-in">
                      💡 {question.hint}
                  </p>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};