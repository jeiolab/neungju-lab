import React, { useState, useEffect } from 'react';
import { PenTool, Save, Trash2, Bot } from 'lucide-react';

const TabEngineerNote: React.FC = () => {
  const [note, setNote] = useState("");
  const [savedTime, setSavedTime] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('roboLearn_note');
    if (saved) {
      setNote(saved);
      setSavedTime("불러옴");
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('roboLearn_note', note);
    const now = new Date().toLocaleTimeString();
    setSavedTime(now);
  };

  const handleClear = () => {
    if (window.confirm("정말 노트를 삭제하시겠습니까?")) {
      setNote("");
      localStorage.removeItem('roboLearn_note');
      setSavedTime(null);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      <div className="flex-1 bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <PenTool className="w-6 h-6 text-blue-600" /> 엔지니어 노트 (Engineer's Log)
          </h2>
          {savedTime && <span className="text-xs text-green-600 font-semibold">마지막 저장: {savedTime}</span>}
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Bot className="w-5 h-5" /> 생각해보기: 반려동물과 로봇 청소기
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            집에 강아지나 고양이가 있다면 로봇 청소기는 어떤 새로운 문제를 겪을까요? 
            <br/>예를 들어, '움직이는 장애물'이나 '반려동물의 배설물' 등을 만났을 때 로봇은 어떻게 <strong>[인식]</strong>하고 <strong>[판단]</strong>해야 할까요?
            <br/>필요한 센서와 로직을 자유롭게 상상해서 적어보세요.
          </p>
        </div>

        <textarea
          className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-slate-700 leading-relaxed bg-slate-50"
          placeholder="여기에 당신의 아이디어를 기록하세요..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></textarea>

        <div className="mt-6 flex gap-3 justify-end">
          <button 
            onClick={handleClear}
            className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> 지우기
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-2 font-bold"
          >
            <Save className="w-4 h-4" /> 저장하기
          </button>
        </div>
      </div>
      
      {/* Side visual for decoration */}
      <div className="hidden md:flex w-64 flex-col justify-center items-center text-slate-300">
         <div className="w-40 h-40 border-4 border-slate-200 rounded-full flex items-center justify-center mb-4">
            <PenTool className="w-16 h-16" />
         </div>
         <p className="text-center text-sm px-4">
           훌륭한 엔지니어는 문제를 정의하고 해결책을 문서화하는 습관을 가집니다.
         </p>
      </div>
    </div>
  );
};

export default TabEngineerNote;
