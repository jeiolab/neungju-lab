import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', news: [] },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Search for the latest cybersecurity news headlines from the last 24-48 hours (or very recent). Return 3 key news items in Korean. Include the source URL if available in the JSON.',
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              summary: { type: Type.STRING },
              date: { type: Type.STRING },
              impactLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
              url: { type: Type.STRING },
            },
            required: ['headline', 'summary', 'date', 'impactLevel'],
          },
        },
      },
    });

    if (response.text) {
      const news = JSON.parse(response.text);
      return NextResponse.json({ news });
    }
    
    return NextResponse.json({ news: [] });
  } catch (error) {
    console.error("Gemini API Error (News):", error);
    return NextResponse.json({
      news: [
        {
          headline: "시뮬레이션 모드: API 연결 불가",
          summary: "실시간 데이터를 가져올 수 없습니다. 인터넷 연결이나 API 키를 확인해주세요.",
          date: new Date().toISOString().split('T')[0],
          impactLevel: 'Low'
        }
      ]
    });
  }
}
