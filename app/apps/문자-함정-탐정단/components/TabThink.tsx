import React, { useState } from 'react';
import { Lightbulb, PenTool, Save } from 'lucide-react';

const TabThink: React.FC = () => {
  const [rules, setRules] = useState(['', '', '']);
  const [saved, setSaved] = useState(false);

  const questions = [
    {
      type: '조건 분석',
      title: '공식 번호인데 위험할 때?',
      content: '발신 번호가 114, 112 등 공식 번호로 찍혔는데 내용에 URL이 포함되어 있다면? 기술적으로 발신 번호 변조가 가능한지 생각해보자.'
    },
    {
      type: '반례 찾기',
      title: '모든 URL은 위험할까?',
      content: '친구가 보낸 유튜브 링크, 학교 선생님이 보낸 구글 폼 설문조사 등 안전한 링크와 위험한 링크를 구분하는 나만의 기준은?'
    },
    {
      type: '적용 설계',
      title: '우리 가족 보안관',
      content: '스마트폰 사용이 서툰 부모님이나 조부모님 폰에 깔아드려야 할 앱이나 설정(스팸 차단, 해외 발신 차단 등)은 무엇이 있을까?'
    }
  ];

  const handleRuleChange = (idx: number, val: string) => {
    const newRules = [...rules];
    newRules[idx] = val;
    setRules(newRules);
    setSaved(false);
  };

  const saveRules = () => {
    // Simply visual feedback for this MVP
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-10 space-y-8 max-w-3xl mx-auto">
       <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
            <Lightbulb className="mr-2 text-yellow-500" /> 생각해볼 문제
        </h2>
        <div className="grid gap-6">
            {questions.map((q, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 transition-hover hover:shadow-md">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4 inline-block tracking-wide">
                        {q.type}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{q.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-base">{q.content}</p>
                </div>
            ))}
        </div>
       </section>

       <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <PenTool className="mr-3" /> 내 행동 수칙 만들기
            </h2>
            <p className="text-slate-400 text-base mb-8">
                위의 문제들을 고민해보고, 내가 앞으로 지킬 3가지 철칙을 정해보세요.
            </p>
            <div className="space-y-4">
                {rules.map((rule, idx) => (
                    <div key={idx} className="flex items-center">
                        <span className="w-8 font-bold text-slate-500 text-lg">{idx + 1}.</span>
                        <input
                            type="text"
                            value={rule}
                            onChange={(e) => handleRuleChange(idx, e.target.value)}
                            placeholder={
                                idx === 0 ? "예: 문자에 있는 링크는 절대 누르지 않는다." :
                                idx === 1 ? "예: 돈 요구는 무조건 전화로 확인한다." :
                                "나만의 규칙 입력..."
                            }
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-base"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={saveRules}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 py-4 rounded-xl font-bold transition-colors flex justify-center items-center text-lg"
            >
                {saved ? '저장 완료!' : <><Save size={20} className="mr-2"/> 행동 수칙 저장하기</>}
            </button>
       </section>
    </div>
  );
};

export default TabThink;