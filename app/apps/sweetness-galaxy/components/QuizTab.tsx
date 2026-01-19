import React, { useState } from 'react';
import { HelpCircle, Check, X, Loader2, Award } from 'lucide-react';
import { QuizQuestion } from '../types';
import { fetchQuizExplanation } from '../services/geminiService';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '지도 학습(분류)'에 해당하는 것은?",
    options: ["강아지와 고양이 사진 구분하기", "비슷한 쇼핑 습관을 가진 고객끼리 묶기", "내일의 주식 가격 예측하기", "아무렇게나 흩어진 별들 그룹 짓기"],
    correctIndex: 0,
    explanationType: "분류(Classification)"
  },
  {
    id: 2,
    question: "경찰서 위치를 학교들의 중심점으로 이동시키는 알고리즘은 무엇과 가장 관련이 깊나요?",
    options: ["로지스틱 회귀", "K-Means 군집화", "의사결정 나무", "강화 학습"],
    correctIndex: 1,
    explanationType: "K-Means 군집화"
  },
  {
    id: 3,
    question: "당도와 무게 데이터를 보고 '판매 가능/불가능'을 판단하는 것은?",
    options: ["회귀(Regression)", "군집(Clustering)", "분류(Classification)", "차원 축소"],
    correctIndex: 2,
    explanationType: "이진 분류"
  }
];

interface QuizTabProps {
  onBadgeEarned: () => void;
}

const QuizTab: React.FC<QuizTabProps> = ({ onBadgeEarned }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleOptionClick = async (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(index);
    const correct = index === QUESTIONS[currentQIndex].correctIndex;
    setIsCorrect(correct);

    if (correct) setScore(prev => prev + 1);

    setLoading(true);
    // Call Gemini for dynamic explanation
    const explainText = await fetchQuizExplanation(
      QUESTIONS[currentQIndex].explanationType,
      correct
    );
    setExplanation(explainText);
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setExplanation(null);
    } else {
      setCompleted(true);
      if (score === QUESTIONS.length) {
        onBadgeEarned();
      }
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-fadeIn p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 text-center max-w-md w-full">
          {score === QUESTIONS.length ? (
            <>
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-12 h-12 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">데이터 마스터 등극!</h2>
              <p className="text-slate-600 mb-6">모든 문제를 맞히셨군요. 훌륭한 연구원입니다.</p>
            </>
          ) : (
            <>
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Activity className="w-12 h-12 text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">연구 완료</h2>
              <p className="text-slate-600 mb-6">{QUESTIONS.length}문제 중 {score}문제를 맞혔습니다.</p>
            </>
          )}
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors"
          >
            다시 도전하기
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQIndex];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn p-4 pb-20">
      <div className="flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>Question {currentQIndex + 1} / {QUESTIONS.length}</span>
        <span>점수: {score}</span>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={selectedOption !== null}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between
                ${selectedOption === null 
                  ? 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50' 
                  : selectedOption === idx 
                    ? isCorrect 
                      ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                      : 'border-red-500 bg-red-50 ring-2 ring-red-200'
                    : idx === question.correctIndex
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-100 text-slate-400'
                }
              `}
            >
              <span className="font-medium">{opt}</span>
              {selectedOption === idx && (
                isCorrect ? <Check className="text-green-600 w-5 h-5" /> : <X className="text-red-600 w-5 h-5" />
              )}
            </button>
          ))}
        </div>

        {selectedOption !== null && (
          <div className="mt-6 animate-fadeIn">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-indigo-100 p-1.5 rounded-lg">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="font-bold text-indigo-900 text-sm">AI 연구원의 해설</span>
              </div>
              
              {loading ? (
                <div className="flex items-center gap-2 text-slate-500 text-sm py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gemini가 해설을 생성하고 있습니다...
                </div>
              ) : (
                <p className="text-slate-700 text-sm leading-relaxed">
                  {explanation}
                </p>
              )}
            </div>

            <button
              onClick={nextQuestion}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200"
            >
              {currentQIndex < QUESTIONS.length - 1 ? '다음 문제' : '결과 확인'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper icon import (Activity was missing in imports)
import { Activity } from 'lucide-react';

export default QuizTab;