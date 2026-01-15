import React, { useState, useEffect } from 'react';
import { PenTool, Save, Check } from 'lucide-react';
import { getLogs, getStats, saveStats } from '../utils/storageUtils';
import { ExperimentLog } from '../types';

const Reflection: React.FC = () => {
  const [logs, setLogs] = useState<ExperimentLog[]>([]);
  const [reflectionText, setReflectionText] = useState('');
  const [keywordFeedback, setKeywordFeedback] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLogs(getLogs());
  }, []);

  const KEYWORDS = ['노이즈', '데이터', '검증', '과적합', '오차'];

  const handleSave = () => {
    if (reflectionText.length < 20) {
        alert("내용을 조금 더 구체적으로 적어주세요! (20자 이상)");
        return;
    }

    const foundKeywords = KEYWORDS.filter(k => reflectionText.includes(k));
    setKeywordFeedback(foundKeywords);

    const stats = getStats();
    stats.points += 30;
    saveStats(stats);
    setSaved(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PenTool className="w-5 h-5" /> 연구 노트 작성
            </h2>
            <p className="text-sm text-slate-500 mb-4">
                실험에서 배운 점을 정리해보세요. <br/>
                힌트 키워드: <span className="text-indigo-600 font-bold">{KEYWORDS.join(', ')}</span>
            </p>
            
            <textarea 
                className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50"
                placeholder="예: 데이터 양을 20개에서 100개로 늘렸더니 검증 오차가 줄어들었다. 노이즈가 많을 때는 복잡한 모델보다 단순한 모델이 더 좋다는 것을 알게 되었다."
                value={reflectionText}
                onChange={(e) => {
                    setReflectionText(e.target.value);
                    setSaved(false);
                }}
            />

            <div className="mt-4 flex justify-between items-center">
                <div className="text-xs text-slate-400">
                    {saved ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold">
                            <Check className="w-4 h-4" /> 저장됨 (+30P)
                        </span>
                    ) : '작성 후 저장하여 포인트를 받으세요.'}
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saved}
                    className={`px-5 py-2 rounded-lg font-bold flex items-center gap-2 ${
                        saved 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                    <Save className="w-4 h-4" /> 저장하기
                </button>
            </div>

            {saved && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                    <p className="text-green-800 font-bold mb-1">👏 훌륭합니다!</p>
                    <p className="text-green-700">
                        {keywordFeedback.length > 0 
                            ? `사용된 핵심 키워드: ${keywordFeedback.join(', ')}` 
                            : '다음에는 핵심 키워드를 더 많이 사용해보세요!'}
                    </p>
                </div>
            )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-3">🤔 생각해볼 문제</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>시험 기간에는 급식 잔반이 줄어들까요, 늘어날까요? 그 이유는?</li>
                <li>잔반량 예측 모델이 틀리는 경우는 언제일까요? (예: 갑자기 맛없는 메뉴 등장)</li>
                <li>우리 반의 잔반 데이터를 모으려면 어떤 표를 만들어야 할까요?</li>
            </ul>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
            <h3 className="font-bold text-slate-700 mb-4">📋 나의 실험 기록 (Log)</h3>
            {logs.length === 0 ? (
                <div className="text-center text-slate-400 py-10">
                    아직 기록된 실험이 없습니다.<br/>실험실에서 결과를 저장해보세요.
                </div>
            ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white p-3 rounded-lg border border-slate-200 text-sm shadow-sm">
                            <div className="flex justify-between mb-1">
                                <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${
                                    log.scenario === 'lunch' ? 'bg-orange-100 text-orange-700' : 
                                    log.scenario === 'icecream' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {log.scenario}
                                </span>
                                <span className="text-slate-400 text-xs">{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div className="font-bold text-slate-800">MAE 오차: {log.mae}</div>
                            <div className="text-slate-500 text-xs mt-1">{log.note}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reflection;