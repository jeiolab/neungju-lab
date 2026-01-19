import React, { useState } from 'react';
import { JOB_CARDS } from '../constants';
import { JobCard, UserStats, JobType } from '../types';
import { CheckCircle, XCircle, Bot, Handshake, Heart, ArrowRight, HelpCircle } from 'lucide-react';

interface JobGameTabProps {
  onComplete: (correct: boolean, jobId: string) => void;
  gameHistory: { jobId: string; isCorrect: boolean }[];
}

const JobGameTab: React.FC<JobGameTabProps> = ({ onComplete, gameHistory }) => {
  // Filter out jobs already played correctly to focus on learning? 
  // For this v1, let's just show all or shuffle. Let's just iterate.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<JobType | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Filter functionality optional, for now just show random or sequential
  const currentCard = JOB_CARDS[currentIndex];
  
  const handleAnswer = (type: JobType) => {
    if (showFeedback) return;
    setSelectedAnswer(type);
    setShowFeedback(true);
    
    const isCorrect = type === currentCard.correctType;
    onComplete(isCorrect, currentCard.id);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCurrentIndex((prev) => (prev + 1) % JOB_CARDS.length);
  };

  const isCorrect = selectedAnswer === currentCard.correctType;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 mb-6">
        <h2 className="text-lg font-bold text-purple-900 mb-1">🎮 직업 판별 게임</h2>
        <p className="text-sm text-purple-700">
          제시된 업무 카드를 보고, 미래에 어떻게 변할지 판별해주세요.
          <br/>
          <span className="text-xs opacity-75">*외부 인터넷 연결 없이 내부 데이터로만 판정합니다.</span>
        </p>
      </div>

      {/* Progress */}
      <div className="flex justify-between text-xs text-gray-400 mb-2 px-1">
        <span>Card {currentIndex + 1} / {JOB_CARDS.length}</span>
        <span>History: {gameHistory.length} played</span>
      </div>

      {/* Card Area */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative min-h-[400px]">
        {/* Card Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
             <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{currentCard.category}</span>
             <h3 className="text-2xl font-bold text-gray-800">{currentCard.title}</h3>
          </div>
          <div className="bg-white p-2 rounded-full shadow-sm">
             <HelpCircle className="text-gray-400" size={24} />
          </div>
        </div>

        {/* Card Body - Task Description */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-2">하는 일</h4>
            <p className="text-lg text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
              {currentCard.description}
            </p>
          </div>

          {!showFeedback ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-500 mb-2 text-center">어떻게 변할까요?</h4>
              <button 
                onClick={() => handleAnswer('AUTOMATION')}
                className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 flex items-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Bot size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">자동화 가능</div>
                  <div className="text-xs text-gray-500">기계가 대신할 수 있어요</div>
                </div>
              </button>

              <button 
                onClick={() => handleAnswer('COLLABORATION')}
                className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 flex items-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Handshake size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">협업 (Augmentation)</div>
                  <div className="text-xs text-gray-500">기술과 사람이 함께해야 해요</div>
                </div>
              </button>

              <button 
                onClick={() => handleAnswer('HUMAN_CENTRIC')}
                className="w-full p-4 rounded-xl border-2 border-gray-100 hover:border-pink-500 hover:bg-pink-50 flex items-center transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mr-4 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  <Heart size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">사람 중심 (Human Only)</div>
                  <div className="text-xs text-gray-500">사람만이 할 수 있어요</div>
                </div>
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className={`p-4 rounded-lg mb-4 flex items-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isCorrect ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
                <span className="font-bold">{isCorrect ? '정답입니다!' : '아쉽네요. 다시 생각해볼까요?'}</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-5 space-y-4 border border-gray-200">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase mb-1">판단 근거</div>
                  <p className="text-sm text-gray-800 font-medium">{currentCard.feedback.reason}</p>
                </div>
                <div>
                   <div className="text-xs font-bold text-gray-400 uppercase mb-1">기술 vs 사람</div>
                   <p className="text-sm text-gray-800">{currentCard.feedback.techRole}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                   <div className="flex items-start text-sm text-gray-600 italic">
                     <span className="mr-2 not-italic">💡</span>
                     "{currentCard.feedback.analogy}"
                   </div>
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="mt-6 w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                다음 카드 보기 <ArrowRight className="ml-2" size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobGameTab;