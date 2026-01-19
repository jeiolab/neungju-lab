import { Case, QuizQuestion } from './types';

// Simulation Data
export const CASES: Case[] = [
  {
    id: 'case1',
    title: '사건 1: 수상한 소문의 진원지',
    description: 'SNS에 퍼지고 있는 충격적인 뉴스. 과연 사실일까요? 가짜 뉴스를 판별해 봅시다.',
    initialStepId: 'start',
    steps: {
      'start': {
        id: 'start',
        text: '탐정님! SNS에 "우리 학교 지하에 고대 유적이 발견되어 내일부터 휴교한다"는 기사가 돌고 있습니다. 학생들이 동요하고 있어요. 어떻게 할까요?',
        image: 'https://picsum.photos/600/300?grayscale',
        choices: [
          {
            id: 'c1-1',
            text: '당장 친구들에게 공유해서 알린다.',
            isCorrect: false,
            feedback: '잠깐! 출처가 확인되지 않은 정보는 공유하면 안 됩니다. 혼란만 가중시킬 수 있어요.',
            scoreDelta: -10,
            nextStepId: 'check_source'
          },
          {
            id: 'c1-2',
            text: '기사의 출처와 작성 날짜를 확인한다.',
            isCorrect: true,
            feedback: '훌륭합니다! 기사의 출처(URL)가 공식 언론사인지 확인하는 것이 첫 번째 단계입니다.',
            scoreDelta: 10,
            nextStepId: 'check_source'
          }
        ]
      },
      'check_source': {
        id: 'check_source',
        text: '확인해보니 URL이 "news.school-fake.com" 처럼 이상하고, 작성자 이름도 없습니다. 이제 무엇을 해야 할까요?',
        choices: [
          {
            id: 'c2-1',
            text: '비슷한 내용을 다른 주요 뉴스 사이트에서 검색해 본다.',
            isCorrect: true,
            feedback: '정답! 교차 검증(Cross-checking)은 팩트 체크의 핵심입니다.',
            scoreDelta: 10,
            nextStepId: null
          },
          {
            id: 'c2-2',
            text: '그럴듯해 보이니 일단 믿고 선생님께 여쭤본다.',
            isCorrect: false,
            feedback: '선생님께 묻는 것도 방법이지만, 스스로 먼저 팩트를 체크해보는 습관이 중요합니다.',
            scoreDelta: 5,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'case2',
    title: '사건 2: 사라진 친구의 얼굴',
    description: '친구가 찍힌 웃긴 사진이 인터넷에 떠돌고 있습니다. 초상권과 저작권 문제를 해결하세요.',
    initialStepId: 'start',
    steps: {
      'start': {
        id: 'start',
        text: '탐정님, A군이 수업 시간에 조는 사진을 B군이 몰래 찍어 "잠자는 숲속의 왕자"라며 단톡방에 올렸습니다. 재미있어 보이는데 어떻게 할까요?',
        image: 'https://picsum.photos/600/301?grayscale',
        choices: [
          {
            id: 'c1-1',
            text: '너무 웃기니까 저장해서 내 인스타에도 올린다.',
            isCorrect: false,
            feedback: '안돼요! 당사자의 동의 없는 사진 유포는 초상권 침해이며 명예훼손이 될 수 있습니다.',
            scoreDelta: -20,
            nextStepId: 'ask_permission'
          },
          {
            id: 'c1-2',
            text: 'B군에게 사진을 내리라고 조언한다.',
            isCorrect: true,
            feedback: '맞습니다. 친구의 초상권을 지켜주는 것이 진정한 디지털 에티켓입니다.',
            scoreDelta: 20,
            nextStepId: null
          }
        ]
      },
      'ask_permission': {
        id: 'ask_permission',
        text: '이미 사진이 퍼져버렸다면 어떻게 수습해야 할까요?',
        choices: [
          {
            id: 'c2-1',
            text: '게시물 관리자에게 신고하고 삭제를 요청한다.',
            isCorrect: true,
            feedback: '정확합니다. "잊혀질 권리"를 위해 적극적으로 삭제를 요청해야 합니다.',
            scoreDelta: 10,
            nextStepId: null
          },
          {
            id: 'c2-2',
            text: '어쩔 수 없으니 그냥 둔다.',
            isCorrect: false,
            feedback: '방치하면 디지털 발자국으로 영원히 남을 수 있습니다.',
            scoreDelta: -10,
            nextStepId: null
          }
        ]
      }
    }
  },
  {
    id: 'case3',
    title: '사건 3: 보이지 않는 칼날',
    description: '익명 뒤에 숨은 악성 댓글 제보가 들어왔습니다. 올바른 대처법을 찾아주세요.',
    initialStepId: 'start',
    steps: {
      'start': {
        id: 'start',
        text: '어떤 학생의 SNS에 익명으로 "너 정말 싫어" 같은 악플이 달리고 있습니다. 피해 학생은 무서워하고 있어요.',
        image: 'https://picsum.photos/600/302?grayscale',
        choices: [
          {
            id: 'c1-1',
            text: '같이 욕을 써서 악플러를 혼내준다.',
            isCorrect: false,
            feedback: '감정적인 맞대응은 싸움을 키우고 본인도 처벌받을 수 있습니다.',
            scoreDelta: -15,
            nextStepId: 'evidence'
          },
          {
            id: 'c1-2',
            text: '반응하지 않고 조용히 캡처하여 증거를 남긴다.',
            isCorrect: true,
            feedback: '현명합니다! "무대응(Don\'t feed the trolls)"과 "증거 수집"이 가장 중요합니다.',
            scoreDelta: 15,
            nextStepId: null
          }
        ]
      },
      'evidence': {
        id: 'evidence',
        text: '악플러가 계속 괴롭힌다면 그 다음 단계는요?',
        choices: [
          {
            id: 'c2-1',
            text: '경찰이나 학교폭력 신고센터(117)에 신고한다.',
            isCorrect: true,
            feedback: '맞습니다. 사이버 불링은 명백한 범죄입니다. 전문가의 도움을 받으세요.',
            scoreDelta: 10,
            nextStepId: null
          },
          {
            id: 'c2-2',
            text: 'SNS 계정을 삭제하고 숨는다.',
            isCorrect: false,
            feedback: '피하는 것만이 능사는 아닙니다. 적극적인 대처가 필요해요.',
            scoreDelta: 0,
            nextStepId: null
          }
        ]
      }
    }
  }
];

// Initial Quiz Data (Fallback if Gemini API is missing)
export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    headline: '[속보] 바나나를 껍질째 먹으면 수명이 10년 연장된다?',
    isTruth: false,
    explanation: '전형적인 클릭베이트(Clickbait) 가짜 뉴스입니다. 과학적 근거가 없습니다.'
  },
  {
    id: 'q2',
    headline: '저작권자가 허락하지 않은 음악을 배경음악으로 10초만 쓰는 건 괜찮다?',
    isTruth: false,
    explanation: '시간 길이에 상관없이 저작권자의 허락 없는 사용은 침해입니다. 무료 음원을 이용하세요.'
  },
  {
    id: 'q3',
    headline: '삭제된 SNS 게시물은 서버에서도 즉시 완전히 사라진다?',
    isTruth: false,
    explanation: '디지털 발자국은 쉽게 지워지지 않으며, 누군가 이미 캡처했을 수도 있습니다.'
  }
];
