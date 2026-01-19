import React, { useState, useEffect } from 'react';
import { SimulationState } from '../types';
import { RefreshCcw, Info, ArrowRight } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [values, setValues] = useState<SimulationState>({
    repetitive: 3,
    ruleBased: 3,
    humanCare: 3,
    creative: 3,
  });

  const [result, setResult] = useState({ score: 0, type: '', advice: '' });

  const handleSliderChange = (key: keyof SimulationState, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Logic: 
    // High Repetitive & RuleBased -> Higher Automation Score
    // High HumanCare & Creative -> Lower Automation Score (Higher Human Score)
    // Formula: (Repetitive + RuleBased + (5 - HumanCare) + (5 - Creative)) / 20 * 100
    
    const autoScoreParts = values.repetitive + values.ruleBased; // Max 10
    const humanScoreParts = values.humanCare + values.creative; // Max 10
    
    // Invert human parts for replacement score calculation
    const replacementScoreRaw = (autoScoreParts + (10 - humanScoreParts)); 
    // Max Raw = 10 + 10 = 20. Min Raw = 0 + 0 = 0.
    
    const percentage = Math.round((replacementScoreRaw / 20) * 100);

    let type = '';
    let advice = '';

    if (percentage >= 70) {
      type = '자동화 가능성 높음';
      advice = '단순 반복 업무는 AI에게 맡기고, 관리자나 기획자로 역할을 확장해보세요.';
    } else if (percentage >= 30) {
      type = '협업(Augmentation) 필수';
      advice = '기술을 도구로 활용하여 생산성을 높이는 "디지털 협업 능력"이 핵심입니다.';
    } else {
      type = '인간 중심(Human Centric)';
      advice = '감정과 창의성이 중요한 영역입니다. 기술이 흉내 낼 수 없는 "휴먼 터치"를 강화하세요.';
    }

    setResult({ score: percentage, type, advice });
  }, [values]);

  const getSliderColor = (val: number) => {
    if (val <= 2) return 'accent-green-500';
    if (val <= 3) return 'accent-yellow-500';
    return 'accent-red-500';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900 mb-1">🎛️ 업무 특성 시뮬레이터</h2>
        <p className="text-sm text-indigo-700">
          내가 관심 있는 일의 특징을 슬라이더로 조절해보세요. 
          이 일은 미래에 어떻게 변할까요?
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sliders Section */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 border-b pb-2">업무 특성 설정 (0: 낮음 ~ 5: 높음)</h3>
          
          {[
            { key: 'repetitive', label: '반복성', desc: '매일 똑같은 동작이나 계산을 반복하나요?' },
            { key: 'ruleBased', label: '규칙성', desc: '매뉴얼이나 정해진 규칙대로만 하면 되나요?' },
            { key: 'humanCare', label: '대면·감정', desc: '사람을 직접 만나고 감정을 읽어야 하나요?' },
            { key: 'creative', label: '창의·판단', desc: '새로운 것을 만들거나 복합적인 판단이 필요한가요?' },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium text-gray-700">{item.label}</label>
                <span className="text-sm font-bold text-blue-600">{values[item.key as keyof SimulationState]}점</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={values[item.key as keyof SimulationState]}
                onChange={(e) => handleSliderChange(item.key as keyof SimulationState, parseInt(e.target.value))}
                className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${getSliderColor(values[item.key as keyof SimulationState])}`}
              />
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Result Section */}
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full filter blur-3xl opacity-20 -mr-10 -mt-10"></div>
          
          <div>
            <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-6">시뮬레이션 결과</h3>
            
            <div className="flex items-center justify-center mb-8">
               <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-700 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <circle 
                      className={`${result.score > 70 ? 'text-red-500' : result.score > 30 ? 'text-yellow-400' : 'text-green-500'} progress-ring__circle stroke-current transition-all duration-1000 ease-out`} 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 40}`} 
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{result.score}%</span>
                    <span className="text-[10px] text-gray-400">대체 가능성</span>
                  </div>
               </div>
            </div>

            <div className="text-center space-y-2 z-10 relative">
              <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm border border-white/20">
                {result.type}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 z-10">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed text-gray-200">
                {result.advice}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;