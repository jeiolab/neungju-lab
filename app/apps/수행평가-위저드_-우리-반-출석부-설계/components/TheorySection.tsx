import React from 'react';
import { BookOpen, Box, ArrowRightLeft, Layers } from 'lucide-react';

const TheoryCard = ({ title, icon: Icon, children, color }: { title: string, icon: any, children?: React.ReactNode, color: string }) => (
  <div className={`bg-white rounded-xl shadow-md border-l-4 ${color} p-6 mb-4 transition-transform hover:scale-[1.01]`}>
    <div className="flex items-center mb-3">
      <div className={`p-2 rounded-lg mr-3 ${color.replace('border-', 'bg-').replace('500', '100')}`}>
        <Icon className={`w-6 h-6 ${color.replace('border-', 'text-').replace('500', '600')}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    </div>
    <div className="text-slate-600 leading-relaxed">
      {children}
    </div>
  </div>
);

export const TheorySection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">객체지향 이론 학습</h2>
        <p className="text-slate-500">클래스와 객체의 핵심 개념을 먼저 익혀봅시다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TheoryCard title="클래스 (Class)" icon={BookOpen} color="border-blue-500">
          <p className="mb-2"><strong>"설계도"</strong> 또는 <strong>"붕어빵 틀"</strong>입니다.</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>객체를 만들기 위한 템플릿입니다.</li>
            <li>속성(데이터)과 메서드(동작)를 정의합니다.</li>
            <li>그 자체로는 실체가 아닙니다.</li>
          </ul>
        </TheoryCard>

        <TheoryCard title="인스턴스 (Instance)" icon={Box} color="border-green-500">
          <p className="mb-2"><strong>"실체"</strong> 또는 <strong>"붕어빵"</strong>입니다.</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>클래스를 이용해 메모리에 생성된 객체입니다.</li>
            <li>각각 독립적인 상태(데이터)를 가집니다.</li>
            <li><code>new Student()</code> 처럼 생성합니다.</li>
          </ul>
        </TheoryCard>

        <TheoryCard title="메서드 (Method)" icon={ArrowRightLeft} color="border-purple-500">
          <p className="mb-2"><strong>"동작"</strong> 또는 <strong>"기능"</strong>입니다.</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>객체가 수행할 수 있는 행동입니다.</li>
            <li>객체의 속성(상태)를 변경하거나 활용합니다.</li>
            <li>함수와 비슷하지만 객체에 소속됩니다.</li>
          </ul>
        </TheoryCard>

        <TheoryCard title="상태 변경" icon={Layers} color="border-orange-500">
          <p className="mb-2"><strong>"변화"</strong>는 인스턴스 단위로 일어납니다.</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>A 학생이 지각했다고 B 학생의 지각 횟수가 늘어나지 않습니다.</li>
            <li>메서드는 호출된 특정 인스턴스의 상태만 바꿉니다.</li>
          </ul>
        </TheoryCard>
      </div>
    </div>
  );
};