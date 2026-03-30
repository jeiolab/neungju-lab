import React, { useState, useEffect } from 'react';
import { INITIAL_INGREDIENTS } from '../../constants';
import { SimulationState } from '../../types';
import { Trash2, ChefHat, Play, RefreshCw, AlertTriangle, CheckCircle, Utensils } from 'lucide-react';

interface Props {
  onComplete: (score: number) => void;
}

export const SimulationTab: React.FC<Props> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<SimulationState>({
    stage: 0,
    ingredients: JSON.parse(JSON.stringify(INITIAL_INGREDIENTS)),
    cleanedCount: 0,
    noiseRemovedCount: 0,
    totalNoise: INITIAL_INGREDIENTS.filter(i => i.type === 'noise').length,
    isSplitCorrectly: false,
    selectedModel: null,
    accuracy: 0,
    feedback: ""
  });

  const [isCooking, setIsCooking] = useState(false);

  // Stage 1: Preprocessing Logic
  const toggleIngredient = (id: number) => {
    if (gameState.stage !== 0) return;
    setGameState(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(ing => 
        ing.id === id ? { ...ing, isSelected: !ing.isSelected } : ing
      )
    }));
  };

  const finishPrep = () => {
    const keptIngredients = gameState.ingredients.filter(i => !i.isSelected);
    const noiseRemaining = keptIngredients.filter(i => i.type === 'noise').length;
    const goodRemoved = gameState.ingredients.filter(i => i.isSelected && i.type === 'good').length;
    const noiseRemoved = gameState.totalNoise - noiseRemaining;

    let feedback = "준비 완료!";
    if (noiseRemaining > 0) feedback = "앗, 상한 재료가 아직 남아있어요!";
    if (goodRemoved > 0) feedback = "멀쩡한 재료를 너무 많이 버렸어요!";
    if (noiseRemaining === 0 && goodRemoved === 0) feedback = "완벽하게 손질했군요!";

    setGameState(prev => ({
      ...prev,
      stage: 1,
      noiseRemovedCount: noiseRemoved,
      feedback
    }));
  };

  // Stage 2: Splitting Logic
  const handleSplit = (splitType: 'proper' | 'all') => {
    setGameState(prev => ({
      ...prev,
      stage: 2,
      isSplitCorrectly: splitType === 'proper',
      feedback: splitType === 'proper' 
        ? "좋아요! 맛보기용(테스트) 재료를 따로 남겨두었습니다." 
        : "주의! 모든 재료를 요리에 다 써버렸습니다. 나중에 맛을 어떻게 보죠?"
    }));
  };

  // Stage 3: Training Logic
  const startTraining = (model: 'classification' | 'prediction') => {
    setGameState(prev => ({ ...prev, selectedModel: model }));
    setIsCooking(true);
    
    setTimeout(() => {
      setIsCooking(false);
      calculateResult(model);
    }, 2500);
  };

  // Stage 4: Calculation
  const calculateResult = (model: 'classification' | 'prediction') => {
    // Score Calculation Logic
    // Base score: 50
    // Noise penalty: -20 per noise kept
    // Good removed penalty: -10 per good removed
    // Split penalty: If not split correctly, displayed accuracy is high (overfitting) but actual utility is low.
    
    const remainingIngredients = gameState.ingredients.filter(i => !i.isSelected);
    const noiseCount = remainingIngredients.filter(i => i.type === 'noise').length;
    
    let accuracy = 95; // Start high
    
    // Impact of noise (Garbage In)
    accuracy -= (noiseCount * 25); 

    // Impact of splitting (Overfitting)
    // If mixed (not split correctly), accuracy looks artificially high on training data, 
    // but we simulate the 'Test' result here.
    // In this educational simplified model:
    // If mixed: The system alerts "Overfitting Detected".
    // If proper split: Shows real accuracy.
    
    if (accuracy < 0) accuracy = 10;
    if (accuracy > 99) accuracy = 99;

    let finalFeedback = "";
    if (!gameState.isSplitCorrectly) {
      finalFeedback = "경고: 과적합(Overfitting)! 훈련 데이터와 테스트 데이터를 섞어서 썼기 때문에, 새로운 데이터에서는 엉망일 수 있습니다.";
      // Penalty for score completion
    } else if (noiseCount > 0) {
      finalFeedback = `결과가 조금 이상해요. ${noiseCount}개의 상한 재료(노이즈)가 들어가서 맛이 변질되었습니다.`;
    } else {
      finalFeedback = "환상적입니다! 깨끗한 데이터와 올바른 절차로 최고의 AI 모델을 만들었어요.";
      onComplete(100);
    }

    setGameState(prev => ({
      ...prev,
      stage: 3,
      accuracy,
      feedback: finalFeedback
    }));
  };

  const resetGame = () => {
    setGameState({
      stage: 0,
      ingredients: JSON.parse(JSON.stringify(INITIAL_INGREDIENTS)),
      cleanedCount: 0,
      noiseRemovedCount: 0,
      totalNoise: INITIAL_INGREDIENTS.filter(i => i.type === 'noise').length,
      isSplitCorrectly: false,
      selectedModel: null,
      accuracy: 0,
      feedback: ""
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
        {['전처리', '분리', '학습', '평가'].map((label, idx) => (
          <div key={idx} className={`flex flex-col items-center ${gameState.stage >= idx ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 transition-colors ${
              gameState.stage >= idx ? 'bg-orange-500 text-white' : 'bg-gray-200'
            }`}>
              {idx + 1}
            </div>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>

      <div className="min-h-[400px]">
        {/* Stage 0: Preprocessing */}
        {gameState.stage === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">재료 다듬기 (데이터 전처리)</h2>
              <p className="text-gray-600">상한 재료(노이즈)를 클릭해서 쓰레기통으로 버려주세요!</p>
            </div>
            
            <div className="grid grid-cols-5 gap-4 justify-items-center">
              {gameState.ingredients.map((ing) => (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                    ing.isSelected 
                      ? 'border-red-500 bg-red-50 opacity-50 grayscale' 
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {ing.type === 'good' ? (ing.name.includes('당근') ? '🥕' : ing.name.includes('감자') ? '🥔' : '🧅') : '🦠'}
                  </div>
                  <span className="text-xs font-bold block text-center">{ing.name}</span>
                  {ing.isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-600">
                      <Trash2 size={32} />
                    </div>
                  )}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <button 
                onClick={finishPrep}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
              >
                손질 완료 <CheckCircle />
              </button>
            </div>
          </div>
        )}

        {/* Stage 1: Splitting */}
        {gameState.stage === 1 && (
          <div className="space-y-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold">데이터 분리</h2>
            <p className="text-gray-600 text-lg">
              요리할 재료와 맛볼 재료를 어떻게 나눌까요?
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center mt-8">
              <button 
                onClick={() => handleSplit('all')}
                className="flex-1 p-6 border-2 border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-400 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🍲</div>
                <h3 className="text-xl font-bold text-red-600 mb-2">몽땅 냄비에 넣기</h3>
                <p className="text-gray-500 text-sm">모든 데이터를 학습에 사용합니다.<br/>(테스트 데이터 없음)</p>
              </button>

              <button 
                onClick={() => handleSplit('proper')}
                className="flex-1 p-6 border-2 border-green-200 rounded-2xl hover:bg-green-50 hover:border-green-400 transition-all group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🍲 + 🍽️</div>
                <h3 className="text-xl font-bold text-green-600 mb-2">맛보기용 남겨두기</h3>
                <p className="text-gray-500 text-sm">일부를 따로 빼둡니다.<br/>(훈련 80% / 테스트 20%)</p>
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Cooking */}
        {gameState.stage === 2 && (
          <div className="space-y-8 text-center animate-fade-in">
            <h2 className="text-2xl font-bold">모델 학습 (요리하기)</h2>
            <p className="text-gray-600">어떤 도구(모델)로 요리하시겠습니까?</p>

            {isCooking ? (
              <div className="flex flex-col items-center justify-center py-12">
                <ChefHat className="w-24 h-24 text-orange-500 animate-bounce mb-4" />
                <p className="text-2xl font-bold text-orange-600 animate-pulse">열심히 학습 중입니다...</p>
                <div className="w-64 h-4 bg-gray-200 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-orange-500 animate-[width_2s_ease-in-out_infinite]" style={{width: '100%'}}></div>
                </div>
              </div>
            ) : (
              <div className="flex gap-6 justify-center mt-8">
                 <button 
                  onClick={() => startTraining('classification')}
                  className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-100 hover:border-blue-500 hover:shadow-xl transition-all w-64"
                >
                  <Utensils className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg">분류기 (Classification)</h3>
                  <p className="text-sm text-gray-500 mt-2">이 재료가 무엇인지 맞추는 모델</p>
                </button>
                <button 
                  onClick={() => startTraining('prediction')}
                  className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-100 hover:border-purple-500 hover:shadow-xl transition-all w-64"
                >
                  <Utensils className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h3 className="font-bold text-lg">예측기 (Regression)</h3>
                  <p className="text-sm text-gray-500 mt-2">맛이 어떨지 점수를 매기는 모델</p>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage 3: Result */}
        {gameState.stage === 3 && (
          <div className="text-center animate-fade-in space-y-6">
            <div className="inline-block p-4 rounded-full bg-orange-100 mb-4">
               {gameState.accuracy > 80 && gameState.isSplitCorrectly ? <CheckCircle size={48} className="text-green-500" /> : <AlertTriangle size={48} className="text-orange-500" />}
            </div>
            
            <h2 className="text-3xl font-bold mb-2">요리(학습) 완료!</h2>
            
            <div className="bg-gray-50 rounded-xl p-8 max-w-lg mx-auto border border-gray-200">
              <div className="flex justify-between items-end mb-4 border-b pb-4">
                <span className="text-gray-600 font-medium">최종 정확도</span>
                <span className={`text-4xl font-bold ${gameState.accuracy > 80 ? 'text-green-600' : 'text-red-500'}`}>
                  {gameState.accuracy}%
                </span>
              </div>
              
              <div className="space-y-3 text-left">
                 <div className="flex items-start gap-2">
                    <span className="mt-1">🥕</span>
                    <p className="text-sm text-gray-600">제거한 노이즈: <span className="font-bold text-black">{gameState.noiseRemovedCount}</span>/{gameState.totalNoise}</p>
                 </div>
                 <div className="flex items-start gap-2">
                    <span className="mt-1">📊</span>
                    <p className="text-sm text-gray-600">데이터 분리: 
                      <span className={`font-bold ml-1 ${gameState.isSplitCorrectly ? 'text-green-600' : 'text-red-600'}`}>
                        {gameState.isSplitCorrectly ? '적절함 (Train/Test)' : '과적합 위험 (Mixed)'}
                      </span>
                    </p>
                 </div>
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200 text-orange-800 font-medium">
                "{gameState.feedback}"
              </div>
            </div>

            <button 
              onClick={resetGame}
              className="mt-6 bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-black transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={20} /> 다시 요리하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};