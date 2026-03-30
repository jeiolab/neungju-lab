import React from 'react';
import { Fingerprint, ArrowRightLeft, ShieldAlert, FileDigit } from 'lucide-react';

const ConceptCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string;
  color: string;
}> = ({ title, icon, description, details, color }) => (
  <div className={`p-6 rounded-xl border-2 ${color} bg-white hover:shadow-lg transition-shadow duration-300`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="p-3 rounded-full bg-slate-100 text-slate-700">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <p className="text-lg font-medium text-slate-700 mb-2">{description}</p>
    <p className="text-sm text-slate-500 leading-relaxed">{details}</p>
  </div>
);

const TabConcept: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">해시(Hash)란 무엇인가?</h2>
        <p className="text-slate-600">
          디지털 세계의 지문이라고 불리는 해시 함수는 데이터의 무결성을 검증하는 핵심 기술입니다.
          원본이 조금이라도 훼손되면, 지문은 완전히 달라집니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConceptCard
          title="디지털 지문"
          icon={<Fingerprint size={24} />}
          description="모든 데이터는 고유한 값을 가집니다."
          details="사람마다 지문이 다르듯, 디지털 파일도 내용에 따라 고유한 문자열(해시값)을 가집니다. 파일 이름이 같아도 내용이 1비트라도 다르면 지문은 다릅니다."
          color="border-blue-100 hover:border-blue-400"
        />
        
        <ConceptCard
          title="일방향성"
          icon={<ArrowRightLeft size={24} />}
          description="결과를 보고 원본을 알 수 없습니다."
          details="소시지를 보고 원래 돼지의 모습을 복원할 수 없듯이, 해시값을 보고 원래의 비밀번호나 텍스트를 역추적하는 것은 수학적으로 매우 어렵습니다."
          color="border-green-100 hover:border-green-400"
        />

        <ConceptCard
          title="고정 길이"
          icon={<FileDigit size={24} />}
          description="데이터 크기에 상관없이 길이는 같습니다."
          details="입력이 'A' 한 글자이든, 백과사전 전체이든 SHA-256 알고리즘을 통과하면 항상 64자리의 16진수 문자열이 나옵니다."
          color="border-purple-100 hover:border-purple-400"
        />

        <ConceptCard
          title="쇄도 효과 (Avalanche Effect)"
          icon={<ShieldAlert size={24} />}
          description="아주 작은 변화가 큰 차이를 만듭니다."
          details="입력값의 점 하나(.)만 바뀌어도 출력되는 해시값은 완전히 뒤바뀝니다. 이 특성 덕분에 데이터의 위변조를 즉시 감지할 수 있습니다."
          color="border-red-100 hover:border-red-400"
        />
      </div>

      <div className="mt-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="font-bold text-lg mb-2">💡 실제 활용 사례</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          <li><strong>비밀번호 저장:</strong> 사이트 운영자는 여러분의 비밀번호 원본 대신 해시값만 저장합니다.</li>
          <li><strong>소프트웨어 검증:</strong> 다운로드한 파일이 해커에 의해 조작되지 않았는지 확인합니다.</li>
          <li><strong>블록체인:</strong> 이전 블록의 해시값을 현재 블록에 포함시켜 연결 고리를 만듭니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default TabConcept;