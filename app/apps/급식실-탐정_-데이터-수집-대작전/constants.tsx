import React from 'react';
import { Mission, QuizQuestion } from './types';
import { 
  Database, 
  FileText, 
  Scale, 
  CloudSun, 
  Video, 
  UserCheck, 
  ClipboardList,
  Thermometer,
  Wifi
} from 'lucide-react';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "문제 정의하기",
    description: "급식실이 너무 붐벼서 밥 먹을 시간이 부족해요! 가장 먼저 무엇을 알아야 할까요?",
    scenario: "탐정님, 급식실 줄이 왜 이렇게 긴 걸까요? 문제의 원인을 파악하기 위해 어떤 데이터를 먼저 수집해야 할까요?",
    options: [
      { id: 'A', label: "학생들이 좋아하는 반찬 순위 (선호도)", icon: <ClipboardList className="w-8 h-8" /> },
      { id: 'B', label: "시간대별 급식실 입장 인원 (혼잡도)", icon: <UserCheck className="w-8 h-8" /> }
    ],
    correctId: 'B',
    feedbackCorrect: "맞아요! '혼잡'이 문제이므로, 언제 얼마나 많은 사람이 몰리는지 파악하는 게 우선입니다.",
    feedbackWrong: "반찬 선호도는 메뉴 개선에는 좋지만, 당장의 '혼잡도' 문제를 해결하는 핵심 데이터는 아니에요."
  },
  {
    id: 2,
    title: "데이터 유형 구분",
    description: "데이터에는 '정형'과 '비정형'이 있어요. 컴퓨터가 바로 계산할 수 있는 건 뭘까요?",
    scenario: "급식 카드를 찍을 때 기록되는 '입장 시간' 데이터는 어떤 유형일까요?",
    options: [
      { id: 'A', label: "정형 데이터 (Structured)", icon: <Database className="w-8 h-8" /> },
      { id: 'B', label: "비정형 데이터 (Unstructured)", icon: <FileText className="w-8 h-8" /> }
    ],
    correctId: 'A',
    feedbackCorrect: "정답입니다! 엑셀 표처럼 행과 열로 정리되어 통계 내기 쉬운 데이터는 '정형 데이터'입니다.",
    feedbackWrong: "비정형 데이터는 영상, 소리, 긴 글 같은 형태예요. 입장 시간은 숫자로 딱 떨어지니 정형 데이터죠!"
  },
  {
    id: 3,
    title: "수집 도구 매칭 (잔반량)",
    description: "학생들이 밥을 얼마나 남기는지 정확히 알고 싶어요.",
    scenario: "친구들에게 '밥 얼마나 남겼니?'라고 일일이 물어보는 건 부정확해요. 자동으로 정확하게 잔반 무게를 측정하려면?",
    options: [
      { id: 'A', label: "설문조사 진행", icon: <ClipboardList className="w-8 h-8" /> },
      { id: 'B', label: "음식물 쓰레기통 무게 센서 설치", icon: <Scale className="w-8 h-8" /> }
    ],
    correctId: 'B',
    feedbackCorrect: "훌륭해요! IoT 무게 센서를 쓰면 사람이 개입하지 않고도 실시간으로 정확한 데이터를 '직접 수집'할 수 있어요.",
    feedbackWrong: "설문조사는 기억에 의존해서 부정확할 수 있어요. 센서가 훨씬 객관적인 데이터를 줍니다."
  },
  {
    id: 4,
    title: "수집 도구 매칭 (날씨)",
    description: "비가 오는 날엔 급식실이 더 붐비는 것 같아요. 날씨 데이터를 어떻게 얻을까요?",
    scenario: "학교 옥상에 직접 기상 관측소를 설치할 수도 있지만, 더 쉽고 효율적인 방법이 있을까요?",
    options: [
      { id: 'A', label: "기상청 공공 데이터 활용 (API)", icon: <CloudSun className="w-8 h-8" /> },
      { id: 'B', label: "운동장에서 매일 온도계로 측정", icon: <Thermometer className="w-8 h-8" /> }
    ],
    correctId: 'A',
    feedbackCorrect: "스마트한 선택입니다! 이미 신뢰할 수 있는 기관이 모아둔 '공공 데이터'를 가져다 쓰는 것이 '간접 수집'의 효율적인 예시입니다.",
    feedbackWrong: "직접 재는 건 너무 힘들고, 밤이나 주말 데이터는 놓칠 수 있어요. 이미 있는 데이터를 활용하는 게 효율적이에요!"
  },
  {
    id: 5,
    title: "윤리적 수집 방법",
    description: "급식실에 들어오는 학생 수를 자동으로 세고 싶어요.",
    scenario: "어떤 방법을 써야 학생들의 사생활을 침해하지 않으면서 인원수를 셀 수 있을까요?",
    options: [
      { id: 'A', label: "얼굴 인식 CCTV 설치", icon: <Video className="w-8 h-8" />, isEthical: false },
      { id: 'B', label: "적외선 인원 계수기 (IR 센서)", icon: <Wifi className="w-8 h-8" />, isEthical: true }
    ],
    correctId: 'B',
    feedbackCorrect: "완벽합니다! 적외선 센서는 사람이 지나가는 것만 감지하고 누군지는 식별하지 않아 개인정보 침해 우려가 없습니다.",
    feedbackWrong: "얼굴 인식은 민감한 생체 정보(개인정보)를 수집하게 되므로 학교 급식실 목적으론 과도하고 위험해요!"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 '직접 수집' 방법에 해당하는 것은?",
    options: ["기상청 날씨 데이터 다운로드", "인구주택총조사 통계 활용", "학교 교문 앞에서 직접 설문조사 수행", "인터넷 뉴스 기사 스크랩"],
    correctIndex: 2,
    explanation: "내가 연구 목적을 위해 직접 도구(설문지 등)를 이용해 모으는 것이 '직접 수집'입니다."
  },
  {
    id: 2,
    question: "CCTV 영상이나 친구들의 대화 녹음 파일은 어떤 데이터 유형일까요?",
    options: ["정형 데이터", "비정형 데이터", "반정형 데이터", "숫자 데이터"],
    correctIndex: 1,
    explanation: "영상, 오디오, 텍스트 등 형태가 고정되지 않고 연산이 바로 불가능한 데이터는 '비정형 데이터'입니다."
  },
  {
    id: 3,
    question: "다음 중 데이터 수집 시 반드시 고려해야 할 윤리적 원칙이 아닌 것은?",
    options: ["개인정보 보호", "수집 목적의 정당성", "데이터의 무조건적인 대량 수집", "정보 주체의 동의"],
    correctIndex: 2,
    explanation: "무조건 많이 모으는 것보다, 필요한 데이터만 적법한 절차를 거쳐 모으는 '데이터 최소화' 원칙이 중요합니다."
  },
  {
    id: 4,
    question: "학교 급식 메뉴 정보를 매일 자동으로 가져오려 합니다. 이때 적절한 기술은?",
    options: ["웹 크롤링(Web Crawling)", "설문조사", "센서 측정", "인터뷰"],
    correctIndex: 0,
    explanation: "웹 사이트에 게시된 정보를 프로그램이 자동으로 수집하는 기술을 '크롤링' 또는 '스크래핑'이라고 합니다."
  },
  {
    id: 5,
    question: "IoT 센서가 아닌 것은?",
    options: ["온도 센서", "동작 감지 센서", "종이 설문지", "스마트 워치 심박수 센서"],
    correctIndex: 2,
    explanation: "종이 설문지는 아날로그 방식의 조사 도구이며, 인터넷에 연결되어 데이터를 전송하는 IoT(사물인터넷) 장치가 아닙니다."
  },
  {
    id: 6,
    question: "공공 데이터를 무료로 제공하는 대표적인 웹사이트는?",
    options: ["공공데이터포털(data.go.kr)", "유튜브", "개인 블로그", "온라인 쇼핑몰"],
    correctIndex: 0,
    explanation: "대한민국 정부는 공공데이터포털을 통해 다양한 공공 데이터를 개방하고 있습니다."
  },
  {
    id: 7,
    question: "데이터를 수집하기 전에 가장 먼저 해야 할 일은?",
    options: ["일단 많이 모은다", "문제 정의 및 수집 목적 설정", "비싼 컴퓨터 구매", "설문지 인쇄"],
    correctIndex: 1,
    explanation: "어떤 문제를 해결할지 정의해야 필요한 데이터가 무엇인지 알 수 있습니다."
  },
  {
    id: 8,
    question: "설문조사의 단점으로 가장 적절한 것은?",
    options: ["비용이 매우 비싸다", "응답자가 거짓으로 대답하거나 기억이 부정확할 수 있다", "기계가 고장날 수 있다", "전기가 필요하다"],
    correctIndex: 1,
    explanation: "사람의 주관적인 응답에 의존하므로 객관성이 떨어질 수 있습니다."
  },
  {
    id: 9,
    question: "정형 데이터(Structured Data)의 예시는?",
    options: ["유튜브 브이로그 영상", "카카오톡 대화 내용", "엑셀 파일에 정리된 학생 키와 몸무게", "인스타그램 사진"],
    correctIndex: 2,
    explanation: "행과 열로 구조화된 데이터베이스나 엑셀 표 형태가 대표적인 정형 데이터입니다."
  },
  {
    id: 10,
    question: "빅데이터의 3대 특징(3V)에 속하지 않는 것은?",
    options: ["Volume (규모)", "Velocity (속도)", "Variety (다양성)", "View (경치)"],
    correctIndex: 3,
    explanation: "빅데이터의 3V는 Volume(양), Velocity(속도), Variety(다양성)입니다. 최근엔 Value(가치), Veracity(정확성)을 더해 5V라고도 합니다."
  }
];
