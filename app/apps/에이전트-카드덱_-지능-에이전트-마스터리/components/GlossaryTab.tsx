import React, { useState } from 'react';
import { GLOSSARY } from '../constants';
import { UserProfile } from '../types';
import { Search, PenTool, Save } from 'lucide-react';

interface Props {
  profile: UserProfile;
  saveUserExample: (term: string, example: string) => void;
}

const GlossaryTab: React.FC<Props> = ({ profile, saveUserExample }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [inputExample, setInputExample] = useState('');

  const filteredGlossary = GLOSSARY.filter(item => 
    item.term.includes(searchTerm) || item.definition.includes(searchTerm)
  );

  const handleSave = (term: string) => {
    if (!inputExample.trim()) return;
    saveUserExample(term, inputExample);
    setInputExample('');
    alert('나만의 예시가 저장되었습니다!');
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text"
          placeholder="용어 검색 (예: 센서, 자율성)"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-3">
        {filteredGlossary.map((item) => {
          const isExpanded = expandedTerm === item.term;
          const userEx = profile.userExamples[item.term];

          return (
            <div key={item.term} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
              <button 
                onClick={() => setExpandedTerm(isExpanded ? null : item.term)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-bold text-gray-800">{item.term}</h3>
                  <div className="flex gap-1 mt-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <span className="text-gray-400 text-sm">{isExpanded ? '닫기' : '더보기'}</span>
              </button>
              
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-gray-100 bg-indigo-50/30">
                  <p className="text-gray-700 text-sm leading-relaxed py-3">{item.definition}</p>
                  
                  <div className="mt-2 bg-white p-3 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 text-sm font-bold">
                       <PenTool className="w-4 h-4" /> 내 예시 적기
                    </div>
                    {userEx ? (
                      <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded italic">
                         "{userEx}"
                         <button onClick={() => saveUserExample(item.term, '')} className="ml-2 text-xs text-red-400 underline">삭제</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={inputExample}
                          onChange={(e) => setInputExample(e.target.value)}
                          placeholder="개인정보(이름 등) 금지! 나만의 이해를 1문장으로 적어보세요."
                          className="flex-1 text-sm border border-gray-200 rounded px-2 py-1"
                        />
                        <button 
                          onClick={() => handleSave(item.term)}
                          className="bg-indigo-600 text-white p-1 rounded hover:bg-indigo-700"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GlossaryTab;