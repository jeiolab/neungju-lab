import React from 'react';
import { UserState } from '../types';
import { Trophy, Flame, Brain, Award } from 'lucide-react';
import { CONCEPTS } from '../constants';

interface DashboardProps {
  userState: UserState;
}

const Dashboard: React.FC<DashboardProps> = ({ userState }) => {
  // Calculate average mastery
  const totalConcepts = CONCEPTS.length;
  let totalMasteryScore = 0;

  // Simple mastery calculation for display: 
  // (Understood Cards / Total) * 50 + (Quiz Accuracy) * 50
  // But using the formula from prompts is better handled in App.tsx or utils.
  // Here we just aggregate the pre-calculated mastery scores if they exist, or approximate.
  
  // Approximation for display
  const understoodCount = Object.values(userState.cardStatus).filter(s => s === 'understood').length;
  const checkCount = Object.values(userState.checkQuestionHistory).filter(b => b).length;
  const overallProgress = Math.round(((understoodCount + checkCount) / (totalConcepts * 2)) * 100);

  return (
    <div className="bg-white p-4 shadow-sm mb-4 sticky top-0 z-10 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-600" />
            머신러닝 카드덱
          </h1>
          <p className="text-xs text-gray-500">규칙을 찾는 공부 친구</p>
        </div>
        
        <div className="flex gap-4 text-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-orange-500 font-bold">
              <Flame className="w-4 h-4" />
              <span>{userState.streak}일</span>
            </div>
            <span className="text-[10px] text-gray-400">연속 학습</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-blue-600 font-bold">
              <Trophy className="w-4 h-4" />
              <span>{overallProgress}%</span>
            </div>
            <span className="text-[10px] text-gray-400">개념 탐험</span>
          </div>
          
           <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-purple-600 font-bold">
              <Award className="w-4 h-4" />
              <span>{userState.badges.length}</span>
            </div>
            <span className="text-[10px] text-gray-400">배지</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
