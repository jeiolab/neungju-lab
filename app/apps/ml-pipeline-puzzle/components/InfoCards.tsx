import React from 'react';
import { BookOpen, AlertTriangle, Layers, Search, Server, Brain, Activity, Rocket } from 'lucide-react';

export const InfoCards: React.FC = () => {
  return (
    <div className="space-y-8 pb-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">기계학습 파이프라인 가이드</h2>
        <p className="text-slate-600">성공적인 AI 프로젝트를 위한 단계별 핵심 개념과 체크리스트</p>
      </div>

      {/* 1. Process Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard 
            icon={Search} 
            color="bg-blue-100 text-blue-600" 
            title="1. 문제 정의 (Problem Definition)" 
            desc="무엇을 해결할지, 어떤 가치를 줄지 명확히 합니다."
            checklist={["해결하려는 문제가 명확한가?", "머신러닝이 꼭 필요한가?", "목표 성능 지표는 무엇인가?"]}
        />
        <InfoCard 
            icon={Server} 
            color="bg-green-100 text-green-600" 
            title="2. 데이터 수집 (Data Collection)" 
            desc="학습에 필요한 양질의 데이터를 모으고 라벨링합니다."
            checklist={["데이터 소스가 신뢰할 만한가?", "다양한 케이스를 포함하는가?", "편향(Bias)은 없는가?"]}
        />
        <InfoCard 
            icon={Layers} 
            color="bg-purple-100 text-purple-600" 
            title="3. 탐색 및 전처리 (Preprocessing)" 
            desc="데이터를 정제하고, 모델이 이해할 수 있는 형태로 변환합니다."
            checklist={["결측치(빈 값)는 처리했는가?", "이상치(Outlier)를 제거했는가?", "정규화/표준화를 수행했는가?"]}
        />
        <InfoCard 
            icon={Brain} 
            color="bg-indigo-100 text-indigo-600" 
            title="4. 모델 학습 (Model Training)" 
            desc="데이터에서 패턴을 찾도록 알고리즘을 학습시킵니다."
            checklist={["적절한 알고리즘을 선택했는가?", "과적합(Overfitting) 방지 대책이 있는가?", "학습 시간이 충분한가?"]}
        />
         <InfoCard 
            icon={Activity} 
            color="bg-orange-100 text-orange-600" 
            title="5. 성능 평가 (Evaluation)" 
            desc="학습되지 않은 데이터를 사용해 모델의 실력을 검증합니다."
            checklist={["테스트 셋을 분리했는가?", "정확도 외 다른 지표도 확인했는가?", "목표 성능을 달성했는가?"]}
        />
         <InfoCard 
            icon={Rocket} 
            color="bg-pink-100 text-pink-600" 
            title="6. 개선 및 배포 (Deployment)" 
            desc="실제 환경에 적용하고 지속적으로 모니터링하며 개선합니다."
            checklist={["실제 사용자 피드백을 반영했는가?", "지속적인 재학습 계획이 있는가?", "예상치 못한 오류에 대비했는가?"]}
        />
      </div>

      {/* 2. Ethics Card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-4 text-lg">
            <AlertTriangle className="w-6 h-6" />
            데이터 수집 시 윤리적 주의사항
        </h3>
        <div className="space-y-3 text-slate-700">
            <div className="flex gap-3">
                <span className="font-bold min-w-[80px] text-amber-700">저작권</span>
                <p className="text-sm">인터넷의 모든 이미지나 글이 무료는 아닙니다. 크리에이티브 커먼즈(CCL) 라이선스를 확인하거나 직접 생성한 데이터를 사용하세요.</p>
            </div>
            <div className="flex gap-3">
                <span className="font-bold min-w-[80px] text-amber-700">개인정보</span>
                <p className="text-sm">친구들의 얼굴, 이름, 전화번호 등이 포함된 데이터를 동의 없이 수집/공개하면 법적 문제가 발생할 수 있습니다. 비식별화(모자이크 등) 처리가 필수입니다.</p>
            </div>
            <div className="flex gap-3">
                <span className="font-bold min-w-[80px] text-amber-700">편향성</span>
                <p className="text-sm">특정 성별, 인종, 연령대에 치우친 데이터는 공정하지 못한 AI를 만듭니다. 다양성을 고려하여 데이터를 수집하세요.</p>
            </div>
        </div>
      </div>
      
      {/* 3. Glossary Mini */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-slate-500" />
            핵심 용어 사전
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <GlossaryItem term="Labeling (라벨링)" desc="데이터에 정답(태그)을 달아주는 작업 (예: 사진에 '고양이'라고 적기)" />
            <GlossaryItem term="Overfitting (과적합)" desc="모델이 학습 데이터만 너무 외워서 새로운 데이터에는 약한 상태" />
            <GlossaryItem term="Epoch (에포크)" desc="학습 데이터 전체를 한 번 훑어서 공부한 횟수" />
            <GlossaryItem term="Hyperparameter" desc="학습 속도, 층의 깊이 등 사람이 직접 설정해야 하는 값" />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, color, title, desc, checklist }: any) => (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
        <p className="text-sm text-slate-600 mb-3 leading-relaxed">{desc}</p>
        <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Checklist</p>
            <ul className="space-y-1">
                {checklist.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <span className="text-green-500 mt-0.5">✔</span>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const GlossaryItem = ({ term, desc }: any) => (
    <div className="border-b border-slate-100 pb-2 last:border-0">
        <span className="font-bold text-indigo-700 block mb-0.5">{term}</span>
        <span className="text-slate-600">{desc}</span>
    </div>
);