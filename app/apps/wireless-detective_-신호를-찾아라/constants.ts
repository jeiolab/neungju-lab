import { TechType, Scenario, TheoryData, QuizQuestion, DeepDiveContent } from './types';

export const THEORY_DATA: TheoryData[] = [
  {
    tech: TechType.NFC,
    distance: '10cm 이내 (초근거리)',
    speed: '424 kbps (느림)',
    usage: '교통카드, 결제, 태그 읽기',
    keyFeature: '접촉(Tagging) 필요, 보안성 높음',
    icon: 'SmartphoneNfc',
  },
  {
    tech: TechType.BLUETOOTH,
    distance: '10m ~ 100m',
    speed: '1 ~ 24 Mbps (중간)',
    usage: '무선 이어폰, 스마트워치, 키보드',
    keyFeature: '페어링(Pairing) 과정 필요, 1:1 또는 1:N',
    icon: 'Bluetooth',
  },
  {
    tech: TechType.WIFI,
    distance: '50m ~ 200m (공유기 중심)',
    speed: '수 Gbps (매우 빠름)',
    usage: '대용량 파일 전송, 스트리밍, 인터넷',
    keyFeature: 'AP(공유기) 필요, 높은 전력 소모',
    icon: 'Wifi',
  },
  {
    tech: TechType.RFID,
    distance: '수 m ~ 수십 m (주파수별 상이)',
    speed: '매우 느림 (ID 식별 위주)',
    usage: '하이패스, 물류 관리, 도난 방지',
    keyFeature: '태그와 리더기, 단방향 식별 주로 사용',
    icon: 'Radio',
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 's1',
    situation: '등굣길 버스에 탔습니다. 지갑에서 카드를 꺼내지 않고 단말기에 "삑" 댑니다.',
    correctTech: TechType.NFC,
    clue: '10cm 이내 초근거리 통신, 빠른 태깅',
    wrongFeedback: {
      [TechType.BLUETOOTH]: '블루투스는 페어링 시간이 필요해서 버스 승차처럼 1초가 급한 상황엔 부적합해요.',
      [TechType.WIFI]: 'Wi-Fi는 연결 절차가 복잡하고 전력을 많이 써서 교통카드엔 쓰지 않아요.',
      [TechType.RFID]: 'RFID도 가능하지만, 스마트폰/교통카드 결제 방식은 양방향 통신이 가능한 NFC가 정확해요.'
    },
    difficulty: 'Easy',
  },
  {
    id: 's2',
    situation: '카페에서 노트북으로 4K 고화질 영화를 다운로드 받으려고 합니다.',
    correctTech: TechType.WIFI,
    clue: '대용량 데이터 전송, 고속 통신 필요',
    wrongFeedback: {
      [TechType.BLUETOOTH]: '블루투스로 4K 영화를 받으려면 하루 종일 걸릴지도 몰라요!',
      [TechType.NFC]: 'NFC는 속도가 너무 느려서 파일 전송용이 아니에요.'
    },
    difficulty: 'Easy',
  },
  {
    id: 's3',
    situation: '무선 헤드셋을 새로 샀습니다. 스마트폰과 처음 연결하기 위해 서로 신호를 찾고 등록합니다.',
    correctTech: TechType.BLUETOOTH,
    clue: '기기 간 연결(Pairing), 음성 데이터 전송',
    wrongFeedback: {
      [TechType.WIFI]: 'Wi-Fi 오디오도 있지만, 일반적인 무선 헤드셋은 저전력의 블루투스를 써요.',
      [TechType.NFC]: 'NFC로 연결 설정을 도울 순 있지만, 음악을 계속 전송하는 건 블루투스 역할이에요.'
    },
    difficulty: 'Easy',
  },
  {
    id: 's4',
    situation: '고속도로 톨게이트를 멈추지 않고 시속 30km로 통과하며 요금을 냅니다 (하이패스).',
    correctTech: TechType.RFID,
    clue: '수 미터 거리 인식, 태그 식별',
    wrongFeedback: {
      [TechType.NFC]: 'NFC는 거리가 너무 짧아요(10cm). 차를 단말기에 갖다 박을 순 없잖아요?',
      [TechType.BLUETOOTH]: '블루투스는 연결 지연이 발생할 수 있어 고속 이동 중 인식엔 위험할 수 있어요.'
    },
    difficulty: 'Medium',
  },
  {
    id: 's5',
    situation: '아이폰 사용자가 근처의 친구에게 사진 원본 50장을 순식간에 보냅니다 (에어드롭).',
    correctTech: TechType.WIFI,
    clue: '탐색은 저전력으로, 전송은 고속으로 (하이브리드)',
    wrongFeedback: {
      [TechType.BLUETOOTH]: '탐색엔 블루투스를 쓰지만, 실제 사진 전송은 속도가 빠른 Wi-Fi Direct 기술을 써요!',
      [TechType.NFC]: 'NFC는 사진 50장을 보내기엔 너무 느려요.'
    },
    difficulty: 'Hard',
  },
  {
    id: 's6',
    situation: '도서관 책에 붙어있는 얇은 스티커. 사서가 기계를 갖다 대니 책 정보가 뜹니다.',
    correctTech: TechType.RFID,
    clue: '물품 관리, 태그 식별',
    wrongFeedback: {
        [TechType.BLUETOOTH]: '책마다 배터리가 들어간 블루투스 모듈을 넣을 순 없겠죠?',
        [TechType.WIFI]: '책 하나하나가 와이파이 신호를 쏘진 않아요.'
    },
    difficulty: 'Medium'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "NFC는 10m 거리에서도 통신이 가능하다?",
    isO: false,
    explanation: "X: NFC(Near Field Communication)는 이름처럼 10cm 이내의 초근거리에서만 작동합니다."
  },
  {
    id: 2,
    question: "블루투스는 '페어링(Pairing)'이라는 연결 과정이 필요하다?",
    isO: true,
    explanation: "O: 보안과 연결 대상을 명확히 하기 위해 서로 기기를 등록하는 페어링 과정이 필요합니다."
  },
  {
    id: 3,
    question: "Wi-Fi는 데이터를 전송할 때 '공유기(AP)'가 반드시 필요하다?",
    isO: false,
    explanation: "X: 일반적으로는 AP를 쓰지만, 'Wi-Fi Direct' 기술을 쓰면 기기끼리 직접 연결도 가능합니다!"
  },
  {
    id: 4,
    question: "RFID는 반드시 배터리가 있어야 작동한다?",
    isO: false,
    explanation: "X: 수동형(Passive) RFID는 리더기의 전파 에너지를 이용해 작동하므로 태그에 배터리가 없어도 됩니다."
  }
];

