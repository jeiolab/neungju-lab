import React from 'react';
import { UserHistory } from '../types';
import { Archive, Check, X } from 'lucide-react';

interface Props {
  history: UserHistory[];
}

const CaseLogTab: React.FC<Props> = ({ history }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-2xl font-bold flex items-center text-sepia-200">
          <Archive className="mr-2" /> 사건 기록실
        </h2>
        <span className="text-sm text-gray-500">총 {history.length}건의 기록</span>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/50 rounded-lg border border-gray-700 border-dashed">
          <p className="text-gray-400">아직 해결한 사건이 없네, 신입.</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-gray-900 text-gray-400 uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">사건명</th>
                  <th className="px-6 py-4">나의 판단</th>
                  <th className="px-6 py-4">결과</th>
                  <th className="px-6 py-4">일시</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{record.caseTitle}</td>
                    <td className="px-6 py-4">
                      {record.userVerdict ? (
                        <span className="bg-blue-900/50 text-blue-200 px-2 py-1 rounded text-xs border border-blue-800">해결 가능</span>
                      ) : (
                        <span className="bg-red-900/50 text-red-200 px-2 py-1 rounded text-xs border border-red-800">해결 불가</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {record.isCorrect ? (
                        <span className="flex items-center text-green-400"><Check size={16} className="mr-1"/> 정답</span>
                      ) : (
                        <span className="flex items-center text-red-400"><X size={16} className="mr-1"/> 오답</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseLogTab;