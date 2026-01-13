import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UserState } from '../types';
import { CONCEPT_CARDS } from '../constants';

interface Props {
  userState: UserState;
}

const DashboardTab: React.FC<Props> = ({ userState }) => {
  const data = Object.entries(userState.masteryMap).map(([id, score]) => {
    const concept = CONCEPT_CARDS.find(c => c.id === id);
    return {
      name: concept ? concept.title.split('(')[0] : id, // Shorten name
      score: score
    };
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96">
      <h3 className="text-lg font-bold text-slate-800 mb-4">나의 개념 숙련도</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-15} textAnchor="end" height={60} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DashboardTab;