export const DEEP_DIVE_CONTENT: DeepDiveContent[] = [
  {
    title: "하이패스의 비밀",
    techs: [TechType.RFID],
    description: "고속도로 톨게이트를 쌩쌩 지나가도 결제가 되는 이유!",
    realWorldExample: "하이패스는 900MHz 대역의 RFID 기술을 사용합니다. 차량 내 단말기(OBU)와 톨게이트 안테나가 통신하는데, 인식 거리가 꽤 길어서(수 미터) 멈추지 않고도 통신이 가능하죠. 수동형이 아닌 배터리를 쓰는 능동형 RFID를 주로 사용해 인식률을 높입니다."
  },
  {
    title: "에어드롭(AirDrop)의 원리",
    techs: [TechType.BLUETOOTH, TechType.WIFI],
    description: "애플 기기끼리 사진을 마법처럼 보내는 기술.",
    realWorldExample: "에어드롭은 두 가지 기술을 섞어 씁니다. 1단계: 저전력인 '블루투스'로 주변 친구를 찾고 연결을 협상합니다. 2단계: 실제 무거운 파일 데이터는 속도가 빠른 'Wi-Fi Direct'로 전송합니다. 그래서 블루투스와 와이파이를 둘 다 켜야 하죠!"
  },
  {
    title: "스마트 키와 이모빌라이저",
    techs: [TechType.RFID, TechType.NFC],
    description: "자동차 키 배터리가 없어도 시동이 걸린다고?",
    realWorldExample: "스마트키 배터리가 방전되어도, 키를 스타트 버튼에 대고 누르면 시동이 걸립니다. 이는 스마트키 안에 내장된 예비용 'RFID/NFC 칩' 덕분입니다. 차체에서 보내는 전파로 순간적인 전력을 얻어 인증 정보를 보내는 원리죠."
  }
];