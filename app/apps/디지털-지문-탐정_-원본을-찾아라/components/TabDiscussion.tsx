import React from 'react';
import { HelpCircle, ChevronDown, Lock, ServerCrash } from 'lucide-react';

const AccordionItem: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="text-blue-600">{icon}</div>
          <span className="font-bold text-slate-800">{title}</span>
        </div>
        <ChevronDown
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="p-5 text-slate-600 leading-relaxed border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
};

const TabDiscussion: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">더 생각해보기</h2>
        <p className="text-slate-600 mt-2">
          해시 함수에 대해 궁금했던 점들을 깊이 있게 알아봅시다.
        </p>
      </div>

      <AccordionItem
        title="비밀번호를 그대로 저장하면 왜 안 될까요?"
        icon={<Lock size={20} />}
      >
        <p className="mb-3">
          만약 웹사이트가 여러분의 비밀번호를 '1234' 그대로 데이터베이스에 저장한다면, 
          해커가 데이터베이스를 훔쳤을 때 모든 사용자의 비밀번호가 즉시 노출됩니다.
        </p>
        <p>
          대신 <strong>해시값(예: a6xn...)</strong>으로 저장하면, 
          해커가 데이터를 훔쳐가도 원래 비밀번호가 '1234'인지 알 수 없습니다. 
          로그인할 때는 여러분이 입력한 '1234'를 다시 해시하여 저장된 값과 비교하기만 하면 됩니다.
        </p>
      </AccordionItem>

      <AccordionItem
        title="해시 충돌(Hash Collision)이란 무엇인가요?"
        icon={<ServerCrash size={20} />}
      >
        <p className="mb-3">
          해시 함수는 무한한 데이터를 유한한 길이(예: 256비트)로 줄이는 과정입니다. 
          따라서 이론적으로는 <strong>서로 다른 두 데이터가 우연히 같은 해시값을 가질 확률</strong>이 존재합니다. 
          이를 '해시 충돌'이라고 합니다.
        </p>
        <p>
          하지만 SHA-256 같은 현대 암호화 해시 함수에서 충돌이 일어날 확률은 
          우주에 있는 모래알 중 특정 두 개를 우연히 집을 확률보다 낮습니다. 
          사실상 '불가능'에 가깝다고 간주하고 사용합니다.
        </p>
      </AccordionItem>

      <AccordionItem
        title="해시값은 복호화(원래대로 되돌리기)가 불가능한가요?"
        icon={<HelpCircle size={20} />}
      >
        <p className="mb-3">
          네, 기본적으로 불가능합니다. 해시 함수는 믹서기에 과일을 넣고 가는 것과 같습니다. 
          주스를 보고 원래 과일의 모양을 완벽히 복구할 수 없는 것과 같은 이치입니다.
        </p>
        <p>
          하지만 '레인보우 테이블' 공격처럼, 미리 계산된 수억 개의 해시값 목록과 대조하여 
          쉬운 비밀번호(예: password123)를 찾아내는 방법은 존재합니다. 
          그래서 '솔트(Salt)'라는 무작위 데이터를 섞어서 해시를 더욱 복잡하게 만듭니다.
        </p>
      </AccordionItem>
    </div>
  );
};

export default TabDiscussion;