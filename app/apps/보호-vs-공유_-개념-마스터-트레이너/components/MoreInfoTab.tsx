import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';

export const MoreInfoTab: React.FC = () => {
  const [checklist, setChecklist] = useState({
    c1: false,
    c2: false,
    c3: false,
    c4: false,
    c5: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allChecked = Object.values(checklist).every(Boolean);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Daily Summary */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-lg text-white">
        <h2 className="text-2xl font-bold mb-4">📢 오늘의 요약</h2>
        <div className="space-y-4 text-indigo-50">
          <p className="leading-relaxed">
            <span className="font-bold text-white bg-white/20 px-1 rounded">개인정보</span>는 나를 식별할 수 있는 모든 조각입니다. 단순히 숨기는 것(기밀성)뿐만 아니라, 필요할 때 쓸 수 있게(가용성) 하고, 변질되지 않게(무결성) 지키는 것이 진정한 보호입니다.
          </p>
          <p className="leading-relaxed">
            반면, <span className="font-bold text-white bg-white/20 px-1 rounded">공유</span>는 사회를 발전시키는 힘입니다. CCL을 확인하고 올바르게 공유한다면 우리는 더 큰 가치를 만들 수 있습니다.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">✅ 인터넷 이용 수칙 체크리스트</h3>
          {allChecked && <span className="text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded-full">완료!</span>}
        </div>
        
        <div className="space-y-3">
          {[
            { id: 'c1', text: 'SNS에 친구 사진 올리기 전 허락 받기' },
            { id: 'c2', text: '비밀번호에 생일, 전화번호 쓰지 않기' },
            { id: 'c3', text: '공용 PC 사용 후 반드시 로그아웃 하기' },
            { id: 'c4', text: '출처가 불분명한 링크 클릭하지 않기' },
            { id: 'c5', text: '무료 이미지는 저작권(CCL) 확인하고 쓰기' },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => toggleCheck(item.id as keyof typeof checklist)}
              className="flex items-center p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group"
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 transition-colors ${
                checklist[item.id as keyof typeof checklist] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400'
              }`}>
                {checklist[item.id as keyof typeof checklist] && <CheckSquare size={14} className="text-white" />}
              </div>
              <span className={`text-sm font-medium transition-colors ${
                checklist[item.id as keyof typeof checklist] ? 'text-slate-400 line-through' : 'text-slate-700'
              }`}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};