import React from 'react';
import { User, Server, Wifi } from 'lucide-react';

const ConnectionDiagram: React.FC = () => {
  return (
    <div className="bg-slate-100 p-4 rounded-xl my-4 border border-slate-200">
      <h4 className="text-sm font-bold text-slate-500 mb-2 text-center">초연결 사회 다이어그램</h4>
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col items-center">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <User size={24} />
          </div>
          <span className="text-xs mt-1 font-medium">사람</span>
        </div>

        <div className="flex-1 flex flex-col items-center px-2">
            <div className="flex space-x-1 animate-pulse mb-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
            </div>
            <div className="h-0.5 w-full bg-blue-300 relative">
                 <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-blue-200">
                    <Wifi size={12} className="text-blue-500" />
                 </div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">인터넷/네트워크</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="bg-green-100 p-2 rounded-full text-green-600">
            <Server size={24} />
          </div>
          <span className="text-xs mt-1 font-medium">사물(IoT)</span>
        </div>
      </div>
      <p className="text-xs text-center text-slate-500 mt-3 bg-white p-2 rounded border border-slate-100">
        사람과 사물, 사물과 사물이<br/>데이터로 연결되어 대화합니다!
      </p>
    </div>
  );
};

export default ConnectionDiagram;
