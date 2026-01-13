import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { Item, Receipt, Rule, ITEMS } from '../types';
import { ReceiptList } from './ReceiptList';
import { explainAssociation } from '../services/geminiService';

interface SimulationTabProps {
  receipts: Receipt[];
  onBadgeEarned: () => void;
}

export const SimulationTab: React.FC<SimulationTabProps> = ({ receipts, onBadgeEarned }) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [userRules, setUserRules] = useState<Rule[]>([]);
  const [checkResult, setCheckResult] = useState<{ checked: boolean; score: number }>({ checked: false, score: 0 });
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Determine positions for items in a circle
  const width = 600;
  const height = 400;
  const radius = 140;
  const centerX = width / 2;
  const centerY = height / 2;

  const itemPositions = useMemo(() => {
    return ITEMS.map((item, index) => {
      const angle = (index / ITEMS.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...item,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [centerX, centerY, radius]);

  const handleNodeClick = (itemId: string) => {
    if (checkResult.checked) {
        // Reset if clicking after check
        setCheckResult({ checked: false, score: 0 });
        setUserRules([]);
        setSelectedSource(itemId);
        return;
    }

    if (!selectedSource) {
      setSelectedSource(itemId);
    } else {
      if (selectedSource === itemId) {
        setSelectedSource(null); // Deselect
      } else {
        // Add Link
        const existing = userRules.find(
          (r) => (r.source === selectedSource && r.target === itemId) || (r.source === itemId && r.target === selectedSource)
        );

        if (existing) {
          setUserRules(userRules.filter((r) => r !== existing));
        } else {
          setUserRules([...userRules, { source: selectedSource, target: itemId }]);
        }
        setSelectedSource(null);
      }
    }
  };

  const calculateSupport = (itemA: string, itemB: string) => {
    let count = 0;
    receipts.forEach((r) => {
      if (r.items.includes(itemA) && r.items.includes(itemB)) {
        count++;
      }
    });
    return count / receipts.length;
  };

  const checkRules = () => {
    let correctCount = 0;
    const analyzedRules = userRules.map((rule) => {
      const support = calculateSupport(rule.source, rule.target);
      // Threshold for "Significant" rule in this game context: >= 0.3 (30%)
      const isCorrect = support >= 0.3;
      if (isCorrect) correctCount++;
      return { ...rule, support, isCorrect };
    });

    setUserRules(analyzedRules);
    setCheckResult({ checked: true, score: correctCount });
    if (correctCount >= 3) {
      onBadgeEarned();
    }
  };

  const handleExplain = async (rule: Rule) => {
    setLoadingAi(true);
    setAiExplanation(null);
    const text = await explainAssociation(
        ITEMS.find(i => i.id === rule.source)?.name || rule.source,
        ITEMS.find(i => i.id === rule.target)?.name || rule.target
    );
    setAiExplanation(text);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel: Receipts */}
      <div className="lg:col-span-1 h-full">
        <ReceiptList receipts={receipts} />
      </div>

      {/* Center Panel: Interactive Graph */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">🔗 연관 규칙 찾기</h2>
            <p className="text-slate-500 text-sm">
                함께 자주 구매되는 아이템을 클릭하여 선으로 연결하세요.
            </p>
          </div>
          <div className="space-x-2">
             <button
              onClick={() => { setUserRules([]); setCheckResult({ checked: false, score: 0 }); setSelectedSource(null); setAiExplanation(null); }}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={checkRules}
              disabled={checkResult.checked || userRules.length === 0}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md transition-all ${
                checkResult.checked || userRules.length === 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-primary hover:bg-indigo-600 active:scale-95'
              }`}
            >
              정답 확인
            </button>
          </div>
        </div>

        <div className="flex-grow relative flex items-center justify-center bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
          <svg ref={svgRef} width={width} height={height} className="max-w-full">
            {/* Links */}
            {userRules.map((rule, idx) => {
              const start = itemPositions.find((p) => p.id === rule.source)!;
              const end = itemPositions.find((p) => p.id === rule.target)!;
              const color = checkResult.checked 
                ? (rule.isCorrect ? '#22c55e' : '#ef4444') 
                : '#cbd5e1';
              
              return (
                <g key={`${rule.source}-${rule.target}`} onClick={() => checkResult.checked && rule.isCorrect && handleExplain(rule)} className={checkResult.checked && rule.isCorrect ? "cursor-pointer hover:opacity-80" : ""}>
                   <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke={color}
                    strokeWidth={checkResult.checked ? 4 : 2}
                    strokeDasharray={checkResult.checked && !rule.isCorrect ? "5,5" : "0"}
                  />
                  {checkResult.checked && (
                      <rect 
                        x={(start.x + end.x)/2 - 20} 
                        y={(start.y + end.y)/2 - 10} 
                        width="40" 
                        height="20" 
                        rx="4"
                        fill="white"
                        stroke={color}
                      />
                  )}
                  {checkResult.checked && (
                    <text
                        x={(start.x + end.x) / 2}
                        y={(start.y + end.y) / 2}
                        dy=".35em"
                        textAnchor="middle"
                        className="text-xs font-bold pointer-events-none"
                        fill={color}
                    >
                        {Math.round((rule.support || 0) * 100)}%
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {itemPositions.map((item) => (
              <g
                key={item.id}
                transform={`translate(${item.x},${item.y})`}
                onClick={() => handleNodeClick(item.id)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  r={35}
                  fill="white"
                  stroke={selectedSource === item.id ? '#6366f1' : '#e2e8f0'}
                  strokeWidth={selectedSource === item.id ? 3 : 1}
                  className="shadow-sm"
                />
                <text textAnchor="middle" dy="-5" fontSize="24">
                  {item.emoji}
                </text>
                <text textAnchor="middle" dy="20" fontSize="12" className="fill-slate-600 font-medium">
                  {item.name}
                </text>
              </g>
            ))}
          </svg>
          
          {/* AI Explanation Overlay */}
          {aiExplanation && (
              <div className="absolute bottom-4 left-4 right-4 bg-indigo-50 border border-indigo-100 p-4 rounded-lg shadow-lg animate-fade-in">
                  <div className="flex items-start gap-3">
                      <div className="text-2xl">🤖</div>
                      <div>
                          <h4 className="font-bold text-indigo-800 text-sm mb-1">AI 분석 리포트</h4>
                          <p className="text-indigo-700 text-sm leading-relaxed">{aiExplanation}</p>
                      </div>
                      <button onClick={() => setAiExplanation(null)} className="ml-auto text-indigo-400 hover:text-indigo-600">✕</button>
                  </div>
              </div>
          )}
           {loadingAi && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 border border-indigo-100 p-4 rounded-lg shadow-lg flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                 <span className="text-sm text-indigo-600 font-medium">AI가 관계를 분석 중입니다...</span>
              </div>
          )}

        </div>
        
        {checkResult.checked && (
             <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                <p>
                    <span className="font-bold">결과:</span> {userRules.length}개의 규칙 중 <span className="text-green-600 font-bold">{checkResult.score}</span>개가 의미있는 규칙입니다.
                    (지지도 30% 이상)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    * 초록색 선을 클릭하면 AI가 이유를 설명해줍니다!
                </p>
            </div>
        )}
      </div>
    </div>
  );
};