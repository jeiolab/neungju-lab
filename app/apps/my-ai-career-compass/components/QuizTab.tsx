import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { CheckCircle2, Sprout, Trees, Flower2, Award } from 'lucide-react';

const QuizTab: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleToggle = (id: number) => {
    if (checkedItems.includes(id)) {
      setCheckedItems(checkedItems.filter(item => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  const getResult = () => {
    const score = checkedItems.length;
    if (score <= 1) return { level: "🌱 새싹 등급", msg: "디지털 세상에 이제 막 발을 들였네요! 조금 더 호기심을 가져볼까요?", icon: Sprout, color: "text-emerald-500" };
    if (score <= 3) return { level: "🌿 묘목 등급", msg: "관심이 무럭무럭 자라고 있어요. 자신의 강점과 기술을 연결해보세요!", icon: Trees, color: "text-green-600" };
    return { level: "🌳 거목 등급", msg: "준비된 미래 인재시군요! 당신만의 직업을 창조할 준비가 되었습니다.", icon: Award, color: "text-amber-500" };
  };

  const resultData = getResult();
  const ResultIcon = resultData.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold text-slate-800">나의 디지털 준비도 체크</h2>
        <p className="text-slate-500 mt-2">나는 미래 직업 변화에 얼마나 준비되어 있을까요?</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q) => (
            <div 
              key={q.id}
              onClick={() => !showResult && handleToggle(q.id)}
              className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                checkedItems.includes(q.id)
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-white border-slate-100 hover:border-slate-300'
              } ${showResult ? 'cursor-default pointer-events-none' : ''}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                checkedItems.includes(q.id) ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
              }`}>
                {checkedItems.includes(q.id) && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <span className={`text-slate-700 ${checkedItems.includes(q.id) ? 'font-semibold' : ''}`}>{q.question}</span>
            </div>
          ))}
        </div>

        {!showResult ? (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowResult(true)}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg"
            >
              결과 확인하기
            </button>
          </div>
        ) : (
          <div className="mt-8 pt-8 border-t border-slate-100 text-center animate-fade-in-up">
            <div className={`inline-flex items-center justify-center p-4 rounded-full bg-slate-50 mb-4 ${resultData.color}`}>
              <ResultIcon className="w-12 h-12" />
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${resultData.color}`}>{resultData.level}</h3>
            <p className="text-slate-600 font-medium text-lg mb-6">{resultData.msg}</p>
            <button
              onClick={() => { setShowResult(false); setCheckedItems([]); }}
              className="text-slate-400 text-sm hover:text-slate-600 underline"
            >
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;