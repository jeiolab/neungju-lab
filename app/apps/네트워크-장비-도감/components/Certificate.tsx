import React from 'react';
import { Award, Download } from 'lucide-react';

interface CertificateProps {
  onRestart: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ onRestart }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center animate-fade-in max-w-2xl mx-auto">
      <div className="bg-white p-8 md:p-12 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
        
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-6 rounded-full border-4 border-yellow-400">
            <Award size={64} className="text-yellow-600" />
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">CERTIFICATE</h2>
        <p className="text-slate-500 font-bold tracking-widest mb-8">OF COMPLETION</p>

        <div className="border-t-2 border-b-2 border-slate-100 py-6 mb-8 space-y-2">
          <p className="text-slate-600">이 자격증은 모든 과정을 우수하게 수료한</p>
          <p className="text-2xl font-bold text-blue-600">예비 네트워크 관리자</p>
          <p className="text-slate-600">에게 수여됩니다.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
          >
            <Download size={20} />
            저장하기
          </button>
          <button 
            onClick={onRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            처음부터 다시하기
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400 font-mono">
          ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>
    </div>
  );
};