import React, { useState } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Save } from 'lucide-react';

const TabDiscussion: React.FC = () => {
  const [opinion, setOpinion] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!opinion.trim()) return;
    setSaved(true);
    // In a real app, this would save to a database
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-800 text-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
            <MessageCircle className="mr-3" />
            생각해볼 문제: 딥페이크의 양면성
        </h2>
        <p className="text-indigo-100 leading-relaxed text-lg">
            "생성형 AI 기술의 발전으로 만들어진 딥페이크(Deepfake) 기술. 
            영화 제작비 절감이라는 혁신적인 도구일까요, 아니면 민주주의를 위협하는 가짜 뉴스의 원흉일까요?"
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm">
            <div className="flex items-center mb-4 text-blue-700 font-bold text-lg">
                <ThumbsUp className="mr-2" size={20} /> 긍정적 측면 (혁신)
            </div>
            <ul className="space-y-3 text-gray-600 text-sm">
                <li>• <strong>영화/엔터테인먼트:</strong> 돌아가신 배우 복원, 젊은 시절 재현 등 표현의 한계 극복.</li>
                <li>• <strong>개인화 콘텐츠:</strong> 교육 자료나 마케팅 영상에서 다국어 립싱크 자동 생성.</li>
                <li>• <strong>의료/치료:</strong> 목소리를 잃은 환자에게 본인의 목소리 복원 제공.</li>
            </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border-l-4 border-red-500 shadow-sm">
            <div className="flex items-center mb-4 text-red-700 font-bold text-lg">
                <ThumbsDown className="mr-2" size={20} /> 부정적 측면 (위협)
            </div>
            <ul className="space-y-3 text-gray-600 text-sm">
                <li>• <strong>가짜 뉴스:</strong> 정치인의 발언 조작으로 사회적 혼란 야기.</li>
                <li>• <strong>금융 사기:</strong> 가족이나 지인의 목소리/얼굴을 모방한 피싱 범죄.</li>
                <li>• <strong>인권 침해:</strong> 유명인이나 일반인의 얼굴을 합성한 불법 음란물 제작.</li>
            </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <label className="block font-bold text-gray-900 mb-2">
            당신의 의견을 작성해보세요 (엔지니어 윤리 관점)
        </label>
        <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32 resize-none"
            placeholder="예: 기술 자체는 중립적이지만, 워터마크 표시 의무화 등 강력한 규제가 필요하다고 생각합니다..."
            value={opinion}
            onChange={(e) => {
                setOpinion(e.target.value);
                setSaved(false);
            }}
        />
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleSave}
                disabled={!opinion.trim() || saved}
                className={`flex items-center px-6 py-2 rounded-lg font-bold transition-all
                    ${saved ? 'bg-green-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'}
                `}
            >
                {saved ? '저장됨' : <><Save size={18} className="mr-2" /> 기록 저장</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default TabDiscussion;