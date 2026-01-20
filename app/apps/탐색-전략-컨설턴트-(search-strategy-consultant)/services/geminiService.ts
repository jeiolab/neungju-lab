import { GoogleGenAI } from "@google/genai";
import { SimulationState, SimulationMetrics, AlgorithmType, Scenario } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConsultantReport = async (
  scenario: Scenario,
  state: SimulationState,
  metrics: Record<AlgorithmType, SimulationMetrics>
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      당신은 알고리즘 전략 컨설턴트입니다. 학생이 선택한 시나리오와 조건에 대해 분석 보고서를 작성해주세요.
      
      [시나리오]: ${scenario.title} ("${scenario.description}")
      [학생의 설정 조건]:
      - 데이터 크기: ${state.dataSize}/100
      - 정렬 여부: ${state.isSorted ? '정렬됨' : '정렬 안 됨'}
      - 데이터 변경 빈도: ${state.updateFreq}/100
      - 검색 빈도: ${state.searchFreq}/100
      - 학생의 선택 알고리즘: ${state.selectedAlgorithm === 'linear' ? '순차 탐색' : state.selectedAlgorithm === 'binary' ? '이진 탐색' : '정렬 후 이진 탐색'}

      [알고리즘별 효율성 점수 (100점 만점)]:
      - 순차 탐색 적합도: ${metrics.linear.totalSuitability.toFixed(0)}
      - 이진 탐색(현재 상태) 적합도: ${metrics.binary.totalSuitability.toFixed(0)}
      - 정렬+이진 탐색 적합도: ${metrics.sort_binary.totalSuitability.toFixed(0)}

      [요청사항]:
      1. 학생의 선택이 이 상황에 적절했는지 평가해주세요 (좋음/보통/나쁨).
      2. 왜 그런지 트레이드오프(속도 vs 정렬비용 vs 유지보수) 관점에서 3문장 이내로 설명해주세요.
      3. 따뜻하고 격려하는 톤으로 말해주세요.
      4. 반환 형식은 순수 텍스트로만 주세요.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "분석 결과를 생성하는 데 실패했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 컨설턴트가 현재 응답할 수 없습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getQuizFeedback = async (question: string, userAnswer: string, isCorrect: boolean): Promise<string> => {
    try {
        const prompt = `
            퀴즈 문제: "${question}"
            사용자 답안: "${userAnswer}"
            정답 여부: ${isCorrect ? "정답" : "오답"}

            이 사용자에게 한 문장으로 핵심 개념을 설명해주는 피드백을 주세요. 
            오답이라면 왜 틀렸는지, 정답이라면 왜 중요한 개념인지 알려주세요.
        `;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}
