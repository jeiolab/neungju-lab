import React, { useState } from 'react';
import { ExternalLink, Check, Image, Type } from 'lucide-react';
import { CCLConfig } from '../types';

const TabLearnMore: React.FC = () => {
  const [ccl, setCcl] = useState<CCLConfig>({
    attribution: true,
    nonCommercial: false,
    noDerivatives: false,
    shareAlike: false,
  });

  const getCCLString = () => {
    let str = 'CC BY';
    if (ccl.nonCommercial) str += '-NC';
    if (ccl.noDerivatives) str += '-ND';
    if (ccl.shareAlike) str += '-SA';
    return str;
  };

  const toggleHandler = (key: keyof CCLConfig) => {
    setCcl(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      // ND and SA are mutually exclusive in standard CC
      if (key === 'noDerivatives' && newState.noDerivatives) newState.shareAlike = false;
      if (key === 'shareAlike' && newState.shareAlike) newState.noDerivatives = false;
      return newState;
    });
  };

  const resources = [
    { name: "공유마당", url: "https://gongu.copyright.or.kr", desc: "한국저작권위원회 운영, 무료 저작물 저장소" },
    { name: "공공누리", url: "https://www.kogl.or.kr", desc: "국가/지자체 공공저작물 개방 플랫폼" },
    { name: "눈누", url: "https://noonnu.cc", desc: "상업용 무료 한글 폰트 모음" },
    { name: "Unsplash", url: "https://unsplash.com", desc: "고퀄리티 무료 이미지 사이트 (해외)" },
  ];

  return (
    <div className="space-y-12">
      {/* CCL Builder Section */}
      <section className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
        <div className="bg-white border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <span className="bg-blue-600 text-white px-2 rounded text-sm">TOOL</span>
            나만의 라이선스 만들기
          </h2>
          <p className="text-slate-600 text-sm mt-1">내가 만든 창작물에 어떤 조건을 붙일지 선택해보세요.</p>
        </div>
        
        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-800 border-b pb-2">조건 선택</h3>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg opacity-70 cursor-not-allowed">
              <div>
                <div className="font-bold text-slate-700">저작자 표시 (BY)</div>
                <div className="text-xs text-slate-500">기본 필수 조건입니다.</div>
              </div>
              <div className="bg-blue-500 text-white p-1 rounded"><Check size={16} /></div>
            </div>

            <div 
              onClick={() => toggleHandler('nonCommercial')}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2 ${ccl.nonCommercial ? 'border-amber-500 bg-amber-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
            >
              <div>
                <div className="font-bold text-slate-700">영리 목적 이용 제한 (NC)</div>
                <div className="text-xs text-slate-500">돈을 버는 목적으로는 쓸 수 없게 합니다.</div>
              </div>
              <div className={`w-6 h-6 rounded border flex items-center justify-center ${ccl.nonCommercial ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300 bg-white'}`}>
                {ccl.nonCommercial && <Check size={14} />}
              </div>
            </div>

            <div 
              onClick={() => toggleHandler('noDerivatives')}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2 ${ccl.noDerivatives ? 'border-red-500 bg-red-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
            >
              <div>
                <div className="font-bold text-slate-700">변경 금지 (ND)</div>
                <div className="text-xs text-slate-500">원본 그대로만 사용해야 합니다. (SA와 동시 선택 불가)</div>
              </div>
              <div className={`w-6 h-6 rounded border flex items-center justify-center ${ccl.noDerivatives ? 'bg-red-500 border-red-500 text-white' : 'border-slate-300 bg-white'}`}>
                {ccl.noDerivatives && <Check size={14} />}
              </div>
            </div>

            <div 
              onClick={() => toggleHandler('shareAlike')}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all border-2 ${ccl.shareAlike ? 'border-green-500 bg-green-50' : 'border-transparent bg-slate-50 hover:bg-slate-100'}`}
            >
              <div>
                <div className="font-bold text-slate-700">동일조건 변경허락 (SA)</div>
                <div className="text-xs text-slate-500">수정 시 똑같은 라이선스를 적용해야 합니다. (ND와 동시 선택 불가)</div>
              </div>
              <div className={`w-6 h-6 rounded border flex items-center justify-center ${ccl.shareAlike ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 bg-white'}`}>
                {ccl.shareAlike && <Check size={14} />}
              </div>
            </div>
          </div>

          <div className="bg-slate-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-slate-500 text-sm uppercase font-bold mb-4">Generated License</h3>
            <div className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              {getCCLString()}
            </div>
            <div className="flex gap-2 mb-6">
               {/* Visual representation badges */}
               <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">BY</span>
               {ccl.nonCommercial && <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">NC</span>}
               {ccl.noDerivatives && <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">ND</span>}
               {ccl.shareAlike && <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">SA</span>}
            </div>
            <p className="text-slate-600 text-sm">
              이 라이선스를 적용하면, 사람들은 당신의 작품을 사용할 때
              <br/>
              <strong>저작자를 표시해야 하며</strong>
              {ccl.nonCommercial && <span>, <strong>상업적으로 쓸 수 없고</strong></span>}
              {ccl.noDerivatives && <span>, <strong>내용을 바꿀 수 없습니다</strong></span>}
              {ccl.shareAlike && <span>, <strong>수정 시 같은 조건을 붙여야 합니다</strong></span>}
              .
            </p>
          </div>
        </div>
      </section>

      {/* Useful Tips Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-900">
            <Type className="text-indigo-600" />
            올바른 폰트 사용법
          </h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              '개인/상업용 무료'인지 반드시 라이선스 범위를 확인하세요.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠</span>
              폰트 파일(TTF/OTF) 자체를 다른 사람에게 보내거나 판매하면 안 됩니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              학교 과제용이라도, 공모전 등 외부에 공개될 때는 저작권 확인이 필수입니다.
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-900">
            <Image className="text-indigo-600" />
            이미지 사용 꿀팁
          </h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              구글 이미지 검색 시 '크리에이티브 커먼즈 라이선스' 필터를 켜세요.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠</span>
              연예인 사진이나 캐릭터는 '초상권'과 '저작권'이 별도이므로 주의해야 합니다.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">✓</span>
              무료 사이트라도 출처 표시가 필요한지(Attribution required) 확인하세요.
            </li>
          </ul>
        </div>
      </section>

      {/* External Links */}
      <section>
        <h3 className="text-xl font-bold text-slate-900 mb-4">무료 안심 사이트</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((site) => (
            <a 
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-4 rounded-lg border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800">{site.name}</span>
                <ExternalLink size={14} className="text-slate-400 group-hover:text-blue-600" />
              </div>
              <p className="text-xs text-slate-500">{site.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TabLearnMore;