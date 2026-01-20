import { GoogleGenAI, Type } from "@google/genai";
import { GraphData, SimulationResult, Node, FeedbackData } from "../types";

const initGenAI = () => {
  if (!process.env.API_KEY) return null;
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateCoachFeedback = async (
  graph: GraphData,
  result: SimulationResult,
  selectedNodeLabel: string
): Promise<FeedbackData | null> => {
  const ai = initGenAI();
  if (!ai) {
    console.warn("API Key not found, skipping AI feedback.");
    return null;
  }

  // Simplify graph for prompt to save tokens
  const simpleNodes = graph.nodes.map(n => n.label).join(", ");
  const simpleEdges = graph.edges.map(e => {
    const s = typeof e.source === 'object' ? (e.source as Node).label : e.source;
    const t = typeof e.target === 'object' ? (e.target as Node).label : e.target;
    return `${s}-${t}(${e.type})`;
  }).join(", ");

  const prompt = `
    Context: 너는 '그래프 모델링 코치'야. 학생이 소셜 네트워크(동아리 홍보) 문제를 그래프로 모델링하고 있어.
    Scenario: 학생은 동아리 홍보 게시물이 가장 많이 퍼질 수 있는 시작 친구를 찾고 있어.
    
    Data:
    - 선택한 시작 친구: ${selectedNodeLabel}
    - 총 도달 인원: ${result.totalReach} 명
    - 전체 노드: ${simpleNodes}
    - 전체 관계: ${simpleEdges}
    
    Task: 학생에게 줄 3가지 핵심 피드백을 한국어로 작성해줘. 말투는 친절하고 격려하는 톤으로(해요체).
    
    JSON 형식으로 다음 3가지를 반환해:
    1. whyGood: 왜 이 친구가 유리한지 또는 불리한지 (중심성이나 연결 수 언급)
    2. bottleneck: 어떤 관계(예: 반 친구, 친구의 친구)가 확산에 병목이 되었는지
    3. suggestion: 다음 실험을 위한 제안 (예: "다른 친구를 선택해봐" 또는 "친한 친구 관계의 확률을 높여봐")
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            whyGood: { type: Type.STRING },
            bottleneck: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["whyGood", "bottleneck", "suggestion"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as FeedbackData;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};