import React, { useState } from 'react';
import { SimState, MethodType } from '../types';
import { ArrowRight, RefreshCw, Smartphone, Wifi, Bluetooth, Nfc, Cloud, Cable, HelpCircle } from 'lucide-react';
import { getSimulationFeedback } from '../services/geminiService';

const Simulation: React.FC = () => {
  const [state, setState] = useState<SimState>({
    distance: 'close',
    fileSize: 'small',
    internet: 'yes',
    security: 'low'
  });
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Local Logic (Deterministic)
  const calculateRecommendation = (): MethodType => {
    const { distance, fileSize, internet, security } = state;

    if (distance === 'close') {
      if (fileSize === 'small') {
        if (security === 'high') return 'NFC'; // High security close range
        return 'Bluetooth'; // Default simple close range
      } else { // Large file close
        if (internet === 'no') return 'Wi-Fi'; // Wi-Fi Direct
        return 'Cloud'; // Convenient
      }
    } else { // Far distance
      if (security === 'high') return 'Wired'; // But wired is distance constrained... actually wired implies physical connection. 
      // If "Far" usually means remote. Wired is only possible if connected via infrastructure, but logically "Wired" usually means a cable between devices. 
      // Let's assume "Far" means different locations.
      if (internet === 'yes') return 'Cloud';
      return 'Mobile'; // Fallback if internet implies Wi-Fi, otherwise Mobile Network
    }
  };

  const recommendation = calculateRecommendation();

  const handleAIAnalysis = async () => {
    setLoading(true);
    const result = await getSimulationFeedback(state.distance, state.fileSize, state.internet, state.security);
    setFeedback(result);
    setLoading(false);
  };

  const getIcon = (method: MethodType) => {
    switch (method) {
      case 'Wi-Fi': return <Wifi className="w-12 h-12" />;
      case 'Bluetooth': return <Bluetooth className="w-12 h-12" />;
      case 'NFC': return <Nfc className="w-12 h-12" />;
      case 'Cloud': return <Cloud className="w-12 h-12" />;
      case 'Mobile': return <Smartphone className="w-12 h-12" />;
      case 'Wired': return <Cable className="w-12 h-12" />;
      default: return <HelpCircle className="w-12 h-12" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-center">전송 환경 시뮬레이터</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">상대방과의 거리</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setState(s => ({...s, distance: 'close'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.distance === 'close' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                가까움 (10m 이내)
              </button>
              <button 
                onClick={() => setState(s => ({...s, distance: 'far'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.distance === 'far' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                멂 (다른 장소)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">파일 용량</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setState(s => ({...s, fileSize: 'small'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.fileSize === 'small' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                작음 (사진/문서)
              </button>
              <button 
                onClick={() => setState(s => ({...s, fileSize: 'large'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.fileSize === 'large' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                큼 (영상/DB)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">인터넷 가능 여부</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setState(s => ({...s, internet: 'yes'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.internet === 'yes' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                가능
              </button>
              <button 
                onClick={() => setState(s => ({...s, internet: 'no'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.internet === 'no' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                불가능
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">보안 중요도</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setState(s => ({...s, security: 'low'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.security === 'low' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                일반
              </button>
              <button 
                onClick={() => setState(s => ({...s, security: 'high'}))}
                className={`flex-1 py-2 text-sm rounded-md transition-all ${state.security === 'high' ? 'bg-white shadow text-indigo-600 font-bold' : 'text-slate-400'}`}
              >
                매우 높음
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500 mb-4">추천 방식</p>
            <div className="inline-flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-full text-indigo-600 mb-4 ring-4 ring-indigo-100 animate-pulse">
                {getIcon(recommendation)}
                <span className="mt-2 font-bold text-xl">{recommendation}</span>
            </div>
            
            <div className="mt-4">
                <button 
                    onClick={handleAIAnalysis}
                    disabled={loading}
                    className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-indigo-600 disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>AI 상세 분석 요청하기</span>
                </button>
            </div>

            {feedback && (
                <div className="mt-4 p-4 bg-slate-800 text-slate-100 rounded-lg text-sm text-left leading-relaxed">
                    <span className="font-bold text-yellow-400 mb-1 block">AI Feedback:</span>
                    {feedback}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
