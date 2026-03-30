import React, { useState, useMemo } from 'react';
import { SCENARIOS } from '../constants';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Info, Send, Lock, Image as ImageIcon } from 'lucide-react';

interface Props {
  onComplete: (xp: number) => void;
}

export default function Simulation({ onComplete }: Props) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(SCENARIOS[0].id);
  const [quality, setQuality] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [security, setSecurity] = useState(50);
  const [compressionType, setCompressionType] = useState<'lossless' | 'lossy' | 'none'>('none');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [userDesc, setUserDesc] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);

  const currentScenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

  const calculatedStats = useMemo(() => {
    let finalQuality = quality;
    let finalSpeed = speed;
    let finalSecurity = security;

    // Apply modifiers based on tools
    if (compressionType === 'lossy') {
      finalQuality = Math.max(0, finalQuality - 30); // Penalty
      finalSpeed = Math.min(100, finalSpeed + 40); // Bonus
    } else if (compressionType === 'lossless') {
      finalSpeed = Math.min(100, finalSpeed + 20);
    }

    if (isEncrypted) {
      finalSecurity = Math.min(100, finalSecurity + 50); // Huge Bonus
      finalSpeed = Math.max(0, finalSpeed - 10); // Slight Penalty
    } else {
       finalSecurity = Math.min(100, finalSecurity); // Cap at slider
    }

    return {
      quality: finalQuality,
      speed: finalSpeed,
      security: finalSecurity
    };
  }, [quality, speed, security, compressionType, isEncrypted]);

  const chartData = [
    { subject: '품질', A: calculatedStats.quality, fullMark: 100 },
    { subject: '전송속도', A: calculatedStats.speed, fullMark: 100 },
    { subject: '보안', A: calculatedStats.security, fullMark: 100 },
  ];

  const handleSubmit = () => {
    const targets = currentScenario.targets;
    const diffQ = Math.abs(calculatedStats.quality - targets.quality);
    const diffS = Math.abs(calculatedStats.speed - targets.speed);
    const diffSec = Math.abs(calculatedStats.security - targets.security);
    
    // Lower diff is better. Max diff per axis is 100. Total max error 300.
    // Score out of 100.
    const totalDiff = diffQ + diffS + diffSec;
    const score = Math.max(0, 100 - Math.round(totalDiff / 3));
    
    const feedbacks = [];
    
    // 1. Check Security
    if (currentScenario.targets.security > 80 && !isEncrypted) {
      feedbacks.push("⚠️ 주의: 이 상황은 높은 보안이 필요합니다. 암호화를 켜는 것이 좋습니다.");
    } else if (currentScenario.targets.security > 80 && isEncrypted) {
      feedbacks.push("✅ 좋음: 중요한 파일에 암호화를 잘 적용했습니다.");
    }

    // 2. Check Compression
    if (currentScenario.recommended.compression === 'lossless' && compressionType === 'lossy') {
      feedbacks.push("⚠️ 주의: 문서 파일에 손실 압축을 쓰면 글자가 깨질 수 있습니다.");
    } else if (currentScenario.recommended.compression === 'lossy' && compressionType === 'none') {
      feedbacks.push("💡 팁: 용량이 큽니다. 손실 압축으로 줄여보는 건 어떨까요?");
    }

    // 3. User Description Check (Simple keyword matching)
    if (userDesc.length < 10) {
      feedbacks.push("📝 설명: 선택한 이유를 조금 더 구체적으로 적어주세요.");
    } else {
        feedbacks.push("📝 설명: 당신의 의도가 잘 전달되었습니다.");
    }

    setResult({ score, feedback: feedbacks });
    
    if (score > 70) {
      onComplete(20); // Give XP
    }
  };

  return (
    <div className="pb-20 space-y-6">
      {/* Scenario Selector */}
      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedScenarioId(s.id); setResult(null); }}
            className={`flex-shrink-0 p-4 rounded-xl border-2 text-left w-64 transition-all ${selectedScenarioId === s.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-white'}`}
          >
            <div className="text-xs font-bold text-gray-500 mb-1">{s.baseSize}</div>
            <div className="font-bold text-gray-800">{s.title}</div>
          </button>
        ))}
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-lg mb-2 text-gray-800">🎯 미션 목표</h3>
        <p className="text-gray-600 mb-4">{currentScenario.description}</p>
        
        {/* Sliders */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-gray-700">품질 (Quality)</label>
              <span className="text-sm text-indigo-600 font-mono">{quality}</span>
            </div>
            <input type="range" min="0" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-gray-700">전송 속도 (Speed)</label>
              <span className="text-sm text-indigo-600 font-mono">{speed}</span>
            </div>
            <input type="range" min="0" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-bold text-gray-700">보안 (Security)</label>
              <span className="text-sm text-indigo-600 font-mono">{security}</span>
            </div>
            <input type="range" min="0" max="100" value={security} onChange={(e) => setSecurity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">압축 방식</label>
            <div className="flex flex-col gap-2">
              <button onClick={() => setCompressionType('none')} className={`px-3 py-2 rounded text-sm font-medium ${compressionType === 'none' ? 'bg-white shadow text-indigo-600 border border-indigo-200' : 'text-gray-500'}`}>압축 안 함</button>
              <button onClick={() => setCompressionType('lossless')} className={`px-3 py-2 rounded text-sm font-medium ${compressionType === 'lossless' ? 'bg-white shadow text-indigo-600 border border-indigo-200' : 'text-gray-500'}`}>무손실 (ZIP)</button>
              <button onClick={() => setCompressionType('lossy')} className={`px-3 py-2 rounded text-sm font-medium ${compressionType === 'lossy' ? 'bg-white shadow text-indigo-600 border border-indigo-200' : 'text-gray-500'}`}>손실 (JPG/MP3)</button>
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">보안 설정</label>
            <button 
              onClick={() => setIsEncrypted(!isEncrypted)}
              className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors ${isEncrypted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
            >
              <Lock className="w-4 h-4" />
              <span className="text-sm font-bold">{isEncrypted ? '암호화 ON' : '암호화 OFF'}</span>
            </button>
            <p className="text-xs text-gray-400 mt-2 text-center">암호화를 켜면 전송 속도가 약간 느려지지만 보안이 대폭 상승합니다.</p>
          </div>
        </div>
        
        {/* Explanation */}
        <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">나의 선택 이유 (2-3문장)</label>
            <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="예: 성적표는 중요하니까 보안을 최대로 올리고, 사진이라서 무손실 압축을 선택했어요."
                rows={3}
                value={userDesc}
                onChange={(e) => setUserDesc(e.target.value)}
            />
        </div>

        {/* Submit */}
        <button 
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
            <Send className="w-5 h-5" />
            결과 확인하기
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-white p-5 rounded-xl border-2 border-indigo-100 animate-fade-in-up">
          <h3 className="font-bold text-lg text-center mb-4 text-gray-800">📊 결과 분석</h3>
          <div className="h-64 w-full mb-4">
             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="My Choice" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-center mb-4">
            <span className="text-3xl font-black text-indigo-600">{result.score}</span>
            <span className="text-gray-500 text-sm"> / 100점</span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {result.feedback.map((fb, idx) => (
                <p key={idx} className="text-sm text-gray-700">{fb}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}