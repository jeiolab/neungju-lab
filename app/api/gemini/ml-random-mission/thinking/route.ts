import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { promptText, userAnswer } = await request.json();

    if (!promptText || typeof promptText !== 'string' || !userAnswer || typeof userAnswer !== 'string') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '좋은 시도입니다! 계속 학습해보세요.' },
        { status: 500 }
      );
    }
    const prompt = `
    Context: ML Learning App.
    Problem: ${promptText}
    User Answer: ${userAnswer}
    
    Provide a concise, encouraging feedback (in Korean, max 3 sentences) evaluating the user's answer. 
    Point out one good thing and one thing to consider.`;
    
    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return NextResponse.json({
      text: response.text || "좋은 시도입니다! 계속 학습해보세요."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to evaluate thinking', text: '좋은 시도입니다! 계속 학습해보세요.' },
      { status: 500 }
    );
  }
}
