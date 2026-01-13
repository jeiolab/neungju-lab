import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {title && <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>}
      {children}
    </div>
  );
};