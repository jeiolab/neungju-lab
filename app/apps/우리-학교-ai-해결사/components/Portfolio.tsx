import React from 'react';
import { PortfolioItem, ML_TYPE_LABELS } from '../types';
import { FolderOpen, Clock } from 'lucide-react';

interface Props {
  items: PortfolioItem[];
}

const Portfolio: React.FC<Props> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <FolderOpen size={48} className="mx-auto mb-3 opacity-50" />
        <p>아직 설계한 프로젝트가 없어요.<br />'프로젝트 설계' 탭에서 첫 연구를 시작해보세요!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-slate-800">{item.problemTitle}</h3>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              item.score >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {item.score}점
            </span>
          </div>
          
          <div className="mb-3">
             <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md mr-2">
                {ML_TYPE_LABELS[item.selectedType]}
             </span>
          </div>

          <p className="text-slate-500 text-sm mb-4 line-clamp-2 italic bg-slate-50 p-2 rounded">
            "{item.features}"
          </p>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center text-xs text-slate-400 gap-1">
             <Clock size={12} />
             {new Date(item.timestamp).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Portfolio;