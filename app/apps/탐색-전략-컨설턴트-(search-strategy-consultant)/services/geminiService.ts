import { SimulationState, SimulationMetrics, AlgorithmType, Scenario } from '../types';

export const getConsultantReport = async (
  scenario: Scenario,
  state: SimulationState,
  metrics: Record<AlgorithmType, SimulationMetrics>
): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/search-strategy-consultant/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario, state, metrics }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text || "분석 결과를 생성하는 데 실패했습니다.";
    } else {
      console.error("API Error:", data.error);
      return data.text || "AI 컨설턴트가 현재 응답할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "AI 컨설턴트가 현재 응답할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getQuizFeedback = async (question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
  try {
    const response = await fetch('/api/gemini/search-strategy-consultant/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer, isCorrect }),
    });
    const data = await response.json();
    if (response.ok) {
      return data.text || "";
    } else {
      console.error("API Error:", data.error);
      return data.text || "";
    }
  } catch (error) {
    console.error("Network Error:", error);
    return "";
  }
}
