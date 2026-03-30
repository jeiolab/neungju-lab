import React, { useState } from 'react';
import { X, Plus, Trash2, Map, Loader2 } from 'lucide-react';
import { analyzeDailyActivities } from '../services/geminiService';
import { DailyActivity } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const DailyMissionModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [activities, setActivities] = useState<string[]>(["", "", ""]);
  const [results, setResults] = useState<DailyActivity[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (index: number, value: string) => {
    const newActivities = [...activities];
    newActivities[index] = value;
    setActivities(newActivities);
  };

  const handleAnalyze = async () => {
    const validActivities = activities.filter(a => a.trim().length > 0);
    if (validActivities.length === 0) return;

    setIsLoading(true);
    try {
      const data = await analyzeDailyActivities(validActivities);
      setResults(data);
      onComplete(); // Trigger badge logic
    } catch (e) {
      alert("분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 bg-indigo-600 flex justify-between items-center text-white shrink-0">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Map size={20} /> 내 하루 네트워크 지도
          </h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!results ? (
            <>
              <p className="text-slate-600 mb-4 text-sm">
                오늘 하루, 어떤 통신 기기를 사용했나요?<br/>
                3가지를 적으면 AI가 네트워크 종류를 분석해줍니다!
              </p>
              <div className="space-y-3 mb-6">
                {activities.map((act, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={act}
                    onChange={(e) => handleInputChange(idx, e.target.value)}
                    placeholder={`예: 친구에게 카톡 보내기, 버스 카드 찍기...`}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                  />
                ))}
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || activities.every(a => !a.trim())}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:bg-slate-300 flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : '분석 시작하기'}
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800">분석 결과</h4>
              {results.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-slate-800">{item.activity}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded text-white
                      ${item.classification === 'PAN' ? 'bg-blue-500' : 
                        item.classification === 'LAN' ? 'bg-green-500' : 
                        item.classification === 'MAN' ? 'bg-orange-500' : 'bg-purple-500'}`}
                    >
                      {item.classification}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{item.reason}</p>
                </div>
              ))}
              <button
                onClick={() => { setResults(null); setActivities(["", "", ""]); }}
                className="w-full border border-slate-300 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-50 mt-4"
              >
                다른 활동 입력하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyMissionModal;