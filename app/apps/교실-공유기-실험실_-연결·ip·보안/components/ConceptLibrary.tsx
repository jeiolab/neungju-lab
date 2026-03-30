import React from 'react';
import { CONCEPTS } from '../constants';
import { BookOpen } from 'lucide-react';

const ConceptLibrary: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONCEPTS.map((concept, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-blue-500"/>
                    <h3 className="font-bold text-slate-800">{concept.title}</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{concept.desc}</p>
            </div>
        ))}
        
        {/* Learn More Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 shadow-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-bold text-blue-800 mb-2">더 알아보기: NAT란?</h3>
            <p className="text-xs text-blue-700 mb-3">
                학교 컴퓨터실의 IP는 보통 192.168.x.x로 시작하죠? 이건 '사설 IP'입니다. 
                인터넷 세상으로 나갈 땐 공유기가 '공인 IP' 하나로 주소를 바꿔줘요. 이 기술이 바로 NAT(Network Address Translation)입니다!
            </p>
            <div className="text-xs bg-white/60 p-2 rounded text-blue-900 font-mono">
                [내 PC] 192.168.0.10 <br/>
                ⬇️ (공유기 NAT) <br/>
                [인터넷] 211.45.xx.xx
            </div>
        </div>
    </div>
  );
};

export default ConceptLibrary;