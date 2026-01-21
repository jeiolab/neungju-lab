import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Scenario } from '../types';
import { Search, CheckCircle, AlertTriangle, RefreshCcw, ArrowRight } from 'lucide-react';

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "엄청난 성장의 신화",
    description: "이 회사는 매출이 두 배로 뛰었다고 주장합니다! 저 엄청난 점프를 보세요!",
    hint: "Y축 시작점을 확인해보세요. 0부터 시작하나요?",
    explanation: "Y축을 잘라내면(0 대신 980부터 시작) 작은 차이가 과장되어 보입니다. 실제 성장은 미미합니다.",
    chartType: 'bar',
    data: [
      { name: '1분기', sales: 980 },
      { name: '2분기', sales: 985 },
      { name: '3분기', sales: 990 },
      { name: '4분기', sales: 1000 },
    ],
    distortedProps: {
      yDomain: [970, 1010],
      xKey: 'name',
      dataKey: 'sales',
      label: '매출 ($)',
    },
    correctedProps: {
      yDomain: [0, 1200],
    },
  },
  {
    id: 2,
    title: "입맛대로 고른 트렌드",
    description: "뉴스에서 이번 주 범죄가 급증했다고 합니다! 추세일까요, 아니면 일시적 현상일까요?",
    hint: "축은 괜찮아 보이지만, 작은 범위에서 그래프가 너무 가파릅니다. 전체 맥락을 보도록 축을 고쳐봅시다.",
    explanation: "작은 변화를 너무 확대하면 안정적인 데이터도 불안정해 보일 수 있습니다. 항상 전체 축의 맥락을 확인하세요.",
    chartType: 'line',
    data: [
      { day: '월', crime: 42 },
      { day: '화', crime: 43 },
      { day: '수', crime: 41 },
      { day: '목', crime: 45 },
      { day: '금', crime: 44 },
    ],
    distortedProps: {
      yDomain: [40, 46],
      xKey: 'day',
      dataKey: 'crime',
      label: '발생 건수',
    },
    correctedProps: {
      yDomain: [0, 60],
    },
  },
];

interface SimulationTabProps {
  onScoreUpdate: (points: number) => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({ onScoreUpdate }) => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const scenario = SCENARIOS[currentScenarioIndex];

  const handleFix = () => {
    if (!isFixed) {
      setIsFixed(true);
      setShowExplanation(true);
      onScoreUpdate(10);
    }
  };

  const handleNext = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setIsFixed(false);
      setShowExplanation(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-yellow-400 font-mono text-sm tracking-wider uppercase">사건 파일 #{scenario.id}</span>
            <h2 className="text-2xl font-bold text-white mt-1">{scenario.title}</h2>
            <p className="text-slate-400 mt-2">{scenario.description}</p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
            <span className={isFixed ? "text-green-400 flex items-center gap-2" : "text-red-400 flex items-center gap-2"}>
              {isFixed ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
              {isFixed ? "진실 발견" : "수상한 그래프"}
            </span>
          </div>
        </div>

        <div className="relative h-80 w-full bg-slate-900 rounded-lg p-4 border border-slate-700">
          <ResponsiveContainer width="100%" height="100%">
            {scenario.chartType === 'bar' ? (
              <BarChart data={scenario.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={scenario.distortedProps.xKey} stroke="#94a3b8" />
                <YAxis 
                  domain={isFixed ? scenario.correctedProps.yDomain : scenario.distortedProps.yDomain} 
                  stroke="#94a3b8" 
                  hide={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                />
                <Bar 
                  dataKey={scenario.distortedProps.dataKey} 
                  fill={isFixed ? "#3b82f6" : "#ef4444"} 
                  animationDuration={1000}
                />
              </BarChart>
            ) : (
               <LineChart data={scenario.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey={scenario.distortedProps.xKey} stroke="#94a3b8" />
                <YAxis 
                   domain={isFixed ? scenario.correctedProps.yDomain : scenario.distortedProps.yDomain} 
                   stroke="#94a3b8"
                />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                <Line 
                  type="monotone" 
                  dataKey={scenario.distortedProps.dataKey} 
                  stroke={isFixed ? "#3b82f6" : "#ef4444"} 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  animationDuration={1000}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
          
          {/* Hit Area for Interaction */}
          {!isFixed && (
            <div 
              className="absolute left-0 top-0 bottom-8 w-16 bg-red-500/10 hover:bg-red-500/20 cursor-pointer border-r-2 border-red-500 border-dashed transition-colors flex items-center justify-center group"
              onClick={handleFix}
              title="축 검사"
            >
              <Search className="text-red-400 opacity-50 group-hover:opacity-100 animate-pulse" />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          {!isFixed ? (
             <div className="flex items-center gap-3 text-slate-300 bg-slate-700/50 px-4 py-2 rounded-full">
                <Search size={18} />
                <span className="text-sm">왜곡된 부분을 찾아 수상한 영역(축)을 클릭하세요.</span>
             </div>
          ) : (
            <div className="bg-green-900/30 border border-green-500/30 p-4 rounded-lg w-full">
               <h3 className="font-bold text-green-400 mb-1">탐정 일지:</h3>
               <p className="text-slate-300 text-sm">{scenario.explanation}</p>
            </div>
          )}

          {isFixed && currentScenarioIndex < SCENARIOS.length - 1 && (
            <button 
              onClick={handleNext}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              다음 사건 <ArrowRight size={18} />
            </button>
          )}
           {isFixed && currentScenarioIndex === SCENARIOS.length - 1 && (
            <div className="text-slate-400 italic">
              모든 사건을 해결했습니다. 퀴즈를 풀어보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;