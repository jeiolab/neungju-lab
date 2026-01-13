import React from 'react';
import { TIMELINE_EVENTS } from '../constants';
import { Scroll, User, ShieldLock, Settings } from 'lucide-react';

const IconMap: Record<string, React.FC<any>> = {
  Scroll, User, ShieldLock, Settings
};

const HistoryTimeline: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">암호의 역사</h2>
      <div className="relative border-l-4 border-indigo-200 ml-6 md:ml-0 md:pl-0 md:border-l-0 md:border-t-4 space-y-8 md:space-y-0 md:flex md:justify-between md:pt-8">
        {TIMELINE_EVENTS.map((event, index) => {
          const Icon = IconMap[event.icon] || User;
          return (
            <div key={index} className="relative md:flex-1 md:text-center group">
                {/* Dot */}
                <div className="absolute -left-[27px] top-0 md:left-1/2 md:-top-[44px] md:-translate-x-1/2 w-5 h-5 bg-white border-4 border-indigo-500 rounded-full z-10 group-hover:scale-125 transition-transform" />
                
                {/* Content */}
                <div className="pl-6 md:pl-2 md:pr-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-2 shadow-sm">
                        <Icon size={24} />
                    </div>
                    <div className="text-sm font-bold text-indigo-500 mb-1">{event.year}</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed bg-white md:bg-transparent p-3 md:p-0 rounded-lg shadow-sm md:shadow-none border border-slate-100 md:border-none">
                        {event.description}
                    </p>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryTimeline;
