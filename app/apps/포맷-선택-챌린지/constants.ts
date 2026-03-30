import { Mission, Category, CompressionType, ReasonFragment } from './types';

export const LEVELS = [0, 100, 300, 600, 1000, 1500, 2200, 3000];

export const FORMAT_OPTIONS = {
  [Category.IMAGE]: ['JPEG', 'PNG', 'GIF', 'SVG', 'BMP'],
  [Category.AUDIO]: ['MP3', 'FLAC', 'WAV', 'AAC'],
  [Category.VIDEO]: ['MP4 (H.264)', 'AVI', 'MKV', 'WebM']
};

export const REASON_FRAGMENTS: ReasonFragment[] = [
  { key: 'r_transparency', text: '투명한 배경이 필요함' },
  { key: 'r_photo_compress', text: '사람 눈에 안 보이는 색상 정보를 제거해 용량을 줄임' },
  { key: 'r_original_quality', text: '원본 음질을 100% 보존해야 함' },
  { key: 'r_animation', text: '짧은 애니메이션 표현이 필요함' },
  { key: 'r_stream_eff', text: '스트리밍을 위해 전송 속도가 중요함' },
  { key: 'r_vector', text: '확대해도 깨지지 않아야 함 (수학적 계산)' },
  { key: 'r_compatibility', text: '거의 모든 기기에서 호환되어야 함' },
  { key: 'r_edit_layer', text: '편집을 위해 레이어 정보 보존 필요' },
];

export const MISSIONS: Mission[] = [
  // Images
  {
    id: 'm1',
    scenario: '학교 홈페이지 배너에 들어갈 "풍경 사진"을 올리려 합니다. 용량이 너무 크면 로딩이 느려집니다.',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'JPEG',
    correctReasonKey: 'r_photo_compress',
    difficulty: 1
  },
  {
    id: 'm2',
    scenario: '동아리 홍보 포스터에 쓸 "로고" 파일입니다. 배경이 투명해야 다른 배경 위에 얹을 수 있습니다.',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSLESS,
    correctFormat: 'PNG',
    correctReasonKey: 'r_transparency',
    difficulty: 1
  },
  {
    id: 'm3',
    scenario: '웹사이트 아이콘(파비콘)이나 간단한 움직이는 짤방을 만들고 싶습니다.',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSLESS, // GIF is technically lossless LZW but limited palette
    correctFormat: 'GIF',
    correctReasonKey: 'r_animation',
    difficulty: 2
  },
  {
    id: 'm4',
    scenario: '현수막 인쇄를 위해 엄청나게 확대해도 깨지지 않는 로고 원본 파일이 필요합니다.',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSLESS,
    correctFormat: 'SVG',
    correctReasonKey: 'r_vector',
    difficulty: 3
  },
  
  // Audio
  {
    id: 'm5',
    scenario: '친구에게 카카오톡으로 보낼 3분짜리 노래 파일입니다. 데이터 소모를 줄이고 싶습니다.',
    category: Category.AUDIO,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'MP3',
    correctReasonKey: 'r_photo_compress', // Reusing compression logic concept or specific one
    difficulty: 1
  },
  {
    id: 'm6',
    scenario: '음반 제작을 위한 마스터링 작업용 파일입니다. 음질 손실이 전혀 없어야 합니다.',
    category: Category.AUDIO,
    correctCompression: CompressionType.LOSSLESS,
    correctFormat: 'FLAC',
    correctReasonKey: 'r_original_quality',
    difficulty: 2
  },
  {
    id: 'm7',
    scenario: '스트리밍 서비스에서 적은 데이터로 준수한 음질을 제공하려 합니다. (유튜브 등)',
    category: Category.AUDIO,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'AAC',
    correctReasonKey: 'r_stream_eff',
    difficulty: 3
  },

  // Video
  {
    id: 'm8',
    scenario: '유튜브에 업로드할 브이로그 영상입니다. 화질과 용량의 균형이 가장 좋은 표준 포맷이 필요합니다.',
    category: Category.VIDEO,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'MP4 (H.264)',
    correctReasonKey: 'r_compatibility',
    difficulty: 1
  },
  {
    id: 'm9',
    scenario: '웹 브라우저에서 별도 플러그인 없이 바로 재생되는 고화질 오픈소스 비디오 포맷입니다.',
    category: Category.VIDEO,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'WebM',
    correctReasonKey: 'r_stream_eff',
    difficulty: 3
  },
  {
    id: 'm10',
    scenario: '디지털 카메라로 찍은 원본 사진(Raw)을 편집용으로 저장합니다. (손실 없음)',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSLESS,
    correctFormat: 'BMP', // Or RAW, but using BMP for simple lossless mapping
    correctReasonKey: 'r_original_quality',
    difficulty: 2
  },
  // Additional filler missions
  {
    id: 'm11',
    scenario: '고해상도 명화 사진을 아카이빙합니다. 확대 시 디테일이 뭉개지면 안되지만 용량도 고려해야 한다면?',
    category: Category.IMAGE,
    correctCompression: CompressionType.LOSSLESS,
    correctFormat: 'PNG',
    correctReasonKey: 'r_original_quality',
    difficulty: 2
  },
  {
    id: 'm12',
    scenario: '음성 메모 녹음 파일입니다. 내용 확인만 되면 되고 용량이 작아야 합니다.',
    category: Category.AUDIO,
    correctCompression: CompressionType.LOSSY,
    correctFormat: 'MP3',
    correctReasonKey: 'r_photo_compress',
    difficulty: 1
  }
];

export const BADGES = [
  { id: 'b_judge', name: '포맷 감별사', description: '레벨 5 달성', icon: '🏆' },
  { id: 'b_transparency', name: '투명도 수호자', description: 'PNG 관련 문제 3회 정답', icon: '✨' },
  { id: 'b_sound', name: '음향 엔지니어', description: 'FLAC/WAV 문제 모두 정답', icon: '🎧' },
  { id: 'b_stream', name: '스트리밍 최적화러', description: 'MP4/AAC 문제 정답', icon: '⚡' }
];

export const STORAGE_KEYS = {
  HISTORY: 'app5_missionHistory',
  WRONG_NOTES: 'app5_wrongNotes',
  PROGRESS: 'app5_progress',
  REFLECTION: 'app5_reflections'
};
