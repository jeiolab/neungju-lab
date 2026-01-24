import { GoogleGenAI } from "@google/genai";
import { CodeBlock } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getHintFromGemini = async (
  currentBlocks: CodeBlock[],
  mission: string
): Promise<string> => {
  if (!ai) {
    return "AI 힌트 기능을 사용하려면 API 키가 필요합니다. 하지만 스스로 생각해보는 과정이 훌륭해요!";
  }
  try {
    const blockNames = currentBlocks.map(b => b.label).join(' -> ');
    
    const prompt = `
      You are a coding tutor for elementary/middle school students using a block coding app.
      
      Mission: "${mission}"
      
      The student has arranged the blocks in this order:
      ${blockNames || "(No blocks placed yet)"}
      
      The logic seems incorrect or incomplete. 
      Analyze the sequence. Is the sensor read before the condition? Is the condition logically linked to the action?
      
      Provide a short, encouraging hint in Korean (Hangul) under 2 sentences. 
      Do not give the full answer directly, but guide them to the missing step or wrong order.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "힌트를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "현재 AI 튜터와 연결할 수 없습니다. 블록 순서를 다시 확인해보세요!";
  }
};

export const getSecurityScenario = async (topic: string): Promise<string> => {
  if (!ai) {
    return "AI 시나리오 기능을 사용하려면 API 키가 필요합니다. 하지만 보안에 대해 스스로 생각해보는 과정이 중요해요!";
  }
  try {
    const prompt = `
      Topic: Smart Classroom Security
      Question: "${topic}"
      
      Explain briefly (in Korean, max 300 characters) what could happen in a funny but educational way if a hacker compromised the classroom's IoT system.
      Focus on chaos (lights blinking, fans spinning too fast) but end with a safety tip.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "시나리오를 생성하지 못했습니다.";
  } catch (error) {
    return "보안 시나리오를 불러올 수 없습니다.";
  }
};
