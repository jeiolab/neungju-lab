'use client'

import React, { useState } from 'react';
import { TechType, ReasonType, Question } from '../types';
import { Wifi, Bluetooth, Radio, Smartphone, CheckCircle2, Circle } from 'lucide-react';

interface GameCardProps {
  question: Question;
  selectedTech: TechType | null;
  selectedReasons: ReasonType[];
  onSelectTech: (tech: TechType) => void;
  onToggleReason: (reason: ReasonType) => void;
  onSubmit: () => void;
}

const GameCard: React.FC<GameCardProps> = ({
  question,
  selectedTech,
  selectedReasons,
  onSelectTech,
  onToggleReason,
  onSubmit
}) => {
  const [customNote, setCustomNote] = useState("");

  const techOptions = [
    { type: TechType.WIFI, icon: Wifi, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { type: TechType.BLUETOOTH, icon: Bluetooth, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
    { type: TechType.NFC, icon: Radio, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { type: TechType.CELLULAR, icon: Smartphone, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  ];

  const reasonOptions = Object.values(ReasonType);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 pt-24 px-4 max-w-md mx-auto">
      {/* Scenario Card */}
      <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
            CASE #{question.id}
          </span>
          <span className="text-xs text-indigo-500 font-medium">어떤 기술이 필요할까?</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800 leading-snug mb-2">
          {question.scenario}
        </h2>
      </div>

      {/* Tech Selection */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {techOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelectTech(option.type)}
            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2
              ${selectedTech === option.type 
                ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]' 
                : 'border-slate-100 bg-white hover:bg-slate-50'}`}
          >
            <option.icon className={`w-8 h-8 ${option.color}`} />
            <span className={`text-sm font-bold ${selectedTech === option.type ? 'text-indigo-700' : 'text-slate-600'}`}>
              {option.type}
            </span>
          </button>
        ))}
      </div>

      {/* Reason Selection */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-1.5 text-indigo-500" />
          이유 선택 <span className="text-slate-400 font-normal ml-1 text-xs">(최대 2개)</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {reasonOptions.map((reason) => {
            const isSelected = selectedReasons.includes(reason);
            const isDisabled = !isSelected && selectedReasons.length >= 2;
            
            return (
              <button
                key={reason}
                onClick={() => !isDisabled && onToggleReason(reason)}
                disabled={isDisabled}
                className={`text-left text-xs px-3 py-2.5 rounded-lg border transition-all flex items-center
                  ${isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : isDisabled 
                      ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
              >
                {isSelected ? <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" /> : <Circle className="w-3.5 h-3.5 mr-2 shrink-0 opacity-50" />}
                {reason}
              </button>
            );
          })}
        </div>
      </div>

       {/* User Input (Optional) */}
       <div className="mb-4">
        <input 
            type="text" 
            placeholder="나의 사례 메모 (선택)"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="w-full text-sm p-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-700"
        />
       </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={!selectedTech}
        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all mb-4
          ${selectedTech 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 transform active:scale-95' 
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
      >
        결과 확인하기
      </button>
    </div>
  );
};

export default GameCard;