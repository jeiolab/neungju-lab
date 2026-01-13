import React, { useState } from 'react';
import { CLOUD_TYPES } from '../constants';
import { Cloud, Layers, Monitor, CheckCircle, XCircle } from 'lucide-react';

const EXAMPLES = [
  { text: "Google Docs (문서 편집)", type: "saas" },
  { text: "AWS EC2 (가상 서버 임대)", type: "iaas" },
  { text: "Google App Engine (앱 배포 플랫폼)", type: "paas" },
  { text: "Netflix (영상 스트리밍)", type: "saas" },
  { text: "Windows Azure Storage (저장소 인프라)", type: "iaas" },
  { text: "Heroku (웹 호스팅)", type: "paas" }
];

const CloudLearn: React.FC = () => {
  const [currentExample, setCurrentExample] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleGuess = (typeId: string) => {
    if (EXAMPLES[currentExample].type === typeId) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentExample < EXAMPLES.length - 1) {
        setCurrentExample(p => p + 1);
      } else {
        // Reset for infinite play or show completion
        setCurrentExample(0); 
      }
    }, 1000);
  };

  const currentItem = EXAMPLES[currentExample];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Cloud className="text-blue-500" />
        클라우드 서비스 분류 미니게임
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {CLOUD_TYPES.map((type) => (
          <div key={type.id} className="border p-4 rounded-lg bg-gray-50 text-sm">
            <h3 className="font-bold text-lg mb-1 text-gray-800">{type.name}</h3>
            <p className="text-gray-600 mb-2">{type.description}</p>
            <div className="text-xs text-gray-500 bg-white p-2 rounded border">
              예: {type.examples.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-indigo-50 p-8 rounded-xl relative overflow-hidden">
        <div className="text-sm font-bold text-indigo-400 mb-2">SCORE: {score}</div>
        
        <h3 className="text-2xl font-bold text-indigo-900 mb-8">
          "{currentItem.text}"
          <br/>
          어떤 유형일까요?
        </h3>

        {feedback && (
          <div className={`absolute inset-0 flex items-center justify-center bg-white/80 z-10 transition-all ${feedback === 'correct' ? 'text-green-600' : 'text-red-500'}`}>
            {feedback === 'correct' ? (
               <div className="flex flex-col items-center animate-bounce">
                 <CheckCircle size={64} />
                 <span className="text-2xl font-bold">정답!</span>
               </div>
            ) : (
              <div className="flex flex-col items-center animate-pulse">
                <XCircle size={64} />
                <span className="text-2xl font-bold">땡!</span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button onClick={() => handleGuess('iaas')} className="bg-white border-2 border-slate-200 hover:border-slate-400 px-6 py-3 rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition-colors">
            <Layers size={20} /> IaaS
          </button>
          <button onClick={() => handleGuess('paas')} className="bg-white border-2 border-slate-200 hover:border-slate-400 px-6 py-3 rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition-colors">
            <Monitor size={20} /> PaaS
          </button>
          <button onClick={() => handleGuess('saas')} className="bg-white border-2 border-slate-200 hover:border-slate-400 px-6 py-3 rounded-xl font-bold text-slate-700 flex flex-col items-center gap-1 transition-colors">
            <Cloud size={20} /> SaaS
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudLearn;
