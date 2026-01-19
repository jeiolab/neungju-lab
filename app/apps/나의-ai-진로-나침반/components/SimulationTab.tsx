import React, { useState } from 'react';
import { INTERESTS, TECHS, getJobResult } from '../constants';
import * as Icons from 'lucide-react';
import { JobResult } from '../types';

const SimulationTab: React.FC = () => {
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [result, setResult] = useState<JobResult | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInterestClick = (id: string) => {
    setSelectedInterest(id);
    setResult(null);
  };

  const handleTechClick = (id: string) => {
    setSelectedTech(id);
    setResult(null);
  };

  const handleCombine = () => {
    if (selectedInterest && selectedTech) {
      setIsAnimating(true);
      setTimeout(() => {
        const jobResult = getJobResult(selectedInterest, selectedTech);
        setResult(jobResult);
        setIsAnimating(false);
      }, 1000); // Fake processing delay
    }
  };

  const handleReset = () => {
    setSelectedInterest(null);
    setSelectedTech(null);
    setResult(null);
  };

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent className={className} /> : <Icons.Star className={className} />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800">디지털 융합 직업 만들기</h2>
        <p className="text-slate-500 mt-2">나의 흥미와 디지털 기술을 더하면 어떤 미래 직업이 탄생할까요?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Step 1: Interest */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
            <h3 className="font-bold text-lg text-slate-700">나의 관심 분야</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {INTERESTS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleInterestClick(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  selectedInterest === item.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {renderIcon(item.iconName, `w-5 h-5 ${selectedInterest === item.id ? 'text-blue-600' : 'text-slate-400'}`)}
                <span className={`text-sm font-medium ${selectedInterest === item.id ? 'text-blue-700' : 'text-slate-600'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Tech */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">2</span>
            <h3 className="font-bold text-lg text-slate-700">융합할 디지털 기술</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {TECHS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTechClick(item.id)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${
                  selectedTech === item.id
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {renderIcon(item.iconName, `w-5 h-5 ${selectedTech === item.id ? 'text-purple-600' : 'text-slate-400'}`)}
                <span className={`text-sm font-medium ${selectedTech === item.id ? 'text-purple-700' : 'text-slate-600'}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCombine}
          disabled={!selectedInterest || !selectedTech || isAnimating}
          className={`px-8 py-4 rounded-full text-lg font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 ${
            selectedInterest && selectedTech
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-200'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {isAnimating ? (
            <>
              <Icons.Loader2 className="w-5 h-5 animate-spin" />
              생성 중...
            </>
          ) : (
            <>
              <Icons.Wand2 className="w-5 h-5" />
              새로운 직업 만들기
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {result && (
        <div className="animate-fade-in-up transform transition-all">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-w-2xl mx-auto">
            {/* Card Header */}
            <div className="bg-slate-900 text-white p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.4),transparent_70%)]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-amber-400 rounded-2xl rotate-3 flex items-center justify-center mb-6 shadow-lg text-slate-900">
                  {renderIcon(result.iconName, "w-10 h-10")}
                </div>
                <h3 className="text-3xl font-serif font-bold mb-2 text-amber-400">{result.title}</h3>
                <div className="flex gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest mt-2">
                  <span>{INTERESTS.find(i => i.id === selectedInterest)?.label}</span>
                  <span>+</span>
                  <span>{TECHS.find(t => t.id === selectedTech)?.label}</span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8">
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-2">하는 일 (Job Description)</h4>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  {result.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">필요한 역량 (Required Skills)</h4>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">#나의_AI_진로_나침반</span>
                <button onClick={handleReset} className="text-sm text-blue-600 hover:underline">
                  다른 조합 해보기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationTab;