import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable, closestCenter } from '@dnd-kit/core';
import { TOOLBOX_BLOCKS } from '../constants';
import { BlockType, ETLBlock, SimulationResult } from '../types';
import { Database, Eraser, Combine, Filter, ArrowRightLeft, Brain, Trash2, Play, AlertTriangle, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Icons Mapping ---
const getIcon = (name: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (name) {
    case 'Database': return <Database {...props} />;
    case 'Broom': return <Eraser {...props} />; // Using Eraser as Broom substitute
    case 'Unite': return <Combine {...props} />;
    case 'Filter': return <Filter {...props} />;
    case 'Scaling': return <ArrowRightLeft {...props} />;
    case 'Brain': return <Brain {...props} />;
    default: return <Database {...props} />;
  }
};

interface DraggableBlockProps {
  block: ETLBlock;
  isOverlay?: boolean;
}

// --- Draggable Block Component ---
const DraggableBlock: React.FC<DraggableBlockProps> = ({ block, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: block.id,
    data: block,
    disabled: isOverlay, // Overlay doesn't need to be draggable itself
  });

  const style = isDragging ? "opacity-50 ring-2 ring-brand-500 bg-brand-50" : "bg-white hover:border-brand-300 hover:shadow-md";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        relative flex items-center gap-3 p-3 border rounded-lg cursor-grab active:cursor-grabbing transition-all border-slate-200 shadow-sm
        ${style}
        ${isOverlay ? "scale-105 shadow-xl cursor-grabbing ring-2 ring-brand-500 z-50 bg-white" : ""}
      `}
    >
      <div className={`p-2 rounded-md ${getBlockColor(block.type)} text-white`}>
        {getIcon(block.iconName, "w-5 h-5")}
      </div>
      <div>
        <p className="font-semibold text-sm text-slate-800">{block.label}</p>
        <p className="text-xs text-slate-500">{block.description.substring(0, 30)}...</p>
      </div>
    </div>
  );
};

// --- Droppable Pipeline Slot ---
const PipelineArea = ({ blocks, onRemove }: { blocks: ETLBlock[], onRemove: (id: string) => void }) => {
  const { setNodeRef } = useDroppable({
    id: 'pipeline-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 bg-slate-100 rounded-xl p-6 min-h-[300px] border-2 border-dashed border-slate-300 flex flex-col items-center justify-start gap-4 transition-colors"
    >
      {blocks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
          <Brain className="w-12 h-12 mb-2 opacity-20" />
          <p>여기에 블록을 드래그하여 파이프라인을 만드세요</p>
        </div>
      )}
      
      {blocks.map((block, index) => (
        <div key={block.id} className="relative group w-full max-w-md">
           {/* Connecting Line */}
           {index > 0 && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-300"></div>
           )}
           
           <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="font-mono text-xs text-slate-400 w-6">{index + 1}</div>
                <div className={`p-2 rounded-md ${getBlockColor(block.type)} text-white`}>
                  {getIcon(block.iconName)}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{block.label}</h4>
                </div>
              </div>
              <button 
                onClick={() => onRemove(block.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
           </div>
        </div>
      ))}
    </div>
  );
};

const getBlockColor = (type: BlockType) => {
  switch (type) {
    case BlockType.LOAD: return 'bg-blue-500';
    case BlockType.CLEAN: return 'bg-amber-500';
    case BlockType.INTEGRATE: return 'bg-indigo-500';
    case BlockType.REDUCE: return 'bg-teal-500';
    case BlockType.NORMALIZE: return 'bg-purple-500';
    case BlockType.TRAIN: return 'bg-rose-500';
    default: return 'bg-slate-500';
  }
};

// --- Mock Data for Normalization ---
const RAW_DATA = [
  { name: 'A', value: 50 },
  { name: 'B', value: 1500 },
  { name: 'C', value: 300 },
  { name: 'D', value: 800 },
];

const NORMALIZED_DATA = RAW_DATA.map(d => ({
  name: d.name,
  value: (d.value - 50) / (1500 - 50) // Min 50, Max 1500
}));

// --- Main Component ---
const SimulationTab: React.FC = () => {
  const [pipeline, setPipeline] = useState<ETLBlock[]>([]);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (over && over.id === 'pipeline-zone') {
      const originalBlock = TOOLBOX_BLOCKS.find(b => b.type === active.data.current?.type);
      if (originalBlock) {
        const newBlock: ETLBlock = {
          ...originalBlock,
          id: `${originalBlock.type}-${Date.now()}`,
          iconName: originalBlock.iconName
        };
        setPipeline(prev => [...prev, newBlock]);
        setResult(null); // Reset result on change
      }
    }
  };

  const removeBlock = (id: string) => {
    setPipeline(prev => prev.filter(b => b.id !== id));
    setResult(null);
  };

  const resetPipeline = () => {
    setPipeline([]);
    setResult(null);
  };

  const runPipeline = () => {
    setIsProcessing(true);
    setResult(null);

    // Simulate delay
    setTimeout(() => {
      const logs: string[] = [];
      let success = true;
      let message = "파이프라인 실행 완료!";
      let score = 0;

      // 1. Check if empty
      if (pipeline.length === 0) {
        setIsProcessing(false);
        setResult({ success: false, message: "파이프라인이 비어있습니다!", logs: ["오류: 블록이 없습니다."], score: 0 });
        return;
      }

      // 2. Check Sequence
      let hasLoad = false;
      let hasClean = false;
      let hasNormalize = false;
      let hasTrain = false;
      let isDirty = false;

      pipeline.forEach((block, index) => {
        if (!success) return;

        logs.push(`${index + 1}단계: ${block.label} 실행 중...`);

        if (index === 0 && block.type !== BlockType.LOAD) {
          success = false;
          message = "파이프라인은 반드시 '데이터 로드'로 시작해야 합니다.";
          logs.push("오류: 입력 소스가 감지되지 않았습니다.");
          return;
        }

        if (block.type === BlockType.LOAD) {
          hasLoad = true;
          isDirty = true; // Data loaded is raw/dirty
          logs.push(">> 원본 데이터 10,000건 로드됨.");
        }

        if (block.type === BlockType.CLEAN) {
          if (!hasLoad) {
            success = false;
            message = "데이터를 로드하기 전에 정제할 수 없습니다.";
            return;
          }
          hasClean = true;
          isDirty = false;
          logs.push(">> 중복 450건 제거 완료. 결측치 120건 보정 완료.");
        }

        if (block.type === BlockType.NORMALIZE) {
           if (isDirty) {
             logs.push("경고: 더러운 데이터를 정규화하면 이상치로 인해 왜곡될 수 있습니다.");
           }
           hasNormalize = true;
           logs.push(">> Min-Max 스케일링(0~1) 적용 완료.");
        }

        if (block.type === BlockType.TRAIN) {
          if (!hasLoad) {
            success = false; 
            message = "학습할 데이터가 없습니다.";
            return;
          }
          if (isDirty) {
            success = false;
            message = "GIGO 오류: 정제되지 않은 데이터로 학습 시도!";
            logs.push("치명적 실패: 쓰레기가 들어가면 쓰레기가 나옵니다 (GIGO).");
            logs.push("모델 정확도: 12% (무작위 추측 수준)");
            return;
          }
          hasTrain = true;
          logs.push(">> 신경망 모델 학습 시작...");
          
          if (hasNormalize) {
            logs.push(">> 모델 정확도: 96.5% (매우 우수)");
            score = 100;
          } else {
            logs.push(">> 경고: 데이터가 정규화되지 않았습니다. 학습 수렴 속도가 느립니다.");
            logs.push(">> 모델 정확도: 72% (최적화 필요)");
            score = 70;
            message = "성공했지만, 최적화가 필요합니다.";
          }
        }
      });

      if (success && !hasTrain) {
        message = "미완성: AI 학습 모델이 연결되지 않았습니다.";
        success = false;
      }

      setResult({ success, message, logs, score });
      setIsProcessing(false);
    }, 1500);
  };

  const activeBlockData = activeDragId 
    ? TOOLBOX_BLOCKS.find(b => b.type === activeDragId.split('-')[0] || (activeDragId.startsWith(b.type))) 
    : null;

  const hasNormalization = pipeline.some(b => b.type === BlockType.NORMALIZE);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <div className="flex flex-col lg:flex-row h-full gap-6 p-4">
        {/* Left: Toolbox */}
        <div className="w-full lg:w-1/4 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-600" /> 도구 상자
            </h3>
            <div className="flex flex-col gap-3">
              {TOOLBOX_BLOCKS.map((block) => (
                <DraggableBlock key={block.type} block={{...block, id: block.type, iconName: block.iconName} as ETLBlock} />
              ))}
            </div>
          </div>
          
          {/* Normalization Visualizer (Mini) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1 min-h-[200px]">
            <h3 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-purple-600" /> 
              {hasNormalization ? "스케일링 적용됨 (0~1)" : "원본 데이터 미리보기"}
            </h3>
            <div className="h-40 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hasNormalization ? NORMALIZED_DATA : RAW_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{fontSize: 10}} />
                  <YAxis tick={{fontSize: 10}} />
                  <Tooltip />
                  <Bar dataKey="value" fill={hasNormalization ? "#8b5cf6" : "#64748b"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {hasNormalization 
                ? "데이터가 0과 1 사이로 조정되어 학습 효율이 극대화됩니다." 
                : "값의 편차(50 vs 1500)가 너무 커서 모델이 편향될 수 있습니다."}
            </p>
          </div>
        </div>

        {/* Center: Pipeline Canvas */}
        <div className="flex-1 flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">파이프라인 캔버스</h2>
              <div className="flex gap-2">
                <button onClick={resetPipeline} className="px-3 py-2 text-sm text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> 초기화
                </button>
                <button 
                  onClick={runPipeline}
                  disabled={isProcessing}
                  className={`px-4 py-2 text-sm font-semibold text-white rounded-md flex items-center gap-2 shadow-sm
                    ${isProcessing ? "bg-slate-400 cursor-wait" : "bg-green-600 hover:bg-green-700"}
                  `}
                >
                  <Play className="w-4 h-4" /> {isProcessing ? "처리 중..." : "실행"}
                </button>
              </div>
           </div>

           <PipelineArea blocks={pipeline} onRemove={removeBlock} />
           
           {/* Console / Output */}
           <div className="bg-slate-900 rounded-xl p-4 min-h-[150px] font-mono text-sm text-green-400 overflow-y-auto shadow-inner border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-2 border-b border-slate-700 pb-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span>터미널 출력</span>
              </div>
              {result ? (
                <div>
                   {result.logs.map((log, i) => (
                     <div key={i} className="mb-1">{log}</div>
                   ))}
                   <div className={`mt-4 p-2 rounded ${result.success ? "bg-green-900/30 text-green-300" : "bg-red-900/30 text-red-300"}`}>
                      <strong>결과:</strong> {result.message} {result.success && `(점수: ${result.score}점)`}
                   </div>
                </div>
              ) : (
                <div className="text-slate-600 italic">실행 대기 중...</div>
              )}
           </div>
        </div>
      </div>
      
      <DragOverlay>
        {activeBlockData ? (
           <div className="opacity-90">
             <DraggableBlock block={activeBlockData as ETLBlock} isOverlay />
           </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default SimulationTab;