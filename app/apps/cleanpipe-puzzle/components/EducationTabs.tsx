import React, { useState } from 'react';
import { CONCEPTS, QUIZ_QUESTIONS } from '../constants';
import { QuizQuestion } from '../types';
import { BookOpen, Check, X, HelpCircle, Save } from 'lucide-react';

// --- Concept Tab ---
export const ConceptTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CONCEPTS.map((concept, idx) => (
        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <BookOpen size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{concept.title}</h3>
              <p className="text-slate-600 leading-relaxed">{concept.content}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 md:col-span-2">
        <h3 className="font-bold text-indigo-800 mb-2">💡 전처리를 안 하면? (GIGO 원칙)</h3>
        <p className="text-indigo-700">
          "Garbage In, Garbage Out". 쓰레기(나쁜 데이터)가 들어가면 쓰레기(나쁜 결과)가 나옵니다.
          아무리 좋은 AI 모델을 써도 데이터가 엉망이면 예측은 빗나갑니다.
        </p>
      </div>
    </div>
  );
};

// --- Quiz Tab ---
interface QuizTabProps {
  onCorrectAnswer: () => void;
}

export const QuizTab: React.FC<QuizTabProps> = ({ onCorrectAnswer }) => {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showFeedback[qId]) return; // Lock if already answered
    setAnswers({ ...answers, [qId]: optionIdx });
  };

  const checkAnswer = (qId: number, correctIdx: number) => {
    setShowFeedback({ ...showFeedback, [qId]: true });
    if (answers[qId] === correctIdx) {
      onCorrectAnswer();
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {QUIZ_QUESTIONS.map((q) => {
        const isAnswered = showFeedback[q.id];
        const isCorrect = answers[q.id] === q.correctIndex;

        return (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 rounded text-xs font-bold ${q.difficulty === 'EASY' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {q.conceptTag}
              </span>
              {isAnswered && (
                isCorrect 
                  ? <span className="flex items-center text-green-600 font-bold gap-1"><Check size={18}/> 정답!</span>
                  : <span className="flex items-center text-red-500 font-bold gap-1"><X size={18}/> 오답</span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Q{q.id}. {q.question}</h3>
            
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(q.id, idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 rounded-lg border transition-all
                    ${answers[q.id] === idx 
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium' 
                      : 'bg-white border-slate-200 hover:bg-slate-50'}
                    ${isAnswered && idx === q.correctIndex ? 'bg-green-50 border-green-500 !text-green-800 ring-1 ring-green-500' : ''}
                    ${isAnswered && answers[q.id] === idx && idx !== q.correctIndex ? 'bg-red-50 border-red-300' : ''}
                  `}
                >
                  {opt}
                </button>
              ))}
            </div>

            {!isAnswered ? (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => checkAnswer(q.id, q.correctIndex)}
                  disabled={answers[q.id] === undefined}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
                >
                  정답 확인
                </button>
              </div>
            ) : (
              <div className="mt-4 bg-slate-50 p-4 rounded-lg text-slate-700 text-sm">
                <p className="font-bold mb-1 flex items-center gap-2"><HelpCircle size={14}/> 해설</p>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// --- Reflection Tab ---
export const ReflectionTab: React.FC = () => {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if(!note.trim()) return;
    const existing = JSON.parse(localStorage.getItem('cleanpipe_notes') || '[]');
    existing.push({ date: new Date().toISOString(), content: note });
    localStorage.setItem('cleanpipe_notes', JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setNote('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg text-slate-800 mb-2">🤔 생각해볼 문제</h3>
        <p className="text-slate-600 mb-4">
          만약 대기오염 측정 센서가 고장나서 하루치 데이터가 통째로 비어있다면(결측치), 
          평균값으로 채우는 것이 옳을까요? 아니면 그 날 데이터를 지워야 할까요? 
          이유와 함께 자신의 생각을 적어보세요.
        </p>
        <textarea
          className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="여기에 생각을 적어주세요..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>
        <div className="mt-3 flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? '저장됨' : '노트 저장'}
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
        <h4 className="font-bold text-yellow-800 mb-2">미션: 전처리 기준 설계하기</h4>
        <ul className="list-disc list-inside text-yellow-900 space-y-1 text-sm">
          <li>결측치가 전체의 50% 이상이면 해당 컬럼을 삭제한다.</li>
          <li>이상치는 3시그마(표준편차의 3배) 이상일 때만 제거한다.</li>
          <li>중복은 시간과 장소가 모두 같을 때만 처리한다.</li>
        </ul>
        <p className="mt-3 text-sm text-yellow-800">
          위와 같은 "나만의 원칙"을 세워보는 것이 중요합니다. 정답은 상황에 따라 다릅니다!
        </p>
      </div>
    </div>
  );
};