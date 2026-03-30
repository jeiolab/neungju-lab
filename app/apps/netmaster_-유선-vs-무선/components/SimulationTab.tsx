import React, { useState } from 'react';
import { SCENARIOS } from '../constants';
import { Cable, Wifi } from 'lucide-react';

interface SimulationTabProps {
  onComplete: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong', message: string } | null>(null);

  const currentScenario = SCENARIOS[currentIndex];

  const handleChoice = (choice: 'wired' | 'wireless') => {
    if (feedback) return; // Prevent double clicking

    const isCorrect = choice === currentScenario.correctChoice;
    
    if (isCorrect) {
      setFeedback({ type: 'correct', message: currentScenario.feedbackCorrect });
      onComplete(); // Give XP
    } else {
      setFeedback({ type: 'wrong', message: currentScenario.feedbackWrong });
    }
  };

  const nextScenario = () => {
    setFeedback(null);
    setCurrentIndex((prev) => (prev + 1) % SCENARIOS.length);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="bg-purple-100 text-purple-700 text-sm px-2 py-1 rounded mr-2">시뮬레이션</span>
        상황에 맞는 네트워크 고르기
      </h2>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex-grow flex flex-col justify-center text-center border border-gray-100">
        <div className="mb-4">
           <span className="text-4xl">🤔</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">상황 {currentIndex + 1}</h3>
        <p className="text-gray-600 mb-6 text-lg break-keep">{currentScenario.situation}</p>
        <p className="text-blue-600 font-medium bg-blue-50 p-3 rounded-lg inline-block mx-auto">
          Q. {currentScenario.task}
        </p>
      </div>

      {!feedback && (
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <button
            onClick={() => handleChoice('wired')}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition active:scale-95 group"
          >
            <Cable className="w-10 h-10 text-gray-400 group-hover:text-blue-600 mb-2" />
            <span className="font-bold text-gray-700 group-hover:text-blue-700">유선 연결</span>
          </button>
          
          <button
            onClick={() => handleChoice('wireless')}
            className="flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition active:scale-95 group"
          >
            <Wifi className="w-10 h-10 text-gray-400 group-hover:text-green-600 mb-2" />
            <span className="font-bold text-gray-700 group-hover:text-green-700">무선 (Wi-Fi)</span>
          </button>
        </div>
      )}

      {feedback && (
        <div className={`mt-auto p-6 rounded-xl border-2 animate-fade-in
          ${feedback.type === 'correct' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start gap-3">
             <div className="text-2xl">{feedback.type === 'correct' ? '🎉' : '😅'}</div>
             <div>
               <h4 className={`font-bold mb-1 ${feedback.type === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                 {feedback.type === 'correct' ? '정답입니다!' : '다시 생각해볼까요?'}
               </h4>
               <p className="text-sm text-gray-700 leading-relaxed mb-4">{feedback.message}</p>
               
               <button 
                 onClick={nextScenario}
                 className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
               >
                 다음 문제 도전
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTab;