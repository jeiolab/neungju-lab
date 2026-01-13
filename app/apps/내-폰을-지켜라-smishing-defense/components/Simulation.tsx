import React, { useState, useEffect, useCallback } from 'react';
import PhoneFrame from './PhoneFrame';
import { generateScenario } from '../services/geminiService';
import { Scenario, GameState, ThreatRecord } from '../types';
import { MessageCircle, Mail, AlertTriangle, ShieldCheck, ShieldAlert, PhoneIncoming, Skull } from 'lucide-react';

interface SimulationProps {
  onRecordThreat: (record: ThreatRecord) => void;
  onUpdateScore: (points: number) => void;
  onUpdateInfection: (amount: number) => void;
  infectionLevel: number;
}

const Simulation: React.FC<SimulationProps> = ({ onRecordThreat, onUpdateScore, onUpdateInfection, infectionLevel }) => {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ title: string; message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  const startGame = useCallback(() => {
    setGameState(GameState.PLAYING);
    loadNewScenario();
  }, []);

  const loadNewScenario = async () => {
    setLoading(true);
    setFeedback(null);
    const scenario = await generateScenario();
    setCurrentScenario(scenario);
    setLoading(false);
  };

  const handleAction = (action: 'CLICK' | 'IGNORE' | 'DELETE_REPORT') => {
    if (!currentScenario) return;

    let outcome: 'DEFENDED' | 'INFECTED' | 'MISSED' = 'DEFENDED';
    let feedbackData = null;

    if (currentScenario.isSmishing) {
      if (action === 'CLICK') {
        outcome = 'INFECTED';
        onUpdateInfection(50);
        feedbackData = {
          title: "시스템 감염 경고!",
          message: `악성 링크를 클릭했습니다. ${currentScenario.explanation}`,
          type: 'error' as const
        };
      } else if (action === 'IGNORE') {
        // Passive defense
        outcome = 'DEFENDED';
        onUpdateScore(10);
        feedbackData = {
          title: "방어 성공 (소극적)",
          message: "무시하기는 안전하지만, 신고하면 더 좋습니다.",
          type: 'warning' as const
        };
      } else if (action === 'DELETE_REPORT') {
        outcome = 'DEFENDED';
        onUpdateScore(50);
        feedbackData = {
          title: "완벽한 방어!",
          message: `스미싱을 정확히 파악하고 신고했습니다. ${currentScenario.explanation}`,
          type: 'success' as const
        };
      }
    } else {
      // It is a safe message
      if (action === 'CLICK') {
        outcome = 'DEFENDED';
        onUpdateScore(20);
        feedbackData = {
            title: "정상 접속",
            message: "안전한 메시지입니다. 하지만 항상 의심하는 습관은 좋습니다.",
            type: 'success' as const
        }
      } else if (action === 'IGNORE') {
        outcome = 'MISSED';
        onUpdateScore(-10);
        feedbackData = {
            title: "중요 정보 누락",
            message: "정상적인 알림이었습니다. 무조건적인 차단은 불편을 초래할 수 있습니다.",
            type: 'warning' as const
        }
      } else if (action === 'DELETE_REPORT') {
        outcome = 'MISSED';
        onUpdateScore(-20);
        feedbackData = {
            title: "오인 신고",
            message: "정상적인 메시지를 스미싱으로 오인했습니다. 발신자와 내용을 다시 확인하세요.",
            type: 'warning' as const
        }
      }
    }

    onRecordThreat({
      scenario: currentScenario,
      outcome,
      timestamp: Date.now()
    });

    setFeedback(feedbackData);
    setGameState(GameState.FEEDBACK);
  };

  const nextRound = () => {
    if (infectionLevel >= 100) {
        setGameState(GameState.GAME_OVER);
    } else {
        setGameState(GameState.PLAYING);
        loadNewScenario();
    }
  };

  // Render content based on message type
  const renderMessageContent = () => {
    if (!currentScenario) return null;

    const isEmail = currentScenario.type === 'EMAIL';
    const isKakao = currentScenario.type === 'KAKAO';
    
    return (
      <div className="p-4 bg-white h-full flex flex-col">
        {/* Header */}
        <div className={`flex items-center space-x-3 mb-6 pb-4 border-b ${isKakao ? 'bg-yellow-100 -mx-4 px-4 pt-4' : ''}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
            ${isEmail ? 'bg-blue-500' : isKakao ? 'bg-yellow-400 text-black' : 'bg-green-500'}`}>
            {isEmail ? <Mail size={20} /> : isKakao ? <MessageCircle size={20} /> : <PhoneIncoming size={20} />}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-900">{currentScenario.sender}</p>
            <p className="text-xs text-gray-500">{new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto mb-6">
          <div className={`p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap
            ${isKakao ? 'bg-yellow-100 text-gray-900' : 'bg-gray-100 text-gray-800'}`}>
            {currentScenario.content}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={() => handleAction('CLICK')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
            <span className="text-lg">👆</span> 링크/첨부파일 열기
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
                onClick={() => handleAction('IGNORE')}
                className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors">
                무시하기
            </button>
            <button 
                onClick={() => handleAction('DELETE_REPORT')}
                className="py-3 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                <ShieldAlert size={18} /> 삭제 및 신고
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center min-h-[600px]">
      
      {/* Phone Area */}
      <div className="flex-shrink-0">
        <PhoneFrame isShaking={infectionLevel >= 80} isRedScreen={infectionLevel >= 100}>
            {gameState === GameState.IDLE && (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-6 bg-slate-50">
                    <ShieldCheck size={64} className="text-green-500" />
                    <h2 className="text-2xl font-bold text-slate-800">보안 시뮬레이션</h2>
                    <p className="text-slate-600 text-sm">
                        실제와 유사한 환경에서 스미싱 문자를 판별해보세요.<br/>
                        실수하면 감염도가 올라갑니다!
                    </p>
                    <button onClick={startGame} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition">
                        시뮬레이션 시작
                    </button>
                </div>
            )}

            {loading && (
                 <div className="h-full flex flex-col items-center justify-center space-y-4 bg-slate-50">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 animate-pulse">수신 중...</p>
                 </div>
            )}

            {!loading && gameState === GameState.PLAYING && renderMessageContent()}
            
            {!loading && gameState === GameState.FEEDBACK && feedback && (
                 <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-slate-50">
                    <div className={`p-4 rounded-full ${feedback.type === 'error' ? 'bg-red-100 text-red-600' : feedback.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                        {feedback.type === 'error' ? <Skull size={48} /> : feedback.type === 'success' ? <ShieldCheck size={48} /> : <AlertTriangle size={48} />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{feedback.title}</h3>
                    <p className="text-sm text-gray-600">{feedback.message}</p>
                    <button onClick={nextRound} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                        다음 메시지 확인
                    </button>
                 </div>
            )}
        </PhoneFrame>
      </div>

      {/* Info / Game Over Panel */}
      {gameState === GameState.GAME_OVER && (
         <div className="bg-red-900/90 text-white p-8 rounded-2xl max-w-md shadow-2xl border border-red-500 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
                <Skull size={32} />
                <h2 className="text-3xl font-bold">SYSTEM COMPROMISED</h2>
            </div>
            <p className="mb-6 text-red-200">
                스마트폰이 악성코드에 감염되어 개인정보가 유출되었습니다.
                실제 상황이었다면 금융 피해가 발생했을 수 있습니다.
            </p>
            <div className="bg-black/30 p-4 rounded-lg mb-6">
                <h4 className="font-bold mb-2 text-yellow-400">긴급 대응 가이드</h4>
                <ul className="text-sm space-y-2 list-disc pl-4 text-gray-200">
                    <li>즉시 비행기 모드로 전환하여 네트워크 차단</li>
                    <li>모바일 백신으로 악성 앱 검사 및 삭제</li>
                    <li>KISA 118 상담센터로 신고 (국번없이 118)</li>
                    <li>공인인증서 폐기 및 재발급</li>
                </ul>
            </div>
            <button 
                onClick={() => {
                    onUpdateInfection(-100);
                    setGameState(GameState.IDLE);
                }} 
                className="w-full py-3 bg-white text-red-900 font-bold rounded-lg hover:bg-gray-100 transition">
                시스템 초기화 및 재시작
            </button>
         </div>
      )}
    </div>
  );
};

export default Simulation;