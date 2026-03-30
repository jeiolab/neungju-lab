import { GoogleGenAI } from "@/lib/genai-browser-shim";
import { Scenario, DataCondition, TaskType, ModelType } from '../types';

// Safely initialize the client.
// In a real app, ensure (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : "") is available.
// For this demo structure, we assume the environment is set up correctly as per instructions.
const apiKey = (process.env.NEXT_PUBLIC_LLM_READY === "1" ? "server" : ""); 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCoachFeedback = async (
  scenario: Scenario,
  userWeights: { acc: number; exp: number; cost: number },
  dataCondition: DataCondition,
  selectedTask: TaskType,
  selectedModel: ModelType,
  score: number
): Promise<{ strength: string; weakness: string; recommendation: string }> => {
  
  if (!ai) {
    return {
      strength: "AI 코치 연결 실패: API 키를 확인해주세요.",
      weakness: "기본 로직으로 대체합니다.",
      recommendation: "로컬 점수를 참고하여 다시 시도해보세요."
    };
  }

  const prompt = `
    Role: You are a friendly Machine Learning "Decision Coach" for a student.
    Context: The student played a simulation game "Model Selection Trade-off".
    
    Scenario: ${scenario.title} (${scenario.description})
    Target Weights (0-100): Accuracy=${userWeights.acc}, Explainability=${userWeights.exp}, Cost/Time=${userWeights.cost}.
    Data Condition: ${dataCondition}.
    Student Choice: Task=${selectedTask}, Model=${selectedModel}.
    Calculated Score: ${score}/100.

    Instruction:
    Provide feedback in Korean. Be encouraging but realistic about trade-offs.
    Return ONLY a JSON object with these keys: "strength", "weakness", "recommendation".
    - strength: What did they do well? (e.g., matching task to scenario, or respecting constraints).
    - weakness: What is the downside? (e.g., ignored data quality, model too simple/complex).
    - recommendation: What should they change next time?
    Do not use Markdown code blocks. Just the raw JSON string.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      strength: "피드백 생성 중 오류가 발생했습니다.",
      weakness: "네트워크 상태를 확인해주세요.",
      recommendation: "다시 시도해주세요."
    };
  }
};

export const evaluateThought = async (
  scenarioTitle: string,
  userThought: string
): Promise<string> => {
  if (!ai) return "API 키가 설정되지 않아 AI 피드백을 받을 수 없습니다.";

  const prompt = `
    Role: A teacher grading a student's short essay on machine learning.
    Topic: ${scenarioTitle}
    Student Answer: ${userThought}
    
    Instruction:
    Evaluate the student's answer in Korean.
    If it's logical, praise them. If there's a misconception, kindly correct it.
    Keep it under 3 sentences.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
    });
    return response.text || "피드백을 불러올 수 없습니다.";
  } catch (e) {
    return "오류가 발생했습니다.";
  }
};