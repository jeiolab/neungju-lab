import React, { ReactNode } from 'react';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description?: string;
  icon: ReactNode;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
}

const StepCard: React.FC<StepCardProps> = ({ 
  stepNumber, 
  title, 
  description, 
  icon, 
  children, 
  isActive = true,
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 ${
      isActive 
        ? 'border-blue-300 shadow-md shadow-blue-100/50 opacity-100' 
        : 'border-slate-200 opacity-60 grayscale'
    } ${className}`}>
      
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg shrink-0 ${
            isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {stepNumber}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {title}
              <span className="text-blue-600 opacity-80">{icon}</span>
            </h3>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        <div className="pl-0 md:pl-14">
            {children}
        </div>
      </div>
    </div>
  );
};

export default StepCard;