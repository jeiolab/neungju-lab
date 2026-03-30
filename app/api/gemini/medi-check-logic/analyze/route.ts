import { NextRequest, NextResponse } from 'next/server';
import { generateLlmContent, getServerLlmApiKey } from "@/lib/ai-gateway";

export async function POST(request: NextRequest) {
  try {
    const { logic, failedResults } = await request.json();

    if (!logic || !Array.isArray(logic) || !failedResults || !Array.isArray(failedResults)) {
      return NextResponse.json(
        { error: 'Invalid parameters' },
        { status: 400 }
      );
    }

    const apiKey = getServerLlmApiKey();
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured', text: 'API 키가 설정되지 않아 상세 AI 분석을 제공할 수 없습니다.' },
        { status: 500 }
      );
    }

    if (failedResults.length === 0) {
      return NextResponse.json({
        text: "모든 환자를 정확하게 진단했습니다! 훌륭한 논리 구조입니다."
      });
    }
    const logicStr = logic
      .map((b: any, i: number) => `${i + 1}. 만약 ${b.variable} ${b.operator} ${b.value} 이면 -> ${b.result}`)
      .join('\n');

    const errorStr = failedResults.slice(0, 3)
      .map((r: any) => `환자(${r.patientName}): ${JSON.stringify(r.inputs)} -> 내 로직 판정: ${r.userDiagnosis}, 정답: ${r.correctDiagnosis}`)
      .join('\n');

    const prompt = `
      당신은 의료 AI 코딩 교육 강사입니다. 학생이 작성한 '혈압 판정 로직(if-elif-else)'에 오류가 있어 오진단이 발생했습니다.
      
      [학생의 로직]
      ${logicStr}
      (마지막은 그 외(else) -> 정상 으로 처리됨)

      [오진단 사례]
      ${errorStr}

      [요청사항]
      학생에게 왜 이런 오류가 발생했는지 논리적 순서(Flow)나 조건 설정의 관점에서 3문장 이내로 친절하게 설명해주세요. 
      특히 "위험(고혈압)" 조건을 "주의(전단계)" 조건보다 먼저 검사해야 하는 이유 등을 예시로 들어 설명하면 좋습니다.
      정답 코드를 직접 주지 말고, 힌트를 주세요.
    `;

    const response = await generateLlmContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return NextResponse.json({
      text: response.text || "분석 결과를 생성하지 못했습니다."
    });
  } catch (error) {
    console.error("Gemini API Error (Medi-Check Logic):", error);
    return NextResponse.json(
      { error: 'Failed to analyze', text: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
      { status: 500 }
    );
  }
}
