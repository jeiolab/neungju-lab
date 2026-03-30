import React, { useState } from 'react';
import { POSTER_RULES } from '../constants';
import { PosterRule } from '../types';
import { Download, Share2, MessageSquare, PlusCircle } from 'lucide-react';

const DiscussionTab: React.FC = () => {
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [customThoughts, setCustomThoughts] = useState({
    condition: "",
    counter: "",
    design: ""
  });

  const toggleRule = (id: string) => {
    if (selectedRules.includes(id)) {
      setSelectedRules(prev => prev.filter(r => r !== id));
    } else {
      if (selectedRules.length < 3) {
        setSelectedRules(prev => [...prev, id]);
      } else {
        alert("규칙은 최대 3개까지만 선택할 수 있어요!");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12 animate-fade-in pb-20">
      
      {/* Section 1: Discussion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-purple-600" /> 생각해볼 문제
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block font-bold text-slate-700 mb-2">Q1. 조건 바꾸기</label>
            <p className="text-sm text-slate-500 mb-3">우리 교실 공유기를 구석이 아닌 천장 중앙에 설치한다면 품질이 어떻게 변할까요?</p>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              rows={3}
              placeholder="내 생각을 적어보세요..."
              value={customThoughts.condition}
              onChange={(e) => setCustomThoughts({...customThoughts, condition: e.target.value})}
            />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <label className="block font-bold text-slate-700 mb-2">Q2. 반례 찾기</label>
            <p className="text-sm text-slate-500 mb-3">무선이 유선보다 더 편리하면서도, 품질(속도) 문제도 거의 없는 상황은 언제일까요?</p>
            <textarea 
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
              rows={3}
              placeholder="예: 집에서 혼자..."
              value={customThoughts.counter}
              onChange={(e) => setCustomThoughts({...customThoughts, counter: e.target.value})}
            />
          </div>
        </div>
      </section>

      {/* Section 2: Poster Generator */}
      <section className="bg-slate-900 text-white p-6 md:p-10 rounded-3xl shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">📢 우리 반 네트워크 규칙 만들기</h2>
          <p className="text-slate-400">규칙을 3개 선택하여 포스터를 만들어보세요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Selector */}
          <div className="space-y-3">
            {POSTER_RULES.map((rule) => (
              <button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 ${
                  selectedRules.includes(rule.id)
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedRules.includes(rule.id) ? 'border-white bg-white text-blue-600' : 'border-slate-500'
                }`}>
                  {selectedRules.includes(rule.id) && <PlusCircle className="w-4 h-4" />}
                </div>
                <span className="text-sm md:text-base font-medium">{rule.text}</span>
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-white text-slate-900 p-6 rounded-lg shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 min-h-[400px] flex flex-col items-center text-center border-4 border-slate-200">
            <div className="border-b-4 border-slate-900 w-full pb-4 mb-6">
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">Class Network Rules</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">우리 반 와이파이, 우리가 지켜요!</p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-6 w-full">
              {selectedRules.length === 0 ? (
                <p className="text-slate-400 italic">왼쪽에서 규칙을 선택해주세요.</p>
              ) : (
                selectedRules.map((id, index) => {
                  const rule = POSTER_RULES.find(r => r.id === id);
                  return (
                    <div key={id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                      <span className="block text-xs font-bold text-blue-600 mb-1">RULE {index + 1}</span>
                      <p className="font-bold text-lg leading-tight">{rule?.text}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="w-full mt-6 pt-4 border-t-2 border-slate-100 flex justify-between items-end">
              <div className="text-left">
                <p className="text-xs text-slate-400">Generated by</p>
                <p className="font-bold text-slate-900 text-sm">유선 vs 무선 결정 실험실</p>
              </div>
              <div className="h-12 w-12 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold">
                WIFI
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> 이미지 저장
          </button>
        </div>
      </section>
    </div>
  );
};

export default DiscussionTab;
