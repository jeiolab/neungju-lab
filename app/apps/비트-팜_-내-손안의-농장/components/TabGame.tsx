import React, { useState, useEffect, useCallback } from 'react';
import { Droplet, Sun, Thermometer, Wind, Wifi, Sprout, CheckCircle2, AlertCircle, BookOpen, ScrollText } from 'lucide-react';
import { GameItem, ItemType, PlantState, RadioState, GrowthLog } from '../types';

// Game Assets
const ITEMS: GameItem[] = [
  { id: 'moisture_sensor', name: '토양 수분 센서', type: ItemType.SENSOR, icon: '💧', description: '흙의 물기를 측정해요', targetCondition: 'water' },
  { id: 'temp_sensor', name: '온도 센서', type: ItemType.SENSOR, icon: '🌡️', description: '공기 온도를 측정해요', targetCondition: 'temp' },
  { id: 'light_sensor', name: '조도 센서', type: ItemType.SENSOR, icon: '☀️', description: '빛의 밝기를 측정해요', targetCondition: 'light' },
  { id: 'water_pump', name: '워터 펌프', type: ItemType.ACTUATOR, icon: '🚿', description: '물을 공급해요', targetCondition: 'water' },
  { id: 'fan', name: '환기 팬', type: ItemType.ACTUATOR, icon: '🌀', description: '온도를 낮춰요', targetCondition: 'temp' },
  { id: 'led', name: '생장 LED', type: ItemType.ACTUATOR, icon: '💡', description: '빛을 비춰줘요', targetCondition: 'light' },
];

const PLANT_STAGES_IMAGES = [
  "https://picsum.photos/id/1062/200/200", // Seed-ish (wrapped)
  "https://picsum.photos/id/152/200/200", // Sprout
  "https://picsum.photos/id/292/200/200", // Plant
  "https://picsum.photos/id/1080/200/200", // Fruit/Flower
];

const STAGE_NAMES = ["씨앗", "새싹", "자라난 식물", "열매 맺은 식물"];

