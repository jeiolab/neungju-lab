import React, { useState, useEffect } from 'react';
import { DATA_ITEM_TEMPLATES } from '../constants';
import { WizardItemConfig, DataType } from '../types';
import { AlertCircle, ArrowRight, Save, RotateCcw, CheckCircle2 } from 'lucide-react';

interface Props {
  onComplete: (xp: number) => void;
}

const WizardTab: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [configs, setConfigs] = useState<WizardItemConfig[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('wizard_profileDesigns');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Just keep track of count or titles for simplicity in this view
      setSavedDesigns(parsed.map((d: any) => new Date(d.timestamp).toLocaleString()));
    }
  }, []);

  const handleTemplateToggle = (id: string) => {
    if (selectedTemplateIds.includes(id)) {
      setSelectedTemplateIds(prev => prev.filter(tid => tid !== id));
    } else {
      if (selectedTemplateIds.length >= 5) {
        alert("최대 5개 항목까지만 선택할 수 있습니다.");
        return;
      }
      setSelectedTemplateIds(prev => [...prev, id]);
    }
  };

  const startConfig = () => {
    if (selectedTemplateIds.length === 0) return;
    const initialConfigs: WizardItemConfig[] = selectedTemplateIds.map(id => {
      const tmpl = DATA_ITEM_TEMPLATES.find(t => t.id === id)!;
      return {
        templateId: id,
        label: tmpl.label,
        selectedType: tmpl.defaultType,
        varName: tmpl.id, // default snake_case suggestion
        value: '',
        isValid: false,
        feedback: ''
      };
    });
    setConfigs(initialConfigs);
    setStep(2);
  };

  const updateConfig = (index: number, field: keyof WizardItemConfig, value: string) => {
    const newConfigs = [...configs];
    const current = newConfigs[index];
    
    // Type assertion for value assignment
    if (field === 'selectedType') current.selectedType = value as DataType;
    else if (field === 'varName') current.varName = value;
    else if (field === 'value') current.value = value;

    // Validation Logic
    validateItem(current);
    
    setConfigs(newConfigs);
  };

  const validateItem = (item: WizardItemConfig) => {
    let isValid = true;
    let feedback = "";
    
    // Var Name Check
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(item.varName)) {
      isValid = false;
      feedback = "변수명은 영문자나 언더바(_)로 시작해야 합니다.";
    }

    // Value & Type Check
    if (item.value.trim() === "") {
      isValid = false;
    } else {
      const val = item.value.trim();
      
      // Common misconceptions
      if (item.selectedType === 'int') {
        if (val.includes('.') || val.includes('"') || val.includes("'")) {
          isValid = false;
          feedback = val.includes('.') ? "소수점이 있으면 float입니다." : "따옴표가 있으면 str입니다.";
        } else if (isNaN(Number(val))) {
          isValid = false;
          feedback = "정수 숫자를 입력해주세요.";
        }
      } else if (item.selectedType === 'float') {
        if (val.includes('"') || val.includes("'")) {
          isValid = false;
          feedback = "따옴표가 있으면 str입니다.";
        } else if (isNaN(Number(val))) {
          isValid = false;
          feedback = "숫자를 입력해주세요.";
        } else if (!val.includes('.')) {
          // Soft warning for int entered as float? Python handles `float(5)` as `5.0`.
          // But strict entry might be better. Let's allow but maybe warn in feedback
          feedback = "정수를 입력하면 .0이 붙어 실수로 저장됩니다.";
        }
      } else if (item.selectedType === 'bool') {
        if (!['True', 'False'].includes(val)) {
          isValid = false;
          feedback = "True 또는 False만 입력 가능합니다 (대소문자 구분).";
        }
      } else if (item.selectedType === 'str') {
        // Python requires quotes in code, but typically inputs in forms are raw values.
        // However, to teach "strings need quotes", let's force users to type quotes OR 
        // we handle it. The prompt implies detecting misconceptions like "90" is int.
        // Let's expect users to type raw values, but if they type a number without quotes and call it str,
        // we accept it but maybe add a note: "숫자도 따옴표로 감싸면 문자가 됩니다."
        
        // Misconception: If they type `True` (no quotes) and call it str.
        if (val === 'True' || val === 'False') {
             feedback = "따옴표 없는 True/False는 bool입니다. 문자로 쓰려면 따옴표가 필요합니다.";
             // We can allow it but the generator will wrap it in quotes.
        }
      }
    }

    item.isValid = isValid;
    item.feedback = feedback;
  };

  const generateCode = () => {
    const allValid = configs.every(c => c.isValid);
    if (!allValid) {
      alert("모든 항목의 오류를 수정해주세요.");
      return;
    }

    const codeLines = configs.map(c => {
      let valDisplay = c.value;
      if (c.selectedType === 'str') {
        // If user didn't add quotes, we add them for the code
        if (!valDisplay.startsWith('"') && !valDisplay.startsWith("'")) {
             valDisplay = `"${valDisplay}"`;
        }
      }
      return `${c.varName} = ${valDisplay}  # type: ${c.selectedType}`;
    });

    codeLines.push("\n# 데이터 타입 확인하기");
    codeLines.push(`print(${configs.map(c => `type(${c.varName})`).join(', ')})`);

    const finalCode = codeLines.join('\n');
    
    // Save
    const design: any = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      items: configs,
      code: finalCode
    };

    const stored = localStorage.getItem('wizard_profileDesigns');
    let designs = stored ? JSON.parse(stored) : [];
    designs.unshift(design);
    if (designs.length > 5) designs.pop();
    localStorage.setItem('wizard_profileDesigns', JSON.stringify(designs));
    
    setSavedDesigns(designs.map((d: any) => new Date(d.timestamp).toLocaleString()));
    onComplete(50); // Give 50 XP
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setSelectedTemplateIds([]);
    setConfigs([]);
  };

  return (
    <div className="space-y-6">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-500 font-medium">
        <span className={step >= 1 ? "text-indigo-600 font-bold" : ""}>1. 항목 선택</span>
        <ArrowRight className="w-4 h-4" />
        <span className={step >= 2 ? "text-indigo-600 font-bold" : ""}>2. 설계 & 설정</span>
        <ArrowRight className="w-4 h-4" />
        <span className={step >= 3 ? "text-indigo-600 font-bold" : ""}>3. 코드 생성</span>
      </div>

      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">어떤 데이터를 저장할까요?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {DATA_ITEM_TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => handleTemplateToggle(t.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedTemplateIds.includes(t.id)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-bold">{t.label}</div>
                <div className={`text-xs mt-1 ${selectedTemplateIds.includes(t.id) ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {t.description}
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={startConfig}
              disabled={selectedTemplateIds.length === 0}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음 단계로
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-800">자료형과 변수명 정하기</h2>
          <div className="space-y-4 mb-8">
            {configs.map((config, idx) => (
              <div key={config.templateId} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="md:w-1/4">
                  <div className="font-bold text-slate-700">{config.label}</div>
                  <div className="text-xs text-slate-400">추천: {DATA_ITEM_TEMPLATES.find(t=>t.id===config.templateId)?.defaultType}</div>
                </div>
                
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Variable Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">변수명 (영어)</label>
                    <input 
                      type="text" 
                      value={config.varName} 
                      onChange={(e) => updateConfig(idx, 'varName', e.target.value)}
                      className="w-full p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Type Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">자료형</label>
                    <select
                      value={config.selectedType}
                      onChange={(e) => updateConfig(idx, 'selectedType', e.target.value)}
                      className="w-full p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      <option value="int">int (정수)</option>
                      <option value="float">float (실수)</option>
                      <option value="str">str (문자)</option>
                      <option value="bool">bool (참/거짓)</option>
                    </select>
                  </div>

                  {/* Value Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">값 입력 (예시)</label>
                    <input 
                      type="text" 
                      value={config.value} 
                      onChange={(e) => updateConfig(idx, 'value', e.target.value)}
                      placeholder="값을 입력하세요"
                      className={`w-full p-2 border rounded font-mono text-sm focus:ring-2 outline-none ${
                        !config.isValid && config.value ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'focus:ring-indigo-500'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Global Feedback Area */}
          <div className="space-y-2 mb-6">
            {configs.map((c, i) => c.value && !c.isValid && (
               <div key={i} className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                 <AlertCircle className="w-4 h-4" />
                 <span className="font-bold">[{c.label}]</span> {c.feedback || "입력값을 확인해주세요."}
               </div>
            ))}
             {configs.map((c, i) => c.value && c.isValid && c.feedback && (
               <div key={i} className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded">
                 <AlertCircle className="w-4 h-4" />
                 <span className="font-bold">[{c.label}]</span> {c.feedback}
               </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-medium">
              뒤로가기
            </button>
            <button
              onClick={generateCode}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition-colors"
            >
              설계 완료 및 코드 생성
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
           <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
             <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
             </div>
             <div>
               <h3 className="font-bold text-green-800">설계가 저장되었습니다! (+50 XP)</h3>
               <p className="text-green-700 text-sm">아래 코드를 복사해서 파이썬 에디터에 붙여넣어 보세요.</p>
             </div>
           </div>

           <div className="bg-slate-900 rounded-xl p-6 shadow-xl mb-6 relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <span className="ml-2 text-xs text-slate-400">main.py</span>
             </div>
             <pre className="font-mono text-green-400 pt-6 overflow-x-auto text-sm leading-relaxed">
               {JSON.parse(localStorage.getItem('wizard_profileDesigns') || '[]')[0]?.code}
             </pre>
           </div>

           <div className="flex justify-center">
             <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition-colors">
               <RotateCcw className="w-4 h-4" />
               새로운 카드 만들기
             </button>
           </div>
           
           <div className="mt-8 pt-6 border-t border-slate-200">
             <h4 className="font-bold text-slate-500 mb-2 flex items-center gap-2">
                <Save className="w-4 h-4" /> 최근 저장된 설계 목록
             </h4>
             <ul className="text-sm text-slate-600 list-disc list-inside">
               {savedDesigns.map((d, i) => (
                 <li key={i}>{d}</li>
               ))}
             </ul>
           </div>
        </div>
      )}
    </div>
  );
};

export default WizardTab;