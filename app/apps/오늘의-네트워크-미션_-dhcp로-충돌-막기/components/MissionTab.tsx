import React, { useState, useEffect } from 'react';
import { analyzeReflection } from '../services/geminiService';
import { Calendar, CheckCircle, Zap, Send, Star, BrainCircuit, Target } from 'lucide-react';
import { DAILY_MISSIONS } from '../constants';

interface MissionTabProps {
  seed: string;
  isCompleted: boolean;
  streak: number;
  onMarkComplete: (reflection: string) => void;
}

export const MissionTab: React.FC<MissionTabProps> = ({ seed, isCompleted, streak, onMarkComplete }) => {
  const [reflection, setReflection] = useState('');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [missionText, setMissionText] = useState("");

  useEffect(() => {
     const idx = parseInt(seed) % DAILY_MISSIONS.length;
     setMissionText(DAILY_MISSIONS[idx]);
  }, [seed]);

  const handleAnalysis = async () => {
    if (!reflection.trim()) return;
    setLoading(true);
    const feedback = await analyzeReflection(missionText, reflection);
    setAiFeedback(feedback);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (reflection.length > 10) {
      onMarkComplete(reflection);
    } else {
        alert("회고를 10자 이상 작성해주세요!");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Streak Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
                <div className="text-indigo-100 font-medium mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    연속 학습
                </div>
                <div className="text-5xl font-black flex items-center gap-2 mt-2">
                    {streak} <span className="text-lg font-normal opacity-80 self-end mb-2">일째</span>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-yellow-300 bg-white/10 w-fit px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
                <Zap className="w-4 h-4 fill-yellow-300" />
                Keep it up!
            </div>
        </div>

        {/* Mission Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h2 className="text-sm font-bold text-blue-500 tracking-widest uppercase">TODAY'S MISSION</h2>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-snug mb-6">
            {missionText || "미션 로딩 중..."}
            </h1>
            
            {isCompleted ? (
            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl font-bold border border-green-100 w-fit">
                <div className="bg-green-200 p-1 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                </div>
                <span>오늘의 미션 완료! 내일도 만나요.</span>
            </div>
            ) : (
            <div className="text-slate-500 flex items-center gap-2 bg-slate-50 p-3 rounded-lg w-fit text-sm">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                하단 탭의 [개념] [실험] [퀴즈]를 먼저 수행하고 회고를 작성하세요.
            </div>
            )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reflection Input */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-slate-800">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            오늘의 미션 회고
            </h3>
            
            {!isCompleted ? (
            <>
                <textarea
                className="w-full p-6 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[160px] text-slate-700 resize-none mb-4 text-base transition-shadow"
                placeholder="오늘 배운 내용을 바탕으로 미션 해결 과정을 적어보세요.&#13;&#10;예: DHCP를 끄면 IP 충돌 위험이 높아진다는 것을 시뮬레이션으로 확인했다."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                ></textarea>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                    onClick={handleAnalysis}
                    disabled={loading || reflection.length < 5}
                    className="flex-1 py-4 bg-purple-50 text-purple-700 rounded-xl font-bold hover:bg-purple-100 transition flex justify-center items-center gap-2 border border-purple-100"
                    >
                    <BrainCircuit className="w-5 h-5" />
                    {loading ? 'AI 분석 중...' : 'AI 선생님 피드백 받기'}
                    </button>
                    <button
                    onClick={handleSubmit}
                    className="flex-1 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex justify-center items-center gap-2"
                    >
                    완료 도장 찍기 <Send className="w-5 h-5" />
                    </button>
                </div>
            </>
            ) : (
                <div className="text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <p className="text-lg leading-relaxed">"{reflection}"</p>
                    <div className="mt-4 text-sm text-slate-400 text-right font-medium">작성 완료됨</div>
                </div>
            )}

            {/* AI Feedback Display */}
            {aiFeedback && (
            <div className="mt-6 bg-purple-50 p-6 rounded-xl border border-purple-100 animate-fade-in">
                <h4 className="font-bold text-purple-800 text-base mb-2 flex items-center gap-2">
                    <div className="bg-purple-200 p-1 rounded-lg">
                        <BrainCircuit className="w-4 h-4"/> 
                    </div>
                    AI 선생님의 조언
                </h4>
                <p className="text-purple-900 text-base leading-relaxed pl-9">{aiFeedback}</p>
            </div>
            )}
        </div>

        {/* Thinking Problem (Static) */}
        <div className="bg-slate-100 p-8 rounded-2xl h-fit border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 text-lg flex items-center gap-2">
                <span>🤔</span> 생각해볼 문제
            </h3>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
                <p className="text-slate-800 font-medium leading-relaxed">
                    DHCP가 꺼진 동아리방에서<br/>새 기기가 들어오면 어떻게 될까?
                </p>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
                <p>• 누군가 IP를 수동으로 입력해야 할까요?</p>
                <p>• 어떤 IP가 비어있는지 어떻게 알 수 있을까요?</p>
            </div>
        </div>
      </div>
    </div>
  );
};