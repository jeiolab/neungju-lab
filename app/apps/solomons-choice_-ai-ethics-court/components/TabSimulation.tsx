import React, { useState } from 'react';
import { Gavel, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { SimulationCase, UserStats } from '../types';

interface TabSimulationProps {
  onDecision: (safetyDelta: number, innovationDelta: number) => void;
  completedCases: number[];
}

const CASES: SimulationCase[] = [
  {
    id: 1,
    title: "사건번호 2024-01: 채용 AI의 과거 데이터 학습",
    scenario: "국내 대기업 H사는 효율적인 채용을 위해 지난 10년 합격자 데이터를 학습한 AI 면접관을 도입하려 합니다. 그러나 과거 합격자 데이터는 80%가 남성이며, 특정 명문대 출신이 다수 포함되어 있습니다.",
    dilemma: "이 데이터를 그대로 학습시키면 회사가 원하는 '기존 고성과자'와 유사한 인재를 빠르고 정확하게 뽑을 수 있지만(혁신/효율), 여성이나 지방대 출신에게 불리한 편향이 고착화될 수 있습니다(공정/안전).",
    choices: {
      a: {
        text: "금지: 데이터를 보정하기 전까지 도입을 전면 불허한다.",
        safetyImpact: 15,
        innovationImpact: -5,
        feedback: "판결: '도입 불허'. 당신은 편향성의 위험을 막고 공정성을 택했습니다. 기업의 채용 일정은 지연되겠지만, 사회적 차별이 재생산되는 것을 막았습니다."
      },
      b: {
        text: "허용: 일단 도입하되, 사후 모니터링을 강화한다.",
        safetyImpact: -5,
        innovationImpact: 15,
        feedback: "판결: '조건부 허용'. 당신은 기술의 효율성과 혁신 속도를 택했습니다. 채용 비용은 절감되겠지만, 잠재적인 차별 피해자가 발생할 위험을 감수해야 합니다."
      }
    }
  },
  {
    id: 2,
    title: "사건번호 2024-02: 자율주행의 딜레마",
    scenario: "자율주행차 A가 주행 중 갑자기 튀어나온 무단횡단자 5명을 감지했습니다. 급제동이 불가능한 상황입니다. 핸들을 꺾으면 탑승자(1명)가 절벽으로 추락해 사망하고, 그대로 가면 보행자 5명이 사망합니다.",
    dilemma: "공리주의적 관점에서 다수를 살리도록 프로그래밍해야 할까요? 아니면 소비자가 구매한 차량인 만큼 탑승자 보호를 최우선으로 해야 할까요?",
    choices: {
      a: {
        text: "보행자 보호 우선: 5명을 살리기 위해 핸들을 꺾는다.",
        safetyImpact: 10,
        innovationImpact: -10,
        feedback: "판결: '다수의 안전 우선'. 당신은 전체 인명 피해를 최소화하는 공리주의적 선택을 했습니다. 하지만 '나를 죽일 수도 있는 차'를 소비자들이 구매하려 할까요? 자율주행 산업이 위축될 수 있습니다."
      },
      b: {
        text: "탑승자 보호 우선: 구매자를 보호하기 위해 직진한다.",
        safetyImpact: -10,
        innovationImpact: 10,
        feedback: "판결: '탑승자 보호 우선'. 당신은 개인의 소유권과 기술 신뢰도를 택했습니다. 자율주행차 보급은 빨라지겠지만, '윤리적 이기주의'라는 비판을 피하기 어렵습니다."
      }
    }
  },
  {
    id: 3,
    title: "사건번호 2024-03: 생성형 AI와 딥페이크 규제",
    scenario: "실제 사람과 구별할 수 없는 영상을 만드는 딥페이크 기술이 엔터테인먼트 산업에서 각광받고 있습니다. 하지만 이를 악용한 범죄도 급증하고 있습니다. 정부는 모든 생성형 AI 영상에 '워터마크'를 강제하고, 사전 검열을 도입하려 합니다.",
    dilemma: "강력한 사전 규제는 범죄를 예방하지만(안전), 스타트업의 기술 개발 비용을 높이고 창작의 자유를 위축시킵니다(혁신).",
    choices: {
      a: {
        text: "강력 규제: 사전 검열 및 워터마크 의무화 찬성.",
        safetyImpact: 20,
        innovationImpact: -10,
        feedback: "판결: '규제 강화'. 당신은 사회적 혼란과 범죄 예방을 최우선으로 두었습니다. 딥페이크 범죄는 줄어들겠지만, 관련 기술 기업들이 규제가 없는 해외로 떠날 수 있습니다."
      },
      b: {
        text: "자율 규제: 기술 발전 저해 반대, 사후 처벌 강화.",
        safetyImpact: -10,
        innovationImpact: 20,
        feedback: "판결: '자율 규제'. 당신은 창작의 자유와 기술 발전을 지지했습니다. AI 콘텐츠 산업은 폭발적으로 성장하겠지만, 가짜 뉴스와 사기 범죄의 위험에 노출될 수 있습니다."
      }
    }
  }
];

export const TabSimulation: React.FC<TabSimulationProps> = ({ onDecision, completedCases }) => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'scenario' | 'result'>('intro');
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<'a' | 'b' | null>(null);

  const activeCase = CASES[activeCaseIndex];
  const isAllCompleted = completedCases.length >= CASES.length;

  const handleStartCase = (index: number) => {
    setActiveCaseIndex(index);
    setCurrentStep('scenario');
    setSelectedChoice(null);
  };

  const handleDecision = (choice: 'a' | 'b') => {
    setSelectedChoice(choice);
    setCurrentStep('result');
    onDecision(activeCase.choices[choice].safetyImpact, activeCase.choices[choice].innovationImpact);
  };

  if (isAllCompleted && currentStep === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center animate-fade-in">
        <div className="bg-green-100 p-6 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">모든 재판 완료</h2>
        <p className="text-gray-600 mb-8 max-w-md">
          수고하셨습니다, 위원장님. 모든 안건에 대한 판결을 내리셨습니다.<br/>
          이제 상단의 성향 분석을 확인하거나, '퀴즈' 탭으로 이동하여 개념을 정리해보세요.
        </p>
      </div>
    );
  }

  if (currentStep === 'intro') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Gavel className="text-law-gold" />
          진행 중인 사건 목록
        </h2>
        <div className="grid gap-4">
          {CASES.map((c, idx) => {
            const isDone = completedCases.includes(c.id);
            return (
              <div 
                key={c.id}
                className={`p-6 rounded-xl border-2 transition-all ${
                  isDone 
                    ? 'bg-gray-100 border-gray-200 opacity-70' 
                    : 'bg-white border-law-blue/10 hover:border-law-gold cursor-pointer shadow-sm hover:shadow-md'
                }`}
                onClick={() => !isDone && handleStartCase(idx)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${isDone ? 'bg-gray-300 text-gray-600' : 'bg-red-100 text-red-600'}`}>
                      {isDone ? '판결 완료' : '재판 대기 중'}
                    </span>
                    <h3 className="text-lg font-bold mt-2 text-gray-800">{c.title}</h3>
                  </div>
                  {!isDone && <ArrowRight className="text-gray-400" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden animate-fade-in flex flex-col min-h-[600px]">
      {/* Header */}
      <div className="bg-law-blue p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <span className="text-law-gold font-bold tracking-widest text-sm">AI ETHICS COURT</span>
          <span className="text-gray-400 text-sm">Case #{activeCase.id}</span>
        </div>
        <h2 className="text-2xl font-serif font-bold">{activeCase.title}</h2>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        {currentStep === 'scenario' && (
          <>
            <div className="space-y-6 flex-1">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={20} /> 사건 개요
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{activeCase.scenario}</p>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="font-bold text-amber-800 mb-2">⚖️ 윤리적 딜레마</h3>
                <p className="text-amber-900 font-medium text-lg">{activeCase.dilemma}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => handleDecision('a')}
                className="group p-6 rounded-xl border-2 border-slate-200 hover:border-law-blue hover:bg-slate-50 transition-all text-left"
              >
                <span className="block text-sm font-bold text-gray-500 mb-2 group-hover:text-law-blue">OPTION A</span>
                <span className="text-lg font-bold text-gray-800">{activeCase.choices.a.text}</span>
              </button>

              <button 
                onClick={() => handleDecision('b')}
                className="group p-6 rounded-xl border-2 border-slate-200 hover:border-law-blue hover:bg-slate-50 transition-all text-left"
              >
                <span className="block text-sm font-bold text-gray-500 mb-2 group-hover:text-law-blue">OPTION B</span>
                <span className="text-lg font-bold text-gray-800">{activeCase.choices.b.text}</span>
              </button>
            </div>
          </>
        )}

        {currentStep === 'result' && selectedChoice && (
          <div className="flex flex-col h-full animate-fade-in">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <Gavel size={64} className="text-law-blue mb-4" />
              <h3 className="text-2xl font-serif font-bold text-gray-900">판결이 선고되었습니다</h3>
              
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-200 max-w-2xl w-full">
                <p className="text-xl text-gray-800 leading-relaxed font-medium">
                  {activeCase.choices[selectedChoice].feedback}
                </p>
              </div>

              <div className="flex gap-8 mt-4">
                <div className={`text-center ${activeCase.choices[selectedChoice].safetyImpact > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  <span className="block text-sm text-gray-500">사회적 안전</span>
                  <span className="text-2xl font-bold">{activeCase.choices[selectedChoice].safetyImpact > 0 ? '+' : ''}{activeCase.choices[selectedChoice].safetyImpact}</span>
                </div>
                <div className={`text-center ${activeCase.choices[selectedChoice].innovationImpact > 0 ? 'text-cyan-600' : 'text-red-500'}`}>
                  <span className="block text-sm text-gray-500">기술 혁신</span>
                  <span className="text-2xl font-bold">{activeCase.choices[selectedChoice].innovationImpact > 0 ? '+' : ''}{activeCase.choices[selectedChoice].innovationImpact}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setCurrentStep('intro')}
              className="mt-8 w-full bg-law-blue text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              재판 목록으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
