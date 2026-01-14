import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

export const SimulationTab: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(0);
  const [hasUpper, setHasUpper] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  
  // Custom "Micro" Simulation State (Not using real inputs for safety, using toggles/sliders per requirement)
  // Requirement: Input 1~2 (Length/Combo) -> Result -> Feedback
  
  const [simLength, setSimLength] = useState(8);
  const [simUseUpper, setSimUseUpper] = useState(false);
  const [simUseNumber, setSimUseNumber] = useState(true);
  const [simUseSpecial, setSimUseSpecial] = useState(false);

  const calculateRisk = () => {
    let score = 0;
    // Length weight
    if (simLength < 8) score += 10;
    else if (simLength < 10) score += 40;
    else score += 60;

    // Complexity weight
    if (simUseNumber) score += 10;
    if (simUseUpper) score += 15;
    if (simUseSpecial) score += 15;

    // Cap at 100
    return Math.min(100, score);
  };

  const riskScore = calculateRisk();

  const getFeedback = (score: number) => {
    if (score < 50) return {
      level: '위험 (Weak)',
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      barColor: 'bg-rose-500',
      icon: <ShieldAlert size={48} className="text-rose-500" />,
      text: [
        '단조로운 비밀번호는 해커의 "사전 공격"이나 "무차별 대입"에 1초 만에 뚫릴 수 있어.',
        '길이를 10자 이상으로 늘리고, 특수문자를 꼭 섞어줘.',
        '오늘 미션: 내가 쓰는 주요 사이트 비번 하나 업데이트하기!'
      ]
    };
    if (score < 80) return {
      level: '보통 (Moderate)',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      barColor: 'bg-yellow-500',
      icon: <Shield size={48} className="text-yellow-500" />,
      text: [
        '나쁘지 않지만, 안심하긴 일러. 슈퍼컴퓨터라면 며칠 내로 뚫을 수도 있어.',
        '대문자를 섞어서 경우의 수를 폭발적으로 늘려봐.',
        '오늘 미션: 2단계 인증(2FA) 설정 가능한지 확인해보기!'
      ]
    };
    return {
      level: '안전 (Strong)',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      barColor: 'bg-green-500',
      icon: <ShieldCheck size={48} className="text-green-500" />,
      text: [
        '훌륭해! 이 정도면 해커가 뚫는 데 수백 년이 걸릴 거야 (엔트로피가 높아).',
        '하지만 아무리 복잡해도 여러 사이트에 똑같이 쓰면 위험해.',
        '오늘 미션: 브라우저나 앱의 비밀번호 관리자 기능 활용해보기.'
      ]
    };
  };

  const feedback = getFeedback(riskScore);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🔐 비밀번호 강도 실험실</h2>
        <p className="text-slate-600 text-sm mb-6">
          길이와 조합을 조절하여 해커로부터 얼마나 안전한지 테스트해보세요.
          <br/><span className="text-xs text-slate-400">* 실제 비밀번호를 입력하지 않습니다. 시뮬레이터입니다.</span>
        </p>

        {/* Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-slate-700">비밀번호 길이</label>
              <span className="text-sm font-mono bg-slate-100 px-2 rounded text-indigo-600">{simLength}자</span>
            </div>
            <input 
              type="range" 
              min="4" 
              max="16" 
              value={simLength} 
              onChange={(e) => setSimLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>4자 (위험)</span>
              <span>16자 (강력)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSimUseNumber(!simUseNumber)}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                simUseNumber ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              숫자 포함 (0-9)
            </button>
            <button
              onClick={() => setSimUseUpper(!simUseUpper)}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                simUseUpper ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              대문자 포함 (A-Z)
            </button>
            <button
              onClick={() => setSimUseSpecial(!simUseSpecial)}
              className={`flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all ${
                simUseSpecial ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              특수문자 (!@#)
            </button>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className={`p-6 flex flex-col items-center text-center ${feedback.bgColor}`}>
          <div className="mb-3 animate-bounce-slow">
            {feedback.icon}
          </div>
          <h3 className={`text-2xl font-bold ${feedback.color} mb-1`}>{feedback.level}</h3>
          <p className="text-slate-600 text-sm">보안 점수: {riskScore}점</p>
          
          <div className="w-full h-3 bg-white/50 rounded-full mt-4 overflow-hidden">
            <div 
              className={`h-full ${feedback.barColor} transition-all duration-500 ease-out`}
              style={{ width: `${riskScore}%` }}
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 mr-3">1</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">위험 분석</p>
              <p className="text-slate-700 text-sm leading-relaxed">{feedback.text[0]}</p>
            </div>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 mr-3">2</span>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">개선 방법</p>
              <p className="text-slate-700 text-sm leading-relaxed">{feedback.text[1]}</p>
            </div>
          </div>
          <div className="flex items-start bg-indigo-50 p-3 rounded-lg border border-indigo-100">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 mr-3">★</span>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-0.5">오늘의 미션</p>
              <p className="text-indigo-900 text-sm font-medium">{feedback.text[2]}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};