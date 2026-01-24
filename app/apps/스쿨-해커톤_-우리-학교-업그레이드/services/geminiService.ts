import { GoogleGenAI, Type } from "@google/genai";
import { Project } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not defined.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getProblemHints = async (problemText: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI를 사용할 수 없습니다. 문제를 해결하기 위해 어떤 데이터가 필요할지 고민해보세요.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Problem: "${problemText}".
      Role: You are an IoT invention coach for students in Korea.
      Task: Briefly suggest 2 types of sensors and 1 type of output that could solve this. 
      Format: Respond in Korean. Keep it encouraging, simple, and under 30 words.`,
    });
    return response.text || "힌트를 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "좋은 문제네요! 이 문제가 발생할 때 주변 환경이 어떻게 변하는지 생각해보세요.";
  }
};

export const evaluateProject = async (project: Project): Promise<{ feedback: string; score: number }> => {
  const ai = getAiClient();
  if (!ai) return { feedback: "프로젝트가 저장되었습니다! (AI 평가 불가)", score: 85 };

  try {
    const prompt = `
      Evaluate this student IoT project:
      Title: ${project.title}
      Problem: ${project.problem}
      Sensors: ${project.sensors.map(s => s.name).join(', ')}
      Actuators: ${project.actuators.map(a => a.name).join(', ')}
      Logic: ${project.logic.map(l => `만약 ${l.conditionSensorId} ${l.operator} ${l.threshold} 라면 ${l.actionActuatorId} 작동`).join('; ')}

      Task:
      1. Give a "Logical Validity Score" out of 100 based on whether the sensors/actuators actually solve the problem.
      2. Provide short, constructive feedback (max 2 sentences) in Korean.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
          },
          required: ["score", "feedback"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text");
    const json = JSON.parse(text);
    return { feedback: json.feedback, score: json.score };

  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return { feedback: "흥미로운 설계네요! 센서가 문제를 정확히 감지할 수 있을지 다시 한번 확인해보세요.", score: 80 };
  }
};

export const generateSideEffects = async (projectSummary: string): Promise<string[]> => {
  const ai = getAiClient();
  if (!ai) return ["사생활 침해 문제는 없을까요?", "유지 보수 비용은 얼마나 들까요?", "오작동하면 어떻게 되나요?"];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Project: ${projectSummary}.
      List 3 potential negative side effects or ethical issues (Critical Thinking) for this school technology.
      Format: Return ONLY a JSON array of strings in Korean. Example: ["사생활 침해 우려", "소음 발생 가능성"]`,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if(!text) return [];
    return JSON.parse(text);
  } catch (e) {
    return ["정전이 되면 어떻게 되나요?", "학생들이 이 시스템을 좋아할까요?", "설치 비용이 너무 비싸진 않을까요?"];
  }
};