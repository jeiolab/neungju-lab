import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, Scenario } from '../types';
import { MAX_WEEKS } from '../constants';

const apiKey = process.env.API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const generateDynamicScenario = async (
  week: number,
  stats: GameStats,
  historySummary: string
): Promise<Scenario | null> => {
  if (!ai) return null;

  const prompt = `
    You are a game engine for a startup simulation "Security vs Growth".
    Current Week: ${week}/${MAX_WEEKS}.
    Stats: Security ${stats.security}, Users ${stats.users}, Budget ${stats.budget}, Happiness ${stats.happiness}.
    Recent History: ${historySummary}.

    Generate a dilemma scenario in KOREAN that forces a trade-off between Security, Growth (Users), Budget, and Happiness.
    The scenario should be relevant to a tech startup (e.g., cloud config, phishing, investor pressure, GDPR, new feature rush).
    
    Ensure all text fields (title, description, choices text, feedback) are in Korean.
    
    Return valid JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['dilemma'] },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  effect: {
                    type: Type.OBJECT,
                    properties: {
                      security: { type: Type.INTEGER },
                      users: { type: Type.INTEGER },
                      budget: { type: Type.INTEGER },
                      happiness: { type: Type.INTEGER }
                    }
                  }
                },
                required: ['id', 'text', 'feedback', 'effect']
              }
            }
          },
          required: ['id', 'title', 'description', 'choices']
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as Scenario;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const generateEndGameReport = async (
  finalStats: GameStats,
  historyLog: string
): Promise<string> => {
  if (!ai) return "AI 분석을 이용하려면 API 키가 필요합니다.";

  const prompt = `
    Analyze the player's performance as a Startup CEO.
    Final Stats: Security ${finalStats.security}, Users ${finalStats.users}, Budget ${finalStats.budget}, Happiness ${finalStats.happiness}.
    Game Log: ${historyLog}

    Provide a 2-paragraph summary of their leadership style in KOREAN. 
    Were they reckless? Too paranoid? Or a balanced leader?
    Critique their major decisions regarding information security.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "분석 실패.";
  } catch (error) {
    return "연결 오류로 리포트를 생성할 수 없습니다.";
  }
};
