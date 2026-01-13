import React from 'react';
import { Lock, Globe, Server, ArrowLeftRight, FileText } from 'lucide-react';

const HttpsExplainer: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">HTTPS의 비밀</h2>
        <p className="text-slate-600 mt-2">웹사이트 주소창의 자물쇠 아이콘(🔒)은 사실 <strong>대칭키와 비대칭키를 섞어서</strong> 씁니다!</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
        <h3 className="text-xl font-bold mb-6 text-center">하이브리드 암호화 시스템 (TLS Handshake)</h3>
        
        <div className="relative space-y-12">
            {/* Step 1 */}
            <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <div className="ml-6 flex-1">
                    <h4 className="font-bold text-lg">인사하기 (Client Hello)</h4>
                    <p className="text-slate-600">브라우저(내 컴퓨터)가 서버에게 접속을 요청하며 지원하는 암호화 방식을 알려줍니다.</p>
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <div className="ml-6 flex-1">
                    <h4 className="font-bold text-lg">인증서와 공개키 전달</h4>
                    <p className="text-slate-600">서버가 신분증(인증서)과 자신의 <strong>공개키(자물쇠)</strong>를 보냅니다. <br/>"이걸로 잠가서 보내세요!"</p>
                    <div className="mt-2 flex items-center text-xs bg-slate-100 p-2 rounded w-fit">
                        <Server size={16} className="mr-2" />
                        <ArrowLeftRight size={16} className="mx-2" />
                        <Lock size={16} className="text-green-600" />
                        <span className="ml-2">공개키 전송</span>
                    </div>
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-yellow-600">3</span>
                </div>
                <div className="ml-6 flex-1">
                    <h4 className="font-bold text-lg">임시 키 생성 & 암호화</h4>
                    <p className="text-slate-600">
                        브라우저는 빠른 통신을 위해 <strong>대칭키(세션키)</strong>를 하나 만듭니다. <br/>
                        그리고 이 대칭키를 <strong>서버의 공개키</strong>로 잠가서 서버에 보냅니다.
                    </p>
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded text-sm text-yellow-800">
                        핵심: 대칭키를 안전하게 보내기 위해 비대칭키를 사용함!
                    </div>
                </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">4</span>
                </div>
                <div className="ml-6 flex-1">
                    <h4 className="font-bold text-lg">안전한 통신 시작</h4>
                    <p className="text-slate-600">
                        이제 둘 다 똑같은 <strong>대칭키</strong>를 가지고 있습니다. <br/>
                        비대칭키는 느리니까, 이제부터는 빠르고 안전한 대칭키로 데이터를 주고받습니다.
                    </p>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-6 rounded-xl">
        <h3 className="font-bold text-lg mb-2">왜 이렇게 복잡한가요?</h3>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
            <li><strong>비대칭키만 쓰면:</strong> 너무 느려서 유튜브 영상 하나 보는데 1시간 걸릴지도 모릅니다.</li>
            <li><strong>대칭키만 쓰면:</strong> 처음 열쇠를 보낼 때 해커가 훔쳐가면 끝장입니다.</li>
            <li><strong>결론:</strong> 열쇠 배달할 때만 비대칭키를 쓰고, 그 뒤론 빠른 대칭키를 쓰는 천재적인 방법!</li>
        </ul>
      </div>
    </div>
  );
};

export default HttpsExplainer;
