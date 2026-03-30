import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { dateStr, type, topic } = await request.json();

    if (!dateStr || !type) {
      return NextResponse.json(
        { error: 'dateStr and type are required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key not found' },
        { status: 500 }
      );
    }
    let prompt = `You are an ML Learning Coach. Generate a unique daily micro-learning mission for date ${dateStr}.
  Mission Type: ${type}
  ${topic ? `Topic: ${topic}` : ''}
  Language: Korean (Hangul)
  
  Output MUST be JSON matching the following structure based on the type.
  
  Common fields: "title", "description", "explanation" (feedback), "conceptTags" (array of strings).
  Specific "content" and "correctAnswer" fields per type:
  
  1. OX_REASON:
     content: { question: string, options: ["O", "X"], reasonOptions: [string, string, string, string] }
     correctAnswer: { answer: "O" or "X", reasonIndex: number }
     
  2. CLASSIFICATION:
     content: { scenario: string, options: ["회귀 (Regression)", "분류 (Classification)", "군집화 (Clustering)"] }
     correctAnswer: number (index of correct option)
     
  3. PIPELINE_PUZZLE:
     content: { goal: string, steps: [string, string, string] (mixed order) }
     correctAnswer: [number, number, number] (indices representing the correct order of the provided steps)
     
  4. DATA_ISSUE:
     content: { scenario: string, issueOptions: [string, string, string, string] }
     correctAnswer: number (index of correct issue)
  `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || "{}";
    const json = JSON.parse(text);
    
    return NextResponse.json({
      id: dateStr,
      type,
      ...json
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate mission', text: '미션을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}
