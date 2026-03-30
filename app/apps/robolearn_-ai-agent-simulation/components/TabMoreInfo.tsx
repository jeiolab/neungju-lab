import React from 'react';
import { ROBOT_COMPONENTS } from '../constants';
import { Eye, Settings, Cpu, Fan } from 'lucide-react';

const TabMoreInfo: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Radar': return <Eye className="w-10 h-10 text-white" />;
      case 'Settings': return <Settings className="w-10 h-10 text-white" />;
      case 'Cpu': return <Cpu className="w-10 h-10 text-white" />;
      case 'Fan': return <Fan className="w-10 h-10 text-white" />;
      default: return null;
    }
  };

  const getColor = (idx: number) => {
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-teal-500', 'bg-orange-500'];
    return colors[idx % colors.length];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pb-6">
      {ROBOT_COMPONENTS.map((comp, idx) => (
        <div key={comp.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
          <div className={`${getColor(idx)} p-6 flex items-center justify-between`}>
            <h3 className="text-xl font-bold text-white">{comp.title}</h3>
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
               {getIcon(comp.iconName)}
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-600 leading-relaxed text-lg mb-4">
              {comp.description}
            </p>
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role in Agent</span>
              <p className="text-slate-800 font-medium mt-1">
                {comp.id === 'lidar' && '환경 인식 (Perception)'}
                {comp.id === 'mcu' && '상태 분석 및 판단 (Reasoning)'}
                {comp.id === 'wheel' && '물리적 행동 (Action)'}
                {comp.id === 'suction' && '작업 수행 (Task Execution)'}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabMoreInfo;
