import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Trash2 } from 'lucide-react';
import { Point } from '../types';

const LabCity: React.FC = () => {
  const [schools, setSchools] = useState<Point[]>([]);
  const [policeStation, setPoliceStation] = useState<Point | null>(null);
  const [feedback, setFeedback] = useState<string>("학교 위치를 지도에 찍어보세요.");
  const mapRef = useRef<HTMLDivElement>(null);

  const addSchool = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSchools(prev => [...prev, { id: Date.now(), x, y }]);
  };

  const resetMap = () => {
    setSchools([]);
    setPoliceStation(null);
    setFeedback("학교 위치를 지도에 찍어보세요.");
  };

  // K-Means (K=1) Logic: Finding the Centroid
  useEffect(() => {
    if (schools.length === 0) {
      setPoliceStation(null);
      return;
    }

    // Calculate Average X and Y
    const totalX = schools.reduce((sum, p) => sum + p.x, 0);
    const totalY = schools.reduce((sum, p) => sum + p.y, 0);
    const avgX = totalX / schools.length;
    const avgY = totalY / schools.length;

    setPoliceStation({ id: 0, x: avgX, y: avgY });

    // Generate Feedback based on distribution (Simulated Silhouette/Variance)
    if (schools.length < 3) {
      setFeedback("데이터가 부족합니다. 학교를 더 추가해보세요.");
    } else {
      // Calculate variance to check if spread out
      const variance = schools.reduce((sum, p) => {
        return sum + Math.sqrt(Math.pow(p.x - avgX, 2) + Math.pow(p.y - avgY, 2));
      }, 0) / schools.length;

      if (variance > 100) {
        setFeedback(`경찰서가 중심(${Math.round(avgX)},${Math.round(avgY)})으로 이동했습니다. 학교가 넓게 분포되어 있군요.`);
      } else {
        setFeedback("경찰서가 학교 밀집 지역 중앙에 배치되었습니다. 효율적입니다!");
      }
    }
  }, [schools]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-indigo-500" />
          <h3 className="text-xl font-bold text-slate-800">도시 모드 (비지도 학습/군집)</h3>
        </div>
        <button 
          onClick={resetMap}
          className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-3 h-3" /> 초기화
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="col-span-2 relative h-80 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden cursor-crosshair group"
             ref={mapRef}
             onClick={addSchool}
        >
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-20">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-slate-400"></div>
            ))}
          </div>
          
          <div className="absolute top-2 left-2 bg-white/80 px-2 py-1 rounded text-xs text-slate-500 pointer-events-none">
            지도 클릭: 학교 추가
          </div>

          {/* Render Schools */}
          {schools.map(school => (
            <div 
              key={school.id}
              className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-sm transform -translate-x-1/2 -translate-y-1/2 animate-bounce-short"
              style={{ left: school.x, top: school.y }}
            >
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap text-blue-700 font-bold">학교</div>
            </div>
          ))}

          {/* Render Police Station (Centroid) */}
          {policeStation && (
            <div 
              className="absolute transition-all duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: policeStation.x, top: policeStation.y }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-red-500/20 rounded-full animate-ping absolute top-0 left-0"></div>
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <Building className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-600 bg-white px-2 py-0.5 rounded shadow">경찰서</div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 h-full">
            <h4 className="font-bold text-indigo-900 mb-2">분석 피드백</h4>
            <div className="text-indigo-800 text-sm leading-relaxed mb-4 min-h-[60px]">
              {feedback}
            </div>
            
            <div className="bg-white p-3 rounded-lg text-xs text-indigo-600 space-y-2">
              <div className="flex justify-between">
                <span>학교 수:</span>
                <span className="font-bold">{schools.length}개</span>
              </div>
              <div className="flex justify-between">
                <span>알고리즘:</span>
                <span className="font-bold">K-Means (K=1)</span>
              </div>
            </div>
             <p className="text-[10px] text-indigo-400 mt-4">
              * K-Means 알고리즘은 데이터들의 '평균 위치(중심)'를 찾아 군집을 형성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabCity;