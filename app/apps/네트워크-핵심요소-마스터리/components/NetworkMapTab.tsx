import React, { useState, useEffect } from 'react';
import { UserState, NetworkItem } from '../types';

interface Props {
  userState: UserState;
  onUpdateState: (newState: Partial<UserState>) => void;
}

const NetworkMapTab: React.FC<Props> = ({ userState, onUpdateState }) => {
  const [items, setItems] = useState<NetworkItem[]>(userState.layout);
  const [selectedTool, setSelectedTool] = useState<NetworkItem['type'] | null>(null);

  useEffect(() => {
    // Sync with global state when unmounting or changing
    onUpdateState({ layout: items });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newItem: NetworkItem = {
      id: Date.now().toString(),
      type: selectedTool,
      x,
      y
    };
    
    setItems([...items, newItem]);
    setSelectedTool(null); // Reset tool after placement
  };

  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(items.filter(i => i.id !== id));
  };

  const checkRequirements = () => {
    const hasCompute = items.some(i => ['laptop', 'printer', 'server'].includes(i.type));
    const hasNetwork = items.some(i => ['router', 'switch'].includes(i.type));
    const count = items.length;
    
    return { hasCompute, hasNetwork, count };
  };

  const status = checkRequirements();
  const isComplete = status.hasCompute && status.hasNetwork && status.count >= 3;

  const TOOLS: { type: NetworkItem['type'], label: string, icon: string }[] = [
    { type: 'laptop', label: '노트북', icon: '💻' },
    { type: 'printer', label: '프린터', icon: '🖨️' },
    { type: 'server', label: '서버', icon: '🖥️' },
    { type: 'router', label: '라우터', icon: '📡' },
    { type: 'switch', label: '스위치', icon: '🔌' },
  ];

  return (
    <div className="flex flex-col h-[600px] animate-fade-in gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
            <h3 className="font-bold text-slate-800">우리 반 네트워크 지도</h3>
            <p className="text-xs text-slate-500">도구를 선택하고 지도 빈 곳을 클릭하여 배치하세요.</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
             <span className={`px-2 py-1 rounded ${status.hasCompute ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>컴퓨팅 시스템 {status.hasCompute ? '✅' : '❌'}</span>
             <span className={`px-2 py-1 rounded ${status.hasNetwork ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>네트워크 장비 {status.hasNetwork ? '✅' : '❌'}</span>
             <span className={`px-2 py-1 rounded ${status.count >= 3 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>최소 3개 기기 {status.count >= 3 ? '✅' : '❌'}</span>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Toolbar */}
        <div className="w-32 bg-white flex flex-col gap-2 p-2 rounded-xl border border-slate-200 shadow-sm overflow-y-auto">
            {TOOLS.map(t => (
                <button
                    key={t.type}
                    onClick={() => setSelectedTool(t.type)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-1 transition-all ${selectedTool === t.type ? 'bg-blue-100 border-blue-500 text-blue-800 ring-2 ring-blue-300' : 'hover:bg-slate-50 border border-transparent'}`}
                >
                    <span className="text-2xl">{t.icon}</span>
                    <span className="text-xs font-medium">{t.label}</span>
                </button>
            ))}
            <button 
                onClick={() => setItems([])}
                className="mt-auto p-2 text-xs text-red-500 hover:bg-red-50 rounded"
            >
                모두 지우기
            </button>
        </div>

        {/* Canvas */}
        <div 
            className="flex-1 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 relative overflow-hidden cursor-crosshair group"
            onClick={handleCanvasClick}
        >
            <div className="absolute top-2 left-2 text-slate-300 font-bold text-4xl pointer-events-none select-none">CLASSROOM 1-3</div>
            
            {items.map(item => (
                <div
                    key={item.id}
                    className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                    style={{ left: item.x, top: item.y }}
                    onClick={(e) => removeItem(item.id, e)}
                >
                    <span className="text-4xl drop-shadow-md filter">
                        {TOOLS.find(t => t.type === item.type)?.icon}
                    </span>
                    <span className="text-[10px] bg-white/80 px-1 rounded shadow-sm backdrop-blur-sm">
                        {TOOLS.find(t => t.type === item.type)?.label}
                    </span>
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 hover:!opacity-100 transition-opacity">×</div>
                </div>
            ))}

            {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-slate-400">여기를 클릭하여 장비를 배치하세요</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default NetworkMapTab;
