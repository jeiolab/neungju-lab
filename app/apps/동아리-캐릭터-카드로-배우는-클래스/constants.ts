import { TheoryCard, QuizQuestion } from './types';

export const THEORY_CARDS: TheoryCard[] = [
  {
    id: 1,
    title: "1. 클래스 (Class)",
    definition: "객체를 만들기 위한 설계도이자 틀(Template)입니다.",
    keywords: ["설계도", "템플릿", "정의"],
    example: "동아리 가입 신청서 양식 (빈 종이)",
    misconception: {
      statement: "클래스를 만들면 화면에 바로 캐릭터가 나타난다?",
      correction: "아니요! 클래스는 '양식'일 뿐입니다. 실제로 생성(인스턴스화)해야 존재하게 됩니다."
    },
    checkQuestion: {
      question: "다음 중 클래스에 가장 가까운 비유는?",
      options: ["완성된 붕어빵", "붕어빵 기계(틀)", "붕어빵을 먹는 사람", "붕어빵 가격표"],
      answer: 1
    }
  },
  {
    id: 2,
    title: "2. 인스턴스 (Instance)",
    definition: "클래스(설계도)를 통해 실제로 메모리에 생성된 실체입니다.",
    keywords: ["실체", "구체화", "객체"],
    example: "철수, 영희가 각각 작성하여 제출한 가입 신청서",
    misconception: {
      statement: "하나의 클래스로는 하나의 인스턴스만 만들 수 있다?",
      correction: "아니요! 붕어빵 틀 하나로 수백 개의 붕어빵을 찍어낼 수 있듯, 무수히 많은 인스턴스 생성이 가능합니다."
    },
    checkQuestion: {
      question: "클래스를 통해 만들어진 구체적인 대상을 무엇이라 부르는가?",
      options: ["메서드", "변수", "인스턴스", "프로토타입"],
      answer: 2
    }
  },
  {
    id: 3,
    title: "3. 속성 (Attribute/Property)",
    definition: "객체가 가지고 있는 고유한 데이터나 상태값입니다.",
    keywords: ["데이터", "상태", "변수"],
    example: "이름: 홍길동, 레벨: 5, 역할: 전사",
    misconception: {
      statement: "같은 클래스의 인스턴스들은 속성값이 모두 같아야 한다?",
      correction: "아니요! 틀은 같지만 내용은 다릅니다. A학생의 이름과 B학생의 이름은 서로 다를 수 있습니다."
    },
    checkQuestion: {
      question: "캐릭터의 '체력(HP)'이나 '이름'은 객체의 무엇에 해당하는가?",
      options: ["메서드", "속성", "클래스", "함수"],
      answer: 1
    }
  },
  {
    id: 4,
    title: "4. 메서드 (Method)",
    definition: "객체가 수행할 수 있는 동작이나 기능(함수)입니다.",
    keywords: ["동작", "행동", "기능"],
    example: "공격하기(), 인사하기(), 레벨업()",
    misconception: {
      statement: "메서드는 클래스 밖에 따로 만들어야 한다?",
      correction: "아니요! 메서드는 클래스 내부에 정의되어, 해당 객체가 할 수 있는 행동을 규정합니다."
    },
    checkQuestion: {
      question: "객체의 상태를 변경하거나 특정 작업을 수행하는 '동작'을 무엇이라 하는가?",
      options: ["속성", "인스턴스", "메서드", "생성자"],
      answer: 2
    }
  },
  {
    id: 5,
    title: "5. 생성자 (Constructor)",
    definition: "인스턴스가 처음 생성될 때 초기 상태를 설정하는 특별한 메서드입니다.",
    keywords: ["초기화", "시작", "세팅"],
    example: "신입 부원이 들어올 때, 레벨을 1로, 체력을 100으로 자동 설정함",
    misconception: {
      statement: "생성자는 내가 원할 때 아무 때나 호출할 수 있다?",
      correction: "일반적으로 생성자는 객체가 '탄생(생성)'하는 순간 딱 한 번만 자동 호출됩니다."
    },
    checkQuestion: {
      question: "객체 생성 시 '초기값'을 세팅하기 위해 실행되는 것은?",
      options: ["소멸자", "생성자", "반복문", "조건문"],
      answer: 1
    }
  },
  {
    id: 6,
    title: "6. 상태의 독립성 (Encapsulation basic)",
    definition: "각 인스턴스는 서로 다른 메모리 공간을 가지며, 상태가 독립적입니다.",
    keywords: ["독립", "개별", "영향X"],
    example: "철수가 데미지를 입어도 영희의 체력은 줄어들지 않는다.",
    misconception: {
      statement: "클래스의 코드를 수정하면 이미 만들어진 인스턴스도 바뀐다?",
      correction: "주의! 코드 수정 후 새로 만든 건 바뀌지만, 실행 중인 메모리 상의 기존 객체 값은 별개로 관리됩니다(언어/환경따라 다름을 인지)."
    },
    checkQuestion: {
      question: "A 인스턴스의 레벨을 올렸을 때, B 인스턴스의 레벨은?",
      options: ["같이 오른다", "B가 사라진다", "변하지 않는다", "에러가 난다"],
      answer: 2
    }
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  // Easy
  {
    id: 1,
    type: 'multiple',
    difficulty: 'easy',
    question: "객체 지향 프로그래밍에서 '설계도' 역할을 하는 것은?",
    options: ["인스턴스", "클래스", "변수", "상수"],
    correctAnswer: 1,
    explanation: "클래스는 객체를 만들기 위한 설계도(Blueprint)입니다."
  },
  {
    id: 2,
    type: 'multiple',
    difficulty: 'easy',
    question: "실제로 메모리에 생성되어 작동하는 실체는?",
    options: ["클래스", "인스턴스", "주석", "타입"],
    correctAnswer: 1,
    explanation: "클래스를 통해 만들어진 실체를 인스턴스(객체)라고 합니다."
  },
  {
    id: 3,
    type: 'multiple',
    difficulty: 'easy',
    question: "객체가 가진 데이터(이름, 나이 등)를 무엇이라 하는가?",
    options: ["메서드", "속성", "반환값", "매개변수"],
    correctAnswer: 1,
    explanation: "객체의 상태나 데이터를 속성(Attribute) 또는 프로퍼티라고 합니다."
  },
  // Medium
  {
    id: 4,
    type: 'multiple',
    difficulty: 'medium',
    question: "다음 코드: `const hero = new Hero();` 에서 `hero`는 무엇인가?",
    options: ["클래스", "인스턴스", "메서드", "속성"],
    correctAnswer: 1,
    explanation: "new 키워드를 통해 생성된 hero는 Hero 클래스의 인스턴스입니다."
  },
  {
    id: 5,
    type: 'short',
    difficulty: 'medium',
    question: "같은 클래스로 만든 인스턴스 A와 B가 있다. A의 속성을 바꾸면 B의 속성도 바뀌는가? (O/X)",
    correctAnswer: "X",
    explanation: "인스턴스는 서로 독립적인 메모리 공간을 가지므로 서로 영향을 주지 않습니다."
  },
  {
    id: 6,
    type: 'multiple',
    difficulty: 'medium',
    question: "객체의 행동이나 기능을 정의한 함수를 무엇이라 부르는가?",
    options: ["속성", "메서드", "변수", "배열"],
    correctAnswer: 1,
    explanation: "클래스 내부에 정의된 함수를 메서드(Method)라고 합니다."
  },
  // Hard
  {
    id: 7,
    type: 'multiple',
    difficulty: 'hard',
    question: "생성자(Constructor)의 주된 역할은?",
    options: ["객체 삭제", "객체 초기화", "메서드 실행", "클래스 정의"],
    correctAnswer: 1,
    explanation: "생성자는 객체가 생성될 때 속성 등을 초기화하는 역할을 합니다."
  },
  {
    id: 8,
    type: 'short',
    difficulty: 'hard',
    question: "함수는 '선언'하고 '호출'한다. 클래스는 '정의'하고 무엇을 한다고 표현하는가? (초성힌트: ㅇㅅㅌㅅㅎ)",
    correctAnswer: "인스턴스화",
    explanation: "클래스를 정의한 후, 이를 실체로 만드는 과정을 '인스턴스화(Instantiation)'라고 합니다."
  },
  {
    id: 9,
    type: 'descriptive',
    difficulty: 'hard',
    question: "붕어빵 틀(클래스)과 붕어빵(인스턴스) 비유의 한계점(반례)을 하나만 서술하시오.",
    correctAnswer: "", // Open ended check
    explanation: "예: 붕어빵은 한 번 만들어지면 팥을 슈크림으로 바꿀 수 없지만, 소프트웨어 객체는 속성 변경이 자유롭다."
  },
  {
    id: 10,
    type: 'descriptive',
    difficulty: 'hard',
    question: "동아리 부원 관리 프로그램을 만들 때, 'Member' 클래스에 필요한 속성 3가지를 제안하시오.",
    correctAnswer: "", // Open ended check
    explanation: "예: 이름, 학번, 전공, 가입일, 직책 등"
  }
];
