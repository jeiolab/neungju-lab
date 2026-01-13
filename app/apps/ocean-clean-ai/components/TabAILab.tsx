import React, { useState, useEffect } from 'react';
import { TrashClass, TrainingState, TestResult } from '../types';
import { Plus, Trash2, Camera, Play, Activity, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { generateSimulationFeedback } from '../services/geminiService';

interface TabAILabProps {
  onScoreUpdate: (points: number) => void;
  onBadgeUnlock: (badgeId: string) => void;
}

const INITIAL_CLASSES: TrashClass[] = [
  { id: '1', name: '페트병', sampleCount: 0, icon: '🧴' },
  { id: '2', name: '캔', sampleCount: 0, icon: '🥫' },
];

// Placeholder images for simulation
const TEST_IMAGES = [
  { url: 'https://picsum.photos/300/300?random=1', type: '페트병' },
  { url: 'https://picsum.photos/300/300?random=2', type: '캔' },
  { url: 'https://picsum.photos/300/300?random=3', type: '유리병' },
  { url: 'https://picsum.photos/300/300?random=4', type: '물고기' }, // Trick
];

const TabAILab: React.FC<TabAILabProps> = ({ onScoreUpdate, onBadgeUnlock }) => {
  const [classes, setClasses] = useState<TrashClass[]>(INITIAL_CLASSES);
  const [newClassName, setNewClassName] = useState('');
  const [training, setTraining] = useState<TrainingState>({
    isTraining: false,
    progress: 0,
    accuracy: 0,
    version: 0,
    isModelReady: false,
  });
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);

  // Add Class
  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const newClass: TrashClass = {
      id: Date.now().toString(),
      name: newClassName,
      sampleCount: 0,
      icon: '📦',
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    // Reset model if structure changes
    setTraining(prev => ({ ...prev, isModelReady: false, accuracy: 0 }));
  };

  // Collect Data (Simulated)
  const handleCollectData = (id: string) => {
    setClasses(classes.map(c => 
      c.id === id ? { ...c, sampleCount: c.sampleCount + 1 } : c
    ));
    setTraining(prev => ({ ...prev, isModelReady: false })); // Need to retrain
  };

  // Train Model (Wizard Mode)
  const handleTrainModel = () => {
    const totalSamples = classes.reduce((acc, curr) => acc + curr.sampleCount, 0);
    
    if (totalSamples === 0) {
      alert("먼저 데이터를 수집해야 합니다!");
      return;
    }

    setTraining(prev => ({ ...prev, isTraining: true, progress: 0 }));

    // Simulation loop
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTraining(prev => ({ ...prev, progress }));
      
      if (progress >= 100) {
        clearInterval(interval);
        // Calculate "fake" accuracy based on sample volume
        // Formula: Diminishing returns. 10 samples = ~50%, 50 samples = ~90%
        const rawAccuracy = Math.min(98, Math.floor(100 * (1 - Math.exp(-totalSamples / 15))));
        
        setTraining({
          isTraining: false,
          progress: 100,
          accuracy: rawAccuracy,
          version: training.version + 1,
          isModelReady: true,
        });

        if (rawAccuracy > 80) onBadgeUnlock('tech_pioneer');
      }
    }, 100);
  };

  // Test Model
  const handleTestModel = async () => {
    if (!training.isModelReady) return;

    setIsAnalysing(true);
    const randomScenario = TEST_IMAGES[Math.floor(Math.random() * TEST_IMAGES.length)];
    
    // Determine if prediction is correct based on accuracy probability
    const isCorrect = Math.random() * 100 < training.accuracy;
    
    // Pick a predicted type
    let predicted = randomScenario.type;
    if (!isCorrect) {
        // Pick a wrong class or "Unknown"
        const otherClasses = classes.filter(c => c.name !== randomScenario.type);
        predicted = otherClasses.length > 0 
            ? otherClasses[Math.floor(Math.random() * otherClasses.length)].name 
            : '돌멩이'; // Fallback error
    }

    // Call Gemini for a fun description
    const aiFeedback = await generateSimulationFeedback(classes, training.accuracy, randomScenario.type);

    setTestResult({
        imageUrl: randomScenario.url,
        actualType: randomScenario.type,
        predictedType: predicted,
        confidence: isCorrect ? Math.floor(80 + Math.random() * 19) : Math.floor(30 + Math.random() * 30),
        message: aiFeedback,
        isCorrect
    });
    
    setIsAnalysing(false);

    if (isCorrect) {
        onScoreUpdate(10); // 10m clean
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-6 h-full">
      {/* LEFT: Data Studio */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" /> 1. 데이터 수집
            </h3>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{cls.icon}</span>
                            <div>
                                <p className="font-semibold text-slate-700">{cls.name}</p>
                                <p className="text-xs text-slate-500">{cls.sampleCount}개 샘플</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleCollectData(cls.id)}
                            className="bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 p-2 rounded-lg transition-all active:scale-95"
                            title="가상 샘플 추가"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex gap-2">
                <input 
                    type="text" 
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="새 클래스 (예: 유리)"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handleAddClass}
                    className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700"
                >
                    추가
                </button>
            </div>
        </div>

        {/* Training Control */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" /> 2. 모델 학습
            </h3>
            
            <div className="space-y-4">
                <div className="flex justify-between text-sm text-slate-600">
                    <span>모델 버전: v{training.version}.0</span>
                    <span>상태: {training.isTraining ? '학습 중...' : training.isModelReady ? '준비 완료' : '학습 필요'}</span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100"
                        style={{ width: `${training.progress}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                     <span className={`text-2xl font-bold ${training.accuracy > 80 ? 'text-green-600' : 'text-slate-400'}`}>
                        {training.accuracy}% <span className="text-xs font-normal text-slate-500">예상 정확도</span>
                     </span>
                     <button
                        onClick={handleTrainModel}
                        disabled={training.isTraining}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all ${
                            training.isTraining ? 'bg-slate-400 cursor-wait' : 'bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg'
                        }`}
                     >
                        {training.isTraining ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Play className="w-4 h-4" />}
                        {training.isTraining ? '학습 중...' : '모델 학습하기'}
                     </button>
                </div>
            </div>
        </div>
      </div>

      {/* RIGHT: Testing Area */}
      <div className="lg:col-span-7">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" /> 3. 현장 테스트
                </h3>
                <button
                    onClick={handleTestModel}
                    disabled={!training.isModelReady || isAnalysing}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-bold shadow-sm transition-all"
                >
                    {isAnalysing ? '스캔 중...' : '테스트 실행'}
                </button>
            </div>

            <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {!training.isModelReady && !testResult && (
                    <div className="text-center text-slate-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>테스트 환경을 활성화하려면 모델을 학습시키세요.</p>
                    </div>
                )}

                {training.isModelReady && !testResult && !isAnalysing && (
                    <div className="text-center text-slate-500">
                         <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>배포 준비 완료. "테스트 실행"을 클릭하여 바다 속 상황을 시뮬레이션하세요.</p>
                    </div>
                )}

                {isAnalysing && (
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center backdrop-blur-sm z-10">
                        <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col items-center animate-bounce">
                             <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                             <span className="text-sm font-bold text-blue-600">물체 분석 중...</span>
                        </div>
                    </div>
                )}

                {testResult && !isAnalysing && (
                    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden animate-in zoom-in duration-300">
                        <div className="relative h-48 bg-slate-200">
                            <img src={testResult.imageUrl} alt="Test Subject" className="w-full h-full object-cover" />
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${testResult.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                                {testResult.isCorrect ? '성공' : '실패'}
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">모델 예측</p>
                                    <h4 className="text-xl font-bold text-slate-800">{testResult.predictedType}</h4>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 uppercase font-bold">신뢰도</p>
                                    <h4 className="text-xl font-bold text-blue-600">{testResult.confidence}%</h4>
                                </div>
                            </div>
                            
                            <div className={`p-3 rounded-lg text-sm border ${testResult.isCorrect ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                                <p className="font-semibold mb-1">피드백:</p>
                                <p>{testResult.message}</p>
                            </div>

                            {!testResult.isCorrect && (
                                <p className="mt-3 text-xs text-center text-slate-400">실제 물체: {testResult.actualType}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TabAILab;