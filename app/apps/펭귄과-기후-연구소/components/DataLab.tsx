import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { PENGUIN_DATA } from '../constants';
import { Species } from '../types';
import { Ruler, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDrPenguinInsight } from '../services/geminiService';

interface DataLabProps {
  onXpGain: (amount: number, message: string) => void;
}

const DataLab: React.FC<DataLabProps> = ({ onXpGain }) => {
  const [beakLen, setBeakLen] = useState(40);
  const [flipperLen, setFlipperLen] = useState(200);
  const [analyzed, setAnalyzed] = useState(false);
  const [prediction, setPrediction] = useState<Species | null>(null);
  const [neighbors, setNeighbors] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter data for the chart
  const data = useMemo(() => PENGUIN_DATA, []);

  // Helper for Korean Display
  const getSpeciesName = (s: Species | string | null) => {
    switch(s) {
      case Species.Adelie: return "아델리";
      case Species.Chinstrap: return "턱끈";
      case Species.Gentoo: return "젠투";
      default: return "미확인";
    }
  };

  const handleAnalyze = async () => {
    // 1. Calculate distances
    const withDistance = data.map(p => ({
      ...p,
      distance: Math.sqrt(Math.pow(p.beakLength - beakLen, 2) + Math.pow(p.flipperLength - flipperLen, 2))
    }));

    // 2. Sort and get top 3 (K=3)
    const sorted = withDistance.sort((a, b) => a.distance - b.distance);
    const kNeighbors = sorted.slice(0, 3);
    setNeighbors(kNeighbors);

    // 3. Vote
    const votes: Record<string, number> = { [Species.Adelie]: 0, [Species.Chinstrap]: 0, [Species.Gentoo]: 0 };
    kNeighbors.forEach(p => {
      votes[p.species] = (votes[p.species] || 0) + 1;
    });

    const predictedSpecies = Object.keys(votes).reduce((a, b) => votes[a] > votes[b] ? a : b) as Species;
    setPrediction(predictedSpecies);
    setAnalyzed(true);

    // 4. Rewards & AI
    onXpGain(50, `미확인 펭귄을 ${getSpeciesName(predictedSpecies)} 펭귄으로 분류했습니다!`);
    
    setLoadingAi(true);
    const aiResponse = await getDrPenguinInsight(
      `User performed KNN (k=3) classification. Point: Beak ${beakLen}, Flipper ${flipperLen}. Prediction: ${predictedSpecies}. Neighbors: ${kNeighbors.map(n => n.species).join(', ')}`,
      "Classified Penguin"
    );
    setFeedback(aiResponse);
    setLoadingAi(false);
  };

  const reset = () => {
    setAnalyzed(false);
    setPrediction(null);
    setNeighbors([]);
    setFeedback("");
    // Randomize slightly for fun re-playability
    setBeakLen(Math.floor(35 + Math.random() * 15));
    setFlipperLen(Math.floor(180 + Math.random() * 30));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Controls Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Ruler className="text-sky-500" /> 측정 도구
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                부리 길이 (mm): <span className="text-sky-600 font-bold">{beakLen}</span>
              </label>
              <input
                type="range"
                min="30"
                max="60"
                step="0.5"
                value={beakLen}
                onChange={(e) => { setBeakLen(Number(e.target.value)); setAnalyzed(false); }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                날개 길이 (mm): <span className="text-sky-600 font-bold">{flipperLen}</span>
              </label>
              <input
                type="range"
                min="170"
                max="240"
                step="1"
                value={flipperLen}
                onChange={(e) => { setFlipperLen(Number(e.target.value)); setAnalyzed(false); }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzed}
              className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-lg flex justify-center items-center gap-2
                ${analyzed ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 hover:shadow-sky-200'}
              `}
            >
              <BrainCircuit className="w-5 h-5" />
              KNN 분석 실행
            </button>

            {analyzed && (
               <button
               onClick={reset}
               className="w-full py-2 px-4 rounded-xl font-semibold text-sky-600 border-2 border-sky-100 hover:bg-sky-50 transition-colors"
             >
               다른 펭귄 측정하기
             </button>
            )}
          </div>
        </div>

        {/* Results Panel */}
        {analyzed && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-500 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> 분석 결과
            </h3>
            <p className="text-gray-600 mb-4">
              가장 가까운 이웃 3개를 분석한 결과,<br/> 이 펭귄은 다음과 같습니다:
            </p>
            <div className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4">
              {getSpeciesName(prediction)} 펭귄
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">펭귄 박사님의 노트:</p>
              {loadingAi ? (
                <div className="animate-pulse h-4 bg-slate-200 rounded w-3/4"></div>
              ) : (
                <p className="text-sm text-slate-700 italic">"{feedback}"</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Chart Column */}
      <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-md flex flex-col min-h-[500px]">
        <h3 className="text-center font-bold text-gray-500 mb-2">펭귄 종 분포도 (산점도)</h3>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                type="number" 
                dataKey="beakLength" 
                name="Beak Length" 
                unit="mm" 
                domain={[30, 60]}
                label={{ value: '부리 길이 (mm)', position: 'insideBottom', offset: -10 }} 
              />
              <YAxis 
                type="number" 
                dataKey="flipperLength" 
                name="Flipper Length" 
                unit="mm" 
                domain={[170, 240]}
                label={{ value: '날개 길이 (mm)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                formatter={(value: any, name: any, props: any) => {
                    if (name === 'Beak Length') return [`${value}mm`, '부리 길이'];
                    if (name === 'Flipper Length') return [`${value}mm`, '날개 길이'];
                    return [value, name];
                }}
              />
              
              {/* Dataset Scatters */}
              <Scatter name="펭귄 데이터" data={data} fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} />
                ))}
              </Scatter>

              {/* User Point */}
              <Scatter 
                name="미확인 펭귄" 
                data={[{ beakLength: beakLen, flipperLength: flipperLen }]} 
                fill="#f59e0b" 
                shape="star"
                r={100} 
              >
                 <Cell fill="#f97316" stroke="#fff" strokeWidth={2} />
              </Scatter>

              {/* Neighbors Highlight */}
              {analyzed && neighbors.map((n, i) => (
                 <ReferenceLine 
                    key={i} 
                    segment={[{ x: beakLen, y: flipperLen }, { x: n.beakLength, y: n.flipperLength }]} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3"
                    strokeWidth={2}
                 />
              ))}

            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-sm font-medium">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> 아델리</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-violet-500"></span> 턱끈</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-500"></span> 젠투</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-500 border border-white ring-1 ring-orange-500"></span> 미확인</div>
        </div>
      </div>
    </div>
  );
};

export default DataLab;