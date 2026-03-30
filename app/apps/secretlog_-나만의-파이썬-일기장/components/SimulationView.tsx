import React, { useState, useEffect } from 'react';
import { Play, Save, RefreshCw, AlertTriangle, FileText, HardDrive, Terminal as TerminalIcon } from 'lucide-react';
import { FileMode } from '../types';

interface SimulationViewProps {
  fileContent: string;
  onUpdateFile: (content: string, isAppend: boolean) => void;
}

const SimulationView: React.FC<SimulationViewProps> = ({ fileContent, onUpdateFile }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [text, setText] = useState('');
  const [mode, setMode] = useState<FileMode>('w');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getPythonCode = () => {
    let code = `# diary.txt 파일 열기\n`;
    code += `f = open('diary.txt', '${mode}', encoding='utf-8')\n`;
    
    if (mode === 'w' || mode === 'a') {
      const escapedText = text.replace(/\n/g, '\\n');
      const content = `[${date}] ${escapedText}\\n`;
      code += `f.write('${content}')\n`;
    } else {
      code += `content = f.read()\n`;
      code += `print(content)\n`;
    }
    
    code += `f.close()`;
    return code;
  };

  useEffect(() => {
    if (mode === 'w' && fileContent.length > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [mode, fileContent]);

  const handleExecute = () => {
    setIsAnimating(true);
    setConsoleOutput([]); // Clear previous output for a new run

    setTimeout(() => {
      const entry = `[${date}] ${text}`;
      
      if (mode === 'w') {
        onUpdateFile(entry, false);
        setConsoleOutput([`Process finished with exit code 0`]);
      } else if (mode === 'a') {
        const newContent = fileContent ? `${fileContent}\n${entry}` : entry;
        onUpdateFile(newContent, true);
        setConsoleOutput([`Process finished with exit code 0`]);
      } else if (mode === 'r') {
        // Read mode simulation
        if (fileContent.length === 0) {
             setConsoleOutput(['', 'Process finished with exit code 0']);
        } else {
            const lines = fileContent.split('\n');
            setConsoleOutput([...lines, '', 'Process finished with exit code 0']);
        }
      }
      setIsAnimating(false);
      
      if (mode !== 'r') {
        setText(''); // Clear input after write
      }
    }, 800); // Fake processing delay
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Left Column: Editor & Controls */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg">
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-700 pb-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-lg">일기 작성 에디터</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">날짜</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-1">오늘의 비밀 내용</label>
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="오늘 어떤 보안 이슈를 발견했나요?"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 h-32 resize-none focus:outline-none focus:border-emerald-500 transition-colors"
                disabled={mode === 'r'}
              />
              {mode === 'r' && <p className="text-xs text-yellow-500 mt-1">* 읽기 모드에서는 작성할 수 없습니다.</p>}
            </div>

            <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
              <label className="block text-sm text-slate-400 mb-2">파일 모드 (Access Mode)</label>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setMode('w')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'w' ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-slate-800 text-slate-500 border border-transparent hover:bg-slate-800/80'}`}
                >
                  'w' (Write)
                </button>
                <button 
                  onClick={() => setMode('a')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'a' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'bg-slate-800 text-slate-500 border border-transparent hover:bg-slate-800/80'}`}
                >
                  'a' (Append)
                </button>
                <button 
                  onClick={() => setMode('r')}
                  className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === 'r' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' : 'bg-slate-800 text-slate-500 border border-transparent hover:bg-slate-800/80'}`}
                >
                  'r' (Read)
                </button>
              </div>
              
              <div className="mt-3 text-xs">
                {mode === 'w' && <p className="text-red-400 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> 기존 파일 내용을 모두 삭제하고 새로 씁니다.</p>}
                {mode === 'a' && <p className="text-emerald-400 flex items-center"><Save className="w-3 h-3 mr-1"/> 기존 내용 뒤에 새로운 내용을 이어 붙입니다.</p>}
                {mode === 'r' && <p className="text-blue-400 flex items-center"><RefreshCw className="w-3 h-3 mr-1"/> 파일을 수정하지 않고 내용만 읽어옵니다.</p>}
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={isAnimating || (mode !== 'r' && !text)}
              className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all transform active:scale-95 ${
                isAnimating 
                  ? 'bg-slate-700 text-slate-400 cursor-wait' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
              }`}
            >
              {isAnimating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>실행 중...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>코드 실행 (Run)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Center & Right: Code Generator & HDD View */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        
        {/* Python Code Generator */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative group">
          <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
             <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="text-xs text-slate-500 font-mono">main.py</span>
          </div>
          <div className="p-4 font-mono text-sm overflow-x-auto">
            <pre className="text-slate-300">
              {getPythonCode().split('\n').map((line, i) => (
                <div key={i} className="table-row">
                    <span className="table-cell text-slate-600 select-none text-right pr-4">{i + 1}</span>
                    <span className="table-cell">
                        {line.includes('open') ? (
                            <span>
                                <span className="text-purple-400">f</span> <span className="text-slate-400">=</span> <span className="text-blue-400">open</span><span className="text-slate-400">(</span><span className="text-green-400">'diary.txt'</span><span className="text-slate-400">,</span> <span className="text-green-400">'{mode}'</span><span className="text-slate-400">,</span> <span className="text-orange-400">encoding</span><span className="text-slate-400">=</span><span className="text-green-400">'utf-8'</span><span className="text-slate-400">)</span>
                            </span>
                        ) : line.includes('write') ? (
                             <span>
                                <span className="text-purple-400">f</span><span className="text-slate-400">.</span><span className="text-blue-400">write</span><span className="text-slate-400">(</span><span className="text-green-400">{line.match(/'(.*)'/)?.[0] || "''"}</span><span className="text-slate-400">)</span>
                            </span>
                        ) : line.includes('read') ? (
                             <span>
                                <span className="text-purple-400">content</span> <span className="text-slate-400">=</span> <span className="text-purple-400">f</span><span className="text-slate-400">.</span><span className="text-blue-400">read</span><span className="text-slate-400">()</span>
                             </span>
                        ) : (
                            <span className="text-slate-300">{line}</span>
                        )}
                    </span>
                </div>
              ))}
            </pre>
          </div>
           {/* Terminal Output Area */}
           <div className={`bg-black/50 border-t border-slate-800 transition-all duration-300 ${consoleOutput.length > 0 ? 'h-32' : 'h-0'}`}>
              <div className="p-3 font-mono text-xs text-slate-400 h-full overflow-y-auto">
                {consoleOutput.map((line, idx) => (
                    <div key={idx} className={line.includes('exit code') ? 'text-blue-500 mt-2' : 'text-slate-300'}>
                        {line}
                    </div>
                ))}
              </div>
           </div>
        </div>

        {/* Virtual HDD View */}
        <div className={`relative flex-grow bg-slate-800 rounded-xl border-2 transition-colors duration-500 p-5 shadow-inner ${showWarning ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700'}`}>
            <div className="absolute top-0 right-0 p-2 bg-slate-800 rounded-bl-xl border-l border-b border-slate-700">
                <span className="text-xs font-mono text-slate-400 flex items-center">
                    <HardDrive className="w-3 h-3 mr-1" /> HDD: /home/user/diary.txt
                </span>
            </div>

            {showWarning && (
                <div className="absolute inset-0 bg-slate-900/80 z-10 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <AlertTriangle className="w-12 h-12 text-red-500 mb-2 animate-bounce" />
                    <h3 className="text-xl font-bold text-white mb-1">데이터 손실 경고!</h3>
                    <p className="text-slate-300 mb-4 max-w-md">
                        'w' 모드로 파일을 열면 기존 내용이 모두 사라집니다.<br/>
                        정말 이대로 실행하시겠습니까?
                    </p>
                    <div className="text-sm text-slate-500 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                        기존 데이터를 유지하려면 <span className="text-emerald-400 font-mono font-bold">'a' (append)</span> 모드를 사용하세요.
                    </div>
                </div>
            )}

            <div className="h-full min-h-[200px] font-mono text-sm whitespace-pre-wrap text-slate-300">
                {fileContent || <span className="text-slate-600 italic">// 파일이 비어있습니다.</span>}
            </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationView;
