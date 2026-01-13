import React, { useState, useEffect } from 'react';
import { caesarCipher } from '../utils/caesarUtils';
import { generateDailyMission } from '../services/geminiService';
import { Lock, Unlock, Star, RefreshCw } from 'lucide-react';

interface DailyMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

const DailyMission: React.FC<DailyMissionProps> = ({ onComplete, isCompleted }) => {
  const [missionData, setMissionData] = useState<{ encrypted: string; key: number; hint: string } | null>(null);
  const [userAttempt, setUserAttempt] = useState('');
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    // Check local storage for today's mission to avoid API spam and keep it "Daily"
    const today = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('mission_date');
    const savedData = localStorage.getItem('mission_data');

    const fetchMission = async () => {
        setLoading(true);
        const data = await generateDailyMission();
        setMissionData(data);
        localStorage.setItem('mission_date', today);
        localStorage.setItem('mission_data', JSON.stringify(data));
        setLoading(false);
    };

    if (savedDate === today && savedData) {
        setMissionData(JSON.parse(savedData));
        setLoading(false);
    } else {
        fetchMission();
    }
    
    if (isCompleted) setSolved(true);
  }, [isCompleted]);

  const checkAnswer = () => {
    if (!missionData) return;
    // Decrypting the mission encrypted text with the mission key
    const solution = caesarCipher(missionData.encrypted, missionData.key, true);
    
    // Normalize comparison (ignore spaces/case for leniency)
    const normalize = (s: string) => s.replace(/\s/g, '').toUpperCase();
    
    if (normalize(userAttempt) === normalize(solution)) {
        setSolved(true);
        onComplete();
    } else {
        alert("틀렸습니다! 다시 시도해보세요.");
    }
  };

  if (loading) return <div className="p-4 bg-slate-50 rounded-xl animate-pulse h-32"></div>;
  if (!missionData) return null;

  return (
    <div className={`p-6 rounded-2xl border transition-all ${solved ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Star className={solved ? "fill-amber-400 text-amber-400" : "text-slate-400"} />
            오늘의 암호 쪽지
        </h3>
        {solved && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">미션 완료!</span>}
      </div>

      {!solved ? (
        <div className="space-y-4">
            <div className="bg-slate-800 text-green-400 font-mono p-4 rounded-lg text-center tracking-widest text-lg">
                {missionData.encrypted}
            </div>
            
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                🕵️ 힌트: {missionData.hint} (Key를 찾아보세요!)
            </div>

            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={userAttempt}
                    onChange={(e) => setUserAttempt(e.target.value)}
                    placeholder="해독한 문장을 입력하세요"
                    className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-200 outline-none uppercase"
                />
                <button 
                    onClick={checkAnswer}
                    className="px-4 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700"
                >
                    확인
                </button>
            </div>
        </div>
      ) : (
        <div className="text-center py-4">
            <p className="text-amber-800 font-bold mb-2">축하합니다! 쪽지 해독 성공!</p>
            <p className="text-slate-600">내일 새로운 쪽지가 도착합니다.</p>
        </div>
      )}
    </div>
  );
};

export default DailyMission;
