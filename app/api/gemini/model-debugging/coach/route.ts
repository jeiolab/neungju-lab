import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { state, result } = await request.json();

    if (!state || !result) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'AI 코치가 연결되지 않았지만, 차트를 보고 훈련 점수와 테스트 점수의 균형을 맞춰보세요!' },
        { status: 500 }
      );
    }
    const prompt = `
      Role: You are a friendly, encouraging AI tutor for a high school student learning Machine Learning.
      Context: The student is using a "Model Debugging Wizard" to adjust a Supervised Learning model.
      
      Current Configuration:
      - Problem: ${state.problemType}
      - Data Size: ${state.dataSize}
      - Noise Level: ${state.noiseLevel}
      - Model Complexity (Tree Depth): ${state.modelComplexity}/10
      
      Simulation Results:
      - Training Score: ${(result.trainScore * 100).toFixed(1)}%
      - Test Score: ${(result.testScore * 100).toFixed(1)}%
      - Status: ${result.status}
      
      Task: Provide a short, 2-sentence feedback in KOREAN. 
      1. Explain WHY this is happening (e.g., "데이터에 비해 트리가 너무 깊습니다").
      2. Suggest a fix (e.g., "복잡도를 낮추거나 데이터를 더 모으세요").
      Keep it simple and educational. Speak in a polite and helpful tone (korean honorifics).
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.7,
      }
    });

    const text = response.text || "코치가 생각 중입니다... 설정을 조절해보세요!";
    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to get AI coach feedback', text: 'AI 코치가 연결되지 않았지만, 차트를 보고 훈련 점수와 테스트 점수의 균형을 맞춰보세요!' },
      { status: 500 }
    );
  }
}
