import React, { useState, useEffect } from 'react';
import { REFLECTION_PROMPTS } from '../constants';
import { MessageSquare } from 'lucide-react';

export const ReflectionTab: React.FC = () => {
  const [reflection, setReflection] = useState('');
  const [saved, setSaved] = useState(false);
  
  // Load saved reflection for today from local state (simplified)
  useEffect(() => {
    const savedRef = localStorage.getItem(`vizdaily_reflection_${new Date().toDateString()}`);
    if (savedRef) setReflection(savedRef);
  }, []);

  const handleSave = () => {
    if (!reflection.trim()) return;
    localStorage.setItem(`vizdaily_reflection_${new Date().toDateString()}`, reflection);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
       <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <h3 className="font-bold text-purple-800 mb-1">🤔 한 걸음 더 들어가기</h3>
        <p className="text-sm text-purple-700">
          시각화는 만드는 것보다 비판적으로 바라보는 것이 더 중요합니다.
        </p>
      </div>

      <div className="space-y-4">
        {REFLECTION_PROMPTS.map((prompt, idx) => (
          <div key={idx} className="flex gap-3 items-start">
             <MessageSquare className="w-5 h-5 text-purple-400 mt-1 shrink-0" />
             <p className="text-sm text-gray-700 font-medium">{prompt}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <label className="block text-sm font-bold text-gray-800 mb-2">나만의 생각 정리하기</label>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="오늘 미션을 수행하며 들었던 의문이나 생각을 자유롭게 적어보세요."
          className="w-full h-32 p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
        />
        <button
          onClick={handleSave}
          className="mt-3 w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 transition-colors"
        >
          {saved ? '저장되었습니다!' : '생각 저장하기'}
        </button>
      </div>
    </div>
  );
};