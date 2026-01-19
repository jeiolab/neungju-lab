'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Threat, ThreatType, ToolType } from '../types';
import { ShieldCheck, AlertTriangle, Activity, Lock, RefreshCw, Zap, FileCode } from 'lucide-react';
    
    // Game Data
    const threats: Threat[] = [
      {
        id: 't1',
        type: ThreatType.RANSOMWARE,
        name: 'Crypt0Locker',
        description: '파일들이 빠르게 암호화되고 있습니다.',
        symptoms: ['높은 CPU 사용량', '파일 확장자 .lock 변경', '랜섬 노트 발견'],
        weakness: ToolType.DECRYPTION,
        difficulty: 3,
      },
      {
        id: 't2',
        type: ThreatType.WORM,
        name: 'NetSpreader.V2',
        description: '로컬 네트워크 포트를 통해 복제 중입니다.',
        symptoms: ['네트워크 혼잡', '알 수 없는 발신 트래픽', '445번 포트 활성'],
        weakness: ToolType.PATCH,
        difficulty: 2,
      },
      {
        id: 't3',
        type: ThreatType.TROJAN,
        name: 'FakeUpdate.exe',
        description: '백그라운드에 숨어 데이터를 탈취하고 있습니다.',
        symptoms: ['새로운 시작 프로그램 등록', '데이터 유출 감지', '시스템 속도 저하'],
        weakness: ToolType.ANTIVIRUS,
        difficulty: 1,
      },
      {
        id: 't4',
        type: ThreatType.DDOS,
        name: 'PacketFlood',
        description: '서버가 SYN 요청으로 과부하 상태입니다.',
        symptoms: ['서비스 이용 불가', '대역폭 사용량 100%'],
        weakness: ToolType.FIREWALL,
        difficulty: 4,
      }
    ];
    
    const tools = [
      { type: ToolType.ANTIVIRUS, icon: <ShieldCheck />, color: 'bg-blue-500' },
      { type: ToolType.PATCH, icon: <FileCode />, color: 'bg-purple-500' },
      { type: ToolType.FIREWALL, icon: <Activity />, color: 'bg-orange-500' },
      { type: ToolType.DECRYPTION, icon: <Lock className="text-white" />, color: 'bg-emerald-500' },
    ];
    
    const SimulationView: React.FC = () => {
      const [currentThreat, setCurrentThreat] = useState<Threat>(threats[0]);
      const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAIL'>('IDLE');
      const [feedback, setFeedback] = useState<string>('위협을 제거하기 위해 알맞은 도구를 선택하세요.');
      const [draggedTool, setDraggedTool] = useState<ToolType | null>(null);
    
      const nextThreat = () => {
        const nextIdx = (threats.findIndex(t => t.id === currentThreat.id) + 1) % threats.length;
        setCurrentThreat(threats[nextIdx]);
        setStatus('IDLE');
        setFeedback('분석 완료. 위협이 감지되었습니다. 대응을 기다리는 중...');
      };
    
      const handleDrop = (tool: ToolType) => {
        if (status !== 'IDLE') return;
    
        if (tool === currentThreat.weakness) {
          setStatus('SUCCESS');
          setFeedback(`치료 성공! [${tool}] 도구가 [${currentThreat.name}]에 효과적이었습니다.`);
        } else {
          setStatus('FAIL');
          setFeedback(`경고! [${tool}] 도구는 [${currentThreat.type}]에 효과가 없습니다. 시스템 손상됨.`);
          // Auto reset after failure
          setTimeout(() => {
             setStatus('IDLE');
             setFeedback('방어 시스템 재초기화 중...');
          }, 2000);
        }
      };
    
      return (
        <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
          {/* Tools Panel */}
          <div className="w-full lg:w-1/4 bg-white rounded-2xl p-6 shadow-sm border border-lab-200 flex flex-col gap-4">
            <h3 className="font-bold text-lab-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" /> 방어 툴킷
            </h3>
            <p className="text-xs text-lab-400 mb-4">알맞은 도구를 현미경으로 드래그하세요.</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {tools.map((tool) => (
                <motion.div
                  key={tool.type}
                  drag
                  dragSnapToOrigin
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, zIndex: 50 }}
                  onDragStart={() => setDraggedTool(tool.type)}
                  onDragEnd={(event, info) => {
                     setDraggedTool(null);
                     // Simple collision check logic based on screen position
                     if (typeof window !== 'undefined' && (info.point.x > window.innerWidth / 4 || info.offset.x > 200)) {
                        handleDrop(tool.type);
                     }
                  }}
                  className={`${tool.color} p-4 rounded-xl cursor-grab active:cursor-grabbing text-white flex items-center gap-3 shadow-md`}
                >
                  {tool.icon}
                  <span className="font-medium text-sm">{tool.type}</span>
                </motion.div>
              ))}
            </div>
          </div>
    
          {/* Microscope View */}
          <div className="flex-1 flex flex-col items-center justify-center relative bg-lab-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-lab-700">
             
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-10" 
                  style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
             </div>
    
             {/* Header HUD */}
             <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
                <div className="text-primary-500 font-mono text-sm">
                   <div>TARGET: {currentThreat.name}</div>
                   <div>TYPE: {currentThreat.type}</div>
                </div>
                <button 
                  onClick={nextThreat}
                  className="bg-lab-800 hover:bg-lab-700 text-white p-2 rounded-full transition-colors"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
             </div>
    
             {/* Microscope Circle */}
             <div className="relative w-80 h-80 rounded-full border-4 border-lab-600 bg-lab-950 flex items-center justify-center overflow-hidden shadow-inner group">
                {/* Lens reflection */}
                <div className="absolute top-4 right-8 w-16 h-8 bg-white opacity-5 rounded-full rotate-45 pointer-events-none"></div>
                
                {/* Drop Zone Indicator */}
                <AnimatePresence>
                  {draggedTool && (
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-primary-500 rounded-full animate-pulse"
                     />
                  )}
                </AnimatePresence>
    
                {/* The Virus */}
                <AnimatePresence mode="wait">
                  {status !== 'SUCCESS' && (
                    <motion.div
                      key={currentThreat.id}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                         scale: 1, 
                         rotate: [0, 10, -10, 0],
                         filter: status === 'FAIL' ? 'hue-rotate(-50deg) drop-shadow(0 0 20px red)' : 'none'
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                         rotate: { repeat: Infinity, duration: 4, ease: "linear" } 
                      }}
                      className="text-9xl relative z-20"
                    >
                      {currentThreat.type === ThreatType.WORM && '🐛'}
                      {currentThreat.type === ThreatType.TROJAN && '🐴'}
                      {currentThreat.type === ThreatType.RANSOMWARE && '🔐'}
                      {currentThreat.type === ThreatType.DDOS && '🔥'}
                      {currentThreat.type === ThreatType.PHISHING && '🎣'}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Success Animation */}
                {status === 'SUCCESS' && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.5 }}
                     animate={{ opacity: 1, scale: 1.2 }}
                     className="absolute inset-0 flex items-center justify-center bg-primary-900/50 backdrop-blur-sm z-30"
                   >
                      <ShieldCheck className="w-32 h-32 text-primary-400" />
                   </motion.div>
                )}
             </div>
    
             {/* Status Feedback */}
             <motion.div 
                animate={{ 
                   backgroundColor: status === 'FAIL' ? '#ef4444' : status === 'SUCCESS' ? '#10b981' : '#1e293b'
                }}
                className="absolute bottom-6 mx-auto px-6 py-3 rounded-full font-mono text-sm font-bold text-white shadow-lg max-w-lg text-center"
             >
                {status === 'FAIL' && <AlertTriangle className="inline mr-2 mb-1" />}
                {feedback}
             </motion.div>
    
          </div>
    
          {/* Analysis Panel */}
          <div className="w-full lg:w-1/4 bg-white rounded-2xl p-6 shadow-sm border border-lab-200">
            <h3 className="font-bold text-lab-700 mb-4">위협 분석</h3>
            <ul className="space-y-4">
               {currentThreat.symptoms.map((sym, i) => (
                  <motion.li 
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-sm text-lab-600 bg-lab-50 p-3 rounded-lg border border-lab-100"
                  >
                     <Activity className="w-4 h-4 text-rose-500" />
                     {sym}
                  </motion.li>
               ))}
            </ul>
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-800">
               <strong>Tip:</strong> 증상을 관찰하세요. 
               <br/>- 웜: 네트워크 전파
               <br/>- 랜섬웨어: 파일 잠금/암호화
               <br/>- DDoS: 트래픽 과부하
            </div>
          </div>
        </div>
      );
    };
    
    export default SimulationView;