export const TabGame: React.FC = () => {
  // State
  const [plant, setPlant] = useState<PlantState>({
    health: 50,
    stage: 0,
    needs: 'water',
    message: '목말라요! 물이 필요해요.',
  });

  const [radio, setRadio] = useState<RadioState>({
    senderGroupId: 1,
    receiverGroupId: 1,
    isTransmitting: false,
  });

  const [equippedSensor, setEquippedSensor] = useState<GameItem | null>(null);
  const [equippedActuator, setEquippedActuator] = useState<GameItem | null>(null);
  
  const [logs, setLogs] = useState<GrowthLog[]>([]);
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  
  const [showDiary, setShowDiary] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Initialize Needs
  useEffect(() => {
    generateNewNeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewNeed = () => {
    const needs: ('water' | 'temp' | 'light')[] = ['water', 'temp', 'light'];
    const randomNeed = needs[Math.floor(Math.random() * needs.length)];
    
    let msg = "";
    if (randomNeed === 'water') msg = "목말라요! 물이 부족해요.";
    if (randomNeed === 'temp') msg = "너무 더워요! 시원하게 해주세요.";
    if (randomNeed === 'light') msg = "너무 어두워요! 햇빛이 필요해요.";

    setPlant(prev => ({ ...prev, needs: randomNeed, message: msg }));
    setFeedback(null);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, item: GameItem) => {
    e.dataTransfer.setData('itemId', item.id);
  };

  const handleDrop = (e: React.DragEvent, slotType: ItemType) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const item = ITEMS.find(i => i.id === itemId);
    
    if (item && item.type === slotType) {
      if (slotType === ItemType.SENSOR) setEquippedSensor(item);
      if (slotType === ItemType.ACTUATOR) setEquippedActuator(item);
    } else if (item) {
        setFeedback("⚠️ 알맞은 슬롯에 놓아주세요. (센서는 왼쪽, 액추에이터는 오른쪽)");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary for onDrop to fire
  };

  // Action Logic
  const handleRunSystem = () => {
    // 1. Check Radio
    if (radio.senderGroupId !== radio.receiverGroupId) {
      setFeedback("❌ 통신 오류! 송신부와 수신부의 그룹 ID가 다릅니다.");
      return;
    }

    setRadio(prev => ({ ...prev, isTransmitting: true }));
    setTimeout(() => setRadio(prev => ({ ...prev, isTransmitting: false })), 1000);

    // 2. Check Equipment
    if (!equippedSensor || !equippedActuator) {
      setFeedback("⚠️ 센서와 액추에이터를 모두 연결해주세요.");
      return;
    }

    // 3. Check Logic
    const isSensorCorrect = equippedSensor.targetCondition === plant.needs;
    const isActuatorCorrect = equippedActuator.targetCondition === plant.needs;

    if (isSensorCorrect && isActuatorCorrect) {
      // Success
      handleSuccess();
    } else {
      // Failure
      handleFailure();
    }
  };

  const handleSuccess = () => {
    setFeedback("✅ 성공! 시스템이 정상 작동하여 식물이 건강해졌습니다.");
    
    // Add to collection
    if (equippedSensor && !collectedItems.has(equippedSensor.id)) {
        setCollectedItems(prev => new Set(prev).add(equippedSensor.id));
    }
    if (equippedActuator && !collectedItems.has(equippedActuator.id)) {
        setCollectedItems(prev => new Set(prev).add(equippedActuator.id));
    }

    // Update Plant
    setPlant(prev => {
        const newStage = prev.stage < 3 ? prev.stage + 1 : 3;
        const newLog: GrowthLog = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            stage: newStage,
            message: `성장 성공! (${STAGE_NAMES[newStage]})`
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);
        return { ...prev, stage: newStage, health: 100 };
    });

    // Reset equipment and new need after delay
    setTimeout(() => {
        setEquippedSensor(null);
        setEquippedActuator(null);
        generateNewNeed();
    }, 2000);
  };

  const handleFailure = () => {
    setFeedback("🍂 실패... 잘못된 장치 연결로 식물이 시들고 있습니다.");
    setPlant(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 animate-fade-in">
      
      {/* Top Bar: Radio Settings & Tools */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100">
                <Wifi className={`w-5 h-5 ${radio.isTransmitting ? 'text-green-500 animate-pulse' : 'text-stone-400'}`} />
                <span className="text-sm font-bold text-purple-900">통신 설정</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
                <label className="text-stone-600">송신 ID:</label>
                <input 
                    type="number" 
                    min="0" max="255"
                    className="w-16 p-1 border rounded text-center font-mono"
                    value={radio.senderGroupId}
                    onChange={(e) => setRadio({...radio, senderGroupId: parseInt(e.target.value) || 0})}
                />
            </div>
            <div className="w-4 border-t-2 border-dashed border-stone-300"></div>
            <div className="flex items-center gap-2 text-sm">
                <label className="text-stone-600">수신 ID:</label>
                <input 
                    type="number" 
                    min="0" max="255"
                    className="w-16 p-1 border rounded text-center font-mono"
                    value={radio.receiverGroupId}
                    onChange={(e) => setRadio({...radio, receiverGroupId: parseInt(e.target.value) || 0})}
                />
            </div>
        </div>
        
        <div className="flex gap-2">
            <button onClick={() => setShowCollection(true)} className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm font-bold">
                <BookOpen size={16}/> 도감
            </button>
            <button onClick={() => setShowDiary(true)} className="flex items-center gap-1 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 text-sm font-bold">
                <ScrollText size={16}/> 일기
            </button>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Inventory (Sensors) */}
        <div className="md:col-span-1 bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col gap-3">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">
                <Thermometer size={18}/> 센서 창고
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {ITEMS.filter(i => i.type === ItemType.SENSOR).map(item => (
                    <div 
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm cursor-grab hover:shadow-md active:cursor-grabbing text-center"
                    >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs font-bold text-stone-700">{item.name}</div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-blue-600 mt-auto bg-blue-100 p-2 rounded">
                💡 힌트: 식물의 상태를 감지하는 센서를 농장으로 드래그하세요.
            </p>
        </div>

        {/* Center: Farm Zone */}
        <div className="md:col-span-1 flex flex-col items-center gap-4">
            {/* Plant Status Bubble */}
            <div className="relative bg-white p-4 rounded-2xl shadow-md border-2 border-stone-100 w-full text-center">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-stone-100 rotate-45"></div>
                <p className={`font-bold ${plant.health < 30 ? 'text-red-500 animate-pulse' : 'text-stone-700'}`}>
                    "{plant.message}"
                </p>
            </div>

            {/* Plant Visualization */}
            <div className="relative w-64 h-64 bg-stone-200 rounded-full border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                <div className="absolute bottom-0 w-full h-1/2 bg-[#8d6e63]"></div> {/* Soil */}
                <img 
                    src={PLANT_STAGES_IMAGES[plant.stage]} 
                    alt="Plant" 
                    className="relative z-10 h-40 object-contain transition-all duration-500" 
                />
            </div>

            {/* Slots */}
            <div className="flex gap-4 w-full">
                {/* Sensor Slot */}
                <div 
                    onDrop={(e) => handleDrop(e, ItemType.SENSOR)}
                    onDragOver={handleDragOver}
                    className={`flex-1 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors
                        ${equippedSensor ? 'bg-blue-50 border-blue-300' : 'bg-stone-50 border-stone-300'}`}
                >
                    {equippedSensor ? (
                        <>
                            <div className="text-3xl">{equippedSensor.icon}</div>
                            <div className="text-xs font-bold mt-1">{equippedSensor.name}</div>
                            <button onClick={() => setEquippedSensor(null)} className="text-[10px] text-red-500 underline mt-1">제거</button>
                        </>
                    ) : (
                        <span className="text-xs text-stone-400">센서 놓는 곳</span>
                    )}
                </div>

                {/* Actuator Slot */}
                <div 
                    onDrop={(e) => handleDrop(e, ItemType.ACTUATOR)}
                    onDragOver={handleDragOver}
                    className={`flex-1 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors
                        ${equippedActuator ? 'bg-red-50 border-red-300' : 'bg-stone-50 border-stone-300'}`}
                >
                    {equippedActuator ? (
                        <>
                            <div className="text-3xl">{equippedActuator.icon}</div>
                            <div className="text-xs font-bold mt-1">{equippedActuator.name}</div>
                            <button onClick={() => setEquippedActuator(null)} className="text-[10px] text-red-500 underline mt-1">제거</button>
                        </>
                    ) : (
                        <span className="text-xs text-stone-400">장치 놓는 곳</span>
                    )}
                </div>
            </div>

            {/* Run Button */}
            <button 
                onClick={handleRunSystem}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
                <Wifi size={20}/> 시스템 작동
            </button>
            
            {feedback && (
                <div className={`text-sm font-bold p-2 rounded w-full text-center ${feedback.includes('성공') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback}
                </div>
            )}
        </div>

        {/* Right: Inventory (Actuators) */}
        <div className="md:col-span-1 bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col gap-3">
             <h3 className="font-bold text-red-800 flex items-center gap-2">
                <Wind size={18}/> 장치 창고
            </h3>
            <div className="grid grid-cols-2 gap-2">
                {ITEMS.filter(i => i.type === ItemType.ACTUATOR).map(item => (
                    <div 
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="bg-white p-3 rounded-lg border border-red-200 shadow-sm cursor-grab hover:shadow-md active:cursor-grabbing text-center"
                    >
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs font-bold text-stone-700">{item.name}</div>
                    </div>
                ))}
            </div>
            <p className="text-xs text-red-600 mt-auto bg-red-100 p-2 rounded">
                💡 힌트: 문제를 해결할 수 있는 액추에이터를 농장으로 드래그하세요.
            </p>
        </div>
      </div>

      {/* Modals */}
      {showCollection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-800">📖 센서 도감</h2>
                    <button onClick={() => setShowCollection(false)} className="text-2xl">&times;</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {ITEMS.map(item => (
                        <div key={item.id} className={`flex items-center gap-4 p-3 rounded-xl border ${collectedItems.has(item.id) ? 'bg-white border-blue-200' : 'bg-stone-100 border-stone-200 opacity-60'}`}>
                            <div className="text-3xl">{collectedItems.has(item.id) ? item.icon : '❓'}</div>
                            <div>
                                <h4 className="font-bold">{collectedItems.has(item.id) ? item.name : '???'}</h4>
                                <p className="text-sm text-stone-500">{collectedItems.has(item.id) ? item.description : '게임에서 사용해보세요.'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {showDiary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-amber-800">🌱 성장 일기</h2>
                    <button onClick={() => setShowDiary(false)} className="text-2xl">&times;</button>
                </div>
                {logs.length === 0 ? (
                    <p className="text-center text-stone-500 py-10">아직 작성된 일기가 없습니다.<br/>식물을 키워보세요!</p>
                ) : (
                    <div className="space-y-3">
                        {logs.map(log => (
                            <div key={log.id} className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <div className="text-xs text-amber-600 font-mono mb-1">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                <div className="font-bold text-stone-800">{log.message}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )}

    </div>
  );
};
