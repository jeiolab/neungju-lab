import { Block, Level, QuizQuestion } from './types';
import { FileText, Monitor, Terminal, Save, FolderOpen, AlertCircle } from 'lucide-react';

// Concepts Data
export const CONCEPTS = [
  {
    title: "표준 입출력 (Standard I/O)",
    icon: Terminal,
    desc: "컴퓨터와 사용자 간의 가장 기본적인 대화 수단입니다.",
    details: [
      { label: "input()", desc: "키보드를 통해 데이터를 입력받습니다." },
      { label: "print()", desc: "모니터(콘솔)에 결과를 출력합니다." }
    ],
    color: "bg-blue-100 text-blue-700"
  },
  {
    title: "파일 입출력 (File I/O)",
    icon: FolderOpen,
    desc: "데이터를 영구적으로 저장하거나 불러올 때 사용합니다.",
    details: [
      { label: "open()", desc: "파일을 엽니다. (통로 개설)" },
      { label: "close()", desc: "파일을 닫습니다. (저장 완료)" }
    ],
    color: "bg-green-100 text-green-700"
  },
  {
    title: "파일 열기 모드 (Modes)",
    icon: FileText,
    desc: "open(파일, '모드')에서 사용하는 3가지 핵심 규칙입니다.",
    details: [
      { label: "'r' (Read)", desc: "읽기 전용. 파일이 없으면 에러!" },
      { label: "'w' (Write)", desc: "쓰기 전용. 내용이 있으면 다 지우고 새로 씁니다." },
      { label: "'a' (Append)", desc: "추가 모드. 기존 내용 끝에 덧붙입니다." }
    ],
    color: "bg-purple-100 text-purple-700"
  }
];

// Puzzle Levels
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "기초: 이름 묻고 답하기",
    description: "사용자에게 이름을 입력받아 변수에 저장하고, 이를 출력해보세요.",
    availableBlocks: [
      { id: 'b1', type: 'input', label: 'input("이름?")' },
      { id: 'b2', type: 'variable', label: 'name =' },
      { id: 'b3', type: 'print', label: 'print(name)' },
    ],
    correctSequence: ['variable', 'input', 'print'] // Checks types roughly
  },
  {
    id: 2,
    title: "파일: 새로 쓰기(Overwrite)",
    description: "memo.txt 파일을 생성하고 'Hello'를 쓴 뒤 저장(닫기)하세요. (덮어쓰기 모드)",
    availableBlocks: [
      { id: 'b1', type: 'open', label: "open('memo.txt', 'w')", param: 'w' },
      { id: 'b2', type: 'write', label: ".write('Hello')" },
      { id: 'b3', type: 'close', label: ".close()" },
      { id: 'b4', type: 'open', label: "open('memo.txt', 'r')", param: 'r' },
    ],
    correctSequence: ['open', 'write', 'close']
  },
  {
    id: 3,
    title: "파일: 내용 추가하기(Append)",
    description: "이미 있는 파일 뒤에 'World'를 추가하고 안전하게 닫으세요.",
    availableBlocks: [
      { id: 'b1', type: 'open', label: "open('memo.txt', 'w')", param: 'w' },
      { id: 'b2', type: 'write', label: ".write('World')" },
      { id: 'b3', type: 'close', label: ".close()" },
      { id: 'b4', type: 'open', label: "open('memo.txt', 'a')", param: 'a' },
    ],
    correctSequence: ['open', 'write', 'close']
  }
];

// Quiz Data
export const QUIZZES: QuizQuestion[] = [
  {
    id: 1,
    question: "다음 중 파일에 있는 기존 내용을 지우고 새로 작성하는 모드는?",
    options: ["r (read)", "w (write)", "a (append)", "x (create)"],
    correctIdx: 1,
    explanation: {
      reason: "w 모드는 파일을 열 때 기존 내용을 초기화합니다.",
      correction: "기존 내용을 유지하려면 a (append) 모드를 써야 합니다.",
      challenge: "만약 w 모드로 열고 아무것도 안 쓰고 닫으면 파일 크기는?"
    }
  },
  {
    id: 2,
    question: "파일 처리가 끝난 후 반드시 호출해야 하는 함수는?",
    options: ["finish()", "save()", "end()", "close()"],
    correctIdx: 3,
    explanation: {
      reason: "파일을 닫지 않으면 데이터가 제대로 저장되지 않거나, 다른 프로그램이 접근 못 할 수 있습니다.",
      correction: "open()을 했다면 반드시 close()로 짝을 맞춰주세요.",
      challenge: "파이썬의 'with open...' 구문은 무엇을 자동으로 해주나요?"
    }
  },
  {
    id: 3,
    question: "존재하지 않는 파일을 'r' 모드로 열려고 하면?",
    options: ["새 파일이 생성된다", "무시된다", "오류(FileNotFoundError) 발생", "빈 문자열 반환"],
    correctIdx: 2,
    explanation: {
      reason: "읽기 모드는 대상 파일이 실존해야만 합니다.",
      correction: "파일이 없을 때 생성하려면 w 또는 a 모드를 사용하세요.",
      challenge: "파일이 있는지 미리 확인하려면 어떤 모듈이 필요할까요?"
    }
  }
];

export const BADGES = [
  { id: 'novice', name: '입문자', condition: (xp: number) => xp >= 10, icon: "🌱" },
  { id: 'mode_master', name: '모드 마스터', condition: (xp: number) => xp >= 50, icon: "🔧" },
  { id: 'close_keeper', name: 'close 지킴이', condition: (xp: number) => xp >= 100, icon: "🔒" },
];
