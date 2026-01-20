import { Mission, MissionType, QuizQuestion, ReflectionPrompt } from './types';
import { Lightbulb, Box, RefreshCw, Play } from 'lucide-react';
import React from 'react';

// --- Theory Content ---
export const THEORY_CARDS = [
  {
    title: '클래스 (Class)',
    icon: <Box className="w-6 h-6 text-blue-500" />,
    content: '특정 객체를 생성하기 위한 변수와 메서드의 정의를 담은 틀입니다. 흔히 "쿠키 틀(Cookie Cutter)"에 비유됩니다.',
    color: 'border-blue-500'
  },
  {
    title: '인스턴스 (Instance)',
    icon: <Box className="w-6 h-6 text-green-500 fill-green-100" />,
    content: '클래스를 통해 실제로 생성된 객체입니다. 틀로 찍어낸 "쿠키"와 같습니다. 각 인스턴스는 고유의 메모리 공간을 가집니다.',
    color: 'border-green-500'
  },
  {
    title: '생성자 (Constructor)',
    icon: <RefreshCw className="w-6 h-6 text-orange-500" />,
    content: '인스턴스가 생성될 때 호출되는 특수한 메서드입니다. 객체의 초기 상태(속성)를 설정하는 역할을 합니다.',
    color: 'border-orange-500'
  },
  {
    title: '메서드 (Method)',
    icon: <Play className="w-6 h-6 text-purple-500" />,
    content: '클래스 내부에 정의된 함수로, 객체가 수행할 수 있는 행동(Behavior)을 나타냅니다.',
    color: 'border-purple-500'
  }
];

// --- Missions Pool (Representative subset of 30) ---
export const MISSION_POOL: Mission[] = [
  {
    id: 1,
    type: MissionType.SHARED_STATE_DELUSION,
    title: "유령 체력 바 사건",
    context: "RPG 게임을 만들고 있습니다. 그런데 고블린 한 마리가 데미지를 입었더니, 모든 고블린의 체력이 동시에 줄어듭니다!",
    buggyCode: `class Goblin {
  hp = 100; // 클래스 필드 정의
}
// 일부 구형 환경이나 잘못된 패턴 예시:
Goblin.prototype.hp = 100; 

const g1 = new Goblin();
const g2 = new Goblin();
g1.hp -= 50; 
// 왜 g2의 체력도 같이 변하는 경우가 생길까요?`,
    bugDescription: "엄격한 클래스 필드 문법에서는 괜찮지만, 개념적으로 프로토타입이나 정적 변수에 상태를 저장하면 모든 인스턴스가 그 값을 공유하게 됩니다.",
    fixExplanation: "각 인스턴스가 고유한 메모리를 가질 수 있도록, 속성은 생성자(constructor) 내부에서 초기화하거나 개별 클래스 필드로 선언해야 합니다.",
    correctedCode: `class Goblin {
  constructor() {
    this.hp = 100; // 인스턴스마다 별도 생성
  }
}`
  },
  {
    id: 2,
    type: MissionType.METHOD_CONTEXT_CONFUSION,
    title: "건망증 심한 영웅",
    context: "영웅이 공격을 하려는데 1초 딜레이를 주었더니 '이름(name)'을 기억하지 못하고 에러가 납니다!",
    buggyCode: `class Hero {
  constructor(name) {
    this.name = name;
  }
  attack() {
    console.log(this.name + "의 공격!");
  }
  delayedAttack() {
    setTimeout(this.attack, 1000); 
    // Error: Cannot read property 'name' of undefined
  }
}`,
    bugDescription: "`this.attack`을 콜백 함수로 전달할 때, 실행 컨텍스트(Context)가 소실되어 `this`가 무엇인지 모르게 됩니다.",
    fixExplanation: "화살표 함수를 사용하거나 `.bind(this)`를 사용하여 컨텍스트를 유지해야 합니다.",
    correctedCode: `delayedAttack() {
  setTimeout(() => this.attack(), 1000);
}`
  },
  {
    id: 3,
    type: MissionType.CONSTRUCTOR_MISSING,
    title: "이름 없는 NPC",
    context: "NPC를 생성할 때 이름을 넣어줬는데, 확인해보니 undefined라고 나옵니다.",
    buggyCode: `class NPC {
  // 생성자가 없거나 잘못 할당됨
  sayHello(name) {
    this.name = name;
  }
}
const shopkeeper = new NPC("마커스");
console.log(shopkeeper.name); // undefined`,
    bugDescription: "클래스에 `constructor`가 없어서, `new NPC('마커스')` 호출 시 전달된 인자를 처리하지 못했습니다.",
    fixExplanation: "`constructor` 메서드를 추가하여 인자를 받고, 이를 `this.name`에 할당해야 합니다.",
    correctedCode: `class NPC {
  constructor(name) {
    this.name = name;
  }
}`
  },
  {
    id: 4,
    type: MissionType.SHARED_STATE_DELUSION,
    title: "공유된 인벤토리 버그",
    context: "플레이어 A가 아이템을 먹었는데, 플레이어 B의 가방에도 똑같은 아이템이 생겼습니다.",
    buggyCode: `class Player {
  // 배열이 여기서 정의되면 (일부 패턴에서)
  // 프로토타입에 공유될 위험이 있습니다.
}
Player.prototype.inventory = []; 

const p1 = new Player();
const p2 = new Player();
p1.inventory.push("검");
console.log(p2.inventory); // ["검"] ?!`,
    bugDescription: "배열이나 객체 같은 참조 타입(Reference Type)을 프로토타입에 정의하면 모든 인스턴스가 동일한 배열을 바라보게 됩니다.",
    fixExplanation: "참조 타입은 반드시 생성자(constructor) 내부에서 초기화하여 인스턴스별 독립성을 보장하세요.",
    correctedCode: `class Player {
  constructor() {
    this.inventory = [];
  }
}`
  },
  {
    id: 5,
    type: MissionType.METHOD_CONTEXT_CONFUSION,
    title: "이벤트 리스너의 함정",
    context: "버튼을 클릭하면 점수가 올라야 하는데, 점수 대신 NaN이 뜨거나 아무 반응이 없습니다.",
    buggyCode: `class Game {
  constructor() {
    this.score = 0;
    document.querySelector('button')
      .addEventListener('click', this.increaseScore);
  }
  increaseScore() {
    this.score++; 
    // 여기서 'this'는 Game 객체가 아니라 클릭된 버튼(HTMLButtonElement)입니다!
  }
}`,
    bugDescription: "이벤트 리스너에 메서드를 그대로 넘기면, `this`는 이벤트가 발생한 DOM 요소를 가리키게 됩니다.",
    fixExplanation: "생성자에서 메서드를 `bind`하거나, 화살표 함수로 정의하여 `this`를 고정하세요.",
    correctedCode: `constructor() {
  this.increaseScore = this.increaseScore.bind(this);
}`
  }
];

