import React, { useState, useEffect } from 'react';
import { SpaceType, EquipmentType, EquipmentItem, SimulationResult } from '../types';
import { SPACES, CATALOG } from '../constants';
import { Laptop, Wifi, ArrowRight, RotateCcw, CheckCircle, AlertTriangle, Save, Coins, Gauge, Server } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedSpace, setSelectedSpace] = useState<SpaceType | null>(null);
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  
  // Computed values
  const currentBudget = selectedSpace 
    ? SPACES[selectedSpace].budget - inventory.reduce((sum, item) => sum + item.cost, 0)
    : 0;

  const resetSim = () => {
    setStep(1);
    setSelectedSpace(null);
    setInventory([]);
    setSimResult(null);
  };

  const addToInventory = (item: EquipmentItem) => {
    if (item.type === EquipmentType.INTERNET_PLAN || item.type === EquipmentType.ROUTER) {
        // Only one ISP and Router allowed for simplicity in this level
        const filtered = inventory.filter(i => i.type !== item.type);
        setInventory([...filtered, item]);
    } else {
        setInventory([...inventory, item]);
    }
  };

  const removeFromInventory = (index: number) => {
    const newInv = [...inventory];
    newInv.splice(index, 1);
    setInventory(newInv);
  };

  const runSimulation = () => {
    if (!selectedSpace) return;

    const spaceInfo = SPACES[selectedSpace];
    const plan = inventory.find(i => i.type === EquipmentType.INTERNET_PLAN);
    const router = inventory.find(i => i.type === EquipmentType.ROUTER);
    const switches = inventory.filter(i => i.type === EquipmentType.SWITCH);
    const devices = inventory.filter(i => i.type === EquipmentType.DEVICE);

    let valid = true;
    let message = "네트워크 구성이 성공적입니다!";
    let score = 100;
    
    // 1. Structure Check
    if (!plan) {
        valid = false;
        message = "인터넷 요금제(ISP)가 없습니다. 인터넷에 연결할 수 없습니다!";
        score = 0;
    } else if (!router) {
        valid = false;
        message = "라우터(공유기)가 없습니다. 기기들을 인터넷에 연결할 수 없습니다.";
        score = 10;
    }

    if (valid && router && plan) {
        // 2. Capacity Check (Ports)
        const totalPorts = (router.ports || 0) + switches.reduce((sum, s) => sum + (s.ports || 0), 0) - switches.length; // -1 for uplink per switch
        
        // Count actual physical connections needed (assuming wifi devices need router capacity but not ports for simplicity, let's treat some as wired for the challenge)
        const totalDevices = devices.reduce((sum, d) => sum + (d.deviceCount || 0), 0);
        
        // Speed Bottleneck
        const totalBandwidthNeeded = devices.reduce((sum, d) => sum + (d.bandwidthUsage || 0), 0);
        const bottleneckSpeed = Math.min(plan.speedMbps || 0, router.speedMbps || 0);

        if (totalDevices < spaceInfo.minDevices) {
            score -= 20;
            message = `경고: 기기가 ${totalDevices}대뿐입니다. 이 공간에는 최소 ${spaceInfo.minDevices}대가 필요합니다.`;
        }

        if (totalBandwidthNeeded > bottleneckSpeed) {
            score -= 30;
            message = "네트워크 혼잡! 인터넷 요금제나 라우터 속도가 기기 수에 비해 너무 느립니다.";
        }

        // Port Logic (Abstracted): If devices > 20 and no switch, warning
        if (totalDevices > 10 && switches.length === 0 && (router.ports || 0) < 8) {
             score -= 10;
             message += " 제안: 기기가 많습니다. 라우터 부하를 줄이기 위해 스위치 추가를 권장합니다.";
        }
        
        // Budget Bonus
        const spent = SPACES[selectedSpace].budget - currentBudget;
        const efficiency = spent / SPACES[selectedSpace].budget;
        if (efficiency < 0.8 && score > 80) {
            score += 10; // Bonus for saving money
            if (score > 100) score = 100;
            message += " 아주 훌륭한 예산 관리입니다!";
        } else if (currentBudget < 0) {
            valid = false;
            message = "예산 초과! 이 네트워크를 구축할 수 없습니다.";
            score = 0;
        }
    }

    const result: SimulationResult = {
        date: new Date().toISOString(),
        space: selectedSpace,
        score: Math.max(0, score),
        costScore: currentBudget,
        perfScore: valid ? 80 : 0, // Simplified
        valid,
        message
    };

    setSimResult(result);
    setStep(4);

    // Save to local storage
    const saved = localStorage.getItem('network_portfolio');
    const history = saved ? JSON.parse(saved) : [];
    localStorage.setItem('network_portfolio', JSON.stringify([...history, result]));
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[600px]">
      {/* Wizard Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10"></div>
          {[1, 2, 3, 4].map((s) => (
            <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-sm text-slate-500 px-1">
          <span>공간 선택</span>
          <span>인터넷</span>
          <span>장비 배치</span>
          <span>결과 검토</span>
        </div>
      </div>

      {/* Step 1: Space Selection */}
      {step === 1 && (
        <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
          {Object.entries(SPACES).map(([key, space]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedSpace(key as SpaceType);
                setStep(2);
              }}
              className="group p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all text-left"
            >
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600">{space.name}</h3>
              <div className="mt-2 text-sm font-semibold text-indigo-500">예산: {space.budget} 코인</div>
              <p className="mt-3 text-slate-600 text-sm">{space.description}</p>
              <div className="mt-4 inline-block px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-500">
                난이도: {space.difficulty}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2 & 3: Configuration */}
      {(step === 2 || step === 3) && selectedSpace && (
        <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Shop Column */}
          <div className="lg:col-span-2 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                    {step === 2 ? <GlobeIcon /> : <ServerIcon />}
                    <span className="ml-2">{step === 2 ? '인터넷 요금제 선택' : '네트워크 장비 선택'}</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                    {CATALOG.filter(item => 
                        step === 2 
                        ? item.type === EquipmentType.INTERNET_PLAN 
                        : item.type !== EquipmentType.INTERNET_PLAN
                    ).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => addToInventory(item)}
                            disabled={currentBudget < item.cost}
                            className={`p-4 border rounded-lg flex items-start text-left transition-all ${
                                currentBudget < item.cost ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'hover:border-indigo-500 hover:bg-indigo-50 bg-white'
                            }`}
                        >
                            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg mr-3">
                                <IconMap name={item.icon} />
                            </div>
                            <div>
                                <div className="font-bold text-slate-800">{item.name}</div>
                                <div className="text-sm text-emerald-600 font-medium">{item.cost === 0 ? '무료' : `${item.cost} 코인`}</div>
                                <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                                {item.speedMbps && <div className="text-xs text-indigo-500 font-semibold mt-1">{item.speedMbps} Mbps</div>}
                            </div>
                        </button>
                    ))}
                </div>
             </div>

             <div className="flex justify-between">
                <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium">
                    뒤로가기
                </button>
                <button 
                    onClick={() => step === 2 ? setStep(3) : runSimulation()}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center"
                >
                    {step === 2 ? '다음: 장비 선택' : '설계 검증하기'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                </button>
             </div>
          </div>

          {/* Stats Column */}
          <div className="space-y-6">
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg sticky top-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                    <span className="text-slate-400">남은 예산</span>
                    <span className={`text-2xl font-bold flex items-center ${currentBudget < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        <Coins className="w-5 h-5 mr-2" />
                        {currentBudget}
                    </span>
                </div>
                
                <h4 className="font-semibold mb-3 text-slate-300">선택한 장비 목록</h4>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {inventory.length === 0 && <p className="text-slate-500 text-sm italic">선택된 장비가 없습니다.</p>}
                    {inventory.map((item, idx) => (
                        <div key={`${item.id}-${idx}`} className="flex justify-between items-center bg-slate-800 p-2 rounded text-sm">
                            <span>{item.name}</span>
                            <button onClick={() => removeFromInventory(idx)} className="text-red-400 hover:text-red-300 text-xs">삭제</button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Results */}
      {step === 4 && simResult && (
        <div className="animate-fadeIn max-w-3xl mx-auto">
             <div className={`p-8 rounded-2xl shadow-xl text-center mb-8 ${simResult.valid ? 'bg-white' : 'bg-red-50 border border-red-200'}`}>
                {simResult.valid ? (
                    <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                ) : (
                    <div className="inline-flex p-4 bg-red-100 text-red-600 rounded-full mb-4">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                )}
                
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    {simResult.valid ? '시뮬레이션 완료!' : '구성 실패'}
                </h2>
                <div className="text-4xl font-black text-indigo-600 mb-4">{simResult.score}/100</div>
                <p className="text-lg text-slate-600 mb-6">{simResult.message}</p>

                {simResult.valid && (
                    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-slate-500 text-sm">비용 효율성</div>
                            <div className="font-bold text-lg">{simResult.costScore > 0 ? '좋음' : '예산 초과'}</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            <div className="text-slate-500 text-sm">성능</div>
                            <div className="font-bold text-lg">안정적</div>
                        </div>
                    </div>
                )}

                <button onClick={resetSim} className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors inline-flex items-center">
                    <RotateCcw className="w-5 h-5 mr-2" />
                    다시 하기
                </button>
             </div>
             
             {/* Simple Visualization of the Network Tree */}
             {simResult.valid && (
                 <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-center font-bold text-slate-400 text-sm uppercase tracking-wide mb-6">네트워크 구성도</h3>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-3 bg-blue-100 text-blue-800 rounded-lg font-bold border-2 border-blue-200 flex items-center">
                            <GlobeIcon className="w-5 h-5 mr-2"/> 인터넷 (WAN)
                        </div>
                        <div className="h-6 w-0.5 bg-slate-300"></div>
                        <div className="p-3 bg-indigo-100 text-indigo-800 rounded-lg font-bold border-2 border-indigo-200 flex items-center">
                             <ServerIcon className="w-5 h-5 mr-2"/> 모뎀 / 라우터
                        </div>
                        <div className="h-6 w-0.5 bg-slate-300"></div>
                        <div className="flex justify-center space-x-8">
                            {/* Switches Branch */}
                            {inventory.some(i => i.type === EquipmentType.SWITCH) && (
                                <div className="flex flex-col items-center">
                                    <div className="p-2 bg-slate-100 text-slate-800 rounded-lg text-sm border border-slate-300 mb-2">스위치</div>
                                    <div className="h-4 w-0.5 bg-slate-300"></div>
                                </div>
                            )}
                            {/* Direct Wifi Devices */}
                             <div className="flex flex-col items-center">
                                    <div className="p-2 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                                        유/무선 기기 ({inventory.filter(i => i.type === EquipmentType.DEVICE).reduce((acc, curr) => acc + (curr.deviceCount || 0), 0)}대)
                                    </div>
                            </div>
                        </div>
                    </div>
                 </div>
             )}
        </div>
      )}
    </div>
  );
};

// Simple Icon Helpers
const GlobeIcon = ({className = "w-5 h-5"}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ServerIcon = ({className = "w-5 h-5"}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>;

const IconMap = ({ name }: { name: string }) => {
    // Map string names to Lucide icons
    switch (name) {
        case 'SignalLow': return <Wifi className="w-5 h-5" />;
        case 'SignalMedium': return <Wifi className="w-6 h-6" />;
        case 'SignalHigh': return <Wifi className="w-6 h-6 text-indigo-600" />;
        case 'Router': return <Server className="w-6 h-6" />;
        case 'Wifi': return <Wifi className="w-6 h-6" />;
        case 'Server': return <Server className="w-6 h-6" />;
        case 'Cable': return <RotateCcw className="w-6 h-6 rotate-90" />; // Abstract cable
        case 'Grid': return <div className="w-6 h-6 border-2 border-current grid grid-cols-2 gap-px p-0.5"><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div><div className="bg-current"></div></div>;
        case 'Laptop': return <Laptop className="w-6 h-6" />;
        case 'Printer': return <div className="w-6 h-6 border-2 border-current rounded-sm"></div>;
        case 'Cpu': return <Gauge className="w-6 h-6" />;
        default: return <Server className="w-6 h-6" />;
    }
};

export default SimulationTab;