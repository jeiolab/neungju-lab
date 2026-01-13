import React from 'react';
import { Agent } from '../types';
import { Shield, Eye, Activity, MapPin, Zap } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  compact?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, compact = false }) => {
  return (
    <div className={`relative overflow-hidden bg-white border-2 border-slate-200 rounded-xl shadow-lg transition-transform hover:scale-[1.02] ${compact ? 'p-4' : 'p-6'}`}>
      <div className={`absolute top-0 left-0 w-full h-2 ${agent.avatarColor}`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{agent.name}</h3>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">ID: {agent.id.slice(0, 6)}</span>
        </div>
        <div className={`w-10 h-10 rounded-full ${agent.avatarColor} flex items-center justify-center text-white font-bold shadow-sm`}>
          {agent.name.charAt(0)}
        </div>
      </div>

      <div className="space-y-3">
        {/* Goal */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 mb-1 text-indigo-600 font-bold text-sm">
            <Shield size={16} /> 목표 (GOAL)
          </div>
          <p className="text-slate-700 text-sm leading-snug">{agent.goal}</p>
        </div>

        {/* Environment */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <MapPin size={16} className="mt-0.5 text-emerald-500 shrink-0" />
          <span><strong className="text-slate-800">활동 장소:</strong> {agent.environment}</span>
        </div>

        {/* Sensors */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Eye size={16} className="mt-0.5 text-blue-500 shrink-0" />
          <div>
            <strong className="text-slate-800">감각 센서:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.sensors.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-100">{s.split('(')[0]}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-start gap-2 text-sm text-slate-600">
          <Zap size={16} className="mt-0.5 text-amber-500 shrink-0" />
          <div>
            <strong className="text-slate-800">수행 행동:</strong>
             <ul className="list-disc list-inside pl-1 text-xs text-slate-600 mt-1">
                {agent.actions.map((act, i) => (
                    <li key={i}>{act}</li>
                ))}
             </ul>
          </div>
        </div>
        
        {/* Characteristics */}
        {!compact && (
            <div className="flex items-start gap-2 text-sm text-slate-600 border-t pt-2 mt-2 border-slate-100">
            <Activity size={16} className="mt-0.5 text-pink-500 shrink-0" />
            <span><strong className="text-slate-800">성격/특성:</strong> {agent.characteristics}</span>
            </div>
        )}
      </div>
    </div>
  );
};

export default AgentCard;