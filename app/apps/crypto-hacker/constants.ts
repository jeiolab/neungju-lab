import { LevelData, ToolType } from './types';

export const TOTAL_TIME = 600; // 10 minutes

export const LEVELS: LevelData[] = [
  {
    id: 1,
    title: "시프트 암호 (치환)",
    description: "통신이 감청되었습니다. 단순한 문자 이동(Shift)이 감지됩니다. 문을 여세요.",
    storyContext: "해커의 은신처에 도착했습니다. 문이 이상한 회전 다이얼로 잠겨 있습니다.",
    cipherText: "D O O",
    hint: "키는 -3입니다 (알파벳을 3칸 뒤로 돌리세요)",
    solution: "ALL",
    toolAllowed: ToolType.CAESAR_WHEEL
  },
  {
    id: 2,
    title: "뒤섞인 매트릭스 (전치)",
    description: "데이터가 그리드에 조각나 있습니다. 메시지를 재조합하세요.",
    storyContext: "시스템에 접속했습니다! 하지만 서버실 접근을 위해 음성 명령이 필요합니다. 코드는 이 그리드에 숨겨져 있습니다.",
    cipherText: "T R E H S I P A S",
    hint: "세로(열) 방향으로 읽으세요. 3x3 그리드입니다.",
    solution: "THISSPARE", // THIS SPARE (Removing spaces for checking)
    toolAllowed: ToolType.SCYTALE_GRID
  },
  {
    id: 3,
    title: "데이터베이스 침해 (해시)",
    description: "관리자 비밀번호가 해시되어 있습니다. 원문을 찾아내어 시스템을 보호하세요.",
    storyContext: "관리자 콘솔을 찾았습니다. 비밀번호 필드는 비어있지만, 해시값이 적힌 포스트잇을 발견했습니다.",
    cipherText: "5f4dcc3b5aa765d61d8327deb882cf99", // 'password' in MD5
    hint: "매우 흔한 비밀번호입니다. 레인보우 테이블 도구를 사용하여 해시값과 일치하는 비밀번호를 찾으세요.",
    solution: "PASSWORD",
    toolAllowed: ToolType.HASH_ANALYZER
  },
  {
    id: 4,
    title: "시프트 암호 2",
    description: "또 다른 암호화된 메시지가 발견되었습니다. 카이사르 암호를 해독하세요.",
    storyContext: "두 번째 문을 발견했습니다. 이번에는 다른 키로 잠겨 있습니다.",
    cipherText: "K H O O R",
    hint: "키는 +3입니다 (알파벳을 3칸 앞으로 돌리세요)",
    solution: "HELLO",
    toolAllowed: ToolType.CAESAR_WHEEL
  },
  {
    id: 5,
    title: "시프트 암호 3",
    description: "세 번째 암호화된 메시지를 해독하세요.",
    storyContext: "서버실 문에 또 다른 암호가 있습니다.",
    cipherText: "Y M J R J",
    hint: "키는 -5입니다",
    solution: "THINK",
    toolAllowed: ToolType.CAESAR_WHEEL
  },
  {
    id: 6,
    title: "매트릭스 전치 2",
    description: "다른 그리드에 암호가 숨겨져 있습니다.",
    storyContext: "새로운 시스템에 접속했습니다. 다른 그리드 구조의 암호를 발견했습니다.",
    cipherText: "H E L L O",
    hint: "2열로 세로로 읽으세요",
    solution: "HLOEL",
    toolAllowed: ToolType.SCYTALE_GRID
  },
  {
    id: 7,
    title: "매트릭스 전치 3",
    description: "복잡한 그리드 암호를 해독하세요.",
    storyContext: "고급 보안 시스템의 암호를 발견했습니다.",
    cipherText: "W O R L D",
    hint: "2열로 세로로 읽으세요",
    solution: "WRLOD",
    toolAllowed: ToolType.SCYTALE_GRID
  },
  {
    id: 8,
    title: "해시 암호 2",
    description: "다른 해시값을 찾아내세요.",
    storyContext: "또 다른 관리자 계정의 해시값을 발견했습니다.",
    cipherText: "e10adc3949ba59abbe56e057f20f883e", // '123456' in MD5
    hint: "가장 흔한 6자리 숫자 비밀번호입니다.",
    solution: "123456",
    toolAllowed: ToolType.HASH_ANALYZER
  },
  {
    id: 9,
    title: "해시 암호 3",
    description: "세 번째 해시 암호를 해독하세요.",
    storyContext: "최종 관리자 계정의 해시값입니다.",
    cipherText: "21232f297a57a5a743894a0e4a801fc3", // 'admin' in MD5
    hint: "시스템 관리자를 의미하는 영어 단어입니다.",
    solution: "ADMIN",
    toolAllowed: ToolType.HASH_ANALYZER
  }
];

export const INITIAL_SCORE = 0;
export const SCORE_PER_LEVEL = 100;
export const PENALTY_PER_HINT = 10;