'use client'

import React from 'react';
import { UserAnswer, Question } from '../types';
import { Button } from './Button';

interface ReportScreenProps {
  answers: UserAnswer[];
  questions: Question[];
  onRetry: () => void;
  onHome: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({ answers, questions, onRetry, onHome }) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = questions.length;
  const score = Math.round((correctCount / totalCount) * 100);

  let levelTitle = "";
  let levelColor = "";
  let levelMessage = "";

  if (score >= 90) {
    levelTitle = "네트워크 마스터";
    levelColor = "text-purple-600";
    levelMessage = "완벽해요! 네트워크 구조가 머릿속에 그려지나요?";
  } else if (score >= 70) {
    levelTitle = "네트워크 라이징 스타";
    levelColor = "text-primary";
    levelMessage = "훌륭합니다! 조금만 더 다듬으면 완벽해질 거예요.";
  } else if (score >= 50) {
    levelTitle = "성실한 탐험가";
    levelColor = "text-blue-600";
    levelMessage = "기본 개념은 잡혔네요. 헷갈리는 부분을 다시 확인해봐요.";
  } else {
    levelTitle = "이제 시작하는 탐험가";
    levelColor = "text-gray-600";
    levelMessage = "괜찮아요. 틀린 문제를 복습하면 금방 실력이 늘 거예요!";
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-center">
        <div className="bg-gradient-to-r from-primary to-purple-600 p-8 text-white">
          <h2 className="text-xl font-medium opacity-90 mb-2">오늘의 학습 리포트</h2>
          <div className="text-6xl font-black mb-4">{score}점</div>
          <p className={`text-2xl font-bold bg-white/20 inline-block px-6 py-2 rounded-full backdrop-blur-sm`}>
            {levelTitle}
          </p>
        </div>
        <div className="p-8">
          <p className="text-gray-600 text-lg mb-6">{levelMessage}</p>
          <div className="flex gap-4 justify-center">
            <div className="text-center p-4 bg-gray-50 rounded-xl min-w-[100px]">
              <div className="text-xs text-gray-500 uppercase tracking-wide">문제 수</div>
              <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl min-w-[100px]">
              <div className="text-xs text-green-600 uppercase tracking-wide">정답</div>
              <div className="text-2xl font-bold text-green-700">{correctCount}</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl min-w-[100px]">
              <div className="text-xs text-red-600 uppercase tracking-wide">오답</div>
              <div className="text-2xl font-bold text-red-700">{totalCount - correctCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span> 문제 다시보기
        </h3>
        
        <div className="space-y-6">
          {questions.map((q, idx) => {
            const userAnswer = answers.find(a => a.questionId === q.id);
            const isCorrect = userAnswer?.isCorrect;

            return (
              <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-l-green-400 bg-gray-50' : 'border-l-red-400 bg-red-50/50'}`}>
                <div className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 mb-2">{q.questionText}</p>
                    <div className="text-sm space-y-1">
                      {!isCorrect && (
                        <p className="text-red-600">
                          <span className="font-bold">내가 쓴 답:</span> {userAnswer?.userInput || "(입력 없음)"}
                        </p>
                      )}
                      <p className="text-green-700">
                        <span className="font-bold">정답:</span> {q.correctAnswer}
                      </p>
                      <p className="text-gray-600 mt-2 text-xs bg-white p-2 rounded border border-gray-100">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center pb-8">
        <Button variant="outline" onClick={onHome}>
          처음으로
        </Button>
        <Button onClick={onRetry}>
          새로운 문제 도전
        </Button>
      </div>
    </div>
  );
};

