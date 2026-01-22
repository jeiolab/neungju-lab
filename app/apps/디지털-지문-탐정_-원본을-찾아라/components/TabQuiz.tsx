import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { simulateFileHash } from '../utils/crypto';
import { CheckCircle, XCircle, Search, Award, RefreshCw } from 'lucide-react';

const TOTAL_ROUNDS = 5; // Simplified to 5 for better UX flow

const TabQuiz: React.FC = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'FINISHED'>('START');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to generate a question
  const generateQuestion = async (roundNum: number): Promise<QuizQuestion> => {
    const isHard = roundNum > 3;
    const fileTypes = ['성적표.pdf', '계약서.docx', 'NFT_Art.png', 'CCTV_Video.mp4', '비트코인_지갑.dat'];
    const filename = fileTypes[(roundNum - 1) % fileTypes.length];
    
    // Generate genuine hash
    const genuineHash = await simulateFileHash(filename, false);
    
    // Randomize which option is correct
    const correctIndex = Math.random() > 0.5 ? 0 : 1;
    
    // Generate hashes for options
    const hashA = await simulateFileHash(filename, correctIndex !== 0); // if 0 is correct, A is original
    const hashB = await simulateFileHash(filename, correctIndex !== 1); // if 1 is correct, B is original

    return {
      id: roundNum,
      title: `Round ${roundNum}/${TOTAL_ROUNDS}`,
      scenario: `디지털 포렌식 의뢰가 들어왔습니다. 원본 파일 "${filename}"의 해시값은 아래와 같습니다. 주어진 두 파일 중 원본은 무엇일까요?`,
      originalHash: genuineHash,
      options: [
        { id: 'A', label: '파일 A', content: hashA, isCorrect: correctIndex === 0 },
        { id: 'B', label: '파일 B', content: hashB, isCorrect: correctIndex === 1 },
      ]
    };
  };

  const startGame = async () => {
    setLoading(true);
    setScore(0);
    setRound(1);
    setGameState('PLAYING');
    const q = await generateQuestion(1);
    setCurrentQuestion(q);
    setLoading(false);
  };

  const handleNextRound = async () => {
    if (round >= TOTAL_ROUNDS) {
      setGameState('FINISHED');
      return;
    }
    setLoading(true);
    setSelectedOption(null);
    setShowResult(false);
    const nextRound = round + 1;
    setRound(nextRound);
    const q = await generateQuestion(nextRound);
    setCurrentQuestion(q);
    setLoading(false);
  };

  const handleAnswer = (optionId: string) => {
    if (showResult || !currentQuestion) return;
    setSelectedOption(optionId);
    setShowResult(true);
    
    const correct = currentQuestion.options.find(o => o.id === optionId)?.isCorrect;
    if (correct) {
      setScore(prev => prev + 20); // 20 points per round * 5 rounds = 100
    }
  };

  if (gameState === 'START') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6">
        <div className="p-6 bg-blue-100 rounded-full text-blue-600 animate-bounce">
          <Search size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">디지털 위조 판별 퀴즈</h2>
        <p className="text-slate-600 max-w-md">
          당신은 디지털 포렌식 전문가입니다.<br/>
          제공되는 원본 해시값을 확인하고, 위조되지 않은 진짜 파일을 찾아내세요.
          총 {TOTAL_ROUNDS}라운드가 진행됩니다.
        </p>
        <button 
          onClick={startGame}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          수사 시작하기
        </button>
      </div>
    );
  }

  if (gameState === 'FINISHED') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center space-y-6 animate-fade-in">
        <div className="p-6 bg-yellow-100 rounded-full text-yellow-600">
          <Award size={64} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">수사 종료</h2>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 w-full max-w-sm">
          <div className="text-slate-500 mb-2">최종 점수</div>
          <div className="text-5xl font-black text-blue-600 mb-2">{score}점</div>
          <div className="text-sm font-medium text-slate-400">
            {score === 100 ? '완벽합니다! 전설적인 판별사시군요.' : score >= 60 ? '훌륭한 눈썰미입니다.' : '조금 더 연습이 필요합니다.'}
          </div>
        </div>
        {score === 100 && (
           <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg shadow-md">
             🏆 위조 판별 마스터 배지 획득!
           </div>
        )}
        <button 
          onClick={startGame}
          className="flex items-center space-x-2 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-full transition-all"
        >
          <RefreshCw size={18} />
          <span>다시 도전하기</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6 bg-slate-100 p-4 rounded-lg">
        <div className="text-sm font-bold text-slate-500">ROUND {round}/{TOTAL_ROUNDS}</div>
        <div className="text-xl font-black text-blue-600">{score} Points</div>
      </div>

      {loading || !currentQuestion ? (
        <div className="text-center py-20">파일을 분석중입니다...</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-2">{currentQuestion.scenario}</h3>
            <div className="bg-slate-900 text-green-400 p-3 rounded font-mono text-xs md:text-sm break-all">
              <span className="text-slate-500 select-none mr-2">[ORIGINAL]</span>
              {currentQuestion.originalHash}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option.id;
              let resultClass = "border-slate-200 hover:border-blue-300";
              let icon = null;

              if (showResult) {
                if (option.isCorrect) {
                  resultClass = "border-green-500 bg-green-50 ring-2 ring-green-200";
                  icon = <CheckCircle className="text-green-600" />;
                } else if (isSelected) {
                  resultClass = "border-red-500 bg-red-50 ring-2 ring-red-200";
                  icon = <XCircle className="text-red-600" />;
                } else {
                  resultClass = "opacity-50 border-slate-200";
                }
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  disabled={showResult}
                  className={`relative p-5 rounded-xl border-2 text-left transition-all ${resultClass}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-700">{option.label}</span>
                    {icon}
                  </div>
                  <div className="font-mono text-xs text-slate-500 break-all leading-relaxed">
                     {option.content}
                  </div>
                  {showResult && !option.isCorrect && (
                     <div className="mt-2 text-xs text-red-600 font-bold">해시 불일치! (위조됨)</div>
                  )}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="flex justify-center pt-4 animate-bounce-in">
              <button
                onClick={handleNextRound}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-colors"
              >
                {round === TOTAL_ROUNDS ? '결과 확인' : '다음 라운드'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TabQuiz;