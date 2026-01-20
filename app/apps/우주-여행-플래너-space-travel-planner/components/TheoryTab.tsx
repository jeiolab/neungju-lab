import React from 'react';
import { BookOpen, Code, Box } from 'lucide-react';

const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in text-gray-200">
      <div className="bg-space-800 p-6 rounded-xl border border-space-700 shadow-lg">
        <h2 className="text-2xl font-bold text-space-accent mb-4 flex items-center gap-2">
          <Box className="w-6 h-6" />
          왜 '클래스(Class)'가 필요할까요?
        </h2>
        <p className="mb-4 leading-relaxed">
          우주에는 수많은 행성이 있습니다. 수성, 금성, 지구, 화성... <br/>
          이 행성들의 정보를 컴퓨터에 저장하려면 어떻게 해야 할까요?
          단순히 변수나 딕셔너리를 사용할 수도 있지만, 
          <strong>비슷한 속성(이름, 크기, 거리)</strong>과 
          <strong>동작(공전하기, 여행 시간 계산하기)</strong>을 가진 것들을 
          효율적으로 관리하기 위해 <strong>클래스</strong>를 사용합니다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dictionary Approach */}
        <div className="bg-gray-900 p-6 rounded-xl border border-red-900/50">
          <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
            <Code className="w-5 h-5" />
            1. 딕셔너리(Dictionary) 방식
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            행성이 늘어날 때마다 변수를 계속 새로 만들어야 합니다. 오타가 나기 쉽고 관리가 어렵습니다.
          </p>
          <pre className="bg-black p-4 rounded-lg text-sm font-mono text-green-400 overflow-x-auto">
{`# 수성 데이터
mercury = {
  "name": "수성",
  "distance": 91691000,
  "gravity": 3.7
}

# 금성 데이터
venus = {
  "nmae": "금성", # 오타 발생 위험!
  "dist": 41400000, # 키 이름 불일치!
  "gravity": 8.87
}

def calculate_time(planet, speed):
  return planet["distance"] / speed`}
          </pre>
        </div>

        {/* Class Approach */}
        <div className="bg-gray-900 p-6 rounded-xl border border-space-accent/50">
          <h3 className="text-xl font-bold text-space-accent mb-3 flex items-center gap-2">
            <Box className="w-5 h-5" />
            2. 클래스(Class) 방식
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            '행성'이라는 설계도(Class)를 하나 잘 만들어두면, '객체(Object)'를 무한히 찍어낼 수 있습니다.
          </p>
          <pre className="bg-black p-4 rounded-lg text-sm font-mono text-blue-400 overflow-x-auto">
{`class Planet:
  def __init__(self, name, distance, gravity):
    self.name = name
    self.distance = distance
    self.gravity = gravity

  def calculate_travel_time(self, speed):
    return self.distance / speed

# 객체 생성 (깔끔하고 통일성 있음)
mercury = Planet("수성", 91691000, 3.7)
venus = Planet("금성", 41400000, 8.87)`}
          </pre>
        </div>
      </div>

      <div className="bg-space-800 p-6 rounded-xl border-l-4 border-yellow-500">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">NASA 디렉터의 한마디</h3>
        <p className="italic text-gray-300">
          "클래스는 붕어빵 틀과 같습니다. 틀(Class)은 하나지만, 
          그 안에서 팥 붕어빵, 슈크림 붕어빵(Object) 등 서로 다른 속성을 가진 결과물을 
          계속 만들어낼 수 있죠. 이것이 객체 지향 프로그래밍의 핵심입니다!"
        </p>
      </div>
    </div>
  );
};

export default TheoryTab;