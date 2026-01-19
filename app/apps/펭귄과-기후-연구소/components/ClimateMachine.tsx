import React, { useState, useMemo } from 'react';
import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CLIMATE_DATA } from '../constants';
import { TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { getDrPenguinInsight } from '../services/geminiService';

interface ClimateMachineProps {
  onXpGain: (amount: number, message: string) => void;
}

const ClimateMachine: React.FC<ClimateMachineProps> = ({ onXpGain }) => {
  const [prediction2050, setPrediction2050] = useState<number>(1.5);
  const [showRegression, setShowRegression] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Calculate simple linear regression y = mx + b
  const regressionData = useMemo(() => {
    const n = CLIMATE_DATA.length;
    const sumX = CLIMATE_DATA.reduce((acc, d) => acc + d.year, 0);
    const sumY = CLIMATE_DATA.reduce((acc, d) => acc + d.tempAnomaly, 0);
    const sumXY = CLIMATE_DATA.reduce((acc, d) => acc + (d.year * d.tempAnomaly), 0);
    const sumXX = CLIMATE_DATA.reduce((acc, d) => acc + (d.year * d.year), 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate trend points
    const startYear = 1990;
    const endYear = 2050;
    const trend = [];
    for (let year = startYear; year <= endYear; year += 5) {
      trend.push({ year, trendTemp: slope * year + intercept });
    }
    
    const actual2050 = slope * 2050 + intercept;

    return { trend, slope, intercept, actual2050 };
  }, []);

  const handlePredict = async () => {
    setShowRegression(true);
    const diff = Math.abs(prediction2050 - regressionData.actual2050);
    let message = "";
    let xp = 0;

    if (diff < 0.2) {
      message = "훌륭한 예측입니다! 추세선과 거의 일치하네요.";
      xp = 100;
    } else {
      message = "좋은 시도입니다! 기온 상승 추세가 생각보다 가파르죠?";
      xp = 50;
    }

    onXpGain(xp, "기후 모델 시뮬레이션 완료");

    setLoadingAi(true);
    const aiResponse = await getDrPenguinInsight(
      `User predicted 2050 temp anomaly: ${prediction2050}. Actual linear regression: ${regressionData.actual2050.toFixed(2)}. Difference: ${diff.toFixed(2)}. Data shows rising trend.`,
      "Climate Prediction"
    );
    setFeedback(aiResponse);
    setLoadingAi(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
       <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <Clock className="text-red-500" /> 기후 타임머신 2050
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            오른쪽 그래프를 보세요. 1990년부터 지구의 기온이 계속 오르고 있습니다. 
            슬라이더를 움직여 <strong>2050년</strong>에는 기온이 얼마나 더 오를지 예측하여 점을 찍어보세요.
          </p>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              나의 2050년 예측: <span className="text-red-600 text-lg">+{prediction2050.toFixed(2)}°C</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.05"
              value={prediction2050}
              onChange={(e) => {
                setPrediction2050(Number(e.target.value));
                setShowRegression(false);
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>+0.5°C</span>
              <span>+3.0°C</span>
            </div>
          </div>

          <button
            onClick={handlePredict}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-red-200 transition-all flex justify-center items-center gap-2"
          >
            <TrendingUp className="w-5 h-5" />
            미래 예측 실행
          </button>
        </div>

        {showRegression && (
          <div className="bg-white p-6 rounded-2xl shadow-md animate-fade-in-up">
             <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" /> 영향 분석
            </h3>
            <div className="bg-slate-50 p-4 rounded-xl">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">펭귄 박사님의 전망:</p>
              {loadingAi ? (
                <div className="animate-pulse h-4 bg-slate-200 rounded w-3/4"></div>
              ) : (
                <p className="text-sm text-slate-700 italic">"{feedback}"</p>
              )}
            </div>
          </div>
        )}
       </div>

       <div className="lg:col-span-2 bg-white p-4 rounded-2xl shadow-md min-h-[500px] flex flex-col">
          <h3 className="text-center font-bold text-gray-500 mb-2">지구 평균 기온 변화 (이상 기온 °C)</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={CLIMATE_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" type="number" domain={[1990, 2050]} tickCount={7} />
                <YAxis unit="°C" domain={[0, 3]} />
                <Tooltip 
                   formatter={(value: any, name: any) => {
                    if (name === 'Historical Data') return [`${value}°C`, '과거 데이터'];
                    if (name === 'Linear Trend') return [`${value.toFixed(2)}°C`, '회귀선 (추세)'];
                    if (name === 'Your Prediction') return [`${value}°C`, '나의 예측'];
                    return [value, name];
                   }}
                   labelFormatter={(label) => `${label}년`}
                />
                
                {/* Historical Data */}
                <Line 
                  type="monotone" 
                  dataKey="tempAnomaly" 
                  stroke="#ef4444" 
                  strokeWidth={2} 
                  dot={{ r: 3, fill: '#ef4444' }} 
                  name="Historical Data"
                  isAnimationActive={true}
                />

                {/* Regression Line */}
                {showRegression && (
                   <Line 
                    data={regressionData.trend} 
                    type="monotone" 
                    dataKey="trendTemp" 
                    stroke="#94a3b8" 
                    strokeDasharray="5 5" 
                    strokeWidth={2} 
                    dot={false}
                    name="Linear Trend"
                   />
                )}

                {/* User Prediction Point */}
                <Scatter 
                  name="Your Prediction" 
                  data={[{ year: 2050, tempAnomaly: prediction2050 }]} 
                  fill="#f59e0b" 
                  shape="circle" 
                />
                
                {/* Visual Connector for User Prediction */}
                {showRegression && (
                  <ReferenceLine x={2050} stroke="#cbd5e1" strokeDasharray="3 3" />
                )}

              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            NASA GISS 데이터를 기반으로 시뮬레이션된 자료입니다. (1951-1980 평균 대비 변화량)
          </div>
       </div>
    </div>
  );
};

export default ClimateMachine;