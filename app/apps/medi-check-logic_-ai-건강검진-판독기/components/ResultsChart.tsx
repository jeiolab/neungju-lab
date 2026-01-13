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
    <div className="w-full h-64 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h4 className="text-sm font-bold text-slate-700 mb-2">📊 혈압 분포도 (X:이완기, Y:수축기)</h4>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="이완기" unit="mmHg" domain={[60, 120]} />
          <YAxis type="number" dataKey="y" name="수축기" unit="mmHg" domain={[90, 180]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
             if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-slate-200 shadow-lg rounded text-xs">
                    <p className="font-bold">{d.name}</p>
                    <p>혈압: {d.y}/{d.x}</p>
                    <p style={{color: DIAGNOSIS_COLORS[d.diagnosis as DiagnosisType]}}>판정: {d.diagnosis}</p>
                  </div>
                );
             }
             return null;
          }} />
          <Legend />
          
          {/* Reference Lines for Medical Standards */}
          <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '고혈압(140)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={120} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: '주의(120)', position: 'insideBottomRight', fill: '#f59e0b', fontSize: 10 }} />
          
          <Scatter name="환자 데이터" data={data} shape="circle">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={DIAGNOSIS_COLORS[entry.diagnosis]} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
