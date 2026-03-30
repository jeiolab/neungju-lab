import React, { useState } from 'react';
import { NoteItem } from '../types';
import { ArrowLeft, Search, Trash2, BookOpen } from 'lucide-react';

interface NoteViewProps {
  notes: NoteItem[];
  onBack: () => void;
  onDelete: (id: number) => void;
}

const NoteView: React.FC<NoteViewProps> = ({ notes, onBack, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes.filter(note => 
    note.scenario.includes(searchTerm) || 
    note.correctTech.includes(searchTerm) ||
    note.tip.includes(searchTerm)
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <h2 className="text-lg font-bold text-slate-800">나의 탐정 노트</h2>
          <div className="w-8"></div> {/* Spacer */}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="상황, 기술, 팁 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-100 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <BookOpen className="w-12 h-12 mb-2 opacity-50" />
            <p>저장된 노트가 없습니다.</p>
          </div>
        ) : filteredNotes.map((note) => (
          <div key={note.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                ${note.isCorrect ? 'bg-green-100 text-green-700' : 'bg-rose-100 text-rose-700'}`}>
                {note.isCorrect ? '정답' : '오답'}
              </span>
              <button onClick={() => onDelete(note.id)} className="text-slate-300 hover:text-rose-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-bold text-slate-800 mb-3 line-clamp-2">{note.scenario}</h3>
            
            <div className="bg-slate-50 rounded-lg p-3 mb-3 text-sm">
                <div className="flex justify-between mb-1">
                    <span className="text-slate-500">정답</span>
                    <span className="font-bold text-indigo-600">{note.correctTech}</span>
                </div>
                {!note.isCorrect && (
                     <div className="flex justify-between">
                     <span className="text-slate-500">내 선택</span>
                     <span className="font-medium text-rose-500 line-through">{note.userTech}</span>
                 </div>
                )}
            </div>

            <div className="text-xs text-slate-500 mb-2">
                <span className="font-bold mr-1">💡 팁:</span> {note.tip}
            </div>
            
            <div className="text-xs text-slate-400">
               {new Date(note.timestamp).toLocaleDateString()} 저장됨
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteView;