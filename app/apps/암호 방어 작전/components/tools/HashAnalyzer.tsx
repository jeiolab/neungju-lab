import React, { useState } from 'react';
import { Database, Search } from 'lucide-react';

// Simulated Rainbow Table
const RAINBOW_TABLE: Record<string, string> = {
  "password": "5f4dcc3b5aa765d61d8327deb882cf99",
  "123456": "e10adc3949ba59abbe56e057f20f883e",
  "admin": "21232f297a57a5a743894a0e4a801fc3",
  "welcome": "40be4e59b9a2a2b5dffc919c0b44532d",
  "qwerty": "d8578edf8458ce06fbc5bb76a58c5ca4"
};

export const HashAnalyzer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const checkHash = () => {
    // Simple mock hash function for unknown values just to show something
    const mockHash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return "00" + Math.abs(hash).toString(16) + "99a7... (simulated)";
    };

    const found = RAINBOW_TABLE[searchTerm.toLowerCase()];
    if (found) {
      setResult(found);
    } else {
      setResult(mockHash(searchTerm));
    }
  };

  return (
    <div className="p-4 bg-white border-2 border-indigo-200 rounded-lg shadow-sm text-slate-800">
      <h3 className="text-lg font-bold text-indigo-600 mb-4 flex items-center gap-2">
        <Database className="w-5 h-5" /> 레인보우 테이블 조회
      </h3>

      <div className="mb-4">
        <p className="text-xs text-slate-600 mb-2">
          흔한 비밀번호를 입력하여 MD5 해시를 확인하세요. 탈취된 데이터베이스 해시와 비교해 보세요.
        </p>
        <div className="flex gap-2">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="예: password, 123456..."
            className="flex-1 bg-slate-50 border-2 border-slate-300 p-2 rounded-lg text-slate-800 font-mono focus:border-indigo-500 outline-none"
            onKeyDown={(e) => e.key === 'Enter' && checkHash()}
          />
          <button 
            onClick={checkHash}
            className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-lg text-white shadow-md"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {result && (
        <div>
          <label className="block text-xs uppercase text-slate-600 mb-1 font-semibold">생성된 해시 (MD5)</label>
          <div className="w-full bg-red-50 border-2 border-red-400 p-2 rounded-lg text-red-700 font-mono text-sm break-all">
            {result}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-slate-200">
        <h4 className="text-xs uppercase text-slate-600 mb-2 font-semibold">알려진 유출 비밀번호 (힌트)</h4>
        <ul className="text-xs font-mono text-slate-500 space-y-1">
          <li>- 123456</li>
          <li>- qwerty</li>
          <li>- password</li>
          <li>- admin</li>
        </ul>
      </div>
    </div>
  );
};