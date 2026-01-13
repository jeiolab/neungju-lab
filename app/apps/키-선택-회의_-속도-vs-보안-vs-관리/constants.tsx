import { CryptoMethod, Scenario, QuizQuestion, ConceptCard } from './types';
import { Lock, Key, Hash, Layers, Cpu } from 'lucide-react';

export const CONCEPTS: ConceptCard[] = [
  {
    method: CryptoMethod.SYMMETRIC,
    summary: "하나의 키로 잠그고 연다. 빠르지만 키 배달이 문제.",
    pros: "연산 속도가 매우 빠름, 대용량 처리에 적합",
    cons: "키를 안전하게 전달하기 어려움(키 배송 문제), 사용자 수만큼 키가 필요",
    icon: 'lock'
  },
  {
    method: CryptoMethod.ASYMMETRIC,
    summary: "공개키로 잠그고 개인키로 연다. 관리는 편하지만 느리다.",
    pros: "키 배송 문제 해결, 인증/서명 가능(부인 방지)",
    cons: "대칭키보다 연산 속도가 훨씬 느림",
    icon: 'key'
  },
  {
    method: CryptoMethod.HASH,
    summary: "지문처럼 고유값을 만든다. 되돌릴 수 없다.",
    pros: "무결성 검증(변조 확인)에 탁월, 단방향성",
    cons: "암호화가 아님(복호화 불가능)",
    icon: 'hash'
  },
  {
    method: CryptoMethod.HYBRID,
    summary: "비대칭키로 대칭키를 전달하고, 대칭키로 통신한다.",
    pros: "속도와 키 관리의 장점을 모두 취함 (HTTPS의 원리)",
    cons: "구현 복잡도가 높음",
    icon: 'layers'
  },
  {
    method: CryptoMethod.HOMOMORPHIC,
    summary: "암호화된 상태에서 계산한다.",
    pros: "데이터를 복호화하지 않고 분석 가능(개인정보 보호)",
    cons: "연산 속도가 매우 느리고 데이터 크기가 커짐",
    icon: 'cpu'
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    title: '수행평가 영상 파일 공유',
    description: '반 친구들에게 1GB가 넘는 수행평가 영상을 비밀리에 공유해야 합니다.',
    context: '용량이 큼. 속도가 중요함. 비밀번호(키)만 잘 전달된다면...',
    recommendedMethods: [CryptoMethod.SYMMETRIC, CryptoMethod.HYBRID],
    requiredAttributes: { speed: 9, security: 5, management: 4 }
  },
  {
    id: 's2',
    title: '동아리 회비 장부 무결성',
    description: '공개된 회비 장부 엑셀 파일이 수정되지 않았는지 누구나 확인만 하면 됩니다.',
    context: '내용을 숨길 필요는 없음. 단, 누군가 몰래 숫자를 바꿨는지가 중요.',
    recommendedMethods: [CryptoMethod.HASH],
    requiredAttributes: { speed: 10, security: 8, management: 10 }
  },
  {
    id: 's3',
    title: '학교 축제 QR 입장권',
    description: '학생회에서 발급한 QR코드가 위조되지 않았음을 입구에서 확인해야 합니다.',
    context: '학생회가 발급했다는 "인증"이 핵심. 누구나 검증할 수 있어야 함.',
    recommendedMethods: [CryptoMethod.ASYMMETRIC, CryptoMethod.HYBRID],
    requiredAttributes: { speed: 5, security: 9, management: 8 }
  },
  {
    id: 's4',
    title: '익명 설문조사 통계',
    description: '학생들의 민감한 고민을 수집하여 통계만 내고 싶습니다. 내용은 운영자도 보면 안 됩니다.',
    context: '암호화된 상태로 "통계 연산"만 수행하고 싶음.',
    recommendedMethods: [CryptoMethod.HOMOMORPHIC],
    requiredAttributes: { speed: 1, security: 10, management: 5 }
  }
];

