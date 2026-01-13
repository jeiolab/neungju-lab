import React from 'react';
import { UserState } from '../types';
import { BADGES, CONCEPTS } from '../constants';
import { Lock, FileText, AlertCircle } from 'lucide-react';

interface MoreViewProps {
  user: UserState;
}

const MoreView: React.FC<MoreViewProps> = ({ user }) => {
  const weakConcepts = CONCEPTS.filter(c => (user.mastery[c.id] || 0) < 60);

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">나의 업적</h3>
        <div className="grid grid-cols-4 gap-4">
          {BADGES.map(badge => {
            const isUnlocked = badge.condition(user);
            return (
              <div key={badge.id} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${isUnlocked ? 'bg-yellow-100' : 'bg-gray-100 grayscale opacity-50'}`}>
                  {isUnlocked ? badge.icon : <Lock size={16} />}
                </div>
                <span className="text-xs font-bold text-gray-700">{badge.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakness Analysis */}
      {weakConcepts.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
            <AlertCircle className="text-orange-500 mr-2" size={20} />
            취약 개념 분석
          </h3>
          <p className="text-sm text-gray-600 mb-4">다음 개념들의 숙련도가 낮습니다. 다시 학습해보세요.</p>
          <div className="space-y-2">
            {weakConcepts.map(c => (
              <div key={c.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="font-medium text-sm text-gray-800">{c.title}</span>
                <span className="text-xs font-bold text-orange-600">{user.mastery[c.id] || 0}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wrong Notes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
           <FileText className="mr-2" size={20}/> 오답 노트
        </h3>
        {user.wrongNotes.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">오답 내역이 없습니다. 완벽하시네요!</p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {user.wrongNotes.slice().reverse().map((note, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="text-xs text-gray-400 mb-1">{new Date(note.timestamp).toLocaleDateString()}</div>
                <div className="text-sm font-medium text-red-600 mb-1">내 오답: {note.wrongAnswer}</div>
                <div className="text-xs text-gray-500">ID: {note.questionId} (퀴즈 탭에서 다시 풀어보세요)</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
        <h3 className="text-lg font-bold mb-4">디지털 사회 특성 한 장 요약</h3>
        <ul className="space-y-2 text-sm text-indigo-100 list-disc pl-4">
          <li><strong>정보 가치:</strong> 데이터가 가공되어 부가가치를 창출함.</li>
          <li><strong>네트워크:</strong> 시공간 제약 없는 쌍방향 소통.</li>
          <li><strong>맞춤형 서비스:</strong> 편의성 vs 필터 버블/프라이버시.</li>
          <li><strong>보안:</strong> 익명성, 비대면성으로 인한 범죄 주의.</li>
        </ul>
      </div>
    </div>
  );
};

export default MoreView;