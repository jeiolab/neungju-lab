import React, { useMemo } from 'react';
import { DataPoint } from '../types';

interface WordCloudProps {
  data: DataPoint[];
}

const COLORS = ['text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-orange-500', 'text-pink-500', 'text-indigo-500'];

const WordCloud: React.FC<WordCloudProps> = ({ data }) => {
  // Normalize values to calculate font sizes
  const processedData = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    
    return data.map((item, index) => {
      // Linear interpolation for font size between 1rem and 4rem
      const sizeRange = 3; // 4rem - 1rem
      const normalized = (item.value - minValue) / (maxValue - minValue || 1);
      const fontSize = 1 + (normalized * sizeRange);
      
      return {
        ...item,
        fontSize: `${fontSize}rem`,
        colorClass: COLORS[index % COLORS.length]
      };
    }).sort(() => Math.random() - 0.5); // Shuffle for cloud effect
  }, [data]);

  return (
    <div className="w-full h-full flex flex-wrap justify-center items-center content-center p-8 bg-slate-50 rounded-lg overflow-hidden gap-4">
      {processedData.map((item) => (
        <span
          key={item.name}
          className={`font-bold transition-all duration-500 hover:scale-110 cursor-pointer ${item.colorClass}`}
          style={{ fontSize: item.fontSize, lineHeight: 1.2 }}
          title={`${item.name}: ${item.value}`}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
};

export default WordCloud;
