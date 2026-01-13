import React, { useState, useEffect, useCallback } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { RefreshCw, BrainCircuit, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateMockData, performClustering } from '../services/clustering';
import { analyzeClusterStrategy } from '../services/geminiService';
import { DataPoint, Cluster, GeminiAnalysisStatus } from '../types';

const Simulation: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [k, setK] = useState<number>(3);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analysisStatus, setAnalysisStatus] = useState<GeminiAnalysisStatus>('idle');
  const [salesScore, setSalesScore] = useState<number | null>(null);

  // Initialize data
  useEffect(() => {
    handleRegenerateData();
  }, []);

  // Run clustering whenever data or k changes
  useEffect(() => {
    if (dataPoints.length > 0) {
      const results = performClustering(dataPoints, k);
      setClusters(results);
      setSalesScore(null); // Reset score on change
      setAiAnalysis(""); // Reset AI text
      setAnalysisStatus('idle');
    }
  }, [dataPoints, k]);

  const handleRegenerateData = () => {
    setDataPoints(generateMockData(100));
  };

  const calculateScore = () => {
    // Simple gamified logic for scoring
    // 3-5 is usually "good" for sizes (S, M, L, XL, XXL)
    // Too few = bad fit. Too many = inventory cost.
    let score = 0;
    if (k < 3) score = 40 + (k * 10);
    else if (k === 3) score = 85;
    else if (k === 4) score = 92;
    else if (k === 5) score = 95;
    else if (k === 6) score = 80;
    else score = Math.max(0, 80 - ((k - 6) * 10));
    
    // Add random variation
    score += Math.floor(Math.random() * 5);
    setSalesScore(Math.min(100, score));
  };

  const handleAnalyze = async () => {
    calculateScore();
    setAnalysisStatus('loading');
    const result = await analyzeClusterStrategy(k, clusters);
    setAiAnalysis(result);
    setAnalysisStatus('success');
  };

  // Prepare data for Recharts
  // We want to flatten the structure but keep cluster info for coloring
  const chartData = clusters.flatMap(c => 
    c.points.map(p => ({
      ...p,
      clusterName: c.name,
      fill: c.color
    }))
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-full">
      {/* Left: Controls & Stats */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">1. 데이터 설정</h3>
            <button 
              onClick={handleRegenerateData}
              className="text-xs flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> 데이터 재생성
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            100명의 가상 고객 키/몸무게 데이터가 있습니다.
          </p>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              사이즈(군집) 개수: <span className="text-blue-600 font-bold text-lg">{k}</span>개
            </label>
            <input 
              type="range" 
              min="1" 
              max="8" 
              value={k} 
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>단일 사이즈 (1)</span>
              <span>맞춤 제작 (8)</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">군집 별 요약</h4>
            {clusters.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-sm p-2 rounded bg-gray-50">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: c.color }}></span>
                  <span className="font-semibold text-gray-700">{c.name}</span>
                </div>
                <div className="text-gray-500 text-xs text-right">
                   {c.points.length}명 <br/>
                   (avg: {c.centroid.height.toFixed(0)}cm / {c.centroid.centroid ? c.centroid.weight.toFixed(0) : 0}kg)
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analysisStatus === 'loading'}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-50"
          >
            {analysisStatus === 'loading' ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                AI 분석 중...
              </>
            ) : (
              <>
                <BrainCircuit className="w-5 h-5 mr-2" />
                결정 완료 & AI 분석
              </>
            )}
          </button>
        </div>

        {salesScore !== null && (
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-fadeIn">
              <h3 className="font-bold text-gray-800 mb-2">📊 판매 예측 점수</h3>
              <div className="flex items-end items-baseline">
                <span className="text-4xl font-extrabold text-blue-600">{salesScore}</span>
                <span className="text-gray-400 ml-1">/ 100점</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 적절한 사이즈 개수를 선정하면 점수가 올라갑니다.
              </p>
           </div>
        )}
      </div>

      {/* Right: Chart & AI Feedback */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="font-bold text-gray-800 mb-4 ml-2">고객 분포 산점도 (Height vs Weight)</h3>
          <ResponsiveContainer width="100%" height="90%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="height" name="Height" unit="cm" domain={['auto', 'auto']} />
              <YAxis type="number" dataKey="weight" name="Weight" unit="kg" domain={['auto', 'auto']} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              {clusters.map((cluster) => (
                <Scatter 
                  key={cluster.id} 
                  name={cluster.name} 
                  data={cluster.points} 
                  fill={cluster.color} 
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* AI Analysis Result */}
        <div className={`bg-slate-800 text-white p-6 rounded-xl shadow-md transition-all duration-500 ${aiAnalysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 hidden'}`}>
          <div className="flex items-start">
            <div className="bg-slate-700 p-2 rounded-lg mr-4">
              <BrainCircuit className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold text-blue-300 mb-2">AI 사수의 피드백</h4>
               <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                 {aiAnalysis}
               </div>
               
               <div className="mt-4 flex gap-2">
                  <button className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full text-gray-300 transition">
                    보고서 이미지로 저장 (시뮬레이션)
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Placeholder if no analysis yet */}
        {!aiAnalysis && analysisStatus !== 'loading' && (
           <div className="bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
              <CheckCircle className="w-12 h-12 mb-2 opacity-20" />
              <p>군집 수를 결정하고 분석 버튼을 눌러주세요.</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default Simulation;
