import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { week, stats, historySummary } = await request.json();

    if (!week || !stats) {
      return NextResponse.json(
        { error: 'Invalid request' },
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
      You are a game engine for a startup simulation "Security vs Growth".
      Current Week: ${week}/10.
      Stats: Security ${stats.security}, Users ${stats.users}, Budget ${stats.budget}, Happiness ${stats.happiness}.
      Recent History: ${historySummary || ''}.

      Generate a dilemma scenario in KOREAN that forces a trade-off between Security, Growth (Users), Budget, and Happiness.
      The scenario should be relevant to a tech startup (e.g., cloud config, phishing, investor pressure, GDPR, new feature rush).
      
      Ensure all text fields (title, description, choices text, feedback) are in Korean.
      
      Return valid JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['dilemma'] },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  effect: {
                    type: Type.OBJECT,
                    properties: {
                      security: { type: Type.INTEGER },
                      users: { type: Type.INTEGER },
                      budget: { type: Type.INTEGER },
                      happiness: { type: Type.INTEGER }
                    }
                  }
                },
                required: ['id', 'text', 'feedback', 'effect']
              }
            }
          },
          required: ['id', 'title', 'description', 'choices']
        }
      }
    });

    if (response.text) {
      const scenario = JSON.parse(response.text);
      return NextResponse.json({ scenario });
    }

    return NextResponse.json({ scenario: null });
  } catch (error) {
    console.error("Gemini API Error (Scenario):", error);
    return NextResponse.json(
      { error: 'Failed to generate scenario', scenario: null },
      { status: 500 }
    );
  }
}
