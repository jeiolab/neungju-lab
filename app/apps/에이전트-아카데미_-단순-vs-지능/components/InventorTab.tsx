import React, { useState } from 'react';
import { IdeaNote } from '../types';
import { Plus, Trash2, Lightbulb } from 'lucide-react';

const InventorTab: React.FC = () => {
  const [targetObject, setTargetObject] = useState('');
  const [idea, setIdea] = useState('');
  const [notes, setNotes] = useState<IdeaNote[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('inventor_notes');
        return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const saveNote = () => {
    if (!targetObject.trim() || !idea.trim()) return;

    const newNote: IdeaNote = {
      id: Date.now().toString(),
      targetObject,
      idea,
      createdAt: Date.now()
    };

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('inventor_notes', JSON.stringify(updatedNotes));
    
    setTargetObject('');
    setIdea('');
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('inventor_notes', JSON.stringify(updatedNotes));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 pb-24 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <Lightbulb className="text-yellow-500 w-8 h-8" fill="currentColor" />
          발명가 모드
        </h1>
        <p className="text-gray-600 text-lg">단순한 물건을 지능형 에이전트로 업그레이드할 아이디어를 기록해보세요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Area */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6 h-fit">
            <h2 className="font-bold text-xl text-gray-800">새 아이디어 작성</h2>
            <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">대상 물건</label>
            <input
                type="text"
                placeholder="예: 선풍기, 토스트기..."
                value={targetObject}
                onChange={(e) => setTargetObject(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            />
            </div>
            <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">업그레이드 아이디어</label>
            <textarea
                placeholder="어떻게 감지하고 학습할까요? 예: 카메라로 체온을 감지해서 자동으로 바람 방향을..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                rows={5}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-gray-50"
            />
            </div>
            <button
                onClick={saveNote}
                disabled={!targetObject || !idea}
                className="w-full bg-indigo-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md"
            >
                <Plus size={20} />
                발명품 저장하기
            </button>
        </div>

        {/* List Area */}
        <div className="space-y-4">
            <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-3 text-lg">나의 발명품 ({notes.length})</h3>
            {notes.length === 0 ? (
                <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p>아직 아이디어가 없습니다.<br/>지금 바로 상상력을 발휘해보세요!</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {notes.map(note => (
                        <div key={note.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative group hover:shadow-md transition-shadow">
                            <button 
                                onClick={() => deleteNote(note.id)}
                                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="pr-8">
                                <h4 className="font-bold text-indigo-700 mb-2 text-lg">{note.targetObject}</h4>
                                <p className="text-gray-600 leading-relaxed">{note.idea}</p>
                                <p className="text-xs text-gray-400 mt-3">{new Date(note.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default InventorTab;