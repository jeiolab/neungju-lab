import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { category, difficulty } = await request.json();

    if (!category || !difficulty) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', scenario: null },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      Create a single scenario for a high school student to judge if "Binary Search" is possible.
      
      Context:
      - Category: ${category} (School Life, Daily Life, or Career/System)
      - Difficulty: ${difficulty}
      - Concepts: Sorted vs Unsorted Arrays, Dynamic Data (frequent inserts), Search Efficiency.
      
      Output Rules:
      - JSON format only.
      - "correctAnswer" must be one of: "POSSIBLE", "IMPOSSIBLE", "CONDITIONAL".
      - "POSSIBLE": Data is static and sorted.
      - "IMPOSSIBLE": Data is unsorted and sorting is too expensive or impossible/illogical, or data is small enough for linear.
      - "CONDITIONAL": Data is unsorted currently, but sorting is a viable option before searching.
      - Language: Korean.

      JSON Schema:
      {
        "description": "Scenario description string (1-2 sentences)",
        "dataState": "SORTED" | "UNSORTED" | "DYNAMIC",
        "correctAnswer": "POSSIBLE" | "IMPOSSIBLE" | "CONDITIONAL",
        "explanation": "Why correct (1 sentence)",
        "target": "EXISTENCE"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      return NextResponse.json(
        { error: 'No response text', scenario: null },
        { status: 500 }
      );
    }

    // Remove code blocks if present
    const cleanText = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanText);

    const scenario = {
      id: Date.now().toString(),
      category: category,
      difficulty,
      target: 'EXISTENCE',
      ...data
    };

    return NextResponse.json({ scenario });
  } catch (error) {
    console.error("Gemini API Error (Binary Search Game Scenario):", error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', scenario: null },
      { status: 500 }
    );
  }
}
