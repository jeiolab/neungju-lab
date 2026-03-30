import { GoogleGenAI, Type } from "@/lib/genai-browser-shim";

const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : ""); // Ideally handled via secure proxy in prod, but per instructions using env

const ai = new GoogleGenAI({ apiKey });

export interface EvaluationResult {
  rating: number; // 1 to 3
  feedback: string;
  summary: string;
}

export const evaluateIoTDesign = async (
  location: string,
  problem: string,
  sensor: string,
  actuator: string,
  logic: string
): Promise<EvaluationResult> => {
  if (!apiKey) {
    // Fallback if no API key is present for demo purposes
    return {
      rating: 3,
      feedback: "API 키가 설정되지 않아 기본 평가를 반환합니다. 설계가 논리적으로 보입니다.",
      summary: "API 키 미설정 모드"
    };
  }

  try {
    const prompt = `
      당신은 고등학교 정보 교과 선생님이자 IoT 전문가입니다.
      학생이 다음과 같은 IoT 시스템을 설계했습니다.
      
      - 장소: ${location}
      - 문제 상황: ${problem}
      - 선택한 센서: ${sensor}
      - 선택한 출력 장치(액추에이터): ${actuator}
      - 작동 규칙: ${logic}

      이 설계가 문제 해결에 적합한지 1점(부적합)에서 3점(매우 적합)으로 평가해주세요.
      예를 들어, 소음 문제에 온도 센서를 쓰면 1점입니다.
      논리적이고 실현 가능하다면 3점입니다.
      
      학생에게 줄 피드백을 친절하게 작성해주고, 수행평가 제출용 요약 텍스트도 만들어주세요.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rating: { type: Type.INTEGER, description: "1 to 3 stars" },
            feedback: { type: Type.STRING, description: "Detailed feedback for the student" },
            summary: { type: Type.STRING, description: "A formal summary for school report submission" }
          },
          required: ["rating", "feedback", "summary"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as EvaluationResult;

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      rating: 1,
      feedback: "AI 평가 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      summary: "평가 오류"
    };
  }
};