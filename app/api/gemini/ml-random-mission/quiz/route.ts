import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { difficulty, weakTags } = await request.json();

    if (!difficulty || typeof difficulty !== 'string') {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', questions: [] },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const focus = weakTags && weakTags.length > 0 ? `Focus specifically on these weak topics: ${weakTags.join(', ')}` : "General ML topics";
    
    const prompt = `Generate 10 Machine Learning quiz questions in Korean.
    Difficulty: ${difficulty}
    ${focus}
    
    Return a JSON array of objects:
    {
      "id": string (unique),
      "question": string,
      "options": string[] (4 choices),
      "correctIndex": number (0-3),
      "explanation": string,
      "tag": string (topic category),
      "difficulty": "${difficulty}"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const questions = JSON.parse(response.text || "[]");
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate quiz', questions: [] },
      { status: 500 }
    );
  }
}
