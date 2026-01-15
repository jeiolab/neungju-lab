import { Concept } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'iot',
    term: '사물 인터넷 (IoT)',
    definition: '인터넷을 기반으로 모든 사물을 연결하여 사람과 사물, 사물과 사물 간의 정보를 상호 소통하는 지능형 기술 및 서비스.',
    example: '스마트폰으로 집 밖에서 보일러를 켜거나, 냉장고가 부족한 식재료를 알려주는 스마트 홈 시스템.',
    category: 'Core'
  },
  {
    id: 'cloud',
    term: '클라우드 컴퓨팅 (Cloud Computing)',
    definition: '인터넷을 통해 서버, 스토리지, 데이터베이스 등의 컴퓨팅 서비스를 필요한 만큼 빌려 쓰고 비용을 지불하는 방식.',
    example: '구글 드라이브나 네이버 MYBOX에 사진을 저장하고, 언제 어디서든 스마트폰으로 꺼내 보는 것.',
    category: 'Core'
  },
  {
    id: 'bigdata',
    term: '빅데이터 (Big Data)',
    definition: '디지털 환경에서 생성되는 데이터로, 그 규모가 방대하고, 생성 주기가 짧으며, 형태도 수치 데이터뿐 아니라 문자와 영상 데이터를 포함하는 대규모 데이터.',
    example: '유튜브가 내가 시청한 영상을 분석하여 내가 좋아할 만한 새로운 영상을 추천해주는 알고리즘.',
    category: 'Core'
  },
  {
    id: 'ai',
    term: '인공지능 (AI)',
    definition: '인간의 학습 능력, 추론 능력, 지각 능력, 자연어 이해 능력 등을 컴퓨터 프로그램으로 실현한 기술.',
    example: '사람의 목소리를 알아듣고 대답하는 시리(Siri)나, 바둑 기사를 이긴 알파고.',
    category: 'Core'
  },
  {
    id: 'digital_twin',
    term: '디지털 트윈 (Digital Twin)',
    definition: '현실 세계의 기계나 장비, 사물 등을 컴퓨터 속 가상 세계에 쌍둥이처럼 똑같이 구현한 것.',
    example: '공장을 실제로 짓기 전에 컴퓨터 속에서 미리 돌려보며 문제가 없는지 시뮬레이션 하는 것.',
    category: 'Extended'
  },
  {
    id: 'legaltech',
    term: '리걸테크 (LegalTech)',
    definition: '법률(Legal)과 기술(Technology)의 결합으로, 법률 서비스를 IT 기술을 활용해 새롭게 제공하는 산업 서비스.',
    example: '복잡한 계약서를 AI가 자동으로 분석해주거나, 내 상황에 맞는 판례를 찾아주는 서비스.',
    category: 'Extended'
  },
  {
    id: 'fintech',
    term: '핀테크 (FinTech)',
    definition: '금융(Finance)과 기술(Technology)이 결합된 서비스 또는 그런 서비스를 하는 회사.',
    example: '은행에 가지 않고 스마트폰 앱(토스, 카카오뱅크)으로 송금하고 결제하는 것.',
    category: 'Extended'
  }
];

export const LEVEL_TITLES = [
  'IT 새싹',
  '디지털 탐험가',
  '기술 분석가',
  '미래 설계자',
  '디지털 마에스트로'
];

export const DEEP_DIVE_CONTENT = [
  {
    title: '초연결 (Hyper-connectivity)',
    content: '사람, 사물, 데이터, 프로세스 등 모든 것이 인터넷으로 거미줄처럼 연결된 상태를 말합니다. IoT가 발달하면서 우리는 언제 어디서나 세상과 연결됩니다.'
  },
  {
    title: '초지능 (Super-intelligence)',
    content: '연결된 사물들이 단순히 데이터를 주고받는 것을 넘어, AI를 통해 스스로 학습하고 판단하는 단계입니다. 인간의 지적 능력을 보완하거나 뛰어넘는 수준을 의미합니다.'
  },
  {
    title: '초융합 (Hyper-convergence)',
    content: '현실 세계와 가상 세계의 경계가 무너지고, 서로 다른 산업과 기술이 섞여 새로운 가치를 만드는 현상입니다. 예를 들어 자율주행차는 자동차 산업과 AI 기술의 융합입니다.'
  }
];
