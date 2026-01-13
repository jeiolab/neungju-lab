import { GoogleGenAI } from "@google/genai";
import { ProjectStage, Role } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getSimulationFeedback = async (
  history: { stage: ProjectStage; choice: Role }[],
  finalEfficiency: number,
  finalRisk: number
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API Key가 설정되지 않아 상세 피드백을 불러올 수 없습니다. (데모 모드)";

  const prompt = `
    당신은 첨단 프로젝트(예: 반도체 공정, 신재생 에너지)의 베테랑 프로젝트 매니저(PM)입니다.
    사용자가 프로젝트의 각 단계(기획, 설계, 검증, 생산)에서 '인간', 'AI', '협업' 중 누구를 주체로 할지 결정했습니다.
    
    [결과 데이터]
    - 최종 효율성: ${finalEfficiency}/100
    - 최종 리스크: ${finalRisk}/100
    - 선택 내역: ${history.map((h) => `${h.stage}: ${h.choice}`).join(", ")}

    [역할]
    위 결과를 바탕으로 사용자에게 피드백을 제공하세요.
    1. 효율성과 리스크 점수를 바탕으로 프로젝트 성공 여부를 판단해주세요. (리스크가 40 이상이면 위험, 70 이상이면 실패)
    2. 각 단계별 선택(특히 인간의 창의성 vs AI의 효율성 vs 협업의 균형)에 대해 칭찬하거나 조언해주세요.
    3. 톤은 전문적이지만 격려하는 스타일로 작성해주세요.
    4. 300자 이내로 요약해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "피드백을 생성하는 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 서비스 연결 상태가 좋지 않아 피드백을 생성할 수 없습니다.";
  }
};

export const getDiscussionInsight = async (topic: string, stance: 'PRO' | 'CON'): Promise<string> => {
    const ai = getClient();
    if (!ai) return "API Key가 필요합니다.";

    const prompt = `
      주제: "AI 의존도가 너무 높아지면 인간의 능력은 퇴화할까?"
      
      사용자가 선택한 입장: ${stance === 'PRO' ? '찬성 (퇴화한다)' : '반대 (퇴화하지 않는다/진화한다)'}
      사용자의 구체적인 관심사: "${topic}"

      이 입장을 뒷받침하는 논리적이고 설득력 있는 근거 3가지를 짧게(항목별 1문장) 제시해주세요.
      교육적인 톤을 유지하세요.
    `;

    try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });
        return response.text || "인사이트를 가져올 수 없습니다.";
    } catch (error) {
        return "일시적인 오류가 발생했습니다.";
    }
}
