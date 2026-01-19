import React, { useState } from 'react';
import { ToDoItem } from '../types';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

const ReflectionTab: React.FC = () => {
  const [todos, setTodos] = useState<ToDoItem[]>([
    { id: '1', text: '관심 분야 뉴스레터 1개 구독하기', completed: false },
    { id: '2', text: '진로 선생님과 상담 예약하기', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (!inputValue.trim()) return;
    const newItem: ToDoItem = {
      id: Date.now().toString(),
      text: inputValue,
      completed: false,
    };
    setTodos([...todos, newItem]);
    setInputValue('');
  };

  const handleToggle = (id: string) => {
    setTodos(todos.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter(item => item.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold font-serif text-slate-800">오늘의 다짐 & Action Plan</h2>
        <p className="text-slate-500 mt-2">나만의 경쟁력을 갖추기 위해 오늘 당장 시작할 수 있는 일은 무엇일까요?</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 파이썬 기초 강의 1강 듣기"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAdd}
              className="bg-blue-600 text-white px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-2">
          {todos.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p>등록된 할 일이 없습니다.<br/>작은 목표부터 세워보세요!</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {todos.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-center gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`text-slate-400 hover:text-blue-500 transition-colors ${item.completed ? 'text-blue-500' : ''}`}
                  >
                    {item.completed ? <CheckSquare className="w-6 h-6" /> : <Square className="w-6 h-6" />}
                  </button>
                  <span className={`flex-1 text-lg ${item.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-2 transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReflectionTab;