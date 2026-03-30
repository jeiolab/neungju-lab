import React, { useState, useEffect, useCallback } from 'react';
import { Book } from '../../types';
import { Button } from '../Button';
import { Plus, BookOpen, CheckCircle, XCircle } from 'lucide-react';

interface InsertionGameProps {
  onSuccess: () => void;
}

export const InsertionGame: React.FC<InsertionGameProps> = ({ onSuccess }) => {
  const [shelf, setShelf] = useState<Book[]>([]);
  const [holdingBook, setHoldingBook] = useState<Book | null>(null);
  const [message, setMessage] = useState<string>("책상에 있는 새 책을 집어서 올바른 위치에 꽂으세요.");
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'neutral'>('neutral');

  const generateLevel = useCallback(() => {
    // Generate 5 sorted books
    const start = Math.floor(Math.random() * 800) + 100;
    const books: Book[] = Array.from({ length: 5 }, (_, i) => ({
      id: `shelf-${i}`,
      callNumber: start + (i * 10) + Math.floor(Math.random() * 5),
      label: `${(start + (i * 10) + Math.floor(Math.random() * 5)).toFixed(2)}`,
      color: ['bg-red-700', 'bg-blue-700', 'bg-green-700', 'bg-yellow-700', 'bg-purple-700'][i % 5]
    }));
    setShelf(books);

    // Generate 1 book to insert
    if (books.length === 0) return;
    const minVal = books[0].callNumber - 5;
    const maxVal = books[books.length - 1].callNumber + 5;
    const newCallNum = Math.floor(Math.random() * (maxVal - minVal)) + minVal;
    
    // Ensure it's not a duplicate
    let distinctCallNum = newCallNum;
    while (books.some(b => Math.abs(b.callNumber - distinctCallNum) < 0.1)) {
        distinctCallNum += 1;
    }

    setHoldingBook({
      id: 'new-book',
      callNumber: distinctCallNum,
      label: `${distinctCallNum.toFixed(2)}`,
      color: 'bg-indigo-600'
    });
    setMessage("새 책을 집었습니다! 서가의 올바른 틈새를 클릭하세요.");
    setFeedbackType('neutral');
  }, []);

  useEffect(() => {
    generateLevel();
  }, [generateLevel]);

  const handleInsert = (index: number) => {
    if (!holdingBook) return;

    // Validation logic
    const prevBook = index > 0 ? shelf[index - 1] : null;
    const nextBook = index < shelf.length ? shelf[index] : null;

    const isCorrect = 
      (!prevBook || prevBook.callNumber < holdingBook.callNumber) &&
      (!nextBook || nextBook.callNumber > holdingBook.callNumber);

    if (isCorrect) {
      const newShelf = [...shelf];
      newShelf.splice(index, 0, holdingBook);
      setShelf(newShelf);
      setHoldingBook(null);
      setMessage("정확합니다! 책이 올바르게 정리되었습니다.");
      setFeedbackType('success');
      onSuccess();
      setTimeout(generateLevel, 1500);
    } else {
      setMessage("위치가 틀렸습니다. 청구기호 숫자를 다시 확인하세요!");
      setFeedbackType('error');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-amber-50 rounded-xl border-2 border-amber-200 min-h-[400px]">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-amber-900 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6" />
          삽입 정렬: 도서 정리
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

      {/* Shelf Visualization */}
      <div className="flex items-end gap-2 p-8 bg-amber-800 rounded-lg shadow-inner overflow-x-auto max-w-full min-h-[200px] relative">
        {/* Insert Zone 0 (Start) */}
        <button 
          onClick={() => handleInsert(0)}
          className="h-32 w-4 bg-white/10 hover:bg-white/30 rounded transition-colors flex items-center justify-center group"
        >
          <Plus className="text-white/50 group-hover:text-white w-4 h-4" />
        </button>

        {shelf.map((book, idx) => (
          <React.Fragment key={book.id}>
            <div className={`${book.color} w-12 h-40 rounded-sm shadow-md border-l-2 border-white/20 flex items-center justify-center relative group`}>
              <span className="text-white font-bold text-xs -rotate-90 whitespace-nowrap drop-shadow-md">
                {book.label}
              </span>
            </div>
            {/* Insert Zone (Between/End) */}
            <button 
              onClick={() => handleInsert(idx + 1)}
              className="h-32 w-4 bg-white/10 hover:bg-white/30 rounded transition-colors flex items-center justify-center group"
            >
              <Plus className="text-white/50 group-hover:text-white w-4 h-4" />
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Holding Area */}
      <div className="h-24 flex items-center justify-center w-full border-t-2 border-dashed border-amber-300 pt-4">
        {holdingBook ? (
          <div className="animate-bounce cursor-pointer flex flex-col items-center">
             <div className={`${holdingBook.color} w-12 h-40 rounded-sm shadow-xl border-l-2 border-white/20 flex items-center justify-center`}>
              <span className="text-white font-bold text-xs -rotate-90 whitespace-nowrap">
                {holdingBook.label}
              </span>
            </div>
            <span className="text-sm font-medium text-amber-800 mt-2">정리할 책</span>
          </div>
        ) : (
          <div className="text-amber-400 font-medium italic">다음 책을 가져오는 중...</div>
        )}
      </div>
    </div>
  );
};
