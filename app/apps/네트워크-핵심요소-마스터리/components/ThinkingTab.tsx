import React, { useState } from 'react';
import { UserState } from '../types';

interface Props {
  userState: UserState;
}

const ThinkingTab: React.FC<Props> = ({ userState }) => {
  const [inputs, setInputs] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);

  const prompts = [
    {
      title: '🔄 조건 바꾸기',
      desc: '만약 우리 학교에 무선 공유기가 하나도 없다면 어떤 일이 벌어질까요?',
      hint: '이동 수업, 스마트폰 사용, 배선 문제 등을 고려해보세요.'
    },
    {
      title: '⚖️ 반례 찾기',
      desc: '"네트워크 속도는 빠를수록 무조건 좋다"는 말에 반대되는 상황이 있을까요?',
      hint: '비용 문제, 보안 장비로 인한 속도 저하 필요성, 안정성 vs 속도 등을 생각해보세요.'
    },
    {
      title: '🛠️ 적용 설계하기',
      desc: '동아리실에 컴퓨터 4대와 프린터 1대를 설치하려고 합니다. 어떤 장비가 필요할까요?',
      hint: '인터넷 연결을 위한 공유기, 기기 연결을 위한 스위치, 케이블 등을 나열해보세요.'
    }
  ];

  const handleSave = () => {
    // Logic to save to local storage or just mimic saving for UI feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">🤔 깊게 생각하기</h2>
        <p className="text-slate-500">정답은 없습니다. 나만의 논리를 펼쳐보세요.</p>
      </div>

      <div className="grid gap-6">
        {prompts.map((p, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-xl text-2xl">{p.title.split(' ')[0]}</div>
                <div>
                    <h3 className="font-bold text-lg text-slate-800">{p.title.split(' ').slice(1).join(' ')}</h3>
                    <p className="text-slate-600 mt-1">{p.desc}</p>
                </div>
            </div>
            
            <textarea
                value={inputs[idx]}
                onChange={(e) => {
                    const newInputs = [...inputs];
                    newInputs[idx] = e.target.value;
                    setInputs(newInputs);
                }}
                className="w-full h-32 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-colors resize-none"
                placeholder="여기에 생각을 적어주세요..."
            />
            
            <div className="mt-3 flex justify-between items-center">
                <details className="text-sm">
                    <summary className="text-blue-500 cursor-pointer font-medium hover:text-blue-600 select-none">💡 힌트 보기</summary>
                    <p className="mt-2 text-slate-500 bg-slate-50 p-2 rounded">{p.hint}</p>
                </details>
                <span className={`text-xs ${inputs[idx].length > 50 ? 'text-green-500' : 'text-slate-400'}`}>
                    {inputs[idx].length}자 작성됨 (권장: 50자 이상)
                </span>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 right-6 md:static md:flex md:justify-center">
        <button 
            onClick={handleSave}
            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all transform flex items-center gap-2
                ${saved ? 'bg-green-500 text-white scale-105' : 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-1'}
            `}
        >
            {saved ? '✅ 저장 완료!' : '💾 내 생각 저장하기'}
        </button>
      </div>
    </div>
  );
};

export default ThinkingTab;
