import React from 'react';
import { ArrowRight } from 'lucide-react';

export const DeepDiveSection: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">더 알아보기</h2>
        <p className="text-slate-500">함수와 메서드, 무엇이 다를까요?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500">
          <h3 className="text-xl font-bold mb-4 text-indigo-900">절차지향의 함수 (Function)</h3>
          <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-sm mb-4">
            <p className="text-purple-400">let</p> lateCount = 0;<br/><br/>
            <p className="text-blue-400">function</p> <p className="text-yellow-300 inline">markLate</p>() {'{'}<br/>
            &nbsp;&nbsp;lateCount++;<br/>
            {'}'}<br/><br/>
            <span className="text-slate-500">// 어디서든 호출 가능</span><br/>
            <p className="text-yellow-300 inline">markLate</p>();
          </div>
          <p className="text-slate-600">
            데이터(변수)와 기능(함수)이 분리되어 있습니다. 프로그램이 커지면 어떤 함수가 어떤 데이터를 바꾸는지 추적하기 힘듭니다.
          </p>
        </div>

        <div className="hidden md:flex justify-center text-slate-400">
          <ArrowRight className="w-12 h-12" />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500">
          <h3 className="text-xl font-bold mb-4 text-blue-900">객체지향의 메서드 (Method)</h3>
          <div className="bg-slate-900 text-slate-200 p-4 rounded-lg font-mono text-sm mb-4">
            <p className="text-blue-400">class</p> <p className="text-green-400 inline">Student</p> {'{'}<br/>
            &nbsp;&nbsp;lateCount = 0;<br/>
            &nbsp;&nbsp;<p className="text-yellow-300 inline">markLate</p>() {'{'}<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<p className="text-red-400 inline">this</p>.lateCount++;<br/>
            &nbsp;&nbsp;{'}'}<br/>
            {'}'}<br/><br/>
            <p className="text-blue-400">const</p> s = <p className="text-blue-400 inline">new</p> Student();<br/>
            <span className="text-slate-500">// 객체를 통해서만 호출</span><br/>
            s.<p className="text-yellow-300 inline">markLate</p>();
          </div>
          <p className="text-slate-600">
            데이터와 기능이 <strong>하나의 객체</strong> 안에 묶여 있습니다(캡슐화). <code>s.markLate()</code>는 오직 <code>s</code>의 상태만 바꿉니다.
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 mt-8">
        <h4 className="font-bold text-yellow-800 mb-2">핵심 정리</h4>
        <p className="text-yellow-800">
          "함수는 선언 후 그냥 호출하지만, 메서드는 반드시 <strong>객체를 통해서(점 연산자 <code>.</code>)</strong> 호출합니다."
        </p>
      </div>
    </div>
  );
};
