import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { mission, pipeline, tools } = await request.json();

    if (!mission || !tools) {
      return NextResponse.json(
        { error: 'Invalid request', feedback: '요청 데이터가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', feedback: 'API 키가 설정되어 있지 않습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const pipelineDescription = (pipeline || []).map((step: any) => {
      const fieldName = mission.data.find((d: any) => d.id === step.fieldId)?.name || step.fieldId;
      const toolName = tools.find((t: any) => t.id === step.toolId)?.name || step.toolId;
      return `${fieldName} -> ${toolName}`;
    }).join(", ");

    const dataSnapshot = JSON.stringify(
      mission.data.reduce((acc: Record<string, string>, curr: any) => ({ ...acc, [curr.name]: curr.value }), {})
    );

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
      model: 'gemini-3-flash-preview',
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
              properties: {},
              additionalProperties: true 
            },
            feedback: { type: Type.STRING },
            isSuccess: { type: Type.BOOLEAN }
          }
        }
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response', feedback: 'AI 응답이 없습니다.' },
        { status: 500 }
      );
    }

    const result = JSON.parse(response.text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Gemini Evaluation Error:", error);
    return NextResponse.json(
      {
        safetyScore: 0,
        utilityScore: 0,
        transformedData: {},
        feedback: "시스템 오류: AI 평가에 실패했습니다. API 키를 확인하거나 다시 시도해주세요.",
        isSuccess: false
      },
      { status: 500 }
    );
  }
}
