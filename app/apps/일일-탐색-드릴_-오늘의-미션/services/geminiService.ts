import { DailyMission } from "../types";

// API 호출 실패 시 사용할 기본 미션 (한국어)
const FALLBACK_MISSION: DailyMission = {
  date: new Date().toDateString(),
  title: "역사 위인 찾기",
  description: "가나다순으로 정렬된 위인 명단에서 '이순신' 장군님을 찾아보세요.",
  datasetType: 'sorted',
  targetItem: "이순신",
  dataset: ["강감찬", "광개토대왕", "김유신", "세종대왕", "이순신", "장영실", "정약용"],
  optimalAlgorithm: 'binary',
  codeBlocks: [
    { id: '1', text: 'low = 0, high = n - 1', order: 0 },
    { id: '2', text: 'while (low <= high):', order: 1 },
    { id: '3', text: 'mid = (low + high) / 2', order: 2 },
    { id: '4', text: 'if (arr[mid] == target) return mid', order: 3 },
    { id: '5', text: 'else if (arr[mid] < target) low = mid + 1', order: 4 },
    { id: '6', text: 'else high = mid - 1', order: 5 },
    { id: '7', text: 'return -1', order: 6 },
  ],
  quizQuestion: "이진 탐색(Binary Search)을 사용하기 위한 필수 조건은 무엇인가요?",
  quizAnswer: "데이터가 정렬되어 있어야 한다.",
  theoryContent: "이진 탐색(Binary Search)은 **정렬된** 데이터에서 중앙값과 찾으려는 값을 비교하여 탐색 범위를 절반씩 줄여나가는 효율적인 알고리즘입니다. 순차 탐색보다 훨씬 적은 횟수로 값을 찾을 수 있습니다."
};

export const generateDailyMission = async (dateStr: string): Promise<DailyMission> => {
  try {
    const response = await fetch('/api/gemini/daily-search/mission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dateStr }),
    });
    const data = await response.json();
    if (response.ok) {
      return {
        ...data,
        date: dateStr,
      };
    } else {
      console.error("API Error:", data.error);
      return FALLBACK_MISSION;
    }
  } catch (error) {
    console.error("Network Error:", error);
    return FALLBACK_MISSION;
  }
};

export const getThinkContent = async (topic: string): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/daily-search/think', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text;
    } else {
      console.error("API Error:", data.error);
      return data.text || "내용을 불러올 수 없습니다.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "생각해볼 문제에 대한 답을 불러오는 중 오류가 발생했습니다.";
  }
}