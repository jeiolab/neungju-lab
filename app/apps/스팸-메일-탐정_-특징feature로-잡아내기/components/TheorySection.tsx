import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Mail, BrainCircuit, Tag, Fingerprint, Filter, Database, Award, CheckCircle } from 'lucide-react';
import { THEORY_CARDS } from '../constants';

const icons: {[key: string]: any} = {
  Mail, BrainCircuit, Tag, Fingerprint, Filter, Database, Award, CheckCircle
};

const TheorySection: React.FC = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % THEORY_CARDS.length);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + THEORY_CARDS.length) % THEORY_CARDS.length);
  };

  const CardIcon = icons[THEORY_CARDS[currentCard].icon];

  return (
    <div className="max-w-3xl mx-auto py-10">
       <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 min-h-[400px] flex flex-col relative">
          <div className="bg-indigo-600 h-2 w-full"></div>
          
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
             <div className="bg-indigo-50 p-6 rounded-full text-indigo-600 mb-2 transition-transform duration-500 hover:scale-110">
                <CardIcon size={64} strokeWidth={1.5} />
             </div>
             
             <h2 className="text-2xl font-bold text-slate-800">{THEORY_CARDS[currentCard].title}</h2>
             
             <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
               {THEORY_CARDS[currentCard].content.split('\n').map((line, i) => (
                 <React.Fragment key={i}>
                   {line}
                   <br />
                 </React.Fragment>
               ))}
             </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1">
             <div 
               className="bg-indigo-500 h-1 transition-all duration-300"
               style={{ width: `${((currentCard + 1) / THEORY_CARDS.length) * 100}%` }}
             ></div>
          </div>

          {/* Navigation */}
          <div className="p-4 bg-slate-50 flex justify-between items-center border-t border-slate-100">
             <button 
               onClick={prevCard}
               className="flex items-center px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition font-medium"
             >
               <ChevronLeft size={20} className="mr-1"/> 이전
             </button>
             <span className="text-sm text-slate-400 font-mono">
               {currentCard + 1} / {THEORY_CARDS.length}
             </span>
             <button 
               onClick={nextCard}
               className="flex items-center px-4 py-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg transition font-medium"
             >
               다음 <ChevronRight size={20} className="ml-1"/>
             </button>
          </div>
       </div>
       
       <p className="text-center text-slate-400 mt-6 text-sm">
         💡 카드를 하나씩 넘기며 개념을 익혀보세요.
       </p>
    </div>
  );
};

export default TheorySection;
