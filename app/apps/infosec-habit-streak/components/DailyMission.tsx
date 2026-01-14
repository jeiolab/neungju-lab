import React, { useState } from 'react';
import { Mission } from '../types';
import { maskPII } from '../utils';
import { getReflectionFeedback } from '../services/geminiService';
import { CheckCircle, Lock, Share2, Info, Send } from 'lucide-react';

interface DailyMissionProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: (reflection: string) => void;
  savedReflection?: string;
}

export const DailyMission: React.FC<DailyMissionProps> = ({
  mission,
  isCompleted,
  onComplete,
  savedReflection
}) => {
  const [reflection, setReflection] = useState(savedReflection || '');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    setIsSubmitting(true);
    
    // Mask locally before "sending" (simulated) or using logic
    const masked = maskPII(reflection);
    
    // Get AI feedback
    const aiFeedback = await getReflectionFeedback(mission.title, masked);
    setFeedback(aiFeedback || null);
    
    onComplete(masked); // Save the masked version
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Concept Header */}
      <div className="bg-indigo-600 text-white p-4 rounded-xl shadow-lg flex items-start gap-3">
        <Info className="w-6 h-6 mt-1 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-lg mb-1">오늘의 개념: {mission.relatedConcept.title}</h3>
          <p className="text-indigo-100 text-sm">{mission.relatedConcept.description}</p>
        </div>
      </div>

      {/* Mission Card */}
      <div className="bg-white border-2 border-indigo-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
          DAILY MISSION
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          {isCompleted ? <CheckCircle className="text-green-500 w-8 h-8" /> : <div className="w-8 h-8 rounded-full border-2 border-gray-300" />}
          {mission.title}
        </h2>
        
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {mission.description}
        </p>

        {/* Action Area */}
        {!isCompleted ? (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              미션 수행 후 느낀 점이나 발견한 점을 한 줄로 기록하세요.
              <span className="text-xs text-gray-400 block mt-1">(개인정보는 자동으로 가려집니다)</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="예: 사용하지 않는 앱 3개를 삭제했어요."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
              <button
                onClick={handleSubmit}
                disabled={!reflection.trim() || isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? '확인 중...' : <><Send size={18} /> 완료</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium flex items-center gap-2">
              <CheckCircle size={18} /> 미션 완료!
            </p>
            <p className="text-gray-600 mt-2 text-sm italic">"{savedReflection}"</p>
            {feedback && (
              <div className="mt-3 text-indigo-600 text-sm font-semibold bg-white p-2 rounded border border-indigo-100">
                AI 코치: {feedback}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compare Card: Sharing vs Protection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 font-bold mb-3">
            <Share2 size={20} /> 공유의 가치
          </div>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><span className="font-semibold text-gray-800">개인:</span> {mission.sharingVsProtection.personal}</li>
            <li><span className="font-semibold text-gray-800">기업:</span> {mission.sharingVsProtection.corporate}</li>
            <li><span className="font-semibold text-gray-800">국가:</span> {mission.sharingVsProtection.national}</li>
          </ul>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 font-bold mb-3">
            <Lock size={20} /> 보호의 가치
          </div>
          <p className="text-sm text-gray-600 mb-2">
            무분별한 공유는 되돌릴 수 없는 피해를 줄 수 있습니다.
          </p>
          <div className="bg-red-50 p-3 rounded text-xs text-red-800">
             <strong>생각해보기:</strong>
             <ul className="list-disc ml-4 mt-1 space-y-1">
               {mission.thinkPrompts.map((prompt, idx) => (
                 <li key={idx}>{prompt}</li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
