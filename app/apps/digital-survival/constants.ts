import { Scenario, GameStats } from "./types";

export const INITIAL_STATS: GameStats = {
  data: 100,
  battery: 100,
  security: 80,
  exp: 0
};

export const INITIAL_SCENARIO: Scenario = {
  id: "start_1",
  title: "교실에서의 파일 전송",
  location: "학교 교실",
  description: "바로 옆자리에 앉은 친구가 50MB짜리 밴드 연습 녹음 파일을 보내주겠다고 합니다. 이번 달 데이터가 얼마 남지 않았습니다.",
  choices: [
    {
      id: "bluetooth",
      label: "블루투스 / 퀵쉐어 사용",
      description: "가까운 거리에서 무선으로 연결합니다. (데이터 0 소모)"
    },
    {
      id: "data_email",
      label: "이메일로 받기 (데이터 사용)",
      description: "친구에게 메일로 보내라고 하고 LTE/5G로 다운로드합니다."
    },
    {
      id: "hotspot",
      label: "핫스팟 켜주기",
      description: "내 폰의 핫스팟을 켜서 친구가 클라우드에 올리게 합니다."
    }
  ]
};
