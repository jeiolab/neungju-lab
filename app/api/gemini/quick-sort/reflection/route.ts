import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { userAnswer } = await request.json();

    if (!userAnswer) {
      return NextResponse.json(
        { error: 'User answer is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '피드백을 생성할 수 없습니다.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-3-flash-preview';
    
    const prompt = `
      The user is a high school student learning Quick Sort.
      The discussion question is: "If we were to Quick Sort our class by height, who should be the pivot to make it most efficient, and why?"
      
      User's Answer: "${userAnswer}"
      
      Provide a friendly, encouraging, and educational feedback in Korean (한국어). Max 3 sentences.
      If they mentioned choosing a 'median' or 'average' height person, praise them heavily. 
      If they chose shortest/tallest, explain why that leads to O(n^2) behavior in a simple way.
    `;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "피드백을 생성할 수 없습니다."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to evaluate reflection', text: '지금은 피드백을 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
}
