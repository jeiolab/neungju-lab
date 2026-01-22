import React from 'react';
import { MessageCircle, Scale, ShieldAlert } from 'lucide-react';

const Discussion: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center justify-center gap-2">
                <MessageCircle className="text-blue-600" /> 보안 쟁점 토론
            </h2>
            <p className="text-slate-500">정답이 없는 문제들입니다. 당신의 생각은 어떤가요?</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Scale className="text-amber-500" /> 주제 1: 편리함 vs 보안성
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
                보안이 강력해질수록 사용자는 불편해집니다 (비밀번호 복잡도, 2차 인증, 짧은 세션 시간 등).
                반대로 너무 편리하면 보안은 취약해집니다.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 italic mb-4 border border-slate-200">
                "은행 앱을 쓸 때마다 공인인증서에 OTP까지 입력하는 건 너무 귀찮아. 그냥 지문 한 번이면 안 돼?" 
                <br/> vs <br/>
                "편리하게 만들었다가 내 전 재산이 털리면 누가 책임지죠?"
            </div>
            <textarea 
                placeholder="당신의 생각을 자유롭게 적어보세요 (저장되지 않습니다)" 
                className="w-full bg-white text-slate-800 p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none h-24"
            ></textarea>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldAlert className="text-red-500" /> 주제 2: 개인정보와 공공의 안전
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
                범죄 수사를 위해 수사기관이 개인의 암호화된 메신저(텔레그램 등) 내용을 볼 수 있어야 할까요?
                '백도어(Backdoor)'를 만드는 것은 테러 방지에 도움이 될 수 있지만, 
                일반 시민의 사생활도 감시당할 위험이 있습니다.
            </p>
            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 italic mb-4 border border-slate-200">
                "범죄자 잡는데 프라이버시가 무슨 소용인가요? 다 볼 수 있어야 합니다."
                <br/> vs <br/>
                "그 권한을 가진 사람이 타락하면, 우리 모두는 감시 사회에 살게 됩니다."
            </div>
            <textarea 
                placeholder="당신의 생각을 자유롭게 적어보세요 (저장되지 않습니다)" 
                className="w-full bg-white text-slate-800 p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none h-24"
            ></textarea>
        </div>
    </div>
  );
};

export default Discussion;
