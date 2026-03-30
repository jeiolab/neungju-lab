import { QuizQuestion } from './types';

export const CONCEPTS = [
  {
    title: "통신 (Communication)",
    content: "마이크로비트는 라디오 전파를 이용해 데이터를 주고받을 수 있습니다. 마치 무전기처럼 서로 보이지 않는 선으로 연결되는 것이죠.",
    icon: "📡"
  },
  {
    title: "라디오 그룹 (Radio Group)",
    content: "0부터 255까지의 채널 번호입니다. 송신하는 쪽과 수신하는 쪽의 그룹 번호가 정확히 일치해야만 서로 대화할 수 있습니다.",
    icon: "🔢"
  },
  {
    title: "송신과 수신 (Send & Receive)",
    content: "송신(Sender)은 데이터를 보내는 역할, 수신(Receiver)은 데이터를 받아 처리하는 역할입니다. IoT 시스템에서는 보통 센서가 송신, 모니터가 수신 역할을 합니다.",
    icon: "🔄"
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "송신 마이크로비트의 라디오 그룹이 1, 수신 마이크로비트의 라디오 그룹이 2입니다. 통신이 될까요?",
    options: ["된다", "안 된다", "가끔 된다", "가까이 있으면 된다"],
    correctAnswer: 1,
    explanation: "라디오 그룹 번호가 다르면 서로 데이터를 주고받을 수 없습니다."
  },
  {
    id: 2,
    question: "경보 시스템을 만들 때, '임계값'이란 무엇인가요?",
    options: ["현재 온도", "라디오 그룹 번호", "경보를 울릴 기준이 되는 값", "배터리 잔량"],
    correctAnswer: 2,
    explanation: "임계값(Threshold)은 특정 동작(경보 등)을 실행할지 결정하는 기준점입니다."
  },
  {
    id: 3,
    question: "다음 중 라디오 그룹 설정 범위로 올바른 것은?",
    options: ["1 ~ 10", "0 ~ 255", "100 ~ 1000", "제한 없음"],
    correctAnswer: 1,
    explanation: "마이크로비트의 라디오 그룹은 0부터 255까지 설정 가능합니다."
  },
  {
    id: 4,
    question: "온도가 30도이고 임계값이 28도입니다. 경보 조건(온도 >= 임계값)을 만족하나요?",
    options: ["만족한다 (경보)", "만족하지 않는다 (안전)", "알 수 없다", "오류 발생"],
    correctAnswer: 0,
    explanation: "30은 28보다 크거나 같으므로 조건을 만족합니다."
  },
  {
    id: 5,
    question: "마이크로비트 통신에서 가장 흔한 실수인 '그룹 불일치'를 해결하는 방법은?",
    options: ["마이크로비트를 흔든다", "코드를 지운다", "두 기기의 radio set group 번호를 똑같이 맞춘다", "건전지를 교체한다"],
    correctAnswer: 2,
    explanation: "송신측과 수신측 코드의 그룹 번호를 동일하게 설정해야 합니다."
  }
];

export const FLOW_STEPS = [
  {
    step: 1,
    title: "초기 설정",
    desc: "두 마이크로비트 모두 전원을 켜고, '라디오 그룹'을 동일하게 설정합니다 (예: Group 1).",
    image: "setup"
  },
  {
    step: 2,
    title: "데이터 수집 (송신)",
    desc: "송신 마이크로비트가 내장 온도 센서로 현재 온도를 측정합니다.",
    image: "measure"
  },
  {
    step: 3,
    title: "데이터 전송",
    desc: "라디오 신호를 통해 측정된 온도 값을 공중으로 날려보냅니다.",
    image: "send"
  },
  {
    step: 4,
    title: "데이터 수신 및 판단",
    desc: "수신 마이크로비트가 신호를 잡습니다. 그룹이 맞다면 숫자를 읽습니다.",
    image: "receive"
  },
  {
    step: 5,
    title: "액추에이터 동작",
    desc: "수신된 온도가 임계값보다 높다면 LED에 경고 아이콘을 띄웁니다.",
    image: "act"
  }
];