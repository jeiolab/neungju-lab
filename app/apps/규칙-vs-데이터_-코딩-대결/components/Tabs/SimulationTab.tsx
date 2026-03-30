import React, { useState, useMemo } from 'react';
import { MOCK_EMAILS, THEORY_CONTENT } from '../../constants';
import { SimulationResult, EmailData } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Play, RotateCcw, Check, X, Mail } from 'lucide-react';

const SimulationTab: React.FC = () => {
  const [mode, setMode] = useState<'traditional' | 'ml' | null>(null);

  return (
    <div className="space-y-6">
      {!mode ? (
        <div className="grid md:grid-cols-2 gap-6 h-96">
          <button 
            onClick={() => setMode('traditional')}
            className="group relative bg-white border-2 border-blue-100 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center transition-all hover:shadow-xl"
          >
            <div className="bg-blue-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">전통적 방식 시뮬레이션</h3>
            <p className="text-slate-500 mt-2">직접 '금지어 규칙'을 입력하여 스팸을 걸러보세요.</p>
          </button>
          
          <button 
            onClick={() => setMode('ml')}
            className="group relative bg-white border-2 border-purple-100 hover:border-purple-500 rounded-xl p-8 flex flex-col items-center justify-center transition-all hover:shadow-xl"
          >
            <div className="bg-purple-100 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform">
              <div className="flex gap-1">
                <Mail className="w-12 h-12 text-purple-600" />
                <Check className="w-6 h-6 text-green-500 absolute ml-8 mt-8" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800">기계학습 방식 시뮬레이션</h3>
            <p className="text-slate-500 mt-2">데이터(이메일)를 분류하여 AI를 학습시켜보세요.</p>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-[500px]">
          <button 
            onClick={() => setMode(null)}
            className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" /> 모드 선택으로 돌아가기
          </button>
          
          {mode === 'traditional' ? <TraditionalSim /> : <MLSim />}
        </div>
      )}
    </div>
  );
};

