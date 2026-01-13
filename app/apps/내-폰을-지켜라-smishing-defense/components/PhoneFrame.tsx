import React from 'react';
import { Signal, Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  isShaking?: boolean;
  isRedScreen?: boolean;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, isShaking, isRedScreen }) => {
  return (
    <div className={`relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl flex flex-col overflow-hidden ${isShaking ? 'animate-bounce' : ''}`}>
      <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
      <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
      <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
      
      {/* Dynamic Screen Overlay for Infection */}
      {isRedScreen && (
        <div className="absolute inset-0 z-50 bg-red-600/50 pointer-events-none animate-pulse flex items-center justify-center">
            <span className="text-white font-black text-4xl rotate-12 border-4 border-white p-2">HACKED</span>
        </div>
      )}

      {/* Screen */}
      <div className="rounded-[2rem] overflow-hidden w-full h-full bg-slate-50 relative flex flex-col font-sans">
        
        {/* Status Bar */}
        <div className="bg-slate-100 h-8 flex items-center justify-between px-6 text-xs font-semibold text-slate-800 z-10 select-none">
            <span>12:00</span>
            <div className="flex space-x-1 items-center">
                <Signal size={12} />
                <Wifi size={12} />
                <Battery size={12} />
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto relative">
            {children}
        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-50 h-6 w-full flex justify-center items-center z-10">
            <div className="h-1 w-24 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default PhoneFrame;