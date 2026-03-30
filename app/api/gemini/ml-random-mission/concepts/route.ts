import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { tags } = await request.json();

    if (!tags || !Array.isArray(tags)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', concepts: [] },
        { status: 500 }
      );
    }
    const prompt = `Explain these ML concepts simply for a beginner in Korean: ${tags.join(", ")}.
    Return a JSON array of objects with keys: "title", "description" (max 100 chars), "example".
    Max 3 concepts.`;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const concepts = JSON.parse(response.text || "[]");
    return NextResponse.json({ concepts });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: 'Failed to generate concepts', concepts: [] },
      { status: 500 }
    );
  }
}