const TraditionalSim: React.FC = () => {
  const [rules, setRules] = useState<string>('');
  const [results, setResults] = useState<{email: EmailData, filtered: boolean, correct: boolean}[] | null>(null);

  const runSimulation = () => {
    const keywords = rules.split(',').map(r => r.trim()).filter(r => r.length > 0);
    
    const simResults = MOCK_EMAILS.map(email => {
      // Traditional logic: If body or subject contains ANY keyword -> Filter as spam
      const isFilteredAsSpam = keywords.some(k => 
        email.subject.includes(k) || email.body.includes(k)
      );
      
      // Correct if (Spam & Filtered) OR (Not Spam & Not Filtered)
      const correct = (email.isSpam === isFilteredAsSpam);
      return { email, filtered: isFilteredAsSpam, correct };
    });

    setResults(simResults);
  };

  const accuracy = useMemo(() => {
    if (!results) return 0;
    const correctCount = results.filter(r => r.correct).length;
    return Math.round((correctCount / results.length) * 100);
  }, [results]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-blue-700">스팸 필터 만들기 (규칙 기반)</h3>
        <p className="text-slate-600">스팸 메일에 자주 등장할 것 같은 단어를 쉼표(,)로 구분해서 입력하세요.</p>
        <p className="text-sm text-slate-400 mt-1">예: 광고, 당첨, 무료</p>
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder="규칙 입력 (예: 할인, 쿠폰)"
          className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-2 focus:border-blue-500 outline-none transition-colors"
        />
        <button 
          onClick={runSimulation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> 실행
        </button>
      </div>

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
            <span className="font-medium text-slate-700">정확도</span>
            <span className={`text-2xl font-bold ${accuracy >= 80 ? 'text-green-600' : 'text-orange-500'}`}>
              {accuracy}%
            </span>
          </div>

          <div className="grid gap-2 max-h-64 overflow-y-auto pr-2">
            {results.map((res) => (
              <div key={res.email.id} className={`p-3 rounded border text-sm flex justify-between items-center ${res.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex-1">
                  <div className="font-bold truncate">{res.email.subject}</div>
                  <div className="text-xs text-slate-500 truncate">{res.email.body}</div>
                </div>
                <div className="flex flex-col items-end gap-1 ml-4 min-w-[80px]">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${res.email.isSpam ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-700'}`}>
                    실제: {res.email.isSpam ? '스팸' : '정상'}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${res.filtered ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                    판단: {res.filtered ? '차단' : '통과'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MLSim: React.FC = () => {
  const [trainingStep, setTrainingStep] = useState(0);
  const [dataPoints, setDataPoints] = useState<SimulationResult[]>([{ step: 0, accuracy: 50 }]); // Start at 50% (random guess)
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  // Use a subset of emails for training simulation
  const trainingEmails = useMemo(() => [...MOCK_EMAILS].sort(() => Math.random() - 0.5), []);

  const handleClassify = (userLabelIsSpam: boolean) => {
    const currentEmail = trainingEmails[currentEmailIndex];
    const isCorrect = currentEmail.isSpam === userLabelIsSpam;
    
    // Simulate learning curve: Accuracy generally goes up as more data is processed
    // But mistakes in labeling can slightly hurt or plateau it.
    // Base accuracy formula: Logarithmic growth towards 95% based on step count
    const nextStep = trainingStep + 1;
    let simulatedAccuracy = 50 + (45 * (1 - Math.exp(-0.3 * nextStep))); 
    
    // Add noise based on correctness of this specific label (Teaching the machine wrong hurts it)
    if (!isCorrect) {
      simulatedAccuracy -= 5; 
    }

    simulatedAccuracy = Math.min(Math.max(simulatedAccuracy, 0), 100);

    setDataPoints([...dataPoints, { step: nextStep, accuracy: Math.round(simulatedAccuracy) }]);
    setTrainingStep(nextStep);

    if (currentEmailIndex < trainingEmails.length - 1) {
      setCurrentEmailIndex(currentEmailIndex + 1);
    } else {
      setFinished(true);
    }
  };

  const currentEmail = trainingEmails[currentEmailIndex];

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="border-b pb-4">
        <h3 className="text-xl font-bold text-purple-700">스팸 필터 학습시키기 (기계학습)</h3>
        <p className="text-slate-600">여러분이 데이터를 라벨링(정답지 만들기) 해주면, AI가 패턴을 스스로 학습합니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Interaction Area */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {!finished ? (
            <>
              <div className="w-full relative h-48 perspective-1000">
                <div className="absolute inset-0 bg-white border shadow-md rounded-xl p-6 flex flex-col justify-center transform transition-all hover:scale-105">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">Training Data #{trainingStep + 1}</div>
                  <h4 className="font-bold text-lg mb-2">{currentEmail.subject}</h4>
                  <p className="text-sm text-slate-600">{currentEmail.body}</p>
                </div>
              </div>

              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => handleClassify(false)}
                  className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 py-3 rounded-lg font-bold transition-colors flex flex-col items-center"
                >
                  <Check className="mb-1" />
                  정상 메일
                </button>
                <button 
                  onClick={() => handleClassify(true)}
                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-800 py-3 rounded-lg font-bold transition-colors flex flex-col items-center"
                >
                  <X className="mb-1" />
                  스팸 메일
                </button>
              </div>
            </>
          ) : (
             <div className="text-center p-8 bg-purple-50 rounded-xl">
               <h4 className="text-xl font-bold text-purple-800 mb-2">학습 완료!</h4>
               <p className="text-purple-600 mb-4">데이터가 쌓일수록 정확도가 높아지는 것을 확인했나요?</p>
               <button 
                onClick={() => {
                  setFinished(false);
                  setTrainingStep(0);
                  setDataPoints([{ step: 0, accuracy: 50 }]);
                  setCurrentEmailIndex(0);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
               >
                 다시 하기
               </button>
             </div>
          )}
        </div>

        {/* Graph Area */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-80">
          <h4 className="text-sm font-bold text-slate-500 mb-4 text-center">AI 모델 정확도 변화</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={dataPoints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" label={{ value: '데이터 수', position: 'insideBottomRight', offset: -5 }} />
              <YAxis domain={[0, 100]} label={{ value: '정확도(%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#9333ea" 
                strokeWidth={3} 
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SimulationTab;
