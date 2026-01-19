import React, { useState } from 'react';
import { INTEREST_OPTIONS, TECH_OPTIONS, STYLE_OPTIONS } from '../constants';
import { generateFutureJob } from '../services/geminiService';
import { JobResult } from '../types';
import { Loader2, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TabMixerProps {
  onJobCreated: (job: JobResult) => void;
}

const TabMixer: React.FC<TabMixerProps> = ({ onJobCreated }) => {
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState<string>('');
  const [selectedTech, setSelectedTech] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JobResult | null>(null);

  const handleMix = async () => {
    setIsLoading(true);
    try {
      const interestLabel = INTEREST_OPTIONS.find(o => o.id === selectedInterest)?.label || selectedInterest;
      const techLabel = TECH_OPTIONS.find(o => o.id === selectedTech)?.label || selectedTech;
      const styleLabel = STYLE_OPTIONS.find(o => o.id === selectedStyle)?.label || selectedStyle;

      const jobData = await generateFutureJob(interestLabel, techLabel, styleLabel);
      
      const newJob: JobResult = {
        id: Date.now().toString(),
        createdAt: Date.now(),
        tags: {
          interest: interestLabel,
          tech: techLabel,
          style: styleLabel
        },
        ...jobData
      };

      setResult(newJob);
      onJobCreated(newJob);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert("직업 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMixer = () => {
    setStep(1);
    setSelectedInterest('');
    setSelectedTech('');
    setSelectedStyle('');
    setResult(null);
  };

  const StepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 w-12 rounded-full transition-colors ${step >= s ? 'bg-indigo-600' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-[600px]">
      {step < 4 && <StepIndicator />}

      {step === 1 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">어떤 분야에 관심이 있나요?</h2>
            <p className="text-slate-500 mt-2">가장 흥미로운 키워드를 하나 선택해주세요.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {INTEREST_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedInterest(opt.id)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 flex flex-col items-center gap-2 ${
                  selectedInterest === opt.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-white text-slate-600 hover:border-indigo-200'
                }`}
              >
                <span className="text-3xl">{opt.icon}</span>
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-8">
            <button
              disabled={!selectedInterest}
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              다음 단계
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">어떤 디지털 기술을 더해볼까요?</h2>
            <p className="text-slate-500 mt-2">관심 분야에 접목할 미래 기술을 선택하세요.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedTech(opt.id)}
                className={`p-4 rounded-xl border-2 transition-all hover:scale-105 flex flex-col items-center gap-2 ${
                  selectedTech === opt.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200'
                }`}
              >
                <span className="text-3xl">{opt.icon}</span>
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 px-4">이전</button>
            <button
              disabled={!selectedTech}
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
            >
              다음 단계
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-fade-in-up">
           <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">어떤 방식으로 일하고 싶나요?</h2>
            <p className="text-slate-500 mt-2">나의 업무 스타일을 골라주세요.</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {STYLE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedStyle(opt.id)}
                className={`p-6 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                  selectedStyle === opt.id
                    ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                    : 'border-slate-100 bg-white hover:border-purple-200'
                }`}
              >
                <span className="text-4xl">{opt.icon}</span>
                <div>
                  <h3 className={`font-bold text-lg ${selectedStyle === opt.id ? 'text-purple-700' : 'text-slate-800'}`}>{opt.label}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {opt.id === 'solo' ? '독립적인 공간에서 깊이 있는 연구나 창작을 선호합니다.' : 
                     opt.id === 'people' ? '팀워크를 중시하고 사람들과 대화하며 에너지를 얻습니다.' :
                     '책상에 앉아있기보다 현장을 누비며 활동적인 일을 선호합니다.'}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-800 px-4">이전</button>
            <button
              disabled={!selectedStyle || isLoading}
              onClick={handleMix}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isLoading ? '직업 생성 중...' : '미래 직업 믹스하기!'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && result && (
        <div className="animate-fade-in-up space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white text-center relative overflow-hidden">
               {/* Decorative circles */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
              
              <h3 className="text-indigo-100 font-medium tracking-widest uppercase text-sm mb-2">2035 New Career</h3>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{result.jobTitle}</h1>
              <div className="flex justify-center gap-2 text-sm opacity-90">
                <span className="bg-white/20 px-3 py-1 rounded-full">{result.tags.interest}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">+</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">{result.tags.tech}</span>
              </div>
            </div>
            
            <div className="p-8">
              <p className="text-lg text-slate-700 leading-relaxed mb-8 border-b border-slate-100 pb-6">
                {result.description}
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    인간 고유 역량 (Human Touch)
                  </h4>
                  <ul className="space-y-2">
                    {result.humanSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 bg-pink-50 px-3 py-2 rounded-lg text-sm">
                        <CheckCircle2 className="w-4 h-4 text-pink-500" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    디지털 기술 역량 (Tech Skill)
                  </h4>
                  <ul className="space-y-2">
                    {result.digitalSkills.map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-slate-600 bg-blue-50 px-3 py-2 rounded-lg text-sm">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-2">💡 AI와의 협업 포인트</h4>
                <p className="text-slate-700 italic">"{result.coexistenceNote}"</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={resetMixer}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 rounded-full text-slate-700 hover:bg-slate-50 font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              다시 하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabMixer;