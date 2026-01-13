import { Species, PenguinData, ClimateData, GlossaryTerm } from './types';

// Simplified mock data based on Palmer Penguins dataset trends
export const PENGUIN_DATA: PenguinData[] = [
  // Adelie (Short beak, short flipper) - Blue
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    species: Species.Adelie,
    beakLength: 35 + Math.random() * 8, 
    flipperLength: 180 + Math.random() * 15,
    color: '#3b82f6'
  })),
  // Chinstrap (Medium beak, medium flipper) - Purple
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: i + 20,
    species: Species.Chinstrap,
    beakLength: 45 + Math.random() * 8, 
    flipperLength: 190 + Math.random() * 12,
    color: '#8b5cf6'
  })),
  // Gentoo (Medium beak, long flipper) - Teal
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: i + 40,
    species: Species.Gentoo,
    beakLength: 45 + Math.random() * 10, 
    flipperLength: 210 + Math.random() * 15,
    color: '#14b8a6'
  })),
];

export const CLIMATE_DATA: ClimateData[] = [
  { year: 1990, tempAnomaly: 0.32 },
  { year: 1991, tempAnomaly: 0.28 },
  { year: 1992, tempAnomaly: 0.19 },
  { year: 1993, tempAnomaly: 0.22 },
  { year: 1994, tempAnomaly: 0.28 },
  { year: 1995, tempAnomaly: 0.38 },
  { year: 1996, tempAnomaly: 0.25 },
  { year: 1997, tempAnomaly: 0.46 },
  { year: 1998, tempAnomaly: 0.58 },
  { year: 1999, tempAnomaly: 0.39 },
  { year: 2000, tempAnomaly: 0.38 },
  { year: 2001, tempAnomaly: 0.52 },
  { year: 2002, tempAnomaly: 0.59 },
  { year: 2003, tempAnomaly: 0.60 },
  { year: 2004, tempAnomaly: 0.56 },
  { year: 2005, tempAnomaly: 0.64 },
  { year: 2006, tempAnomaly: 0.58 },
  { year: 2007, tempAnomaly: 0.58 },
  { year: 2008, tempAnomaly: 0.50 },
  { year: 2009, tempAnomaly: 0.61 },
  { year: 2010, tempAnomaly: 0.68 },
  { year: 2011, tempAnomaly: 0.54 },
  { year: 2012, tempAnomaly: 0.60 },
  { year: 2013, tempAnomaly: 0.64 },
  { year: 2014, tempAnomaly: 0.71 },
  { year: 2015, tempAnomaly: 0.86 },
  { year: 2016, tempAnomaly: 0.93 },
  { year: 2017, tempAnomaly: 0.86 },
  { year: 2018, tempAnomaly: 0.79 },
  { year: 2019, tempAnomaly: 0.91 },
  { year: 2020, tempAnomaly: 0.95 },
  { year: 2021, tempAnomaly: 0.85 },
  { year: 2022, tempAnomaly: 0.90 },
  { year: 2023, tempAnomaly: 1.17 },
];

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: "산점도 (Scatter Plot)",
    definition: "두 변수의 값을 X축과 Y축에 점으로 찍어 나타낸 그래프입니다. 데이터가 어떻게 분포해 있는지 눈으로 쉽게 확인할 수 있습니다."
  },
  {
    term: "KNN (K-최근접 이웃)",
    definition: "새로운 데이터가 들어왔을 때, 가장 가까이 있는 'K'개의 이웃 데이터를 보고, 다수결로 종류를 판별하는 알고리즘입니다. '유유상종'의 원리와 같습니다."
  },
  {
    term: "회귀 분석 (Regression)",
    definition: "데이터의 추세를 파악하여 미래의 값을 예측하는 통계적 방법입니다. 예를 들어, 과거 기온 데이터를 바탕으로 2050년의 기온을 예측할 때 사용합니다."
  },
  {
    term: "이상치 (Outlier)",
    definition: "다른 데이터들과 동떨어져 있는 값을 말합니다. 측정 오류일 수도 있지만, 특별한 의미를 가진 데이터일 수도 있습니다."
  },
  {
    term: "결측치 (Missing Value)",
    definition: "데이터가 비어 있는 경우를 말합니다. 정확한 분석을 위해서는 비어 있는 값을 채우거나 해당 데이터를 제외하는 처리가 필요합니다."
  }
];

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000];