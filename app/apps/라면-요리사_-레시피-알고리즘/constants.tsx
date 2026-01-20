import { BlockDef, BlockType, QuizQuestion } from './types';
import { Play, Square, Diamond, Flame, Droplets, Utensils, AlertTriangle, CheckCircle } from 'lucide-react';

export const AVAILABLE_BLOCKS: BlockDef[] = [
  { id: 'start', label: '요리 시작', type: BlockType.START_END },
  { id: 'water', label: '냄비에 물 넣기', type: BlockType.PROCESS },
  { id: 'fire', label: '가스불 켜기', type: BlockType.PROCESS },
  { id: 'check_boil', label: '물이 끓나요?', type: BlockType.DECISION },
  { id: 'noodles', label: '면과 스프 넣기', type: BlockType.PROCESS },
  { id: 'wait', label: '3분 기다리기', type: BlockType.PROCESS },
  { id: 'egg', label: '계란 넣기', type: BlockType.PROCESS },
  { id: 'off', label: '불 끄기', type: BlockType.PROCESS },
  { id: 'eat', label: '맛있게 먹기', type: BlockType.START_END },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "순서도(Flowchart)에서 '시작'과 '끝'을 나타내는 기호의 모양은?",
    options: ["직사각형 (Process)", "마름모 (Decision)", "타원 (Terminal)", "평행사변형 (Input/Output)"],
    correctIndex: 2,
    explanation: "순서도의 시작과 끝은 타원형 기호(Terminal)를 사용합니다."
  },
  {
    id: 2,
    question: "라면 물이 끓는지 확인하고, 끓으면 면을 넣고 아니면 기다려야 합니다. 이때 필요한 기호는?",
    options: ["처리 기호 (직사각형)", "판단 기호 (마름모)", "입출력 기호 (평행사변형)", "연결 기호 (원)"],
    correctIndex: 1,
    explanation: "조건에 따라 '예/아니오'로 경로가 나뉘는 경우는 판단 기호(마름모)를 사용합니다."
  },
  {
    id: 3,
    question: "다음 중 알고리즘의 필수 조건이 아닌 것은?",
    options: ["입력 (Input)", "출력 (Output)", "명확성 (Definiteness)", "복잡성 (Complexity)"],
    correctIndex: 3,
    explanation: "알고리즘은 명확하고 유한하며 효과적이어야 하지만, 반드시 복잡할 필요는 없습니다. 오히려 단순하고 효율적인 것이 좋습니다."
  }
];
