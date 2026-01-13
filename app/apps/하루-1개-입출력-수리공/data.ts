import { Concept, DailyMission, QuizQuestion } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'c1',
    title: '표준 입출력 (Standard I/O)',
    content: '키보드로 입력받고 화면으로 출력하는 가장 기본적인 방법입니다. input()은 항상 문자열을 반환합니다.',
    codeSnippet: `name = input("이름: ")\nprint(f"안녕, {name}!")`,
    category: 'Standard',
  },
  {
    id: 'c2',
    title: '파일 열기 모드 (File Modes)',
    content: '파일을 다룰 때는 목적에 맞는 모드를 선택해야 합니다.\n- r: 읽기 전용 (기본)\n- w: 쓰기 (기존 내용 삭제됨)\n- a: 이어쓰기 (기존 내용 유지)',
    codeSnippet: `f = open("data.txt", "a")\nf.write("New Line")\nf.close()`,
    category: 'File',
  },
  {
    id: 'c3',
    title: 'with open 구문',
    content: '파일을 열고 닫는 것을 실수하지 않도록 자동으로 close()를 호출해주는 안전한 방식입니다.',
    codeSnippet: `with open("data.txt", "r") as f:\n    data = f.read()\n# 여기서 자동으로 파일이 닫힘`,
    category: 'File',
  },
];

// Template missions that will be rotated/selected
export const MISSION_POOL: DailyMission[] = [
  {
    id: 'm1',
    type: 'mode_fix',
    title: '일기장이 사라졌다!',
    description: '매일 일기를 파일에 저장하려고 합니다. 그런데 코드를 실행할 때마다 어제 쓴 일기가 사라집니다. 기존 내용을 유지하려면 어떻게 고쳐야 할까요?',
    brokenCode: `file = open("diary.txt", "w")\nfile.write("오늘도 코딩 공부함\\n")\nfile.close()`,
    options: [
      { id: 'o1', label: 'open("diary.txt", "r")', isCorrect: false, feedback: '"r"은 읽기 모드입니다. 쓸 수 없어요.' },
      { id: 'o2', label: 'open("diary.txt", "a")', isCorrect: true, feedback: '정답! "a"(append) 모드는 기존 내용을 유지하고 뒤에 추가합니다.' },
      { id: 'o3', label: 'open("diary.txt", "wb")', isCorrect: false, feedback: '바이너리 쓰기 모드도 기존 내용을 덮어씁니다.' },
    ],
  },
  {
    id: 'm2',
    type: 'close_fix',
    title: '문이 열려있어요',
    description: '파일을 열어서 작업을 마쳤는데, 저장이 제대로 안 되거나 다른 프로그램에서 파일을 못 쓴다고 합니다. 무엇이 빠졌을까요?',
    brokenCode: `f = open("score.txt", "w")\nf.write("Score: 100")\n# ... 작업 끝 ...`,
    options: [
      { id: 'o1', label: 'f.read() 추가', isCorrect: false, feedback: '읽는다고 파일이 닫히지는 않습니다.' },
      { id: 'o2', label: 'f.close() 추가', isCorrect: true, feedback: '정답! open한 파일은 반드시 close()로 닫아줘야 자원이 반환되고 저장됩니다.' },
      { id: 'o3', label: 'f.flush() 추가', isCorrect: false, feedback: 'flush는 버퍼를 비우지만 파일을 닫지는 않습니다.' },
    ],
  },
  {
    id: 'm3',
    type: 'input_fix',
    title: '유령 변수',
    description: '사용자의 나이를 출력하고 싶은데, age 변수가 정의되지 않았다고 에러가 납니다. 사용자로부터 입력을 받아야 합니다.',
    brokenCode: `# 나이를 입력받는 코드가 없음\nprint(f"당신의 나이는 {age}세 입니다.")`,
    options: [
      { id: 'o1', label: 'age = 0', isCorrect: false, feedback: '에러는 사라지지만 사용자의 입력이 아닙니다.' },
      { id: 'o2', label: 'age = input("나이: ")', isCorrect: true, feedback: '정답! 표준 입력 함수 input()을 사용하여 변수에 값을 할당해야 합니다.' },
      { id: 'o3', label: 'age = print("나이")', isCorrect: false, feedback: 'print는 출력을 위한 함수이며 값을 반환하지 않습니다(None).' },
    ],
  },
  {
    id: 'm4',
    type: 'mode_fix',
    title: '읽을 수 없어요',
    description: '파일의 내용을 읽어서 화면에 보여주려고 합니다. 그런데 "not readable" 에러가 발생합니다.',
    brokenCode: `f = open("story.txt", "w")\ntext = f.read()\nprint(text)\nf.close()`,
    options: [
      { id: 'o1', label: '"w"를 "r"로 변경', isCorrect: true, feedback: '정답! 읽기 위해서는 "r"(read) 모드로 열어야 합니다. "w"는 쓰기 전용입니다.' },
      { id: 'o2', label: 'f.write()로 변경', isCorrect: false, feedback: '파일 내용을 읽어오는 것이 목표입니다.' },
      { id: 'o3', label: '"w"를 "a"로 변경', isCorrect: false, feedback: '"a" 모드도 쓰기 전용(이어쓰기)이라 읽을 수 없습니다.' },
    ],
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: '다음 중 파일 모드 "w"에 대한 설명으로 올바른 것은?',
    options: ['파일이 없으면 에러가 발생한다.', '파일이 있으면 내용을 유지하고 뒤에 쓴다.', '파일이 있으면 내용을 모두 지우고 새로 쓴다.', '바이너리 파일만 다룰 수 있다.'],
    correctIndex: 2,
    explanation: '"w" 모드는 파일이 존재할 경우 내용을 덮어씁니다(Overwrite).',
    tags: ['mode']
  },
  {
    id: 2,
    question: 'open() 함수 사용 시 파일을 닫아주지 않아도 되는 방법은?',
    options: ['close() 함수를 두 번 호출한다.', 'with open(...) 구문을 사용한다.', 'try-except 구문을 사용한다.', 'while 반복문을 사용한다.'],
    correctIndex: 1,
    explanation: 'with open(...) as f: 블록을 사용하면 블록을 빠져나갈 때 자동으로 close()가 호출됩니다.',
    tags: ['close']
  },
  {
    id: 3,
    question: 'input("숫자: ")로 10을 입력받았다. 이 값의 자료형은?',
    options: ['int (정수)', 'str (문자열)', 'float (실수)', 'bool (불리언)'],
    correctIndex: 1,
    explanation: 'Python의 input() 함수는 사용자가 무엇을 입력하든 항상 문자열(str) 형태로 반환합니다.',
    tags: ['standard']
  },
  {
    id: 4,
    question: '파일을 이어쓰기(append) 모드로 열 때 사용하는 기호는?',
    options: ['r', 'w', 'a', 'x'],
    correctIndex: 2,
    explanation: '"a"는 Append(추가)의 약자로, 기존 내용을 유지하며 끝에 내용을 추가합니다.',
    tags: ['mode']
  },
  {
    id: 5,
    question: '표준 출력 함수 print()의 기본 줄바꿈 동작을 없애려면?',
    options: ['end="" 옵션을 사용한다.', 'sep="" 옵션을 사용한다.', 'file=None 옵션을 사용한다.', 'return을 사용한다.'],
    correctIndex: 0,
    explanation: 'print("...", end="") 처럼 end 파라미터를 빈 문자열로 설정하면 줄바꿈 없이 출력됩니다.',
    tags: ['standard']
  }
];
