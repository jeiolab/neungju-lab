import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const AdvancedView: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const codeWith = `with open('secret.txt', 'w') as f:
    f.write('보안 로그 기록 중...')
# 들여쓰기가 끝나면 자동으로 f.close()가 호출됨`;

  const codeTry = `try:
    f = open('none.txt', 'r')
    data = f.read()
    f.close()
except FileNotFoundError:
    print("파일을 찾을 수 없습니다. 경로를 확인하세요.")`;

  const codeEncoding = `f = open('korean.txt', 'w', encoding='utf-8')
# 윈도우와 맥/리눅스 간의 호환성을 위해 
# encoding='utf-8'을 명시하는 것이 좋습니다.`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">White Hacker's Advanced Skill</h2>
        <p className="text-slate-400">더 안전하고 깔끔한 코드를 작성하는 방법을 알아봅시다.</p>
      </div>

      {/* with Statement */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-emerald-900/20 to-transparent">
          <h3 className="text-xl font-bold text-emerald-400 mb-2">1. with 문의 마법</h3>
          <p className="text-slate-300 text-sm">
            <code>open()</code>을 쓰면 반드시 <code>close()</code>를 해야 하지만, 프로그래머는 자주 깜빡합니다. 
            <code>with</code> 문을 사용하면 블록을 벗어날 때 파이썬이 <strong className="text-emerald-300">자동으로 파일을 닫아줍니다.</strong>
          </p>
        </div>
        <div className="bg-slate-950 p-4 relative group">
          <button 
            onClick={() => handleCopy(codeWith)}
            className="absolute top-4 right-4 p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 transition-colors"
          >
            {copied === codeWith ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
            {codeWith}
          </pre>
        </div>
      </section>

      {/* Exception Handling */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-amber-900/20 to-transparent">
          <h3 className="text-xl font-bold text-amber-400 mb-2">2. 예외 처리 (Exception Handling)</h3>
          <p className="text-slate-300 text-sm">
            읽으려는 파일이 없으면 프로그램이 멈춥니다(Crash). 
            <code>try-except</code> 구문을 사용하면 오류 상황에도 프로그램이 죽지 않고 유연하게 대처할 수 있습니다.
          </p>
        </div>
        <div className="bg-slate-950 p-4 relative group">
          <button 
             onClick={() => handleCopy(codeTry)}
             className="absolute top-4 right-4 p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 transition-colors"
          >
             {copied === codeTry ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
            {codeTry}
          </pre>
        </div>
      </section>

      {/* Encoding */}
      <section className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-blue-900/20 to-transparent">
          <h3 className="text-xl font-bold text-blue-400 mb-2">3. 한글 깨짐 방지 (Encoding)</h3>
          <p className="text-slate-300 text-sm">
            운영체제마다 기본 인코딩 방식이 다릅니다(Windows: cp949, Linux/Mac: utf-8). 
            한글이 포함된 파일을 다룰 때는 반드시 <code>encoding='utf-8'</code> 옵션을 추가하여 호환성을 확보하세요.
          </p>
        </div>
        <div className="bg-slate-950 p-4 relative group">
           <button 
             onClick={() => handleCopy(codeEncoding)}
             className="absolute top-4 right-4 p-2 bg-slate-800 rounded hover:bg-slate-700 text-slate-400 transition-colors"
          >
             {copied === codeEncoding ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="font-mono text-sm text-slate-300 overflow-x-auto">
            {codeEncoding}
          </pre>
        </div>
      </section>
    </div>
  );
};

export default AdvancedView;
