import { FileItem, QuizQuestion } from './types';

// 1GB data storage/transfer ≈ 11g to 300g CO2 depending on source. 
// We will use a gamified value: 1GB = 200g CO2 for clear feedback.
export const CO2_PER_GB_GRAMS = 200; 
// A mature tree absorbs ~22kg (22000g) CO2 per year.
// Let's say saving 1kg CO2 is roughly equivalent to planting 0.05 trees, 
// or simpler: 1 Virtual Tree Level = 500g CO2 saved.
export const CO2_PER_TREE_LEVEL_GRAMS = 500;

export const INITIAL_FILES: FileItem[] = [
  { id: '1', name: '광고: 1+1 특별 행사', type: 'email', sizeMB: 2.5, isSpam: true, date: '2023-10-12' },
  { id: '2', name: '여행_푸켓_2022_원본.zip', type: 'photo', sizeMB: 1500, date: '2022-05-20' },
  { id: '3', name: '학교_발표_영상_최종.mov', type: 'video', sizeMB: 2400, date: '2023-01-15' },
  { id: '4', name: '보고서_v1_최종_진짜최종.docx', type: 'doc', sizeMB: 15, date: '2021-11-30' },
  { id: '5', name: '스팸: 로또 당첨 축하합니다!', type: 'email', sizeMB: 1.2, isSpam: true, date: '2023-12-01' },
  { id: '6', name: '백업_2020년_자료.tar', type: 'doc', sizeMB: 5000, date: '2020-03-10' },
  { id: '7', name: '웃긴_고양이_모음.mp4', type: 'video', sizeMB: 850, date: '2023-08-08' },
  { id: '8', name: '주간_뉴스레터_광고', type: 'email', sizeMB: 0.8, isSpam: true, date: '2023-12-05' },
];

export const STATIC_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "'디지털 탄소 발자국'이란 무엇인가요?",
    options: [
      "컴퓨터를 만들 때만 발생하는 이산화탄소.",
      "디지털 기기와 데이터 센터를 가동하는 전력 생산 과정에서 발생하는 온실가스.",
      "로봇이 모래 위에 남긴 발자국.",
      "디지털 프린터에 사용되는 잉크.",
    ],
    correctIndex: 1,
    explanation: "이메일 전송, 동영상 스트리밍, 파일 저장 등 모든 디지털 활동은 에너지를 소모하며, 이 에너지는 주로 화석 연료를 태워 만들어집니다."
  },
  {
    id: 2,
    question: "스팸 메일을 삭제하는 것이 왜 환경에 도움이 되나요?",
    options: [
      "컴퓨터가 가벼워지기 때문에.",
      "데이터 센터의 저장 공간을 줄여 냉각 및 가동에 필요한 전기를 절약할 수 있기 때문에.",
      "해커의 공격을 막을 수 있어서.",
      "화면의 픽셀을 재활용할 수 있어서."
    ],
    correctIndex: 1,
    explanation: "데이터 센터는 24시간 가동되며 막대한 냉방 전력을 소모합니다. 불필요한 데이터를 지우면 데이터 센터 증설과 전력 낭비를 막을 수 있습니다."
  },
  {
    id: 3,
    question: "데이터 공간을 가장 많이 절약하는 방법은?",
    options: [
      "파일 이름 바꾸기.",
      "파일을 다른 폴더로 이동하기.",
      "큰 폴더를 ZIP 파일로 압축해서 저장하기.",
      "바탕화면 배경 바꾸기."
    ],
    correctIndex: 2,
    explanation: "압축 알고리즘은 파일 내의 중복된 정보를 제거하여 저장 용량을 획기적으로 줄여줍니다."
  }
];
