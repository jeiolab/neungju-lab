import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { algo, arrayState, sortedIndices } = await request.json();

    if (!algo || !Array.isArray(arrayState) || !Array.isArray(sortedIndices)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: '정렬된 부분을 주의 깊게 살펴보세요.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: modelName,
      contents: `I am looking at a sorting visualization for ${algo}. 
      The array currently looks like: [${arrayState.join(', ')}]. 
      Indices marked as sorted: [${sortedIndices.join(', ')}].
      Give me a subtle detective hint about what characteristic feature of ${algo} is visible right now.
      Respond in Korean. Do not name the algorithm directly. Max 1 sentence.`,
    });
    
    return NextResponse.json({
      text: response.text || "정렬된 부분을 주의 깊게 살펴보세요."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate hint', text: '이미 정렬된 원소가 무엇인지 자세히 보세요.' },
      { status: 500 }
    );
  }
}
