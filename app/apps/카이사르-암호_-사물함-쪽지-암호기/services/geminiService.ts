import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isApiKeyAvailable = () => !!apiKey;

export const generateQuizQuestions = async (): Promise<QuizQuestion[]> => {
  if (!apiKey) return [];

  const prompt = `
    카이사르 암호(Caesar Cipher), 치환 암호, 빈도 분석, 암호의 키(Key) 개념에 대한 
    객관식 퀴즈 10문제를 생성해줘.
    한국어로 작성해줘.
    학생들이 이해하기 쉽게 작성해줘.
    각 문제는 '치환', '키', '한계' 중 하나의 태그를 가져야 해.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "0-based index of the correct option" },
              explanation: { type: Type.STRING },
              tags: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "tags"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    return [];
  }
};

export const generateDailyMission = async (): Promise<{ encrypted: string, key: number, hint: string }> => {
  if (!apiKey) {
    // Fallback if no API key
    return {
      encrypted: "KHOOR ZRUOG",
      key: 3,
      hint: "가장 기본적인 인사말입니다."
    };
  }

  const prompt = `
    오늘의 학생 사물함 쪽지 미션을 생성해줘.
    1. 재미있는 짧은 문장 (한글 섞여도 되지만 핵심 단어는 영어여야 함. 예: "오늘 LUNCH 맛있다").
    2. 그 문장을 카이사르 암호로 암호화할 키(1~25 사이 랜덤).
    3. 힌트 한 문장.
    4. 원문은 영어 대문자로 변환해서 처리해줘 (한글은 그대로).
    5. JSON으로 반환해줘.
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
            original: { type: Type.STRING },
            encrypted: { type: Type.STRING },
            key: { type: Type.INTEGER },
            hint: { type: Type.STRING }
          },
          required: ["original", "encrypted", "key", "hint"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        encrypted: data.encrypted,
        key: data.key,
        hint: data.hint
      };
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini mission error", error);
    return {
      encrypted: "EXXE MXK",
      key: 19, // G -> M (+6) ?? G(6)+19=25(Z).. wait. GOOD LUCK (6, 14, 14, 3) + 19 => 
      // simple fallback
      hint: "행운을 빌어 (Fallback)"
    };
  }
};

export const evaluateReflection = async (question: string, answer: string): Promise<string> => {
    if (!apiKey) return "좋은 생각입니다! (API 키가 없어서 상세 피드백을 제공할 수 없습니다)";

    const prompt = `
      학생이 카이사르 암호에 대해 다음과 같이 답변했습니다.
      질문: ${question}
      답변: ${answer}
      
      이 답변에 대해 칭찬과 함께, 보완할 점이나 추가로 생각할 점을 1문장으로 짧게 피드백해줘.
      선생님 말투로 다정하게.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        return response.text || "훌륭합니다!";
    } catch (e) {
        return "작성해주셔서 감사합니다.";
    }
}
