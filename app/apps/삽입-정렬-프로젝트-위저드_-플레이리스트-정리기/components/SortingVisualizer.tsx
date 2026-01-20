import React, { useState, useEffect } from 'react';
import { Song, SortCriteria } from '../types';
import { ArrowDown, CheckCircle2, XCircle, Music } from 'lucide-react';

interface SortingVisualizerProps {
  songs: Song[];
  criteria: SortCriteria;
  onComplete: (success: boolean) => void;
  onCorrectMove: () => void;
  isSimulationMode?: boolean;
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ 
  songs, 
  criteria, 
  onComplete, 
  onCorrectMove,
  isSimulationMode = false
}) => {
  const [sortedList, setSortedList] = useState<Song[]>([]);
  const [unsortedList, setUnsortedList] = useState<Song[]>([]);
  const [currentCard, setCurrentCard] = useState<Song | null>(null);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'success' | 'error' | 'neutral' } | null>(null);
  const [shuffleDegree, setShuffleDegree] = useState(100); // 0 to 100

  // Helper to compare two songs based on criteria
  const compareSongs = (a: Song, b: Song): number => {
    const valA = a[criteria.primary];
    const valB = b[criteria.primary];
    
    let comparison = 0;
    if (valA < valB) comparison = -1;
    if (valA > valB) comparison = 1;
    
    if (criteria.primaryOrder === 'desc') comparison *= -1;

    // Secondary criteria logic could go here
    return comparison;
  };

  // Initialize
  useEffect(() => {
    resetGame(songs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, criteria]); // Re-init if input changes

  const resetGame = (inputSongs: Song[]) => {
    if (inputSongs.length === 0) return;

    let initialList = [...inputSongs];

    if (isSimulationMode) {
        // Sort perfectly first
        initialList.sort(compareSongs);
        
        // Then shuffle based on degree
        if (shuffleDegree > 0) {
            const swaps = Math.ceil((initialList.length * shuffleDegree) / 100);
            for (let i = 0; i < swaps; i++) {
                const idx1 = Math.floor(Math.random() * initialList.length);
                const idx2 = Math.floor(Math.random() * initialList.length);
                [initialList[idx1], initialList[idx2]] = [initialList[idx2], initialList[idx1]];
            }
        }
    }

    // Step 1: First item is conceptually "sorted"
    setSortedList([initialList[0]]);
    setUnsortedList(initialList.slice(1));
    setCurrentCard(null);
    setFeedback({ msg: '오른쪽(Unsorted)의 첫 번째 카드를 선택해주세요.', type: 'neutral' });
  };

  const handlePickCard = () => {
    if (unsortedList.length === 0) {
      setFeedback({ msg: '정렬이 완료되었습니다!', type: 'success' });
      onComplete(true);
      return;
    }
    const card = unsortedList[0];
    setCurrentCard(card);
    setUnsortedList(prev => prev.slice(1));
    setFeedback({ msg: '왼쪽(Sorted) 영역의 알맞은 위치를 클릭하여 카드를 삽입하세요.', type: 'neutral' });
  };

  const handleInsertClick = (index: number) => {
    if (!currentCard) return;

    // Validate Position
    // To be valid, currentCard must be >= prevItem AND <= nextItem (based on criteria)
    let isValid = true;
    
    // Check item before
    if (index > 0) {
      const prevItem = sortedList[index - 1];
      if (compareSongs(prevItem, currentCard) > 0) isValid = false;
    }
    
    // Check item after (item effectively at 'index' currently)
    if (index < sortedList.length) {
      const nextItem = sortedList[index];
      if (compareSongs(currentCard, nextItem) > 0) isValid = false;
    }

    if (isValid) {
      const newSorted = [...sortedList];
      newSorted.splice(index, 0, currentCard);
      setSortedList(newSorted);
      setCurrentCard(null);
      setFeedback({ msg: `성공! ${currentCard.title}이(가) 올바른 위치에 삽입되었습니다.`, type: 'success' });
      onCorrectMove();
      
      // Check if finished
      if (unsortedList.length === 0) {
          onComplete(true);
          setFeedback({ msg: '모든 곡이 완벽하게 정렬되었습니다!', type: 'success' });
      }

    } else {
      // Revert
      setUnsortedList(prev => [currentCard, ...prev]);
      setCurrentCard(null);
      setFeedback({ msg: '오답입니다! 정렬 기준을 다시 확인해보세요. 카드가 제자리로 돌아갑니다.', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Simulation Controls */}
      {isSimulationMode && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
           <div className="flex items-center gap-4">
             <label className="text-sm font-medium text-slate-700">섞기 정도 (거의 정렬 ~ 완전 랜덤)</label>
             <input 
               type="range" 
               min="0" 
               max="100" 
               value={shuffleDegree} 
               onChange={(e) => setShuffleDegree(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
             />
             <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded">{shuffleDegree}%</span>
             <button 
                onClick={() => resetGame(songs)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 whitespace-nowrap"
             >
                시뮬레이션 초기화
             </button>
           </div>
           <p className="text-xs text-slate-500 mt-2">
             * '섞기 정도'가 낮을수록(거의 정렬됨), 삽입할 위치를 찾기 위해 비교해야 할 횟수가 줄어들어 효율적입니다.
           </p>
        </div>
      )}

      {/* Main Game Area */}
      <div className="flex flex-col md:flex-row gap-4 h-[500px]">
        
        {/* Left: Sorted Area */}
        <div className="flex-1 bg-green-50/50 border-2 border-green-200 border-dashed rounded-xl p-4 overflow-y-auto relative">
          <h3 className="text-green-800 font-bold mb-4 sticky top-0 bg-green-50/90 py-2 z-10 flex items-center gap-2">
            <CheckCircle2 size={18} /> 정렬된 영역 (Sorted)
          </h3>
          
          <div className="space-y-2">
            {/* Initial Gap */}
            {currentCard && (
               <button 
                 onClick={() => handleInsertClick(0)}
                 className="w-full h-8 border-2 border-indigo-300 border-dashed rounded flex items-center justify-center text-indigo-400 hover:bg-indigo-50 transition-colors text-xs font-bold"
               >
                 여기에 삽입
               </button>
            )}

            {sortedList.map((song, idx) => (
              <React.Fragment key={song.id}>
                <div className="bg-white p-3 rounded shadow-sm border border-green-200 flex justify-between items-center transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xs">
                        {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{song.title}</p>
                      <p className="text-xs text-slate-500">
                         {criteria.primary.toUpperCase()}: {song[criteria.primary]} 
                         {criteria.primary === 'duration' && 's'}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Gap after item */}
                {currentCard && (
                  <button 
                    onClick={() => handleInsertClick(idx + 1)}
                    className="w-full h-8 border-2 border-indigo-300 border-dashed rounded flex items-center justify-center text-indigo-400 hover:bg-indigo-50 transition-colors text-xs font-bold"
                  >
                    여기에 삽입
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Right: Unsorted Area */}
        <div className="flex-1 bg-slate-100 border-2 border-slate-300 rounded-xl p-4 flex flex-col">
           <h3 className="text-slate-700 font-bold mb-4 flex items-center gap-2">
             <XCircle size={18} /> 정렬되지 않은 영역 (Unsorted)
           </h3>

           {/* Current Active Card Display (In Hand) */}
           <div className="flex-1 flex flex-col items-center justify-center border-b border-slate-200 pb-4 mb-4">
              {currentCard ? (
                <div className="w-full max-w-[240px] bg-indigo-600 text-white p-6 rounded-xl shadow-lg transform scale-105 transition-transform">
                   <div className="flex justify-between items-start mb-4">
                     <Music size={24} className="text-indigo-200" />
                     <span className="bg-indigo-500 px-2 py-1 rounded text-xs font-mono">Current</span>
                   </div>
                   <h4 className="text-xl font-bold mb-2">{currentCard.title}</h4>
                   <div className="space-y-1 text-indigo-100 text-sm">
                      <p className="flex justify-between"><span>BPM:</span> <span>{currentCard.bpm}</span></p>
                      <p className="flex justify-between"><span>길이:</span> <span>{currentCard.duration}s</span></p>
                      <p className="flex justify-between"><span>선호도:</span> <span>{'★'.repeat(currentCard.preference)}</span></p>
                   </div>
                   <p className="mt-4 text-xs text-center text-indigo-200 animate-pulse">
                     왼쪽 영역의 적절한 위치를 클릭하세요
                   </p>
                </div>
              ) : (
                unsortedList.length > 0 ? (
                  <button 
                    onClick={handlePickCard}
                    className="px-6 py-3 bg-slate-800 text-white rounded-lg shadow-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    카드 가져오기 <ArrowDown size={16} />
                  </button>
                ) : (
                    <div className="text-slate-400 text-center">
                        <p>모든 카드가 정렬되었습니다.</p>
                    </div>
                )
              )}
           </div>

           {/* Remaining Deck Pile */}
           <div className="h-32 bg-slate-200 rounded-lg p-3 overflow-hidden relative">
              {unsortedList.map((song, idx) => (
                  <div 
                    key={song.id} 
                    className="absolute bg-white border border-slate-300 p-2 rounded shadow text-xs w-40 text-slate-500"
                    style={{ 
                        top: `${idx * 4 + 10}px`, 
                        left: `${idx * 2 + 10}px`, 
                        zIndex: unsortedList.length - idx 
                    }}
                  >
                      {song.title}
                  </div>
              ))}
              {unsortedList.length === 0 && <p className="text-center text-slate-400 text-sm mt-10">Empty</p>}
           </div>
        </div>
      </div>

      {/* Feedback Bar */}
      <div className={`p-4 rounded-lg text-center font-medium transition-colors ${
        feedback?.type === 'success' ? 'bg-green-100 text-green-800' :
        feedback?.type === 'error' ? 'bg-red-100 text-red-800' :
        'bg-slate-100 text-slate-600'
      }`}>
        {feedback ? feedback.msg : '게임을 시작하려면 카드를 가져오세요.'}
      </div>
    </div>
  );
};