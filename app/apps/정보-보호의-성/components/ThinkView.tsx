'use client';

import React, { useEffect, useState } from 'react';
import { DynamicIcon } from './Icons';

interface GuestbookEntry {
  id: string;
  content: string;
  timestamp: number;
}

const GUESTBOOK_STORAGE_KEY = 'infoSec_guestbook';
const THOUGHT_STORAGE_KEY = 'infoSec_thought';

export const ThinkView: React.FC = () => {
  const [thought, setThought] = useState('');
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saved'>('idle');
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  // 개인 기록장 로드
  useEffect(() => {
    const savedThought = localStorage.getItem(THOUGHT_STORAGE_KEY);
    if (savedThought) {
      setThought(savedThought);
    }
  }, []);

  // 방명록 로드
  useEffect(() => {
    const savedGuestbook = localStorage.getItem(GUESTBOOK_STORAGE_KEY);
    if (savedGuestbook) {
      try {
        const entries = JSON.parse(savedGuestbook);
        setGuestbookEntries(entries);
      } catch (e) {
        console.error('방명록 로드 실패:', e);
      }
    }
  }, []);

  const handleSaveThought = () => {
    localStorage.setItem(THOUGHT_STORAGE_KEY, thought);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  const handleAddGuestbook = () => {
    if (!thought.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      content: thought,
      timestamp: Date.now(),
    };

    const updatedEntries = [newEntry, ...guestbookEntries];
    setGuestbookEntries(updatedEntries);
    localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updatedEntries));
    
    // 입력 필드 초기화
    setThought('');
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2000);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('이 게시글을 삭제하시겠습니까?')) {
      const updatedEntries = guestbookEntries.filter(entry => entry.id !== id);
      setGuestbookEntries(updatedEntries);
      localStorage.setItem(GUESTBOOK_STORAGE_KEY, JSON.stringify(updatedEntries));
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <DynamicIcon name="BrainCircuit" className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">생각해볼 문제</h2>
        </div>
        <p className="text-lg text-indigo-100 leading-relaxed font-medium">
          "보안이 너무 강하면 사용하기 불편해질까?"
        </p>
        <p className="mt-4 text-sm text-indigo-200">
          비밀번호를 아주 복잡하게 만들거나, 매번 2단계 인증을 해야 한다면 보안은 강력해지지만 사용자는 불편함을 느낄 수 있습니다. 보안성과 편의성(Usability) 사이의 균형을 어떻게 맞추면 좋을지 자유롭게 적어보세요.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
        <label className="block text-slate-700 font-bold mb-2" htmlFor="thought-area">
          나의 생각 기록장
        </label>
        <textarea
          id="thought-area"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-slate-700"
          placeholder="여기에 자유롭게 작성하세요..."
        />
        
        <div className="mt-4 flex justify-between items-center">
          <span className={`text-sm font-medium transition-colors ${savedStatus === 'saved' ? 'text-green-600' : 'text-transparent'}`}>
            <span className="flex items-center gap-1">
              <DynamicIcon name="CheckCircle" size={16} />
              저장되었습니다!
            </span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleSaveThought}
              className="bg-slate-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-slate-700 transition-colors shadow-md flex items-center gap-2"
            >
              <DynamicIcon name="Lock" size={18} />
              개인 저장
            </button>
            <button
              onClick={handleAddGuestbook}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2"
            >
              <DynamicIcon name="Users" size={18} />
              방명록에 등록
            </button>
          </div>
        </div>
      </div>

      {/* 방명록 섹션 */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-full">
            <DynamicIcon name="Users" className="text-blue-600 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">방명록</h3>
          <span className="text-sm text-slate-500">({guestbookEntries.length}개)</span>
        </div>

        {guestbookEntries.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <DynamicIcon name="BookOpen" className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>아직 방명록에 글이 없습니다.</p>
            <p className="text-sm mt-2">위의 기록장에 글을 작성하고 "방명록에 등록" 버튼을 눌러보세요!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {guestbookEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">{formatDate(entry.timestamp)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                    title="삭제"
                  >
                    <DynamicIcon name="XCircle" size={18} />
                  </button>
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
