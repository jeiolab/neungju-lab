import React from 'react';
import { LucideIcon } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {title && <div className="px-5 py-3 border-b border-gray-100 font-bold text-gray-800">{title}</div>}
    <div className="p-5">{children}</div>
  </div>
);

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }> = ({ 
  children, variant = 'primary', className = '', ...props 
}) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200",
    secondary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200",
    outline: "border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50",
    ghost: "text-gray-500 hover:bg-gray-100"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  );
};

export const Badge: React.FC<{ icon: string; name: string; color: string }> = ({ icon, name, color }) => (
  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${color} shadow-sm`}>
    <span>{icon}</span>
    <span>{name}</span>
  </div>
);

interface CalendarProps {
  history: Record<string, any>;
  currentDate: string;
}

export const Calendar: React.FC<CalendarProps> = ({ history, currentDate }) => {
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const todayDay = parseInt(currentDate.split('-')[2]);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-1 mt-2">
      {days.map(d => {
        const dStr = `${currentDate.substring(0, 7)}-${d.toString().padStart(2, '0')}`;
        const record = history[dStr];
        let bg = 'bg-gray-100';
        if (record?.completed) bg = 'bg-indigo-500 text-white';
        else if (record?.recovered) bg = 'bg-emerald-400 text-white';
        else if (d === todayDay) bg = 'bg-indigo-100 text-indigo-600 border border-indigo-300';
        
        return (
          <div key={d} className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${bg}`}>
            {d}
          </div>
        )
      })}
    </div>
  );
};
