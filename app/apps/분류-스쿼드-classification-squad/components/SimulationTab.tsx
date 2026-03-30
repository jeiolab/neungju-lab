import React, { useState, useEffect, useMemo } from 'react';
import { ClassificationType, MailFeature, StudentFeature, ClubType } from '../types';
import { Mail, ShieldAlert, CheckCircle, Users, Briefcase, Music, Trophy, HeartHandshake, RefreshCw, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  onScoreUpdate: (isCorrect: boolean, xpGain: number) => void;
  noiseLevel: number; // 0-30
  dataSize: number; // 10-200
  setNoiseLevel: (v: number) => void;
  setDataSize: (v: number) => void;
}

const FEATURE_COLORS = {
  IT: '#3b82f6',
  Arts: '#8b5cf6',
  Sports: '#f97316',
  Volunteer: '#14b8a6'
};

export const SimulationTab: React.FC<Props> = ({ 
  onScoreUpdate, noiseLevel, dataSize, setNoiseLevel, setDataSize 
}) => {
  const [mode, setMode] = useState<ClassificationType>('binary');
  const [currentMail, setCurrentMail] = useState<MailFeature | null>(null);
  const [currentStudent, setCurrentStudent] = useState<StudentFeature | null>(null);
  const [feedback, setFeedback] = useState<{show: boolean, correct: boolean, message: string, reasons: string[]} | null>(null);
  const [knnVotes, setKnnVotes] = useState<{label: string, count: number, color: string}[]>([]);

  // Generate new card
  const generateCard = () => {
    setFeedback(null);
    if (mode === 'binary') {
      const hasKeywords = Math.random() > 0.6;
      const upperCaseRatio = Math.random();
      const linkCount = Math.floor(Math.random() * 6); // 0-5
      const domainRisk = Math.floor(Math.random() * 100);
      
      // Ground Truth Logic
      let score = 0;
      if (hasKeywords) score += 30;
      score += upperCaseRatio * 40;
      score += linkCount * 15;
      score += (domainRisk / 100) * 20;

      let isSpam = score > 50;

      // Apply Noise
      if (Math.random() * 100 < noiseLevel) {
        isSpam = !isSpam;
      }

      setCurrentMail({ hasKeywords, upperCaseRatio, linkCount, domainRisk, isSpam });
    } else {
      // Multi-class
      const interests: StudentFeature['interest'][] = ['Tech', 'Creative', 'Active', 'Social'];
      const interest = interests[Math.floor(Math.random() * interests.length)];
      const hours = Math.floor(Math.random() * 10) + 1;
      const friends = Math.random() > 0.5;
      const competition = Math.random() > 0.5;

      let club: ClubType = 'IT';
      if (interest === 'Tech') club = 'IT';
      else if (interest === 'Creative') club = 'Arts';
      else if (interest === 'Active') club = 'Sports';
      else if (interest === 'Social') club = 'Volunteer';

      // Slight logic mix for overlap
      if (interest === 'Tech' && hours < 3) club = 'Arts'; // IT needs time
      
      // Noise
      if (Math.random() * 100 < noiseLevel) {
         const clubs: ClubType[] = ['IT', 'Arts', 'Sports', 'Volunteer'];
         club = clubs[Math.floor(Math.random() * clubs.length)];
      }

      setCurrentStudent({ interest, hoursAvailable: hours, withFriends: friends, prefersCompetition: competition, recommendedClub: club });
    }
  };

  // Simulate k-NN whenever card changes
  useEffect(() => {
    generateCard();
  }, [mode]);

  useEffect(() => {
    if (!currentMail && !currentStudent) return;
    
    // Simulate k-NN Training Data & Voting
    // Simple logic: generate random votes weighted by the current "truth" + noise
    // In a real app, we'd store a dataset. Here we simulate the *output* of k-NN.
    
    let trueLabel = '';
    if (mode === 'binary' && currentMail) trueLabel = currentMail.isSpam ? '스팸' : '정상';
    if (mode === 'multiclass' && currentStudent) trueLabel = currentStudent.recommendedClub;

    const k = 3;
    const votes: string[] = [];
    
    for(let i=0; i<k; i++) {
        // High chance to be true label, decreased by noise
        const isCorrect = Math.random() > (noiseLevel / 100);
        if (isCorrect) {
            votes.push(trueLabel);
        } else {
             if (mode === 'binary') votes.push(trueLabel === '스팸' ? '정상' : '스팸');
             else {
                 const clubs = ['IT', 'Arts', 'Sports', 'Volunteer'].filter(c => c !== trueLabel);
                 votes.push(clubs[Math.floor(Math.random() * clubs.length)]);
             }
        }
    }

    const voteCounts = votes.reduce((acc, label) => {
        acc[label] = (acc[label] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const chartData = Object.entries(voteCounts).map(([label, count]) => ({
        label, 
        count,
        color: label === '스팸' ? '#ef4444' : label === '정상' ? '#22c55e' : FEATURE_COLORS[label as ClubType] || '#888'
    }));

    setKnnVotes(chartData);

  }, [currentMail, currentStudent, noiseLevel, mode]);


  const handleGuess = (prediction: string) => {
    let isCorrect = false;
    let actualLabel = '';
    let reasons: string[] = [];

    if (mode === 'binary' && currentMail) {
      actualLabel = currentMail.isSpam ? 'Spam' : 'Normal';
      isCorrect = (prediction === 'Spam' && currentMail.isSpam) || (prediction === 'Normal' && !currentMail.isSpam);
      
      if (currentMail.linkCount > 2) reasons.push(`링크가 ${currentMail.linkCount}개로 많음`);
      if (currentMail.hasKeywords) reasons.push(`'무료/쿠폰' 등 키워드 포함`);
      if (currentMail.domainRisk > 70) reasons.push(`발신 도메인 위험도 높음`);
      if (!currentMail.isSpam && reasons.length === 0) reasons.push(`특이한 위험 요소 없음`);
    } 
    else if (mode === 'multiclass' && currentStudent) {
        actualLabel = currentStudent.recommendedClub;
        isCorrect = prediction === actualLabel;
        
        reasons.push(`주 관심사가 '${currentStudent.interest}'임`);
        if (currentStudent.hoursAvailable < 3) reasons.push(`가용 시간이 적음`);
        if (currentStudent.prefersCompetition) reasons.push(`경쟁/대회를 선호함`);
    }

    onScoreUpdate(isCorrect, isCorrect ? 15 : 5);
    setFeedback({
      show: true,
      correct: isCorrect,
      message: isCorrect ? "정확한 분류입니다! 훌륭해요." : `앗! 이 데이터의 실제 레이블은 '${actualLabel}' 입니다.`,
      reasons
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col lg:flex-row gap-6">
      {/* Controls & Settings */}
      <div className="lg:w-1/3 space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <RefreshCw size={18} /> 설정 (Data Config)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                데이터 양 (학습용) <span>{dataSize}개</span>
              </label>
              <input 
                type="range" min="10" max="200" step="10" 
                value={dataSize} onChange={(e) => setDataSize(Number(e.target.value))}
                className="w-full mt-2 accent-indigo-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                노이즈 (오류 데이터) <span>{noiseLevel}%</span>
              </label>
              <input 
                type="range" min="0" max="30" step="5" 
                value={noiseLevel} onChange={(e) => setNoiseLevel(Number(e.target.value))}
                className="w-full mt-2 accent-red-500"
              />
              <p className="text-xs text-gray-400 mt-1">노이즈가 높으면 데이터가 모호해집니다.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <BarChart2 size={18} /> 미니 k-NN 분석
            </h3>
            <p className="text-xs text-gray-500 mb-4">가장 가까운 이웃 3개의 다수결:</p>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={knnVotes}>
                        <XAxis dataKey="label" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {knnVotes.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="lg:w-2/3 space-y-6">
        {/* Mode Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setMode('binary')}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${mode === 'binary' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
          >
            스팸 메일 분류 (이진)
          </button>
          <button 
            onClick={() => setMode('multiclass')}
            className={`flex-1 py-2 rounded-md font-bold text-sm transition-all ${mode === 'multiclass' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}
          >
            동아리 추천 (다중)
          </button>
        </div>

        {/* Card */}
        <div className="relative min-h-[300px] flex flex-col justify-center items-center">
           {!feedback ? (
             <div className="w-full bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-8 animate-in zoom-in duration-300">
                {mode === 'binary' && currentMail && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Mail className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase">Incoming Mail Feature Vector</div>
                        <h2 className="text-xl font-bold text-gray-800">이메일 분석 카드</h2>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <FeatureItem label="키워드(광고/무료)" value={currentMail.hasKeywords ? "있음" : "없음"} highlight={currentMail.hasKeywords} />
                       <FeatureItem label="대문자 비율" value={`${Math.round(currentMail.upperCaseRatio * 100)}%`} highlight={currentMail.upperCaseRatio > 0.5} />
                       <FeatureItem label="링크 개수" value={`${currentMail.linkCount}개`} highlight={currentMail.linkCount > 2} />
                       <FeatureItem label="도메인 위험도" value={currentMail.domainRisk.toString()} highlight={currentMail.domainRisk > 70} />
                    </div>
                  </div>
                )}

                {mode === 'multiclass' && currentStudent && (
                   <div className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="text-gray-600" />
                      </div>
                       <div>
                        <div className="text-xs text-gray-400 font-bold uppercase">New Student Profile</div>
                        <h2 className="text-xl font-bold text-gray-800">신입생 생활 패턴</h2>
                      </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                       <FeatureItem label="주 관심사" value={currentStudent.interest} />
                       <FeatureItem label="주당 활동 시간" value={`${currentStudent.hoursAvailable}시간`} highlight={currentStudent.hoursAvailable < 3} />
                       <FeatureItem label="친구와 함께?" value={currentStudent.withFriends ? "Yes" : "No"} />
                       <FeatureItem label="경쟁 선호" value={currentStudent.prefersCompetition ? "Yes" : "No"} highlight={currentStudent.prefersCompetition} />
                    </div>
                   </div>
                )}
             </div>
           ) : (
             <div className={`w-full h-full min-h-[300px] flex flex-col items-center justify-center rounded-2xl shadow-lg border-2 p-8 text-center animate-in fade-in zoom-in duration-300 ${feedback.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {feedback.correct ? <CheckCircle size={64} className="text-green-500 mb-4" /> : <ShieldAlert size={64} className="text-red-500 mb-4" />}
                <h2 className={`text-2xl font-bold mb-2 ${feedback.correct ? 'text-green-700' : 'text-red-700'}`}>{feedback.message}</h2>
                <div className="mt-4 text-left bg-white/60 p-4 rounded-xl">
                   <p className="text-xs font-bold text-gray-500 uppercase mb-2">결정적 특징 (Feature Importance)</p>
                   <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                     {feedback.reasons.map((r, i) => <li key={i}>{r}</li>)}
                   </ul>
                </div>
                <button onClick={generateCard} className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">
                  다음 데이터 분석 ➡️
                </button>
             </div>
           )}
        </div>

        {/* Action Buttons */}
        {!feedback && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
             {mode === 'binary' ? (
                <>
                  <button onClick={() => handleGuess('Normal')} className="col-span-1 md:col-span-2 py-4 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 font-bold text-lg border-2 border-green-200 transition-all flex items-center justify-center gap-2">
                    <CheckCircle /> 정상 메일
                  </button>
                  <button onClick={() => handleGuess('Spam')} className="col-span-1 md:col-span-2 py-4 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-lg border-2 border-red-200 transition-all flex items-center justify-center gap-2">
                    <ShieldAlert /> 스팸 메일
                  </button>
                </>
             ) : (
                <>
                  <ClubButton type="IT" icon={<Briefcase />} onClick={() => handleGuess('IT')} />
                  <ClubButton type="Arts" icon={<Music />} onClick={() => handleGuess('Arts')} />
                  <ClubButton type="Sports" icon={<Trophy />} onClick={() => handleGuess('Sports')} />
                  <ClubButton type="Volunteer" icon={<HeartHandshake />} onClick={() => handleGuess('Volunteer')} />
                </>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{label: string, value: string, highlight?: boolean}> = ({label, value, highlight}) => (
  <div className={`p-3 rounded-lg border ${highlight ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-100'}`}>
    <span className="text-xs text-gray-500 block mb-1">{label}</span>
    <span className="font-bold text-gray-800">{value}</span>
  </div>
);

const ClubButton: React.FC<{type: ClubType, icon: React.ReactNode, onClick: () => void}> = ({type, icon, onClick}) => (
  <button 
    onClick={onClick}
    className="py-4 rounded-xl bg-white hover:bg-gray-50 border-2 border-gray-200 font-bold text-gray-700 transition-all flex flex-col items-center gap-2"
    style={{ borderColor: FEATURE_COLORS[type] + '40', color: FEATURE_COLORS[type] }}
  >
    {icon}
    {type}
  </button>
);
