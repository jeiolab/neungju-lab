import React, { useState } from 'react';
import { CONCEPTS, RED_FLAGS_CHECKLIST } from '../constants';
import { Mail, MessageSquare, Globe, Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { UserState } from '../types';

interface Props {
    user: UserState;
    toggleChecklist: (item: string) => void;
}

const TabConcepts: React.FC<Props> = ({ user, toggleChecklist }) => {
  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'mail': return <Mail className="text-blue-500" />;
      case 'message-square': return <MessageSquare className="text-green-500" />;
      case 'globe': return <Globe className="text-purple-500" />;
      case 'users': return <Users className="text-orange-500" />;
      default: return <AlertTriangle />;
    }
  };

  return (
    <div className="space-y-8 pb-10 w-full">
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-2 text-lg">📚</span>
          기본 개념 익히기
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONCEPTS.map((concept) => (
            <div key={concept.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-50 p-3 rounded-xl">
                  {getIcon(concept.icon)}
                </div>
                <div className="flex gap-1 flex-wrap justify-end">
                  {concept.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{concept.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">{concept.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-orange-50 rounded-2xl p-8 border border-orange-100">
        <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
            <AlertTriangle className="mr-2" size={24} />
            <span>이것만은 꼭! 의심 신호(Red Flags)</span>
            </h2>
            <p className="text-sm text-orange-700 mb-6">
            내가 자주 속거나 헷갈리는 의심 신호를 체크해두세요. 게임에서 집중적으로 연습할 수 있습니다.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
            {RED_FLAGS_CHECKLIST.map((flag, idx) => {
                const isChecked = user.checklist.includes(flag);
                return (
                <button
                    key={idx}
                    onClick={() => toggleChecklist(flag)}
                    className={`flex items-center p-4 rounded-xl text-left transition-all ${
                    isChecked 
                        ? 'bg-orange-200 text-orange-900 font-medium shadow-sm ring-1 ring-orange-300' 
                        : 'bg-white text-slate-600 border border-orange-200 hover:bg-orange-100'
                    }`}
                >
                    <div className={`shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                    isChecked ? 'border-orange-600 bg-orange-600' : 'border-slate-300'
                    }`}>
                    {isChecked && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <span className="text-sm">{flag}</span>
                </button>
                );
            })}
            </div>
        </div>
      </section>
    </div>
  );
};

export default TabConcepts;