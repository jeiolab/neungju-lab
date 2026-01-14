import React, { useState } from 'react';
import { CitationData } from '../types';
import { Clipboard, Check } from 'lucide-react';

const CitationTool: React.FC = () => {
  const [data, setData] = useState<CitationData>({
    type: 'website',
    author: '',
    title: '',
    source: '',
    url: '',
    date: ''
  });
  const [copied, setCopied] = useState(false);

  const handleChange = (field: keyof CitationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setCopied(false);
  };

  const generateCitation = () => {
    const today = new Date().toISOString().split('T')[0];
    
    // Simplified APA-style logic tailored for Korean school context
    switch (data.type) {
      case 'website':
        return `${data.author || '저자미상'}. (${data.date || '연도미상'}). ${data.title}. ${data.source || '웹사이트명'}. ${data.url ? `<${data.url}>` : ''} 검색일: ${today}.`;
      case 'news':
        return `${data.author} 기자. "${data.title}". ${data.source}, ${data.date || '날짜미상'}. ${data.url || ''}`;
      case 'video':
        return `${data.author} [${data.source}]. (${data.date || '업로드일'}). ${data.title} [동영상]. YouTube. ${data.url || ''}`;
      case 'book':
        return `${data.author}. (${data.date || '발행년'}). 『${data.title}』. ${data.source || '출판사'}.`;
      default:
        return '';
    }
  };

  const citationResult = generateCitation();

  const handleCopy = () => {
    navigator.clipboard.writeText(citationResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">1</span>
          정보 입력
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">자료 유형</label>
            <select 
              value={data.type} 
              onChange={(e) => handleChange('type', e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="website">웹사이트 / 블로그</option>
              <option value="news">뉴스 기사</option>
              <option value="video">유튜브 / 동영상</option>
              <option value="book">도서 / 논문</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {data.type === 'video' ? '채널명/게시자' : '저자 / 기자'}
            </label>
            <input 
              type="text" 
              value={data.author}
              onChange={(e) => handleChange('author', e.target.value)}
              placeholder={data.type === 'video' ? '예: EBS 교육방송' : '예: 홍길동'}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">제목</label>
            <input 
              type="text" 
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="자료의 제목을 입력하세요"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {data.type === 'book' ? '출판사' : data.type === 'news' ? '신문사' : '사이트/채널 이름'}
            </label>
            <input 
              type="text" 
              value={data.source}
              onChange={(e) => handleChange('source', e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {(data.type !== 'book') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL (인터넷 주소)</label>
              <input 
                type="text" 
                value={data.url}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="https://..."
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">발행일 / 업로드 날짜</label>
            <input 
              type="text" 
              value={data.date}
              onChange={(e) => handleChange('date', e.target.value)}
              placeholder="예: 2023.10.05"
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="bg-slate-50 p-6 rounded-xl shadow-md border border-slate-200 flex flex-col h-full">
        <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm">2</span>
          출처 표기 결과
        </h3>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-inner mb-4 min-h-[120px] flex items-center">
             <p className="text-lg text-slate-800 break-words font-medium">
               {(!data.author && !data.title) ? <span className="text-slate-400">왼쪽 정보를 입력하면 자동으로 생성됩니다.</span> : citationResult}
             </p>
          </div>

          <button 
            onClick={handleCopy}
            disabled={!data.title}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition ${
              copied 
              ? 'bg-green-500 text-white' 
              : 'bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                복사 완료!
              </>
            ) : (
              <>
                <Clipboard size={20} />
                출처 복사하기
              </>
            )}
          </button>
          
          <p className="text-xs text-slate-500 mt-4 text-center">
            * 학교 과제 제출용으로 권장되는 표준 양식(APA 스타일 응용)입니다.<br/>
            선생님께서 원하시는 양식이 따로 있다면 그것을 우선해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitationTool;