import React from 'react';
import { Gamepad2, Car, Bot } from 'lucide-react';

const MoreInfoTab: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fadeIn">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">게임 속 강화 학습 AI</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="h-40 bg-red-500 flex items-center justify-center text-white">
                    <Gamepad2 size={64} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">슈퍼 마리오 AI</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        "화면의 픽셀을 보고, 오른쪽으로 가면 점수가 오른다는 것을 배웁니다. 구멍에 빠지면(벌칙) 다시는 그 행동을 하지 않으려 하죠."
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li>• 입력: 게임 화면 (픽셀)</li>
                        <li>• 행동: 점프, 이동, 달리기</li>
                        <li>• 보상: 거리 전진, 코인 획득</li>
                    </ul>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="h-40 bg-purple-600 flex items-center justify-center text-white">
                    <Bot size={64} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">스타크래프트 II (AlphaStar)</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        "수많은 유닛을 동시에 컨트롤하며 자원을 캐고 전투를 합니다. 프로게이머의 리플레이를 보고 배우다가, 나중엔 스스로 대결하며 초인적인 전략을 만듭니다."
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li>• 복잡도: 바둑보다 훨씬 복잡함</li>
                        <li>• 보상: 게임 승리 (장기적 목표)</li>
                    </ul>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="h-40 bg-slate-800 flex items-center justify-center text-white">
                    <Car size={64} className="group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">자율주행 자동차</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        "가상의 시뮬레이터에서 수백만 km를 주행합니다. 차선 유지, 신호 준수, 보행자 보호 등을 점수로 환산하여 안전한 운전을 배웁니다."
                    </p>
                    <ul className="text-xs text-slate-500 space-y-1">
                        <li>• 환경: 도로, 날씨, 다른 차량</li>
                        <li>• 벌칙: 충돌, 급정거, 차선 이탈</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-xl text-center">
            <p className="text-slate-600 italic">
                "강화 학습은 정답이 없는 문제에서, 스스로 최적의 답을 찾아내는 강력한 도구입니다."
            </p>
        </div>
    </div>
  );
};

export default MoreInfoTab;
