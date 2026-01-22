import { QuizQuestion, SimulationData } from './types';

export const THEORY_CARDS = [
  {
    title: "데이터와 탄소발자국",
    content: "우리가 데이터를 저장하고 전송할 때마다 데이터센터는 전기를 사용합니다. 1GB의 데이터를 전송하는 데 발생하는 탄소는 약 3kg에 달할 수 있습니다. 불필요한 고화질이나 중복 저장을 줄이는 '디지털 다이어트'가 필요합니다.",
    icon: "Leaf"
  },
  {
    title: "손실 압축 vs 무손실 압축",
    content: "무손실(ZIP, PNG)은 원본을 완벽히 복원할 수 있지만 압축률이 낮습니다. 손실(JPEG, MP3)은 인간이 인지하기 힘든 정보를 삭제하여 용량을 획기적으로 줄이지만, 원본 복원이 불가능합니다.",
    icon: "Minimize2"
  },
  {
    title: "압축률과 품질의 균형",
    content: "무조건 용량을 줄이는 것이 능사는 아닙니다. 의료 영상이나 보존용 문서는 품질 유지가 중요합니다. 목적에 맞는 '적정 기술'을 선택하는 윤리적 판단이 필요합니다.",
    icon: "Scale"
  }
];

export const DAILY_MISSIONS = [
  "오늘은 스마트폰 갤러리에서 중복된 사진 10장 지우기!",
  "친구에게 영상 보낼 때 '원본' 대신 '고화질(압축)' 옵션 사용해보기",
  "사용하지 않는 앱 1개 삭제하여 저장공간 확보하기",
  "이메일 휴지통 비우기로 서버 용량 절약하기",
  "오늘 하루 스트리밍 화질 1080p 대신 720p로 시청하기"
];

export const CHECKLIST_ITEMS = [
  "동일한 파일을 여러 클라우드에 중복 저장하지 않는다.",
  "SNS 공유 시 불필요하게 4K/원본 화질을 고집하지 않는다.",
  "문서 작성 시 이미지 크기를 미리 줄여서 첨부한다.",
  "보지 않는 OTT 영상의 자동 재생을 끈다.",
  "주기적으로 이메일함과 휴지통을 비운다."
];

export const SIMULATION_SCENARIOS: SimulationData[] = [
  { fileType: "사진 (RAW)", originalSize: 100, compressedSize: 90, method: "무손실 (PNG)", description: "화질 저하 없음. 용량 감소 미비.", qualityImpact: "완벽 보존" },
  { fileType: "사진 (RAW)", originalSize: 100, compressedSize: 20, method: "손실 (JPEG 80%)", description: "눈으로 구분 힘듦. 용량 대폭 감소.", qualityImpact: "미세한 저하" },
  { fileType: "영상 (4K)", originalSize: 100, compressedSize: 60, method: "코덱 변경 (H.264)", description: "효율적 압축. 전송 속도 향상.", qualityImpact: "양호" },
  { fileType: "영상 (4K)", originalSize: 100, compressedSize: 10, method: "해상도 변경 (FHD)", description: "픽셀 수 1/4 감소. 모바일 적합.", qualityImpact: "화질 저하 뚜렷" },
  { fileType: "문서 (TXT)", originalSize: 100, compressedSize: 30, method: "무손실 (ZIP)", description: "반복 패턴 제거. 텍스트에 효과적.", qualityImpact: "완벽 보존" },
];

