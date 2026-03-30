import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ColorData } from '../types';
import { Palette } from 'lucide-react';

interface ColorAnalysisProps {
  originalColors: ColorData[];
  compressedColors: ColorData[];
  originalUniqueCount: number;
  compressedUniqueCount: number;
}

const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ 
  originalColors, 
  compressedColors,
  originalUniqueCount,
  compressedUniqueCount
}) => {
  // We only show compressed colors distribution for simplicity in this demo, 
  // or we could show a comparison. 
  // Let's show the unique color count comparison more prominently.
  
  const lossPercentage = originalUniqueCount > 0 
    ? ((originalUniqueCount - compressedUniqueCount) / originalUniqueCount) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
            <Palette className="text-purple-500" size={20} />
            <h3 className="text-lg font-bold text-slate-800">색상 팔레트 분석</h3>
        </div>

        <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-slate-500">유지된 색상 수</span>
                <span className="text-sm font-bold text-purple-600">
                    {compressedUniqueCount.toLocaleString()} / {originalUniqueCount.toLocaleString()}
                </span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-purple-500 transition-all duration-500" 
                    style={{ width: `${100 - lossPercentage}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
                약 {lossPercentage.toFixed(1)}%의 색상 정보가 단순화되었습니다.
            </p>
        </div>

        <div className="h-48 w-full">
            <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider text-center">픽셀 분포 (압축본)</p>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compressedColors}>
                    <XAxis dataKey="name" hide />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: 'transparent'}}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {compressedColors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default ColorAnalysis;