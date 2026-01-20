import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from 'recharts';
import { Patient, DiagnosisType } from '../types';
import { DIAGNOSIS_COLORS } from '../constants';

interface ResultsChartProps {
  patients: Patient[];
  results?: { patientId: string; userDiagnosis: DiagnosisType }[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ patients, results }) => {
  const data = patients.map(p => {
    const result = results?.find(r => r.patientId === p.id);
    // If we have results, use the user's diagnosis color, otherwise use neutral
    const diagnosis = result ? result.userDiagnosis : p.trueDiagnosis;
    
    return {
      x: p.diastolic,
      y: p.systolic,
      name: p.name,
      diagnosis: diagnosis,
    };
  });

  return (
    <div className="w-full h-[450px] bg-white rounded-xl shadow-md border-2 border-slate-300 p-6 flex flex-col">
      <h4 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span>혈압 분포도 (X:이완기, Y:수축기)</span>
      </h4>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 40, bottom: 40, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="이완기" 
              unit="mmHg" 
              domain={[60, 120]} 
              tick={{ fill: '#1f2937', fontSize: 13, fontWeight: 600 }}
              label={{ value: '이완기 혈압 (mmHg)', position: 'insideBottom', offset: -8, style: { fill: '#111827', fontSize: 13, fontWeight: 700 } }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="수축기" 
              unit="mmHg" 
              domain={[90, 180]} 
              tick={{ fill: '#1f2937', fontSize: 13, fontWeight: 600 }}
              label={{ value: '수축기 혈압 (mmHg)', angle: -90, position: 'insideLeft', style: { fill: '#111827', fontSize: 13, fontWeight: 700 } }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
               if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-slate-300 shadow-lg rounded-lg text-xs">
                      <p className="font-bold text-gray-900 mb-1">{d.name}</p>
                      <p className="text-gray-700">혈압: {d.y}/{d.x} mmHg</p>
                      <p className="font-semibold mt-1" style={{color: DIAGNOSIS_COLORS[d.diagnosis as DiagnosisType]}}>판정: {d.diagnosis}</p>
                    </div>
                  );
               }
               return null;
            }} />
            
            {/* Reference Lines for Medical Standards */}
            <ReferenceLine y={140} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" label={{ value: '고혈압 기준(140)', position: 'right', fill: '#ef4444', fontSize: 11, offset: 5 }} />
            <ReferenceLine y={120} stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" label={{ value: '주의 기준(120)', position: 'right', fill: '#f59e0b', fontSize: 11, offset: 5 }} />
            
            <Scatter name="환자 데이터" data={data} shape="circle" fill="#3b82f6">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DIAGNOSIS_COLORS[entry.diagnosis]} r={8} stroke="#fff" strokeWidth={2} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ResultsChart;