// --- Quizzes ---
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    difficulty: '쉬움',
    question: "클래스(Class)의 주된 목적은 무엇인가요?",
    options: ["코드를 즉시 실행하기 위해", "객체를 생성하기 위한 청사진(설계도) 역할", "전역 변수를 저장하기 위해", "HTML 스타일을 입히기 위해"],
    correctAnswer: 1,
    explanation: "클래스는 객체(인스턴스)의 구조와 행동을 정의하는 설계도(Blueprint)입니다."
  },
  {
    id: 2,
    difficulty: '쉬움',
    question: "클래스의 새로운 인스턴스를 생성할 때 사용하는 키워드는?",
    options: ["create", "make", "new", "instance"],
    correctAnswer: 2,
    explanation: "`new` 키워드는 생성자를 호출하고 새로운 객체 인스턴스를 메모리에 할당합니다."
  },
  {
    id: 3,
    difficulty: '보통',
    question: "`class Dog`가 있을 때, `const d1 = new Dog(); const d2 = new Dog();`를 실행했습니다. d1과 d2는 같은가요?",
    options: ["네, 완전히 같은 객체입니다.", "아니요, 서로 다른 메모리를 가진 별개의 인스턴스입니다.", "이름이 같을 때만 같습니다.", "네, 메서드를 공유하므로 같습니다."],
    correctAnswer: 1,
    explanation: "두 인스턴스는 설계도는 같지만 서로 다른 메모리 공간에 존재하는 별개의 객체입니다."
  },
  {
    id: 4,
    difficulty: '보통',
    question: "클래스 메서드 내부에서 `this`는 주로 무엇을 가리키나요?",
    options: ["전역 window 객체", "함수 그 자체", "메서드를 호출한 특정 인스턴스", "클래스 정의 그 자체"],
    correctAnswer: 2,
    explanation: "`this`는 해당 메서드를 호출한 구체적인 인스턴스(예: d1 또는 d2)를 가리킵니다."
  },
  {
    id: 5,
    difficulty: '어려움',
    question: "배열 `items = []`를 프로토타입이 아닌 생성자(constructor) 내부에 정의해야 하는 이유는 무엇인가요?",
    options: ["메모리를 절약하기 위해", "플레이어끼리 아이템을 공유하기 위해", "각 인스턴스가 서로 간섭받지 않는 독립된 배열을 갖기 위해", "코드 실행 속도를 높이기 위해"],
    correctAnswer: 2,
    explanation: "프로토타입에 정의된 참조 타입은 공유됩니다. 생성자 내부에 정의해야 각 객체가 자신만의 배열을 가질 수 있습니다."
  }
];

// --- Reflection ---
export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  {
    id: 1,
    title: "유지보수성 (Maintainability)",
    content: "왜 `player1Health`, `player2Health` 같은 전역 변수 대신, 데이터(체력, 마나)와 행동(공격, 회복)을 묶은 'Player' 클래스를 사용하는 것이 디버깅에 유리할까요?"
  },
  {
    id: 2,
    title: "확장성 (Scalability)",
    content: "게임에 적(Enemy)이 100마리 필요하다고 상상해보세요. 클래스 없이 구현한다면 어떤 문제가 생기며, 클래스는 이를 어떻게 해결해주나요?"
  },
  {
    id: 3,
    title: "현실 세계 모델링",
    content: "주변의 사물(예: 커피 머신) 하나를 골라 클래스로 정의해보세요. 어떤 속성(상태)과 메서드(행동)가 필요할까요?"
  }
];