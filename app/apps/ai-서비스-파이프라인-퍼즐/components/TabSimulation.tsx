import React, { useState } from 'react';
import { ALL_BLOCKS, SCENARIOS } from '../constants';
import { BlockType, PipelineBlock, Scenario } from '../types';
import { evaluatePipelineWithAI } from '../services/geminiService';
import { Play, RotateCcw, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface TabSimulationProps {
    onComplete: (scenarioId: string, isPerfect: boolean) => void;
}

export const TabSimulation: React.FC<TabSimulationProps> = ({ onComplete }) => {
    const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id);
    const [userPipeline, setUserPipeline] = useState<PipelineBlock[]>([]);
    const [result, setResult] = useState<{ success: boolean; title: string; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const scenario = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];

    // Filter blocks logic: In a real app, maybe limited blocks available. Here we show all unique types.
    const availableBlocks = ALL_BLOCKS; 

    const addToPipeline = (block: PipelineBlock) => {
        if (loading || result?.success) return;
        setUserPipeline([...userPipeline, { ...block, id: `${block.id}-${Date.now()}` }]); // Unique ID for key
    };

    const removeFromPipeline = (index: number) => {
        if (loading || result?.success) return;
        const newPipeline = [...userPipeline];
        newPipeline.splice(index, 1);
        setUserPipeline(newPipeline);
    };

    const handleReset = () => {
        setUserPipeline([]);
        setResult(null);
    };

    const handleExecute = async () => {
        if (userPipeline.length === 0) return;
        
        setLoading(true);
        const userBlockTypes = userPipeline.map(b => b.type);
        
        const aiResponse = await evaluatePipelineWithAI(
            scenario.title,
            scenario.context,
            userBlockTypes,
            scenario.correctSequence
        );

        setResult(aiResponse);
        setLoading(false);

        if (aiResponse.success) {
            // Check if perfect (no retries/hints logic implemented simply here, but could track attempts)
            onComplete(scenario.id, true);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Scenario & Toolbox */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <label className="block text-sm font-medium text-slate-500 mb-2">시나리오 선택</label>
                    <select 
                        value={selectedScenarioId}
                        onChange={(e) => {
                            setSelectedScenarioId(e.target.value);
                            handleReset();
                        }}
                        className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800"
                    >
                        {SCENARIOS.map(s => (
                            <option key={s.id} value={s.id}>{s.title} (Lv.{s.difficulty})</option>
                        ))}
                    </select>
                    <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {scenario.description}
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-3">사용 가능한 블록</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {availableBlocks.map(block => (
                            <button
                                key={block.id}
                                onClick={() => addToPipeline(block)}
                                disabled={loading || result?.success === true}
                                className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-200">
                                    +
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800">{block.type}</div>
                                    <div className="text-xs text-slate-500">{block.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Canvas & Feedback */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-slate-800 p-6 rounded-xl shadow-lg min-h-[400px] flex flex-col">
                    <div className="flex justify-between items-center mb-4 text-white">
                        <h3 className="font-bold text-lg">파이프라인 설계도</h3>
                        <div className="flex gap-2">
                            <button onClick={handleReset} className="p-2 hover:bg-slate-700 rounded-full text-slate-300 transition-colors" title="초기화">
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/50 rounded-lg p-4 relative overflow-x-auto">
                        {userPipeline.length === 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                                왼쪽에서 블록을 클릭하여 파이프라인을 연결하세요.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {userPipeline.map((block, index) => (
                                    <div key={block.id} className="relative flex flex-col items-center">
                                         {/* Connector Line */}
                                        {index > 0 && <div className="h-6 w-0.5 bg-indigo-500 my-1"></div>}
                                        
                                        <div 
                                            onClick={() => removeFromPipeline(index)}
                                            className="w-full max-w-md bg-white p-3 rounded-lg shadow-md cursor-pointer hover:bg-red-50 hover:border-red-200 border-l-4 border-indigo-500 transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-bold text-slate-800">{index + 1}. {block.type}</span>
                                            <span className="text-xs text-red-400 opacity-0 group-hover:opacity-100">제거</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleExecute}
                            disabled={userPipeline.length === 0 || loading || result?.success === true}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95
                                ${result?.success 
                                    ? 'bg-green-500 text-white cursor-default' 
                                    : 'bg-indigo-500 hover:bg-indigo-400 text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <><span>분석 중...</span></>
                            ) : result?.success ? (
                                <><CheckCircle className="w-5 h-5"/> 서비스 가동 중</>
                            ) : (
                                <><Play className="w-5 h-5"/> 시뮬레이션 실행</>
                            )}
                        </button>
                    </div>
                </div>

                {/* AI Feedback Card */}
                {result && (
                    <div className={`p-5 rounded-xl border-l-4 animate-fade-in shadow-sm ${result.success ? 'bg-green-50 border-green-500' : 'bg-orange-50 border-orange-500'}`}>
                        <div className="flex items-start gap-3">
                            {result.success ? <CheckCircle className="w-6 h-6 text-green-600 mt-1" /> : <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />}
                            <div>
                                <h4 className={`font-bold text-lg ${result.success ? 'text-green-800' : 'text-orange-800'}`}>
                                    {result.title}
                                </h4>
                                <p className={`mt-1 text-sm ${result.success ? 'text-green-700' : 'text-orange-700'}`}>
                                    {result.message}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
