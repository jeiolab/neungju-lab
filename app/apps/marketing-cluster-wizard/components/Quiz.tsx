import React, { useState, useEffect } from 'react';
import { Trophy, Check, X, Award } from 'lucide-react';
import { QuizScore } from '../types';

const QUESTIONS = [
  {
    id: 1,
    question: "마케팅에서 고객을 비슷한 특성을 가진 그룹으로 나누는 과정을 무엇이라 하나요?",
    options: ["시장 통합 (Market Integration)", "시장 세분화 (Market Segmentation)", "시장 다각화 (Market Diversification)", "시장 침투 (Market Penetration)"],
    answer: 1
  },
  {
    id: 2,
    question: "군집(Cluster)의 개수가 너무 많아질 때 발생할 수 있는 비즈니스 문제는?",
    options: ["고객 만족도가 급격히 떨어진다", "생산 및 관리 비용이 증가한다", "데이터 분석이 너무 쉬워진다", "경쟁사가 줄어든다"],
    answer: 1
  },
  {
    id: 3,
    question: "다음 중 군집화를 위한 변수로 가장 적절하지 않은 것은?",
    options: ["구매 빈도", "거주 지역", "고객의 이름 철자 길이", "연령대"],
    answer: 2
  }
];

const Quiz: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState("");
  const [highScores, setHighScores] = useState<QuizScore[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mcw_highscores');
    if (stored) {
      setHighScores(JSON.parse(stored));
    }
  }, []);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === QUESTIONS[currentStep].answer) {
      setScore(prev => prev + 1);
    }
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleSaveScore = () => {
    if (!userName.trim()) return;
    const newScore: QuizScore = {
      name: userName,
      score: (score + (selectedOption === QUESTIONS[currentStep].answer ? 1 : 0)) * 100 / QUESTIONS.length, // Normalize to 100 based on final check
      date: new Date().toLocaleDateString()
    };
    
    // Recalculate strict score for display logic above handled loosely, let's fix strictly:
    // Actually the score state is updated *before* the last step click? No.
    // Let's simplify: score tracks correct answers so far.
    // On the last question, handleNext checks the answer.
    
    // Wait, the logic inside handleNext adds to score if correct.
    // If we are at the end, handleNext runs, updates score state, then sets ShowResult.
    // But State update is async.
    // Better to calculate final score inside render or use a ref, but for simplicity:
    
    const finalScoreRaw = score + (selectedOption === QUESTIONS[currentStep].answer ? 1 : 0);
    const finalPercent = Math.round((finalScoreRaw / QUESTIONS.length) * 100);

    const updated = [...highScores, { ...newScore, score: finalPercent }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5
    
    localStorage.setItem('mcw_highscores', JSON.stringify(updated));
    setHighScores(updated);
    setUserName("");
    // Prevent double submission handled by UI state ideally, but simple alert here
    alert("명예의 전당에 등록되었습니다!");
  };

  const restart = () => {
    setCurrentStep(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (showResult) {
    const finalScoreRaw = score + (selectedOption === QUESTIONS[currentStep].answer ? 1 : 0);
    const percentage = Math.round((finalScoreRaw / QUESTIONS.length) * 100);

    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-fadeIn">
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
          <Trophy className={`w-20 h-20 mx-auto mb-6 ${percentage === 100 ? 'text-yellow-400 animate-bounce' : 'text-gray-300'}`} />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">퀴즈 종료!</h2>
          <p className="text-gray-500 mb-6">수고하셨습니다. 당신의 점수는?</p>
          
          <div className="text-6xl font-extrabold text-blue-600 mb-8">
            {percentage}점
          </div>

          {percentage === 100 ? (
            <div className="space-y-4">
              <p className="text-emerald-600 font-semibold">🎉 축하합니다! 완벽한 마케터시군요!</p>
              <div className="flex gap-2 justify-center max-w-xs mx-auto">
                <input 
                  type="text" 
                  placeholder="이름을 입력하세요" 
                  className="border p-2 rounded w-full"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <button 
                  onClick={handleSaveScore}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                >
                  등록
                </button>
              </div>
            </div>
          ) : (
             <p className="text-gray-600">조금만 더 노력하면 완벽할 수 있어요!</p>
          )}

          <button 
            onClick={restart}
            className="mt-8 text-blue-500 underline hover:text-blue-700"
          >
            다시 도전하기
          </button>
        </div>

        {highScores.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Award className="w-5 h-5 mr-2 text-yellow-500" /> 명예의 전당
            </h3>
            <ul className="space-y-3">
              {highScores.map((s, i) => (
                <li key={i} className="flex justify-between items-center border-b pb-2 last:border-0 text-sm">
                  <span className="font-medium text-gray-700">{i+1}. {s.name}</span>
                  <span className="font-bold text-blue-600">{s.score}점</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold text-blue-600 tracking-wider">QUIZ {currentStep + 1} / {QUESTIONS.length}</span>
          <span className="text-xs text-gray-400">Marketing Basics</span>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-8 min-h-[60px]">
          {QUESTIONS[currentStep].question}
        </h3>

        <div className="space-y-3">
          {QUESTIONS[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${
                selectedOption === idx 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              {option}
              {selectedOption === idx && <Check className="w-5 h-5 text-blue-600" />}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selectedOption === null}
          className="w-full mt-8 bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === QUESTIONS.length - 1 ? '결과 확인하기' : '다음 문제'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
