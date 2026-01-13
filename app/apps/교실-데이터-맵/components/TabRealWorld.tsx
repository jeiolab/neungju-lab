import React, { useState } from 'react';
import { Image, Globe, Check, X } from 'lucide-react';

const TabRealWorld: React.FC = () => {
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 text-center">현실 속 2차원 데이터</h2>
      
      {/* Example 1: Image */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-slate-100 p-8 flex items-center justify-center md:w-1/3">
           <div className="relative">
             <Image size={64} className="text-slate-400" />
             <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-30 pointer-events-none">
                {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-indigo-500"></div>)}
             </div>
           </div>
        </div>
        <div className="p-6 md:w-2/3">
           <h3 className="text-xl font-bold text-slate-800 mb-2">디지털 이미지는 픽셀의 지도다</h3>
           <p className="text-slate-600 mb-4">
             컴퓨터 화면의 모든 이미지는 작은 점(Pixel)들의 모임입니다. 
             가로 1920개, 세로 1080개의 점이 있다면, 이는 <code className="bg-slate-100 px-1 rounded font-mono text-indigo-600">image[1080][1920]</code> 크기의 거대한 2차원 리스트와 같습니다.
           </p>
           <div className="bg-slate-50 p-3 rounded text-sm text-slate-500 border border-slate-100">
             * 흑백 사진은 2차원(밝기), 컬러 사진은 3차원(행, 열, RGB색상)입니다.
           </div>
        </div>
      </div>

      {/* Example 2: Environment */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        <div className="bg-emerald-50 p-8 flex items-center justify-center md:w-1/3">
           <Globe size={64} className="text-emerald-500" />
        </div>
        <div className="p-6 md:w-2/3">
           <h3 className="text-xl font-bold text-slate-800 mb-2">지구 환경 데이터 (위도/경도)</h3>
           <p className="text-slate-600 mb-4">
             지구 온난화를 연구할 때, 과학자들은 지구 표면을 격자(Grid)로 나눕니다. 
             특정 지역(위도 x, 경도 y)의 온도를 저장하려면 <code className="bg-slate-100 px-1 rounded font-mono text-emerald-600">temp[위도][경도]</code> 형태의 2차원 배열을 사용합니다.
           </p>
        </div>
      </div>

      {/* Mini Quiz */}
      <div className="bg-indigo-900 text-white rounded-xl p-8 text-center mt-8">
        <h4 className="text-lg font-bold mb-4">잠깐! 개념 확인</h4>
        <p className="mb-6">영화관 좌석 예매 시스템을 만든다면, 좌석 데이터는 몇 차원 구조가 가장 적합할까요?</p>
        
        {!quizAnswered ? (
          <div className="flex justify-center gap-4">
            <button onClick={() => setQuizAnswered(false)} className="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">1차원 (긴 줄)</button>
            <button onClick={() => setQuizAnswered(true)} className="px-6 py-2 bg-indigo-500 rounded hover:bg-indigo-400 font-bold transition-colors shadow-lg">2차원 (행/열)</button>
            <button onClick={() => setQuizAnswered(false)} className="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">3차원 (입체)</button>
          </div>
        ) : (
          <div className="animate-bounceIn">
            {quizAnswered === true ? (
               <div className="flex flex-col items-center text-emerald-400 gap-2">
                 <CheckCircleIcon />
                 <span className="font-bold text-lg">정답입니다! 극장은 행(A~Z)과 열(1~20)이 있으니까요.</span>
               </div>
            ) : (
               <div className="flex flex-col items-center text-rose-400 gap-2">
                 <XCircleIcon />
                 <span className="font-bold">다시 생각해보세요. 영화관 좌석표 모양을 떠올려보세요!</span>
                 <button onClick={() => setQuizAnswered(null)} className="text-xs underline text-slate-300 mt-2">다시 풀기</button>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CheckCircleIcon = () => <div className="p-2 bg-emerald-500/20 rounded-full"><Check size={32}/></div>
const XCircleIcon = () => <div className="p-2 bg-rose-500/20 rounded-full"><X size={32}/></div>

export default TabRealWorld;