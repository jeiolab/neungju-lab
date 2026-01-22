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
  }
];

export const INITIAL_SCORE = 0;
export const SCORE_PER_LEVEL = 100;
export const PENALTY_PER_HINT = 10;