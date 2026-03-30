import React, { useState } from 'react';
import { REFLECTION_QUESTIONS } from '../constants';
import { ClipboardList, PenTool } from 'lucide-react';

export const TabReflection: React.FC = () => {
    const [answers, setAnswers] = useState<string[]>(REFLECTION_QUESTIONS.map(() => ""));
    const [checks, setChecks] = useState({
        privacy: false,
        bias: false,
        safety: false
    });

    const handleTextChange = (idx: number, val: string) => {
        const newAnswers = [...answers];
        newAnswers[idx] = val;
        setAnswers(newAnswers);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <PenTool className="w-6 h-6 text-indigo-600" />
                생각해볼 문제
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {REFLECTION_QUESTIONS.map((q, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                            <label className="block font-bold text-slate-700 mb-3">{q}</label>
                            <textarea
                                value={answers[idx]}
                                onChange={(e) => handleTextChange(idx, e.target.value)}
                                placeholder="나의 생각을 적어보세요..."
                                className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm h-24 resize-none"
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                        <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5" />
                            내 설계의 위험 요소 체크리스트
                        </h3>
                        <p className="text-xs text-indigo-700 mb-4">
                            완벽해 보이는 기술에도 위험이 숨어있을 수 있습니다. 스스로 점검해보세요.
                        </p>
                        
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-50/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={checks.privacy}
                                    onChange={(e) => setChecks(p => ({...p, privacy: e.target.checked}))}
                                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                />
                                <div>
                                    <span className="font-bold text-slate-800 text-sm block">개인정보 보호</span>
                                    <span className="text-xs text-slate-500">수집된 데이터에 이름, 주소 등 민감 정보가 암호화되었나요?</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-50/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={checks.bias}
                                    onChange={(e) => setChecks(p => ({...p, bias: e.target.checked}))}
                                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                />
                                <div>
                                    <span className="font-bold text-slate-800 text-sm block">데이터 편향성</span>
                                    <span className="text-xs text-slate-500">특정 집단의 데이터만 수집되어 AI가 차별적인 판단을 하지 않나요?</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 bg-white rounded-lg border border-indigo-100 cursor-pointer hover:bg-indigo-50/50 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={checks.safety}
                                    onChange={(e) => setChecks(p => ({...p, safety: e.target.checked}))}
                                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500" 
                                />
                                <div>
                                    <span className="font-bold text-slate-800 text-sm block">안전 장치</span>
                                    <span className="text-xs text-slate-500">AI가 오류를 일으킬 때 사람이 개입할 수 있는 단계가 있나요?</span>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
