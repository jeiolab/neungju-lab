import { ConceptCard, QuizQuestion, SimulationItem } from './types';

export const CONCEPTS: ConceptCard[] = [
  {
    id: 'c1',
    category: 'VISION',
    title: '컴퓨터 비전 (Computer Vision)',
    description: '기계가 이미지를 보고 "이것이 무엇인가?"를 판단하는 기술입니다. 픽셀 데이터를 분석하여 패턴을 찾습니다.',
    keywords: ['CNN', '객체 탐지', '이미지 분류', '픽셀 분석'],
    iconName: 'Eye'
  },
  {
    id: 'c2',
    category: 'NLP',
    title: '자연어 처리 (NLP)',
    description: '인간의 언어를 컴퓨터가 이해하고 처리하는 기술입니다. 문맥(Context)을 파악하는 것이 핵심입니다.',
    keywords: ['Transformer', '토큰화', '감성 분석', '기계 번역'],
    iconName: 'MessageSquareText'
  },
  {
    id: 'c3',
    category: 'GEN_AI',
    title: '생성형 AI (Generative AI)',
    description: '데이터를 학습하여 새로운 콘텐츠(텍스트, 이미지 등)를 창조하는 AI입니다.',
    keywords: ['GAN', 'Diffusion', 'LLM', '창작'],
    iconName: 'Sparkles'
  }
];

