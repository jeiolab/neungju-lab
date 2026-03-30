import React from 'react';
import { Globe, Radio, Server } from 'lucide-react';

const ExploreTab: React.FC = () => {
  return (
    <div className="p-8 overflow-y-auto h-full bg-gray-50/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <Globe className="w-8 h-8 text-blue-600" />
          네트워크 심화 탐구
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Undersea Cables - Spans full width on large screens */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-64 bg-gray-200 relative group">
               <img 
                 src="https://picsum.photos/1200/600?grayscale" 
                 alt="Undersea cables map" 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                 <div>
                   <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full mb-3">글로벌 네트워크</span>
                   <h3 className="text-white font-bold text-2xl flex items-center gap-2">
                     해저 광케이블 지도
                   </h3>
                   <p className="text-gray-200 mt-2 max-w-2xl">
                     전 세계 데이터의 99%는 바다 밑 케이블로 이동합니다. 위성은 보조 수단일 뿐이죠.
                   </p>
                 </div>
               </div>
            </div>
            <div className="p-6 bg-white">
              <div className="flex gap-4 items-start">
                <div className="bg-blue-50 p-4 rounded-xl flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">💡 재미있는 사실</h4>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    과거에는 상어가 자기장 때문에 케이블을 공격하곤 했습니다. 
                    요즘은 케이블에 <strong>특수 보호막(Kevlar)</strong>을 입혀 상어 이빨로부터 보호하고 있어요.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 5G & 6G */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
             <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-purple-50/30">
                <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
                  <Radio className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">5G와 6G 기술</h3>
                  <span className="text-sm text-gray-500 font-medium">무선의 미래</span>
                </div>
             </div>
             <div className="p-6 flex-1 flex flex-col justify-center">
               <ul className="space-y-6">
                 <li className="flex gap-4 items-start group">
                   <span className="text-2xl font-black text-purple-200 group-hover:text-purple-600 transition-colors">01</span>
                   <div>
                     <span className="font-bold text-purple-700 text-lg">5G (현재)</span>
                     <p className="text-gray-600 mt-1 leading-relaxed">
                       LTE보다 20배 빠른 속도. 초저지연성 덕분에 <strong>자율주행차</strong>와 <strong>원격 수술</strong>이 가능해졌습니다.
                     </p>
                   </div>
                 </li>
                 <li className="flex gap-4 items-start group">
                   <span className="text-2xl font-black text-indigo-200 group-hover:text-indigo-600 transition-colors">02</span>
                   <div>
                     <span className="font-bold text-indigo-700 text-lg">6G (2030년~)</span>
                     <p className="text-gray-600 mt-1 leading-relaxed">
                       지상망과 위성 통신이 결합됩니다. 영화에서나 보던 <strong>실시간 홀로그램 회의</strong>가 일상이 될 거예요.
                     </p>
                   </div>
                 </li>
               </ul>
             </div>
          </div>

          {/* Section 3: Data Center */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
             <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
                <div className="bg-gray-100 p-3 rounded-xl text-gray-600">
                  <Server className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">서버실의 비밀</h3>
                  <span className="text-sm text-gray-500 font-medium">유선망의 심장</span>
                </div>
             </div>
             <div className="p-6 text-gray-600 leading-relaxed flex-1">
               <p className="mb-4">
                 구글, 네이버, 넷플릭스의 데이터 센터를 상상해보세요. 수만 대의 컴퓨터가 24시간 돌아가고 있습니다.
               </p>
               <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-4">
                 <h5 className="font-bold text-yellow-800 mb-1">왜 Wi-Fi를 안 쓸까?</h5>
                 <p className="text-sm text-yellow-700">
                   무선은 불안정하고 해킹 위험이 높아요. 서버실은 <strong>안정성</strong>과 <strong>보안</strong>이 생명이기에, 
                   복잡하더라도 반드시 고성능 광케이블로 직접 연결합니다.
                 </p>
               </div>
               <p className="text-sm text-gray-500">
                 * 서버실 바닥 밑에는 엄청난 양의 케이블이 지나가고 있답니다.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreTab;