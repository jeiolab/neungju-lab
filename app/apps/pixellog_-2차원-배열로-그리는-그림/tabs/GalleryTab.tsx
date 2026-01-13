import React, { useEffect, useState } from 'react';
import { SavedArt } from '../types';
import { PixelGrid } from '../components/PixelGrid';
import { Trash2 } from 'lucide-react';

export const GalleryTab: React.FC = () => {
  const [gallery, setGallery] = useState<SavedArt[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('pixelLog_gallery');
    if (data) {
      setGallery(JSON.parse(data));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const newGallery = gallery.filter(item => item.id !== id);
      setGallery(newGallery);
      localStorage.setItem('pixelLog_gallery', JSON.stringify(newGallery));
    }
  };

  if (gallery.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-4">
        <div className="text-6xl">🎨</div>
        <p className="text-xl">아직 저장된 작품이 없습니다.</p>
        <p className="text-sm">시뮬레이션 탭에서 그림을 그리고 저장해보세요!</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {gallery.map((art) => (
        <div key={art.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg hover:border-slate-500 transition-colors group">
          <div className="p-6 flex justify-center bg-slate-900/50">
             <div className="scale-75 origin-center">
               <PixelGrid data={art.data} readonly showLabels={false} />
             </div>
          </div>
          <div className="p-4 flex justify-between items-center bg-slate-800">
            <div>
              <h3 className="text-white font-bold text-lg">{art.name}</h3>
              <p className="text-slate-500 text-xs font-mono">
                {new Date(art.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => handleDelete(art.id)}
              className="text-slate-600 hover:text-red-400 p-2 rounded-full hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>
          </div>
          {/* Data Preview */}
          <div className="px-4 pb-4">
            <div className="text-[10px] text-slate-600 font-mono truncate">
              {JSON.stringify(art.data)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};