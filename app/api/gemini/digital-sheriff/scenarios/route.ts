import { NextRequest, NextResponse } from "next/server";
import { Type } from "@google/genai";
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

// Fallback scenarios in case API fails or limit reached
const FALLBACK_SCENARIOS = [
  {
    id: 'f1',
    title: '공용 Wi-Fi 접속',
    description: '카페의 "Free_Coffee" 와이파이가 비밀번호 없이 열려있습니다. 접속해서 은행 앱을 실행할까요?',
    isSafe: false,
    reasoning: '공용 와이파이는 해커가 데이터를 가로챌 수 있는 중간자 공격(MITM)에 취약합니다.',
    consequence: '계좌 비밀번호가 유출되어 예금이 인출되었습니다!'
  },
  {
    id: 'f2',
    title: 'OS 업데이트 알림',
    description: '스마트폰 운영체제 보안 업데이트 알림이 떴습니다. 지금 설치할까요?',
    isSafe: true,
    reasoning: '보안 업데이트는 알려진 취약점을 수정하므로 즉시 설치하는 것이 가장 안전합니다.',
    consequence: '업데이트를 미루는 사이 제로데이 취약점을 통한 공격을 받았습니다.'
  },
  {
    id: 'f3',
    title: '알 수 없는 첨부파일',
    description: '모르는 사람이 보낸 "택배 배송 조회.zip" 메일이 도착했습니다. 열어볼까요?',
    isSafe: false,
    reasoning: '출처가 불분명한 압축 파일은 랜섬웨어나 악성코드일 확률이 매우 높습니다.',
    consequence: '랜섬웨어에 감염되어 컴퓨터의 모든 파일이 암호화되었습니다.'
  },
];

export async function POST(request: NextRequest) {
  let action: string | undefined;
  let scenario: any;
  
  try {
    const body = await request.json();
    action = body.action;
    scenario = body.scenario;

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      if (action === 'scenarios') {
        return NextResponse.json({ scenarios: FALLBACK_SCENARIOS });
      }
      if (action === 'news') {
        return NextResponse.json({
          headline: "보안 사고 발생!",
          content: `사용자의 부주의한 행동으로 인해 심각한 개인정보 유출 피해가 발생했습니다. (${scenario?.title || '알 수 없음'})`,
          severity: "high"
        });
      }
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }
    if (action === 'scenarios') {
      const response = await generateLlmContent({
        model: "gemini-3-flash-preview",
        contents: `한국 고등학생·중학생이 겪을 법한 디지털 보안 상황 5개를 만들어 주세요.

규칙:
- title, description, reasoning, consequence 필드는 반드시 자연스러운 한국어로만 작성하세요. 영어 문장을 쓰지 마세요.
- id는 SCEN-001 형식의 고유 문자열로 하세요.
- 안전한 선택이 맞는 경우(isSafe: true)와 차단·거절이 맞는 경우(isSafe: false)를 섞으세요.
- 예: 2단계 인증, OS 업데이트, 공식 앱 스토어 등은 안전 쪽으로, 피싱 링크·비밀번호 공유·출처 불명 첨부파일 등은 위험 쪽으로 다루세요.

JSON 배열만 반환하세요.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                isSafe: { type: Type.BOOLEAN },
                reasoning: { type: Type.STRING },
                consequence: { type: Type.STRING },
              },
              required: ["id", "title", "description", "isSafe", "reasoning", "consequence"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      return NextResponse.json({ 
        scenarios: data.length > 0 ? data : FALLBACK_SCENARIOS 
      });
    }

    if (action === 'news' && scenario) {
      const response = await generateLlmContent({
        model: "gemini-3-flash-preview",
        contents: `다음은 잘못된 보안 판단의 결과입니다: "${scenario.consequence}"

이에 맞춰 짧고 극적인 속보 느낌의 headline과, 한 문장짜리 본문 content를 작성하세요.
headline과 content는 반드시 한국어로만 작성하세요. 영어를 사용하지 마세요.
심각도(severity)는 low, medium, high, critical 중 하나로 정하세요.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              content: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["low", "medium", "high", "critical"] },
            }
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (action === 'scenarios') {
      return NextResponse.json({ scenarios: FALLBACK_SCENARIOS });
    }
    if (action === 'news' && scenario) {
      return NextResponse.json({
        headline: "보안 사고 발생!",
        content: `사용자의 부주의한 행동으로 인해 심각한 개인정보 유출 피해가 발생했습니다. (${scenario?.title || '알 수 없음'})`,
        severity: "high"
      });
    }
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
