import React, { useState } from 'react';
import { LicenseConfig } from '../types';
import { Check, X, DollarSign, RefreshCw, PenTool, Download } from 'lucide-react';

const LicenseWizard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [config, setConfig] = useState<LicenseConfig>({
    commercial: true,
    modification: 'yes'
  });

  const handleCommercial = (allowed: boolean) => {
    setConfig(prev => ({ ...prev, commercial: allowed }));
    setStep(2);
  };

  const handleModification = (type: 'yes' | 'no' | 'sa') => {
    setConfig(prev => ({ ...prev, modification: type }));
    setStep(3);
  };

  const reset = () => {
    setStep(1);
    setConfig({ commercial: true, modification: 'yes' });
  };

  const getResult = () => {
    let code = 'CC BY';
    const icons = ['BY'];

    if (!config.commercial) {
      code += '-NC';
      icons.push('NC');
    }

    if (config.modification === 'no') {
      code += '-ND';
      icons.push('ND');
    } else if (config.modification === 'sa') {
      code += '-SA';
      icons.push('SA');
    }

    return { code, icons };
  };

  const { code, icons } = getResult();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">나만의 라이선스 만들기</h2>
        <p className="text-slate-600">질문에 답하면 내 창작물에 딱 맞는 CCL을 만들어 드려요.</p>
      </div>

      {/* Progress */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-md">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-blue-600' : 'bg-slate-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
        </div>
      </div>

      {/* Wizard Steps */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 min-h-[400px] flex flex-col justify-center items-center text-center">
        
        {step === 1 && (
          <div className="animate-fade-in w-full">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Q1. 다른 사람이 내 작품으로 돈을 벌어도 되나요?</h3>
            <p className="text-slate-500 mb-8">예를 들어, 내 사진이 들어간 티셔츠를 만들어 팔거나, 광고가 달린 영상에 내 음악을 쓰는 경우입니다.</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => handleCommercial(true)} className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition w-40">
                <Check className="text-green-500" size={32} />
                <span className="font-bold">네, 허용합니다</span>
              </button>
              <button onClick={() => handleCommercial(false)} className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 transition w-40">
                <div className="relative">
                  <DollarSign className="text-slate-400" size={32} />
                  <X className="text-red-500 absolute top-0 left-0 w-full h-full opacity-60" size={32} />
                </div>
                <span className="font-bold">아니오 (비영리)</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in w-full">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Q2. 다른 사람이 내 작품을 변경해도 되나요?</h3>
            <p className="text-slate-500 mb-8">리믹스, 2차 창작, 편집 등을 허용할지 선택해주세요.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => handleModification('yes')} className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition w-40">
                <PenTool className="text-blue-500" size={32} />
                <span className="font-bold">네, 허용합니다</span>
              </button>
              <button onClick={() => handleModification('sa')} className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-yellow-500 hover:bg-yellow-50 transition w-40">
                <RefreshCw className="text-yellow-600" size={32} />
                <span className="font-bold">허용하되, 똑같은 조건으로 공유해야 함</span>
              </button>
              <button onClick={() => handleModification('no')} className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-slate-200 hover:border-red-500 hover:bg-red-50 transition w-40">
                <X className="text-red-500" size={32} />
                <span className="font-bold">아니오 (변경금지)</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in w-full">
             <h3 className="text-xl font-bold text-slate-500 mb-4">완성된 라이선스</h3>
             
             <div className="bg-slate-50 p-8 rounded-2xl border-2 border-slate-200 mb-6 flex flex-col items-center">
                <div className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">{code}</div>
                <div className="flex gap-4 mb-4">
                  {icons.includes('BY') && <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs" title="Attribution">BY</div>}
                  {icons.includes('NC') && <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs line-through decoration-white/50" title="Non-Commercial">$</div>}
                  {icons.includes('ND') && <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs" title="No-Derivatives">=</div>}
                  {icons.includes('SA') && <div className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs" title="Share-Alike">SA</div>}
                </div>
                <p className="text-slate-600 max-w-md mx-auto">
                  이 저작물은 <strong>{code}</strong> 조건에 따라 이용할 수 있습니다.<br/>
                  {!config.commercial ? '상업적 이용이 불가능하며, ' : '상업적 이용이 가능하며, '}
                  {config.modification === 'no' ? '내용 변경이 금지됩니다.' : 
                   config.modification === 'sa' ? '변경 시 동일한 라이선스를 적용해야 합니다.' : '자유롭게 변경 가능합니다.'}
                  <br/>(출처 표시는 필수!)
                </p>
             </div>

             <div className="flex gap-4 justify-center">
                <button 
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition"
                >
                  다시 만들기
                </button>
                <button 
                  onClick={() => alert('이미지 다운로드 기능이 가상으로 실행되었습니다! 실제 구현시 html2canvas 등을 사용합니다.')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition flex items-center gap-2"
                >
                  <Download size={20} />
                  이미지 저장
                </button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LicenseWizard;