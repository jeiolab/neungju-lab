import React, { useState, useEffect } from 'react';
import { FileMode, FileSystemState } from '../../types';
import { Save, RefreshCw, FileText } from 'lucide-react';

interface FileExperimentProps {
  onActivity: () => void;
}

const FileExperiment: React.FC<FileExperimentProps> = ({ onActivity }) => {
  // Virtual File System State
  const [fileSystem, setFileSystem] = useState<FileSystemState>(() => {
    const saved = localStorage.getItem('vfs_state');
    return saved ? JSON.parse(saved) : { 'data.txt': { content: '초기 데이터입니다.', updatedAt: Date.now() } };
  });

  // Editor State
  const [mode, setMode] = useState<FileMode>('r');
  const [buffer, setBuffer] = useState('');
  const [status, setStatus] = useState<string>('대기 중...');
  const [isOpened, setIsOpened] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('vfs_state', JSON.stringify(fileSystem));
  }, [fileSystem]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev].slice(0, 5));

  const handleOpen = () => {
    onActivity();
    setIsOpened(true);
    
    if (mode === 'r') {
      if (fileSystem['data.txt']) {
        setBuffer(fileSystem['data.txt'].content);
        setStatus(`파일 열림 (읽기 모드). 내용 확인 가능.`);
        addLog(`>> open('data.txt', 'r') Success`);
      } else {
        setStatus(`오류: 파일이 존재하지 않습니다.`);
        setIsOpened(false);
        addLog(`>> open('data.txt', 'r') Error: File not found`);
      }
    } else if (mode === 'w') {
      setBuffer(''); // Wipes buffer immediately conceptually
      setStatus(`파일 열림 (쓰기 모드). 기존 내용이 삭제되었습니다.`);
      addLog(`>> open('data.txt', 'w') Warning: File truncated`);
    } else if (mode === 'a') {
      // Append mode opens but pointer is at end. 
      // For simplicity in UI, we act like we are preparing to add string.
      setBuffer(''); 
      setStatus(`파일 열림 (추가 모드). 내용을 입력하면 뒤에 붙습니다.`);
      addLog(`>> open('data.txt', 'a') Ready to append`);
    }
  };

  const handleClose = () => {
    if (!isOpened) return;
    onActivity();

    if (mode === 'r') {
      setStatus('파일 닫힘.');
    } else if (mode === 'w') {
      setFileSystem({
        ...fileSystem,
        'data.txt': { content: buffer, updatedAt: Date.now() }
      });
      setStatus('저장 완료 (덮어쓰기). 파일 닫힘.');
    } else if (mode === 'a') {
      const currentContent = fileSystem['data.txt']?.content || '';
      setFileSystem({
        ...fileSystem,
        'data.txt': { content: currentContent + buffer, updatedAt: Date.now() }
      });
      setStatus('저장 완료 (추가). 파일 닫힘.');
    }

    setIsOpened(false);
    setBuffer('');
    addLog(`>> close() Saved & Closed`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mt-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Controls */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText size={20} className="text-indigo-600" />
              마이크로 실험실
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-bold ${isOpened ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              STATUS: {isOpened ? 'OPENED' : 'CLOSED'}
            </span>
          </div>

          {/* Mode Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">1. 모드 선택 (open mode)</label>
            <div className="flex space-x-2">
              {(['r', 'w', 'a'] as FileMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => !isOpened && setMode(m)}
                  disabled={isOpened}
                  className={`flex-1 py-2 rounded-md font-mono font-bold text-sm transition-colors border
                    ${mode === m 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    } ${isOpened ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  '{m}'
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {mode === 'r' && "읽기 전용: 내용을 볼 수만 있습니다."}
              {mode === 'w' && "쓰기 전용: 기존 내용이 모두 사라집니다!"}
              {mode === 'a' && "추가 모드: 기존 내용 뒤에 덧붙입니다."}
            </p>
          </div>

          {/* Action Area */}
          <div className="space-y-2">
            {!isOpened ? (
              <button 
                onClick={handleOpen}
                className="w-full py-3 bg-gray-800 text-white rounded-lg font-bold hover:bg-black transition-colors"
              >
                open('data.txt', '{mode}') 실행
              </button>
            ) : (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                {mode !== 'r' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">
                      {mode === 'w' ? '새로 쓸 내용 (Buffer)' : '추가할 내용 (Buffer)'}
                    </label>
                    <input 
                      type="text" 
                      value={buffer}
                      onChange={(e) => setBuffer(e.target.value)}
                      className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="여기에 텍스트 입력..."
                    />
                  </div>
                )}
                {mode === 'r' && (
                  <div className="bg-gray-100 p-3 rounded border border-gray-200 text-sm font-mono text-gray-700 break-all">
                     {buffer || "(파일이 비어있음)"}
                  </div>
                )}
                <button 
                  onClick={handleClose}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors flex justify-center items-center gap-2"
                >
                  <Save size={18} />
                  close() 로 저장하기
                </button>
              </div>
            )}
          </div>
          
          <div className="text-xs font-mono text-gray-400 mt-2">
             <div className="mb-1 font-bold">System Log:</div>
             {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>

        {/* Visualization */}
        <div className="w-full md:w-1/3 bg-gray-900 rounded-xl p-4 text-gray-300 flex flex-col font-mono text-xs md:text-sm">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
            <span className="font-bold text-white flex items-center gap-2">
              <FolderOpen size={16} /> Virtual Disk
            </span>
            <button 
              onClick={() => { setFileSystem({}); setLog([]); }}
              className="text-gray-500 hover:text-white" title="Reset Disk">
              <RefreshCw size={14} />
            </button>
          </div>
          
          <div className="flex-1 space-y-4">
            {Object.entries(fileSystem).length === 0 ? (
               <div className="text-center text-gray-600 py-10 italic">디스크가 비어있습니다.</div>
            ) : (
              Object.entries(fileSystem).map(([name, file]: [string, any]) => (
                <div key={name} className="bg-gray-800 rounded p-3 border border-gray-700 relative group">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold mb-2">
                    <FileText size={14} />
                    {name}
                  </div>
                  <div className="bg-black/50 p-2 rounded text-gray-300 break-all min-h-[40px]">
                    {file.content}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-2 text-right">
                    Last Saved: {new Date(file.updatedAt).toLocaleTimeString()}
                  </div>
                  {/* Visual clue for mode effects */}
                  {isOpened && mode === 'w' && (
                    <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500/50 rounded flex items-center justify-center pointer-events-none">
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Wiping...</span>
                    </div>
                  )}
                  {isOpened && mode === 'a' && (
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
      <div className="mt-4 bg-yellow-50 text-yellow-800 text-xs p-3 rounded border border-yellow-200">
         💡 Tip: 'w' 모드를 선택하고 파일을 열면, 기존 내용은 즉시 사라집니다. 'a' 모드를 쓰면 기존 내용 뒤에 붙습니다.
      </div>
    </div>
  );
};

// Quick icon helper for this file
const FolderOpen = ({size, className}: {size:number, className?:string}) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-3.25 7a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2" />
  </svg>
);

export default FileExperiment;