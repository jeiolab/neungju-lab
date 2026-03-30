import React, { useState, useEffect } from 'react';
import { Mission, CompressionType, Category, GameResult } from '../types';
import { FORMAT_OPTIONS, REASON_FRAGMENTS, MISSIONS } from '../constants';
import { getRandomMissions } from '../utils';
import { ArrowRight, CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';

interface GameProps {
  onComplete: (results: GameResult[]) => void;
}

const Game: React.FC<GameProps> = ({ onComplete }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<GameResult[]>([]);
  
  // Step in the current card: 0: Compression, 1: Format, 2: Reason, 3: Feedback
  const [step, setStep] = useState(0);
  
  const [selectedCompression, setSelectedCompression] = useState<CompressionType | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');

  useEffect(() => {
    setMissions(getRandomMissions(MISSIONS, 10));
  }, []);

  const currentMission = missions[currentIndex];

  if (!currentMission) return <div className="p-8 text-center">로딩 중...</div>;

  const handleNextStep = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (step === 2) {
      // Calculate Score
      let score = 0;
      if (selectedCompression === currentMission.correctCompression) score += 30;
      if (selectedFormat === currentMission.correctFormat) score += 40;
      if (selectedReason === currentMission.correctReasonKey) score += 30;

      const isCorrect = score === 100;
      
      const result: GameResult = {
        missionId: currentMission.id,
        isCorrect,
        userCompression: selectedCompression,
        userFormat: selectedFormat,
        userReasonKey: selectedReason,
        points: score
      };

      setResults([...results, result]);
      setStep(3); // Show feedback
    } else {
      // Next Card
      if (currentIndex < missions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setStep(0);
        setSelectedCompression(null);
        setSelectedFormat('');
        setSelectedReason('');
      } else {
        // Game Over
        onComplete([...results]);
      }
    }
  };

  const renderProgressBar = () => (
    <div className="w-full bg-slate-200 h-2 rounded-full mb-6">
      <div 
        className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
        style={{ width: `${((currentIndex + 1) / missions.length) * 100}%` }}
      />
    </div>
  );

  const renderFeedback = () => {
    const result = results[results.length - 1];
    const isPerfect = result.points === 100;

    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 animate-fade-in">
        <div className="flex flex-col items-center mb-4">
          {isPerfect ? (
            <CheckCircle className="w-16 h-16 text-green-500 mb-2" />
          ) : (
            <XCircle className="w-16 h-16 text-orange-500 mb-2" />
          )}
          <h2 className="text-2xl font-bold text-slate-800">
            {isPerfect ? '완벽한 선택입니다!' : '조금 아쉬워요!'}
          </h2>
          <span className="text-lg font-medium text-slate-600">획득 점수: {result.points}점</span>
        </div>

        <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-slate-500">압축 방식</span>
            <div className="text-right">
              <div className={selectedCompression === currentMission.correctCompression ? "text-green-600 font-bold" : "text-red-500 line-through"}>
                {selectedCompression}
              </div>
              {selectedCompression !== currentMission.correctCompression && (
                <div className="text-green-600 font-bold">{currentMission.correctCompression}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-sm text-slate-500">포맷</span>
            <div className="text-right">
              <div className={selectedFormat === currentMission.correctFormat ? "text-green-600 font-bold" : "text-red-500 line-through"}>
                {selectedFormat}
              </div>
              {selectedFormat !== currentMission.correctFormat && (
                <div className="text-green-600 font-bold">{currentMission.correctFormat}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">이유</span>
            <div className="text-right max-w-[70%]">
              <div className={selectedReason === currentMission.correctReasonKey ? "text-green-600 font-bold text-sm" : "text-red-500 line-through text-sm"}>
                {REASON_FRAGMENTS.find(r => r.key === selectedReason)?.text}
              </div>
              {selectedReason !== currentMission.correctReasonKey && (
                <div className="text-green-600 font-bold text-sm">
                  {REASON_FRAGMENTS.find(r => r.key === currentMission.correctReasonKey)?.text}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleNextStep}
          className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {currentIndex < missions.length - 1 ? '다음 미션으로' : '결과 보기'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  };

  if (step === 3) return (
    <div className="max-w-2xl mx-auto p-4">
      {renderProgressBar()}
      {renderFeedback()}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      {renderProgressBar()}
      
      <div className="bg-white rounded-xl shadow-xl overflow-hidden min-h-[400px] flex flex-col">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">MISSION {currentIndex + 1}/10</span>
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded">{currentMission.category}</span>
          </div>
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            {currentMission.scenario}
          </p>
        </div>

        {/* Interaction Area */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          
          {step === 0 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">1단계: 손실 여부를 판단하세요</h3>
              <div className="grid grid-cols-2 gap-4">
                {[CompressionType.LOSSLESS, CompressionType.LOSSY].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCompression(type)}
                    className={`p-6 rounded-xl border-2 text-lg font-bold transition-all ${
                      selectedCompression === type 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200' 
                        : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">2단계: 가장 적절한 포맷은?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {FORMAT_OPTIONS[currentMission.category].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`p-4 rounded-lg border-2 font-medium transition-all ${
                      selectedFormat === fmt 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 hover:border-indigo-300 text-slate-600'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">3단계: 선택한 이유는?</h3>
              <div className="space-y-3">
                {REASON_FRAGMENTS.map((reason) => (
                  <button
                    key={reason.key}
                    onClick={() => setSelectedReason(reason.key)}
                    className={`w-full p-4 rounded-lg border-2 text-left text-sm md:text-base transition-all ${
                      selectedReason === reason.key 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    {reason.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-slate-50">
          <button
            onClick={handleNextStep}
            disabled={(step === 0 && !selectedCompression) || (step === 1 && !selectedFormat) || (step === 2 && !selectedReason)}
            className="w-full py-3 bg-indigo-600 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm transition-all flex items-center justify-center"
          >
            {step === 2 ? '결정하기' : '다음 단계'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
