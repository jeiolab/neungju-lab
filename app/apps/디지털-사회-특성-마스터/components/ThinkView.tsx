import React from 'react';
import { UserState } from '../types';
import { THINK_PROMPTS } from '../constants';
import { Save } from 'lucide-react';

interface ThinkViewProps {
  user: UserState;
  onSave: (id: string, text: string) => void;
}

const ThinkView: React.FC<ThinkViewProps> = ({ user, onSave }) => {
  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">깊게 생각하기</h2>
        <p className="text-indigo-100 text-sm">
          단순 암기가 아닌, 개념을 적용하고 비판적으로 생각해보는 시간입니다.
          작성된 내용은 브라우저에 자동 저장됩니다.
        </p>
      </div>

      {THINK_PROMPTS.map(prompt => (
        <div key={prompt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center mb-3">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded mr-2">
              {prompt.title}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">{prompt.desc}</h3>
          
          <textarea
            className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="나의 생각을 자유롭게 적어보세요..."
            value={user.essayAnswers[prompt.id] || ''}
            onChange={(e) => onSave(prompt.id, e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <span className="text-xs text-gray-400 flex items-center">
              <Save size={12} className="mr-1" /> 자동 저장됨
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThinkView;