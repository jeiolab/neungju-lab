import React from 'react';
import { X, Stamp } from 'lucide-react';
import { PLANETS } from '../constants';
import { TravelRecord } from '../types';

interface SpacePassportProps {
  isOpen: boolean;
  onClose: () => void;
  visitedRecords: TravelRecord[];
}

const SpacePassport: React.FC<SpacePassportProps> = ({ isOpen, onClose, visitedRecords }) => {
  if (!isOpen) return null;

  const visitedSet = new Set(visitedRecords.map(r => r.planetId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl border-2 border-yellow-500 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-yellow-500 p-4 flex justify-between items-center relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/leather.png')]"></div>
          <h2 className="text-2xl font-bold text-yellow-900 flex items-center gap-3 relative z-10">
            <Stamp className="w-6 h-6" />
            우주 여권 (Space Passport)
          </h2>
          <button onClick={onClose} className="text-yellow-900 hover:text-yellow-700 relative z-10">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto bg-yellow-50">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {PLANETS.map((planet) => {
              const isVisited = visitedSet.has(planet.id);
              const record = visitedRecords.find(r => r.planetId === planet.id);
              
              return (
                <div key={planet.id} className="aspect-[3/4] border-2 border-dashed border-yellow-300 rounded-lg flex flex-col items-center justify-center p-2 relative group bg-white">
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-widest absolute top-2">{planet.nameEn}</span>
                  
                  {isVisited ? (
                    <div className="flex flex-col items-center animate-stamp-in transform rotate-[-12deg]">
                      <div className={`w-16 h-16 rounded-full border-4 border-double ${planet.color.replace('bg-', 'border-')} flex items-center justify-center opacity-80 mb-2`}>
                        <div className={`w-12 h-12 rounded-full ${planet.color} opacity-50`}></div>
                      </div>
                      <span className="text-xs font-bold text-red-700 border-2 border-red-700 px-1 py-0.5 rounded rotate-6">VISITED</span>
                      <span className="text-[10px] text-gray-500 mt-1 font-mono">
                        {new Date(record!.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ) : (
                    <div className="opacity-30 grayscale flex flex-col items-center">
                       <div className={`w-12 h-12 rounded-full bg-gray-300 mb-2`}></div>
                       <span className="text-gray-500 text-xs">미방문</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 border-t border-yellow-300 pt-4 text-center">
            <p className="text-yellow-800 font-serif italic text-sm">
              "탐험은 인간의 본성이다." - NASA
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              방문 완료: {visitedSet.size} / {PLANETS.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacePassport;