import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { questionType, userAnswer } = await request.json();

    if (!questionType || !userAnswer) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', feedback: "API 키가 없어 피드백을 생성할 수 없습니다. (정렬 조건과 데이터 특성을 다시 생각해보세요!)" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
      You are a Computer Science teacher for high schoolers.
      The student answered a reflection question about Binary Search.
      
      Question Type: ${questionType}
      Student Answer: "${userAnswer}"
      
      Provide a brief, encouraging, and corrective feedback (max 2 sentences) in Korean.
      Focus on concepts: Sorting requirement, Time Complexity (O(log n) vs O(n)), Data structure fit.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });

    return NextResponse.json({
      feedback: response.text || "피드백 생성 중 오류가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Binary Search Game Feedback):", error);
    return NextResponse.json(
      { error: 'Failed to generate feedback', feedback: "피드백 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
