import React from 'react';
import { ImageStats } from '../types';
import { formatBytes } from '../utils/imageProcessing';
import { Download, FileDown, HardDrive, Percent, Star, AlertTriangle } from 'lucide-react';

interface InfoPanelProps {
  originalStats: ImageStats;
  compressedStats: ImageStats;
  onDownload: () => void;
  quality: number;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ originalStats, compressedStats, onDownload, quality }) => {
  const reduction = originalStats.sizeBytes > 0 
    ? ((originalStats.sizeBytes - compressedStats.sizeBytes) / originalStats.sizeBytes) * 100 
    : 0;
  
  // Calculate a mock "Quality Score" based on PSNR heuristic (simplified)
  // High quality (100) -> 5 stars
  // Low quality (10) -> 1 star
  const stars = Math.max(1, Math.min(5, Math.ceil(quality / 20)));
  const isLossy = quality < 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-6">
      
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-slate-800">분석 결과</h3>
        <div className="flex gap-1">
             {[...Array(5)].map((_, i) => (
               <Star 
                 key={i} 
                 size={16} 
                 className={`${i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
               />
             ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Original Stats */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div className="flex items-center gap-2 text-slate-500 mb-2">
                <HardDrive size={16} />
                <span className="text-xs font-semibold uppercase">원본 크기</span>
            </div>
            <p className="text-xl font-bold text-slate-800">{formatBytes(originalStats.sizeBytes)}</p>
            <p className="text-xs text-slate-400 mt-1">{originalStats.width} x {originalStats.height}px</p>
        </div>

        {/* Compressed Stats */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
                <FileDown size={64} className="text-blue-600" />
            </div>
            <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Percent size={16} />
                <span className="text-xs font-semibold uppercase">압축 크기</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{formatBytes(compressedStats.sizeBytes)}</p>
            <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-bold text-green-600">-{reduction.toFixed(1)}%</span>
                <span className="text-xs text-blue-400">감소 (Reduction)</span>
            </div>
        </div>
      </div>

      {/* Warning/Insight */}
      <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
              <h4 className="text-sm font-semibold text-amber-800 mb-1">
                 {quality > 80 ? "고화질 유지 (High Fidelity)" : quality > 50 ? "균형 잡힌 압축 (Balanced)" : "강력한 압축 (Heavy Compression)"}
              </h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                  {quality > 80 
                     ? "인쇄나 보관용으로 적합합니다. 사람의 눈으로 차이를 구별하기 어렵습니다."
                     : quality > 50 
                       ? "웹 사용(블로그, SNS)에 적합합니다. 용량과 화질 사이의 좋은 균형을 유지합니다."
                       : "썸네일이나 미리보기에 적합합니다. 용량은 작지만 확대 시 깨짐 현상이 보일 수 있습니다."}
              </p>
          </div>
      </div>

      <button 
        onClick={onDownload}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md hover:shadow-lg"
      >
        <Download size={18} />
        압축된 이미지 다운로드
      </button>

    </div>
  );
};

export default InfoPanel;