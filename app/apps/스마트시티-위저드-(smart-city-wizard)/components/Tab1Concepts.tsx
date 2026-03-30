import React, { useState } from 'react';
import { CONCEPTS } from '../constants';
import { CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Tab1Concepts: React.FC<Props> = ({ onComplete }) => {
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const problems = [
    { id: 'p1', text: '밤에 골목길이 너무 어둡고 위험해요.' },
    { id: 'p2', text: '집에 아무도 없을 때 화재가 날까 걱정돼요.' },
    { id: 'p3', text: '버스 정류장에서 버스가 언제 올지 모르겠어요.' },
  ];

  const solutions = [
    { id: 's1', text: '동작 감지 스마트 가로등', match: 'p1' },
    { id: 's2', text: '스마트 화재 감지기 및 자동 신고', match: 'p2' },
    { id: 's3', text: '버스 도착 정보 안내 시스템', match: 'p3' },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, problemId: string) => {
    e.preventDefault();
    const solutionId = e.dataTransfer.getData('text/plain');
    setMatches(prev => ({ ...prev, [problemId]: solutionId }));
  };

  const checkAnswers = () => {
    let correct = 0;
    problems.forEach(p => {
      const solutionId = matches[p.id];
      const solution = solutions.find(s => s.id === solutionId);
      if (solution && solution.match === p.id) {
        correct++;
      }
    });
    setScore(correct);
    setShowResult(true);
    if (correct === problems.length) {
      onComplete();
    }
  };

  const resetGame = () => {
    setMatches({});
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">1. 개념 카드 뒤집기</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CONCEPTS.map((c, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-indigo-50 hover:shadow-lg transition-shadow group">
              <h3 className="font-bold text-lg text-indigo-600 mb-2">{c.term}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-indigo-800">2. 문제-해결 짝꿍 찾기</h2>
            <button onClick={resetGame} className="text-sm flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                <RefreshCcw size={16}/> 초기화
            </button>
        </div>
        
        <p className="mb-4 text-slate-600">오른쪽의 <strong>해결책(파란 카드)</strong>을 드래그하여 왼쪽의 <strong>문제(회색 박스)</strong>에 놓아주세요.</p>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="space-y-4 flex-1">
            <h3 className="font-bold text-center text-slate-700 mb-2">우리 동네 문제</h3>
            {problems.map(p => (
              <div
                key={p.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, p.id)}
                className={`p-4 rounded-lg border-2 border-dashed min-h-[80px] flex items-center justify-between transition-colors ${
                    matches[p.id] ? 'bg-white border-indigo-300' : 'bg-slate-100 border-slate-300'
                }`}
              >
                <span className="text-sm font-medium">{p.text}</span>
                {matches[p.id] && (
                    <span className="ml-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                        {solutions.find(s => s.id === matches[p.id])?.text}
                    </span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4 flex-1">
            <h3 className="font-bold text-center text-slate-700 mb-2">IoT 해결책</h3>
            {solutions.map(s => {
                const isUsed = Object.values(matches).includes(s.id);
                return (
                    <div
                        key={s.id}
                        draggable={!isUsed}
                        onDragStart={(e) => handleDragStart(e, s.id)}
                        className={`p-4 rounded-lg shadow-sm border text-sm font-medium cursor-grab active:cursor-grabbing transition-all ${
                            isUsed 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                            : 'bg-white border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400 text-indigo-900'
                        }`}
                    >
                        {s.text}
                    </div>
                )
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
            {!showResult ? (
                <button 
                    onClick={checkAnswers} 
                    className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors"
                >
                    정답 확인하기
                </button>
            ) : (
                <div className="animate-bounce-in">
                    {score === problems.length ? (
                        <div className="text-green-600 flex flex-col items-center gap-2">
                            <CheckCircle2 size={48} />
                            <span className="font-bold text-xl">완벽해요! 모든 문제를 해결했습니다. (+10 XP)</span>
                        </div>
                    ) : (
                        <div className="text-red-500 flex flex-col items-center gap-2">
                            <XCircle size={48} />
                            <span className="font-bold text-xl">{score}개 맞았습니다. 다시 시도해보세요!</span>
                        </div>
                    )}
                </div>
            )}
        </div>
      </section>
    </div>
  );
};