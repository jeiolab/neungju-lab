import { GameCard, DataType, CollectionSource, CollectionMethod, QuizQuestion } from './types';

export const GAME_CARDS: GameCard[] = [
  {
    id: 'c1',
    title: '운동부 GPS 이동거리',
    category: '스포츠',
    description: '축구부 훈련 중 스마트 워치로 기록된 선수들의 이동 거리 데이터',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Sensor,
    explanation: 'GPS 좌표와 거리는 숫자로 표현되는 정형 데이터이며, 스마트 워치(센서)를 통해 직접 수집합니다.'
  },
  {
    id: 'c2',
    title: '급식 만족도 댓글',
    category: '학교생활',
    description: '학교 홈페이지 게시판에 학생들이 자유롭게 남긴 급식 후기',
    correctType: DataType.Unstructured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Survey,
    explanation: '댓글은 텍스트 형태의 비정형 데이터이며, 게시판(설문 성격)을 통해 직접 수집합니다.'
  },
  {
    id: 'c3',
    title: '학교 앞 미세먼지 농도',
    category: '환경',
    description: '국가대기오염정보 API에서 가져온 학교 위치의 시간별 미세먼지 수치',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Shared,
    correctMethod: CollectionMethod.SharedData,
    explanation: 'API를 통해 이미 수집된 수치(정형) 데이터를 가져오므로 공유 데이터 활용입니다.'
  },
  {
    id: 'c4',
    title: '동아리실 소음 측정',
    category: '환경',
    description: '점심시간 동아리실의 데시벨(dB)을 소음 측정기로 1분 간격 기록',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Sensor,
    explanation: '소음 수치는 정형 데이터이며, 측정기(센서)를 이용해 직접 수집합니다.'
  },
  {
    id: 'c5',
    title: '체육대회 응원 사진',
    category: '스포츠',
    description: '학생회가 촬영하여 클라우드에 올린 체육대회 응원 현장 사진들',
    correctType: DataType.Unstructured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Observation,
    explanation: '사진은 이미지 형태의 비정형 데이터이며, 촬영(관찰/기록)을 통해 직접 수집합니다.'
  },
  {
    id: 'c6',
    title: '전국 고교생 평균 수면시간',
    category: '학교생활',
    description: '통계청 포털(KOSIS)에서 다운로드 받은 엑셀 파일',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Shared,
    correctMethod: CollectionMethod.SharedData,
    explanation: '통계청에서 제공하는 엑셀 데이터는 정형이며, 공유된 공공데이터입니다.'
  },
  {
    id: 'c7',
    title: '도서관 이용자 설문 (함정)',
    category: '학교생활',
    description: '점심시간 도서관에 있는 학생들만 대상으로 한 "전교생 운동 선호도" 조사',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Survey,
    isTrap: true,
    trapReason: '표본 편향 위험: 도서관에 있는 학생들만으로는 전교생의 운동 선호도를 대표할 수 없습니다.',
    explanation: '데이터 수집 대상이 특정 집단(도서관 이용자)에 치우쳐 있어 대표성이 훼손되었습니다.'
  },
  {
    id: 'c8',
    title: 'SNS 텀블러 사용 인증샷',
    category: '환경',
    description: '인스타그램 해시태그 #오운완 #텀블러사용 챌린지 이미지 검색 결과',
    correctType: DataType.Unstructured,
    correctSource: CollectionSource.Shared,
    correctMethod: CollectionMethod.WebCrawling,
    explanation: 'SNS의 이미지는 비정형 데이터이며, 웹상에 공개된 데이터를 검색/수집(크롤링 등)하는 방식입니다.'
  },
  {
    id: 'c9',
    title: '교문 앞 교통량 카운트',
    category: '환경',
    description: '학생들이 아침 등교 시간 30분 동안 지나가는 차량 수를 바를정(正)자로 기록',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Observation,
    explanation: '차량 대수는 정형 데이터이지만, 센서가 아닌 사람의 눈으로 보고 기록했으므로 관찰입니다.'
  },
  {
    id: 'c10',
    title: '특정 브랜드 신발 착용 조사 (함정)',
    category: '스포츠',
    description: '농구부 학생들에게만 물어본 "가장 편한 운동화 브랜드" 조사 결과를 전교생 추천용으로 사용',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Survey,
    isTrap: true,
    trapReason: '표본 편향 위험: 농구부라는 특정 운동 집단의 선호도를 일반 학생에게 적용하기 어렵습니다.',
    explanation: '특정 목적(농구)을 가진 집단의 데이터를 전체로 일반화하려는 오류입니다.'
  },
  {
    id: 'c11',
    title: '학교 텃밭 식물 성장일지',
    category: '환경',
    description: '매일 아침 텃밭의 식물 키(cm)와 잎의 개수를 기록한 엑셀 파일',
    correctType: DataType.Structured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Observation,
    explanation: '키와 잎의 개수는 정형 데이터이며, 자를 이용해 직접 측정(관찰)하여 기록했습니다.'
  },
  {
    id: 'c12',
    title: '수업 시간 집중도 영상',
    category: '학교생활',
    description: 'AI 모델 학습을 위해 교실 앞쪽 카메라로 촬영된 수업 영상',
    correctType: DataType.Unstructured,
    correctSource: CollectionSource.Direct,
    correctMethod: CollectionMethod.Sensor,
    explanation: '영상은 비정형 데이터이며, 카메라(센서)를 통해 수집됩니다. (윤리적 동의 필요)'
  }
];

