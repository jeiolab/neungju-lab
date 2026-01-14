import { GoogleGenAI } from "@google/genai";
import { QuizDifficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateChallengeAnswer = async (question: string, userAnswer: string) => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      당신은 고등학교 정보 보호 과목 선생님입니다.
      
      질문: "${question}"
      학생 답변: "${userAnswer}"
      
      이 답변이 보안 관점에서 타당한지 평가해주세요.
      다음 JSON 형식으로만 응답하세요.
      {
        "isCorrect": boolean,
        "score": number, // 0-100
        "feedback": "2~3문장의 구체적인 피드백 (친절하고 교육적인 말투)"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini Evaluation Error", error);
    return {
      isCorrect: false,
      score: 0,
      feedback: "시스템 오류로 채점할 수 없습니다. 잠시 후 다시 시도해주세요."
    };
  }
};

export const generateQuizQuestion = async (difficulty: QuizDifficulty, avoidIds: string[]) => {
    try {
        const model = 'gemini-3-flash-preview';
        const prompt = `
          고등학교 1학년 수준의 정보보호/SNS해킹방어 관련 퀴즈를 1개 만들어주세요.
          난이도: ${difficulty}
          
          형식:
          ${difficulty === 'EASY' ? '객관식 (4지선다)' : difficulty === 'NORMAL' ? '단답형 주관식' : '서술형 (논술)'}

          다음 JSON 스키마를 따라주세요:
          {
            "id": "unique_id_${Date.now()}",
            "difficulty": "${difficulty}",
            "question": "질문 내용",
            "options": ["보기1", "보기2", "보기3", "보기4"], // 객관식일 경우만
            "correctAnswer": "정답",
            "explanation": "해설"
          }
          
          이미 출제된 문제와 겹치지 않게 참신한 상황(SNS, 학교 Wi-Fi, 게임 계정 등)을 설정해주세요.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

         const text = response.text;
         if (!text) throw new Error("No response");
         return JSON.parse(text);

    } catch (error) {
        console.error("Gemini Gen Error", error);
        return null;
    }
}