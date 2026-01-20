import React, { useState } from 'react';
import { DailyMission } from '../types';

interface Props {
  mission: DailyMission;
}

const QuizTab: React.FC<Props> = ({ mission }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.toLowerCase().includes(mission.quizAnswer.toLowerCase()) || 
        mission.quizAnswer.toLowerCase().includes(answer.toLowerCase())) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 mt-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">📝 일일 확인 퀴즈</h2>
      
      <div className="mb-8">
        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">문제</span>
        <p className="text-lg text-slate-700 mt-2 font-medium">{mission.quizQuestion}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">정답 입력</label>
          <input 
            type="text" 
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="답을 입력하세요..."
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors"
        >
          제출하기
        </button>
      </form>

      {feedback === 'correct' && (
        <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
          <strong>✅ 정답입니다!</strong> {mission.quizAnswer}
        </div>
      )}
      
      {feedback === 'incorrect' && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
          <strong>❌ 다시 생각해보세요.</strong> 힌트: 이론 탭을 참고하세요.
        </div>
      )}
    </div>
  );
};

export default QuizTab;