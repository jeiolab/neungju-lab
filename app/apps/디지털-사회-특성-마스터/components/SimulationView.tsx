import React, { useState, useEffect } from 'react';
import { SimulationResult } from '../types';
import { Settings, ShieldAlert, BadgeCheck } from 'lucide-react';

const SimulationView: React.FC = () => {
  const [dataLevel, setDataLevel] = useState(50);
  const [accuracyTarget, setAccuracyTarget] = useState(50);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    // Simple logic engine
    const quality = Math.min(100, (dataLevel * 0.7) + (accuracyTarget * 0.3));
    const randomRisk = Math.random() * 10;
    const risk = Math.min(100, (dataLevel * 0.8) + (accuracyTarget * 0.1) + randomRisk);

    let feedbackText = {
      observation: '',
      reason: '',
      suggestion: ''
    };

    if (quality > 80 && risk > 80) {
      feedbackText = {
        observation: "추천 품질은 완벽하지만, 프라이버시 위험이 매우 높습니다!",
        reason: "너무 많은 개인정보(위치, 취향, 친구 등)를 제공했기 때문입니다.",
        suggestion: "필수적이지 않은 정보 제공 동의는 체크 해제해보는 건 어떨까요?"
      };
    } else if (quality < 40 && risk < 30) {
      feedbackText = {
        observation: "안전하지만, 추천 서비스가 엉뚱한 정보를 줍니다.",
        reason: "데이터 제공량이 너무 적어 알고리즘이 내 취향을 파악하지 못했습니다.",
        suggestion: "꼭 필요한 서비스에는 최소한의 데이터를 제공해야 편의성을 누릴 수 있습니다."
      };
    } else {
        feedbackText = {
            observation: "편의성과 안전성 사이에서 균형을 찾아가고 있습니다.",
            reason: "데이터 제공량에 비례해 위험도와 품질이 함께 변합니다.",
            suggestion: "디지털 리터러시는 이 균형점을 스스로 결정하는 능력입니다."
        }
    }

    setResult({
      qualityScore: Math.round(quality),
      riskScore: Math.round(risk),
      feedback: feedbackText
    });
  }, [dataLevel, accuracyTarget]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">맞춤형 서비스 실험실</h2>
        <p className="text-sm text-gray-600 mb-6">
          내 정보를 얼마나 줄지 결정해보세요. 추천의 정확도와 개인정보 위험이 어떻게 변할까요?
        </p>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">정보 제공 수준</label>
              <span className="text-sm font-mono text-indigo-600">{dataLevel}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={dataLevel} 
              onChange={(e) => setDataLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-xs text-gray-400 mt-1">왼쪽: 최소 정보 | 오른쪽: 모든 정보(위치/연락처/사진 등)</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold text-gray-700">목표 추천 정확도</label>
              <span className="text-sm font-mono text-indigo-600">{accuracyTarget}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={accuracyTarget} 
              onChange={(e) => setAccuracyTarget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <BadgeCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">추천 품질</div>
              <div className="text-2xl font-black text-blue-600">{result.qualityScore}점</div>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">프라이버시 위험</div>
              <div className="text-2xl font-black text-red-600">{result.riskScore}점</div>
            </div>
          </div>

          <div className="bg-gray-800 text-white p-5 rounded-xl space-y-3">
            <div className="flex items-start">
              <span className="bg-gray-700 text-[10px] px-2 py-0.5 rounded mr-2 mt-0.5 shrink-0">관찰</span>
              <p className="text-sm">{result.feedback.observation}</p>
            </div>
            <div className="flex items-start">
              <span className="bg-indigo-600 text-[10px] px-2 py-0.5 rounded mr-2 mt-0.5 shrink-0">이유</span>
              <p className="text-sm text-gray-300">{result.feedback.reason}</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-600 text-[10px] px-2 py-0.5 rounded mr-2 mt-0.5 shrink-0">제안</span>
              <p className="text-sm text-gray-300">{result.feedback.suggestion}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationView;