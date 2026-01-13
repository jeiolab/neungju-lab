import { GoogleGenAI, Type } from "@google/genai";
import { Scenario, QuizQuestion } from '../types';

// Ensure API Key exists
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API Key is missing!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

const SYSTEM_INSTRUCTION_SCENARIO = `
You are a cybersecurity expert creating training data for a "Smishing Defense" simulation game.
Generate realistic smartphone message scenarios.
They can be Smishing (Phishing/Scam) or Legitimate (Safe) messages.
Use Korean language for the content.
Common themes: Delivery, Wedding invitations, Government notices, Family emergencies, Coupons.
For Smishing, include subtle cues (typos, weird URLs like data-go.kr instead of data.go.kr, urgency).
For Safe, make them look official but boring, or genuine personal texts.
`;

export const generateScenario = async (): Promise<Scenario> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one realistic smartphone message scenario (either smishing or safe).",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_SCENARIO,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sender: { type: Type.STRING, description: "Sender name or number" },
            content: { type: Type.STRING, description: "The message body text" },
            type: { type: Type.STRING, enum: ['SMS', 'DM', 'EMAIL', 'KAKAO'] },
            isSmishing: { type: Type.BOOLEAN },
            explanation: { type: Type.STRING, description: "Detailed explanation of why it is safe or unsafe" },
            clues: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of specific clues user should have noticed" 
            },
            difficulty: { type: Type.STRING, enum: ['EASY', 'MEDIUM', 'HARD'] }
          },
          required: ['sender', 'content', 'type', 'isSmishing', 'explanation', 'clues', 'difficulty']
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      ...data,
      id: crypto.randomUUID()
    };

  } catch (error) {
    console.error("Gemini API Error (Scenario):", error);
    // Fallback scenario in case of error
    return {
      id: 'fallback-1',
      sender: 'WEB발신 [CJ대한통운]',
      content: '고객님 택배 주소지 불명으로 배송이 지연되고 있습니다. 주소 확인 부탁드립니다. URL: han.gl/xyz123',
      type: 'SMS',
      isSmishing: true,
      explanation: '택배사는 단축 URL(han.gl 등)을 통해 주소 변경을 요구하지 않습니다.',
      clues: ['불명확한 단축 URL', '개인정보 입력 유도'],
      difficulty: 'EASY'
    };
  }
};

const SYSTEM_INSTRUCTION_QUIZ = `
Create a cybersecurity quiz question based on smishing, phishing, and smartphone security.
Language: Korean.
`;

export const generateQuizQuestion = async (): Promise<QuizQuestion> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one multiple choice quiz question about smartphone security.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_QUIZ,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ['question', 'options', 'correctIndex', 'explanation']
        }
      }
    });

    return JSON.parse(response.text || '{}');

  } catch (error) {
    console.error("Gemini API Error (Quiz):", error);
    return {
      question: "스미싱 예방을 위해 가장 적절한 조치는?",
      options: ["출처를 알 수 없는 링크 클릭 안 하기", "비밀번호를 '1234'로 설정하기", "백신 프로그램 끄기", "모든 문자 삭제하기"],
      correctIndex: 0,
      explanation: "출처가 불분명한 URL은 절대 클릭하지 않는 것이 스미싱 예방의 첫걸음입니다."
    };
  }
};

export const chatWithConsultant = async (history: string[], message: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `User: ${message}`,
            config: {
                systemInstruction: "You are a friendly White Hat Hacker security consultant. Answer user questions about smartphone security, hacking, and what to do if hacked. Keep answers concise and helpful. Language: Korean."
            }
        });
        return response.text || "보안 서버 연결 실패. 다시 시도해주세요.";
    } catch (e) {
        return "일시적인 오류입니다. 잠시 후 다시 질문해주세요.";
    }
}
