import React, { useState, useEffect } from 'react';
import { AVAILABLE_BLOCKS } from '../constants';
import { BlockDef, SimulationResult, BlockType } from '../types';
import FlowchartVisualizer from './FlowchartVisualizer';
import { Play, RotateCcw, Plus, Trash2, ArrowUp, ArrowDown, Download, Award, XCircle, Check, Utensils } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [userBlocks, setUserBlocks] = useState<BlockDef[]>([]);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Helper to add block
  const addBlock = (block: BlockDef) => {
    setUserBlocks([...userBlocks, { ...block, id: `${block.id}-${Date.now()}` }]);
    setSimResult(null);
  };

  // Helper to remove block
  const removeBlock = (index: number) => {
    const newBlocks = [...userBlocks];
    newBlocks.splice(index, 1);
    setUserBlocks(newBlocks);
    setSimResult(null);
  };

  // Helper to move block
  const moveBlock = (index: number, direction: -1 | 1) => {
    if (index + direction < 0 || index + direction >= userBlocks.length) return;
    const newBlocks = [...userBlocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + direction];
    newBlocks[index + direction] = temp;
    setUserBlocks(newBlocks);
    setSimResult(null);
  };

  // Logic to validate ramen
  const runSimulation = async () => {
    setIsRunning(true);
    setActiveBlockIndex(null);
    setSimResult(null);

    // Initial State
    let hasWater = false;
    let isBoiling = false;
    let hasNoodles = false;
    let hasSoup = false;
    let hasEgg = false;
    let isCooked = false;
    let stoveOn = false;

    // Step-by-step delay loop for visual effect
    for (let i = 0; i < userBlocks.length; i++) {
      setActiveBlockIndex(i);
      await new Promise(r => setTimeout(r, 800)); // Delay for visual flow

      const block = userBlocks[i];
      const baseId = block.id.split('-')[0]; // Remove timestamp suffix

      // Logic Check
      if (baseId === 'start') {
        // Just start
      } else if (baseId === 'water') {
        hasWater = true;
      } else if (baseId === 'fire') {
        stoveOn = true;
        if (hasWater) {
             // We need to wait for boil or assume it boils over time in simple mode.
             // But let's say "fire" starts the heating process.
        } else {
             // Danger? No, just hot pot.
        }
      } else if (baseId === 'check_boil') {
        // In this simulation, if we have water and fire *before* this check, we consider it boiling.
        // If not, we fail here theoretically, or we guide the user.
        if (hasWater && stoveOn) {
            isBoiling = true;
        } else {
            setSimResult({
                success: false,
                title: "물이 끓지 않아요!",
                message: "가스불을 켜고 물을 넣었는지 확인해보세요. 조건문에서 'No'로 빠져나가게 됩니다.",
                level: "초보"
            });
            setIsRunning(false);
            return;
        }
      } else if (baseId === 'noodles') {
        if (!isBoiling) {
           setSimResult({
                success: false,
                title: "설익은 라면...",
                message: "물이 끓지도 않았는데 면을 넣으셨군요! 퉁퉁 불어버린 라면이 되었습니다.",
                level: "견습 요리사"
            });
            setIsRunning(false);
            return;
        }
        hasNoodles = true;
        hasSoup = true; // Bundled for simplicity
      } else if (baseId === 'egg') {
          if (!isBoiling) {
              // Egg in cold water
          }
          hasEgg = true;
      } else if (baseId === 'wait') {
          if (hasNoodles && isBoiling) {
              isCooked = true;
          }
      } else if (baseId === 'off') {
          stoveOn = false;
      } else if (baseId === 'eat') {
          if (!isCooked) {
              setSimResult({
                  success: false,
                  title: "생라면??",
                  message: "아직 면이 익지 않았어요. '3분 기다리기' 단계가 필요할 것 같습니다.",
                  level: "견습 요리사"
              });
              setIsRunning(false);
              return;
          }
           if (stoveOn) {
              setSimResult({
                  success: false,
                  title: "앗 뜨거!",
                  message: "맛있게 먹었지만, 가스불을 끄지 않았네요! 위험한 알고리즘입니다.",
                  level: "수석 셰프"
              });
              setIsRunning(false);
              return;
           }

           // Success!
           let title = "맛있는 라면 성공!";
           let level: SimulationResult['level'] = "마스터 셰프";
           if (!hasEgg) {
               title = "깔끔한 기본 라면 성공!";
           } else {
               title = "계란 탁! 완벽한 라면 성공!";
           }

           setSimResult({
               success: true,
               title: title,
               message: "완벽한 알고리즘입니다. 맛있는 식사 되세요!",
               level: level
           });
           setIsRunning(false);
           return;
      }
    }

    // End of blocks but no 'eat' or incomplete
    if (!simResult) {
        setSimResult({
            success: false,
            title: "요리 미완성",
            message: "알고리즘이 중간에 끝났습니다. '맛있게 먹기'로 마무리해주세요.",
            level: "초보"
        });
    }
    setIsRunning(false);
  };

  const clearBlocks = () => {
    setUserBlocks([]);
    setSimResult(null);
    setActiveBlockIndex(null);
  };

  // Mock download functionality
  const handleDownload = () => {
    alert("현재 알고리즘이 'my_ramen_algo.png'로 저장되었습니다. (시뮬레이션)");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Sidebar / Palette */}
      <div className="lg:w-1/4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Utensils className="w-5 h-5 text-orange-500" />
          도구 상자
        </h3>
        <p className="text-sm text-gray-500 mb-4">클릭하여 순서도에 추가하세요.</p>
        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
          {AVAILABLE_BLOCKS.map(block => (
            <button
              key={block.id}
              onClick={() => addBlock(block)}
              disabled={isRunning}
              className={`
                p-3 rounded-lg border-2 text-left text-sm font-medium transition-all
                flex items-center gap-3
                ${block.type === BlockType.START_END ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-800' : ''}
                ${block.type === BlockType.PROCESS ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800' : ''}
                ${block.type === BlockType.DECISION ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-800' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <Plus className="w-4 h-4 opacity-50" />
              {block.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace (List View) */}
      <div className="lg:w-1/3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">나의 알고리즘</h3>
          <button onClick={clearBlocks} disabled={isRunning} className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50">
            초기화
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 relative bg-gray-50 rounded-lg p-2 border border-gray-100">
           {userBlocks.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                   도구 상자에서 블록을 추가하세요.
               </div>
           )}
           {userBlocks.map((block, idx) => (
             <div 
                key={block.id} 
                className={`
                    p-3 rounded shadow-sm border flex items-center justify-between bg-white
                    ${activeBlockIndex === idx ? 'ring-2 ring-orange-400 border-orange-400' : 'border-gray-200'}
                `}
             >
                <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-400 w-4">{idx + 1}</span>
                    <span className="text-sm font-medium text-gray-700">{block.label}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => moveBlock(idx, -1)} disabled={isRunning} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ArrowUp size={14}/></button>
                    <button onClick={() => moveBlock(idx, 1)} disabled={isRunning} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ArrowDown size={14}/></button>
                    <button onClick={() => removeBlock(idx)} disabled={isRunning} className="p-1 hover:bg-red-100 rounded text-red-400"><Trash2 size={14}/></button>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Visualization & Result */}
      <div className="lg:w-5/12 flex flex-col gap-4">
        {/* Visualizer Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-1 flex flex-col min-h-[300px]">
           <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800">순서도 (Flowchart)</h3>
                <button onClick={handleDownload} className="text-gray-500 hover:text-gray-700" title="이미지로 저장">
                    <Download size={18}/>
                </button>
           </div>
           <div className="flex-1 relative bg-gray-50 rounded overflow-hidden">
             <FlowchartVisualizer blocks={userBlocks} activeBlockIndex={activeBlockIndex} />
           </div>
        </div>

        {/* Action Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex gap-3 mb-4">
                <button 
                    onClick={runSimulation}
                    disabled={isRunning || userBlocks.length === 0}
                    className={`
                        flex-1 py-3 rounded-lg font-bold text-white shadow-lg
                        flex items-center justify-center gap-2
                        ${isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 active:scale-95 transition-transform'}
                    `}
                >
                    {isRunning ? (
                        <>
                            <RotateCcw className="animate-spin" size={20} />
                            요리 중...
                        </>
                    ) : (
                        <>
                            <Play size={20} fill="currentColor" />
                            알고리즘 실행 (요리하기)
                        </>
                    )}
                </button>
            </div>

            {/* Result Display */}
            {simResult && (
                <div className={`p-4 rounded-lg border flex gap-3 ${simResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="mt-1">
                        {simResult.success ? <Award className="text-green-600" size={24}/> : <XCircle className="text-red-500" size={24}/>}
                    </div>
                    <div>
                        <h4 className={`font-bold ${simResult.success ? 'text-green-800' : 'text-red-800'}`}>
                            {simResult.title}
                        </h4>
                        <p className={`text-sm mt-1 ${simResult.success ? 'text-green-700' : 'text-red-700'}`}>
                            {simResult.message}
                        </p>
                        <div className="mt-2 inline-flex items-center px-2 py-1 rounded bg-white/50 text-xs font-bold border border-black/10">
                            레벨: {simResult.level}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;