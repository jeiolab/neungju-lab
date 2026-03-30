import React, { useState } from 'react';
import { DataType } from '../types';
import { Box, Type, Hash, ToggleLeft, CheckCircle2, AlertTriangle } from 'lucide-react';

const TheoryTab: React.FC = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);

  const concepts = [
    {
      type: DataType.INT,
      title: '정수 (Integer)',
      keyword: '딱 떨어지는 수',
      icon: Hash,
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      definition: '소수점이 없는 숫자입니다. 개수를 셀 때 주로 사용합니다.',
      example: '나이 = 17, 방문횟수 = 5',
      truth: '음수(-5)나 0도 정수입니다.',
    },
    {
      type: DataType.FLOAT,
      title: '실수 (Float)',
      keyword: '정밀한 수',
      icon: Hash,
      color: 'bg-orange-100 text-orange-700 border-orange-200',
      definition: '소수점이 있는 숫자입니다. 키나 몸무게처럼 정밀한 측정값에 씁니다.',
      example: '키 = 175.5, 시력 = 1.2',
      truth: '175.0 처럼 뒤에 .0이 붙어도 실수입니다.',
    },
    {
      type: DataType.STR,
      title: '문자열 (String)',
      keyword: '텍스트 상자',
      icon: Type,
      color: 'bg-green-100 text-green-700 border-green-200',
      definition: '글자들의 나열입니다. 따옴표(" " 또는 \' \')로 감싸야 합니다.',
      example: '이름 = "김코딩", 혈액형 = "A"',
      truth: '"123" 처럼 따옴표로 감싸면 숫자도 문자열이 됩니다.',
    },
    {
      type: DataType.BOOL,
      title: '불린 (Boolean)',
      keyword: '참/거짓 스위치',
      icon: ToggleLeft,
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      definition: '오직 True(참) 또는 False(거짓) 두 가지 값만 가집니다.',
      example: '비만여부 = True, 회원인가 = False',
      truth: '"True"(문자열)와 True(불린)은 완전히 다릅니다.',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
          <Box className="mr-2 text-emerald-500" />
          변수(Variable)란 무엇인가요?
        </h2>
        <p className="text-slate-600 text-lg leading-relaxed">
          변수는 데이터를 담는 <strong className="text-emerald-600 bg-emerald-50 px-1 rounded">이름표가 붙은 상자</strong>입니다. 
          상자에 물건을 넣듯이, 변수에는 데이터를 저장할 수 있습니다. 
          하지만 아무 물건이나 막 넣을 순 없죠! 데이터의 종류(모양)에 따라 알맞은 상자(자료형)를 사용해야 컴퓨터가 이해할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {concepts.map((concept) => (
          <div 
            key={concept.type}
            className={`relative rounded-xl border-2 p-6 transition-all cursor-pointer hover:shadow-md ${concept.color} ${flippedCard === concept.type ? 'ring-4 ring-offset-2 ring-emerald-400' : ''}`}
            onClick={() => setFlippedCard(flippedCard === concept.type ? null : concept.type)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white/50 backdrop-blur-sm`}>
                  <concept.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xl">{concept.title}</h3>
                  <span className="text-sm font-medium opacity-75">{concept.keyword}</span>
                </div>
              </div>
              <span className="bg-white/50 px-2 py-1 rounded text-xs font-bold">
                {flippedCard === concept.type ? '설명 닫기' : '눌러서 확인'}
              </span>
            </div>

            <div className="space-y-3 bg-white/60 p-4 rounded-lg">
              <div>
                <span className="font-bold block text-sm mb-1 opacity-70">정의</span>
                <p>{concept.definition}</p>
              </div>
              <div>
                <span className="font-bold block text-sm mb-1 opacity-70">예시</span>
                <code className="bg-slate-800 text-white px-2 py-1 rounded text-sm block w-fit">
                  {concept.example}
                </code>
              </div>
              
              {flippedCard === concept.type && (
                <div className="mt-4 pt-4 border-t border-black/10 animate-slideDown">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-sm block">오해와 진실</span>
                      <p className="text-sm">{concept.truth}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <CheckCircle2 className="mr-2 text-emerald-500" />
          10초 개념 체크
        </h3>
        <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                <span className="text-slate-500">이름("홍길동")은?</span>
                <strong className="text-green-600">String</strong>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                <span className="text-slate-500">몸무게(65.5)는?</span>
                <strong className="text-orange-600">Float</strong>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                <span className="text-slate-500">나이(25)는?</span>
                <strong className="text-blue-600">Int</strong>
            </div>
            <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border shadow-sm">
                <span className="text-slate-500">건강함?(True)는?</span>
                <strong className="text-purple-600">Bool</strong>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TheoryTab;