export const QUIZ_POOL: QuizQuestion[] = [
  {
    id: 'q1',
    question: '다음 중 "정형 데이터"에 해당하는 것은?',
    options: ['유튜브 브이로그 영상', 'SNS에 올린 점심 사진', '엑셀에 정리된 학생들의 키와 몸무게', '친구들과 나눈 카카오톡 대화 내용'],
    correctIndex: 2,
    explanation: '정형 데이터는 엑셀이나 데이터베이스처럼 행과 열로 구조화되어 수치 계산이 가능한 데이터를 말합니다.',
    relatedConcept: '정형/비정형'
  },
  {
    id: 'q2',
    question: '이미 다른 기관(정부, 기업 등)이 수집하여 공개한 데이터를 활용하는 방법은?',
    options: ['직접 설문조사', '공유 데이터 활용', '센서 측정', '직접 관찰'],
    correctIndex: 1,
    explanation: '공공데이터 포털 등 타 기관이 수집/공개한 데이터를 가져다 쓰는 것을 "공유 데이터" 활용이라고 합니다.',
    relatedConcept: '직접/공유'
  },
  {
    id: 'q3',
    question: '다음 중 "센서"를 이용한 수집 방법이 아닌 것은?',
    options: ['스마트워치 심박수 측정', '미세먼지 측정기 수치 기록', '사람이 직접 세는 교통량 조사', '온습도계 자동 기록'],
    correctIndex: 2,
    explanation: '사람이 눈으로 보고 세는 것은 "관찰"입니다. 센서는 기계적인 감지 장치를 이용합니다.',
    relatedConcept: '수집방법'
  },
  {
    id: 'q4',
    question: '데이터 수집 시 윤리적으로 가장 주의해야 할 점은?',
    options: ['데이터 용량 줄이기', '개인정보 보호 및 수집 동의', '가장 빠른 방법 선택', '무조건 많은 데이터 모으기'],
    correctIndex: 1,
    explanation: '데이터 수집 시에는 정보 주체의 동의를 받고 개인정보가 유출되지 않도록 보호하는 것이 윤리적으로 가장 중요합니다.',
    relatedConcept: '윤리/편향'
  },
  {
    id: 'q5',
    question: '비정형 데이터를 분석하기 위해 주로 사용하는 기술이 아닌 것은?',
    options: ['텍스트 마이닝', '이미지 인식(비전 AI)', '평균/표준편차 엑셀 계산', '자연어 처리'],
    correctIndex: 2,
    explanation: '평균이나 표준편차 계산은 주로 숫자로 된 정형 데이터 분석에 쓰입니다. 비정형 데이터는 AI 기술 등이 필요합니다.',
    relatedConcept: '정형/비정형'
  }
];

export const BADGES = [
  { id: 'b1', name: '초심자', desc: '첫 게임 완료', icon: '🌱' },
  { id: 'b2', name: '번개손', desc: '10콤보 달성', icon: '⚡' },
  { id: 'b3', name: '윤리 레이더', desc: '함정 카드 3회 발견', icon: '🛡️' },
  { id: 'b4', name: '마스터', desc: '총점 1000점 돌파', icon: '👑' },
];