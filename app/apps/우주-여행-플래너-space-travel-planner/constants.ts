import { Planet, QuizQuestion } from './types';

export const PLANETS: Planet[] = [
  {
    id: 'mercury',
    name: '수성',
    nameEn: 'Mercury',
    distanceFromEarthKm: 91691000,
    diameterKm: 4879,
    color: 'bg-gray-400',
    description: '태양에 가장 가까운 행성으로, 기온 차가 매우 큽니다.',
    revolutionPeriod: '88일',
  },
  {
    id: 'venus',
    name: '금성',
    nameEn: 'Venus',
    distanceFromEarthKm: 41400000,
    diameterKm: 12104,
    color: 'bg-yellow-600',
    description: '지구와 가장 비슷한 크기이지만, 두꺼운 이산화탄소 대기로 덮여 있습니다.',
    revolutionPeriod: '225일',
  },
  {
    id: 'mars',
    name: '화성',
    nameEn: 'Mars',
    distanceFromEarthKm: 78340000,
    diameterKm: 6779,
    color: 'bg-red-500',
    description: '붉은 행성이라 불리며, 과거에 물이 흘렀던 흔적이 있습니다.',
    revolutionPeriod: '687일',
  },
  {
    id: 'jupiter',
    name: '목성',
    nameEn: 'Jupiter',
    distanceFromEarthKm: 628730000,
    diameterKm: 139820,
    color: 'bg-orange-300',
    description: '태양계에서 가장 큰 행성으로, 거대한 가스 행성입니다.',
    revolutionPeriod: '11.9년',
  },
  {
    id: 'saturn',
    name: '토성',
    nameEn: 'Saturn',
    distanceFromEarthKm: 1275000000,
    diameterKm: 116460,
    color: 'bg-yellow-200',
    description: '아름다운 고리를 가지고 있는 가스 행성입니다.',
    revolutionPeriod: '29.5년',
  },
  {
    id: 'uranus',
    name: '천왕성',
    nameEn: 'Uranus',
    distanceFromEarthKm: 2723950000,
    diameterKm: 50724,
    color: 'bg-cyan-300',
    description: '자전축이 거의 누워있는 상태로 회전하는 얼음 거인입니다.',
    revolutionPeriod: '84년',
  },
  {
    id: 'neptune',
    name: '해왕성',
    nameEn: 'Neptune',
    distanceFromEarthKm: 4351400000,
    diameterKm: 49244,
    color: 'bg-blue-600',
    description: '태양계의 마지막 행성으로, 강한 폭풍이 붑니다.',
    revolutionPeriod: '164.8년',
  },
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "클래스(Class)와 객체(Object)의 관계에 대한 설명으로 옳은 것은?",
    options: [
      "클래스는 붕어빵이고, 객체는 붕어빵 틀이다.",
      "객체는 설계도이고, 클래스는 그 설계도로 만든 제품이다.",
      "클래스는 설계도(틀)이고, 객체는 그 틀로 찍어낸 실체이다.",
      "클래스와 객체는 완전히 동일한 개념이다."
    ],
    correctIndex: 2,
    explanation: "클래스는 객체를 생성하기 위한 청사진(설계도)이며, 객체는 그 설계도를 바탕으로 메모리에 생성된 실체(인스턴스)입니다."
  },
  {
    id: 2,
    question: "파이썬 클래스에서 'self' 키워드의 역할은 무엇인가요?",
    options: [
      "클래스 자체를 의미한다.",
      "메소드가 호출된 객체 자신(인스턴스)을 가리킨다.",
      "전역 변수를 선언할 때 사용한다.",
      "다른 클래스를 상속받을 때 사용한다."
    ],
    correctIndex: 1,
    explanation: "self는 인스턴스 메소드 내에서 현재 객체(인스턴스)에 접근하기 위해 사용되는 첫 번째 매개변수입니다."
  },
  {
    id: 3,
    question: "다음 코드의 실행 결과는? \nclass Rocket:\n  def __init__(self, name):\n    self.name = name\n\nr = Rocket('Apollo')\nprint(r.name)",
    options: [
      "Rocket",
      "name",
      "Apollo",
      "Error 발생"
    ],
    correctIndex: 2,
    explanation: "__init__ 메소드를 통해 'Apollo'라는 이름이 self.name에 저장되었으므로, r.name은 'Apollo'를 출력합니다."
  }
];

export const OX_QUIZ_DATA = [
  { q: "딕셔너리는 데이터와 함수(동작)를 하나로 묶어 관리하기에 가장 최적화된 구조이다.", a: false },
  { q: "하나의 클래스로 여러 개의 서로 다른 객체(인스턴스)를 만들 수 있다.", a: true },
  { q: "클래스 내부의 함수를 '메소드(Method)'라고 부른다.", a: true },
  { q: "객체를 생성할 때 자동으로 호출되는 메소드는 '__start__'이다.", a: false }, // __init__
  { q: "객체 지향 프로그래밍을 사용하면 코드의 재사용성이 높아진다.", a: true },
];