export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "대칭키 암호화의 가장 큰 단점은 무엇인가요?",
    options: ["암호화 속도가 느리다", "키를 안전하게 전달하기 어렵다", "복호화가 불가능하다", "데이터 크기가 커진다"],
    correctIndex: 1,
    explanation: "대칭키는 암호화/복호화 키가 같아서, 상대방에게 키를 줄 때 탈취될 위험이 있습니다(키 배송 문제)."
  },
  {
    id: 2,
    question: "HTTPS(웹 보안)에서 주로 사용하는 방식은?",
    options: ["대칭키만 사용", "비대칭키만 사용", "해시만 사용", "혼합(하이브리드) 방식"],
    correctIndex: 3,
    explanation: "처음에 비대칭키로 대칭키를 교환하고, 이후 데이터 전송은 빠른 대칭키를 사용하는 혼합 방식을 씁니다."
  },
  {
    id: 3,
    question: "다음 중 '복호화'가 불가능한 것은?",
    options: ["AES (대칭키)", "RSA (비대칭키)", "SHA-256 (해시)", "동형암호"],
    correctIndex: 2,
    explanation: "해시 함수는 단방향 암호화로, 원본 데이터로 되돌리는 복호화가 불가능하도록 설계되었습니다."
  },
  {
    id: 4,
    question: "동형 암호(Homomorphic Encryption)의 핵심 특징은?",
    options: ["가장 빠른 속도", "키가 필요 없음", "암호화된 상태에서 연산 가능", "해킹이 절대 불가능"],
    correctIndex: 2,
    explanation: "동형 암호는 데이터를 풀지 않고도 더하기, 곱하기 등의 연산을 수행할 수 있어 프라이버시 보호에 강력합니다."
  },
  {
    id: 5,
    question: "부인 방지(Non-repudiation) 기능을 제공하는 것은?",
    options: ["대칭키 암호", "공개키(비대칭키) 암호", "해시 함수", "단순 부호화"],
    correctIndex: 1,
    explanation: "개인키로 서명하면, 공개키로 누구나 검증할 수 있어 '내가 안 했다'고 발뺌할 수 없습니다."
  },
  {
    id: 6,
    question: "대용량 4K 영화 파일을 친구에게 보낼 때 가장 비효율적인 방식은?",
    options: ["비대칭키로 전체 암호화", "대칭키로 전체 암호화", "하이브리드 방식", "압축 후 대칭키 암호화"],
    correctIndex: 0,
    explanation: "비대칭키는 수학적 연산이 복잡하여 대용량 데이터를 처리하기엔 속도가 너무 느립니다."
  },
  {
    id: 7,
    question: "해시 함수가 변경되었는지 확인하여 보장하는 보안 요소는?",
    options: ["기밀성(Confidentiality)", "가용성(Availability)", "무결성(Integrity)", "익명성(Anonymity)"],
    correctIndex: 2,
    explanation: "해시값이 1비트라도 다르면 원본이 변조된 것이므로, 무결성을 검증합니다."
  },
  {
    id: 8,
    question: "공개키 암호화 방식에서 데이터를 '모두에게 받되 나만 보고 싶을 때' 사용하는 키는?",
    options: ["나의 개인키로 암호화", "나의 공개키로 암호화", "상대의 공개키로 암호화", "상대의 개인키로 암호화"],
    correctIndex: 1,
    explanation: "사람들은 나의 '공개키'로 잠가서 보내고, 나는 나만 가진 '개인키'로 엽니다."
  },
  {
    id: 9,
    question: "키 개수 관리 문제: 100명이 서로 대칭키로 통신하려면 키가 몇 개 필요한가?",
    options: ["100개", "200개", "4950개", "10000개"],
    correctIndex: 2,
    explanation: "n(n-1)/2 공식에 따라 100*99/2 = 4950개가 필요합니다. 관리가 매우 어렵습니다."
  },
  {
    id: 10,
    question: "다음 중 현실 세계의 하이브리드 암호화 예시가 아닌 것은?",
    options: ["SSL/HTTPS", "PGP 이메일", "SSH", "ZIP 비밀번호 설정"],
    correctIndex: 3,
    explanation: "일반적인 ZIP 비밀번호는 단순히 대칭키 알고리즘을 사용합니다 (하이브리드 아님)."
  }
];