import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Eye, AlertTriangle, Search } from 'lucide-react';
import { analyzeDistortion } from '../services/geminiService';

const DISTORTION_DATA = [
  { name: 'A사', sales: 10200 },
  { name: 'B사', sales: 10400 },
  { name: 'C사', sales: 10100 },
  { name: 'D사', sales: 10300 },
];

const ThinkTab: React.FC = () => {
  const [isDistorted, setIsDistorted] = useState(true);
  const [analysis, setAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleDistortion = () => setIsDistorted(!isDistorted);

  const handleAnalyze = async () => {
    if (analysis) return; // Avoid re-fetching
    setIsLoading(true);
    const scenario = "A bar chart showing sales of 4 companies. Values are 10100 to 10400. The distorted view starts Y-axis at 10000, making differences look huge. The correct view starts at 0, making bars look almost equal.";
    const result = await analyzeDistortion(scenario);
    setAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      
      {/* Simulation Section */}
      <div className="lg:w-2/3">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 shadow-xl relative overflow-hidden">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Eye className="text-purple-400" />
              왜곡 탐지 시뮬레이터
            </h2>
            <button
              onClick={toggleDistortion}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                isDistorted 
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-500/30'
              }`}
            >
              {isDistorted ? '⚠️ 왜곡된 뷰 (현재)' : '✅ 정상 뷰 (확인)'}
            </button>
           </div>

           <div className="h-[400px] w-full bg-slate-900 rounded-xl p-4 border border-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DISTORTION_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis 
                    domain={isDistorted ? [10000, 10500] : [0, 12000]} 
                    stroke="#94a3b8" 
                  />
                  <Tooltip 
                    formatter={(value) => value !== undefined ? value.toLocaleString() : ''}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} 
                  />
                  <Bar dataKey="sales" animationDuration={1000}>
                    {DISTORTION_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={isDistorted ? '#f87171' : '#8884d8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>

           <p className="mt-4 text-center text-slate-400 text-sm">
             {isDistorted 
               ? "Y축이 10,000부터 시작합니다. 차이가 엄청나 보이죠?" 
               : "Y축이 0부터 시작합니다. 실제로는 큰 차이가 없습니다."}
           </p>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-400" />
            생각해볼 문제
          </h3>
          <p className="text-slate-300 mb-6 leading-relaxed">
            뉴스나 광고에서 그래프의 축을 잘라내어(Truncated Axis) 작은 차이를 과장하는 경우가 많습니다.
            이런 그래프를 보면 사람들은 어떤 오해를 하게 될까요?
          </p>
          
          {!analysis ? (
            <button 
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? '마법사가 분석 중...' : 'AI 마법사에게 물어보기'} <Search size={18} />
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-indigo-900/30 p-4 rounded-xl border border-indigo-500/30"
            >
              <h4 className="font-bold text-indigo-300 mb-2">🔮 마법사의 분석:</h4>
              <div className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </motion.div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ThinkTab;
