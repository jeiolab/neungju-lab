import { GoogleGenAI, Type } from "@google/genai";
import { Mission, PipelineStep, RawDataField, Tool, EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-flash-preview';

export const evaluatePipeline = async (
  mission: Mission,
  pipeline: PipelineStep[],
  tools: Tool[]
): Promise<EvaluationResult> => {
  try {
    const pipelineDescription = pipeline.map(step => {
      const fieldName = mission.data.find(d => d.id === step.fieldId)?.name || step.fieldId;
      const toolName = tools.find(t => t.id === step.toolId)?.name || step.toolId;
      return `${fieldName} -> ${toolName}`;
    }).join(", ");

    const dataSnapshot = JSON.stringify(mission.data.reduce((acc, curr) => ({...acc, [curr.name]: curr.value}), {}));

    const prompt = `
      Act as a Data Privacy Officer. Evaluate this data processing pipeline.
      
      Mission Context: ${mission.context}
      Original Data: ${dataSnapshot}
      Applied Pipeline: ${pipelineDescription || "No processing applied"}
      
      Requirements:
      - Safety Goal: ${mission.requiredSafety}
      - Utility Goal: ${mission.requiredUtility}
      
      Tasks:
      1. Generate the hypothetical transformed data based on the pipeline.
      2. Score Safety (0-100). Higher is better (less re-identification risk).
      3. Score Utility (0-100). Higher is better (useful for the mission context).
      4. Provide brief feedback (Korean).
      5. Determine success based on goals.

      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safetyScore: { type: Type.NUMBER },
            utilityScore: { type: Type.NUMBER },
            transformedData: { 
              type: Type.OBJECT,
              properties: {}, // Allow dynamic keys
              additionalProperties: true 
            },
            feedback: { type: Type.STRING },
            isSuccess: { type: Type.BOOLEAN }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as EvaluationResult;
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return {
      safetyScore: 0,
      utilityScore: 0,
      transformedData: {},
      feedback: "시스템 오류: AI 평가에 실패했습니다. API 키를 확인하거나 다시 시도해주세요.",
      isSuccess: false
    };
  }
};

export const generateQuizQuestion = async () => {
  try {
    const prompt = `
      Generate a 'O/X' quiz question related to Korean Personal Information Protection Act (개인정보보호법), pseudonymization (가명처리), or anonymization (익명처리).
      Include the question, the correct answer (O or X), and a brief explanation in Korean.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING, enum: ["O", "X"] },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Quiz Generation Error:", error);
    return {
      question: "개인정보보호법에 따라 가명정보는 본인의 동의 없이 통계 작성, 과학적 연구 목적으로 활용할 수 있다.",
      answer: "O",
      explanation: "기본값: 가명정보는 특례 조항에 따라 특정 목적 하에 동의 없이 처리가 가능합니다."
    };
  }
};

export const getReflectionFeedback = async (userText: string) => {
   try {
    const prompt = `
      The user wrote a reflection on "Privacy vs Utility in the Big Data Era".
      User text: "${userText}"
      
      Provide a constructive, encouraging response in Korean (max 200 characters) acting as a Senior Professor.
    `;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text;
   } catch (e) {
     return "훌륭한 생각입니다! 데이터 활용과 보호의 균형은 항상 중요한 숙제입니다.";
   }
};
