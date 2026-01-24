import React from 'react';
import { Fan, Lightbulb, Thermometer, User } from 'lucide-react';

interface SimulationProps {
  stageId: number;
  isRunning: boolean;
  fanOn: boolean;
  lightOn: boolean;
  temperature: number;
  motion: boolean;
}

export const SimulationViewer: React.FC<SimulationProps> = ({
  stageId,
  isRunning,
  fanOn,
  lightOn,
  temperature,
  motion
}) => {
  return (
    <div className="w-full h-64 bg-slate-800 rounded-xl relative overflow-hidden border-4 border-slate-700 shadow-inner">
      {/* Background Room */}
      <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center transition-colors duration-500"
           style={{ backgroundColor: lightOn ? '#fefce8' : '#1e293b' }}>
        
        {/* Status Text overlay */}
        <div className="absolute top-2 left-2 bg-black/50 text-white p-2 rounded text-xs z-10 font-mono">
          <div>TEMP: {temperature}°C</div>
          <div>MOTION: {motion ? 'YES' : 'NO'}</div>
          <div>FAN: {fanOn ? 'ON' : 'OFF'}</div>
          <div>LIGHT: {lightOn ? 'ON' : 'OFF'}</div>
        </div>

        {/* Classroom Elements */}
        <div className="relative w-full h-full flex items-end justify-center pb-8 gap-8">
          
          {/* Fan */}
          <div className="flex flex-col items-center">
            <Fan 
              size={64} 
              className={`text-blue-400 transition-all duration-1000 ${fanOn ? 'animate-spin' : ''}`} 
              style={{ animationDuration: fanOn ? '0.5s' : '0s' }}
            />
            <span className={`text-xs font-bold mt-2 ${lightOn ? 'text-slate-800' : 'text-slate-300'}`}>스마트 선풍기</span>
          </div>

          {/* Light Bulb */}
          <div className="absolute top-4 right-10 flex flex-col items-center">
            <Lightbulb 
              size={48} 
              className={`transition-all duration-300 ${lightOn ? 'text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)] fill-yellow-400' : 'text-slate-600'}`} 
            />
          </div>

          {/* Character / Motion */}
          {stageId === 2 && (
            <div className={`flex flex-col items-center transition-opacity duration-500 ${motion ? 'opacity-100' : 'opacity-30 grayscale'}`}>
              <User size={64} className={lightOn ? 'text-slate-800' : 'text-slate-300'} />
              <span className={`text-xs font-bold mt-2 ${lightOn ? 'text-slate-800' : 'text-slate-300'}`}>학생</span>
            </div>
          )}
          
          {/* Thermometer Display for Stage 1 */}
          {stageId === 1 && (
            <div className="flex flex-col items-center">
              <div className="relative">
                 <Thermometer size={64} className={temperature > 25 ? 'text-red-500' : 'text-green-500'} />
              </div>
               <span className={`text-xs font-bold mt-2 ${lightOn ? 'text-slate-800' : 'text-slate-300'}`}>온도계</span>
            </div>
          )}

        </div>
      </div>
      
      {/* Running Overlay */}
      {isRunning && (
        <div className="absolute inset-0 bg-green-500/20 pointer-events-none flex items-center justify-center">
          <span className="text-green-400 font-bold text-2xl drop-shadow-md animate-pulse">EXECUTING CODE...</span>
        </div>
      )}
    </div>
  );
};
