import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter
} from 'recharts';
import { ChartType, Mission, UserEntry, UserProfile } from '../types';
import { getDailyMission } from '../constants';
import { getTodayDateString, saveEntry, updateStreakAndBadges, saveProfile, loadEntries } from '../utils/storage';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface DailyMissionProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DailyMission: React.FC<DailyMissionProps> = ({ profile, setProfile }) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [selectedChart, setSelectedChart] = useState<ChartType | null>(null);
  const [title, setTitle] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [piiError, setPiiError] = useState('');

  useEffect(() => {
    const dateStr = getTodayDateString();
    const dailyMission = getDailyMission(dateStr);
    setMission(dailyMission);

    // Check if already completed
    const entries = loadEntries();
    const existing = entries.find(e => e.date === dateStr);
    if (existing) {
      setSelectedChart(existing.selectedChart);
      setTitle(existing.title);
      setInterpretation(existing.interpretation);
      setIsCompleted(true);
    }
  }, []);

  // Validation Regex for PII (Simple Phone/Email/Name-like pattern)
  const containsPII = (text: string): boolean => {
    const phoneRegex = /(01[016789]-?\d{3,4}-?\d{4}|0\d{1,2}-?\d{3,4}-?\d{4})/;
    const emailRegex = /[a-zA-Z0-9._-]+@[a-z]+\.[a-z]+/;
    return phoneRegex.test(text) || emailRegex.test(text);
  };

  const handleSubmit = () => {
    if (!mission || !selectedChart) return;
    setErrorMsg('');
    setPiiError('');

    if (title.length === 0 || interpretation.length === 0) {
      setErrorMsg("제목과 해석을 모두 입력해주세요.");
      return;
    }

    if (containsPII(title) || containsPII(interpretation)) {
      setPiiError("개인정보(전화번호, 이메일 등)가 포함된 내용은 저장할 수 없습니다.");
      return;
    }

    // Scoring Logic
    let score = 0;
    // 1. Chart Appropriateness (50pts)
    if (selectedChart === mission.bestChart) score += 50;
    else score += 20; // Partial credit for just doing it

    // 2. Interpretation Keywords (50pts)
    const lowerInterp = interpretation.toLowerCase();
    const hitKeywords = mission.keywords.filter(k => lowerInterp.includes(k));
    score += Math.min(50, hitKeywords.length * 15);

    const entry: UserEntry = {
      date: getTodayDateString(),
      missionId: mission.id,
      selectedChart,
      title,
      interpretation,
      score
    };

    saveEntry(entry);
    const newProfile = updateStreakAndBadges(profile, score);
    saveProfile(newProfile);
    setProfile(newProfile);
    setIsCompleted(true);
  };

  const renderChart = () => {
    if (!mission || !selectedChart) return <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">차트를 선택하면 미리보기가 나타납니다.</div>;

    const CommonAxis = () => (
      <>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" fontSize={12} tickLine={false} />
        <YAxis fontSize={12} tickLine={false} />
        <Tooltip />
        <Legend />
      </>
    );

    return (
      <div className="h-64 w-full bg-white p-2 border rounded-lg shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          {selectedChart === 'bar' ? (
            <BarChart data={mission.data}>
              <CommonAxis />
              <Bar dataKey="value" fill="#6366f1" name="값" />
            </BarChart>
          ) : selectedChart === 'line' ? (
            <LineChart data={mission.data}>
              <CommonAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="값" />
            </LineChart>
          ) : selectedChart === 'pie' ? (
            <PieChart>
               <Tooltip />
               <Legend />
              <Pie
                data={mission.data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {mission.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : selectedChart === 'scatter' ? (
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="value" name="X" unit="" />
              <YAxis type="number" dataKey="value2" name="Y" unit="" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="데이터" data={mission.data} fill="#8884d8" />
            </ScatterChart>
          ) : (
            <div>지원하지 않는 차트입니다.</div>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  if (!mission) return <div>미션을 불러오는 중...</div>;

  return (
    <div className="space-y-6">
      <section className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold">{mission.topic}</span>
          <span className="text-gray-400 text-xs">{mission.dateStr}</span>
        </div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">{mission.title}</h2>
        <p className="text-sm text-gray-600 mb-4">{mission.description}</p>
        
        {/* Chart Selector */}
        {!isCompleted && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {mission.availableCharts.map(type => (
              <button
                key={type}
                onClick={() => setSelectedChart(type)}
                className={`py-2 px-1 text-sm rounded border ${
                  selectedChart === type 
                    ? 'bg-indigo-600 text-white border-indigo-600' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {type === 'bar' ? '막대' : type === 'line' ? '꺾은선' : type === 'pie' ? '원형' : '산점도'}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Chart Render Area */}
      {renderChart()}

      {/* Inputs */}
      <section className="bg-white p-4 rounded-xl shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">차트 제목 (30자 이내)</label>
          <input
            type="text"
            maxLength={30}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isCompleted}
            placeholder="핵심을 요약하는 제목을 지어보세요"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">한 줄 해석 (60자 이내)</label>
          <textarea
            maxLength={60}
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            disabled={isCompleted}
            placeholder="데이터에서 발견한 가장 큰 특징은?"
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
          />
        </div>

        {/* Validation Errors */}
        {piiError && (
          <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-2 rounded">
            <AlertTriangle className="w-4 h-4" />
            {piiError}
          </div>
        )}
        {errorMsg && (
          <div className="text-red-500 text-xs text-center">{errorMsg}</div>
        )}

        {!isCompleted ? (
          <button
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold shadow-md active:scale-95 transition-transform"
          >
            미션 완료하기
          </button>
        ) : (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-bold">오늘의 미션 완료!</span>
          </div>
        )}
      </section>
    </div>
  );
};