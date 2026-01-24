import React from 'react';
import { IoTItem } from '../types';
import { IOT_ITEMS } from '../constants';
import { Lock, X } from 'lucide-react';

interface EncyclopediaModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

const EncyclopediaModal: React.FC<EncyclopediaModalProps> = ({ unlockedIds, onClose }) => {
  // Filter only IoT items for the encyclopedia
  const collectionItems = IOT_ITEMS.filter(item => item.isIoT);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
             <h2 className="text-2xl font-bold text-cyan-700">IoT 도감</h2>
             <p className="text-slate-500 text-sm">수집 현황: {unlockedIds.length} / {collectionItems.length}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collectionItems.map((item) => {
              const isUnlocked = unlockedIds.includes(item.id);
              
              return (
                <div 
                  key={item.id} 
                  className={`relative aspect-square rounded-xl overflow-hidden border transition-all group shadow-sm ${
                    isUnlocked 
                      ? 'border-cyan-200 bg-white hover:border-cyan-400 hover:shadow-md' 
                      : 'border-slate-200 bg-slate-100 opacity-60'
                  }`}
                >
                  {isUnlocked ? (
                    <>
                      <img 
                        src={`https://picsum.photos/seed/${item.imageKeyword}/300/300`} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8">
                        <p className="text-white font-bold text-sm truncate">{item.name}</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <Lock size={32} className="mb-2 text-slate-300" />
                      <p className="text-xs font-bold">???</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncyclopediaModal;