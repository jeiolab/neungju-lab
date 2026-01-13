import React from 'react';
import { INTERPRETATION_TEMPLATES } from '../constants';
import { Copy } from 'lucide-react';

export const TemplatesTab: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('템플릿이 복사되었습니다!');
  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <h3 className="font-bold text-indigo-800 mb-2">✍️ 좋은 해석을 위한 문장 패턴</h3>
        <p className="text-sm text-indigo-700">
          데이터를 보고 무엇을 써야 할지 막막한가요? 아래 템플릿을 활용해 빈칸을 채워보세요.
        </p>
      </div>

      <ul className="space-y-2">
        {INTERPRETATION_TEMPLATES.map((tpl, idx) => (
          <li key={idx} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center group shadow-sm">
            <span className="text-sm text-gray-700 flex-1 mr-2">{tpl}</span>
            <button 
              onClick={() => copyToClipboard(tpl)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              title="복사하기"
            >
              <Copy className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};