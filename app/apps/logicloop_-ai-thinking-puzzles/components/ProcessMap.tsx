import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, Sun, Eye, Brain, GitMerge, Zap, RefreshCw } from 'lucide-react';
import { PROCESS_STAGES } from '../constants';

const icons: Record<string, React.ReactNode> = {
  Sun: <Sun size={24} />,
  Eye: <Eye size={24} />,
  Brain: <Brain size={24} />,
  GitMerge: <GitMerge size={24} />,
  Zap: <Zap size={24} />,
  RefreshCw: <RefreshCw size={24} />,
};

const ProcessMap: React.FC = () => {
  return (
    <div className="w-full space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800">정보 처리 프로세스</h2>
        <p className="text-slate-500 mt-3 text-lg">지능 에이전트(Intelligent Agent)가 외부 세계와 상호작용하는 6단계 순환 구조입니다.</p>
      </div>

      <div className="relative flex flex-col lg:flex-row items-stretch justify-between gap-4 lg:gap-0 mt-12 px-4 lg:px-0">
        {/* Connecting Line (Desktop) */}
        <div className="hidden lg:block absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full mx-10"></div>
        
        {/* Connecting Line (Mobile) */}
        <div className="lg:hidden absolute left-8 top-4 bottom-4 w-1 bg-slate-200 -z-10 rounded-full"></div>

        {PROCESS_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-1 flex flex-row lg:flex-col items-center lg:items-center text-left lg:text-center relative group"
          >
            {/* Stage Card */}
            <div className="flex flex-row lg:flex-col items-center gap-4 lg:gap-6 bg-white lg:bg-transparent p-4 lg:p-0 rounded-2xl border lg:border-none border-slate-100 shadow-sm lg:shadow-none w-full lg:w-auto z-10">
                <div className={`
                w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center shrink-0 shadow-sm lg:shadow-lg border-4 border-white lg:border-4 lg:border-white transition-transform group-hover:scale-110
                ${stage.color}
                `}>
                {icons[stage.iconName]}
                </div>
                
                <div className="flex-1 lg:max-w-[180px]">
                    <h3 className="font-bold text-slate-800 text-lg lg:text-xl mb-1">{stage.label}</h3>
                    <p className="text-slate-500 text-sm leading-snug">{stage.description}</p>
                </div>
            </div>
            
            {/* Arrows */}
            {index < PROCESS_STAGES.length - 1 && (
                <>
                    {/* Desktop Arrow */}
                    <div className="hidden lg:block absolute -right-[20%] top-1/2 -translate-y-1/2 text-slate-300 z-0">
                        <ArrowRight size={24} />
                    </div>
                    {/* Mobile Arrow */}
                    <div className="lg:hidden absolute left-[30px] -bottom-6 text-slate-300 z-0">
                        <ArrowDown size={20} />
                    </div>
                </>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center">
        <div className="bg-blue-100 p-4 rounded-full text-blue-600 shrink-0">
            <RefreshCw size={32} />
        </div>
        <div>
            <h4 className="font-bold text-blue-900 text-lg mb-2">무한 순환 (Infinite Loop)</h4>
            <p className="text-blue-800/80 leading-relaxed">
                이 과정은 한 번으로 끝나지 않습니다. <span className="font-semibold">환경 변화</span>는 다시 새로운 <span className="font-semibold">입력</span>이 되어 끊임없이 반복됩니다. 
                우리가 걷거나 운전할 때 매 순간 새로운 정보를 받아들이고 행동하는 것과 같습니다.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProcessMap;