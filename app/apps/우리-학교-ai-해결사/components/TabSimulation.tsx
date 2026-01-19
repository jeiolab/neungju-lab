import React, { useState } from 'react';
import { Problem, MLType, ML_TYPE_LABELS } from '../types';
import { PROBLEMS } from '../constants';
import { generateScenario } from '../services/geminiService';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, Save } from 'lucide-react';

interface Props {
  onComplete: (problem: Problem, type: MLType, features: string, score: number, feedback: string) => void;
}

const TabSimulation: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [features, setFeatures] = useState<string>('');
  const [selectedMLType, setSelectedMLType] = useState<MLType | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);

  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setFeatures(''); 
    setStep(2);
  };

  const handleFeaturesSubmit = () => {
    if (features.trim().length > 2) {
      setStep(3);
    }
  };

  const calculateScore = (problem: Problem, type: MLType): number => {
    if (problem.recommendedType === type) return 100;
    if (problem.acceptableTypes?.includes(type)) return 50;
    
    // Specific logic for Library (Book Rec) as per prompt
    if (problem.id === 'p5') {
        if (type === 'unsupervised') return 100;
        if (type === 'supervised') return 50;
    }
    
    return 0;
  };

  const handleFinalSubmit = async () => {
    if (!selectedProblem || !selectedMLType) return;

    setIsGenerating(true);
    
    const score = calculateScore(selectedProblem, selectedMLType);
    const isCorrect = score >= 50;

    const feedback = await generateScenario(
      selectedProblem.title,
      ML_TYPE_LABELS[selectedMLType],
      features,
      isCorrect,
      score
    );

    setResult({ score, feedback });
    setIsGenerating(false);
    onComplete(selectedProblem, selectedMLType, features, score, feedback);
    setStep(4);
  };

  const reset = () => {
    setStep(1);
    setSelectedProblem(null);
    setFeatures('');
    setSelectedMLType(null);
    setResult(null);
  };

  // Step 1: Select Problem
  if (step === 1) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
          해결하고 싶은 문제를 선택하세요
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROBLEMS.map((problem) => (
            <button
              key={problem.id}
              onClick={() => handleSelectProblem(problem)}
              className="flex flex-col items-start text-left bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{problem.icon}</span>
              <h3 className="font-bold text-slate-800 mb-1">{problem.title}</h3>
              <p className="text-sm text-slate-500">{problem.description}</p>
              <span className="mt-3 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {problem.category}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Step 2: Define Data
  if (step === 2 && selectedProblem) {
    return (
      <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            데이터 정의하기
        </h2>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{selectedProblem.icon}</span>
            <div>
              <h3 className="font-bold text-lg">{selectedProblem.title}</h3>
              <p className="text-slate-600 text-sm">{selectedProblem.description}</p>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
            <p className="text-amber-800 text-sm font-medium">💡 힌트: {selectedProblem.hint}</p>
          </div>

          <label className="block mb-2 font-semibold text-slate-700">
            이 문제를 해결하려면 AI에게 어떤 데이터를 알려줘야 할까요?
          </label>
          <textarea
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
            placeholder="예: 귤의 색깔, 껍질의 거친 정도, 무게 등..."
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
          <div className="mt-4 flex justify-end">
             <button
              onClick={handleFeaturesSubmit}
              disabled={features.length < 3}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              다음 단계 <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Select ML Type
  if (step === 3) {
    return (
      <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            AI 학습 방법(모델) 선택
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {(['supervised', 'unsupervised', 'reinforcement'] as MLType[]).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedMLType(type)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedMLType === type 
                  ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200' 
                  : 'border-slate-200 hover:border-indigo-300 bg-white'
              }`}
            >
              <h3 className="font-bold text-lg text-slate-800 mb-1">{ML_TYPE_LABELS[type]}</h3>
              <p className="text-sm text-slate-500">
                {type === 'supervised' && '정답이 있는 데이터를 학습해요.'}
                {type === 'unsupervised' && '정답 없이 데이터의 패턴을 찾아요.'}
                {type === 'reinforcement' && '보상과 벌칙을 통해 스스로 성장해요.'}
              </p>
            </button>
          ))}
        </div>

        <div className="flex justify-between mt-8">
            <button onClick={() => setStep(2)} className="text-slate-500 hover:text-slate-700 px-4 py-2">
                이전으로
            </button>
            <button
              onClick={handleFinalSubmit}
              disabled={!selectedMLType || isGenerating}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> 시뮬레이션 중...
                </>
              ) : (
                <>
                   프로젝트 시작 <Save size={20} />
                </>
              )}
            </button>
        </div>
      </div>
    );
  }

  // Step 4: Result
  if (step === 4 && result) {
    return (
      <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
         <div className={`p-1 rounded-2xl bg-gradient-to-r ${result.score === 100 ? 'from-green-400 to-emerald-500' : result.score >= 50 ? 'from-yellow-400 to-orange-500' : 'from-red-400 to-pink-500'}`}>
            <div className="bg-white rounded-xl p-8 text-center">
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${result.score >= 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {result.score >= 50 ? <CheckCircle size={40} /> : <AlertCircle size={40} />}
                </div>
                
                <h2 className="text-2xl font-bold mb-2">
                    {result.score === 100 ? '완벽한 설계입니다! 👏' : result.score >= 50 ? '좋은 시도예요! 👍' : '조금 아쉬워요 😅'}
                </h2>
                <p className="text-slate-500 mb-6">적합성 점수: <span className="font-bold text-slate-800 text-lg">{result.score}점</span></p>

                <div className="bg-slate-50 p-6 rounded-xl text-left border border-slate-100 mb-8">
                    <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        🤖 AI 선생님의 시뮬레이션 리포트
                    </h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {result.feedback}
                    </p>
                </div>

                <button 
                    onClick={reset}
                    className="bg-slate-900 text-white px-8 py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                    다른 문제 도전하기
                </button>
            </div>
         </div>
      </div>
    );
  }

  return null;
};

export default TabSimulation;