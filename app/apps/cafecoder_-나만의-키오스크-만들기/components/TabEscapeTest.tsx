import React, { useState } from 'react';
import { Play } from 'lucide-react';

const TabEscapeTest: React.FC = () => {
  const [inputText, setInputText] = useState('안녕하세요.\\nCafeCoder입니다.\\n\\t탭이 들어갔어요!');
  const [preview, setPreview] = useState('');

  const handleRun = () => {
    // Simulate Python's print processing of escape characters
    // Replace literal "\n" with newline, "\t" with tab
    const processed = inputText
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
    setPreview(processed);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-coffee-800 mb-6">이스케이프 문자 실험실</h2>
      <p className="text-gray-600 mb-6">
        파이썬의 <code className="bg-gray-200 px-1 rounded">\n</code>(줄바꿈)과 <code className="bg-gray-200 px-1 rounded">\t</code>(탭)이 실제로 어떻게 동작하는지 테스트해보세요.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        {/* Editor */}
        <div className="flex flex-col bg-white rounded-xl shadow-sm border border-coffee-200 overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center">
            <span className="font-mono text-sm text-gray-600">editor.py</span>
            <button 
              onClick={handleRun}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-green-700"
            >
              <Play size={14} /> Run
            </button>
          </div>
          <div className="relative flex-1">
             <div className="absolute top-4 left-4 font-mono text-gray-400 pointer-events-none">
               print("
             </div>
             <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-full p-4 pl-[4.5rem] font-mono text-gray-800 resize-none focus:outline-none"
              spellCheck={false}
             />
             <div className="absolute bottom-4 right-4 font-mono text-gray-400 pointer-events-none">
               ")
             </div>
          </div>
        </div>

        {/* Console Output */}
        <div className="flex flex-col bg-gray-900 rounded-xl shadow-lg overflow-hidden text-gray-300">
          <div className="bg-gray-800 p-3 border-b border-gray-700">
            <span className="font-mono text-sm">Console Output</span>
          </div>
          <div className="flex-1 p-4 font-mono whitespace-pre bg-black/50 overflow-auto">
            {preview || <span className="text-gray-600 italic">Run 버튼을 눌러보세요...</span>}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-coffee-50 p-4 rounded-lg border border-coffee-200">
        <h3 className="font-bold text-coffee-800 mb-2">미션: 아래 모양을 만들어보세요!</h3>
        <pre className="bg-white p-3 rounded border border-gray-200 font-mono text-sm">
{`메뉴\t가격
아메\t3000
라떼\t3500`}
        </pre>
        <p className="text-sm text-gray-600 mt-2">힌트: <code>메뉴\t가격\n아메\t3000\n라떼\t3500</code></p>
      </div>
    </div>
  );
};

export default TabEscapeTest;