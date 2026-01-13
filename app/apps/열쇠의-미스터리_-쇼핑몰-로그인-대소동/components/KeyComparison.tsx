import React from 'react';
import { Key, Lock, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react';

const KeyComparison: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">어떤 열쇠를 써야 할까?</h2>
        <p className="text-slate-600">쇼핑몰 고객들의 정보를 지키기 위해 두 가지 암호화 방식을 비교해봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Symmetric Key Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden hover:border-blue-400 transition-colors">
          <div className="bg-slate-100 p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-xl text-slate-800 flex items-center">
              <Key className="mr-2 text-yellow-600" />
              대칭키 (Symmetric Key)
            </h3>
            <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600">고전 방식</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-center items-center space-x-8 py-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-800">A</span>
                </div>
                <p>송신자</p>
              </div>
              <div className="flex flex-col items-center">
                <Key className="text-yellow-600 animate-pulse" size={32} />
                <span className="text-xs text-slate-500 mt-1">동일한 열쇠</span>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-800">B</span>
                </div>
                <p>수신자</p>
              </div>
            </div>
            
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start">
                <ShieldAlert className="text-red-500 mr-2 flex-shrink-0" size={16} />
                <span><strong>배송 사고 위험:</strong> 열쇠를 전달하는 과정에서 해커가 훔칠 수 있습니다.</span>
              </li>
              <li className="flex items-start">
                <RefreshCw className="text-blue-500 mr-2 flex-shrink-0" size={16} />
                <span><strong>속도:</strong> 구조가 단순하여 처리 속도가 매우 빠릅니다.</span>
              </li>
              <li className="flex items-start">
                <Key className="text-slate-500 mr-2 flex-shrink-0" size={16} />
                <span><strong>관리 문제:</strong> 쇼핑몰 사용자 100만 명이면 100만 개의 서로 다른 열쇠가 필요합니다.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Asymmetric Key Card */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-slate-200 overflow-hidden hover:border-green-400 transition-colors">
          <div className="bg-green-50 p-4 border-b border-green-200 flex items-center justify-between">
            <h3 className="font-bold text-xl text-green-800 flex items-center">
              <Lock className="mr-2 text-green-600" />
              비대칭키 (Asymmetric Key)
            </h3>
            <span className="text-xs bg-green-200 px-2 py-1 rounded text-green-800">현대 방식</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-center items-center space-x-4 py-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-800">A</span>
                </div>
                <p className="text-xs">잠그기</p>
              </div>
              <div className="flex items-center">
                <Lock className="text-green-500 mx-1" size={24} />
                <span className="text-xs text-slate-400">--&gt;</span>
                <Key className="text-red-500 mx-1" size={24} />
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="font-bold text-blue-800">B</span>
                </div>
                <p className="text-xs">풀기</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded text-xs text-center border border-slate-200">
               <strong>공개키(자물쇠)</strong>는 모두에게 공개,<br/><strong>개인키(열쇠)</strong>는 나만 보관
            </div>
            
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start">
                <ShieldCheck className="text-green-500 mr-2 flex-shrink-0" size={16} />
                <span><strong>안전함:</strong> 자물쇠만 공개하므로, 해커가 자물쇠를 얻어도 열 수 없습니다.</span>
              </li>
              <li className="flex items-start">
                <RefreshCw className="text-orange-500 mr-2 flex-shrink-0" size={16} />
                <span><strong>속도:</strong> 복잡한 수학 계산 때문에 속도가 느립니다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyComparison;
