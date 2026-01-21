import { DataRow, GlossaryTerm } from './types';

// --- REVIEWS DATA ---
const RESTAURANTS = [
  "파스타 하우스", "버거 킹덤", "스시 월드", "타코 벨", "피자 헛", 
  "비건 조이", "스테이크 하우스", "국밥 천국", "김밥 나라", "라멘 트럭",
  "카페 델루나", "치킨 공주", "마라탕 맛집", "쌀국수 미식", "디저트 39",
  "삼겹살 파티", "횟집 바다", "인도 커리", "멕시코 타코", "베트남 반미"
];

const REVIEWS = [
  "정말 맛있어요!", "맛은 괜찮았어요.", "생선이 신선해요.", "서비스가 빨라요.",
  "너무 기름져요.", "건강한 선택!", "고기 질이 좋아요.", "양이 많아서 좋아요.",
  "재방문 의사 있습니다.", "직원이 친절해요.", "음식이 식어서 나왔어요.",
  "분위기가 깡패!", "가성비 최고입니다.", "조금 짰어요.", "웨이팅이 너무 길어요."
];

// --- SMART FARM DATA ---
const ZONES = ["A-1 구역", "A-2 구역", "B-1 구역", "B-2 구역", "C-1 구역", "입구 쪽", "중앙 홀"];
const STATUSES = ["정상", "안정", "양호", "가동 중"];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const generateReviewDataset = (): DataRow[] => {
  const selectedRestaurants: string[] = [];
  while (selectedRestaurants.length < 7) {
    const r = getRandomItem(RESTAURANTS);
    if (!selectedRestaurants.includes(r)) selectedRestaurants.push(r);
  }

  const baseRows: DataRow[] = selectedRestaurants.map((restaurant, idx) => ({
    id: idx + 1,
    restaurant: restaurant,
    rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0 - 5.0
    age: getRandomInt(20, 50),
    review: getRandomItem(REVIEWS)
  }));

  // Errors for Reviews
  baseRows[0].rating = null; // Missing
  baseRows[1].age = null; // Missing
  baseRows[2].age = getRandomInt(150, 300); // Outlier
  baseRows[3].rating = 10.0; // Outlier
  
  const duplicateRow = { ...baseRows[6] }; 
  const finalDataset = [...baseRows, duplicateRow];

  for (let i = finalDataset.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalDataset[i], finalDataset[j]] = [finalDataset[j], finalDataset[i]];
  }

  return finalDataset;
};

export const generateSmartFarmDataset = (): DataRow[] => {
  const selectedZones: string[] = [];
  while (selectedZones.length < 7) {
    const z = getRandomItem(ZONES);
    if (!selectedZones.includes(z)) selectedZones.push(z);
  }

  const baseRows: DataRow[] = selectedZones.map((zone, idx) => ({
    id: idx + 1,
    location: zone,
    temperature: parseFloat((Math.random() * 5 + 20).toFixed(1)), // 20.0 - 25.0
    humidity: getRandomInt(40, 60),
    status: getRandomItem(STATUSES)
  }));

  // Errors for Smart Farm
  baseRows[0].temperature = null; // Missing Temp
  baseRows[1].humidity = null; // Missing Humidity
  baseRows[2].temperature = parseFloat((Math.random() * 50 + 150).toFixed(1)); // Outlier Temp (e.g., 180C)
  baseRows[3].humidity = 999; // Outlier Humidity
  
  const duplicateRow = { ...baseRows[6] };
  const finalDataset = [...baseRows, duplicateRow];

  for (let i = finalDataset.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [finalDataset[i], finalDataset[j]] = [finalDataset[j], finalDataset[i]];
  }
  
  return finalDataset;
};

// Default for types, but unused
export const INITIAL_DATASET: DataRow[] = generateReviewDataset();

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: "웹 크롤러 (Web Crawler)",
    definition: "인터넷 웹사이트를 자동으로 탐색하여 데이터를 수집하는 봇 프로그램입니다.",
    category: "Collection"
  },
  {
    term: "센서 (Sensor)",
    definition: "온도나 압력 같은 물리적인 성질을 감지하고 측정하여 기록하는 장치입니다.",
    category: "Collection"
  },
  {
    term: "전처리 (Preprocessing)",
    definition: "수집한 날것의 데이터(Raw Data)를 분석에 적합하도록 깨끗하게 다듬는 과정입니다.",
    category: "Preprocessing"
  },
  {
    term: "결측치 (Missing Value)",
    definition: "데이터가 비어있거나 정의되지 않은 값(Null)입니다. 삭제하거나 다른 값으로 채워 넣어야 합니다.",
    category: "Preprocessing"
  },
  {
    term: "이상치 (Outlier)",
    definition: "다른 데이터와 비교했을 때 유독 튀는 값입니다. 주로 오류일 가능성이 높습니다.",
    category: "Preprocessing"
  },
  {
    term: "편향 (Bias)",
    definition: "데이터의 오류로 인해 AI 모델이 불공정하거나 부정확한 결과를 내놓는 현상입니다.",
    category: "Analysis"
  }
];
