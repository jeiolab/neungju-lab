import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { packageCount, isSorted, searchCount, accumulatedTime } = await request.json();

    if (packageCount === undefined || isSorted === undefined || searchCount === undefined || accumulatedTime === undefined) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API Key is missing.' },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      당신은 물류 센터 수석 컨설턴트입니다. 아래 시뮬레이션 데이터를 바탕으로 관리자(사용자)에게 짧고 전문적인 주간 리포트를 작성해주세요.
      
      [데이터]
      - 총 택배 수량: ${packageCount}개
      - 최종 상태: ${isSorted ? '정렬됨 (비용 지불함)' : '정렬 안 됨 (순차 탐색)'}
      - 총 검색 횟수: ${searchCount}회
      - 총 소요 시간 비용: ${accumulatedTime}ms
      
      [가이드라인]
      1. 효율성 평가: 현재 검색 횟수에서 올바른 전략(정렬 vs 비정렬)을 선택했는지 분석하세요. (분기점: 약 50회 검색)
      2. 조언: 앞으로 검색이 더 늘어날 경우 혹은 줄어들 경우 어떻게 해야 할지 조언하세요.
      3. 어조: 정중하지만 핵심을 찌르는 비즈니스 톤. 한국어로 작성.
      4. 길이: 3문장 내외로 요약.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "리포트 생성 중 오류가 발생했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Algorithm Delivery Service Report):", error);
    return NextResponse.json(
      { error: 'Failed to generate report', text: '리포트 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
