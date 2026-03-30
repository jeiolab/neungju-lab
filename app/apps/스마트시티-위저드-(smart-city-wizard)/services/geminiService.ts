import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { ProjectData } from "../types";

export const getProjectFeedback = async (project: ProjectData): Promise<string> => {
  if (!(process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "")) {
    return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다. (개발 모드)";
  }

  const ai = new GoogleGenAI({ apiKey: (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") });
  
  const prompt = `
    당신은 친절하고 전문적인 IoT 및 스마트시티 프로젝트 코치 선생님입니다. 
    학생이 작성한 다음 프로젝트 설계서를 평가하고 피드백을 주세요.

    [프로젝트 정보]
    - 주제: ${project.title}
    - 이해관계자: ${project.stakeholders.join(", ")}
    - 디바이스: ${project.dnpc.device}
    - 네트워크: ${project.dnpc.network}
    - 플랫폼: ${project.dnpc.platform}
    - 서비스: ${project.dnpc.service}
    - 예상 위험: ${project.risks.join(", ")}
    - 학생의 생각(성찰): ${project.reflection}

    [요청 사항]
    1. 학생의 아이디어에서 훌륭한 점을 칭찬해주세요.
    2. DNPC 구조(디바이스-네트워크-플랫폼-서비스)의 연결이 논리적인지 평가해주세요.
    3. 보안이나 개인정보 보호 측면에서 추가로 고려해야 할 점 하나를 제안해주세요.
    4. 말투는 중학생에게 말하듯이 친절하고 격려하는 톤("~해요", "~좋아요")을 사용하세요.
    5. 전체 길이는 400자 이내로 요약해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 선생님이 잠시 쉬고 있어요. 잠시 후 다시 시도해주세요.";
  }
};