import React, { useState, useEffect } from 'react';
import { FileItem } from '../types';
import { INITIAL_FILES, CO2_PER_GB_GRAMS } from '../constants';
import { Trash2, FileArchive, FolderOpen, AlertCircle, CheckCircle } from 'lucide-react';

interface FileCleanerProps {
  onUpdateStats: (savedMB: number, points: number) => void;
}

const FileCleaner: React.FC<FileCleanerProps> = ({ onUpdateStats }) => {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);
  const [missionActive, setMissionActive] = useState(false);

  // Random Mission Trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance of mission appearing shortly after load
        setMissionActive(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNotification = (msg: string, type: 'success' | 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const deleteFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    setFiles(files.filter(f => f.id !== id));
    
    // Calculate rewards
    const points = 10;
    onUpdateStats(file.sizeMB, points);
    handleNotification(`${file.name} 삭제 완료. ${file.sizeMB} MB 절약!`, 'success');
  };

  const compressFile = (id: string) => {
    const file = files.find(f => f.id === id);
    if (!file) return;

    // Simulate 50% compression
    const saved = file.sizeMB * 0.5;
    
    setFiles(files.map(f => f.id === id ? { ...f, sizeMB: f.sizeMB - saved, name: f.name + '.zip' } : f));
    
    const points = 20; // More points for smart compression
    onUpdateStats(saved, points);
    handleNotification(`${file.name} 압축 완료. ${saved.toFixed(1)} MB 절약!`, 'success');

    if (missionActive && file.type === 'photo') {
        handleNotification("미션 성공! 보너스 50 포인트 획득!", 'success');
        onUpdateStats(0, 50);
        setMissionActive(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FolderOpen className="text-orange-500" />
          파일 정리 실천
        </h2>
        <p className="text-gray-600">불필요한 파일을 정리하거나 압축하여 에너지를 절약하세요.</p>
      </header>

      {/* Mission Banner */}
      {missionActive && (
        <div className="bg-purple-100 border border-purple-200 p-4 rounded-xl flex items-start gap-3 animate-bounce-short">
          <AlertCircle className="text-purple-600 mt-1" />
          <div>
            <h4 className="font-bold text-purple-800">새로운 미션: 추억 여행</h4>
            <p className="text-purple-700 text-sm">오래된 사진 폴더를 발견했습니다. <strong>사진(Photo)</strong> 파일을 압축하고 보너스 포인트를 받으세요!</p>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all transform translate-y-0 opacity-100 ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-blue-100 text-blue-800'}`}>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            <span className="font-medium">{notification.msg}</span>
          </div>
        </div>
      )}

      {/* File List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-medium text-gray-500 grid grid-cols-12 gap-4">
          <div className="col-span-6 md:col-span-5">파일명</div>
          <div className="col-span-3 md:col-span-2 text-right">크기</div>
          <div className="col-span-3 md:col-span-5 text-right">작업</div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {files.length === 0 ? (
             <div className="p-10 text-center text-gray-400">
                깨끗합니다! 훌륭해요, 환경 운동가님.
             </div>
          ) : (
            files.map(file => (
              <div key={file.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors group">
                <div className="col-span-6 md:col-span-5 truncate">
                  <div className="font-medium text-gray-800">{file.name}</div>
                  <div className="text-xs text-gray-400">{file.date} • {file.type.toUpperCase()}</div>
                  {file.isSpam && <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">스팸</span>}
                </div>
                
                <div className="col-span-3 md:col-span-2 text-right font-mono text-sm text-gray-600">
                  {file.sizeMB >= 1000 ? `${(file.sizeMB/1000).toFixed(1)} GB` : `${file.sizeMB.toFixed(1)} MB`}
                </div>
                
                <div className="col-span-3 md:col-span-5 flex justify-end gap-2">
                  {!file.name.endsWith('.zip') && (
                    <button 
                      onClick={() => compressFile(file.id)}
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-xs md:text-sm"
                      title="압축하기 (50% 절약)"
                    >
                      <FileArchive size={16} />
                      <span className="hidden md:inline">압축</span>
                    </button>
                  )}
                  <button 
                    onClick={() => deleteFile(file.id)}
                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 text-xs md:text-sm"
                    title="삭제하기 (100% 절약)"
                  >
                    <Trash2 size={16} />
                    <span className="hidden md:inline">삭제</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-xl text-green-800 text-sm">
        <strong>알고 계셨나요?</strong> 데이터 1GB를 삭제할 때마다 데이터 센터에서 발생하는 CO2 배출량을 연간 약 {CO2_PER_GB_GRAMS}g 줄일 수 있습니다.
      </div>
    </div>
  );
};

export default FileCleaner;