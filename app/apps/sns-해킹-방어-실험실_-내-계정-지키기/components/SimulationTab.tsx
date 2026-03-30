'use client';

import React, { useState, useEffect } from 'react';
import { SimState, SimResult } from '../types';
import { Shield, ShieldAlert, Smartphone, MousePointer, LogOut, KeyRound } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  onSimulationComplete: (score: number) => void;
}

export const SimulationTab: React.FC<Props> = ({ onSimulationComplete }) => {
  const [state, setState] = useState<SimState>({
    twoFactor: false,
    publicPcLogout: false, // Default: didn't logout (Risky)
    clickSuspiciousLink: false, // Default: didn't click (Safe)
    cloudAutoLogin: false, // Default: didn't keep (Safe)
  });

  const [result, setResult] = useState<SimResult | null>(null);

  const calculateRisk = () => {
    let score = 0;
    const feedback: string[] = [];
    let scenario = "평범한 학교 생활 중...";

    // Rule-based scoring
    if (state.clickSuspiciousLink) {
      score += 40;
      feedback.push("⚠️ 수상한 링크 클릭은 악성코드 감염의 지름길입니다.");
      scenario = "무료 이모티콘 문자를 받고 링크를 눌렀더니, 내 폰의 연락처가 모두 유출되었습니다!";
    }

    if (!state.publicPcLogout) {
      score += 25;
      feedback.push("⚠️ 공용 PC 로그아웃을 안 하면 다음 사람이 내 계정을 훔쳐봅니다.");
      if (score < 40) scenario = "PC방에서 그냥 나왔는데, 다음 손님이 내 계정으로 친구들에게 욕설 메시지를 보냈습니다.";
    }

    if (!state.twoFactor) {
      score += 25;
      feedback.push("⚠️ 2단계 인증이 없으면 비밀번호 유출 시 방어할 수 없습니다.");
      if (score < 40) scenario = "쉬운 비밀번호를 썼다가 해외 해커에게 계정을 탈취당했습니다.";
    }

    if (state.cloudAutoLogin) {
      score += 10;
      feedback.push("⚠️ 자동 로그인은 개인 기기에서만 사용하세요.");
    }

    // Determine Level
    let level: SimResult['level'] = 'LOW';
    if (score >= 50) level = 'HIGH';
    else if (score >= 20) level = 'MEDIUM';

    if (score === 0) {
      scenario = "완벽합니다! 해커들이 당신의 계정을 뚫지 못하고 포기했습니다.";
      feedback.push("👍 모든 보안 수칙을 잘 지켰습니다.");
    }

    setResult({ score, level, scenario, feedback });
    onSimulationComplete(score);
  };

  const toggle = (key: keyof SimState) => {
    setState(prev => ({ ...prev, [key]: !prev[key] }));
    setResult(null); // Reset result on change
  };

  return (
    <div className="space-y-6 pb-20">
       <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Shield className="w-32 h-32" />
        </div>
        <h2 className="text-2xl font-bold mb-2">🛡️ 방어 실험실</h2>
        <p className="text-slate-300 mb-4">
          선택지를 조합하여 나의 보안 상태를 점검해보세요. <br/>
          위험도가 낮을수록 안전합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle Controls */}
        <button 
          onClick={() => toggle('twoFactor')}
          className={clsx(
            "p-4 rounded-xl border-2 flex items-center justify-between transition-all",
            state.twoFactor ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", state.twoFactor ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500")}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">2단계 인증</div>
              <div className="text-xs text-slate-500">{state.twoFactor ? "켜짐 (ON)" : "꺼짐 (OFF)"}</div>
            </div>
          </div>
          <div className={clsx("w-4 h-4 rounded-full", state.twoFactor ? "bg-blue-500" : "bg-slate-300")} />
        </button>

        <button 
          onClick={() => toggle('publicPcLogout')}
          className={clsx(
            "p-4 rounded-xl border-2 flex items-center justify-between transition-all",
            !state.publicPcLogout ? "border-red-400 bg-red-50" : "border-green-500 bg-green-50"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", !state.publicPcLogout ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">공용 PC 로그아웃</div>
              <div className="text-xs text-slate-500">{state.publicPcLogout ? "확실히 함" : "그냥 끄고 나옴"}</div>
            </div>
          </div>
          <div className={clsx("w-4 h-4 rounded-full", state.publicPcLogout ? "bg-green-500" : "bg-red-400")} />
        </button>

        <button 
          onClick={() => toggle('clickSuspiciousLink')}
          className={clsx(
            "p-4 rounded-xl border-2 flex items-center justify-between transition-all",
            state.clickSuspiciousLink ? "border-red-500 bg-red-50" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", state.clickSuspiciousLink ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500")}>
              <MousePointer className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">수상한 링크</div>
              <div className="text-xs text-slate-500">{state.clickSuspiciousLink ? "클릭함" : "무시함"}</div>
            </div>
          </div>
          <div className={clsx("w-4 h-4 rounded-full", state.clickSuspiciousLink ? "bg-red-500" : "bg-slate-300")} />
        </button>

         <button 
          onClick={() => toggle('cloudAutoLogin')}
          className={clsx(
            "p-4 rounded-xl border-2 flex items-center justify-between transition-all",
            state.cloudAutoLogin ? "border-orange-400 bg-orange-50" : "border-slate-200 bg-white"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", state.cloudAutoLogin ? "bg-orange-100 text-orange-600" : "bg-slate-100 text-slate-500")}>
              <KeyRound className="w-6 h-6" />
            </div>
            <div className="text-left">
              <div className="font-bold text-slate-900">자동 로그인 유지</div>
              <div className="text-xs text-slate-500">{state.cloudAutoLogin ? "체크함" : "해제함"}</div>
            </div>
          </div>
          <div className={clsx("w-4 h-4 rounded-full", state.cloudAutoLogin ? "bg-orange-400" : "bg-slate-300")} />
        </button>
      </div>

      <div className="flex justify-center mt-6">
        <button 
          onClick={calculateRisk}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 rounded-full shadow-lg transform active:scale-95 transition-all text-lg flex items-center gap-2"
        >
            <ShieldAlert className="w-6 h-6" />
            결과 확인하기
        </button>
      </div>

      {result && (
        <div className="animate-fade-in mt-8 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className={clsx(
            "p-6 text-white text-center",
            result.level === 'HIGH' ? "bg-red-600" :
            result.level === 'MEDIUM' ? "bg-orange-500" : "bg-green-600"
          )}>
            <div className="text-sm font-semibold opacity-90 uppercase tracking-widest mb-1">Risk Analysis</div>
            <h3 className="text-3xl font-extrabold mb-2">
                {result.level === 'HIGH' ? "🚨 위험 (HIGH)" :
                 result.level === 'MEDIUM' ? "⚠️ 주의 (MEDIUM)" : "✅ 안전 (LOW)"}
            </h3>
            <div className="text-4xl font-black bg-white/20 inline-block px-4 py-1 rounded-lg">
                위험도: {result.score}
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    📢 예상 피해 시나리오
                </h4>
                <p className="text-slate-700 leading-relaxed font-medium">
                    "{result.scenario}"
                </p>
            </div>

            <div className="space-y-3">
                 <h4 className="font-bold text-slate-800">💡 보안 피드백</h4>
                 {result.feedback.map((fb, idx) => (
                     <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                         <span>•</span>
                         <span>{fb}</span>
                     </div>
                 ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};