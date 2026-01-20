import React from 'react';
import { getDaysInMonth } from '../utils';

interface Props {
  completedMissions: Record<string, boolean>;
}

export const MissionCalendar: React.FC<Props> = ({ completedMissions }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6">
      <h4 className="text-sm font-semibold text-gray-500 mb-3 text-center">{year}년 {month + 1}월 활동 로그</h4>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isDone = completedMissions[dateStr];
          const isToday = day === today.getDate();
          
          return (
            <div
              key={day}
              className={`
                aspect-square flex items-center justify-center rounded-md text-xs font-medium
                ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}
                ${isToday ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
              `}
              title={dateStr}
            >
              {day}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>성공</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>미완료</span>
        </div>
      </div>
    </div>
  );
};
