import React from 'react';
import { Book } from '../types';

interface BookProps {
  book: Book;
  isActive: boolean;
  isFound: boolean;
  isEliminated: boolean; // For binary search visualization (grayed out)
  onClick: (title: string) => void;
}

const BookComponent: React.FC<BookProps> = ({ book, isActive, isFound, isEliminated, onClick }) => {
  return (
    <div 
      className={`group relative flex flex-col items-center justify-end transition-all duration-300 cursor-pointer ${isEliminated ? 'opacity-20 grayscale' : 'opacity-100'}`}
      style={{ height: '200px', width: '40px' }}
      onClick={() => onClick(book.title)}
    >
      {/* Book Spine */}
      <div 
        className={`
          w-full rounded-t-sm shadow-md border-r border-white/20 relative
          ${book.color}
          ${isActive ? 'ring-4 ring-yellow-400 -translate-y-4 z-10' : ''}
          ${isFound ? 'ring-4 ring-green-500 -translate-y-6 z-20 animate-bounce' : ''}
          hover:-translate-y-2 hover:z-10 transition-transform
        `}
        style={{ height: `${book.height}%` }}
      >
        {/* Spine Text (Vertical) */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="writing-vertical-lr text-[10px] text-white/90 font-medium tracking-wide truncate h-[90%] rotate-180 select-none">
              {book.title}
            </span>
        </div>
      </div>
      
      {/* Tooltip on Hover */}
      <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-black text-white text-xs px-2 py-1 rounded transition-transform z-50 whitespace-nowrap pointer-events-none">
        {book.title}
      </div>
    </div>
  );
};

export default BookComponent;
