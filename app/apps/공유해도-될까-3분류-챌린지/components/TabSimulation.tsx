import React, { useState, useEffect } from 'react';
import { GAME_CARDS } from '../constants';
import { ClassificationType, GameCard } from '../types';
import { Share2, Shield, AlertOctagon, RefreshCw, Upload, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';

interface Props {
  onScoreUpdate: (points: number) => void;
  onBadgeEarn: (badge: string) => void;
}

const TabSimulation: React.FC<Props> = ({ onScoreUpdate, onBadgeEarn }) => {
  const [activeTab, setActiveTab] = useState<'game' | 'upload'>('game');

  // Game State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; msg: string; keywords: string[] } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Upload Checker State
  const [toggles, setToggles] = useState({
    blurFace: false,
    removeLocation: false,
    removeName: false,
  });

  const handleClassification = (type: ClassificationType) => {
    const card = GAME_CARDS[currentCardIndex];
    const isCorrect = card.type === type;

    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      onScoreUpdate(10);
      if (streak + 1 === 10) onBadgeEarn("10연속 분류 마스터");
      setFeedback({
        isCorrect: true,
        msg: "정확합니다! " + card.reason,
        keywords: card.keywords
      });
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        msg: "아닙니다. " + card.reason,
        keywords: card.keywords
      });
    }

    setTimeout(() => {
      if (currentCardIndex < GAME_CARDS.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
        setFeedback(null);
      } else {
        setIsFinished(true);
        onScoreUpdate(50); // Completion bonus
      }
    }, 2500);
  };

  const restartGame = () => {
    setCurrentCardIndex(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setIsFinished(false);
  };

  // Upload Checker Logic
  const riskScore = Math.max(0, 100 - (toggles.blurFace ? 40 : 0) - (toggles.removeLocation ? 30 : 0) - (toggles.removeName ? 30 : 0));
  const riskData = [{ name: 'Risk', value: riskScore, fill: riskScore > 50 ? '#ef4444' : (riskScore > 20 ? '#f59e0b' : '#22c55e') }];

  useEffect(() => {
    if (riskScore <= 20) {
       // Could trigger a mini-celebration or badge here strictly if needed,
       // but main badging is handled in App.tsx generally.
    }
  }, [riskScore]);

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('game')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'game' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          3분류 챌린지
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
        >
          업로드 검문소
        </button>
      </div>

      {activeTab === 'game' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden min-h-[400px]">
          {!isFinished ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-400">Card {currentCardIndex + 1} / {GAME_CARDS.length}</span>
                <span className="text-sm font-bold text-blue-600">Streak: {streak} 🔥</span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-8">
                {/* The Card */}
                <div className="w-full max-w-md bg-blue-50 border-2 border-blue-100 rounded-xl p-8 text-center shadow-lg transform transition-all hover:scale-105">
                  <h3 className="text-xl font-bold text-slate-800 break-keep leading-relaxed">
                    {GAME_CARDS[currentCardIndex].content}
                  </h3>
                </div>

                {/* Feedback Overlay */}
                {feedback && (
                  <div className={`absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center p-6 text-center animate-fade-in`}>
                    {feedback.isCorrect ? <CheckCircle className="w-16 h-16 text-green-500 mb-4" /> : <XCircle className="w-16 h-16 text-red-500 mb-4" />}
                    <h4 className={`text-2xl font-bold mb-2 ${feedback.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {feedback.isCorrect ? '정답입니다!' : '오답입니다!'}
                    </h4>
                    <p className="text-slate-600 font-medium mb-4">{feedback.msg}</p>
                    <div className="flex gap-2">
                      {feedback.keywords.map(k => (
                        <span key={k} className="px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded-full">#{k}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-md">
                  <button onClick={() => handleClassification(ClassificationType.SHARE)}
                    className="flex flex-col items-center p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
                    <Share2 className="mb-2" />
                    <span className="font-bold">공유</span>
                  </button>
                  <button onClick={() => handleClassification(ClassificationType.CONDITIONAL)}
                    className="flex flex-col items-center p-4 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200 hover:bg-yellow-100 transition-colors">
                    <AlertOctagon className="mb-2" />
                    <span className="font-bold">조건부</span>
                  </button>
                  <button onClick={() => handleClassification(ClassificationType.PROTECT)}
                    className="flex flex-col items-center p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                    <Shield className="mb-2" />
                    <span className="font-bold">보호</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-10 space-y-6">
              <h3 className="text-2xl font-bold text-slate-800">🎉 챌린지 완료!</h3>
              <p className="text-slate-600">모든 카드를 분류했습니다.</p>
              <div className="text-4xl font-black text-blue-600">+{score} XP</div>
              <button onClick={restartGame} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center mx-auto gap-2">
                <RefreshCw className="w-5 h-5" /> 다시 하기
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Phone Mockup */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm max-w-xs mx-auto w-full relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-10"></div>
            <div className="bg-slate-100 rounded-2xl h-[400px] overflow-hidden flex flex-col relative">
              <div className="h-12 bg-white flex items-center px-4 border-b">
                <span className="font-bold text-sm">새 게시물</span>
              </div>
              <div className="flex-1 bg-slate-200 relative group">
                {/* Mock Image Content */}
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                  <span className="text-4xl">📸</span>
                </div>
                {/* Overlays */}
                {toggles.blurFace && <div className="absolute top-1/3 left-1/3 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border border-white/50 flex items-center justify-center text-xs text-white">얼굴 가림</div>}
                {toggles.removeLocation && <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full">위치 정보 삭제됨</div>}
              </div>
              <div className="p-3 bg-white space-y-2">
                 <div className="flex gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-slate-300"></div>
                    <div className={`h-4 bg-slate-200 rounded w-24 ${toggles.removeName ? 'opacity-20' : ''}`}></div>
                 </div>
                 <div className="h-3 bg-slate-100 rounded w-full"></div>
                 <div className="h-3 bg-slate-100 rounded w-2/3"></div>
              </div>
            </div>
            <button className={`mt-4 w-full py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-colors ${riskScore > 20 ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                <Upload className="w-5 h-5" />
                {riskScore > 20 ? '위험 요소 존재' : '안전하게 공유'}
            </button>
          </div>

          {/* Controls & Feedback */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-blue-600" />
                업로드 전 체크리스트
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'blurFace', label: '얼굴 가리기 (초상권 보호)', desc: '타인의 얼굴을 식별할 수 없게 처리합니다.' },
                  { id: 'removeLocation', label: '위치 태그 삭제', desc: '사진 속 GPS 정보와 위치 태그를 제거합니다.' },
                  { id: 'removeName', label: '이름/연락처 지우기', desc: '개인정보가 포함된 텍스트를 삭제합니다.' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-bold text-slate-700 text-sm">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setToggles(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof toggles] }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${toggles[item.id as keyof typeof toggles] ? 'bg-blue-500' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${toggles[item.id as keyof typeof toggles] ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700">노출 위험도</span>
                <span className={`font-black text-xl ${riskScore > 50 ? 'text-red-500' : (riskScore > 20 ? 'text-orange-500' : 'text-green-500')}`}>{riskScore}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ease-out ${riskScore > 50 ? 'bg-red-500' : (riskScore > 20 ? 'bg-orange-500' : 'bg-green-500')}`}
                    style={{ width: `${riskScore}%` }}
                ></div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2 text-sm">AI 보안관의 조언</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  {riskScore > 50 && <li>현재 상태로 업로드 시 <strong>사생활 침해</strong> 위험이 높습니다.</li>}
                  {toggles.blurFace === false && <li>타인의 얼굴이 노출되어 있습니다. 동의를 구했나요?</li>}
                  {toggles.removeLocation === false && <li>위치 정보가 포함되어 스토킹 범죄 등에 악용될 수 있습니다.</li>}
                  {riskScore <= 20 && <li><strong>안전합니다!</strong> 이제 게시물을 공유해도 좋습니다.</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabSimulation;
