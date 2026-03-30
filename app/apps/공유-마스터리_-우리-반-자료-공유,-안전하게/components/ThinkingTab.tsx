import React, { useState } from 'react';
import { AlertTriangle, Send, Lock } from 'lucide-react';

// 간단한 개인정보 감지 정규식 (교육용 데모)
const PII_REGEX = {
  phone: /010-\d{4}-\d{4}/,
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  idLike: /id:|pw:|password:/i
};

const PROMPTS = [
  {
    type: '조건 바꾸기',
    title: '만약 우리 학교 와이파이가 고장 난다면?',
    desc: '수행평가 제출 10분 전인데 인터넷이 끊겼어. 친구들과 파일을 어떻게 공유할지 대안을 설계해봐.'
  },
  {
    type: '반례 찾기',
    title: '"비밀번호만 걸면 안전하다"는 틀렸어!',
    desc: '비밀번호가 있어도 위험할 수 있는 상황을 구체적인 예시로 들어 설명해봐.'
  },
  {
    type: '적용 설계',
    title: '우리 반 공유 규칙 만들기',
    desc: '모두가 안전하게 자료를 공유하기 위한 학급 규칙 3가지를 제안해봐.'
  }
];

const ThinkingTab: React.FC = () => {
  const [activePrompt, setActivePrompt] = useState(0);
  const [inputText, setInputText] = useState('');
  const [piiWarning, setPiiWarning] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const checkPII = (text: string) => {
    if (PII_REGEX.phone.test(text)) return '전화번호가 감지되었습니다. 지워주세요!';
    if (PII_REGEX.email.test(text)) return '이메일 주소가 감지되었습니다.';
    if (PII_REGEX.idLike.test(text)) return '계정 정보가 포함된 것 같아요.';
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputText(val);
    setPiiWarning(checkPII(val));
    setSaved(false);
  };

  const handleSave = () => {
    if (piiWarning || inputText.trim().length < 10) return;
    
    // 실제 저장은 로컬스토리지에 하지만 여기선 UI 피드백만
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PROMPTS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setActivePrompt(idx); setInputText(''); setPiiWarning(null); }}
            className={`p-4 rounded-xl border text-left transition ${activePrompt === idx ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
          >
            <div className="text-xs font-bold opacity-70 mb-1">{p.type}</div>
            <div className="font-bold leading-tight">{p.title}</div>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">{PROMPTS[activePrompt].title}</h3>
        <p className="text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">{PROMPTS[activePrompt].desc}</p>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={handleChange}
            placeholder="자유롭게 생각을 적어보세요. (개인정보 입력 금지)"
            className={`w-full h-40 p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 ${piiWarning ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-200'}`}
          />
          {piiWarning && (
            <div className="absolute bottom-4 left-4 text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded">
              <AlertTriangle size={12} /> {piiWarning} 저장할 수 없습니다.
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-slate-400 flex items-center gap-1">
             <Lock size={12} /> 입력한 내용은 내 기기에만 저장돼. (서버 전송 X)
          </div>
          <button
            disabled={!!piiWarning || inputText.trim().length < 10}
            onClick={handleSave}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-bold disabled:opacity-50 hover:bg-slate-900 transition flex items-center gap-2"
          >
            {saved ? '저장됨!' : '나의 생각 저장'} <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThinkingTab;