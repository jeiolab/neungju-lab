'use client'

import React from 'react';
import { Scenario, Choice } from '../types';
import { MapPin, Smartphone } from 'lucide-react';

interface Props {
  scenario: Scenario;
  onChoice: (choice: Choice) => void;
  disabled: boolean;
}

const ScenarioCard: React.FC<Props> = ({ scenario, onChoice, disabled }) => {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4">
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Smartphone size={80} className="text-gray-900" />
        </div>
        
        <div className="flex items-center gap-2 text-cyan-600 mb-2 font-mono-tech text-sm uppercase tracking-wider font-bold">
          <div className="bg-cyan-50 p-1 rounded">
            <MapPin size={16} />
          </div>
          {scenario.location}
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{scenario.title}</h1>
        <p className="text-gray-600 leading-relaxed text-lg mb-8 border-l-4 border-cyan-400 pl-4 py-1">
          {scenario.description}
        </p>

        <div className="space-y-3">
          {scenario.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice)}
              disabled={disabled}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden
                ${disabled 
                  ? 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed' 
                  : 'bg-white border-gray-200 hover:border-cyan-400 hover:shadow-md hover:bg-cyan-50/30'
                }
              `}
            >
              <div className="flex items-start gap-3 relative z-10">
                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors ${disabled ? 'bg-gray-300' : 'bg-cyan-400 group-hover:bg-cyan-600'}`} />
                <div>
                  <span className={`font-bold text-lg block transition-colors ${disabled ? 'text-gray-400' : 'text-gray-800 group-hover:text-cyan-900'}`}>
                    {choice.label}
                  </span>
                  <span className={`text-sm block mt-1 transition-colors ${disabled ? 'text-gray-300' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {choice.description}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
