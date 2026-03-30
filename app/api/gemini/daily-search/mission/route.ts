import { NextRequest, NextResponse } from 'next/server';
import { Type } from "@google/genai";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { dateStr } = await request.json();

    if (!dateStr) {
      return NextResponse.json(
        { error: 'Date string is required' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const modelId = "gemini-3-flash-preview";
    
    const response = await generateLlmContent({
      model: modelId,
      contents: `Generate a daily search algorithm mission based on date: ${dateStr}.
      
      IMPORTANT: All text content (title, description, quizQuestion, quizAnswer, theoryContent) MUST BE IN KOREAN.
      
      Requirements:
      1. Scenario should be a real-world analogy (e.g., Finding a name in a phonebook, finding a card in a shuffled deck).
      2. If the scenario implies sorted data, optimalAlgorithm is 'binary'. If unsorted, 'linear'.
      3. Create 5-8 short string items for the dataset (use Korean words if appropriate for the scenario).
      4. Provide pseudo-code blocks for the optimal algorithm that need to be arranged.
      5. Provide a short theory explanation and a quiz question in Korean.
      
      Return strictly JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            datasetType: { type: Type.STRING, enum: ['sorted', 'unsorted'] },
            targetItem: { type: Type.STRING },
            dataset: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimalAlgorithm: { type: Type.STRING, enum: ['linear', 'binary'] },
            codeBlocks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  order: { type: Type.NUMBER }
                }
              }
            },
            quizQuestion: { type: Type.STRING },
            quizAnswer: { type: Type.STRING },
            theoryContent: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return NextResponse.json({
        ...data,
        date: dateStr,
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to generate mission' },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate mission' },
      { status: 500 }
    );
  }
}
