import React, { useState } from 'react';
import { UserState } from '../types';
import { Shield, Save, Edit3 } from 'lucide-react';

interface TabLearnMoreProps {
  userState: UserState;
  onUpdateState: (newState: UserState) => void;
}

const CHECKLIST_ITEMS = [
  "나는 AI가 준 정보를 다른 사람에게 공유하기 전에 반드시 출처를 확인한다.",
  "나는 내 이름, 학교, 전화번호 등 개인정보를 AI 대화창에 입력하지 않는다.",
  "나는 AI의 답변이 편향될 수 있음을 항상 의심한다.",
  "나는 과제를 할 때 AI 결과물을 그대로 복사해서 제출하지 않는다.",
  "나는 AI가 나쁜 말이나 혐오 표현을 할 경우 신고하거나 사용을 중단한다."
];

const TabLearnMore: React.FC<TabLearnMoreProps> = ({ userState, onUpdateState }) => {
  const [checks, setChecks] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [editingRules, setEditingRules] = useState(false);
  const [tempRules, setTempRules] = useState<string[]>([...userState.safetyRules]);

  const handleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const getRiskAnalysis = () => {
    const checkedCount = checks.filter(Boolean).length;
    if (checkedCount === 5) return { level: '안전', color: 'text-green-600', msg: '훌륭해요! AI 시민 의식이 아주 높습니다.' };
    if (checkedCount >= 3) return { level: '보통', color: 'text-amber-600', msg: '잘하고 있지만, 조금 더 신중함이 필요해요.' };
    return { level: '취약', color: 'text-red-600', msg: '주의! AI 과의존이나 윤리적 위험에 노출될 수 있습니다.' };
  };

  const saveRules = () => {
    onUpdateState({
      ...userState,
      safetyRules: tempRules
    });
    setEditingRules(false);
  };

  return (
    <div className="space-y-8">
      {/* CHECKLIST SECTION */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Shield className="text-indigo-600" /> 윤리 체크리스트
        </h2>
        <div className="space-y-3 mb-6">
          {CHECKLIST_ITEMS.map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
              <input
                type="checkbox"
                checked={checks[idx]}
                onChange={() => handleCheck(idx)}
                className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
              />
              <span className="text-slate-700 leading-snug">{item}</span>
            </label>
          ))}
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200">
          <p className="text-sm text-slate-500 mb-1">진단 결과</p>
          <p className={`text-lg font-bold ${getRiskAnalysis().color}`}>
             {getRiskAnalysis().level} 단계
          </p>
          <p className="text-sm text-slate-600 mt-1">{getRiskAnalysis().msg}</p>
        </div>
      </section>

      {/* SAFETY RULES SECTION */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">나만의 AI 안전 수칙</h2>
          {!editingRules ? (
            <button onClick={() => setEditingRules(true)} className="text-slate-400 hover:text-indigo-600">
              <Edit3 size={20} />
            </button>
          ) : (
            <button onClick={saveRules} className="text-indigo-600 font-bold flex items-center gap-1">
              <Save size={18} /> 저장
            </button>
          )}
        </div>

        <div className="space-y-3">
          {tempRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-indigo-300 font-bold w-6">{idx + 1}.</span>
              {editingRules ? (
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => {
                    const newRules = [...tempRules];
                    newRules[idx] = e.target.value;
                    setTempRules(newRules);
                  }}
                  className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:border-indigo-500"
                  placeholder="여기에 수칙을 입력하세요..."
                />
              ) : (
                <p className={`flex-1 p-2 border-b border-slate-100 ${!rule ? 'text-slate-300 italic' : 'text-slate-700'}`}>
                  {rule || "(비어 있음)"}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabLearnMore;