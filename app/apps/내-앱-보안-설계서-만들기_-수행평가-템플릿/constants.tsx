import React from 'react';
import { BookOpen, Shield, Lock, Key, Hash, FileText, Wifi, Users } from 'lucide-react';
import { QuizQuestion, ThinkQuestion, TheoryCardData } from './types';

export const THEORY_CARDS: TheoryCardData[] = [
  {
    title: "해시 (Hash)",
    icon: <Hash className="w-6 h-6" />,
    summary: "비밀번호는 절대 원문으로 저장하지 않는다!",
    detail: "입력 데이터를 고정된 길이의 문자열로 변환합니다. 단방향 함수라 복구가 불가능합니다.",
    example: "비밀번호 저장, 파일 무결성 검증",
    color: "bg-orange-100 text-orange-700 border-orange-200"
  },
  {
    title: "HTTPS (TLS)",
    icon: <Wifi className="w-6 h-6" />,
    summary: "데이터가 이동하는 파이프를 암호화한다.",
    detail: "클라이언트와 서버 간의 통신 내용을 암호화하여 도청을 방지합니다.",
    example: "로그인, 결제 정보 전송",
    color: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    title: "암호화 (Encryption)",
    icon: <Lock className="w-6 h-6" />,
    summary: "중요한 개인정보는 금고에 넣는다.",
    detail: "키(Key)를 사용하여 데이터를 암호문으로 변환합니다. 해시와 달리 키가 있으면 복구 가능합니다.",
    example: "주민등록번호, 전화번호, 주소 DB 저장",
    color: "bg-green-100 text-green-700 border-green-200"
  },
  {
    title: "디지털 서명",
    icon: <FileText className="w-6 h-6" />,
    summary: "내가 보낸 게 맞다는 도장.",
    detail: "비대칭키 기술을 이용해 데이터의 출처를 인증하고 위조되지 않았음을 증명합니다.",
    example: "공인인증서, 앱 스토어 앱 서명, 블록체인 거래",
    color: "bg-purple-100 text-purple-700 border-purple-200"
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 비밀번호 저장 시 가장 적절한 기술은?",
    options: ["그냥 텍스트로 저장(Plain Text)", "대칭키 암호화(AES)", "해시 함수(SHA-256) + Salt", "압축 저장"],
    answer: 2,
    explanation: "비밀번호는 관리자도 알 수 없어야 하므로 복호화가 불가능한 해시 함수를 사용해야 합니다."
  },
  {
    id: 2,
    question: "HTTPS를 사용하지 않았을 때 발생할 수 있는 주요 위협은?",
    options: ["서버 과부하", "패킷 도청(Sniffing)", "비밀번호 분실", "DB 삭제"],
    answer: 1,
    explanation: "HTTP 통신은 암호화되지 않아 중간자 공격(MITM) 등을 통해 내용을 훔쳐볼 수 있습니다."
  },
  {
    id: 3,
    question: "데이터 최소 수집 원칙에 대한 설명으로 옳은 것은?",
    options: ["나중에 쓸 수 있으니 최대한 많이 모은다.", "서비스 목적에 꼭 필요한 정보만 수집한다.", "암호화하면 다 수집해도 된다.", "사용자 동의 없이 수집한다."],
    answer: 1,
    explanation: "보안의 첫 걸음은 지켜야 할 자산(데이터)의 양을 줄이는 것입니다."
  },
  {
    id: 4,
    question: "해시 함수와 암호화의 가장 큰 차이점은?",
    options: ["속도 차이", "사용하는 키의 개수", "복호화 가능 여부", "데이터 크기"],
    answer: 2,
    explanation: "해시는 단방향(복구 불가), 암호화는 양방향(키로 복구 가능)입니다."
  },
  {
    id: 5,
    question: "다음 중 '부인 방지(Non-repudiation)'를 위한 기술은?",
    options: ["디지털 서명", "데이터 백업", "방화벽", "백신 프로그램"],
    answer: 0,
    explanation: "디지털 서명은 서명자가 해당 행위를 했음을 증명하여 나중에 발뺌하는 것을 방지합니다."
  },
  {
    id: 6,
    question: "암호화 키 관리 원칙으로 틀린 것은?",
    options: ["키는 소스코수에 하드코딩하지 않는다.", "키는 주기적으로 변경한다.", "키는 데이터베이스와 같은 곳에 보관한다.", "접근 권한을 제한한다."],
    answer: 2,
    explanation: "암호화된 데이터와 잠그는 키(Key)를 같은 곳(DB)에 두는 것은 열쇠를 자물쇠 옆에 두는 것과 같습니다."
  },
  {
    id: 7,
    question: "SQL 인젝션 공격을 막기 위한 가장 기본적인 방법은?",
    options: ["비밀번호 자주 바꾸기", "입력값 검증 및 Prepared Statement 사용", "HTTPS 사용", "백신 설치"],
    answer: 1,
    explanation: "사용자 입력값을 신뢰하지 않고 검증하며, 쿼리 구조가 변경되지 않도록 처리해야 합니다."
  },
  {
    id: 8,
    question: "Salt(솔트)의 역할은?",
    options: ["음식의 간을 맞춘다", "해시 결과값을 더 길게 만든다", "같은 비밀번호라도 다른 해시값을 갖게 한다", "암호화 속도를 높인다"],
    answer: 2,
    explanation: "레인보우 테이블 공격 등을 막기 위해 원문에 무작위 데이터를 섞어 해시값을 다르게 만듭니다."
  },
  {
    id: 9,
    question: "로그(Log) 관리 시 주의할 점은?",
    options: ["로그에 비밀번호나 개인정보를 남기지 않는다.", "로그는 무조건 삭제한다.", "누구나 볼 수 있게 공개한다.", "로그는 필요 없다."],
    answer: 0,
    explanation: "로그 파일이 유출되었을 때 2차 피해를 막기 위해 민감정보는 마스킹하거나 저장하지 않아야 합니다."
  },
  {
    id: 10,
    question: "서비스 중단(DDoS) 공격으로부터 가용성을 지키기 위한 방법이 아닌 것은?",
    options: ["CDN 사용", "트래픽 모니터링", "비밀번호 해시화", "오토스케일링(서버 증설)"],
    answer: 2,
    explanation: "비밀번호 해시화는 기밀성(유출 방지)을 위한 기술이며, 가용성(서비스 지속)과는 직접적인 관련이 적습니다."
  }
];

export const THINK_QUESTIONS: ThinkQuestion[] = [
  {
    id: 1,
    type: 'condition',
    title: "조건 바꾸기: 인터넷이 끊긴다면?",
    description: "내 앱이 오프라인 상태에서도 일부 동작해야 한다면, 로컬 데이터(스마트폰 내부)는 어떻게 보호해야 할까? 암호화 키는 어디에 둬야 할까?",
    placeholder: "예: 로컬 DB(SQLite) 암호화를 사용하고, 키는 OS의 키체인(KeyStore)에 보관한다..."
  },
  {
    id: 2,
    type: 'counter',
    title: "반례 찾기: 왜 여기선 해시가 안 될까?",
    description: "사용자의 '주소'나 '전화번호'를 DB에 저장할 때, 비밀번호처럼 해시 함수를 쓰면 안 되는 이유는 무엇일까? 서비스 운영 관점에서 생각해보자.",
    placeholder: "예: 택배를 보내거나 연락을 해야 하는데 해시값은 복구가 안 되니까 원본 주소를 알 수 없어서..."
  },
  {
    id: 3,
    type: 'design',
    title: "적용 설계하기: 학교 급식 앱",
    description: "우리 학교 급식 리뷰 앱을 만든다고 가정하자. '익명성'을 보장하면서도 '악플'을 단 학생을 제재하려면 어떤 식별자가 필요할까? (개인정보 최소 수집 원칙)",
    placeholder: "예: 실명 대신 학번을 단방향 해시해서 저장하고, 신고가 들어오면..."
  }
];
