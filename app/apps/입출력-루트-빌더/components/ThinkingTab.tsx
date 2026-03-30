import React, { useState } from 'react';
import { PenTool, Send } from 'lucide-react';

const ThinkingTab: React.FC = () => {
  const [reflection, setReflection] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0 animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">생각 넓히기</h2>
        <p className="text-gray-600">단순 암기가 아닌, 구조를 설계해보세요.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">🤔 상황 부여</h3>
          <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
            동아리 부원들의 <strong>출석부 프로그램</strong>을 만들려고 합니다.<br/>
            학생이 올 때마다 이름을 입력하면, <code>attendance.txt</code> 파일에
            <strong>"날짜 - 이름"</strong> 형식으로 저장되어야 합니다.<br/>
            <br/>
            1. 파일은 어떤 모드로 열어야 할까요?<br/>
            2. 파일 열기(open)와 닫기(close)는 언제 해야 효율적일까요? (입력할 때마다? 아니면 프로그램 시작/종료 시 한 번만?)
          </p>
        </div>

        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-2">나의 설계안</h3>
          {!submitted ? (
            <>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                placeholder="예: 'a' 모드를 사용해야 기존 출석 기록이 안 지워집니다. open은..."
              />
              <button
                onClick={() => setSubmitted(true)}
                disabled={reflection.length < 10}
                className="mt-3 w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                <Send size={18} /> 제출하기
              </button>
            </>
          ) : (
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg text-indigo-800">
              <p className="font-bold mb-2">제출 완료! 코치 피드백:</p>
              <p className="text-sm">
                좋은 생각입니다! 보통 로그(Log)성 데이터는 <strong>'a' 모드</strong>가 필수적입니다.<br/>
                open/close 시점은 데이터 안정성을 위해 <strong>"입력 받을 때마다 열고 닫는 것"</strong>이 안전합니다. 
                프로그램이 비정상 종료되어도 직전 기록은 남기 때문이죠.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs underline text-indigo-500 hover:text-indigo-700"
              >
                수정하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThinkingTab;
