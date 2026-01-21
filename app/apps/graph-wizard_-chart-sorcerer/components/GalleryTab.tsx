import React from 'react';
import { GalleryItem } from '../types';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

interface GalleryTabProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
}

const GalleryTab: React.FC<GalleryTabProps> = ({ items, onDelete }) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
        <div className="text-6xl mb-4">🕸️</div>
        <p>아직 저장된 마법 차트가 없습니다.</p>
        <p className="text-sm">시뮬레이션 탭에서 미션을 성공하고 저장해보세요!</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-8">나의 차트 갤러리</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg group relative"
          >
            <div className="h-4 bg-purple-600/20"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{item.missionTitle}</h3>
                  <span className="text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded mt-1 inline-block">
                    {item.chartType}
                  </span>
                </div>
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="text-slate-400 text-xs">
                저장된 시간: {new Date(item.timestamp).toLocaleString()}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex gap-2 flex-wrap">
                  {item.dataSnapshot.slice(0, 3).map((d, i) => (
                    <span key={i} className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-500">
                      {String(Object.values(d)[0])}: {String(Object.values(d)[1])}
                    </span>
                  ))}
                  {item.dataSnapshot.length > 3 && <span className="text-xs text-slate-600">...</span>}
                </div>
              </div>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default GalleryTab;
