import React, { useState, useEffect, useRef } from 'react';
import { Shape } from '../types';
import { RefreshCw, PlayCircle, Info } from 'lucide-react';

interface SimulationViewProps {
  onInteract: () => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ onInteract }) => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [feedback, setFeedback] = useState<string>("도형들이 무작위로 섞여 있습니다. 어떻게 묶어볼까요?");
  const containerRef = useRef<HTMLDivElement>(null);

  const initShapes = () => {
    const newShapes: Shape[] = [];
    const types: ('circle' | 'triangle' | 'square')[] = ['circle', 'triangle', 'square'];
    const colors: ('red' | 'blue')[] = ['red', 'blue'];

    for (let i = 0; i < 20; i++) {
      newShapes.push({
        id: i,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 70 + 15, // 15% to 85%
      });
    }
    setShapes(newShapes);
    setFeedback("도형들이 흩뿌려졌습니다. 기준을 정해 분류해보세요!");
  };

  useEffect(() => {
    initShapes();
  }, []);

  const groupByColor = () => {
    onInteract();
    setFeedback("색상을 기준으로 군집화했습니다! (파랑 / 빨강)");
    setShapes(prev => prev.map(s => {
      // Blue left, Red right
      const targetX = s.color === 'blue' ? 30 : 70;
      return {
        ...s,
        x: targetX + (Math.random() * 20 - 10),
        y: Math.random() * 60 + 20
      };
    }));
  };

  const groupByShape = () => {
    onInteract();
    setFeedback("모양을 기준으로 군집화했습니다! (원 / 세모 / 네모)");
    setShapes(prev => prev.map(s => {
      let targetX = 50;
      if (s.type === 'circle') targetX = 20;
      if (s.type === 'triangle') targetX = 50;
      if (s.type === 'square') targetX = 80;
      return {
        ...s,
        x: targetX + (Math.random() * 15 - 7.5),
        y: Math.random() * 60 + 20
      };
    }));
  };

  const renderShape = (shape: Shape) => {
    const baseClass = `absolute w-8 h-8 flex items-center justify-center shape-transition shadow-sm`;
    const colorClass = shape.color === 'red' ? 'bg-rose-500' : 'bg-blue-500';
    
    // Style logic
    const style = { left: `${shape.x}%`, top: `${shape.y}%` };

    if (shape.type === 'circle') {
      return <div key={shape.id} style={style} className={`${baseClass} ${colorClass} rounded-full`} />;
    } else if (shape.type === 'square') {
      return <div key={shape.id} style={style} className={`${baseClass} ${colorClass} rounded-sm`} />;
    } else {
      // Triangle using clip-path for simplicity
      return (
        <div key={shape.id} style={style} className={`${baseClass} bg-transparent`}>
           <div className={`w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[32px] ${shape.color === 'red' ? 'border-b-rose-500' : 'border-b-blue-500'}`} />
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <PlayCircle className="w-6 h-6 text-indigo-600" />
              도형 시뮬레이션
            </h2>
            <p className="text-slate-600 text-sm mt-1">이름표 없이, 특징만으로 도형들을 모아보세요.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={groupByColor} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              색상별 모으기
            </button>
            <button onClick={groupByShape} className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors">
              모양별 모으기
            </button>
            <button onClick={initShapes} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors" aria-label="Reset">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-medium flex items-start gap-2">
          <Info className="w-5 h-5 shrink-0" />
          {feedback}
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative h-[400px] bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-inner"
      >
        {shapes.map(renderShape)}
        
        {/* Background Labels Area (Visible conceptually) */}
        <div className="absolute bottom-2 right-2 text-slate-300 text-xs select-none pointer-events-none">
          Unsupervised Space
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-500">
        <strong className="text-slate-700">💡 튜터의 팁:</strong> 
        {' '}정답은 없어요! 여러분이 '색상'을 기준으로 할지, '모양'을 기준으로 할지에 따라 묶이는 결과(군집)가 달라집니다. 
        이것이 바로 비지도학습의 <strong>군집화(Clustering)</strong> 과정입니다.
      </div>
    </div>
  );
};

export default SimulationView;
