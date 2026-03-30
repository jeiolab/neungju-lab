import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { UserState } from '../types';

interface Props {
  userState: UserState;
  onClose: () => void;
}

const WrongAnswerNote: React.FC<Props> = ({ userState, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
             <div className="bg-rose-500 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-xl font-bold">탐정 수첩: 오답 노트</h2>
               <p className="text-slate-400 text-sm">실수는 성공을 위한 데이터일 뿐!</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {userState.wrongAnswers.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="text-lg">아직 기록된 오답이 없습니다.</p>
              <p>훌륭한 탐정이시군요! 👍</p>
            </div>
          ) : (
            userState.wrongAnswers.map((note) => (
              <div key={note.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-3">{note.question}</h3>
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="bg-red-50 p-3 rounded-lg text-red-800 border border-red-100">
                    <span className="font-bold block mb-1 text-xs uppercase text-red-400">내 답변</span>
                    {note.yourAnswer}
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-green-800 border border-green-100">
                    <span className="font-bold block mb-1 text-xs uppercase text-green-400">정답</span>
                    {note.correctAnswer}
                  </div>
                </div>
                <div className="bg-indigo-50 p-3 rounded-lg text-indigo-900 text-sm">
                   <span className="font-bold mr-2">💡 해설:</span>
                   {note.explanation}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WrongAnswerNote;
