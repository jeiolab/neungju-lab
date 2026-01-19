import React, { useState } from 'react';
import { Sparkles, Info, Loader2 } from 'lucide-react';
import { GalaxyType } from '../types';
import { fetchGalaxyFact } from '../services/geminiService';

const GalaxyDex: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<GalaxyType | null>(null);
  const [aiFact, setAiFact] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGalaxySelect = async (type: GalaxyType) => {
    setSelectedGalaxy(type);
    setLoading(true);
    setAiFact(null);
    const fact = await fetchGalaxyFact(type === GalaxyType.SPIRAL ? "나선" : "타원");
    setAiFact(fact);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn p-4 pb-20">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <h2 className="text-2xl font-bold">은하 도감 (Add-on)</h2>
        </div>
        
        <p className="text-slate-300 mb-8 relative z-10">
          우주에는 다양한 모양의 은하가 있습니다. 분류 모델은 은하의 이미지를 보고 나선형인지 타원형인지 구분할 수 있습니다.
          궁금한 은하를 선택해보세요.
        </p>

        <div className="grid md:grid-cols-2 gap-6 relative z-10">
          {/* Spiral Galaxy Card */}
          <button 
            onClick={() => handleGalaxySelect(GalaxyType.SPIRAL)}
            className={`group relative overflow-hidden rounded-xl aspect-square border-2 transition-all duration-300 ${selectedGalaxy === GalaxyType.SPIRAL ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-slate-700 hover:border-slate-500'}`}
          >
            <img 
              src="https://picsum.photos/seed/spiralgalaxy/400/400" 
              alt="Spiral Galaxy" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-xl font-bold text-white mb-1">나선 은하 (Spiral)</h3>
              <p className="text-xs text-slate-300">소용돌이치는 팔이 특징</p>
            </div>
          </button>

          {/* Elliptical Galaxy Card */}
          <button 
            onClick={() => handleGalaxySelect(GalaxyType.ELLIPTICAL)}
            className={`group relative overflow-hidden rounded-xl aspect-square border-2 transition-all duration-300 ${selectedGalaxy === GalaxyType.ELLIPTICAL ? 'border-indigo-400 ring-2 ring-indigo-400/50' : 'border-slate-700 hover:border-slate-500'}`}
          >
            <img 
              src="https://picsum.photos/seed/ellipticalgalaxy/400/400" 
              alt="Elliptical Galaxy" 
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
              <h3 className="text-xl font-bold text-white mb-1">타원 은하 (Elliptical)</h3>
              <p className="text-xs text-slate-300">매끄러운 타원 모양</p>
            </div>
          </button>
        </div>

        {/* AI Content Display */}
        {selectedGalaxy && (
          <div className="mt-6 bg-slate-800/80 backdrop-blur-sm p-5 rounded-xl border border-slate-700 animate-fadeIn">
            <div className="flex items-center gap-2 mb-3 text-indigo-300">
              <Info className="w-5 h-5" />
              <span className="font-bold">천문학자의 노트 (by Gemini)</span>
            </div>
            
            {loading ? (
              <div className="flex items-center gap-3 py-4 text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">데이터베이스 검색 중...</span>
              </div>
            ) : (
              <p className="text-slate-200 leading-relaxed text-sm">
                {aiFact}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalaxyDex;