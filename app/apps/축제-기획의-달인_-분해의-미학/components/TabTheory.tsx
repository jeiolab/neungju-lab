import React, { useState } from 'react';
import { THEORY_CARDS } from '../constants';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

const TabTheory: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === THEORY_CARDS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? THEORY_CARDS.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
        <BookOpen className="w-6 h-6" />
        분해의 미학: 이론 학습
      </h2>

      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl shadow-md bg-gray-50 border border-gray-200">
        <div className="relative h-64 md:h-80 w-full">
          <img 
            src={THEORY_CARDS[currentIndex].image} 
            alt="Theory Illustration" 
            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <h3 className="text-xl font-bold mb-2">{THEORY_CARDS[currentIndex].title}</h3>
            <p className="text-sm md:text-base leading-relaxed">{THEORY_CARDS[currentIndex].content}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2 items-center">
          {THEORY_CARDS.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default TabTheory;