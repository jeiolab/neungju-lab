import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartType, DataPoint } from '../types';
import WordCloud from './WordCloud';

interface VizCanvasProps {
  type: ChartType | null;
  data: DataPoint[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const VizCanvas: React.FC<VizCanvasProps> = ({ type, data }) => {
  if (!type) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
        <p>왼쪽에서 그래프 유형을 선택해주세요</p>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case ChartType.BAR:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [value, '값']} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" animationDuration={1000}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case ChartType.LINE:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => [value, '값']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                strokeWidth={3}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case ChartType.PIE:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [value, '값']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case ChartType.WORD_CLOUD:
        return <WordCloud data={data} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-64 md:h-96 bg-white rounded-xl shadow-inner p-4 border border-slate-200">
      {renderChart()}
    </div>
  );
};

export default VizCanvas;
