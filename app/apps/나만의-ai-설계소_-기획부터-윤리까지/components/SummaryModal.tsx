import React from 'react';
import { X } from 'lucide-react';
import { TOPICS, MODELS } from '../types';

interface Props {
  onClose: () => void;
}

const SummaryModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"
        >
          <X size={20} />
        </button>
        
        <div className="p-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">AI 설계 총정리 노트</h2>
          
          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-indigo-600 mb-4 border-b pb-2">1. 주제별 추천 모델</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">분야</th>
                      <th className="px-6 py-3">목표</th>
                      <th className="px-6 py-3">추천 모델</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOPICS.map(t => (
                        <tr key={t.id} className="border-b">
                            <td className="px-6 py-4 font-medium text-slate-900">{t.name}</td>
                            <td className="px-6 py-4">{t.description}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${t.type === 'classification' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {MODELS.find(m => m.id === t.type)?.name}
                                </span>
                            </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-red-600 mb-4 border-b pb-2">2. 피해야 할 데이터 (편향성)</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        <li><strong>성별, 나이:</strong> 채용 시 능력과 무관한 차별 요소</li>
                        <li><strong>거주지:</strong> 금융 대출 시 지역 차별(Redlining) 우려</li>
                        <li><strong>인종:</strong> 안면 인식 및 범죄 예측에서의 심각한 오류 발생</li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-green-600 mb-4 border-b pb-2">3. 윤리적 AI 체크리스트</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        <li>데이터의 불균형은 없는가? (특정 그룹 데이터 부족)</li>
                        <li>결과를 설명할 수 있는가? (XAI)</li>
                        <li>사용자에게 결정에 대한 이의 제기권을 주었는가?</li>
                    </ul>
                </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;