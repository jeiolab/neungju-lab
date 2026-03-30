import React, { useState, useEffect, useRef } from 'react';
import { Book, SearchState, AlgorithmType } from '../types';
import { INITIAL_BOOKS, SHUFFLE_BOOKS, SORT_BOOKS } from '../constants';
import BookComponent from './BookComponent';
import { Play, RotateCcw, Search, ArrowRight, Gauge } from 'lucide-react';

const Simulation: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(SHUFFLE_BOOKS(INITIAL_BOOKS));
  const [isSorted, setIsSorted] = useState(false);
  const [targetTitle, setTargetTitle] = useState<string>('');
  const [speed, setSpeed] = useState<number>(500); // ms delay
  const [searchState, setSearchState] = useState<SearchState>({
    isSearching: false,
    activeIndex: null,
    lowIndex: null,
    highIndex: null,
    foundIndex: null,
    stepsTaken: 0,
    message: "도서관에 오신 것을 환영합니다! 책들이 뒤죽박죽이네요.",
  });
  
  // Ref to control stopping the loop
  const stopSearchRef = useRef(false);

  // Helper for async delay
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  const handleShuffle = () => {
    setBooks(SHUFFLE_BOOKS(INITIAL_BOOKS));
    setIsSorted(false);
    resetSearchState("책이 섞였습니다. 무작위 순서입니다.");
  };

  const handleSort = async () => {
    if (searchState.isSearching) return;
    
    setSearchState(prev => ({ ...prev, message: "책을 정렬하는 중... (시간과 노력이 듭니다!)" }));
    // Simple visual delay for sorting "work"
    await delay(1000); 
    
    setBooks(SORT_BOOKS(books));
    setIsSorted(true);
    setSearchState(prev => ({ ...prev, message: "책이 가나다순으로 정렬되었습니다! 이진 탐색이 가능합니다." }));
  };

  const resetSearchState = (msg: string) => {
    stopSearchRef.current = true; // Stop any ongoing search
    setSearchState({
      isSearching: false,
      activeIndex: null,
      lowIndex: null,
      highIndex: null,
      foundIndex: null,
      stepsTaken: 0,
      message: msg,
    });
  };

  const startLinearSearch = async () => {
    if (!targetTitle) return;
    stopSearchRef.current = false;
    
    setSearchState(prev => ({ 
      ...prev, 
      isSearching: true, 
      foundIndex: null, 
      stepsTaken: 0,
      message: `"${targetTitle}" 책을 찾기 위해 순차 탐색을 시작합니다...`
    }));

    for (let i = 0; i < books.length; i++) {
      if (stopSearchRef.current) break;

      setSearchState(prev => ({ 
        ...prev, 
        activeIndex: i, 
        stepsTaken: prev.stepsTaken + 1 
      }));

      await delay(speed);

      if (books[i].title.toLowerCase() === targetTitle.toLowerCase()) {
        setSearchState(prev => ({ 
          ...prev, 
          isSearching: false, 
          foundIndex: i, 
          message: `"${books[i].title}" 책을 ${prev.stepsTaken}번 만에 찾았습니다!` 
        }));
        return;
      }
    }

    setSearchState(prev => ({ 
      ...prev, 
      isSearching: false, 
      activeIndex: null, 
      message: `"${targetTitle}" 책을 찾을 수 없습니다.` 
    }));
  };

  const startBinarySearch = async () => {
    if (!targetTitle) return;
    if (!isSorted) {
      setSearchState(prev => ({ ...prev, message: "⚠️ 오류: 이진 탐색을 하려면 책이 정렬되어 있어야 합니다!" }));
      return;
    }

    stopSearchRef.current = false;
    let low = 0;
    let high = books.length - 1;

    setSearchState(prev => ({ 
      ...prev, 
      isSearching: true, 
      foundIndex: null, 
      lowIndex: low,
      highIndex: high,
      stepsTaken: 0,
      message: `"${targetTitle}" 책을 찾기 위해 이진 탐색을 시작합니다...`
    }));

    while (low <= high) {
      if (stopSearchRef.current) break;

      const mid = Math.floor((low + high) / 2);
      const currentBook = books[mid];

      setSearchState(prev => ({ 
        ...prev, 
        activeIndex: mid, 
        lowIndex: low,
        highIndex: high,
        stepsTaken: prev.stepsTaken + 1,
        message: `중간에 있는 책 확인 중: "${currentBook.title}"`
      }));

      await delay(speed + 300); // Slightly slower step to visualize the logic

      const compare = currentBook.title.localeCompare(targetTitle, 'ko');

      if (compare === 0) {
        setSearchState(prev => ({ 
          ...prev, 
          isSearching: false, 
          foundIndex: mid, 
          lowIndex: null, 
          highIndex: null, 
          message: `이진 탐색으로 "${currentBook.title}" 책을 ${prev.stepsTaken}번 만에 찾았습니다! 정말 빠르죠!` 
        }));
        return;
      } else if (compare < 0) {
        // Target is alphabetically after currentBook (move right)
        low = mid + 1;
        setSearchState(prev => ({ ...prev, message: `"${targetTitle}"은(는) "${currentBook.title}" 뒤에 있습니다. 왼쪽 절반은 제외합니다.` }));
      } else {
        // Target is alphabetically before currentBook (move left)
        high = mid - 1;
        setSearchState(prev => ({ ...prev, message: `"${targetTitle}"은(는) "${currentBook.title}" 앞에 있습니다. 오른쪽 절반은 제외합니다.` }));
      }
      await delay(speed);
    }

    setSearchState(prev => ({ 
      ...prev, 
      isSearching: false, 
      activeIndex: null, 
      lowIndex: null, 
      highIndex: null, 
      message: `"${targetTitle}" 책을 찾을 수 없습니다.` 
    }));
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Controls */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-[300px]">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select 
              className="w-full pl-9 pr-4 py-2 border rounded-lg appearance-none bg-stone-50 focus:ring-2 focus:ring-amber-500 outline-none"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              disabled={searchState.isSearching}
            >
              <option value="">찾을 책을 선택하세요...</option>
              {INITIAL_BOOKS.map(b => (
                <option key={b.id} value={b.title}>{b.title}</option>
              ))}
            </select>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
             <label className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <Gauge className="w-3 h-3" /> 속도
             </label>
             <input 
              type="range" 
              min="100" 
              max="1500" 
              step="100"
              value={1600 - speed} // Invert so right is faster
              onChange={(e) => setSpeed(1600 - Number(e.target.value))}
              className="w-24 accent-amber-600 cursor-pointer"
             />
          </div>

          <button 
            onClick={startLinearSearch}
            disabled={searchState.isSearching || !targetTitle}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
          >
            순차 탐색
          </button>
          
          <button 
            onClick={startBinarySearch}
            disabled={searchState.isSearching || !targetTitle || !isSorted}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 flex items-center gap-2 ${isSorted ? 'bg-amber-600 text-white hover:bg-amber-700' : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
          >
            이진 탐색
          </button>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 bg-amber-50 rounded-xl shadow-inner border border-amber-100 p-6 relative overflow-hidden flex flex-col justify-end min-h-[400px]">
        
        {/* Message HUD */}
        <div className="absolute top-4 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-white/90 backdrop-blur shadow-lg px-6 py-3 rounded-full border border-amber-200">
             <p className="text-amber-900 font-medium text-center">
               {searchState.message}
             </p>
             <p className="text-xs text-stone-500 text-center mt-1">이동 횟수: {searchState.stepsTaken}</p>
          </div>
        </div>

        {/* The Bookshelf */}
        <div className="flex items-end justify-center gap-[2px] w-full border-b-[16px] border-amber-800 pb-0">
          {books.map((book, idx) => {
            // Determine elimination state for binary search
            let isEliminated = false;
            if (searchState.lowIndex !== null && searchState.highIndex !== null) {
               if (idx < searchState.lowIndex || idx > searchState.highIndex) {
                 isEliminated = true;
               }
            }

            return (
              <BookComponent 
                key={book.id}
                book={book}
                isActive={idx === searchState.activeIndex}
                isFound={idx === searchState.foundIndex}
                isEliminated={isEliminated}
                onClick={(t) => !searchState.isSearching && setTargetTitle(t)}
              />
            );
          })}
        </div>

        {/* Shelf Legs */}
        <div className="flex justify-between w-full px-10">
            <div className="w-4 h-12 bg-amber-900"></div>
            <div className="w-4 h-12 bg-amber-900"></div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex justify-between items-center">
         <div className="flex gap-4 text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>정렬됨: <strong>{isSorted ? "예" : "아니요"}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">O(n)</span>
              <span>순차</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-xs">O(log n)</span>
              <span>이진</span>
            </div>
         </div>

         <div className="flex gap-2">
           <button 
             onClick={handleShuffle}
             disabled={searchState.isSearching}
             className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
           >
             <RotateCcw className="w-4 h-4" /> 섞기
           </button>
           {!isSorted && (
             <button 
               onClick={handleSort}
               disabled={searchState.isSearching}
               className="flex items-center gap-2 px-6 py-2 bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200 rounded-lg font-medium transition-colors"
             >
               책 정렬하기 (가나다순) <ArrowRight className="w-4 h-4" />
             </button>
           )}
         </div>
      </div>
    </div>
  );
};

export default Simulation;