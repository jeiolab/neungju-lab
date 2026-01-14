import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, Axis } from '../types';

const apiKey = process.env.API_KEY || '';
// Note: In a real app, we handle missing API keys gracefully. 
// Here we assume it's injected by the environment as per instructions.
const ai = new GoogleGenAI({ apiKey });

export const generateRandomScenario = async (): Promise<Scenario | null> => {
  try {
    const model = 'gemini-3-flash-preview';
    const response = await ai.models.generateContent({
      model,
      contents: "고등학교 1학년 수준의 정보 보호와 공유 딜레마 시나리오를 하나 만들어줘. JSON 형식으로 리턴해.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['school', 'community', 'disaster', 'data_service'] },
            idealValues: {
              type: Type.OBJECT,
              properties: {
                [Axis.PUBLIC_INTEREST]: { type: Type.NUMBER },
                [Axis.CONVENIENCE]: { type: Type.NUMBER },
                [Axis.PRIVACY]: { type: Type.NUMBER },
              },
              required: [Axis.PUBLIC_INTEREST, Axis.CONVENIENCE, Axis.PRIVACY]
            },
            minThresholds: {
               type: Type.OBJECT,
               properties: {
                 [Axis.PUBLIC_INTEREST]: { type: Type.NUMBER },
                 [Axis.CONVENIENCE]: { type: Type.NUMBER },
                 [Axis.PRIVACY]: { type: Type.NUMBER },
               }
            },
            policyOptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ['scope', 'consent', 'anonymization', 'access', 'duration'] },
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  isIdeal: { type: Type.BOOLEAN }
                },
                required: ['id', 'category', 'label', 'value', 'isIdeal']
              }
            },
            feedback: {
                type: Type.OBJECT,
                properties: {
                    balanced: { type: Type.STRING },
                    tooRisky: { type: Type.STRING },
                    tooRestrictive: { type: Type.STRING },
                },
                required: ['balanced', 'tooRisky', 'tooRestrictive']
            }
          },
          required: ['id', 'title', 'description', 'category', 'idealValues', 'policyOptions', 'feedback']
        }
      }
    });

    const scenario = JSON.parse(response.text || '{}');
    // Ensure IDs are unique-ish
    scenario.id = `gen_${Date.now()}`;
    return scenario as Scenario;

  } catch (error) {
    console.error("Failed to generate scenario:", error);
    return null;
  }
};

export const gradeEssay = async (question: string, answer: string): Promise<{ score: number, feedback: string }> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      질문: ${question}
      학생 답변: ${answer}
      
      위 답변을 10점 만점으로 채점하고, 2문장 내외의 피드백을 제공해줘.
      JSON 형식으로 { "score": number, "feedback": string } 리턴해.
    `;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ['score', 'feedback']
        }
      }
    });

    return JSON.parse(response.text || '{ "score": 0, "feedback": "채점 실패" }');
  } catch (error) {
    console.error("Failed to grade essay:", error);
    return { score: 0, feedback: "AI 연결 오류로 채점할 수 없습니다." };
  }
};

export const evaluateProposal = async (scenario: string, proposal: string): Promise<string> => {
  try {
     const model = 'gemini-3-flash-preview';
     const prompt = `
       상황: ${scenario}
       제안서: ${proposal}
       
       이 제안서가 정보 보호와 공유의 균형을 잘 맞추고 있는지 분석해서 3문장으로 조언해줘.
       긍정적인 점과 개선할 점을 포함해.
     `;
     const response = await ai.models.generateContent({
        model,
        contents: prompt
     });
     return response.text || "피드백을 생성할 수 없습니다.";
  } catch (error) {
    return "AI 서비스 연결에 실패했습니다.";
  }
}
