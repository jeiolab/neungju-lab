import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, Play } from 'lucide-react';
import { generateQuizHint } from '../services/geminiService';

interface Card {
  id: number;
  type: 'lossless' | 'lossy';
  revealed: boolean;
}

const EarTrainingQuiz: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'calc' | 'game'>('game');
  
  // Game State
  const [cards, setCards] = useState<Card[]>([
    { id: 1, type: 'lossy', revealed: false },
    { id: 2, type: 'lossless', revealed: false },
    { id: 3, type: 'lossy', revealed: false },
  ]);
  const [gameMessage, setGameMessage] = useState("무손실(Lossless) 카드를 찾으세요");

  // Quiz State
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [hint, setHint] = useState('');
  const [loadingHint, setLoadingHint] = useState(false);

  const shuffleCards = () => {
    const newCards = [...cards].sort(() => Math.random() - 0.5).map(c => ({...c, revealed: false}));
    // Ensure one lossless
    if (!newCards.find(c => c.type === 'lossless')) newCards[0].type = 'lossless';
    setCards(newCards);
    setGameMessage("무손실(Lossless) 카드를 찾으세요");
  };

  const handleCardClick = (id: number) => {
    const clickedCard = cards.find(c => c.id === id);
    if (!clickedCard || clickedCard.revealed) return;

    const newCards = cards.map(c => c.id === id ? { ...c, revealed: true } : c);
    setCards(newCards);

    if (clickedCard.type === 'lossless') {
      setGameMessage("정답! 순수한 WAV 파일입니다.");
    } else {
      setGameMessage("땡! 128kbps MP3였습니다 (노이즈 감지됨).");
    }
  };

  const handleQuizSubmit = async () => {
    const correct = "30"; // approx 30MB for 3 min 16bit 44.1
    // Formula: 44100 * 16 * 2 * 180 / 8 / 1024 / 1024 = 30.28 MB
    
    if (quizAnswer === '30' || quizAnswer === '30.3' || quizAnswer === '30.28') {
      setQuizFeedback('정답입니다! 정확하게 계산하셨네요.');
      setHint('');
      onComplete(); // Trigger streak
    } else {
      setQuizFeedback('틀렸습니다.');
      setLoadingHint(true);
      const generatedHint = await generateQuizHint(
        "3분 길이, 44.1kHz, 16-bit 스테레오 곡의 무손실 WAV 파일 용량(MB)을 계산하세요.",
        quizAnswer
      );
      setHint(generatedHint);
      setLoadingHint(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-studio-800 rounded-lg shadow-2xl border border-studio-700 p-6">
      <div className="flex gap-4 mb-6 border-b border-studio-600 pb-2">
        <button 
          onClick={() => setActiveTab('game')}
          className={`px-4 py-2 rounded font-bold ${activeTab === 'game' ? 'bg-studio-accent text-black' : 'text-gray-400 hover:text-white'}`}
        >
          블라인드 테스트
        </button>
        <button 
          onClick={() => setActiveTab('calc')}
          className={`px-4 py-2 rounded font-bold ${activeTab === 'calc' ? 'bg-studio-accent text-black' : 'text-gray-400 hover:text-white'}`}
        >
          용량 미션
        </button>
      </div>

      {activeTab === 'game' ? (
        <div className="flex-1 flex flex-col items-center justify-center">
           <h3 className="text-xl text-white mb-8">{gameMessage}</h3>
           <div className="flex gap-6">
              {cards.map(card => (
                <div 
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-32 h-48 rounded-xl cursor-pointer transition-all duration-500 transform ${card.revealed ? 'rotate-y-180' : 'hover:scale-105 bg-gradient-to-br from-studio-600 to-studio-700 border-2 border-studio-500'}`}
                >
                  {card.revealed ? (
                    <div className={`w-full h-full flex flex-col items-center justify-center rounded-xl ${card.type === 'lossless' ? 'bg-success text-black' : 'bg-studio-900 border-2 border-warn'}`}>
                      {card.type === 'lossless' ? <CheckCircle size={40} /> : <XCircle size={40} className="text-warn" />}
                      <span className="mt-2 font-bold uppercase">{card.type === 'lossless' ? 'WAV' : 'MP3'}</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HelpCircle className="text-gray-500 w-12 h-12" />
                    </div>
                  )}
                </div>
              ))}
           </div>
           <button 
            onClick={shuffleCards}
            className="mt-10 px-6 py-2 bg-studio-600 hover:bg-studio-500 text-white rounded-full flex items-center gap-2"
           >
             <Play size={16} /> 카드 섞기
           </button>
        </div>
      ) : (
        <div className="flex-1 max-w-lg mx-auto w-full">
           <div className="bg-studio-900 p-6 rounded-lg border border-studio-600">
              <h3 className="text-lg font-bold text-studio-accent mb-4">일일 미션 (Daily Mission)</h3>
              <p className="text-gray-300 mb-6">
                <strong>3분</strong> 길이의 곡을 <strong>44.1kHz, 16-bit, 스테레오</strong>로 녹음했을 때, 비압축(WAV) 파일의 용량은 얼마일까요?
                <br/><span className="text-xs text-gray-500">소수점은 반올림하여 정수(MB)로 입력하세요.</span>
              </p>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={quizAnswer}
                  onChange={(e) => setQuizAnswer(e.target.value)}
                  placeholder="예: 25"
                  className="flex-1 bg-studio-800 border border-studio-600 rounded px-4 py-2 text-white focus:outline-none focus:border-studio-accent"
                />
                <button 
                  onClick={handleQuizSubmit}
                  className="bg-studio-accent text-black font-bold px-6 py-2 rounded hover:bg-cyan-400"
                >
                  제출
                </button>
              </div>

              {quizFeedback && (
                <div className={`mt-4 p-3 rounded ${quizFeedback.includes('정답') ? 'bg-green-900/50 text-green-200' : 'bg-red-900/50 text-red-200'}`}>
                  {quizFeedback}
                </div>
              )}
              
              {hint && (
                <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded text-yellow-200 text-sm">
                   <strong>Pro Tip:</strong> {hint}
                </div>
              )}
              
              {loadingHint && <div className="mt-2 text-xs text-gray-500 animate-pulse">엔지니어에게 물어보는 중...</div>}
           </div>
        </div>
      )}
    </div>
  );
};

export default EarTrainingQuiz;