import { Concept } from './types';

export const CONCEPTS: Concept[] = [
  {
    id: 'frequency_cut',
    title: '비가청 주파수 제거',
    description: '인간의 귀는 보통 20Hz에서 20,000Hz(20kHz) 사이의 소리만 들을 수 있습니다. MP3는 이 범위를 벗어난 초고음과 초저음을 과감하게 삭제하여 데이터 용량을 줄입니다.',
    visualIcon: '✂️'
  },
  {
    id: 'masking',
    title: '마스킹 효과 (Masking Effect)',
    description: '큰 소리 바로 옆에 있는 작은 소리는 우리 귀에 들리지 않습니다. 마치 밝은 태양 아래서 별이 보이지 않는 것과 같습니다. 압축 알고리즘은 이렇게 "묻힌" 소리 데이터를 삭제합니다.',
    visualIcon: '🎭'
  }
];

export const FILE_SIZE_DATA = {
  lossless: { label: 'CD 음질 (WAV)', size: '40.0 MB', ratio: '100%' },
  mp3: { label: '표준 MP3 (128kbps)', size: '3.8 MB', ratio: '~10%' },
  low_quality: { label: '저음질 (64kbps)', size: '1.9 MB', ratio: '~5%' },
};