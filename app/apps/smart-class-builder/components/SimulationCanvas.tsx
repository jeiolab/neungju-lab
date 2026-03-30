import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Device, Connection, DeviceType, ConnectionType } from '../types';
import { DEVICE_CONFIG } from '../constants';
import { Trash2, Cable, Wifi, Play, Save, RefreshCw } from 'lucide-react';
import { getDesignFeedback } from '../services/geminiService';

interface SimulationCanvasProps {
  onScoreUpdate: (score: number, feedback: string) => void;
  onBadgeUnlock: (badge: string) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ onScoreUpdate, onBadgeUnlock }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedDevice, setDraggedDevice] = useState<string | null>(null);
  const [connectingSource, setConnectingSource] = useState<string | null>(null);
  const [connectionMode, setConnectionMode] = useState<ConnectionType | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize with Internet cloud
  useEffect(() => {
    const savedData = localStorage.getItem('smartClassLayout');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setDevices(parsed.devices);
      setConnections(parsed.connections);
    } else {
      setDevices([{
        id: 'internet',
        type: DeviceType.INTERNET,
        x: 50,
        y: 50,
        name: 'Internet'
      }]);
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, type: DeviceType) => {
    e.dataTransfer.setData('deviceType', type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('deviceType') as DeviceType;
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newDevice: Device = {
      id: `${type}-${Date.now()}`,
      type,
      x,
      y,
      name: DEVICE_CONFIG[type].label
    };

    setDevices(prev => [...prev, newDevice]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDeviceMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (connectionMode) {
      if (connectingSource === null) {
        setConnectingSource(id);
      } else {
        if (connectingSource !== id) {
          // Create connection
          const newConnection: Connection = {
            id: `conn-${Date.now()}`,
            sourceId: connectingSource,
            targetId: id,
            type: connectionMode
          };
          
          // Prevent duplicates
          const exists = connections.some(c => 
            (c.sourceId === connectingSource && c.targetId === id) ||
            (c.sourceId === id && c.targetId === connectingSource)
          );

          if (!exists) {
            setConnections(prev => [...prev, newConnection]);
          }
          setConnectingSource(null);
          // Don't exit mode to allow multiple connections
        }
      }
    } else {
      // Start moving device
      if (id !== 'internet') {
        setDraggedDevice(id);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedDevice && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDevices(prev => prev.map(d => 
        d.id === draggedDevice ? { ...d, x, y } : d
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedDevice(null);
  };

  const deleteDevice = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === 'internet') return;
    setDevices(prev => prev.filter(d => d.id !== id));
    setConnections(prev => prev.filter(c => c.sourceId !== id && c.targetId !== id));
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setLoadingFeedback(true);

    // Basic Validation Logic
    let score = 100;
    const errors: string[] = [];
    
    // Check 1: Internet Connection
    const internet = devices.find(d => d.type === DeviceType.INTERNET);
    const router = devices.find(d => d.type === DeviceType.ROUTER);
    
    const hasRouter = !!router;
    const connectedToInternet = connections.some(c => 
      (c.sourceId === internet?.id && c.targetId === router?.id) ||
      (c.targetId === internet?.id && c.sourceId === router?.id)
    );

    if (!hasRouter) {
      score -= 30;
      errors.push("라우터가 없습니다. 외부 네트워크와 연결할 수 없습니다.");
    } else if (!connectedToInternet) {
      score -= 20;
      errors.push("라우터가 인터넷(외부망)에 연결되지 않았습니다.");
    }

    // Check 2: Switch exist
    const switches = devices.filter(d => d.type === DeviceType.SWITCH);
    if (hasRouter && switches.length === 0) {
      score -= 10;
      errors.push("스위치가 없어 확장성이 부족합니다.");
    }

    // Check 3: Wireless Logic
    const aps = devices.filter(d => d.type === DeviceType.AP);
    const wirelessDevices = devices.filter(d => DEVICE_CONFIG[d.type].wireless && d.type !== DeviceType.AP);
    
    if (wirelessDevices.length > 0 && aps.length === 0) {
      score -= 20;
      errors.push("무선 기기가 있는데 AP(무선 공유기)가 설치되지 않았습니다.");
    }

    // Check 4: Connection Validity (simplified)
    wirelessDevices.forEach(wd => {
        // Find if connected to AP via Wireless connection
        const isConnected = connections.some(c => 
            c.type === ConnectionType.WIRELESS && 
            ((c.sourceId === wd.id && devices.find(d => d.id === c.targetId)?.type === DeviceType.AP) ||
             (c.targetId === wd.id && devices.find(d => d.id === c.sourceId)?.type === DeviceType.AP))
        );
        if (!isConnected) {
            score -= 5;
            errors.push(`${wd.name}이(가) 무선 네트워크에 연결되지 않았습니다.`);
        }
    });

    // Score clamp
    score = Math.max(0, score);

    // Badges
    if (score === 100) onBadgeUnlock("완벽한 설계자");
    if (devices.length > 8 && score > 80) onBadgeUnlock("헤비 유저");
    if (score > 90 && switches.length >= 1 && aps.length >= 1) onBadgeUnlock("스마트 교실 마스터");

    // AI Feedback
    const aiFeedback = await getDesignFeedback(devices, connections, score);
    const finalFeedback = errors.length > 0 ? errors.join("\n") + "\n\n" + aiFeedback : aiFeedback;
    
    onScoreUpdate(score, finalFeedback);
    setIsSimulating(false);
    setLoadingFeedback(false);
  };

  const saveLayout = () => {
    localStorage.setItem('smartClassLayout', JSON.stringify({ devices, connections }));
    alert("설계도가 저장되었습니다!");
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-2 uppercase tracking-wider">장비 서랍</span>
          {Object.entries(DEVICE_CONFIG).map(([type, config]) => {
            if (type === DeviceType.INTERNET) return null;
            return (
              <div
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type as DeviceType)}
                className="flex flex-col items-center justify-center p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg cursor-grab active:cursor-grabbing transition-colors w-20 h-20"
              >
                {config.icon}
                <span className="text-xs mt-1 text-center font-medium truncate w-full">{config.label}</span>
              </div>
            );
          })}
        </div>

        <div className="flex gap-2 border-l pl-4 border-slate-200">
             <button
            onClick={() => {
                setConnectionMode(prev => prev === ConnectionType.WIRED ? null : ConnectionType.WIRED);
                setConnectingSource(null);
            }}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 w-20 transition-all ${connectionMode === ConnectionType.WIRED ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Cable size={20} />
            <span className="text-xs font-bold">유선 연결</span>
          </button>
          <button
            onClick={() => {
                setConnectionMode(prev => prev === ConnectionType.WIRELESS ? null : ConnectionType.WIRELESS);
                setConnectingSource(null);
            }}
            className={`p-2 rounded-lg flex flex-col items-center gap-1 w-20 transition-all ${connectionMode === ConnectionType.WIRELESS ? 'bg-green-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
          >
            <Wifi size={20} />
            <span className="text-xs font-bold">무선 연결</span>
          </button>
        </div>

        <div className="flex gap-2">
           <button onClick={saveLayout} className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 flex items-center gap-2">
            <Save size={18} /> <span className="hidden sm:inline">저장</span>
           </button>
           <button 
             onClick={runSimulation} 
             disabled={loadingFeedback}
             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center gap-2 font-bold disabled:opacity-50"
           >
            {loadingFeedback ? <RefreshCw className="animate-spin" size={18}/> : <Play size={18} fill="currentColor" />}
            <span>시뮬레이션 시작</span>
           </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative bg-slate-100 rounded-xl border border-slate-300 overflow-hidden shadow-inner group">
         {/* Grid Background */}
        <div 
            className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
                backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(90deg, #64748b 1px, transparent 1px)', 
                backgroundSize: '20px 20px' 
            }} 
        />

        <div
            ref={canvasRef}
            className="w-full h-full relative"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
        >
            {/* Connections Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {connections.map(conn => {
                    const source = devices.find(d => d.id === conn.sourceId);
                    const target = devices.find(d => d.id === conn.targetId);
                    if (!source || !target) return null;

                    return (
                        <g key={conn.id} className={isSimulating ? 'animate-pulse' : ''}>
                             <line
                                x1={source.x + 32} // center of 64px (w-16)
                                y1={source.y + 32}
                                x2={target.x + 32}
                                y2={target.y + 32}
                                stroke={conn.type === ConnectionType.WIRED ? "#475569" : "#22c55e"}
                                strokeWidth={conn.type === ConnectionType.WIRED ? 4 : 2}
                                strokeDasharray={conn.type === ConnectionType.WIRELESS ? "5,5" : "0"}
                                opacity={0.6}
                            />
                            {/* Delete handle for line - simplified as clicking connection is hard, usually delete device or clear all. 
                                For this MVP, we remove connections when device removed. 
                            */}
                        </g>
                    );
                })}
                {/* Drawing line preview */}
                {connectionMode && connectingSource && draggedDevice && (
                    // This part is tricky without accurate mouse tracking in state for the target point.
                    // Skipping dynamic line preview for simplicity in this generated code block
                    // but normally would track mouse pos in canvas state.
                    null
                )}
            </svg>

            {/* Devices Layer */}
            {devices.map(device => (
                <div
                    key={device.id}
                    className={`absolute w-16 h-16 flex flex-col items-center justify-center bg-white rounded-lg shadow-md border-2 
                        ${connectingSource === device.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'}
                        ${connectionMode ? 'cursor-crosshair hover:border-blue-400' : 'cursor-move hover:border-indigo-400'}
                        transition-all z-10
                    `}
                    style={{ left: device.x, top: device.y }}
                    onMouseDown={(e) => handleDeviceMouseDown(e, device.id)}
                >
                    <div className="pointer-events-none">{DEVICE_CONFIG[device.type].icon}</div>
                    <div className="absolute -bottom-6 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        {device.name}
                    </div>
                    {device.type !== DeviceType.INTERNET && !connectionMode && (
                        <button 
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity shadow-sm"
                            onClick={(e) => deleteDevice(device.id, e)}
                        >
                            <Trash2 size={10} />
                        </button>
                    )}
                </div>
            ))}
        </div>
        
        {connectionMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-800/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur animate-bounce pointer-events-none">
                {connectionMode === ConnectionType.WIRED ? "유선" : "무선"} 연결 모드: 시작 장치와 끝 장치를 클릭하세요
            </div>
        )}
      </div>
    </div>
  );
};

export default SimulationCanvas;