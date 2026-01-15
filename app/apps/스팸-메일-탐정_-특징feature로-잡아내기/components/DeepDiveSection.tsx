import React, { useState } from 'react';
import { HelpCircle, ArrowRight } from 'lucide-react';

const DeepDiveSection: React.FC = () => {
  const [q1, setQ1] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <HelpCircle className="mr-2 text-indigo-600"/>
          왜 데이터가 많으면 더 정확해질까요?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              <strong className="text-slate-900">1. 예외 상황(Outlier)의 처리:</strong><br/>
              데이터가 적을 때는 우연히 '광고'라는 단어가 들어간 '정상 메일' 하나만 있어도, 
              컴퓨터는 "광고 = 나쁜 것"이라고 잘못 배울 수 있습니다. 데이터가 많아지면 이런 예외가 무시되고 전체적인 경향성이 드러납니다.
            </p>
            <p>
              <strong className="text-slate-900">2. 패턴의 발견:</strong><br/>
              스팸 메일은 진화합니다. 단순히 '광고' 뿐만 아니라 '특가', '마감임박', '클릭' 등 다양한 단어 조합을 씁니다. 
              데이터가 많을수록 이런 복잡한 조합(패턴)을 찾아낼 확률이 높아집니다.
            </p>
          </div>
          
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-4 text-center">미니 퀴즈</h3>
            <div className="space-y-4">
              <p className="text-sm text-slate-700 font-medium">Q. 데이터가 너무 적어서 생기는 문제(성급한 일반화)를 막으려면?</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setQ1('wrong')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition ${q1 === 'wrong' ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white hover:bg-slate-50'}`}
                >
                  규칙을 더 복잡하게 짠다
                </button>
                <button 
                  onClick={() => setQ1('correct')}
                  className={`flex-1 py-2 rounded-lg text-sm border transition ${q1 === 'correct' ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white hover:bg-slate-50'}`}
                >
                  다양한 데이터를 수집한다
                </button>
              </div>
              {q1 === 'correct' && <p className="text-xs text-green-600 font-bold text-center">정답입니다! 데이터 다양성이 핵심입니다.</p>}
              {q1 === 'wrong' && <p className="text-xs text-red-500 font-bold text-center">규칙만 복잡하게 하면 새로운 스팸에 대응 못해요.</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl shadow-lg text-white">
         <h3 className="text-xl font-bold mb-4">생각해볼 문제: 스팸의 진화</h3>
         <div className="space-y-6">
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 font-bold">1</div>
               <div>
                 <p className="font-medium mb-1">스팸 단어가 교묘해진다면?</p>
                 <p className="text-slate-400 text-sm">
                   스팸 발송자들이 '무료' 대신 'Moo-Ryo'라고 쓰거나, 이미지에 글자를 숨긴다면 
                   우리가 고른 '단어 특징'은 무용지물이 됩니다. 이때는 어떤 새로운 특징이 필요할까요?
                 </p>
               </div>
            </div>
            <div className="flex gap-4">
               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 font-bold">2</div>
               <div>
                 <p className="font-medium mb-1">우리 반만의 규칙</p>
                 <p className="text-slate-400 text-sm">
                   우리 반 공지사항에는 항상 "필독"이나 "선생님"이라는 단어가 들어갑니다.
                   반대로 스팸에는 링크가 5개 이상 있습니다. 이를 이용해 나만의 분류 규칙을 상상해보세요.
                 </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DeepDiveSection;
