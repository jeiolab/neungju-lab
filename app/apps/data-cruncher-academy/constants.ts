import { FileItem, QuizQuestion } from './types';

export const INITIAL_FILES: FileItem[] = [
  {
    id: '1',
    name: '역사_과제.txt',
    type: 'text',
    originalSizeKB: 50,
  },
  {
    id: '2',
    name: '제주도_여행.jpg',
    type: 'image',
    originalSizeKB: 5000,
    contentPreview: 'https://picsum.photos/400/300'
  },
  {
    id: '3',
    name: '밴드_공연.mp3',
    type: 'audio',
    originalSizeKB: 12000,
  },
  {
    id: '4',
    name: '소스코드.txt',
    type: 'text',
    originalSizeKB: 120,
  },
  {
    id: '5',
    name: '졸업식.jpg',
    type: 'image',
    originalSizeKB: 8500,
    contentPreview: 'https://picsum.photos/400/301'
  }
];

export const LEVELS = [
  { threshold: 0, title: '초보 정리가' },
  { threshold: 100, title: '압축 연습생' },
  { threshold: 300, title: '데이터 관리자' },
  { threshold: 600, title: '효율의 달인' },
  { threshold: 1000, title: '압축 마스터' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: '병원에서 촬영한 X-Ray 사진을 저장하려고 합니다. 어떤 압축 방식이 적절할까요?',
    options: ['손실 압축', '무손실 압축', '압축하지 않음', '텍스트 변환'],
    correctIndex: 1,
    explanation: '의학용 이미지는 미세한 정보 하나도 놓치면 안 되기 때문에 원본을 100% 복원할 수 있는 무손실 압축을 사용해야 합니다.'
  },
  {
    id: 'q2',
    question: '친구에게 보낼 여행 브이로그 영상 파일이 너무 큽니다. 화질이 조금 떨어져도 괜찮다면?',
    options: ['무손실 압축', '손실 압축', '파일 삭제', '암호화'],
    correctIndex: 1,
    explanation: '영상이나 이미지는 사람의 눈이 인지하지 못하는 데이터를 제거하여 용량을 대폭 줄이는 손실 압축이 효율적입니다.'
  },
  {
    id: 'q3',
    question: '다음 중 "손실 압축"을 하면 절대 안 되는 파일은?',
    options: ['풍경 사진.jpg', '배경 음악.mp3', '영화 파일.mp4', '소설 원고.txt'],
    correctIndex: 3,
    explanation: '텍스트 파일은 글자 하나만 바뀌어도 내용이 완전히 달라지거나 깨질 수 있으므로 반드시 무손실 압축을 해야 합니다.'
  }
];

export const TRANSFER_SPEED_MBPS = 10; // Simulated network speed