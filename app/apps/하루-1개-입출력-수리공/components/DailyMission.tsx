import React, { useState, useEffect } from 'react';
import { DailyMission as MissionType, MissionOption } from '../types';
import { CheckCircle, AlertCircle, Play, Wrench, CalendarCheck } from 'lucide-react';
import { MissionCalendar } from './MissionCalendar';

interface Props {
  mission: MissionType;
  isCompleted: boolean;
  onComplete: () => void;
  streak: number;
  completedMissions: Record<string, boolean>;
}

export const DailyMission: React.FC<Props> = ({ mission, isCompleted, onComplete, streak, completedMissions }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Reset local state when mission changes or on new day
  useEffect(() => {
    if (!isCompleted) {
        setSelectedOption(null);
        setFeedback(null);
    }
  }, [mission.id, isCompleted]);

  const handleCheck = () => {
    if (!selectedOption) return;
    const option = mission.options.find(o => o.id === selectedOption);
    if (option) {
      const isCorrect = option.isCorrect;
      setFeedback({
        isCorrect,
        text: option.feedback
      });
      if (isCorrect && !isCompleted) {
        onComplete();
      }
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-green-100 p-4 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">오늘의 수리 완료!</h2>
        <p className="text-gray-600 text-center max-w-xs mb-6">
          성공적으로 코드를 고쳤습니다.<br/>
          내일도 새로운 미션이 기다리고 있습니다.
        </p>
        <div className="bg-orange-100 text-orange-800 px-6 py-2 rounded-full font-bold flex items-center gap-2">
            <CalendarCheck className="w-5 h-5" />
            현재 {streak}일 연속 성공 중!
        </div>
        
        <div className="w-full max-w-sm">
             <MissionCalendar completedMissions={completedMissions} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex items-center gap-3">
          <Wrench className="text-yellow-400 w-6 h-6 animate-pulse" />
          <div>
            <h2 className="font-bold text-lg">{mission.title}</h2>
            <p className="text-slate-400 text-xs uppercase tracking-wider">{mission.type.replace('_', ' ').toUpperCase()} MISSION</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-4 leading-relaxed">{mission.description}</p>
          
          <div className="relative mb-6">
             <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded-br z-10 font-bold">BROKEN CODE</div>
             <pre className="bg-gray-100 p-4 pt-8 rounded-lg border-2 border-dashed border-red-300 font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                {mission.brokenCode}
             </pre>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                수리 도구 선택
            </h3>
            <div className="grid gap-3">
              {mission.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedOption(opt.id);
                    setFeedback(null); // Clear feedback on retry selection
                  }}
                  className={`
                    w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between
                    ${selectedOption === opt.id 
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <span className="font-mono text-sm font-semibold">{opt.label}</span>
                  {selectedOption === opt.id && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer & Feedback */}
        <div className="p-4 bg-gray-50 border-t flex flex-col items-center">
            {feedback && (
                <div className={`mb-4 w-full p-3 rounded-lg flex items-start gap-3 ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.isCorrect ? <CheckCircle className="shrink-0 w-5 h-5 mt-0.5" /> : <AlertCircle className="shrink-0 w-5 h-5 mt-0.5" />}
                    <p className="text-sm font-medium">{feedback.text}</p>
                </div>
            )}
            
            <button
                onClick={handleCheck}
                disabled={!selectedOption}
                className={`
                    w-full py-3 rounded-lg font-bold text-lg shadow-sm transition-transform active:scale-95
                    ${!selectedOption 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'}
                `}
            >
                검사하기 (Run Check)
            </button>
        </div>
      </div>
    </div>
  );
};
