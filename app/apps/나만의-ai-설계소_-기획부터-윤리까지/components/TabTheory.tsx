import React from 'react';
import { BookOpen, Scale, AlertTriangle, CheckCircle } from 'lucide-react';

const TabTheory: React.FC = () => {
  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="text-blue-600" /> 1. AI 모델 성능 평가
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-slate-700">혼동 행렬 (Confusion Matrix)</h3>
            <p className="text-slate-600 text-sm mb-3">
              분류 모델이 얼마나 잘 맞췄는지 보여주는 표입니다.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="bg-green-100 p-2 rounded">True Positive<br/>(진짜 양성)</div>
              <div className="bg-red-100 p-2 rounded">False Positive<br/>(가짜 양성/오탐)</div>
              <div className="bg-red-100 p-2 rounded">False Negative<br/>(가짜 음성/미탐)</div>
              <div className="bg-green-100 p-2 rounded">True Negative<br/>(진짜 음성)</div>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-slate-700">주요 지표</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>정확도 (Accuracy):</strong> 전체 중 정답 비율</li>
              <li><strong>정밀도 (Precision):</strong> 모델이 True라고 한 것 중 실제 True 비율</li>
              <li><strong>재현율 (Recall):</strong> 실제 True 중 모델이 찾은 비율</li>
              <li className="text-xs text-slate-500 mt-2">*암 진단 같은 경우 재현율이 중요합니다! (놓치면 위험하니까요)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Scale className="text-indigo-600" /> 2. AI 윤리 핵심
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="bg-yellow-100 p-2 rounded-full shrink-0">
              <AlertTriangle className="text-yellow-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">편향성 (Bias)</h3>
              <p className="text-slate-600 text-sm">
                학습 데이터가 특정 인종, 성별, 계층에 치우쳐 있으면 AI도 차별적인 결과를 냅니다.
                <br/><span className="text-xs text-slate-500">예: 남성 이력서만 학습한 채용 AI가 여성을 불합격시킴.</span>
              </p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-green-100 p-2 rounded-full shrink-0">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">공정성 (Fairness)</h3>
              <p className="text-slate-600 text-sm">
                AI의 결정이 특정 집단에 불이익을 주지 않도록 설계해야 합니다.
                설명 가능한 AI(XAI) 기술을 통해 결정 이유를 투명하게 공개하는 것도 중요합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabTheory;