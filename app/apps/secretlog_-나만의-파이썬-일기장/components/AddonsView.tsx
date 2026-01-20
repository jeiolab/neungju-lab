import React, { useState } from 'react';
import { Database, Lock, Unlock, AlertOctagon, RotateCcw } from 'lucide-react';

interface AddonsViewProps {
  fileContent: string;
  setFileContent: (content: string) => void;
}

const AddonsView: React.FC<AddonsViewProps> = ({ fileContent, setFileContent }) => {
  const [encrypted, setEncrypted] = useState(false);
  const [deletedContent, setDeletedContent] = useState<string | null>(null);

  // Simple Base64 encryption for visualization
  const toggleEncryption = () => {
    if (!fileContent) return;
    
    if (encrypted) {
      try {
        setFileContent(atob(fileContent));
        setEncrypted(false);
      } catch (e) {
        alert("복호화 오류!");
      }
    } else {
      setFileContent(btoa(unescape(encodeURIComponent(fileContent))));
      setEncrypted(true);
    }
  };

  const simulateDisaster = () => {
    if(!fileContent) {
        alert("삭제할 데이터가 없습니다.");
        return;
    }
    setDeletedContent(fileContent);
    setFileContent("");
  };

  const recoverData = () => {
    if (deletedContent) {
      setFileContent(deletedContent);
      setDeletedContent(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Recovery Challenge */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Database className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white">데이터 복구 시뮬레이션</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6 flex-grow">
          실수로 'w' 모드로 열어 데이터를 날렸다고 가정해봅시다. 
          현실에서는 복구가 매우 어렵지만, 이 시뮬레이터에서는 백업본을 통해 복구하는 과정을 체험합니다.
        </p>
        
        <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-700 font-mono text-sm h-32 overflow-y-auto">
            {fileContent ? (
                <span className="text-slate-300">{fileContent}</span>
            ) : (
                <span className="text-red-500 italic blink">CRITICAL ERROR: DATA NOT FOUND</span>
            )}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <button
                onClick={simulateDisaster}
                disabled={!fileContent || !!deletedContent}
                className="flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AlertOctagon className="w-4 h-4" />
                <span>데이터 파괴</span>
            </button>
            <button
                onClick={recoverData}
                disabled={!deletedContent}
                className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RotateCcw className="w-4 h-4" />
                <span>데이터 복구</span>
            </button>
        </div>
        {deletedContent && <p className="text-xs text-center mt-2 text-emerald-400">백업 데이터가 감지되었습니다. 복구가 가능합니다.</p>}
      </div>

      {/* Encryption Tool */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white">일기 암호화 (Encryption)</h3>
        </div>
        <p className="text-slate-400 text-sm mb-6 flex-grow">
          비밀 일기장의 핵심은 보안입니다. Base64 인코딩을 사용하여 내용을 알아볼 수 없게 변환해보세요.
        </p>
        
        <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-700 font-mono text-sm h-32 overflow-y-auto break-all">
             {fileContent ? (
                <span className={encrypted ? "text-blue-400" : "text-slate-300"}>{fileContent}</span>
            ) : (
                <span className="text-slate-600 italic">암호화할 데이터가 없습니다. 시뮬레이션 탭에서 일기를 작성해주세요.</span>
            )}
        </div>

        <button
            onClick={toggleEncryption}
            disabled={!fileContent}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors ${
                encrypted 
                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {encrypted ? (
                <>
                    <Unlock className="w-4 h-4" />
                    <span>복호화 (Decrypt)</span>
                </>
            ) : (
                <>
                    <Lock className="w-4 h-4" />
                    <span>암호화 (Encrypt)</span>
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default AddonsView;
