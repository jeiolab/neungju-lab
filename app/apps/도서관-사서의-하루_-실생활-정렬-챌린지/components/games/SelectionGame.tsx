import React, { useState, useEffect, useCallback } from 'react';
import { ExamPaper } from '../../types';
import { Button } from '../Button';
import { FileText, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface SelectionGameProps {
  onSuccess: () => void;
}

export const SelectionGame: React.FC<SelectionGameProps> = ({ onSuccess }) => {
  const [pile, setPile] = useState<ExamPaper[]>([]);
  const [sortedStack, setSortedStack] = useState<ExamPaper[]>([]);
  const [message, setMessage] = useState<string>("흩어진 시험지 중 '번호가 가장 작은' 것을 찾으세요.");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'neutral'>('neutral');

  const generateLevel = useCallback(() => {
    // Generate 5 random papers
    const papers: ExamPaper[] = Array.from({ length: 5 }, (_, i) => ({
      id: `paper-${i}-${Date.now()}`,
      studentNumber: Math.floor(Math.random() * 30) + 1,
      name: `학생 ${String.fromCharCode(65 + i)}`
    }));
    setPile(papers);
    setSortedStack([]);
    setMessage("흩어진 시험지 중 '번호가 가장 작은' 것을 찾으세요.");
    setFeedbackType('neutral');
  }, []);

  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  const handleSelectPaper = (selectedPaper: ExamPaper) => {
    // Find actual minimum in the pile
    if (pile.length === 0) return;
    const minPaper = pile.reduce((min, p) => p.studentNumber < min.studentNumber ? p : min, pile[0]);

    if (selectedPaper.id === minPaper.id) {
      // Correct selection
      const newPile = pile.filter(p => p.id !== selectedPaper.id);
      setPile(newPile);
      setSortedStack([...sortedStack, selectedPaper]);
      
      if (newPile.length === 0) {
        setMessage("완벽합니다! 모든 시험지가 순서대로 정리되었습니다.");
        setFeedbackType('success');
        onSuccess();
        setTimeout(generateLevel, 2000);
      } else {
        setMessage("잘했습니다! 남은 것 중에서 다시 가장 작은 번호를 찾으세요.");
        setFeedbackType('success');
      }
    } else {
      setMessage(`틀렸습니다. ${selectedPaper.studentNumber}번보다 더 작은 번호가 있습니다.`);
      setFeedbackType('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-slate-50 rounded-xl border-2 border-slate-200 min-h-[400px]">
       <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <FileText className="w-6 h-6" />
          선택 정렬: 시험지 정리
        </h3>
        <div className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
          feedbackType === 'success' ? 'bg-green-100 text-green-700' :
          feedbackType === 'error' ? 'bg-red-100 text-red-700' :
          'bg-white text-gray-600'
        }`}>
          {feedbackType === 'success' && <CheckCircle className="inline w-4 h-4 mr-1"/>}
          {feedbackType === 'error' && <XCircle className="inline w-4 h-4 mr-1"/>}
          {message}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-8 items-start justify-center mt-4">
        {/* Unsorted Pile */}
        <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-slate-200 min-h-[200px] w-full">
          <h4 className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">정리 전 (책상 위)</h4>
          <div className="flex flex-wrap gap-3">
            {pile.map((paper) => (
              <button
                key={paper.id}
                onClick={() => handleSelectPaper(paper)}
                className="bg-white border-2 border-slate-300 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg rounded-lg w-20 h-24 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-2xl font-bold text-slate-700 group-hover:text-indigo-600">{paper.studentNumber}</span>
                <span className="text-xs text-slate-400 mt-1">{paper.name}</span>
              </button>
            ))}
            {pile.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                모두 정리됨
              </div>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center h-[200px]">
          <ArrowRight className="w-8 h-8 text-slate-300" />
        </div>

        {/* Sorted Stack */}
        <div className="flex-1 bg-indigo-50 p-6 rounded-lg shadow-inner border border-indigo-100 min-h-[200px] w-full relative">
           <h4 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-wider">정리 완료 (선생님 제출용)</h4>
           <div className="flex flex-col items-center justify-end h-full relative" style={{ height: '150px' }}>
            {sortedStack.map((paper, index) => (
               <div 
                key={paper.id}
                className="absolute bg-white border border-indigo-200 rounded shadow-md w-48 h-12 flex items-center justify-between px-4"
                style={{ 
                  bottom: `${index * 8}px`,
                  zIndex: index,
                  transform: `scale(${1 - (sortedStack.length - 1 - index) * 0.02})`
                }}
              >
                <span className="font-bold text-indigo-800">No. {paper.studentNumber}</span>
                <span className="text-xs text-indigo-400">{paper.name}</span>
              </div>
            ))}
            {sortedStack.length === 0 && (
               <div className="absolute inset-0 flex items-center justify-center text-indigo-300/50 text-4xl font-bold uppercase">
                 Empty
               </div>
            )}
           </div>
        </div>
      </div>
    </div>
  );
};
