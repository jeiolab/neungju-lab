import { GoogleGenAI } from "@google/genai";
import { DatasetStats } from "../types";

const initGenAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. Gemini features will use fallback text.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAnalysisReport = async (stats: DatasetStats): Promise<string> => {
  const ai = initGenAI();
  
  // Fallback if no API key or error
  const fallbackMessage = `
    ### 분석 보고서
    **품질 점수:** ${stats.qualityScore}%
    
    데이터 정제는 매우 중요합니다! ${stats.fixedErrors}개의 오류를 수정함으로써, 이 데이터로 학습할 AI 모델의 신뢰성을 크게 높였습니다. 
    남은 오류(${stats.remainingErrors}개)가 여전히 예측에 약간의 영향을 줄 수 있지만, 아주 잘 하셨습니다!
  `;

  if (!ai) return fallbackMessage;

  try {
    const prompt = `
      시니어 데이터 사이언티스트 멘토로서 행동해줘.
      학생이 방금 데이터 전처리 시뮬레이션을 마쳤어.
      
      학생의 기록:
      - 초기 오류 개수: ${stats.initialErrors}
      - 수정된 오류 개수: ${stats.fixedErrors}
      - 남은 오류 개수: ${stats.remainingErrors}
      - 최종 품질 점수: ${stats.qualityScore}/100
      - 소요 시간: ${stats.timeTaken}초

      한국어로 간결하고 격려가 담긴 교육적인 피드백 보고서를 작성해줘 (최대 150단어).
      만약 오류를 남겨둔 채로(전처리 전) AI를 학습시켰다면 어떤 문제가 발생했을지, 그리고 깨끗한 데이터(전처리 후)가 왜 중요한지 설명해줘.
      "이상치(Outliers)", "편향(Bias)", "노이즈(Noise)" 같은 용어를 적절히 사용해줘.
      마크다운 형식으로 작성해줘.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || fallbackMessage;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return fallbackMessage;
  }
};
