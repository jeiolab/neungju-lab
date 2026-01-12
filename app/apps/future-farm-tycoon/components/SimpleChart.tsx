import React from 'react';

interface SimpleChartProps {
  data: { label: string; value: number }[];
  color: string;
  height?: number;
  maxValue?: number;
}

const SimpleChart: React.FC<SimpleChartProps> = ({ data, color, height = 150, maxValue }) => {
  // Determine max value for scaling
  const max = maxValue || Math.max(...data.map((d) => d.value), 100);
  const chartHeight = height;
  const barWidth = 100 / Math.max(data.length, 1) - 2; // Percentage width minus gap

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full relative border-b border-gray-300 flex items-end justify-between" style={{ height: `${chartHeight}px` }}>
        {data.map((item, index) => {
          const barHeight = Math.max((item.value / max) * 100, 0);
          return (
            <div
              key={index}
              className="flex flex-col items-center group relative"
              style={{ width: `${barWidth}%`, height: '100%' }}
            >
              {/* Tooltip */}
              <div className="absolute -top-8 bg-slate-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {item.value.toLocaleString()}원
              </div>
              
              {/* Bar Container */}
              <div className="h-full w-full flex items-end justify-center">
                 <div
                  className={`w-full rounded-t ${color} transition-all duration-500 ease-out`}
                  style={{ height: `${barHeight}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
       <div className="w-full flex justify-between mt-2 text-xs text-gray-500">
          <span>시작</span>
          <span>현재</span>
      </div>
    </div>
  );
};

export default SimpleChart;