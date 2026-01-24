import { PuzzleScenario, QuizQuestion, BadgeType } from './types';

export const PUZZLES: PuzzleScenario[] = [
  {
    id: 'puz_win_folder',
    title: '윈도우 학급 사진 폴더 공유',
    category: 'Windows',
    description: '내 PC에 있는 "사진" 폴더를 같은 네트워크의 친구들이 볼 수 있게 공유해봅시다.',
    steps: [
      { id: 'w1', text: '제어판 > 네트워크 및 공유 센터 > 고급 공유 설정' },
      { id: 'w2', text: '네트워크 검색 켜기 및 파일 공유 켜기 선택' },
      { id: 'w3', text: '공유할 폴더 우클릭 > 속성 > 공유 탭 선택' },
      { id: 'w4', text: '고급 공유 > "선택한 폴더 공유" 체크' },
      { id: 'w5', text: '권한 버튼 클릭 > Everyone 계정 추가 또는 확인' },
      { id: 'w6', text: '읽기 권한 부여 후 확인' }
    ],
    feedback: {
      'w1': '먼저 운영체제 레벨에서 공유 기능이 활성화되어 있어야 개별 폴더를 공유할 수 있습니다.',
      'w2': '네트워크 검색이 꺼져 있으면 다른 컴퓨터에서 내 PC를 찾을 수 없습니다.',
      'w3': '시스템 설정 후, 실제 대상(폴더)을 지정해야 합니다.',
      'w5': '폴더를 열어두더라도, "누가" 접근할 수 있는지(권한) 명시해야 합니다. Everyone은 모든 사용자를 뜻합니다.',
      'w6': '사진을 보기만 할 것이라면 "읽기" 권한만 주는 것이 보안상 안전합니다.'
    }
  },
  {
    id: 'puz_printer_ip',
    title: 'IP 주소로 프린터 연결하기',
    category: 'Printer',
    description: '자동 검색이 안 될 때, IP 주소를 이용해 교실 프린터를 내 노트북에 추가합니다.',
    steps: [
      { id: 'p1', text: '프린터 본체 또는 설정 페이지에서 IP 주소 확인 (예: 192.168.0.100)' },
      { id: 'p2', text: 'Windows 설정 > 장치 > 프린터 및 스캐너 이동' },
      { id: 'p3', text: '"프린터 또는 스캐너 추가" 클릭 후 "원하는 프린터가 목록에 없습니다" 선택' },
      { id: 'p4', text: '"TCP/IP 주소 또는 호스트 이름으로 프린터 추가" 선택' },
      { id: 'p5', text: '입력창에 확인한 프린터 IP 주소 입력' },
      { id: 'p6', text: '프린터 드라이버 설치 및 테스트 인쇄' }
    ],
    feedback: {
      'p1': '목적지(IP)를 모르면 연결을 시작할 수 없습니다. 가장 먼저 확인해야 합니다.',
      'p3': '자동 검색 목록에 뜨지 않을 때 수동 추가 옵션을 선택해야 합니다.',
      'p4': '네트워크 프린터는 고유한 IP 주소를 통해 통신하므로 이 옵션이 가장 정확합니다.',
      'p6': '하드웨어가 인식되어도 컴퓨터가 명령어를 번역하려면 드라이버가 필요합니다.'
    }
  },
  {
    id: 'puz_cloud_link',
    title: '클라우드 링크로 대용량 영상 공유',
    category: 'Cloud',
    description: '이메일로 보내기엔 너무 큰 축제 영상을 클라우드 링크로 친구들에게 전달합니다.',
    steps: [
      { id: 'c1', text: '클라우드 서비스(구글 드라이브 등) 로그인 및 접속' },
      { id: 'c2', text: '공유할 "축제 영상" 폴더 생성' },
      { id: 'c3', text: '영상 파일 업로드 및 완료 대기' },
      { id: 'c4', text: '폴더 우클릭 > "공유" 또는 "링크 생성" 선택' },
      { id: 'c5', text: '액세스 권한 설정 ("링크가 있는 모든 사용자" 및 "뷰어")' },
      { id: 'c6', text: '링크 복사 후 단톡방에 붙여넣기' }
    ],
    feedback: {
      'c1': '서비스에 접속하는 것이 첫 번째입니다.',
      'c3': '빈 폴더를 공유하기 전에 내용물을 채워넣는 것이 흐름상 자연스럽습니다. 업로드가 완료되어야 공유가 의미 있습니다.',
      'c5': '가장 중요한 단계입니다! 권한을 "제한됨"으로 두면 링크를 보내도 친구들이 볼 수 없습니다.',
      'c6': '모든 설정이 끝난 후, 최종적으로 "열쇠(링크)"를 전달합니다.'
    }
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: '네트워크 공유 시 "권한(Permission)" 설정이 중요한 이유는?',
    options: ['인터넷 속도를 높이기 위해', '원하지 않는 사용자가 파일을 삭제하거나 변경하는 것을 막기 위해', '파일 용량을 줄이기 위해', '프린터 잉크를 아끼기 위해'],
    correctIndex: 1,
    explanation: '권한 설정은 보안의 핵심입니다. 읽기 전용으로 설정하면 타인이 파일을 실수로 지우는 것을 방지할 수 있습니다.'
  },
  {
    id: 2,
    question: '운영체제(OS)가 서로 다른(예: 윈도우와 맥) 친구들끼리 파일을 공유할 때 가장 간편한 방법은?',
    options: ['USB 드라이버 설치', '랜선 직접 연결', '클라우드 스토리지(웹 기반) 링크 공유', '프린터 공유'],
    correctIndex: 2,
    explanation: '클라우드는 웹 브라우저만 있으면 OS에 상관없이 접근 가능하여 호환성 문제가 가장 적습니다.'
  },
  {
    id: 3,
    question: '프린터를 공유하려는데 "오프라인" 상태로 뜹니다. 가장 먼저 확인할 것은?',
    options: ['모니터 해상도 조절', '프린터 전원 및 네트워크 케이블 연결 상태', '새 프린터 구매', '파일 이름 변경'],
    correctIndex: 1,
    explanation: '물리적 연결(전원, 케이블)이 끊어져 있으면 통신이 불가능합니다. 가장 기초적인 점검 사항입니다.'
  },
  {
    id: 4,
    question: '클라우드 공유 링크를 보냈는데 친구가 "접근 권한이 필요합니다"라고 합니다. 해결책은?',
    options: ['링크를 다시 복사해서 보낸다', '공유 설정에서 "링크가 있는 모든 사용자"로 변경한다', '컴퓨터를 재부팅한다', '새 폴더를 만든다'],
    correctIndex: 1,
    explanation: '기본 설정이 "제한됨"인 경우, 링크가 있어도 승인된 사람만 볼 수 있습니다. 공개 범위를 넓혀야 합니다.'
  },
  {
    id: 5,
    question: '공용 PC에서 클라우드 공유를 마친 후 반드시 해야 할 행동은?',
    options: ['바탕화면 배경 바꾸기', '로그아웃', '마우스 연결 해제', '모니터 끄기'],
    correctIndex: 1,
    explanation: '로그아웃을 하지 않으면 다음 사용자가 내 클라우드 자료를 마음대로 삭제하거나 유출할 수 있습니다.'
  }
];

export const STORAGE_KEY = 'share_pipeline_v1';
export const BADGES = [
  { id: BadgeType.BEGINNER, name: BadgeType.BEGINNER, desc: '첫 퍼즐 완료', icon: '🌱' },
  { id: BadgeType.ARCHITECT, name: BadgeType.ARCHITECT, desc: '모든 시나리오 완료', icon: '🏗️' },
  { id: BadgeType.MASTER, name: BadgeType.MASTER, desc: '퀴즈 만점 달성', icon: '👑' },
  { id: BadgeType.STREAK, name: BadgeType.STREAK, desc: '3일 연속 학습', icon: '🔥' }
];