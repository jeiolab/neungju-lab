'use client'

import React, { useState } from 'react';
import { QuizSettings, Difficulty, TOPICS, QuestionType } from '../types';
import { Button } from './Button';

interface SetupScreenProps {
  onStart: (settings: QuizSettings) => void;
  isLoading: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [topic, setTopic] = useState(TOPICS[0]);
  const [count, setCount] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.NORMAL);
  const [preferredType, setPreferredType] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      topic,
      count,
      difficulty,
      preferredType: preferredType as QuestionType | undefined
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">네트워크 퀴즈 챌린지</h1>
        <p className="text-gray-600">AI와 함께 네트워크 지식을 테스트해보세요!</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Topic Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">주제 선택</label>
          <select 
            value={topic} 
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Difficulty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">난이도</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(Difficulty).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`p-2 text-sm rounded-lg border transition-colors ${
                  difficulty === level 
                    ? 'bg-primary/10 border-primary text-primary font-bold' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">문제 수: {count}문제</label>
          <input 
            type="range" 
            min="3" 
            max="10" 
            value={count} 
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3개</span>
            <span>10개</span>
          </div>
        </div>

        {/* Type Preference (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">선호 유형 (선택)</label>
          <select 
            value={preferredType} 
            onChange={(e) => setPreferredType(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="">랜덤 (추천)</option>
            <option value={QuestionType.MULTIPLE_CHOICE}>객관식</option>
            <option value={QuestionType.OX}>OX 퀴즈</option>
            <option value={QuestionType.SHORT_ANSWER}>단답형</option>
          </select>
        </div>

        <Button 
          type="submit" 
          fullWidth 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              문제 생성 중...
            </span>
          ) : "퀴즈 시작하기"}
        </Button>
      </form>
    </div>
  );
};

