import React, { useEffect, useState } from 'react';
import { generateSecurityGuidebook } from '../services/geminiService';
import { X, Loader, BookOpen } from 'lucide-react';

interface GuidebookModalProps {
  score: number;
  isOpen: boolean;
  onClose: () => void;
}

const GuidebookModal: React.FC<GuidebookModalProps> = ({ score, isOpen, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !content) {
      setLoading(true);
      const rank = score >= 150 ? '전설의 해커 방어자' : score >= 100 ? '숙련된 보안관' : '초보 경비원';
      generateSecurityGuidebook(score, rank)
        .then(text => setContent(text))
        .catch(() => setContent("가이드북을 불러오는데 실패했습니다."))
        .finally(() => setLoading(false));
    }
  }, [isOpen, score, content]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl border border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-indigo-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-indigo-600" /> 나만의 보안 가이드북
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900">
            <X />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow custom-scrollbar bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-slate-700">AI가 당신의 활동을 분석하여 요약집을 작성 중입니다...</p>
            </div>
          ) : (
            <div className="prose max-w-none">
                {content.split('\n').map((line, i) => (
                    <p key={i} className="text-slate-700 mb-2">{line}</p>
                ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl text-right">
            <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
                닫기
            </button>
        </div>
      </div>
    </div>
  );
};

export default GuidebookModal;