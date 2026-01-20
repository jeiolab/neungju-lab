import React from 'react';
import { User, MessageCircle } from 'lucide-react';

const DeepDiveTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full pointer-events-none"></div>
        
        <h2 className="text-3xl font-bold text-purple-600 mb-6 flex items-center gap-3">
          <User className="w-8 h-8" />
          파이썬의 미스터리, 'self'란?
        </h2>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            많은 학생들이 파이썬 클래스를 처음 배울 때 가장 헷갈려 하는 것이 바로 
            <code className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded mx-1">self</code> 
            입니다.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-gray-900 mb-2">간단 비유: "나 자신"</h3>
            <p>
              여러분이 <strong>'아이언맨 수트'</strong> 설계도(Class)를 가지고 
              수트 1호기(Object A)와 수트 2호기(Object B)를 만들었다고 상상해봅시다.
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>1호기가 "공격해!" 명령을 받으면, <strong>1호기 자신</strong>의 미사일이 나가야겠죠?</li>
              <li>2호기가 "날아올라!" 명령을 받으면, <strong>2호기 자신</strong>의 부스터가 켜져야 합니다.</li>
            </ul>
            <p className="mt-3">
              이때 "누구의 미사일인지", "누구의 부스터인지"를 명확히 가리키는 손가락이 바로 <code className="text-purple-700">self</code>입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">코드 없이 생각하기</h4>
              <div className="bg-gray-50 p-4 rounded text-sm h-full flex flex-col justify-center border border-gray-200">
                <p className="text-gray-700">"철수야, 밥 먹어." (철수가 먹음)</p>
                <p className="text-gray-700">"영희야, 밥 먹어." (영희가 먹음)</p>
                <div className="mt-4 text-gray-500 text-xs border-t border-gray-300 pt-2">
                  함수를 부를 때 주체를 명확히 하는 것과 같습니다.
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">코드로 확인하기</h4>
              <pre className="bg-gray-50 p-4 rounded text-sm font-mono text-purple-700 h-full border border-gray-200">
{`class Suit:
  def attack(self):
    # self가 없으면 누구의 팔인지 모름!
    print(self.name + " 미사일 발사!") 

mk1 = Suit("Mark 1")
mk2 = Suit("Mark 2")

mk1.attack() # self는 mk1이 됨
mk2.attack() # self는 mk2가 됨`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeepDiveTab;