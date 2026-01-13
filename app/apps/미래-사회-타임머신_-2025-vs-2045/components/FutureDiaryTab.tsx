import React, { useState, useEffect } from 'react';
import { analyzeFutureDiary } from '../services/geminiService';
import { DiaryEntry } from '../types';
import { Save, Bot, Clock, Trash2 } from 'lucide-react';

const FutureDiaryTab: React.FC = () => {
  const [diaryText, setDiaryText] = useState('');
  const [savedDiaries, setSavedDiaries] = useState<DiaryEntry[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'capsule'>('write');

  useEffect(() => {
    const saved = localStorage.getItem('future_diaries');
    if (saved) {
      setSavedDiaries(JSON.parse(saved));
    }
  }, []);

  const handleSave = async () => {
    if (!diaryText.trim()) return;

    setIsAnalyzing(true);
    // Get AI Feedback
    const feedback = await analyzeFutureDiary(diaryText);
    
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      content: diaryText,
      aiFeedback: feedback
    };

    const updated = [newEntry, ...savedDiaries];
    setSavedDiaries(updated);
    localStorage.setItem('future_diaries', JSON.stringify(updated));
    setDiaryText('');
    setIsAnalyzing(false);
    setActiveTab('capsule');
  };

  const deleteDiary = (id: string) => {
    const updated = savedDiaries.filter(d => d.id !== id);
    setSavedDiaries(updated);
    localStorage.setItem('future_diaries', JSON.stringify(updated));
  };

  return (
    <div className="pb-20">
      <div className="flex space-x-2 mb-6 bg-slate-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('write')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'write' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          일기 쓰기
        </button>
        <button
          onClick={() => setActiveTab('capsule')}
          className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'capsule' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          타임캡슐 ({savedDiaries.length})
        </button>
      </div>

      {activeTab === 'write' ? (
        <div className="space-y-4">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold text-white mb-2">2045년, 나의 하루는?</h3>
            <p className="text-slate-400 text-sm mb-4">
              미래의 기술(자율주행, AI 비서, 우주 여행 등)을 활용해 하루를 보내는 모습을 상상해서 적어보세요.
            </p>
            <textarea
              value={diaryText}
              onChange={(e) => setDiaryText(e.target.value)}
              placeholder="예: 아침 7시, 스마트 침대가 내 수면 패턴을 분석해 상쾌하게 깨워주었다. 아침 식사는 3D 푸드 프린터가 내 영양 상태에 맞춰 준비해준..."
              className="w-full h-48 bg-slate-900 text-slate-100 p-4 rounded-lg border border-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isAnalyzing || !diaryText.trim()}
            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-white transition-all
              ${isAnalyzing || !diaryText.trim() ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.99]'}
            `}
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                미래학자 AI 분석 중...
              </>
            ) : (
              <>
                <Save size={20} /> 타임캡슐에 저장 및 AI 분석
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedDiaries.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>저장된 미래 일기가 없습니다.</p>
            </div>
          ) : (
            savedDiaries.map((entry) => (
              <div key={entry.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
                <div className="bg-slate-900/50 p-4 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-cyan-400 font-mono text-sm">{entry.date}의 기록</span>
                  <button onClick={() => deleteDiary(entry.id)} className="text-slate-500 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="p-4 text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {entry.content}
                </div>
                {entry.aiFeedback && (
                  <div className="bg-fuchsia-900/20 p-4 border-t border-slate-700 flex gap-3">
                    <Bot className="text-fuchsia-400 shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-xs text-fuchsia-300 font-bold mb-1">미래학자의 피드백</p>
                      <p className="text-sm text-slate-300">{entry.aiFeedback}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FutureDiaryTab;