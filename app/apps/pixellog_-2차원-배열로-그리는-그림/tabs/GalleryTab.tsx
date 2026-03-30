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
      <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-4 bg-white rounded-2xl p-12 border-2 border-gray-200 shadow-lg">
        <div className="text-7xl">🎨</div>
        <p className="text-2xl font-bold text-gray-700">아직 저장된 작품이 없습니다.</p>
        <p className="text-base text-gray-500">시뮬레이션 탭에서 그림을 그리고 저장해보세요!</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {gallery.map((art) => (
        <div key={art.id} className="bg-white rounded-2xl overflow-hidden border-2 border-gray-200 shadow-lg hover:border-blue-400 hover:shadow-xl transition-all group">
          <div className="p-6 flex justify-center bg-gradient-to-br from-blue-50 to-purple-50">
             <div className="scale-75 origin-center">
               <PixelGrid data={art.data} readonly showLabels={false} />
             </div>
          </div>
          <div className="p-5 flex justify-between items-center bg-white border-t border-gray-200">
            <div>
              <h3 className="text-gray-900 font-bold text-lg">{art.name}</h3>
              <p className="text-gray-500 text-xs font-mono mt-1">
                {new Date(art.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button 
              onClick={() => handleDelete(art.id)}
              className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
          {/* Data Preview */}
          <div className="px-5 pb-4 bg-gray-50">
            <div className="text-[10px] text-gray-600 font-mono truncate">
              {JSON.stringify(art.data)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};