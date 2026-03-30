import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrainingDataPoint } from '../types';
import { Play, RotateCcw, TrendingUp } from 'lucide-react';

const ITEMS = [
  { name: '사과', emoji: '🍎', type: 'apple' },
  { name: '바나나', emoji: '🍌', type: 'banana' },
  { name: '풋사과', emoji: '🍏', type: 'apple' },
  { name: '껍질 벗긴 바나나', emoji: '🍌', type: 'banana' },
];

const TabSimulation: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<TrainingDataPoint[]>([{ step: 0, accuracy: 10 }]); // Start with 10% random chance
  const [trainingCount, setTrainingCount] = useState(0);
  const [currentItem, setCurrentItem] = useState(ITEMS[0]);
  const [message, setMessage] = useState("AI 모델 훈련을 시작해보세요!");

  useEffect(() => {
    generateNewItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateNewItem = () => {
    const randomIndex = Math.floor(Math.random() * ITEMS.length);
    setCurrentItem(ITEMS[randomIndex]);
  };

  const trainModel = (userLabel: 'apple' | 'banana') => {
    const isCorrect = userLabel === currentItem.type;

    if (!isCorrect) {
      setMessage("⚠️ 잘못 가르쳤어요! 레이블이 정확해야 성능이 오릅니다.");
      // Penalty or no gain
      return;
    }

    const newCount = trainingCount + 1;
    setTrainingCount(newCount);

    // Simulation Formula: Acc = 1 - e^(-k * n)
    // Adding a base of 0.1 (10%) and scaling to 100%
    const k = 0.15;
    const baseAccuracy = (1 - Math.exp(-k * newCount)) * 90 + 10;
    
    // Add small noise to make it realistic
    const noise = (Math.random() - 0.5) * 3;
    const currentAccuracy = Math.min(99.9, Math.max(10, baseAccuracy + noise));

    setDataPoints(prev => [...prev, { step: newCount, accuracy: parseFloat(currentAccuracy.toFixed(1)) }]);
    
    if (newCount < 5) {
      setMessage("👍 잘하고 있어요! 데이터가 쌓이고 있습니다.");
    } else if (newCount < 10) {
      setMessage("📈 정확도가 빠르게 오르고 있습니다!");
    } else if (newCount < 20) {
      setMessage("🔥 모델이 꽤 똑똑해졌네요!");
    } else {
      setMessage("✨ 훌륭한 AI 트레이너시군요! 모델 성능이 안정화되었습니다.");
    }

    generateNewItem();
  };

  const resetSimulation = () => {
    setTrainingCount(0);
    setDataPoints([{ step: 0, accuracy: 10 }]);
    setMessage("모델을 초기화했습니다. 다시 훈련시켜주세요.");
    generateNewItem();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left Panel: Training Interface */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between border border-gray-100">
        <div className="w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Play className="w-6 h-6 text-indigo-600 fill-indigo-600" /> 과일 분류기 훈련
          </h2>
          <p className="text-gray-500 text-sm mb-6">사진을 보고 올바른 정답(레이블)을 달아주세요.</p>
          
          <div className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px] mb-6 border-2 border-dashed border-gray-300">
            <div className="text-[8rem] animate-bounce-subtle filter drop-shadow-lg">
              {currentItem.emoji}
            </div>
            <p className="mt-4 text-gray-400 font-medium">이것은 무엇인가요?</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={() => trainModel('apple')}
            className="group relative flex flex-col items-center justify-center p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-all active:scale-95"
          >
            <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🍎</span>
            <span className="font-bold text-red-700">사과</span>
          </button>
          <button
            onClick={() => trainModel('banana')}
            className="group relative flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 rounded-xl transition-all active:scale-95"
          >
            <span className="text-4xl mb-1 group-hover:scale-110 transition-transform">🍌</span>
            <span className="font-bold text-yellow-700">바나나</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 rounded-lg w-full text-center text-indigo-800 font-medium">
          {message}
        </div>
      </div>

      {/* Right Panel: Visualization */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" /> 학습 현황판
          </h2>
          <button 
            onClick={resetSimulation}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="초기화"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-around mb-8">
            <div className="text-center">
                <p className="text-sm text-gray-500">총 학습 횟수 (Epoch)</p>
                <p className="text-3xl font-bold text-indigo-600">{trainingCount}회</p>
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-500">현재 정확도</p>
                <p className="text-3xl font-bold text-green-600">
                    {dataPoints[dataPoints.length - 1].accuracy}%
                </p>
            </div>
        </div>

        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataPoints}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="step" 
                label={{ value: '학습 횟수', position: 'insideBottomRight', offset: -5 }} 
              />
              <YAxis 
                domain={[0, 100]} 
                label={{ value: '정확도(%)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#4f46e5" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#4f46e5' }} 
                activeDot={{ r: 8 }}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
            * 실제 AI 모델 학습 곡선을 단순화한 시뮬레이션입니다.
        </div>
      </div>
    </div>
  );
};

export default TabSimulation;