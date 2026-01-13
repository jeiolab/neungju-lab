import React from 'react';
import { PixelArt, CompressionMode } from '../types';
import { Trash2, Award } from 'lucide-react';

interface GalleryProps {
  items: PixelArt[];
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onDelete }) => {
  const sortedItems = [...items].sort((a, b) => b.timestamp - a.timestamp);

  const getCompressionScore = (item: PixelArt) => {
    if (item.originalSize === 0) return 0;
    return Math.round((1 - (item.compressedSize / item.originalSize)) * 100);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-retro text-retro-green mb-6 flex items-center gap-2">
        <span className="text-3xl">💾</span> 내 플로피 디스크
      </h2>

      {items.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 font-mono">
            <p>디스크가 비어있습니다.</p>
            <p>디자인 랩에서 에셋을 만들어보세요.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => {
             const score = getCompressionScore(item);
             const isMiser = score >= 50;

             return (
                <div key={item.id} className="bg-retro-panel border-2 border-retro-dim p-4 rounded relative hover:border-retro-green transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-retro text-sm text-retro-accent">{item.mode}</span>
                        {isMiser && (
                            <div className="bg-yellow-600 text-yellow-100 text-[10px] px-2 py-1 rounded-full flex items-center gap-1" title="구두쇠 개발자: 50% 이상 압축">
                                <Award size={10} /> 구두쇠
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full aspect-square bg-gray-900 mb-3 grid" style={{ gridTemplateColumns: `repeat(${item.size}, 1fr)` }}>
                        {item.grid.map((c, i) => (
                            <div key={i} style={{ backgroundColor: c }} className="w-full h-full" />
                        ))}
                    </div>

                    <div className="font-mono text-xs text-gray-300 space-y-1">
                        <div className="flex justify-between">
                            <span>원본:</span>
                            <span>{item.originalSize} B</span>
                        </div>
                        <div className="flex justify-between text-retro-green font-bold">
                            <span>압축:</span>
                            <span>{item.compressedSize} B</span>
                        </div>
                        <div className="border-t border-gray-600 pt-1 flex justify-between">
                            <span>절약:</span>
                            <span>{score}%</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => onDelete(item.id)}
                        className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full text-white opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default Gallery;