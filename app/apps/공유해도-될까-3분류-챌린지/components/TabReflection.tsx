import React, { useState, useEffect } from 'react';
import { maskPII, hasPII, saveReflection, loadReflections } from '../utils';
import { ReflectionEntry } from '../types';
import { Save, AlertTriangle, FileText, Check } from 'lucide-react';

interface Props {
    onScoreUpdate: (points: number) => void;
}

const TabReflection: React.FC<Props> = ({ onScoreUpdate }) => {
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('오늘 배운 점을 활용해 나만의 정보 보호 수칙을 만들어보세요.');
  const [history, setHistory] = useState<ReflectionEntry[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setHistory(loadReflections());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setText(newVal);
    setShowWarning(hasPII(newVal));
  };

  const handleSave = () => {
    if (!text.trim()) return;

    const safeText = maskPII(text);
    const newEntry: ReflectionEntry = {
      id: Date.now().toString(),
      topic,
      content: safeText,
      date: new Date().toLocaleDateString(),
    };

    saveReflection(newEntry);
    setHistory([newEntry, ...history]);
    setText('');
    setShowWarning(false);
    onScoreUpdate(30);
    alert('저장되었습니다! (개인정보는 자동 마스킹 처리됨)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            생각해볼 문제
          </h3>
          <div className="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">TOPIC</span>
            <p className="font-medium text-slate-800">{topic}</p>
          </div>

          <div className="relative">
            <textarea
              className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none resize-none transition-all"
              placeholder="자유롭게 작성하세요. 전화번호나 주민번호 등 개인정보는 자동으로 가려집니다."
              value={text}
              onChange={handleChange}
            />
            {showWarning && (
              <div className="absolute bottom-4 right-4 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                개인정보가 감지되었습니다. 저장 시 마스킹됩니다.
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              생각 저장하기
            </button>
          </div>
        </div>

        {/* Live Preview of Masking */}
        {text && (
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 opacity-70">
                <div className="text-xs font-bold text-slate-500 mb-2">저장 미리보기 (자동 마스킹 적용)</div>
                <div className="text-sm text-slate-600">{maskPII(text)}</div>
            </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="font-bold text-slate-700 px-1">나의 기록</h4>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {history.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-100">
                기록이 없습니다.
            </div>
          ) : (
            history.map((entry) => (
              <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                <div className="text-xs text-slate-400 mb-1">{entry.date}</div>
                <div className="text-sm font-medium text-slate-800 line-clamp-3">{entry.content}</div>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" /> 안전하게 저장됨
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TabReflection;
