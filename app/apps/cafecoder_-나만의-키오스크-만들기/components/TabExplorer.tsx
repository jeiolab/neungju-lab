import React from 'react';
import { FolderOpen, FileText, Trash } from 'lucide-react';
import { FileSystem } from '../types';

interface TabExplorerProps {
  fileSystem: FileSystem;
  setFileSystem: (fs: FileSystem) => void;
}

const TabExplorer: React.FC<TabExplorerProps> = ({ fileSystem, setFileSystem }) => {
  const fileNames = Object.keys(fileSystem);

  const deleteFile = (name: string) => {
    if(window.confirm(`정말 ${name}을 삭제하시겠습니까?`)) {
      const newFs = { ...fileSystem };
      delete newFs[name];
      setFileSystem(newFs);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-full overflow-hidden flex flex-col">
      <h2 className="text-2xl font-bold text-coffee-800 mb-6 flex items-center gap-2">
        <FolderOpen /> 가상 파일 탐색기
      </h2>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar / File List */}
        <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
           <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 text-sm">
             현재 폴더: /CafeCoder/data
           </div>
           {fileNames.length === 0 ? (
             <div className="p-8 text-center text-gray-400 text-sm">
               파일이 없습니다.<br/>시뮬레이션 탭에서 '매출 마감'을 해보세요.
             </div>
           ) : (
             <ul>
               {fileNames.map(name => (
                 <li key={name} className="group flex items-center justify-between p-3 border-b border-gray-100 hover:bg-coffee-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="text-coffee-500 w-5 h-5 flex-shrink-0" />
                      <span className="font-mono text-sm truncate">{name}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteFile(name); }}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash size={16} />
                    </button>
                 </li>
               ))}
             </ul>
           )}
        </div>

        {/* Preview Area */}
        <div className="w-2/3 bg-gray-900 rounded-xl shadow-lg flex flex-col text-gray-300 font-mono overflow-hidden">
           <div className="bg-gray-800 p-3 border-b border-gray-700 flex gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
             <div className="w-3 h-3 rounded-full bg-green-500"></div>
           </div>
           <div className="flex-1 p-6 overflow-auto whitespace-pre">
             {fileNames.length > 0 ? (
                fileSystem[fileNames[0]] || ""
             ) : (
                <span className="text-gray-600 italic">No files to display.</span>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default TabExplorer;