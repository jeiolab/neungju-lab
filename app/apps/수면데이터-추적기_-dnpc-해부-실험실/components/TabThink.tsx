import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { PenTool, Save } from 'lucide-react';

interface Props {
  userState: UserState;
  onSaveNotes: (notes: { condition: string; counter: string; design: string }) => void;
}

export const TabThink: React.FC<Props> = ({ userState, onSaveNotes }) => {
  const [notes, setNotes] = useState(userState.thinkNotes);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNotes(userState.thinkNotes);
  }, [userState.thinkNotes]);

  const handleChange = (key: keyof typeof notes, val: string) => {
    setNotes(prev => ({ ...prev, [key]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    onSaveNotes(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
                <PenTool /> 미래의 IoT 설계자에게
            </h2>
            <p className="text-indigo-100">
                단순히 지식을 아는 것을 넘어, 시스템을 비틀어보고 새로 설계해보는 사고 실험 단계입니다.
            </p>
        </div>

        {/* Q1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-3">🤔 조건 바꾸기</h3>
            <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg">
                만약 네트워크(전송) 기능이 고장난 상황에서, 스마트워치 단독으로 수면 코칭 서비스를 제공하려면 시스템을 어떻게 변경해야 할까요?
            </p>
            <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-700"
                placeholder="예: 스마트워치 내부에 저장 공간과 분석 프로세서를 탑재하여..."
                value={notes.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
            />
        </div>

        {/* Q2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-3">🧐 반례 찾기</h3>
            <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg">
                센서가 있어서 데이터를 수집하지만, 'IoT(사물인터넷)'라고 부르지 않는 물건의 예시를 하나 들고 그 이유를 써보세요.
            </p>
            <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-700"
                placeholder="예: 디지털 온도계. 이유는 네트워크에 연결되지 않고..."
                value={notes.counter}
                onChange={(e) => handleChange('counter', e.target.value)}
            />
        </div>

        {/* Q3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg text-slate-800 mb-3">🛠 적용 설계</h3>
            <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg">
                우리 교실의 '집중도 조명'을 만든다고 상상해봅시다. DNPC 단계별로 어떤 장치와 기술이 필요할까요?
            </p>
            <textarea 
                className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-700"
                placeholder="수집: 소음 센서 / 전송: Wi-Fi / 분석: 소음 레벨 판단 / 활용: 조명 색상 변경"
                value={notes.design}
                onChange={(e) => handleChange('design', e.target.value)}
            />
        </div>

        <div className="sticky bottom-6 flex justify-center">
            <button 
                onClick={handleSave}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
                <Save className="w-4 h-4" />
                {saved ? '저장되었습니다!' : '내 생각 저장하기'}
            </button>
        </div>
    </div>
  );
};