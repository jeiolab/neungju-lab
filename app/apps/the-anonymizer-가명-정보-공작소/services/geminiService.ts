'use client';

import { Mission, PipelineStep, Tool, EvaluationResult } from "../types";

export const evaluatePipeline = async (
  mission: Mission,
  pipeline: PipelineStep[],
  tools: Tool[]
): Promise<EvaluationResult> => {
  try {
    const response = await fetch('/api/gemini/anonymizer/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mission, pipeline, tools }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        safetyScore: 0,
        utilityScore: 0,
        transformedData: {},
        feedback: errorData.feedback || "시스템 오류: AI 평가에 실패했습니다. API 키를 확인하거나 다시 시도해주세요.",
        isSuccess: false
      };
    }

    const data = await response.json();
    return data as EvaluationResult;
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
    const response = await fetch('/api/gemini/anonymizer/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
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
    const response = await fetch('/api/gemini/anonymizer/reflection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userText }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return errorData.text || "훌륭한 생각입니다! 데이터 활용과 보호의 균형은 항상 중요한 숙제입니다.";
    }

    const data = await response.json();
    return data.text;
   } catch (e) {
     return "훌륭한 생각입니다! 데이터 활용과 보호의 균형은 항상 중요한 숙제입니다.";
   }
};
