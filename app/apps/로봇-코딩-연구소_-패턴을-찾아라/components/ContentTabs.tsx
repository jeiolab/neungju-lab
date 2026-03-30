import React, { useState } from 'react';
import { generatePatternExplanation, evaluateReflection } from '../services/geminiService';
import { Sparkles, Brain, BookOpen, Lightbulb } from 'lucide-react';

// --- Tab: Theory ---
export const TabTheory: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-slate-800">패턴 인식(Pattern Recognition)이란?</h2>
            <p className="text-xl text-slate-600">
                복잡한 문제 속에서 <span className="text-blue-600 font-bold">반복되는 규칙</span>을 찾아내는 힘!
            </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                    <Brain size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">1. 분해 (Decomposition)</h3>
                <p className="text-slate-600 leading-relaxed">
                    큰 문제를 작고 다루기 쉬운 조각으로 나눕니다. 하노이의 탑을 옮길 때, "맨 아래 원판"과 "나머지 원판들"로 나누는 것이 바로 분해입니다.
                </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">2. 패턴 발견 (Pattern Recognition)</h3>
                <p className="text-slate-600 leading-relaxed">
                    나누어진 조각들 사이의 공통점이나 규칙을 찾습니다. 로봇이 "앞으로 가고 돌기"를 계속 반복한다면, 그것이 바로 패턴입니다.
                </p>
            </div>
        </div>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-800 mb-4">알고리즘 표현 방법</h3>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">순서도 (Flowchart)</h4>
                    <div className="bg-white p-4 rounded border border-indigo-200 h-32 flex items-center justify-center text-slate-400 text-sm">
                        [시작] {'->'} [판단] {'->'} [처리] {'->'} [종료]
                    </div>
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold mb-2">의사코드 (Pseudocode)</h4>
                    <div className="bg-slate-800 p-4 rounded text-green-400 font-mono text-sm h-32 overflow-hidden">
                        REPEAT 4 TIMES:<br/>
                        &nbsp;&nbsp;MOVE_FORWARD<br/>
                        &nbsp;&nbsp;TURN_LEFT<br/>
                        END REPEAT
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- Tab: AI Insights ---
export const TabAI: React.FC = () => {
  const [topic, setTopic] = useState("빅데이터 속 패턴");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    setLoading(true);
    const result = await generatePatternExplanation(topic);
    setExplanation(result);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Sparkles /> 인공지능과 패턴
            </h2>
            <p className="opacity-90">
                인공지능(AI)은 수많은 데이터 속에서 인간이 찾기 힘든 복잡한 패턴을 찾아냅니다. 
                이것을 '머신러닝'이라고 부릅니다.
            </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-bold mb-4">AI에게 물어보세요</h3>
            <div className="flex gap-2 mb-6">
                {["추천 알고리즘", "자율주행 자동차", "음성 인식", "날씨 예측"].map(t => (
                    <button 
                        key={t}
                        onClick={() => setTopic(t)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors
                            ${topic === t ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}
                        `}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <button 
                onClick={handleAskAI}
                disabled={loading}
                className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {loading ? <span className="animate-spin">⏳</span> : <Sparkles size={18} />}
                {topic}의 패턴 원리 알아보기
            </button>

            {explanation && (
                <div className="mt-6 p-6 bg-purple-50 rounded-lg border border-purple-100 prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    </div>
  );
};

// --- Tab: Reflection ---
export const TabReflection: React.FC = () => {
    const [input, setInput] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if(!input.trim()) return;
        setLoading(true);
        const result = await evaluateReflection(input);
        setFeedback(result);
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto h-full flex flex-col">
             <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Lightbulb className="text-yellow-500"/> 생각해볼 문제
                </h2>
                <p className="text-slate-600">
                    "우리 주변의 신호등이 바뀌는 규칙을 관찰하고, 나만의 신호등 알고리즘을 만들어보세요."
                </p>
             </div>

             <div className="flex-1 flex flex-col gap-4">
                <textarea 
                    className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="예: 차가 많이 다니는 시간에는 초록불을 1분 동안 켜고, 사람이 버튼을 누르면 10초 뒤에 빨간불로 바뀐다..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    className="self-end px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 shadow-md transition-transform active:scale-95"
                >
                    {loading ? 'AI 분석 중...' : '패턴 탐정에게 검사받기'}
                </button>

                {feedback && (
                    <div className="mt-4 bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-400 animate-slide-up">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                            🕵️‍♂️ 패턴 탐정의 피드백
                        </h4>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {feedback}
                        </p>
                    </div>
                )}
             </div>
        </div>
    );
}
