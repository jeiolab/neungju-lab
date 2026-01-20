import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { config, score } = await request.json();

    if (!config || score === undefined) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', feedback: "API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      당신은 학교 축제 운영 AI 설계 코치입니다.
      사용자가 설정한 AI 에이전트 값:
      - 자율성(Autonomy): ${config.autonomy}/100
      - 협력성(Cooperation): ${config.cooperation}/100
      - 목표(Goal): ${config.goal}
      
      계산된 운영 점수: ${score}점.

      이 점수가 나온 이유를 지능 에이전트 이론(자율성, 협력성, 목표지향성)에 근거하여 3줄로 피드백해주세요.
      형식:
      1. 분석: [특성과 목표의 연결성 설명]
      2. 개선: [점수를 높이기 위한 조언]
      3. 제안: [다음 실험을 위한 질문 또는 아이디어]
      
      톤앤매너: 친절하고 격려하는 선생님 어조. 한국어로 작성.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      feedback: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Festival AI Simulation Feedback):", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', feedback: "AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
