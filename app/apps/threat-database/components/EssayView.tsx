import React, { useState } from 'react';
import { analyzeEssay } from '../services/geminiService';
import { motion } from 'framer-motion';
import { PenTool, Send, Loader2, Award } from 'lucide-react';

const EssayView: React.FC = () => {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!essay.trim()) return;
    setLoading(true);
    const data = await analyzeEssay(essay);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-lab-800 mb-3">위협 데이터베이스</h2>
        <p className="text-lab-500">
          &ldquo;현대 디지털 사회에서 왜 착한 해커(화이트 해커)가 필요할까요?&rdquo;
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-lab-200">
        <textarea
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          placeholder="여기에 생각을 자유롭게 적어보세요... (예: 나쁜 해커들보다 먼저 보안 취약점을 찾아서 막아주기 때문에...)"
          className="w-full h-48 p-4 bg-lab-50 rounded-xl border border-lab-200 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none font-sans text-lab-700"
          disabled={loading || !!result}
        />
        
        <div className="mt-4 flex justify-end">
          {!result ? (
            <button
              onClick={handleSubmit}
              disabled={loading || essay.length < 10}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
              제출 및 평가받기
            </button>
          ) : (
            <button
              onClick={() => { setResult(null); setEssay(''); }}
              className="text-lab-500 hover:text-lab-800 text-sm underline"
            >
              다시 쓰기
            </button>
          )}
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white p-8 rounded-2xl border-2 border-primary-100 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-emerald-500" />
          
          <div className="flex items-center gap-6 mb-6">
             <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-lab-100" />
                   <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                           strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                           className="text-primary-500 transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-2xl font-bold text-lab-800">{result.score}</span>
                </div>
             </div>
             <div>
                <h3 className="text-xl font-bold text-lab-800 flex items-center gap-2">
                   <Award className="text-yellow-500" /> 교수님의 피드백
                </h3>
                <p className="text-lab-500 text-sm">자동 분석 시스템</p>
             </div>
          </div>
          
          <p className="text-lab-700 leading-relaxed bg-lab-50 p-4 rounded-lg border border-lab-100 italic">
            &ldquo;{result.feedback}&rdquo;
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EssayView;