export const QUIZ_DATA: QuizQuestion[] = [
  { id: 1, difficulty: 'EASY', question: "데이터 압축의 주된 목적이 아닌 것은?", options: ["저장 공간 절약", "전송 속도 향상", "데이터 생성 날짜 변경", "네트워크 대역폭 절약"], correctIndex: 2, explanation: "압축은 용량을 줄여 저장/전송 효율을 높이는 기술입니다. 날짜 변경과는 무관합니다." },
  { id: 2, difficulty: 'EASY', question: "다음 중 '손실 압축' 방식인 파일 포맷은?", options: ["ZIP", "PNG", "JPEG", "FLAC"], correctIndex: 2, explanation: "JPEG는 사람이 인지하기 어려운 색상 정보를 제거하여 용량을 줄이는 손실 압축 방식입니다." },
  { id: 3, difficulty: 'EASY', question: "디지털 탄소 발자국을 줄이는 습관으로 옳은 것은?", options: ["모든 사진 원본 저장", "불필요한 이메일 삭제", "항상 최고 화질 스트리밍", "화면 밝기 최대 유지"], correctIndex: 1, explanation: "데이터센터의 서버 용량을 차지하는 불필요한 데이터를 삭제하면 전력 소모를 줄일 수 있습니다." },
  { id: 4, difficulty: 'MEDIUM', question: "의료용 X-ray 사진을 전송해야 합니다. 가장 적절한 압축 전략은?", options: ["최대 손실 압축", "무손실 압축", "해상도 낮추기", "흑백을 컬러로 변환"], correctIndex: 1, explanation: "의료 데이터는 미세한 정보도 중요하므로 원본을 완벽히 복구할 수 있는 무손실 압축을 사용해야 합니다." },
  { id: 5, difficulty: 'MEDIUM', question: "스트리밍 서비스에서 데이터 사용량을 줄이면서도 만족도를 유지하는 '적정 기술'의 예는?", options: ["무조건 240p로 시청", "모바일 환경에 맞춰 720p로 시청", "오디오만 듣기", "다운로드 후 시청"], correctIndex: 1, explanation: "작은 모바일 화면에서는 4K와 720p의 차이를 느끼기 어렵습니다. 상황에 맞는 화질 선택이 중요합니다." },
  { id: 6, difficulty: 'MEDIUM', question: "압축률(Compression Rate)이 높다는 것의 의미는?", options: ["용량이 조금만 줄어듦", "용량이 많이 줄어듦", "파일이 커짐", "전송 속도가 느려짐"], correctIndex: 1, explanation: "압축률이 높다는 것은 원래 크기 대비 결과물의 크기가 작아졌다는(많이 줄어들었다는) 뜻입니다." },
  { id: 7, difficulty: 'HARD', question: "다음 중 데이터 '중복 제거(Deduplication)' 기술이 가장 효과적인 상황은?", options: ["서로 다른 사진 100장", "같은 문서를 10명이 공유할 때", "랜덤한 숫자 파일", "암호화된 파일"], correctIndex: 1, explanation: "중복 제거 기술은 동일한 데이터 패턴이 반복될 때 하나만 저장하고 나머지는 참조하는 방식으로 효율을 극대화합니다." },
  { id: 8, difficulty: 'HARD', question: "손실 압축을 과도하게 적용했을 때 발생하는 '블록 현상'이나 '노이즈'를 무엇이라 하는가?", options: ["아티팩트(Artifact)", "픽셀레이션", "버퍼링", "레이턴시"], correctIndex: 0, explanation: "압축 과정에서 정보가 손실되어 나타나는 시각적/청각적 결함을 아티팩트라고 합니다." },
  { id: 9, difficulty: 'HARD', question: "데이터 센터의 'PUE(Power Usage Effectiveness)' 지수가 1.0에 가까울수록 의미하는 바는?", options: ["에너지 효율이 매우 좋다", "에너지 효율이 매우 나쁘다", "데이터가 100% 압축됨", "서버가 꺼져있음"], correctIndex: 0, explanation: "PUE는 (총 전력)/(IT 장비 전력)으로, 1.0에 가까울수록 냉각 등 부가적인 전력 낭비가 적다는 뜻입니다." },
  { id: 10, difficulty: 'HARD', question: "윤리적 관점에서, 정보 격차(Digital Divide)를 줄이기 위해 압축 기술이 기여할 수 있는 점은?", options: ["고사양 기기만 지원", "저속 네트워크에서도 접근 가능하게 함", "유료화 모델 강화", "데이터 보안 해제"], correctIndex: 1, explanation: "효율적인 압축은 인터넷 속도가 느린 개발도상국이나 소외 계층도 정보에 접근할 수 있게 돕습니다." },
];

export const BADGE_LIST = [
  { id: 'diet_master', name: '데이터 다이어터', description: '체크리스트 80% 이상 달성', icon: 'Award' },
  { id: 'project_builder', name: '프로젝트 완성러', description: '나만의 실천 프로젝트 1개 생성', icon: 'PenTool' },
  { id: 'ethical_thinker', name: '윤리적 설계자', description: '퀴즈 마스터리 100% 달성', icon: 'Brain' },
];