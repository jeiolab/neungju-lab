import React from 'react';
import { Agent } from '../types';
import AgentCard from './AgentCard';
import { Trash2 } from 'lucide-react';

interface TabGalleryProps {
  agents: Agent[];
  onDelete: (id: string) => void;
}

const TabGallery: React.FC<TabGalleryProps> = ({ agents, onDelete }) => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">에이전트 갤러리</h2>
        <p className="text-slate-600 text-lg">나와 친구들이 만든 다양한 에이전트를 구경해보세요.</p>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-20 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
           아직 생성된 에이전트가 없습니다. <br/><strong className="text-indigo-500">제작 (Simulation)</strong> 탭에서 첫 번째 에이전트를 만들어보세요!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="relative group">
               <AgentCard agent={agent} />
               {!agent.id.startsWith('mock-') && (
                 <button 
                    onClick={() => onDelete(agent.id)}
                    className="absolute top-4 right-4 p-2 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 focus:opacity-100"
                    title="에이전트 삭제"
                 >
                    <Trash2 size={18} />
                 </button>
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabGallery;