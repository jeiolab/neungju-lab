import React from 'react';
import { BookOpen, Search, GitBranch } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">왜 업다운 게임이 "이진 탐색"인가요?</h2>
        <p className="text-lg text-slate-600">절반으로 나누기의 마법을 이해해 봅시다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">기본 개념</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            선형 탐색(Linear Search)은 책의 첫 페이지부터 끝까지 하나씩 찾는 것과 같습니다. 100페이지라면 최악의 경우 100번을 확인해야 합니다.
          </p>
          <p className="text-slate-600 leading-relaxed">
            하지만 <strong>이진 탐색(Binary Search)</strong>은 데이터가 <em>정렬</em>되어 있다는 가정하에 중간부터 시작합니다. 찾는 값이 중간보다 작으면, 위쪽 절반을 즉시 버립니다. 이렇게 매번 범위를 2로 나누며 탐색합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center text-purple-600 mb-4">
            <GitBranch size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">수학적 원리: 로그(Log)</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            숫자 $N$이 1이 될 때까지 2로 몇 번 나눌 수 있는지를 나타내는 것이 <strong>로그($\log_2 N$)</strong>입니다.
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2">
            <li><strong>범위 100:</strong> $\log_2 100 \approx 6.64$ (약 7번)</li>
            <li><strong>범위 1000:</strong> $\log_2 1000 \approx 9.96$ (약 10번)</li>
            <li><strong>범위 1,000,000:</strong> 단 20번이면 충분합니다!</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-800 text-white p-8 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">실생활 예시: 종이 사전</h3>
        <p className="text-slate-300 leading-relaxed">
          종이 사전에서 "Python"이라는 단어를 찾을 때 'A'부터 찾지 않죠? 중간을 펴서 'M'이 나오면 'P'는 그 뒤에 있다는 걸 알고 앞부분을 버립니다. 그리고 뒷부분의 중간을 또 폅니다. 이것이 바로 이진 탐색입니다!
        </p>
      </div>
    </div>
  );
};

export default Theory;