export const SIMULATION_ITEMS: SimulationItem[] = [
  {
    id: 's1',
    name: '자율주행차의 장애물 인식',
    description: '도로 위의 사람과 차량을 구별합니다.',
    correctCategory: 'VISION',
    iconName: 'Car'
  },
  {
    id: 's2',
    name: '스마트 스피커',
    description: '사용자의 음성 명령을 이해하고 대답합니다.',
    correctCategory: 'NLP',
    iconName: 'Mic'
  },
  {
    id: 's3',
    name: 'AI 화가',
    description: '텍스트 설명을 입력하면 그림을 그려줍니다.',
    correctCategory: 'GEN_AI',
    iconName: 'Palette'
  },
  {
    id: 's4',
    name: '이메일 스팸 필터',
    description: '메일 내용을 읽고 스팸 여부를 판단합니다.',
    correctCategory: 'NLP',
    iconName: 'Mail'
  },
  {
    id: 's5',
    name: '공항 얼굴 인식 게이트',
    description: '여권 사진과 실제 얼굴을 대조합니다.',
    correctCategory: 'VISION',
    iconName: 'ScanFace'
  },
  {
    id: 's6',
    name: '챗봇 상담사',
    description: '고객의 질문에 자연스러운 답변을 생성합니다.',
    correctCategory: 'GEN_AI', // Technically NLP+GenAI, but emphasizing generation here based on curriculum
    iconName: 'Bot'
  }
];

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'VISION',
    question: '컴퓨터 비전에서 이미지의 특징을 추출하기 위해 주로 사용되는 신경망 구조는?',
    options: ['RNN (Recurrent Neural Network)', 'CNN (Convolutional Neural Network)', 'GAN (Generative Adversarial Network)', 'SVM (Support Vector Machine)'],
    correctAnswer: 1,
    explanation: 'CNN(합성곱 신경망)은 이미지의 공간적 정보를 유지하며 특징을 추출하는 데 탁월하여 컴퓨터 비전의 핵심 기술로 사용됩니다.',
    difficulty: 'EASY'
  },
  {
    id: 'q2',
    category: 'NLP',
    question: 'NLP 모델인 BERT나 GPT의 기반이 되는, "Attention" 메커니즘을 사용하는 핵심 아키텍처는?',
    options: ['Transformer', 'Autoencoder', 'Perceptron', 'LSTM'],
    correctAnswer: 0,
    explanation: 'Transformer는 Attention 메커니즘을 통해 문장 내 단어 간의 관계(문맥)를 병렬적으로 빠르게 처리하는 혁신적인 아키텍처입니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q3',
    category: 'GEN_AI',
    question: '생성형 AI 모델 중, "생성자(Generator)"와 "판별자(Discriminator)"가 서로 경쟁하며 학습하는 모델은?',
    options: ['Diffusion Model', 'VAE', 'GAN', 'ResNet'],
    correctAnswer: 2,
    explanation: 'GAN(Generative Adversarial Network)은 위조지폐범(생성자)과 경찰(판별자)의 경쟁 원리를 이용하여 데이터를 생성합니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q4',
    category: 'GEN_AI',
    question: 'Diffusion 모델의 핵심 작동 원리로 올바른 것은?',
    options: ['데이터를 압축했다가 복원한다.', '노이즈를 점진적으로 제거하며 이미지를 복원한다.', '두 신경망이 경쟁한다.', '텍스트를 벡터로 변환한다.'],
    correctAnswer: 1,
    explanation: 'Diffusion 모델은 이미지에 노이즈를 더해가는 과정을 학습한 뒤, 이를 역으로 수행하여 노이즈로부터 깨끗한 이미지를 생성합니다.',
    difficulty: 'HARD'
  },
  {
    id: 'q5',
    category: 'NLP',
    question: 'ChatGPT의 특징으로 가장 적절하지 않은 것은?',
    options: ['대규모 언어 모델(LLM) 기반이다.', '이전 대화의 문맥을 기억한다.', '정해진 규칙 기반(Rule-based)으로만 대답한다.', 'Transformer 아키텍처를 사용한다.'],
    correctAnswer: 2,
    explanation: 'ChatGPT는 규칙 기반이 아니라, 방대한 데이터를 학습하여 확률적으로 다음에 올 단어를 예측하는 생성형 모델입니다.',
    difficulty: 'EASY'
  },
  {
    id: 'q6',
    category: 'VISION',
    question: '이미지에서 특정 객체의 위치를 찾고(Localization) 무엇인지 분류(Classification)하는 기술은?',
    options: ['Semantic Segmentation', 'Object Detection', 'Image Restoration', 'Style Transfer'],
    correctAnswer: 1,
    explanation: 'Object Detection(객체 탐지)은 이미지 내 객체의 위치(Bounding Box)와 종류를 동시에 파악하는 기술입니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q7',
    category: 'GEN_AI',
    question: '다음 중 입력 데이터를 저차원 잠재 공간(Latent Space)으로 압축했다가 다시 복원하는 생성 모델은?',
    options: ['CNN', 'VAE (Variational Autoencoder)', 'Random Forest', 'K-Means'],
    correctAnswer: 1,
    explanation: 'VAE와 오토인코더는 데이터를 잠재 공간으로 인코딩했다가 디코딩하며 데이터를 생성하거나 복원하는 구조를 가집니다.',
    difficulty: 'HARD'
  },
  {
    id: 'q8',
    category: 'NLP',
    question: '문장을 토큰(Token) 단위로 나누는 과정을 무엇이라 하는가?',
    options: ['Embedding', 'Tokenization', 'Pooling', 'Normalization'],
    correctAnswer: 1,
    explanation: 'Tokenization(토큰화)은 텍스트를 모델이 처리할 수 있는 작은 단위(단어, 서브워드 등)로 쪼개는 전처리 과정입니다.',
    difficulty: 'EASY'
  },
  {
    id: 'q9',
    category: 'GEN_AI',
    question: 'Deepfake 기술이 주로 사용하는 생성 모델 기술은?',
    options: ['GAN 또는 Autoencoder', 'Linear Regression', 'Decision Tree', 'DBSCAN'],
    correctAnswer: 0,
    explanation: '딥페이크는 주로 GAN이나 오토인코더 변형 모델을 사용하여 얼굴을 합성하고 생성합니다.',
    difficulty: 'MEDIUM'
  },
  {
    id: 'q10',
    category: 'VISION',
    question: '이미지의 픽셀 값을 변화시켜 사람이 알아채지 못하게 AI를 속이는 공격 방식은?',
    options: ['Adversarial Attack', 'Dropout', 'Backpropagation', 'Gradient Descent'],
    correctAnswer: 0,
    explanation: '적대적 공격(Adversarial Attack)은 미세한 노이즈를 추가하여 딥러닝 모델이 오답을 내도록 유도하는 보안 위협입니다.',
    difficulty: 'HARD'
  }
];