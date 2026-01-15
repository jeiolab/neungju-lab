import React, { useState } from 'react';
import { Database, Cpu, Cloud, Wifi } from 'lucide-react';
import { getConceptExplanation } from '../services/geminiService';

const CONCEPTS = [
    { id: 'bigdata', title: '빅데이터 (Big Data)', icon: Database, color: 'text-blue-500' },
    { id: 'ai', title: '인공지능 (AI)', icon: Cpu, color: 'text-purple-500' },
    { id: 'cloud', title: '클라우드 (Cloud)', icon: Cloud, color: 'text-sky-400' },
    { id: 'iot', title: '사물인터넷 (IoT)', icon: Wifi, color: 'text-green-500' },
];

export const TabTheory: React.FC = () => {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [activeConcept, setActiveConcept] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCardClick = async (conceptId: string, conceptTitle: string) => {
        setActiveConcept(conceptId);
        setLoading(true);
        setExplanation(null);
        
        // Simulating cache or simple pre-definitions could happen here, but we use Gemini as requested
        const text = await getConceptExplanation(conceptTitle);
        setExplanation(text || "설명을 가져오는 중 오류가 발생했습니다.");
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">핵심 개념 익히기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CONCEPTS.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => handleCardClick(c.id, c.title)}
                        className={`p-6 bg-white rounded-xl shadow-sm border-2 transition-all hover:shadow-md flex flex-col items-center text-center gap-4
                            ${activeConcept === c.id ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-100 hover:border-indigo-300'}`}
                    >
                        <c.icon className={`w-12 h-12 ${c.color}`} />
                        <h3 className="text-xl font-bold text-slate-700">{c.title}</h3>
                        <p className="text-sm text-slate-500">클릭해서 AI 선생님의 설명 듣기</p>
                    </button>
                ))}
            </div>

            {activeConcept && (
                <div className="mt-8 bg-indigo-50 border border-indigo-100 p-6 rounded-xl animate-fade-in">
                    <h3 className="font-bold text-lg text-indigo-900 mb-2">
                         💡 AI 선생님의 설명
                    </h3>
                    {loading ? (
                        <div className="flex items-center gap-2 text-indigo-600">
                            <span className="animate-spin">⌛</span> 생각을 정리하고 있어요...
                        </div>
                    ) : (
                        <p className="leading-relaxed text-indigo-800 whitespace-pre-wrap">{explanation}</p>
                    )}
                </div>
            )}
        </div>
    );
};
