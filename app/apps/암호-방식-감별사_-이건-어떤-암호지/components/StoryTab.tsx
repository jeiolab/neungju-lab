import React from 'react';
import { STORIES } from '../constants';
import { Scroll, Clock } from 'lucide-react';

const StoryTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">암호의 역사: 숨기는 자 vs 푸는 자</h2>
        <p className="text-slate-500 mt-2">필요가 발명을 낳다: 어떻게 암호 기술이 진화했는지 알아봅시다.</p>
      </div>
      
      <div className="relative border-l-4 border-indigo-200 ml-4 space-y-12">
        {STORIES.map((story, index) => (
          <div key={story.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className="absolute -left-3.5 top-0 w-7 h-7 bg-indigo-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">{index + 1}</span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold text-sm uppercase tracking-wide">
                <Clock className="w-4 h-4" />
                {story.era}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Scroll className="w-5 h-5 text-slate-400" />
                {story.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {story.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryTab;