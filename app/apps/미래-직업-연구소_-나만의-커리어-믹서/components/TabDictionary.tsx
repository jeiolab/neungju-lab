import React from 'react';
import { JOB_DICTIONARY } from '../constants';
import { BookOpen } from 'lucide-react';

const TabDictionary: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in">
      <header className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">미래 직업 사전</h2>
        <p className="text-slate-500">이미 현실이 되고 있는 흥미로운 직업들을 만나보세요.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        {JOB_DICTIONARY.map((job, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded mb-2">
                  {job.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
              </div>
              <BookOpen className="w-5 h-5 text-slate-300 group-hover:text-indigo-300" />
            </div>
            
            <p className="text-slate-600 mb-6 leading-relaxed text-sm">
              {job.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => (
                <span key={idx} className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  #{skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabDictionary;