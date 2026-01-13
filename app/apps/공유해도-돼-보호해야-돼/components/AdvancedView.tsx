import React, { useState } from 'react';
import { generateAdvancedScenario } from '../services/geminiService';
import { Sparkles, ArrowRight, RefreshCw, Layers } from 'lucide-react';

const AdvancedView: React.FC = () => {
    const [scenarioData, setScenarioData] = useState<{ scenario: string, task: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        const data = await generateAdvancedScenario();
        setScenarioData(data);
        setLoading(false);
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-10 min-h-[600px] flex flex-col">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4">
                    <Layers className="text-indigo-600 w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-3">실전 시나리오 설계</h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">AI가 매번 새로운 학교/생활 속 딜레마 상황을 생성합니다.<br/>정보보호 동아리 회장이 되어 해결책을 제시해보세요.</p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
                {!scenarioData && !loading && (
                    <div className="w-full text-center py-16 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <Sparkles className="text-indigo-400 w-16 h-16 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-slate-700 mb-6">준비되셨나요?</h3>
                        <button 
                            onClick={handleGenerate}
                            className="px-10 py-4 bg-indigo-600 text-white text-lg rounded-full font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95"
                        >
                            시나리오 생성하기
                        </button>
                    </div>
                )}

                {loading && (
                     <div className="flex flex-col items-center justify-center py-20">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-indigo-100 rounded-full animate-spin"></div>
                            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
                        </div>
                        <p className="mt-8 text-xl font-bold text-slate-700">AI가 복잡한 상황을 만드는 중...</p>
                        <p className="text-slate-400">잠시만 기다려주세요.</p>
                     </div>
                )}

                {scenarioData && !loading && (
                    <div className="w-full animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                            <div className="md:col-span-3 bg-white border border-slate-200 shadow-md rounded-2xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                                <h3 className="text-xs font-bold text-indigo-500 tracking-wider uppercase mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Scenario
                                </h3>
                                <p className="text-slate-800 text-xl leading-relaxed font-medium group-hover:text-indigo-900 transition-colors">{scenarioData.scenario}</p>
                            </div>
                            
                            <div className="md:col-span-2 bg-slate-800 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-center">
                                <div className="absolute -right-6 -bottom-6 opacity-10 text-white"><Sparkles size={120}/></div>
                                <h3 className="text-xs font-bold text-yellow-400 tracking-wider uppercase mb-4">Your Mission</h3>
                                <p className="text-xl font-medium leading-relaxed relative z-10">{scenarioData.task}</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                             <button 
                                onClick={handleGenerate}
                                className="flex-1 py-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 flex items-center justify-center gap-2 transition-colors"
                            >
                                <RefreshCw size={20} /> 다른 상황 보기
                            </button>
                            <button className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]">
                                 해결책 작성하기 <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedView;