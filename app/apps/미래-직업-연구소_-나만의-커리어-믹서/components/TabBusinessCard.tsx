import React, { useState } from 'react';
import { JobResult } from '../types';
import { Share2, Smartphone, Download, UserCircle, QrCode } from 'lucide-react';

interface TabBusinessCardProps {
  savedJobs: JobResult[];
}

const TabBusinessCard: React.FC<TabBusinessCardProps> = ({ savedJobs }) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(savedJobs.length > 0 ? savedJobs[0].id : '');
  const [userName, setUserName] = useState('');
  const [theme, setTheme] = useState<'modern' | 'cyber' | 'minimal'>('modern');

  const selectedJob = savedJobs.find(j => j.id === selectedJobId);

  const handleShare = () => {
    if (!selectedJob) return;
    const text = `[미래 직업 연구소]\n제 2035년 미래 직업은 '${selectedJob.jobTitle}'입니다!\n\n"${selectedJob.description}"\n\n#${selectedJob.tags.interest} #${selectedJob.tags.tech} #미래직업`;
    navigator.clipboard.writeText(text).then(() => {
      alert("명함 정보가 복사되었습니다! 친구들에게 공유해보세요.");
    });
  };

  if (savedJobs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-600">아직 생성된 명함이 없습니다.</h3>
        <p className="text-slate-500 mb-6">커리어 믹서 탭에서 나만의 미래 직업을 먼저 만들어보세요!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-8 animate-fade-in">
      {/* Sidebar: Controls */}
      <div className="w-full md:w-1/3 space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">1. 직업 선택</h3>
          <select 
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            {savedJobs.map(job => (
              <option key={job.id} value={job.id}>{job.jobTitle}</option>
            ))}
          </select>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">2. 이름 입력</h3>
          <input 
            type="text" 
            placeholder="이름을 입력하세요"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
            maxLength={10}
          />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">3. 테마 선택</h3>
          <div className="flex gap-2">
            {['modern', 'cyber', 'minimal'].map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  theme === t 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t === 'modern' ? '모던' : t === 'cyber' ? '사이버' : '심플'}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
        >
          <Share2 className="w-5 h-5" />
          친구에게 공유하기
        </button>
      </div>

      {/* Main Area: Preview */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-slate-100 rounded-3xl p-8 min-h-[400px]">
        {selectedJob && (
          <div className={`
            relative w-full max-w-md aspect-[1.7/1] rounded-2xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden transition-all duration-500
            ${theme === 'modern' ? 'bg-gradient-to-br from-slate-800 to-black text-white' : ''}
            ${theme === 'cyber' ? 'bg-indigo-900 text-cyan-400 border-2 border-cyan-500' : ''}
            ${theme === 'minimal' ? 'bg-white text-slate-900 border border-slate-200' : ''}
          `}>
            {/* Background Effects */}
            {theme === 'modern' && (
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            )}
            {theme === 'cyber' && (
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            )}
            
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                   <h2 className={`font-black uppercase tracking-wider ${theme === 'cyber' ? 'text-sm text-pink-500' : 'text-xs opacity-60'}`}>
                    Future Career Lab
                  </h2>
                  <h1 className={`text-2xl font-bold mt-2 ${theme === 'cyber' ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : ''}`}>
                    {selectedJob.jobTitle}
                  </h1>
                </div>
                <QrCode className={`w-10 h-10 ${theme === 'minimal' ? 'text-slate-900' : 'text-white opacity-80'}`} />
              </div>
            </div>

            <div className="relative z-10">
              <p className={`text-lg font-medium mb-1 ${theme === 'cyber' ? 'text-white' : ''}`}>
                {userName || '이름 입력'}
              </p>
              <div className={`h-0.5 w-10 mb-4 ${theme === 'cyber' ? 'bg-pink-500' : theme === 'minimal' ? 'bg-black' : 'bg-white/30'}`}></div>
              
              <div className="flex gap-2 text-[10px] uppercase tracking-wide opacity-80">
                <span>#{selectedJob.tags.interest}</span>
                <span>#{selectedJob.tags.tech}</span>
                <span>#2035</span>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs opacity-60">
                 <Smartphone className="w-3 h-3" />
                 <span>010-XXXX-2035</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabBusinessCard;