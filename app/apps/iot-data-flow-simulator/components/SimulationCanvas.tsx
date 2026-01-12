import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thermometer, Sun, Fan, Lightbulb, DoorOpen, DoorClosed, Activity, Cpu, MoveHorizontal, Zap } from 'lucide-react';
import { ScenarioConfig } from '../types';

interface SimulationCanvasProps {
  scenario: ScenarioConfig;
  sensorValue: number;
  setSensorValue: (val: number) => void;
  showCode: boolean;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  scenario,
  sensorValue,
  setSensorValue,
  showCode,
}) => {
  const [isActive, setIsActive] = useState(false);
  
  // Determine if condition is met based on operator
  const checkCondition = (val: number) => {
    if (scenario.logic.operator === '>') return val > scenario.logic.threshold;
    if (scenario.logic.operator === '<') return val < scenario.logic.threshold;
    return false;
  };

  useEffect(() => {
    setIsActive(checkCondition(sensorValue));
  }, [sensorValue, scenario]);

  // Icons Helper
  const renderSensorIcon = () => {
    if (scenario.sensor.icon === 'thermometer') return <Thermometer className={`w-8 h-8 ${isActive ? 'text-red-500' : 'text-blue-500'}`} />;
    if (scenario.sensor.icon === 'sun') return <Sun className={`w-8 h-8 ${sensorValue > 50 ? 'text-orange-500' : 'text-slate-400'}`} />;
    if (scenario.sensor.icon === 'ruler') return <MoveHorizontal className="w-8 h-8 text-indigo-500" />;
    return <Activity className="w-8 h-8" />;
  };

  const renderActuatorVisual = () => {
    if (scenario.actuator.icon === 'fan') {
      return (
        <motion.div
          animate={{ rotate: isActive ? 360 : 0 }}
          transition={{ duration: isActive ? 0.5 : 0, repeat: isActive ? Infinity : 0, ease: "linear" }}
        >
          <Fan className={`w-16 h-16 ${isActive ? 'text-blue-500' : 'text-slate-300'}`} />
        </motion.div>
      );
    }
    if (scenario.actuator.icon === 'lamp') {
      return (
         <div className="relative">
             <Lightbulb className={`w-16 h-16 ${isActive ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
             {isActive && (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: [0.5, 1, 0.5] }} 
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-yellow-200 blur-xl rounded-full opacity-50 -z-10" 
                 />
             )}
         </div>
      );
    }
    if (scenario.actuator.icon === 'door') {
      return isActive ? 
        <DoorOpen className="w-16 h-16 text-green-600" /> : 
        <DoorClosed className="w-16 h-16 text-slate-400" />;
    }
    return <Zap className="w-16 h-16" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
      
      {/* Top Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
           {renderSensorIcon()}
           <span>{scenario.name}</span>
        </h2>
        <div className="text-sm font-medium text-slate-500">
            현재 상태: 
            <span className={`ml-2 px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {isActive ? '작동 중 (ACTIVE)' : '대기 중 (IDLE)'}
            </span>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="p-8 relative min-h-[400px] flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-4">
        
        {/* Step 1: Input (Sensor) */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-6 z-10">
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl w-full text-center relative shadow-sm h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    1. 입력 (센서)
                </div>
                <div className="mt-4 mb-6 flex justify-center">{renderSensorIcon()}</div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">{scenario.sensor.name}</h3>
                
                <div className="w-full px-4 mb-4">
                    <input
                        type="range"
                        min={scenario.sensor.min}
                        max={scenario.sensor.max}
                        step={scenario.id === 'door' ? 0.1 : 1}
                        value={sensorValue}
                        onChange={(e) => setSensorValue(parseFloat(e.target.value))}
                        className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                    />
                    <div className="mt-2 text-3xl font-bold text-slate-800">
                        {sensorValue} <span className="text-lg text-slate-500 font-normal">{scenario.sensor.unit}</span>
                    </div>
                </div>
                <p className="text-sm text-slate-500">슬라이더를 조절하여 환경 변화를 시뮬레이션하세요.</p>
            </div>
        </div>

        {/* Connector Animation (Sensor -> Brain) */}
        <div className="hidden md:flex flex-col items-center justify-center w-16 relative">
            <div className="h-1 w-full bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
             {/* Data Packets */}
             <motion.div
                className="absolute w-4 h-4 rounded-full bg-blue-500 z-10"
                style={{ top: 'calc(50% - 8px)' }}
                animate={{ left: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             />
             <div className="mt-12 text-xs text-slate-400 font-mono">데이터</div>
        </div>


        {/* Step 2: Processing (Logic/Brain) */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-6 z-10">
            <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-xl w-full text-center relative shadow-sm h-full flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                    2. 처리 (논리)
                </div>
                
                <div className="mt-4 mb-6 flex justify-center">
                    <Cpu className="w-10 h-10 text-blue-600" />
                </div>
                
                <h3 className="text-lg font-semibold text-slate-700 mb-4">마이크로컨트롤러</h3>

                <div className="flex-grow flex items-center justify-center w-full">
                    {showCode ? (
                        <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-sm text-left w-full shadow-inner">
                            <div className="text-slate-500">// 조건 확인</div>
                            <div><span className="text-blue-400">if</span> (센서값 {scenario.logic.operator} {scenario.logic.threshold}) {'{'}</div>
                            <div className="pl-4 text-white">출력 = <span className="text-yellow-400">ON</span>;</div>
                            <div>{'}'} <span className="text-blue-400">else</span> {'{'}</div>
                            <div className="pl-4 text-white">출력 = <span className="text-slate-400">OFF</span>;</div>
                            <div>{'}'}</div>
                        </div>
                    ) : (
                        <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${isActive ? 'bg-green-100 border-green-400' : 'bg-slate-100 border-slate-300'}`}>
                            <div className="text-sm text-slate-500 mb-1">조건 규칙 (Rule)</div>
                            <div className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
                                <span>{sensorValue}</span>
                                <span className="text-blue-600">{scenario.logic.operator}</span>
                                <span>{scenario.logic.threshold}</span>
                            </div>
                            <div className={`mt-2 font-bold ${isActive ? 'text-green-600' : 'text-slate-400'}`}>
                                {isActive ? '참 (TRUE)' : '거짓 (FALSE)'}
                            </div>
                        </div>
                    )}
                </div>
                
                <p className="text-sm text-slate-500 mt-4">규칙에 따라 데이터를 분석합니다.</p>
            </div>
        </div>


        {/* Connector Animation (Brain -> Actuator) */}
        <div className="hidden md:flex flex-col items-center justify-center w-16 relative">
             <div className="h-1 w-full bg-slate-200 absolute top-1/2 -translate-y-1/2"></div>
             {/* Signal Packets (Only animate if Active) */}
             <AnimatePresence>
                 {isActive && (
                    <motion.div
                        className="absolute w-4 h-4 rounded-full bg-green-500 z-10 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                        style={{ top: 'calc(50% - 8px)' }}
                        initial={{ left: "0%", opacity: 0 }}
                        animate={{ left: "100%", opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    />
                 )}
             </AnimatePresence>
             <div className="mt-12 text-xs text-slate-400 font-mono">신호</div>
        </div>


        {/* Step 3: Output (Actuator) */}
        <div className="flex-1 flex flex-col items-center justify-start space-y-6 z-10">
             <div className={`border-2 p-6 rounded-xl w-full text-center relative shadow-sm h-full flex flex-col transition-colors duration-500 ${isActive ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold tracking-wide transition-colors ${isActive ? 'bg-green-600 text-white' : 'bg-slate-400 text-white'}`}>
                    3. 출력 (액추에이터)
                </div>

                <div className="mt-4 mb-6 flex justify-center items-center h-20">
                    {renderActuatorVisual()}
                </div>

                <h3 className="text-lg font-semibold text-slate-700 mb-2">{scenario.actuator.name}</h3>
                
                <div className="flex-grow flex items-center justify-center">
                    <div className={`text-2xl font-black tracking-widest uppercase transition-all duration-300 ${isActive ? 'text-green-600 scale-110' : 'text-slate-300'}`}>
                        {isActive ? scenario.actuator.activeLabel : scenario.actuator.inactiveLabel}
                    </div>
                </div>
                
                <p className="text-sm text-slate-500 mt-4">신호에 따라 물리적인 동작을 수행합니다.</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationCanvas;