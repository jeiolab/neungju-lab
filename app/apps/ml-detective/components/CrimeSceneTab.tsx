import React, { useState, useEffect } from 'react';
import { CaseFile, CaseAttributes, DetectiveRank, UserStats } from '../types';
import { TEXTBOOK_CASES, getRank } from '../constants';
import { generateDailyMystery } from '../services/geminiService';
import { FileText, CheckSquare, Microscope, AlertTriangle, Play, RefreshCw, Briefcase } from 'lucide-react';

interface Props {
  userStats: UserStats;
  updateStats: (newStats: UserStats) => void;
}

const CrimeSceneTab: React.FC<Props> = ({ userStats, updateStats }) => {
  const [activeCase, setActiveCase] = useState<CaseFile | null>(null);
  const [checklist, setChecklist] = useState<CaseAttributes>({
    hasBigData: false,
    hasPattern: false,
    isCreativeOrRandom: false
  });
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialize with a random textbook case if none active
  useEffect(() => {
    if (!activeCase) {
      loadRandomCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRandomCase = () => {
    const random = TEXTBOOK_CASES[Math.floor(Math.random() * TEXTBOOK_CASES.length)];
    resetState(random);
  };

  const loadDailyMystery = async () => {
    setLoading(true);
    setFeedback({ message: "본부에서 새로운 암호화 문서를 해독 중이네...", type: 'info' });
    const newCase = await generateDailyMystery();
    setLoading(false);
    if (newCase) {
      resetState(newCase);
    } else {
      setFeedback({ message: "통신 보안 문제로 일일 의뢰를 가져오지 못했네. 잠시 후 다시 시도하게.", type: 'error' });
    }
  };

  const resetState = (newCase: CaseFile) => {
    setActiveCase(newCase);
    setChecklist({ hasBigData: false, hasPattern: false, isCreativeOrRandom: false });
    setFeedback(null);
  };

  const handleChecklistChange = (key: keyof CaseAttributes) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitInvestigation = (verdictSolvable: boolean) => {
    if (!activeCase) return;

    // Check if checklist matches logical deduction (optional strict mode logic, currently advisory)
    // For this game, we mainly check the final verdict, but we can give bonus for checklist accuracy.
    
    const isVerdictCorrect = verdictSolvable === activeCase.isSolvable;
    
    let points = 0;
    let newSolvedCount = userStats.solvedCount;
    let newStreak = userStats.consecutiveWins;
    let newMessage = "";
    let msgType: 'success' | 'error' = 'error';

    if (isVerdictCorrect) {
      points = 10;
      newSolvedCount += 1;
      newStreak += 1;
      newMessage = `훌륭하군! 자네의 추리가 완벽해. ${activeCase.explanation}`;
      msgType = 'success';
      
      // Bonus logic: Check if attributes were also identified correctly
      /* 
       * Simple comparison logic could be added here for extra points
       */

    } else {
      newStreak = 0;
      newMessage = `틀렸네. 다시 보게. ${activeCase.explanation}`;
      msgType = 'error';
    }

    const newScore = userStats.score + points;
    
    updateStats({
      ...userStats,
      score: newScore,
      solvedCount: newSolvedCount,
      consecutiveWins: newStreak,
      rank: getRank(newScore),
      history: [
        {
          caseId: activeCase.id,
          caseTitle: activeCase.title,
          userVerdict: verdictSolvable,
          isCorrect: isVerdictCorrect,
          timestamp: Date.now()
        },
        ...userStats.history
      ]
    });

    setFeedback({ message: newMessage, type: msgType });
  };

  if (!activeCase) return <div className="p-10 text-center">사건 파일을 불러오는 중...</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Case Header */}
      <div className="bg-sepia-100 text-ink p-6 rounded-t-lg border-b-4 border-sepia-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Briefcase size={120} />
        </div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="inline-block bg-sepia-800 text-sepia-100 text-xs px-2 py-1 rounded mb-2 font-mono">
              CASE ID: {activeCase.id}
            </span>
            <h2 className="font-serif text-3xl font-bold mb-2">{activeCase.title}</h2>
            <p className="font-sans text-lg leading-relaxed max-w-2xl">
              {activeCase.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Left: Tools / Checklist */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-sepia-300 font-bold mb-4 flex items-center">
            <Microscope className="mr-2" /> 현장 조사 체크리스트
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            사건을 분석하고 해당하는 항목에 체크하게. 이 단서들이 결론을 내리는 근거가 될 걸세.
          </p>

          <div className="space-y-4">
            <label className={`flex items-center p-4 rounded cursor-pointer transition-colors ${checklist.hasBigData ? 'bg-blue-900/40 border-blue-500' : 'bg-gray-700 border-gray-600'} border`}>
              <input 
                type="checkbox" 
                checked={checklist.hasBigData} 
                onChange={() => handleChecklistChange('hasBigData')}
                className="w-5 h-5 text-sepia-500 rounded focus:ring-sepia-500"
                disabled={!!feedback}
              />
              <span className="ml-3 text-gray-200">
                <strong>데이터 확보:</strong> 충분한 양의 데이터가 존재하는가?
              </span>
            </label>

            <label className={`flex items-center p-4 rounded cursor-pointer transition-colors ${checklist.hasPattern ? 'bg-green-900/40 border-green-500' : 'bg-gray-700 border-gray-600'} border`}>
              <input 
                type="checkbox" 
                checked={checklist.hasPattern} 
                onChange={() => handleChecklistChange('hasPattern')}
                className="w-5 h-5 text-sepia-500 rounded focus:ring-sepia-500"
                disabled={!!feedback}
              />
              <span className="ml-3 text-gray-200">
                <strong>규칙성 발견:</strong> 인과관계나 패턴이 존재하는가?
              </span>
            </label>

            <label className={`flex items-center p-4 rounded cursor-pointer transition-colors ${checklist.isCreativeOrRandom ? 'bg-red-900/40 border-red-500' : 'bg-gray-700 border-gray-600'} border`}>
              <input 
                type="checkbox" 
                checked={checklist.isCreativeOrRandom} 
                onChange={() => handleChecklistChange('isCreativeOrRandom')}
                className="w-5 h-5 text-sepia-500 rounded focus:ring-sepia-500"
                disabled={!!feedback}
              />
              <span className="ml-3 text-gray-200">
                <strong>난제 요인:</strong> 무작위적이거나 순수 창작(직관)이 필요한가?
              </span>
            </label>
          </div>
        </div>

        {/* Right: Action / Verdict */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
          <div>
            <h3 className="text-sepia-300 font-bold mb-4 flex items-center">
              <FileText className="mr-2" /> 수사 결론
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              체크리스트를 바탕으로 최종 판단을 내리게. 이 사건은 기계학습으로 해결 가능한가?
            </p>
          </div>

          {!feedback ? (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <button 
                onClick={() => submitInvestigation(true)}
                className="py-4 px-6 bg-green-700 hover:bg-green-600 text-white rounded font-bold shadow-lg transform hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center gap-2"
              >
                <CheckSquare size={28} />
                <span>해결 가능</span>
              </button>
              <button 
                onClick={() => submitInvestigation(false)}
                className="py-4 px-6 bg-red-800 hover:bg-red-700 text-white rounded font-bold shadow-lg transform hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center gap-2"
              >
                <AlertTriangle size={28} />
                <span>해결 불가능</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded border ${feedback.type === 'success' ? 'bg-green-900/30 border-green-500 text-green-200' : 'bg-red-900/30 border-red-500 text-red-200'}`}>
              <div className="flex items-start">
                <div className="mr-3 mt-1 text-2xl">
                   {feedback.type === 'success' ? '🕵️‍♂️' : '💥'}
                </div>
                <div>
                  <h4 className="font-bold mb-1">{feedback.type === 'success' ? '수사 성공!' : '수사 실패'}</h4>
                  <p className="text-sm leading-relaxed">{feedback.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {feedback && (
        <div className="flex justify-center space-x-4 pt-6 border-t border-gray-800">
          <button 
            onClick={loadRandomCase}
            className="flex items-center px-6 py-3 bg-sepia-700 hover:bg-sepia-600 text-white rounded font-bold transition-colors"
          >
            <Play className="mr-2" size={18} /> 다음 사건(교과서)
          </button>
          
          <button 
            onClick={loadDailyMystery}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white rounded font-bold transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center"><RefreshCw className="animate-spin mr-2" /> 수신 중...</span>
            ) : (
              <span className="flex items-center"><RefreshCw className="mr-2" size={18} /> 일일 의뢰 (AI 생성)</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CrimeSceneTab;