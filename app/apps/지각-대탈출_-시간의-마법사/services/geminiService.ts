import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { Task } from '../types';

const getClient = () => {
  const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "");
  if (!apiKey) {
    console.warn("API Key is missing. Set OPENROUTER_API_KEY and NEXT_PUBLIC_LLM_READY in .env.local.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getSimulationFeedback = async (
  tasks: Task[],
  totalTime: number,
  success: boolean
): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않아 AI 조언을 받을 수 없습니다.";

  const scheduleSummary = tasks.map(t => 
    `- ${t.name}: ${t.currentDuration}분 (병렬: ${t.isParallel ? 'O' : 'X'})`
  ).join('\n');

  const prompt = `
    당신은 알고리즘과 시간 관리 전문가인 '시간의 마법사'입니다.
    사용자가 방금 등교 준비 시뮬레이션을 완료했습니다.
    
    [결과]
    - 성공 여부: ${success ? '지각 면함!' : '지각함...'}
    - 총 소요 시간: ${totalTime}분 (제한시간 60분)
    
    [사용자의 스케줄]
    ${scheduleSummary}

    알고리즘적 관점(스케줄링, 병렬 처리, 트레이드오프)에서 사용자의 전략을 짧게 평가하고, 
    어떻게 하면 더 효율적이었을지, 혹은 잘한 점이 무엇인지 3문장 이내로 조언해주세요.
    말투는 친절하고 위트있는 선생님처럼 해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "조언을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 연결에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};

export const getThinkFeedback = async (userAnswer: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "API 키가 설정되지 않았습니다.";

  const prompt = `
    질문: "라면을 끓일 때 물 끓이기와 스프 넣기를 동시에 할 수 있을까? 혹은 물을 끓이면서 다른 재료를 손질하는 것은 어떨까?"
    
    이 질문은 컴퓨터 과학의 '병렬 처리(Parallel Processing)'와 '의존성(Dependency)'에 대한 비유입니다.
    
    사용자의 답변: "${userAnswer}"
    
    사용자의 답변이 논리적인지, 병렬 처리의 개념을 잘 이해하고 있는지 판단하여 피드백을 주세요. 
    컴퓨터 과학 용어(프로세스, 쓰레드, 블로킹 등)를 아주 쉽게 섞어서 설명해주면 좋습니다.
    300자 이내로 답변하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "답변을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류가 발생했습니다.";
  }
};
