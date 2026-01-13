import React, { useState } from 'react';
import { AGENT_DATA } from '../constants';
import * as Icons from 'lucide-react';
import { AgentType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EncyclopediaTab: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const IconRenderer = ({ name }: { name: string }) => {
    const LucideIcon = (Icons as any)[name];
    return LucideIcon ? <LucideIcon size={24} /> : <Icons.HelpCircle size={24} />;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 pb-24 md:pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">에이전트 사례 도감</h1>
        <p className="text-gray-600">각 에이전트의 작동 원리와 센서 스펙을 자세히 알아보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {AGENT_DATA.map((agent) => (
          <motion.div 
            key={agent.id}
            initial={false}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${expandedId === agent.id ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-gray-200'}`}
          >
            <button
              onClick={() => toggleExpand(agent.id)}
              className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${agent.type === AgentType.SIMPLE ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                  <IconRenderer name={agent.iconName} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.type === AgentType.SIMPLE ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                      {agent.type}
                  </span>
                </div>
              </div>
              {expandedId === agent.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
            </button>

            <AnimatePresence>
              {expandedId === agent.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-gray-100 bg-gray-50"
                >
                  <div className="p-5 space-y-4 text-sm">
                    <div className="space-y-3">
                      <div>
                          <h4 className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wide">입력 / 센서</h4>
                          <p className="text-gray-900 bg-white p-2 rounded border border-gray-100">{agent.specs.inputs}</p>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wide">작동 메커니즘</h4>
                          <p className="text-gray-900 bg-white p-2 rounded border border-gray-100">{agent.specs.mechanism}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-500 mb-1 text-xs uppercase tracking-wide">상세 설명</h4>
                      <p className="text-gray-700 leading-relaxed bg-white p-3 rounded border border-gray-100">{agent.specs.details}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EncyclopediaTab;