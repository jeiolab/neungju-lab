import { NextRequest, NextResponse } from 'next/server';
import { Type } from "@google/genai";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    const modelName = 'gemini-3-flash-preview';
    
    const prompt = `
      Create 10 multiple-choice questions about the Quick Sort algorithm and Divide & Conquer strategy for high school students.
      The output MUST be in Korean (한국어).
      
      Focus on:
      - Pivot selection importance
      - Partitioning logic
      - Time complexity (Best case O(n log n) vs Worst case O(n^2))
      - The recursive nature of the algorithm.
      
      Vary the difficulty: 3 Easy, 4 Medium, 3 Hard.
      Return the response as a JSON array.
    `;

    const response = await generateLlmContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
              explanation: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "difficulty"]
          }
        }
      }
    });

    if (response.text) {
      return NextResponse.json(JSON.parse(response.text));
    }
    
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
}
