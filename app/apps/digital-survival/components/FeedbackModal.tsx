'use client'

import React from 'react';
import { EvaluationResult } from '../types';
import { CheckCircle, AlertTriangle, ArrowRight, Lightbulb } from 'lucide-react';

interface Props {
  result: EvaluationResult;
  onNext: () => void;
  loadingNext: boolean;
}

const FeedbackModal: React.FC<Props> = ({ result, onNext, loadingNext }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
        
        {/* Header */}
        <div className={`p-6 border-b flex items-center gap-3 ${result.success ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
          {result.success ? (
            <div className="bg-emerald-100 p-2 rounded-full">
              <CheckCircle className="text-emerald-600 w-6 h-6" />
            </div>
          ) : (
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="text-red-600 w-6 h-6" />
            </div>
          )}
          <h2 className={`text-2xl font-bold ${result.success ? 'text-emerald-800' : 'text-red-800'}`}>
            {result.success ? '성공' : '경고'}
          </h2>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
            {result.outcomeMessage}
          </p>

          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-8">
            <div className="flex items-center gap-2 text-blue-700 font-mono-tech text-xs uppercase mb-2 font-bold">
              <Lightbulb size={16} />
              획득한 지식
            </div>
            <p className="text-blue-900 text-sm italic font-medium">
              &ldquo;{result.acquiredKnowledge}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm font-mono font-bold">
            <div className={`p-3 rounded-lg border ${result.statChanges.data < 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
              데이터 {result.statChanges.data > 0 ? '+' : ''}{result.statChanges.data}
            </div>
            <div className={`p-3 rounded-lg border ${result.statChanges.battery < 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
              배터리 {result.statChanges.battery > 0 ? '+' : ''}{result.statChanges.battery}
            </div>
            <div className={`p-3 rounded-lg border ${result.statChanges.security < 0 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
              보안 {result.statChanges.security > 0 ? '+' : ''}{result.statChanges.security}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onNext}
            disabled={loadingNext}
            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            {loadingNext ? '다음 상황 로딩 중...' : '다음 상황으로'} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
