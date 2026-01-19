import { GoogleGenAI, Type } from "@google/genai";
import { AgentDesign, DailyChallenge, QuizQuestion } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-3-flash-preview';

export const getDailyChallenge = async (): Promise<DailyChallenge> => {
  if (!apiKey) {
    return {
      topic: "산불 감시 드론",
      description: "넓은 숲을 비행하며 화재를 조기에 발견하고 위치를 전송하는 드론을 설계해보세요."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "일상 생활이나 사회적 문제를 해결할 수 있는 창의적인 AI 에이전트 설계 주제를 하나 제안해줘. JSON 형식으로 topic과 description을 반환해.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            description: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyChallenge;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      topic: "심해 탐사 로봇",
      description: "사람이 갈 수 없는 깊은 바다속 생물을 연구하는 로봇을 설계하세요."
    };
  }
};

export const evaluateAgent = async (agent: AgentDesign): Promise<string> => {
  if (!apiKey) {
    return "API 키가 설정되지 않아 CTO의 정밀 분석을 건너뜁니다. (기본 로직 검증만 수행됨)";
  }

  const partsList = [
    ...agent.sensors.map(m => m.name),
    ...agent.data.map(m => m.name),
    ...agent.algorithm.map(m => m.name),
    ...agent.actuators.map(m => m.name)
  ].join(", ");

  const prompt = `
    당신은 AI 스타트업의 혁신적인 CTO입니다. 신입 개발자(사용자)가 다음과 같은 에이전트를 설계했습니다.
    
    이름: ${agent.name}
    목표: ${agent.goal}
    사용된 모듈: ${partsList}
    
    이 구성이 논리적으로 타당한지, 목표를 달성할 수 있는지 평가해주세요.
    1. 센서가 목표에 필요한 데이터를 수집할 수 있는지?
    2. 알고리즘이 적절한지?
    3. 액추에이터가 적절한 행동을 하는지?
    
    톤앤매너: 전문적이지만 격려하는 톤. 부족한 점이 있다면 구체적으로 지적하고, 잘한 점은 칭찬해주세요. 300자 이내로 요약해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "분석 결과를 생성하지 못했습니다.";
  } catch (error) {
    console.error("Evaluation Error:", error);
    return "서버 연결 문제로 CTO의 피드백을 불러올 수 없습니다.";
  }
};

export const generateQuiz = async (): Promise<QuizQuestion[]> => {
  // Return static fallback if API fails or is missing
  if (!apiKey) return [
    {
      id: 1,
      question: "지능 에이전트의 4단계 처리 과정 중 올바른 순서는?",
      options: ["행동-인식-추론-학습", "인식-학습-추론-행동", "추론-행동-인식-학습", "학습-인식-행동-추론"],
      correctAnswer: 1,
      explanation: "에이전트는 환경을 인식하고, 데이터를 통해 학습하며, 상황을 추론한 뒤 행동합니다."
    },
    {
      id: 2,
      question: "로봇 청소기가 먼지를 발견하기 위해 가장 필요한 센서는?",
      options: ["마이크", "먼지 센서/카메라", "스피커", "온도 센서"],
      correctAnswer: 1,
      explanation: "먼지의 위치와 양을 파악하기 위해서는 시각적 정보(카메라)나 입자 감지(먼지 센서)가 필요합니다."
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "AI 에이전트의 구성 요소(센서, 데이터, 알고리즘, 액추에이터)와 관련된 퀴즈 2문제를 생성해줘.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
              explanation: { type: Type.STRING }
            }
          }
        }
      }
    });

    if(response.text) return JSON.parse(response.text);
    throw new Error("Empty response");
  } catch (e) {
    return [
      {
        id: 1,
        question: "자율주행 자동차가 신호등을 인식하는 과정은?",
        options: ["액추에이터", "센서(카메라)", "모터", "스피커"],
        correctAnswer: 1,
        explanation: "신호등의 색상은 카메라 센서를 통해 인식됩니다."
      }
    ];
  }
}