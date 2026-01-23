import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function Reflection() {
  const [reflection1, setReflection1] = useState('');
  const [reflection2, setReflection2] = useState('');
  
  // Checks
  const [checks, setChecks] = useState([false, false, false]);

  const handleSave = () => {
    if(reflection1 && reflection2 && checks.every(c => c)) {
        alert("저장되었습니다! (시뮬레이션 기능)");
        // In real app, call prop to save to local storage
    } else {
        alert("모든 내용을 작성하고 체크리스트를 확인해주세요.");
    }
  };

  return (
    <div className="pb-20 space-y-8">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2">생각해볼 문제 🤔</h2>
        <p className="opacity-90">단순한 지식을 넘어 나만의 기준을 세워봅시다.</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">1. 조건 바꾸기</h3>
        <p className="text-sm text-gray-600 mb-3">만약 수행평가 파일이 '국가 기밀' 수준으로 중요하다면, 전송 속도가 느려지더라도 어떤 선택을 해야 할까요?</p>
        <textarea 
            value={reflection1}
            onChange={(e) => setReflection1(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-lg text-sm border border-gray-200 outline-none focus:border-indigo-500"
            rows={3}
            placeholder="내 생각 적기..."
        />
      </div>

      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">2. 우리 반 파일 공유 규칙 설계</h3>
        <p className="text-sm text-gray-600 mb-3">단톡방에 사진/파일을 올릴 때 지켜야 할 규칙 3가지를 정해보세요. (압축/암호화 기준 포함)</p>
        <textarea 
             value={reflection2}
             onChange={(e) => setReflection2(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-lg text-sm border border-gray-200 outline-none focus:border-indigo-500"
            rows={4}
            placeholder="1. 개인정보가 있으면 반드시... 2. 10MB 이상 파일은..."
        />
      </div>

      <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-4">자기 체크 (Rubric)</h3>
        <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={checks[0]} onChange={() => setChecks([!checks[0], checks[1], checks[2]])} className="w-5 h-5 accent-indigo-600 rounded" />
                <span className="text-sm text-gray-700">상황의 목표(보안/속도)를 정확히 언급했나요?</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={checks[1]} onChange={() => setChecks([checks[0], !checks[1], checks[2]])} className="w-5 h-5 accent-indigo-600 rounded" />
                <span className="text-sm text-gray-700">압축과 암호화의 용어 차이를 구분했나요?</span>
            </label>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={checks[2]} onChange={() => setChecks([checks[0], checks[1], !checks[2]])} className="w-5 h-5 accent-indigo-600 rounded" />
                <span className="text-sm text-gray-700">나의 주장에 대한 근거가 논리적인가요?</span>
            </label>
        </div>
      </div>

      <button onClick={handleSave} className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl shadow-lg flex justify-center items-center gap-2">
        <Save className="w-5 h-5" /> 저장하고 완료하기
      </button>
    </div>
  );
}