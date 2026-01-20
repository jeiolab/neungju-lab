import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { algorithm, question, userAnswer } = await request.json();

    if (!algorithm || !question || !userAnswer) {
      return NextResponse.json(
        { error: 'Algorithm, question, and userAnswer are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 AI와 연결할 수 없습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      당신은 친절하고 전문적인 알고리즘 코치입니다.
      사용자가 '${algorithm}' 알고리즘에 대한 다음 질문에 답했습니다.
      
      질문: ${question}
      사용자 답변: "${userAnswer}"
      
      이 답변에 대해 3줄 이내로 피드백을 제공해주세요.
      1. 정답 여부 또는 답변의 논리적 타당성
      2. 보완할 점이나 칭찬할 점
      3. 격려의 말
      
      톤앤매너: 친절함, 교육적, 이모지 사용.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)"
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', text: 'AI 선생님이 잠시 생각에 잠겼어요. 다시 시도해주세요! (오류 발생)' },
      { status: 500 }
    );
  }
}
